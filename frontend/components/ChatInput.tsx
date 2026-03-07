import { ArrowUp } from "lucide-react";
import { useRef, useEffect } from "react";
import { useChat } from "../hooks/useChat";

export default function ChatInput() {
  const {
    input,
    setInput,
    handleSendMessage,
    isPending,
  } = useChat();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as the user types
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto"; // Reset first to shrink if text is deleted
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`; // Grow up to 200px
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Shift+Enter or Ctrl+Enter → insert a new line (do nothing, let default happen)
    if (e.key === "Enter" && (e.shiftKey || e.ctrlKey)) {
      return;
    }
    // Plain Enter → submit the form
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      if (!input.trim() || isPending) return;
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white dark:from-[#212121] dark:via-[#212121] to-transparent pt-10 pb-6 z-20">
      <div className="max-w-3xl mx-auto px-4 w-full relative">
        <form
          onSubmit={handleSendMessage}
          className="relative flex items-end bg-[#f4f4f4] dark:bg-[#2f2f2f] rounded-3xl overflow-hidden shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/50 focus-within:ring-2 focus-within:ring-gray-300 dark:focus-within:ring-gray-500 transition-shadow duration-200"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Karya AI..."
            className="w-full bg-transparent py-4 pl-6 pr-14 text-[16px] text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-none resize-none overflow-y-auto leading-relaxed"
            disabled={isPending}
          />
          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isPending}
            className="absolute right-3 bottom-2 h-9 w-9 bg-black dark:bg-white text-white dark:text-black hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-opacity flex items-center justify-center flex-shrink-0"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Karya AI can make mistakes. Please verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
