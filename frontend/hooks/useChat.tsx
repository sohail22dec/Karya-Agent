"use client";

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

export type Message = {
  id: string;
  role: "user" | "agent";
  content: string;
};

export type Thread = {
  id: string;
  title: string;
  createdAt: number;
};

// Generates a short human-readable label like "Mar 7, 12:13 PM"
const newChatTitle = () =>
  new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

type ChatContextType = {
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  threads: Thread[];
  activeThreadId: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  handleNewChat: () => void;
  handleSwitchThread: (threadId: string) => void;
  handleDeleteThread: (threadIdToDelete: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  isPending: boolean;
  isLoadingHistory: boolean;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Thread Management State
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Initialize Threads from LocalStorage
  useEffect(() => {
    const savedThreads = localStorage.getItem("karya_all_threads");
    const savedActiveId = localStorage.getItem("karya_active_thread_id");

    if (savedThreads && savedActiveId) {
      setThreads(JSON.parse(savedThreads));
      setActiveThreadId(savedActiveId);
    } else {
      // First time user: Create their first thread
      const initialThreadId = uuidv4();
      const initialThread: Thread = {
        id: initialThreadId,
        title: newChatTitle(),
        createdAt: Date.now(),
      };

      setThreads([initialThread]);
      setActiveThreadId(initialThreadId);

      localStorage.setItem("karya_all_threads", JSON.stringify([initialThread]));
      localStorage.setItem("karya_active_thread_id", initialThreadId);
    }
  }, []);

  // Sync threads to LocalStorage whenever they change
  useEffect(() => {
    if (threads.length > 0) {
      localStorage.setItem("karya_all_threads", JSON.stringify(threads));
    }
    if (activeThreadId) {
      localStorage.setItem("karya_active_thread_id", activeThreadId);
    }
  }, [threads, activeThreadId]);


  const historyQuery = useQuery({
    queryKey: ["chatHistory", activeThreadId],
    queryFn: async () => {
      if (!activeThreadId) return { messages: [] };
      const res = await fetch(`http://127.0.0.1:8000/history/${activeThreadId}`);
      if (!res.ok) throw new Error("Failed to fetch history");
      return res.json();
    },
    enabled: !!activeThreadId,
    staleTime: Infinity,         // Never auto-refetch for the same thread
    refetchOnWindowFocus: false, // Don't refetch when the user tabs back in
  });


  useEffect(() => {
    if (historyQuery.data?.messages && messages.length === 0) {
      setMessages(historyQuery.data.messages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyQuery.data]);

  // Auto-scroll to the bottom when messages change
  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleNewChat = () => {
    if (!activeThreadId && messages.length === 0) return;
    setActiveThreadId("");
    setMessages([]);
    localStorage.setItem("karya_active_thread_id", "");
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleSwitchThread = (threadId: string) => {
    if (threadId === activeThreadId) return;
    setActiveThreadId(threadId);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteThread = (threadIdToDelete: string) => {
    const updatedThreads = threads.filter((t) => t.id !== threadIdToDelete);
    setThreads(updatedThreads);
    localStorage.setItem("karya_all_threads", JSON.stringify(updatedThreads));
    if (activeThreadId === threadIdToDelete) {
      if (updatedThreads.length > 0) {
        handleSwitchThread(updatedThreads[0].id);
      } else {
        setActiveThreadId("");
        setMessages([]);
        localStorage.setItem("karya_active_thread_id", "");
      }
    }
  };

  const chatMutation = useMutation<Message, Error, { message: string; threadId: string }>({
    mutationFn: async ({ message, threadId }) => {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          thread_id: threadId,
        }),
      });

      if (!response.ok) throw new Error("Failed to connect to backend.");
      return response.json();
    },
    onSuccess: (data: Message) => {
      setMessages((prev) => [...prev, data]);

      setThreads((prev) =>
        prev.map((t) => {
          if (t.id === activeThreadId && messages.length > 0 && t.title.includes(",")) {
            const firstUserMsg = messages[0]?.content || "Chat";
            const newTitle =
              firstUserMsg.length > 30 ? firstUserMsg.substring(0, 30) + "..." : firstUserMsg;
            return { ...t, title: newTitle };
          }
          return t;
        })
      );
    },
    onError: (error: Error) => {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content:
          "Sorry, I am having trouble connecting to the backend server. Please make sure the FastAPI server is running.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;

    let threadId = activeThreadId;
    if (!threadId) {
      const newThreadId = uuidv4();
      const newThread: Thread = {
        id: newThreadId,
        title: newChatTitle(),
        createdAt: Date.now(),
      };
      setThreads((prev) => [newThread, ...prev]);
      setActiveThreadId(newThreadId);
      threadId = newThreadId;
    }

    const userMessageContent = input;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessageContent,
    };

    setMessages((prev) => [...prev, userMessage]);
    chatMutation.mutate({ message: userMessageContent, threadId });
    setInput("");
    if (messages.length === 0) {
      setThreads((prev) =>
        prev.map((t) => {
          if (t.id === activeThreadId) {
            const newTitle =
              userMessageContent.length > 30
                ? userMessageContent.substring(0, 30) + "..."
                : userMessageContent;
            return { ...t, title: newTitle };
          }
          return t;
        })
      );
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        input,
        setInput,
        messagesEndRef,
        threads,
        activeThreadId,
        isSidebarOpen,
        setIsSidebarOpen,
        handleNewChat,
        handleSwitchThread,
        handleDeleteThread,
        handleSendMessage,
        isPending: chatMutation.isPending,
        isLoadingHistory: historyQuery.isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
