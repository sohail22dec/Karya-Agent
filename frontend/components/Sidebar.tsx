import { useState } from "react";
import { SquarePen, PanelLeftClose, Trash2 } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { Thread } from "../hooks/useChat";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

export default function Sidebar() {
  const {
    threads,
    activeThreadId,
    isSidebarOpen,
    setIsSidebarOpen,
    handleNewChat,
    handleSwitchThread,
  } = useChat();

  // Track which thread is pending deletion (null = dialog closed)
  const [threadToDelete, setThreadToDelete] = useState<Thread | null>(null);

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Outer wrapper: animates width in the flex layout */}
      <div
        style={{ width: isSidebarOpen ? "260px" : "0px" }}
        className="flex-shrink-0 transition-[width] duration-300 ease-in-out overflow-hidden fixed md:relative h-full z-40 md:z-auto top-0 left-0"
      >
        {/* Inner panel: always 260px wide, clipped by the outer wrapper */}
        <div className="flex flex-col h-full w-[260px] bg-[#f9f9f9] dark:bg-[#171717] border-r border-gray-200 dark:border-white/10">

          {/* Header */}
          <div className="p-3 flex items-center gap-1">
            {/* Brand label - NOT a button */}
            <div className="flex flex-1 items-center gap-2 px-2.5 py-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white dark:ring-[#171717]">
                K
              </div>
              <span className="truncate text-sm font-medium">Karya AI</span>
            </div>

            {/* New Chat button */}
            <button
              onClick={handleNewChat}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2f2f2f] text-gray-500 dark:text-gray-400 transition-colors"
              title="New chat"
            >
              <SquarePen className="w-4 h-4" />
            </button>

            {/* Close toggle (desktop only) */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="hidden md:flex flex-shrink-0 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2f2f2f] text-gray-500 dark:text-gray-400 transition-colors"
              title="Close sidebar"
            >
              <PanelLeftClose className="w-5 h-5" />
            </button>
          </div>

          {/* Thread List */}
          <div className="flex-1 overflow-y-auto px-3 pb-4">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-4 mb-2 px-2">Recent</div>
            <div className="flex flex-col gap-1">
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  className={`group relative flex items-center w-full rounded-lg text-sm transition-colors ${activeThreadId === thread.id
                    ? "bg-gray-200 dark:bg-[#2f2f2f] text-gray-900 dark:text-gray-100"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#212121]"
                    }`}
                >
                  <button
                    onClick={() => handleSwitchThread(thread.id)}
                    className="flex-1 px-2.5 py-2 text-left"
                  >
                    <span className="block truncate pr-6">{thread.title}</span>
                    <span className="block text-[11px] text-gray-400 dark:text-gray-500 font-mono mt-0.5">
                      {thread.id.slice(0, 8)}...
                    </span>
                  </button>

                  {/* Trash / Delete button — opens confirmation dialog */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setThreadToDelete(thread);
                    }}
                    className={`absolute right-2 p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ${activeThreadId === thread.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    title="Delete chat"
                  >
                    <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {threadToDelete && (
        <DeleteConfirmDialog
          thread={threadToDelete}
          onClose={() => setThreadToDelete(null)}
        />
      )}
    </>
  );
}
