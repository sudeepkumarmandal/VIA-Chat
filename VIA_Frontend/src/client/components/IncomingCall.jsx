import React from "react";

function IncomingCall({ callData, onAccept, onReject }) {
  if (!callData) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl text-white text-center">
        <p className="text-lg font-semibold">{callData.name} is calling...</p>

        <div className="mt-4 flex gap-4 justify-center">
          <button onClick={onAccept} className="bg-green-600 px-4 py-2 rounded">
            Accept
          </button>

          <button onClick={onReject} className="bg-red-600 px-4 py-2 rounded">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomingCall;
