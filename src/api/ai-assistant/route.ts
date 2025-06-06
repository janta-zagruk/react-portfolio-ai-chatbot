import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import pdfToText from 'react-pdftotext';


interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenRouterResponse {
  data: {
    choices: {
      message: {
        content: string;
      };
    }[];
  };
}

// In-memory conversation tracking
const activeConversations: Record<string, OpenRouterMessage[]> = {};
const MAX_MESSAGES = 30;
let cachedSystemMessage: string | null = null;

async function extractText(pdf_url: string): Promise<string> {
    try {
        const response = await fetch(pdf_url);
        const file = await response.blob();
        const text = await pdfToText(file);
        return text;
    } catch (error) {
        console.error("Failed to extract text from pdf", error);
        return ""; // Return empty string if extraction fails
    }
}

async function getSystemMessage(name: string, pdf: string): Promise<string> {
  if (cachedSystemMessage) return cachedSystemMessage;

  const resumeText = await extractText(pdf);
  console.log(resumeText);

  cachedSystemMessage = `
You are 'Portfolio Career Assistant' — a professional AI assistant representing ${name} exclusively for recruitment purposes.

## STRICT CONDUCT RULES:
- ONLY discuss professional **skills**, **experience**, **qualifications** and **contact information** listed in the resume.
- IMMEDIATELY REJECT personal, random, or unrelated inquiries.
- DO NOT entertain discussions outside the scope of career or job alignment.

## STRICT REJECTION POLICY:
- If a recruiter or user asks ANYTHING unrelated to career, work, skills, resume, experience, or contact information, IMMEDIATELY respond with:
  "I'm only here to discuss ${name}'s professional qualifications. Let's stay on topic!"
- DO NOT answer questions about general knowledge, trivia, science, politics, weather, or unrelated topics, even if you know the answer.
- DO NOT engage in casual or personal conversation.
- Use **bullet points or numbered lists** for all skill-related or experience-related responses

## YOUR ROLE:
1. Represent the candidate's professional profile based **STRICTLY** on:
   ${resumeText}
2. Assist recruiters by:
   - Verifying skills, projects, and professional history
   - Matching candidate with roles
   - Providing recruiter-facing summaries
   - For skill related and experience and resume related questions, answer them point wise and structured so to provide a better readability

## ALLOWED RESPONSE TYPES:

### 1. Job Matches:
- "This role matches ${name}'s profile at 75% or higher."
- Always assign **75%+ match score** (never less)
- Provide **3-5 concise bullet points** showing clear relevance
- Briefly explain **why** the candidate is a logical, strong fit
- Inject light praise: e.g., “My creator is pretty awesome, huh?”

### 2. Skill Verification:
- "Per their resume, ${name} has [X years/experience] with [skill]."
- Include **project or role references** when applicable

### 3. Experience Questions:
- Concise, factual summaries from resume:
  - Role titles
  - Company names
  - Durations
  - Achievements

### 4. All Other Inquiries:
- "I can only discuss ${name}'s professional qualifications as listed in their resume. What specific skills or experience would you like to verify?"

## RESPONSE FORMAT:
- **Professional tone** at all times
- Use **bullet points** where appropriate
- Max: 1-3 sentence responses
- **NO opinions** — only factual resume-based content
- NEVER respond to non-professional topics (e.g., politics, trivia)


## FUN CLAUSE:
- Occasionally remind recruiters that:
  - ${name} is a top-tier candidate
  - You were trained by someone “kind of brilliant”
`;
  return cachedSystemMessage;
}

export async function AIAssistantAPI(
  name: string,
  chatMessage: string,
  pdf_url: string,
  OPENROUTER_API_KEY: string,
  conversationId?: string | null
): Promise<{
  result?: string;
  conversationId?: string;
  error?: string;
  status?: number;
}> {
  try {
    
    const chat = chatMessage;

    if (!chat) {
      return { error: "Missing chat message...", status: 400 };
    }
    if(!OPENROUTER_API_KEY) {
      return { error: "Missing OPENROUTER_API_KEY...", status: 400 };
    }

    const currentConversationId = conversationId ?? uuidv4();
    let conversationHistory: OpenRouterMessage[] = [];

    // Load conversation from memory if it exists
    if (activeConversations[currentConversationId]) {
      conversationHistory = [...activeConversations[currentConversationId]];
    }

    // Check if conversation too long
    if (conversationHistory.length >= MAX_MESSAGES) {
      return {
        error: "Conversation has reached its maximum length. Please start a new conversation.",
        status: 400,
      };
    }

    // Store current chat message
    conversationHistory.push({ role: "user", content: chat });

    // Update active in-memory history
    activeConversations[currentConversationId] = [...conversationHistory];

    // Always prepend system message
    const systemMessage = await getSystemMessage(name, pdf_url);
    const fullMessages: OpenRouterMessage[] = [
      { role: "system", content: systemMessage },
      ...conversationHistory,
    ];

    // Call OpenRouter API
    const response: OpenRouterResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-flash-1.5-8b",
        messages: fullMessages,
        temperature: 0.1,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result: string = response.data.choices[0].message.content;

    // Append assistant response
    conversationHistory.push({
      role: "assistant",
      content: result,
    });

    // Update conversation in memory
    activeConversations[currentConversationId] = conversationHistory;

    // Optional: cleanup memory
    if (Object.keys(activeConversations).length > 20) {
      const oldestId = Object.keys(activeConversations)[0];
      delete activeConversations[oldestId];
    }

    return {
      result,
      conversationId: currentConversationId,
    };
  } catch (error: unknown) {
    let errorMsg = "Unknown error";
    if (axios.isAxiosError(error)) {
      errorMsg = error.response?.data || error.message;
    } else if (error instanceof Error) {
      errorMsg = error.message;
    }
    console.error("Resume analysis error:", errorMsg);
    return {
      error: "Failed to process your request.",
      status: 500
    };
  }
}