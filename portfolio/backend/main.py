from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import cv2
import mediapipe as mp
import pyautogui
import math
import threading

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(max_num_hands=1, min_detection_confidence=0.7)
mp_draw = mp.solutions.drawing_utils

tracking_active = False
cap = None
screen_width, screen_height = pyautogui.size()
pyautogui.FAILSAFE = False

def distance(p1, p2):
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def camera_loop():
    global tracking_active, cap    
    while tracking_active:
        ret, frame = cap.read()
        if not ret:
            break
        
        frame = cv2.flip(frame, 1)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = hands.process(rgb)
        
        if result.multi_hand_landmarks:
            landmarks = result.multi_hand_landmarks[0].landmark
            
            index_tip = (landmarks[8].x * screen_width, landmarks[8].y * screen_height)
            thumb_tip = (landmarks[4].x * screen_width, landmarks[4].y * screen_height)
            middle_tip = (landmarks[12].x * screen_width, landmarks[12].y * screen_height)
            
            pyautogui.moveTo(index_tip[0], index_tip[1])
            
            thumb_index_dist = distance(thumb_tip, index_tip)
            print(thumb_index_dist)
            if thumb_index_dist < 40:
                pyautogui.click()
                print("Click!")
            
            index_middle_dist = distance(index_tip, middle_tip)
            
            if index_middle_dist < 60: 
                index_tip_y = landmarks[8].y
                index_knuckle_y = landmarks[6].y 
                middle_tip_y = landmarks[12].y
                middle_knuckle_y = landmarks[10].y  
                
                if index_tip_y < index_knuckle_y and middle_tip_y < middle_knuckle_y:
                    pyautogui.scroll(150)
                    cv2.putText(frame, "SCROLL UP", (10, 120), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                
                elif index_tip_y > index_knuckle_y and middle_tip_y > middle_knuckle_y:
                    pyautogui.scroll(-150)
                    cv2.putText(frame, "SCROLL DOWN", (10, 120), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            
            cv2.putText(frame, f"Click: {thumb_index_dist:.0f}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)
            cv2.putText(frame, f"Scroll: {index_middle_dist:.0f}", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)
            
            mp_draw.draw_landmarks(frame, result.multi_hand_landmarks[0], mp_hands.HAND_CONNECTIONS)
        
        cv2.putText(frame, "HAND MOUSE ACTIVE", (10, 150), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        
        cv2.imshow("Hand Mouse", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()

@app.get("/start-mouse")
def start_mouse():
    global tracking_active, cap
    
    if tracking_active:
        return {"status": "already running"}
    
    cap = cv2.VideoCapture(0)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    
    if not cap.isOpened():
        return {"status": "failed to open camera"}
    
    tracking_active = True
    thread = threading.Thread(target=camera_loop)
    thread.daemon = True
    thread.start()
    
    return {"status": "hand mouse started"}

@app.get("/stop-mouse")
def stop_mouse():
    global tracking_active
    tracking_active = False
    return {"status": "hand mouse stopped"}

if __name__ == "__main__":
    print("Server ready. Call /start-mouse to begin hand tracking.")
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)