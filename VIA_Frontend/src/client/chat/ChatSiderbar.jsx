import axios from "axios";
import { useState, useContext, useEffect, createContext } from "react";
import { Plus, Users } from "lucide-react";
import { ct } from "../../app/App";
import { useOutletContext } from "react-router-dom";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";


export default function ChatSidebar({
  Refresh,
  selectedChat,
  setSelectedChat,
}) {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const userData = useContext(ct);
  const { isMobile } = useOutletContext();
  const { sidebarOpen } = useOutletContext();

  //fetch All Room who user who rooms user exist

  useEffect(() => {
    const findAllRoom = async () => {
      const RooData = await axios.get(
        `${BASE_URL}/api/chat/creator-rooms/${userData.token._id}`,
      );

      setRooms(RooData.data.rooms);

      // setSelectedChat();
    };
    findAllRoom();
  }, [Refresh]);

  //Creater new room
  const createRoom = async () => {
    if (!roomName.trim()) return;

    const newRoom = {
      createdBy: userData.token._id,
      _id: Date.now(),
      name: roomName,
      isGroup: true,
    };
    const RoomData = await axios.post(
      `${BASE_URL}/api/chat/create-room`,
      newRoom,
    );

    setRooms([...rooms, RoomData.data.room]);
    setRoomName("");
    toast.success("Room Create Successful ✅");
  };

  return (
    <div
      className={`${
        isMobile && selectedChat ? "hidden" : "flex"
      } w-80 h-full bg-white flex-col shadow-[6px_0_8px_rgba(0,0,0,0.08)] overflow-hidden min-h-0`}
    >
      {/* Room List */}
      <div className="flex-1 bg-gray-100 overflow-y-auto min-h-0 scrollbar-hide">
        {rooms.length === 0 ? (
          <h2 className="text-2xl font-semibold text-gray-700">No rooms</h2>
        ) : (
          <div className="space-y-3 p-4">
            {rooms.map((room) => (
              <div
                key={room._id}
                onClick={() => setSelectedChat(room)}
                className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer 
                ${
                  selectedChat?.id === room._id
                    ? "bg-blue-100"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <Users size={18} className="text-gray-600" />
                <span>{room.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Room Section */}
      <div className=" p-4">
        <p className="font-semibold mb-2">Create new room</p>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="flex-1 border border-gray-200 rounded-md px-3 py-2 outline-none"
          />

          <button
            onClick={createRoom}
            className="bg-blue-600 text-white px-4 rounded-md flex items-center justify-center hover:bg-blue-700"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
