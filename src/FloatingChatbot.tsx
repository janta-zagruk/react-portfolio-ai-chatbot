"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { AIAssistantAPI } from "./api/ai-assistant/route";
import { FloatingChatBotProps } from "./types";

function FloatingChatBot({
  name,
  theme = "light",
  context_file,
  model,
  endpointUrl,
  bearerToken="",
  chatbotName = "Career Assistant",
  autoOpen = false,
  initialGreeting,
  inputPlaceHolderText,
  customErrorMessage,
  userTitle = "You",
  botTitle = "Career Assistant",
  position = "right",
  chatWindowWidth = "380px",
  chatWindowMaxHeight = "70vh",
  chatMessageFontSize = "14px",
  chatMessageFontFamily = "inherit",
  sendButtonColor = "#6366f1",
  toggleButtonColor = "linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef)",
  onOpen,
  onClose,
}: FloatingChatBotProps) {
  const [open, setOpen] = useState(autoOpen);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      text: initialGreeting
        ? initialGreeting
        : `👋 Hello! I'm ${name}'s AI assistant. I can help you assess how well their skills align with your job description and provide structured insights about ${name}'s qualifications.`,
      isUser: false,
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const contextFilePath = context_file;

  // Define theme-based colors
  const themeColors = {
    light: {
      background: "rgba(255, 255, 255, 0.95)",
      backgroundSecondary: "rgba(255, 255, 255, 0.98)",
      border: "rgba(0, 0, 0, 0.1)",
      text: "rgba(0, 0, 0, 0.9)",
      textSecondary: "rgba(0, 0, 0, 0.7)",
      userMessageBg: "rgba(99, 102, 241, 0.15)",
      userMessageBorder: "rgba(99, 102, 241, 0.3)",
      aiMessageBg: "rgba(0, 0, 0, 0.05)",
      aiMessageBorder: "rgba(0, 0, 0, 0.1)",
      inputBg: "rgba(0, 0, 0, 0.03)",
      inputBorder: "rgba(0, 0, 0, 0.1)",
      headerBg: "rgba(0, 0, 0, 0.02)",
    },
    dark: {
      background: "rgba(15, 15, 20, 0.95)",
      backgroundSecondary: "rgba(20, 20, 25, 0.98)",
      border: "rgba(255, 255, 255, 0.08)",
      text: "rgba(255, 255, 255, 0.95)",
      textSecondary: "rgba(255, 255, 255, 0.7)",
      userMessageBg: "rgba(99, 102, 241, 0.2)",
      userMessageBorder: "rgba(99, 102, 241, 0.3)",
      aiMessageBg: "rgba(255, 255, 255, 0.1)",
      aiMessageBorder: "rgba(255, 255, 255, 0.1)",
      inputBg: "rgba(255, 255, 255, 0.05)",
      inputBorder: "rgba(255, 255, 255, 0.1)",
      headerBg: "rgba(255, 255, 255, 0.03)",
    },
  };

  const colors = themeColors[theme === "light" ? "light" : "dark"];

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage = { id: Date.now(), text: inputValue, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await AIAssistantAPI(
        name,
        inputValue,
        contextFilePath,
        model,
        endpointUrl,
        bearerToken,
        conversationId
      );
      if (response.error) {
        throw new Error(`${response.error}
          API request failed with status: ${response.status}`);
      }

      const data = response;
      if (!conversationId && data.conversationId) {
        setConversationId(data.conversationId);
      }
      const aiMessage = {
        id: Date.now() + 1,
        text: data.result || "Sorry, I couldn't process that.",
        isUser: false,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(customErrorMessage ? customErrorMessage : error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Sorry, I encountered an error. Please try again.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOpen = () => {
    setOpen((prev) => {
      const newState = !prev;
      if (newState && typeof onOpen === "function") {
        onOpen();
      } else if (!newState && typeof onClose === "function") {
        onClose();
      }
      return newState;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Helper function to darken a hex color
  const darkenColor = (color: string, percent: number) => {
    if (!color.startsWith("#")) return color; // Skip if not hex

    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
    const B = Math.max(0, (num & 0x0000ff) - amt);
    return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`;
  };

  return (
    <>
      {/* Floating Button */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          [position === "left" ? "left" : "right"]: "20px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => toggleOpen()}
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "9999px",
            background: toggleButtonColor,
            boxShadow:
              theme === "light"
                ? "0 10px 25px rgba(99, 102, 241, 0.3)"
                : "0 10px 25px rgba(99, 102, 241, 0.5)",
            border: "none",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1) rotate(5deg)";
            e.currentTarget.style.boxShadow =
              "0 15px 30px rgba(139, 92, 246, 0.7)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) rotate(0)";
            e.currentTarget.style.boxShadow =
              theme === "light"
                ? "0 10px 25px rgba(99, 102, 241, 0.3)"
                : "0 10px 25px rgba(99, 102, 241, 0.5)";
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: toggleButtonColor,
              borderRadius: "9999px",
              filter: "blur(8px)",
              animation:
                "betterPulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          />
          <div
            style={{
              zIndex: 1,
              transition: "transform 0.3s ease",
              transform: open ? "rotate(90deg)" : "rotate(0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {open ? (
              <X color="#fff" size={28} strokeWidth={2.5} />
            ) : (
              <Sparkles color="#fff" size={28} strokeWidth={2.5} />
            )}
          </div>

          {/* Floating particles */}
          {!open && (
            <>
              <div
                style={{
                  position: "absolute",
                  width: "6px",
                  height: "6px",
                  background: "rgba(255,255,255,0.8)",
                  borderRadius: "50%",
                  top: "15%",
                  left: "25%",
                  animation: "float 3s ease-in-out infinite",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "4px",
                  height: "4px",
                  background: "rgba(255,255,255,0.6)",
                  borderRadius: "50%",
                  top: "30%",
                  right: "20%",
                  animation: "float 4s ease-in-out infinite 0.5s",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "5px",
                  height: "5px",
                  background: "rgba(255,255,255,0.7)",
                  borderRadius: "50%",
                  bottom: "20%",
                  left: "40%",
                  animation: "float 3.5s ease-in-out infinite 1s",
                }}
              />
            </>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            [position === "right" ? "right" : "left"]: "20px", // Dynamic positioning
            width: chatWindowWidth,
            maxHeight: chatWindowMaxHeight,
            backgroundColor: colors.background,
            backdropFilter: "blur(16px)",
            border: `1px solid ${colors.border}`,
            borderRadius: "24px",
            boxShadow:
              theme === "light"
                ? "0 12px 48px rgba(0,0,0,0.2)"
                : "0 12px 48px rgba(0,0,0,0.4)",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            color: colors.text,
            animation: "fadeSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "18px 20px",
              borderBottom: `1px solid ${colors.border}`,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: colors.headerBg,
            }}
          >
            <div
              style={{
                background: toggleButtonColor,
                width: "36px",
                height: "36px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Sparkles size={20} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 600 }}>
                {chatbotName}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  opacity: 0.7,
                  marginTop: "2px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  color: colors.textSecondary,
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: isLoading ? "#f59e0b" : "#10b981",
                  }}
                />
                {isLoading ? "Thinking..." : "Online"}
              </div>
            </div>
          </div>

          {/* Message Body */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  alignSelf: message.isUser ? "flex-end" : "flex-start",
                  maxWidth: "80%",
                  animation: "fadeIn 0.3s ease-out",
                }}
              >
                {((message.isUser && userTitle) ||
                  (!message.isUser && botTitle)) && (
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      marginBottom: "4px",
                      color: colors.textSecondary,
                      textAlign: message.isUser ? "right" : "left",
                      paddingLeft: message.isUser ? "0" : "8px",
                      paddingRight: message.isUser ? "8px" : "0",
                    }}
                  >
                    {message.isUser ? userTitle : botTitle}
                  </div>
                )}
                <div
                  style={{
                    backgroundColor: message.isUser
                      ? colors.userMessageBg
                      : colors.aiMessageBg,
                    borderRadius: message.isUser
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                    padding: "12px 16px",
                    border: message.isUser
                      ? `1px solid ${colors.userMessageBorder}`
                      : `1px solid ${colors.aiMessageBorder}`,
                    position: "relative",
                    wordBreak: "break-word",
                    textAlign: "left",
                    fontSize: chatMessageFontSize,
                    fontFamily: chatMessageFontFamily,
                  }}
                >
                  <ReactMarkdown
                    components={{
                      p: (props) => (
                        <p
                          style={{
                            margin: "0 0 8px 0",
                            color: colors.text,
                            fontSize: chatMessageFontSize,
                            fontFamily: chatMessageFontFamily,
                          }}
                          {...props}
                        />
                      ),
                      ul: (props) => (
                        <ul
                          style={{
                            margin: "4px 0",
                            paddingLeft: "20px",
                            listStyleType: "disc",
                            color: colors.text,
                            fontSize: chatMessageFontSize,
                            fontFamily: chatMessageFontFamily,
                          }}
                          {...props}
                        />
                      ),
                      li: (props) => (
                        <li
                          style={{
                            marginBottom: "4px",
                            lineHeight: "1.4",
                            color: colors.text,
                            fontSize: chatMessageFontSize,
                            fontFamily: chatMessageFontFamily,
                          }}
                          {...props}
                        />
                      ),
                      strong: (props) => (
                        <strong
                          style={{
                            fontWeight: 600,
                            color: colors.text,
                            fontSize: chatMessageFontSize,
                            fontFamily: chatMessageFontFamily,
                          }}
                          {...props}
                        />
                      ),
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-18px",
                      right: message.isUser ? "4px" : "auto",
                      left: message.isUser ? "auto" : "4px",
                      fontSize: "10px",
                      opacity: 0.5,
                      color: colors.textSecondary,
                    }}
                  >
                    {new Date(message.id).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  maxWidth: "80%",
                }}
              >
                <div
                  style={{
                    backgroundColor: colors.aiMessageBg,
                    borderRadius: "18px 18px 18px 4px",
                    padding: "12px 16px",
                    border: `1px solid ${colors.aiMessageBorder}`,
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#f59e0b",
                      animation: "pulse 1.5s infinite",
                    }}
                  />
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#f59e0b",
                      animation: "pulse 1.5s infinite 0.5s",
                    }}
                  />
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#f59e0b",
                      animation: "pulse 1.5s infinite 1s",
                    }}
                  />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              borderTop: `1px solid ${colors.border}`,
              padding: "12px",
              background: colors.headerBg,
            }}
          >
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    inputPlaceHolderText
                      ? inputPlaceHolderText
                      : "Ask me anything or give me your job description..."
                  }
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    background: colors.inputBg,
                    border: `1px solid ${colors.inputBorder}`,
                    borderRadius: "14px",
                    padding: "12px 16px",
                    color: colors.text,
                    outline: "none",
                    fontSize: "14px",
                    transition: "all 0.3s ease",
                    opacity: isLoading ? 0.7 : 1,
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background =
                      theme === "light"
                        ? "rgba(0, 0, 0, 0.05)"
                        : "rgba(255, 255, 255, 0.1)";
                    e.currentTarget.style.borderColor =
                      "rgba(99, 102, 241, 0.5)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = colors.inputBg;
                    e.currentTarget.style.borderColor = colors.inputBorder;
                  }}
                />
                {inputValue.trim() ? (
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      backgroundColor: inputValue.trim()
                        ? sendButtonColor
                        : theme === "light"
                        ? "rgba(0,0,0,0.1)"
                        : "rgba(255,255,255,0.1)",
                      color: "white",
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      border: "none",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      opacity: isLoading ? 0.7 : 1,
                      padding: "12px", // Ensures internal spacing
                    }}
                    onMouseEnter={(e) => {
                      if (inputValue.trim() && !isLoading) {
                        e.currentTarget.style.backgroundColor = darkenColor(
                          sendButtonColor,
                          20
                        ); // Darken by 20% on hover
                      } else if (!isLoading) {
                        e.currentTarget.style.backgroundColor =
                          theme === "light"
                            ? "rgba(0,0,0,0.2)"
                            : "rgba(255,255,255,0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (inputValue.trim() && !isLoading) {
                        e.currentTarget.style.backgroundColor = sendButtonColor; // Reset to original
                      } else if (!isLoading) {
                        e.currentTarget.style.backgroundColor =
                          theme === "light"
                            ? "rgba(0,0,0,0.1)"
                            : "rgba(255,255,255,0.1)";
                      }
                    }}
                  >
                    <Send size={16} strokeWidth={2.2} />
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Keyframe Animations */}
      <style>{`
        @keyframes betterPulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.3; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes fadeSlideUp {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-40px) translateX(10px); opacity: 0; }
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: ${
            theme === "light"
              ? "rgba(0, 0, 0, 0.05)"
              : "rgba(255, 255, 255, 0.05)"
          };
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb {
          background: ${
            theme === "light"
              ? "rgba(0, 0, 0, 0.2)"
              : "rgba(255, 255, 255, 0.2)"
          };
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${
            theme === "light"
              ? "rgba(0, 0, 0, 0.3)"
              : "rgba(255, 255, 255, 0.3)"
          };
        }
      `}</style>
    </>
  );
}
export default FloatingChatBot;
