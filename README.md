# Floating Chatbot Component for React

A **customizable floating chatbot UI component** for React portfolio websites that transforms your resume into an interactive AI assistant.

[Demo URL](https://demo-react-portfolio-ai-chatbot.vercel.app)

## 📋 Prerequisites

**Before you begin, you'll need:**

1. **A resume file** (PDF format) that will serve as the knowledge base for your chatbot
2. **OpenRouter API key** (free to get from [openrouter.ai](https://openrouter.ai))
3. **A backend server** to securely handle API requests (examples provided below)

> **📁 Resume File Requirement**: Your resume PDF should be placed in your project's `public` folder (e.g., `public/resume.pdf`) so it can be accessed via URL path. The chatbot will read this file to answer questions about your background, skills, and experience.

## 🚀 The Story Behind This

As developers, we wanted to add an AI assistant to our portfolio websites — something lightweight, clean, and useful for recruiters. So we built this chatbot that reads your resume PDF and interacts using powerful AI models via OpenRouter. We packaged it into `react-portfolio-ai-chatbot` to make it easy for others to plug into their own portfolios too.

## 🎯 Perfect For

- **Developer portfolios** - Let recruiters interact with your experience
- **Interactive resumes** - Make your qualifications accessible through conversation
- **Personal sites** - Showcase your background in an engaging way
- **Job applications** - Provide 24/7 assistance to potential employers

---

## 🚀 Quick Start

### 1. Install the Package

```bash
npm install react-portfolio-ai-chatbot
```

or

```bash
yarn add react-portfolio-ai-chatbot
```

### 2. Prepare Your Resume

- Save your resume as a PDF file
- Place it in your `public` folder: `public/resume.pdf`
- The file will be accessible at `/resume.pdf` from your website

### 3. Get Your OpenRouter API Key

1. Visit [openrouter.ai](https://openrouter.ai)
2. Sign up with your email or GitHub
3. Go to **API Keys** from your dashboard
4. Create a new API key and save it securely

### 4. Set Up Backend (Required for Security)

You **must** create a backend proxy to keep your API key secure. Choose one of the options below:

---

## 🔧 Implementation Guide

### Option 1: Using with React (Vite/CRA)

```jsx
import FloatingChatBot from "react-portfolio-ai-chatbot";

function App() {
  return (
    <div>
      <h1>My Portfolio</h1>
      
      <FloatingChatBot
        name="Ian Hansson"
        endpointUrl="http://localhost:3001/api/chat"
        context_file="/resume.pdf"
        model="google/gemini-flash-1.5-8b"
        chatbotName="Career Assistant"
        initialGreeting="Hello! I'm Ian's AI assistant. I can help you assess how well their skills align with your job description and provide structured insights about Ian's qualifications."
      />
    </div>
  );
}

export default App;
```

### Option 2: Using with Next.js

To avoid SSR issues, use `next/dynamic` to dynamically import the chatbot:

#### App Router (Next.js 13+)

```jsx
// app/page.tsx or any client-side component
'use client'
import dynamic from "next/dynamic";

const FloatingChatBot = dynamic(() => import("react-portfolio-ai-chatbot"), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <h1>My Portfolio</h1>
      <FloatingChatBot
        name="Ian Hansson"
        endpointUrl="/api/chat"
        context_file="/resume.pdf"
        model="google/gemini-flash-1.5-8b"
        chatbotName="Career Assistant"
        initialGreeting="Hi! I'm Ian's AI assistant. Ask me anything about their resume!"
        position="right"
        theme="light"
        autoOpen={false}
      />
    </div>
  );
}
```

#### Pages Router (Next.js 12 and below)

```jsx
// pages/index.tsx
import dynamic from "next/dynamic";

const FloatingChatBot = dynamic(() => import("react-portfolio-ai-chatbot"), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <h1>My Portfolio</h1>
      <FloatingChatBot
        name="Ian Hansson"
        endpointUrl="/api/chat"
        context_file="/resume.pdf"
        model="google/gemini-flash-1.5-8b"
        chatbotName="Career Assistant"
        initialGreeting="Hi! I'm Ian's AI assistant. Ask me anything about their resume!"
      />
    </div>
  );
}
```

---

## 🔐 Backend Setup (Required)

You **must** set up a backend server to securely handle API requests. This keeps your OpenRouter API key safe from exposure in the frontend.

### Option A: Express.js Backend Server

Perfect for standalone React apps or when you want a separate backend service.

#### 1. Install Dependencies

```bash
mkdir my-chatbot-backend
cd my-chatbot-backend
npm init -y
npm install express cors dotenv axios
```

#### 2. Create Environment File

Create `.env`:

```bash
OPENROUTER_API_KEY=sk-your-actual-api-key-here
PORT=3001
```

#### 3. Create Server File

Create `server.js`:

```javascript
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, model, temperature = 0.7 } = req.body;

    // Input validation
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    if (!model) {
      return res.status(400).json({ error: "Model is required" });
    }

    console.log(`Processing chat request with model: ${model}`);

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      { 
        model, 
        messages, 
        temperature,
        max_tokens: 1000 // Prevent excessive token usage
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:3000",
          "Content-Type": "application/json",
        },
        timeout: 30000 // 30 second timeout
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Chat API Error:", error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      res.status(500).json({ error: "API authentication failed" });
    } else if (error.response?.status === 429) {
      res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
    } else {
      res.status(500).json({ error: "Failed to connect to AI service" });
    }
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
```

#### 4. Add Scripts to package.json

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  }
}
```

#### 5. Run Your Backend

```bash
npm start
```

Your backend will be available at `http://localhost:3001`

### Option B: Next.js API Routes

Perfect for Next.js applications - no separate server needed.

#### App Router (Next.js 13+)

Create `app/api/chat/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages, model, temperature = 0.7 } = await request.json();

    // Input validation
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    if (!model) {
      return NextResponse.json(
        { error: 'Model is required' },
        { status: 400 }
      );
    }

    console.log(`Processing chat request with model: ${model}`);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', response.status, errorData);
      
      if (response.status === 401) {
        throw new Error('API authentication failed');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      } else {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Chat API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('Rate limit')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    } else if (errorMessage.includes('authentication')) {
      return NextResponse.json(
        { error: 'API authentication failed' },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to connect to AI service' },
        { status: 500 }
      );
    }
  }
}
```

Create `.env.local`:

```bash
OPENROUTER_API_KEY=sk-your-actual-api-key-here
NEXT_PUBLIC_SITE_URL=https://your-portfolio-domain.com
```

#### Pages Router (Next.js 12 and below)

Create `pages/api/chat.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, model, temperature = 0.7 } = req.body;

    // Input validation
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!model) {
      return res.status(400).json({ error: 'Model is required' });
    }

    console.log(`Processing chat request with model: ${model}`);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', response.status, errorData);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Failed to connect to AI service' });
  }
}
```

---

## 🔒 Optional: Add Authentication

Protect your backend with a bearer token for additional security.

### Frontend Implementation

```jsx
<FloatingChatBot
  name="Ian Hansson"
  endpointUrl="/api/chat"
  bearerToken="your_secure_token_here"
  context_file="/resume.pdf"
  model="google/gemini-flash-1.5-8b"
/>
```

### Backend Verification

Add to your `.env`:
```bash
EXPECTED_TOKEN=your_secure_token_here
```

**Express.js:**
```javascript
app.post("/api/chat", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token !== process.env.EXPECTED_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  // ... rest of your code
});
```

**Next.js:**
```typescript
const authHeader = request.headers.get('authorization');
const token = authHeader?.split(' ')[1];

if (token !== process.env.EXPECTED_TOKEN) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

---

## ⚙️ Configuration Options

### Required Props

| Prop | Type | Description | Example |
|------|------|-------------|---------|
| `name` | `string` | Your full name | `"John Doe"` |
| `endpointUrl` | `string` | Your backend API endpoint | `"/api/chat"` |
| `context_file` | `string` | Path to your resume PDF | `"/resume.pdf"` |
| `model` | `string` | OpenRouter model to use | `"google/gemini-flash-1.5-8b"` |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `bearerToken` | `string` | `undefined` | Authentication token for backend |
| `theme` | `"light" \| "dark"` | `"light"` | Color scheme |
| `chatbotName` | `string` | `"Career Assistant"` | Display name for the bot |
| `autoOpen` | `boolean` | `false` | Auto-open chat on page load |
| `position` | `"left" \| "right"` | `"right"` | Screen position |

### Customization Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialGreeting` | `string` | Auto-generated | First message shown |
| `inputPlaceHolderText` | `string` | `"Ask me anything..."` | Input placeholder |
| `customErrorMessage` | `string` | Default error | Custom error message |
| `userTitle` | `string` | `"You"` | Label for user messages |
| `botTitle` | `string` | `"Career Assistant"` | Label for bot messages |

### Styling Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `chatWindowWidth` | `string` | `"380px"` | Chat window width |
| `chatWindowMaxHeight` | `string` | `"70vh"` | Maximum chat height |
| `chatMessageFontSize` | `string` | `"14px"` | Message font size |
| `chatMessageFontFamily` | `string` | `"inherit"` | Message font family |
| `sendButtonColor` | `string` | `"#6366f1"` | Send button color |
| `toggleButtonColor` | `string` | Gradient | Toggle button styling |

### Event Callbacks

| Prop | Type | Description |
|------|------|-------------|
| `onOpen` | `() => void` | Called when chat opens |
| `onClose` | `() => void` | Called when chat closes |

---

## 🤖 Recommended AI Models

Choose based on your needs and budget:

### Free/Low-Cost Options
- `google/gemini-flash-1.5-8b` - Fast, good for basic interactions
- `meta-llama/llama-3.1-8b-instruct:free` - Decent quality, completely free

### Premium Options
- `anthropic/claude-3.5-sonnet` - Excellent reasoning and conversation
- `openai/gpt-4o` - Strong performance across all tasks
- `google/gemini-pro-1.5` - Good balance of speed and quality

### Specialized Models
- `cohere/command-r-plus` - Great for professional/business contexts
- `mistralai/mistral-large` - European alternative with strong performance

---

## 🎨 Theming Examples

### Light Theme (Default)
```jsx
<FloatingChatBot
  theme="light"
  sendButtonColor="#2563eb"
  toggleButtonColor="linear-gradient(135deg, #3b82f6, #1d4ed8)"
  // ... other props
/>
```

### Dark Theme
```jsx
<FloatingChatBot
  theme="dark"
  sendButtonColor="#10b981"
  toggleButtonColor="linear-gradient(135deg, #059669, #047857)"
  // ... other props
/>
```

### Custom Branding
```jsx
<FloatingChatBot
  theme="light"
  sendButtonColor="#your-brand-color"
  toggleButtonColor="linear-gradient(135deg, #brand-primary, #brand-secondary)"
  chatMessageFontFamily="'Your Custom Font', sans-serif"
  // ... other props
/>
```

---

## 🚀 Deployment Guide

### 1. Frontend Deployment

Deploy your React/Next.js app with the resume file:

```bash
# Make sure your resume is in the public folder
public/
  └── resume.pdf

# Deploy to Vercel, Netlify, or your preferred platform
npm run build
```

### 2. Backend Deployment

#### Express.js on Railway/Render/Heroku:

1. Create a `Dockerfile` (optional):
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

2. Set environment variables in your hosting platform:
   - `OPENROUTER_API_KEY`
   - `FRONTEND_URL` (your frontend domain)

#### Next.js API Routes:

Environment variables are automatically handled by your Next.js deployment.

### 3. Update Frontend Configuration

Update your `endpointUrl` for production:

```jsx
<FloatingChatBot
  endpointUrl={process.env.NODE_ENV === 'production' 
    ? 'https://your-backend.com/api/chat' 
    : 'http://localhost:3001/api/chat'
  }
  // ... other props
/>
```

---

## 🛠️ Troubleshooting

### Common Issues

#### "Failed to connect to AI service"
- ✅ Check your OpenRouter API key is correct
- ✅ Verify your backend is running
- ✅ Check network connectivity
- ✅ Look at browser console for specific errors

#### "Resume file not found"
- ✅ Ensure PDF is in `public` folder
- ✅ Verify the `context_file` path is correct
- ✅ Check file permissions and accessibility

#### Chat window not appearing
- ✅ Make sure you're importing the component correctly
- ✅ Check for JavaScript errors in console
- ✅ Verify all required props are provided

#### Next.js SSR errors
- ✅ Use `dynamic` import with `ssr: false`
- ✅ Wrap component usage in `useEffect` if needed
- ✅ Add `'use client'` directive for App Router

### Debug Mode

Enable debugging by checking browser console. The component logs helpful information about:
- API request/response cycles
- File loading status
- Error details

### Performance Tips

1. **Optimize your resume PDF**: Keep file size under 5MB
2. **Choose appropriate models**: Balance cost vs. quality
3. **Implement rate limiting**: Prevent excessive API usage
4. **Use caching**: Consider caching responses for common questions

---

## 🔐 Security Best Practices

### Essential Security Measures

1. **Never expose API keys in frontend code**
2. **Always use HTTPS in production**
3. **Implement rate limiting on backend endpoints**
4. **Validate and sanitize user inputs**
5. **Use environment variables for sensitive data**
6. **Configure CORS policies appropriately**
7. **Monitor API usage and costs**

### Additional Recommendations

- Set up monitoring/alerting for unusual API usage
- Implement request logging for debugging
- Consider implementing user session limits
- Regular security audits of dependencies

---

## 📈 Analytics & Monitoring

Track chatbot usage to improve user experience:

```jsx
<FloatingChatBot
  onOpen={() => {
    // Track chat opens
    gtag('event', 'chatbot_opened');
  }}
  onClose={() => {
    // Track chat closes  
    gtag('event', 'chatbot_closed');
  }}
  // ... other props
/>
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report bugs** by creating detailed GitHub issues
2. **Suggest features** through GitHub discussions
3. **Submit pull requests** with improvements
4. **Share your implementations** to inspire others

---

## 📄 License

MIT © Md Sohail and Soumyadip Ghosh

---

## 🙏 Credits & Acknowledgments

- **OpenRouter** for providing accessible AI APIs
- **React community** for the amazing ecosystem
- **All contributors** who help improve this project

---


*Built with ❤️ for the developer community*
