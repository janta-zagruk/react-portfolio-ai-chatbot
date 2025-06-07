# Floating Chatbot Component for React

A **customizable floating chatbot UI component** for React portfolio websites.

## 🚀 The Story Behind This

As developers, we wanted to add an AI assistant to our portfolio websites — something lightweight, clean, and useful for recruiters. So we built this chatbot that reads our resume PDF and interacts using powerful models via OpenRouter. We packaged it into `react-portfolio-ai-chatbot` to make it easy for others to plug into their own portfolios too. More updates and enhancements will follow!

## 🎯 Perfect For

- **Developer portfolios**
- **Interactive resumes**
- **Personal sites looking to showcase experience smartly**

---

## Installation

````bash
npm install react-portfolio-ai-chatbot
# or
yarn add react-portfolio-ai-chatbot

## Usage in React (Vite/CRA)

```js
import FloatingChatBot from "react-portfolio-ai-chatbot";

function App() {
  return (
    <FloatingChatBot
      name="Ian Hansson"
      secret_key={import.meta.env.VITE_OPENROUTER_API_KEY}
      context_file={"/resume.pdf"}
      model="google/gemini-flash-1.5-8b"
      chatbotName="Career Assistant"
      initialGreeting="Hello! I'm Ian's AI assistant. I can help you assess how well their skills align with your job description and provide structured insights about Ian's qualifications."
    />
  );
}
export default App;
````

## Usage in Next.js (with Dynamic Import)

To avoid SSR issues, use next/dynamic to dynamically import the chatbot component with SSR disabled:

```js
// pages/index.tsx or any client-side page
'use client'
import dynamic from "next/dynamic";

const FloatingChatBot = dynamic(() => import("react-portfolio-ai-chatbot"), {
  ssr: false,
});

export default function Home() {
  return (
    <FloatingChatBot
      name="Ian Hansson"
      secret_key={process.env.NEXT_PUBLIC_OPENROUTER_API_KEY!}
      context_file={"/resume.pdf"}
      model="google/gemini-flash-1.5-8b"
      chatbotName="Career Assistant"
      initialGreeting="Hi! I'm Ian's AI assistant. Ask me anything about their resume!"
      position="right"
      theme="light"
      autoOpen={false}
    />
  );
}
```

## Props

<table>
  <thead>
    <tr>
      <th>Prop</th>
      <th>Type</th>
      <th>Description</th>
      <th>Default</th>
      <th>Required</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>name</code></td>
      <td><code>string</code></td>
      <td>Name of the user</td>
      <td>–</td>
      <td><strong>Yes</strong></td>
    </tr>
    <tr>
      <td><code>secret_key</code></td>
      <td><code>string</code></td>
      <td>OpenRouter API key</td>
      <td>–</td>
      <td><strong>Yes</strong></td>
    </tr>
    <tr>
      <td><code>context_file</code></td>
      <td><code>string</code></td>
      <td>Path to the resume or context file (PDF)</td>
      <td>–</td>
      <td><strong>Yes</strong></td>
    </tr>
    <tr>
      <td><code>model</code></td>
      <td><code>string</code></td>
      <td>Model name to use from OpenRouter</td>
      <td>–</td>
      <td><strong>Yes</strong></td>
    </tr>
    <tr>
      <td><code>theme</code></td>
      <td><code>"light" | "dark"</code></td>
      <td>Color scheme of the chatbot</td>
      <td><code>"light"</code></td>
      <td>No</td>
    </tr>
    <tr>
      <td><code>chatbotName</code></td>
      <td><code>string</code></td>
      <td>Custom name for the chatbot</td>
      <td><code>"Career Assistant"</code></td>
      <td>No</td>
    </tr>
    <tr>
      <td><code>autoOpen</code></td>
      <td><code>boolean</code></td>
      <td>Whether the chat opens automatically on page load</td>
      <td><code>false</code></td>
      <td>No</td>
    </tr>
    <tr>
      <td><code>initialGreeting</code></td>
      <td><code>string</code></td>
      <td>First message displayed when opened</td>
      <td><code>`👋 Hello! I'm ${name}'s AI assistant. I can help you assess how well their skills align with your job description and provide structured insights about ${name}'s qualifications.`</code></td>
      <td>No</td>
    </tr>
    <tr>
      <td><code>inputPlaceHolderText</code></td>
      <td><code>string</code></td>
      <td>Placeholder for the user input field</td>
      <td><code>"Ask me anything or give me your job description..."</code></td>
      <td>No</td>
    </tr>
    <tr>
      <td><code>customErrorMessage</code></td>
      <td><code>string</code></td>
      <td>Custom message shown when the API call fails</td>
      <td><code>API error message (default)</code></td>
      <td>No</td>
    </tr>
    <tr>
      <td><code>userTitle</code></td>
      <td><code>string</code></td>
      <td>Label used for user messages</td>
      <td><code>"You"</code></td>
      <td>No</td>
    </tr>
    <tr>
      <td><code>botTitle</code></td>
      <td><code>string</code></td>
      <td>Label used for bot messages</td>
      <td><code>"Career Assistant"</code></td>
      <td>No</td>
    </tr>
    <tr>
      <td><code>position</code></td>
      <td><code>"left" | "right"</code></td>
      <td>Side of screen the chatbot appears on</td>
      <td><code>"right"</code></td>
      <td>No</td>
    </tr>
    <tr>
      <td><code>chatWindowWidth</code></td>
      <td><code>string</code></td>
      <td>Width of the chat window</td>
      <td><code>"380px"</code></td>
      <td>No</td>
    </tr>
    <tr>
      <td><code>chatWindowMaxHeight</code></td>
      <td><code>string</code></td>
      <td>Max height of the chat window</td>
      <td><code>"70vh"</code></td>
      <td>No</td>
    </tr>
    <tr>
      <td><code>chatMessageFontSize</code></td>
      <td><code>string</code></td>
      <td>Font size used for messages</td>
      <td><code>"14px"</code></td>
      <td>No</td>
    </tr>
    <tr>
      <td><code>chatMessageFontFamily</code></td>
      <td><code>string</code></td>
      <td>Font family for messages</td>
      <td><code>"inherit"</code></td>
      <td>No</td>
    </tr>
    <tr>
      <td><code>sendButtonColor</code></td>
      <td><code>string</code></td>
      <td>CSS color for send button</td>
      <td><code>"#6366f1"</code></td>
      <td>No</td>
    </tr>
    <tr>
      <td><code>toggleButtonColor</code></td>
      <td><code>string</code></td>
      <td>CSS color for toggle button and assistant logo background</td>
      <td><code>"linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef)"</code></td>
      <td>No</td>
    </tr>
    <tr>
      <td><code>onOpen</code></td>
      <td><code>() => void</code></td>
      <td>Callback when chatbot is opened</td>
      <td><code>undefined</code></td>
      <td>No</td>
    </tr>
    <tr>
      <td><code>onClose</code></td>
      <td><code>() => void</code></td>
      <td>Callback when chatbot is closed</td>
      <td><code>undefined</code></td>
      <td>No</td>
    </tr>
  </tbody>
</table>

## How to Get an OpenRouter API Key

1. Visit https://openrouter.ai
2. Sign up with your email or GitHub
3. Go to API Keys from your dashboard
4. Create a new API key and use it in the <code>secret_key</code> prop

## Credits & Legal

This chatbot uses the OpenRouter API to power AI interactions. All responses are generated via OpenRouter's supported models. Thanks to [OpenRouter](https://openrouter.ai/) for providing powerful, accessible AI APIs.

## License

MIT © Md Sohail and Soumyadip Ghosh
