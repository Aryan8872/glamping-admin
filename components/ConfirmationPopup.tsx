
"use client";

import { useConfirm } from "@/stores/useConfirm";

export default function ConfirmationPopup() {
  const { isOpen, message, handleConfirm, handleCancel } = useConfirm();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-3">Are you sure?</h2>
        <p className="text-gray-600 mb-5">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}


// export default function ConfirmationPopup(
//   updateConfirmation: boolean,
//   deleteConfirmation: boolean,
//   warningPopUp: boolean,
//   errorPopUp: boolean
// ) {
//   return (
//     <div className="fixed w-full h-full inset-0 bg-black/10 backdrop-blur-2xl">
//       <div>hello</div>
//     </div>
//   );
// }

