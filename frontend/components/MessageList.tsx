import { useChat } from "../hooks/useChat";

export default function MessageList() {
  const { messages, isPending, isLoadingHistory, messagesEndRef } = useChat();

  return (
    <main className="flex-1 overflow-y-auto w-full flex flex-col items-center relative">
      
      {/* History Loading State */}
      {isLoadingHistory && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-[#212121]/50 z-10 backdrop-blur-sm">
           <div className="flex flex-col items-center gap-3">
             <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin" />
             <p className="text-sm text-gray-500">Loading history...</p>
           </div>
        </div>
      )}

      {messages.length === 0 && !isLoadingHistory ? (
        // Empty State
        <div className="flex-1 flex flex-col items-center justify-center h-full w-full px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg ring-4 ring-blue-600/20">
            K
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200 tracking-tight">
            How can I help you today?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mt-2">
            This is a brand new conversation. Send a message to start chatting
            with the Karya Agent.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-3xl flex flex-col px-4 pt-20 pb-40 space-y-8">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex w-full group ${message.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              {message.role === "agent" && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white dark:ring-[#212121] mr-4 mt-1">
                  K
                </div>
              )}

              <div
                className={`
                  max-w-[85%] text-[15.5px] leading-relaxed whitespace-pre-wrap
                  ${message.role === "user"
                    ? "bg-[#f4f4f4] dark:bg-[#2f2f2f] text-gray-900 dark:text-gray-100 px-5 py-3.5 rounded-3xl"
                    : "text-gray-900 dark:text-gray-100 py-2.5"
                  }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isPending && (
            <div className="flex w-full justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white dark:ring-[#212121] mr-4 mt-1">
                K
              </div>
              <div className="py-2.5 flex items-center gap-1.5 opacity-60">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      )}
    </main>
  );
}
