import { useChat } from "../hooks/useChat";
import { Thread } from "../hooks/useChat";

type DeleteConfirmDialogProps = {
  thread: Thread;
  onClose: () => void;
};

export default function DeleteConfirmDialog({ thread, onClose }: DeleteConfirmDialogProps) {
  const { handleDeleteThread } = useChat();

  const confirmDelete = () => {
    handleDeleteThread(thread.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#2f2f2f] rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Delete chat?
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          This will permanently delete{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            &ldquo;{thread.title}&rdquo;
          </span>
          . This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-[#444] text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#555] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
