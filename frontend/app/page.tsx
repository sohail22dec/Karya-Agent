"use client";

import { PanelLeftOpen } from "lucide-react";
import Sidebar from "../components/Sidebar";
import MessageList from "../components/MessageList";
import ChatInput from "../components/ChatInput";
import { useChat } from "../hooks/useChat";

export default function ChatPage() {
  const { isSidebarOpen, setIsSidebarOpen } = useChat();

  return (
    <div className="flex h-screen bg-white dark:bg-[#212121] text-gray-800 dark:text-gray-100 font-sans selection:bg-blue-200 dark:selection:bg-blue-900 overflow-hidden">

      <Sidebar />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">

        {/* Header containing the sidebar toggle */}
        <header className="absolute top-0 left-0 w-full p-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#2f2f2f] text-gray-600 dark:text-gray-300 transition-colors"
                title="Open sidebar"
              >
                <PanelLeftOpen className="w-6 h-6" />
              </button>
            )}
          </div>
        </header>

        <MessageList />
        <ChatInput />

      </div>
    </div>
  );
}