/**
 * One place that knows how to talk to the FastAPI assistant.
 *
 * The backend answers POST /nlp/ask with { text, section } and reports
 * failures as HTTP 200 + { error }, so both of those have to be handled here
 * rather than in each caller.
 */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://ai-interactive-portfolio-back-end.vercel.app";

export type AssistantReply = {
  /** The answer to show. Always a non-empty string. */
  text: string;
  /** The section of the portfolio the backend matched, when it reports one. */
  section?: string;
};

const GENERIC_FAILURE = "The assistant is unavailable right now. Please try again in a moment.";

export async function askAssistant(question: string, signal?: AbortSignal): Promise<AssistantReply> {
  let payload: { text?: string; section?: string; error?: string };

  try {
    const response = await fetch(`${API_URL}/nlp/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
      signal,
    });

    if (!response.ok) {
      return { text: `The assistant returned an error (${response.status}). Please try again.` };
    }

    payload = await response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    return { text: GENERIC_FAILURE };
  }

  if (payload.error) return { text: payload.error };
  if (!payload.text) return { text: "I couldn't find an answer for that. Try asking about my projects, skills or experience." };

  return { text: payload.text, section: payload.section };
}
