"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import logo from "@/assets/logo/logoLight.png";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);

  // Predefined templates
  const templates = [
    "What are some tips for changing careers later in life?",
    "What are the best career options after a marketing degree?",
    "How can I improve my chances of getting a job in data science?",
  ];

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async (predefinedMessage) => {
    const userMessage = message?.trim() || predefinedMessage;
    if (!userMessage) return;

    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setMessage(""); // Clear the input
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userMessage }),
        }
      );

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let streamMessage = "";

      setMessages((prev) => [...prev, { text: "", sender: "bot" }]);

      while (!done) {
        const { value, done: isDone } = await reader.read();
        done = isDone;
        streamMessage += decoder.decode(value, { stream: true });

        if (streamMessage) {
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              text: streamMessage.trim(),
              sender: "bot",
            };
            return newMessages;
          });
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Error: Could not get a response.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-md flex items-center justify-between gap-6">
        <div className="flex flex-col items-start">
          <h1 className="text-[22px] font-semibold md:text-3xl">
            Career Counselling
          </h1>
          <p className="mt-1 text-xs opacity-80 md:text-base">
            Your <strong className="text-[12px]">AI-powered</strong> guide to a
            brighter professional future.
          </p>
        </div>
        <div>
          <Image src={logo.src} alt="Logo" width={90} height={80} />
        </div>
      </header>
      <div
        className="max-w-fit mt-2 mx-2 md:mx-auto text-xs text-gray-600 text-center bg-yellow-100 border-l-4 border-yellow-500 p-2 rounded-md"
        role="alert"
      >
        <p>
          <strong>Notice:</strong> The Chatbot is currently in beta and may
          provide inaccurate advice as it is still learning.
        </p>
      </div>

      {messages?.length === 0 && (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-700 text-center">
            Quick Suggestions:
          </h2>
          <div className="flex flex-col flex-wrap gap-3 mb-4 z-10 md:max-w-[40%] text-center justify-center mx-auto">
            {templates.map((template, index) => (
              <button
                key={index}
                onClick={() => sendMessage(template)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:opacity-90 transition"
              >
                {template}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-auto p-6 space-y-6 pb-[98px]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`sm:max-w-xs p-4 md:max-w-[70%] rounded-lg shadow-md ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                  : "bg-white border border-gray-200 text-gray-800"
              }`}
              style={{
                lineHeight: "1.5",
                fontSize: "0.9rem",
              }}
              dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
            />
            <div ref={messageEndRef} />
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="bg-white p-4 fixed bottom-0 left-0 right-0 shadow-md flex items-center gap-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={1}
          className="flex-1 resize-none p-3 border rounded-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm text-black overflow-auto"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 12H5"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function formatText(inputText) {
  inputText = inputText.replace(/\n/g, "");
  inputText = inputText.replace(/```html/g, "");
  inputText = inputText.replace(/```/g, "");
  return inputText;
}
