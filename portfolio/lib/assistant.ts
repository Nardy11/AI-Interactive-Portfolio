/**
 * Frontend assistant client.
 *
 * The portfolio now owns the NLP endpoint at /api/nlp/ask so the chat does
 * not depend on a separately deployed Python service being alive.
 */
export const API_URL = "/api";

export type AssistantReply = {
  text: string;
  section?: string;
};

const GENERIC_FAILURE =
  "The assistant is unavailable right now. Please try again in a moment.";

export async function askAssistant(
  question: string,
  signal?: AbortSignal,
): Promise<AssistantReply> {
  try {
    const response = await fetch(`${API_URL}/nlp/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
      cache: "no-store",
      signal,
    });

    const payload = (await response.json().catch(() => null)) as
      | { text?: string; section?: string; error?: string }
      | null;

    if (!response.ok) {
      return {
        text:
          payload?.error ||
          `The assistant returned an error (${response.status}). Please try again.`,
      };
    }

    if (payload?.error) return { text: payload.error };
    if (!payload?.text) {
      return {
        text:
          "I couldn't find an answer for that. Try asking about my projects, skills or experience.",
      };
    }

    return { text: payload.text, section: payload.section };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }

    console.error("Assistant request failed:", error);
    return { text: GENERIC_FAILURE };
  }
}
