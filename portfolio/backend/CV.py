from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import cv2
import mediapipe as mp
import numpy as np
import json
import base64
import math
import time
from typing import List

cv_app = FastAPI()

cv_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Globals ---
last_scroll_time = 0
scroll_cooldown = 0.2  
scroll_buffer = []     
buffer_size = 5        

last_click_time = 0
click_cooldown = 0.25 

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    model_complexity=1,
    min_detection_confidence=0.6,
    min_tracking_confidence=0.6
)

def distance(p1, p2):
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except:
            pass

manager = ConnectionManager()

# --- Cursor smoothing ---
prev_x, prev_y = None, None   # ✅ start as None (reset when new hand enters)
alpha = 0.7                   # smoothing factor

@cv_app.websocket("/hand-tracking")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    global prev_x, prev_y, last_click_time, last_scroll_time

    screen_width, screen_height = 1920, 1080

    try:
        while True:
            message = await websocket.receive_text()
            try:
                data = json.loads(message)

                if data.get("type") == "screen_size":
                    screen_width, screen_height = data["width"], data["height"]
                    continue

                if data.get("type") == "frame":
                    image_data = base64.b64decode(data["image"].split(",")[1])
                    nparr = np.frombuffer(image_data, np.uint8)
                    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

                    if frame is not None:
                        frame = cv2.flip(frame, 1)
                        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                        result = hands.process(rgb)

                        hand_data = {
                            "cursor_x": prev_x if prev_x is not None else 0.5,
                            "cursor_y": prev_y if prev_y is not None else 0.5,
                            "click": False,
                            "scroll": 0,
                            "hand_detected": False,
                            "debug_info": {}
                        }

                        if result.multi_hand_landmarks:
                            hand_data["hand_detected"] = True
                            landmarks = result.multi_hand_landmarks[0].landmark

                            index_tip = (landmarks[8].x * screen_width, landmarks[8].y * screen_height)
                            thumb_tip = (landmarks[4].x * screen_width, landmarks[4].y * screen_height)
                            middle_tip = (landmarks[12].x * screen_width, landmarks[12].y * screen_height)

                            # ✅ Reset prev_x/prev_y when None (so it starts from finger location)
                            if prev_x is None or prev_y is None:
                                prev_x, prev_y = landmarks[8].x, landmarks[8].y

                            cursor_x = alpha * prev_x + (1 - alpha) * landmarks[8].x
                            cursor_y = alpha * prev_y + (1 - alpha) * landmarks[8].y
                            prev_x, prev_y = cursor_x, cursor_y

                            hand_data["cursor_x"] = cursor_x
                            hand_data["cursor_y"] = cursor_y

                            # --- Click detection with debounce ---
                            thumb_index_dist = distance(thumb_tip, index_tip)
                            now = time.time()
                            if thumb_index_dist < 40 and (now - last_click_time) > click_cooldown:
                                hand_data["click"] = True
                                last_click_time = now

                            # --- Scroll detection ---
                            index_middle_dist = distance(index_tip, middle_tip)
                            if index_middle_dist < 60:
                                index_tip_y = landmarks[8].y
                                index_knuckle_y = landmarks[6].y
                                middle_tip_y = landmarks[12].y
                                middle_knuckle_y = landmarks[10].y

                                direction = 0
                                if index_tip_y < index_knuckle_y and middle_tip_y < middle_knuckle_y:
                                    direction = 1
                                elif index_tip_y > index_knuckle_y and middle_tip_y > middle_knuckle_y:
                                    direction = -1

                                if direction != 0:
                                    scroll_buffer.append(direction)
                                    if len(scroll_buffer) > buffer_size:
                                        scroll_buffer.pop(0)

                                    avg_dir = round(sum(scroll_buffer) / len(scroll_buffer))
                                    if avg_dir != 0 and (now - last_scroll_time) > scroll_cooldown:
                                        hand_data["scroll"] = avg_dir
                                        last_scroll_time = now
                            else:
                                scroll_buffer.clear()

                        await manager.send_personal_message(json.dumps(hand_data), websocket)

            except json.JSONDecodeError:
                continue
            except Exception as e:
                print(f"Error processing frame: {e}")
                continue

    except WebSocketDisconnect:
        # ✅ Reset globals when connection closes (camera stops)
        manager.disconnect(websocket)
        prev_x, prev_y = None, None
        scroll_buffer.clear()
        print("🔴 Client disconnected, camera session ended.")
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)
        prev_x, prev_y = None, None
        scroll_buffer.clear()

@cv_app.get("/")
async def root():
    return {"message": "Hand Tracking Virtual Mouse API - Optimized ✅"}
