import {
  FaUserPlus,
  FaUserMinus,
  FaVideo,
  FaSignOutAlt,
  FaLock,
  FaMicrophone,
  FaPaperPlane,
} from "react-icons/fa";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { FaArrowUp } from "react-icons/fa";
import { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { ct } from "../../app/App";
import socket from "../socket/socket";
import { useOutletContext } from "react-router-dom";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";

export default function ChatWindow({
  refreshSidebar,
  selectedChat,
  setSelectedChat,
  setCallTime,
  setUsersInRoom,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const userData = useContext(ct);

  const [showModal, setShowModal] = useState(false);
  const [showRemoveModal, setRemoveShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [Roomusers, setRoomUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedRoomUsers, setSelectedRoomUsers] = useState([]);
  const { isMobile, sidebarOpen, setSidebarOpen } = useOutletContext();

  const sendSoundRef = useRef(null);
  const receiveSoundRef = useRef(null);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  //Fetch all user
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/user/get-Alluser`);

      const data = res.data;

      setUsers(data);

      setShowModal(true);
    } catch (err) {}
  };

  //All Particular room users
  const fetchParticularRoomusers = async () => {
    try {
      const Roomdata = await axios.get(
        `${BASE_URL}/api/chat/rooms-users/${selectedChat._id}`,
      );

      setRoomUsers([...Roomdata.data[0].users.slice(1)]);

      setRemoveShowModal(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((uid) => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  //Handle Selected Room users

  const handleSelectRoomUser = (id) => {
    if (selectedRoomUsers.includes(id)) {
      selectedRoomUsers(selectedUsers.filter((uid) => uid !== id));
    } else {
      setSelectedRoomUsers([...selectedUsers, id]);
    }
  };

  //Add user to Room
  const addUsersToRoom = async () => {
    try {
      await axios.post(`${BASE_URL}/api/chat/add-users`, {
        roomId: selectedChat._id,
        users: selectedUsers,
      });

      setShowModal(false);
      setSelectedUsers([]);
      toast.success("Add user In Room Successful ✅");
    } catch (err) {
      toast.error("Add user In Room Failed ❌");
    }
  };

  //Reomve the users

  const RemoveUsersToRoom = async () => {
    try {
      await axios.post(`${BASE_URL}/api/chat/Remove-RoomUsers`, {
        roomId: selectedChat._id,
        users: selectedRoomUsers,
      });

      setRemoveShowModal(false);
      setSelectedRoomUsers([]);
      toast.success("Remove User Successful ✅");
    } catch (err) {
      toast.error("Remove user Failed ❌");
    }
  };

  //Delete Room

  const DeleteRoom = async () => {
    try {
      const mess = await axios.post(`${BASE_URL}/api/chat/Delete-room`, {
        roomId: selectedChat._id,
        userId: userData.token._id,
      });

      refreshSidebar();
      toast.success("Delete Room  Successful ✅");
    } catch (error) {
      toast.error("Delete Room Failed ❌");
    }
  };
  selectedChat ? console.log(selectedChat.users) : "";

  const handleVideoCall = () => {
    socket.emit("callRoom", {
      roomId: selectedChat._id,
      from: userData.token._id,
      name: userData.token.name,
      usersInRoom: selectedChat.users.map((u) => u._id), // 🔥 IMPORTANT
    });
    setCallTime(true);
    setUsersInRoom(selectedChat.users.map((u) => u._id)); // 🔥 pass this up
  };

  //Chat logic starta here
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  let roomId;
  selectedChat ? (roomId = selectedChat._id) : (roomId = "");
  let userId = userData.token._id;

  useEffect(() => {
    if (!roomId) return; // ✅ IMPORTANT FIX

    socket.emit("joinRoom", roomId);

    axios
      .get(`${BASE_URL}/api/chat/messages/${roomId}`)
      .then((res) => {
        setMessages(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));

    return () => {
      socket.emit("leaveRoom", roomId);
    };
  }, [roomId]);

  // receive message
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
      // 🔊 play only if message is from OTHER user
      if (msg.sender._id !== userId) {
        receiveSoundRef.current?.play();
      }
    });
    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = () => {
    console.log(text);

    socket.emit("sendMessage", {
      roomId,
      senderId: userId,
      message: text,
    });
    sendSoundRef.current?.play(); // 🔊 play send sound

    setText("");
  };

  //Chat logic End

  //chat Container logic

  const chatRef = useRef();

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  //Add Click thumb
  const scrollToTop = () => {
    chatRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  //Speech Reconigation

  const handleMicClick = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop(); // stop manually
    } else {
      recognitionRef.current.start(); // start listening
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false; // auto stop
    recognition.interimResults = true; // live typing
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setText(transcript); // ✅ fill input
    };

    recognitionRef.current = recognition;
  }, []);

  function IconButton({ icon, label, color }) {
    return (
      <div className="relative group flex flex-col items-center">
        <button
          className={`${color} text-white p-3 rounded-lg hover:scale-105 transition`}
        >
          {icon}
        </button>

        {/* TOOLTIP */}

        <span className="absolute top-12 scale-0 group-hover:scale-100 transition bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {label}
        </span>
      </div>
    );
  }

  // 🔹 NO CHAT SELECTED
  if (!selectedChat && !isMobile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <img
            className="w-250 mx-auto mb-6"
            src="/photo/Nochatimg.png"
            alt="No chat"
          />

          <h2 className="text-3xl font-semibold text-gray-600">
            No chat selected
          </h2>

          <p className="text-gray-400 mt-2">
            Select a conversation to start messaging
          </p>
        </div>
      </div>
    );
  }

  if (!selectedChat && isMobile && !sidebarOpen) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <img
            className="w-250 mx-auto mb-6"
            src="/photo/Nochatimg.png"
            alt="No chat"
          />
          <h2 className="text-3xl font-semibold text-gray-600">
            No chat selected
          </h2>
          <p className="text-gray-400 mt-2">
            Select a conversation to start messaging
          </p>
        </div>
      </div>
    );
  }

  // 🔹 CHAT SELECTED UI
  if (selectedChat) {
    return (
      <>
        <div
          className={`${
            isMobile && !selectedChat ? "hidden" : "flex"
          } flex-1 flex-col bg-gray-100 mx-2 mb-2 mt-2 overflow-hidden min-h-0`}
        >
          {/* HEADER */}

          <div className="flex justify-between items-center bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-[0_8px_25px_rgba(0,0,0,0.100)]">
            {/* LEFT */}

            <div className="flex items-center gap-4">
              {isMobile && (
                <button
                  onClick={() => (setSidebarOpen(true), setSelectedChat(null))}
                  className="text-xl"
                >
                  {/* ← */}
                  <ArrowLeft size={24} />
                </button>
              )}

              <h2 className="text-2xl zigzagText font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent cursor-pointer">
                {selectedChat.name}
              </h2>
            </div>

            {/* RIGHT ICONS */}

            <div className="flex items-center gap-4">
              {!isMobile && (
                <>
                  <div onClick={fetchUsers}>
                    <IconButton
                      icon={<FaUserPlus />}
                      label="Add User"
                      color="bg-blue-600"
                    />
                  </div>
                  <div onClick={fetchParticularRoomusers}>
                    <IconButton
                      icon={<FaUserMinus />}
                      label="Remove User"
                      color="bg-red-500"
                    />
                  </div>
                  <div onClick={handleVideoCall}>
                    <IconButton
                      icon={<FaVideo />}
                      label="Video Call"
                      color="bg-blue-600"
                    />
                  </div>
                  <div onClick={DeleteRoom}>
                    <IconButton
                      icon={<FaSignOutAlt />}
                      label="Exit Room"
                      color="bg-red-500"
                    />
                  </div>
                  <IconButton
                    icon={<FaLock />}
                    label="Lock Room"
                    color="bg-red-500"
                  />
                </>
              )}
              {/* //mobile iconsAdd ... menu for mobile */}
              {isMobile && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="text-2xl"
                  >
                    {/* ⋮ */}
                    <MoreVertical size={24} />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 top-10 bg-white shadow-lg rounded-lg w-40 p-2 flex flex-col gap-2">
                      <button onClick={fetchUsers}>Add User</button>
                      <button onClick={fetchParticularRoomusers}>
                        Remove User
                      </button>
                      <button onClick={handleVideoCall}>Video Call</button>
                      <button onClick={DeleteRoom}>Exit Room</button>
                      <button>Lock Room</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* CHAT AREA */}

          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto min-h-0 p-4 space-y-3 bg-gray-50 scrollbar-hide"
          >
            {messages.length ? (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    String(msg.sender._id) === String(userId)
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 max-w-xs rounded-lg ${
                      String(msg.sender._id) === String(userId)
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">No messages yet</p>
            )}
          </div>

          <button
            onClick={scrollToTop}
            className="fixed bottom-24 right-10 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700"
          >
            <FaArrowUp />
          </button>

          {/* INPUT AREA */}

          <div className="flex items-center gap-3 bg-white p-3 ">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border border-gray-200 rounded-md px-3 py-2 outline-none"
              onChange={(e) => setText(e.target.value)}
              value={text}
            />

            <button
              onClick={handleMicClick}
              className={`p-3 rounded-lg transition ${
                isListening
                  ? "bg-red-500 animate-pulse" // 🔴 blinking effect
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              <FaMicrophone />
            </button>

            <button
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
              onClick={sendMessage}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-gray-40 bg-opacity-10 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white w-[450px] rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Add Users</h2>

              <div className="max-h-60 overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="flex justify-between items-center font-bold   py-2"
                  >
                    <span className="bg-gray-200">{user.name}</span>

                    <input
                      type="checkbox"
                      onChange={() => handleSelectUser(user._id)}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={addUsersToRoom}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RemoveShow Model */}

        {showRemoveModal && (
          <div className="fixed inset-0 bg-gray-40 bg-opacity-10 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white w-[450px] rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Remove Users</h2>

              <div className="max-h-60 overflow-y-auto">
                {Roomusers.map((user) => (
                  <div
                    key={user._id}
                    className="flex justify-between items-center font-bold   py-2"
                  >
                    <span className="bg-gray-200">{user.name}</span>

                    <input
                      type="checkbox"
                      onChange={() => handleSelectRoomUser(user._id)}
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setRemoveShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={RemoveUsersToRoom}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        <audio ref={sendSoundRef} src="/Send.mp3" />
        <audio ref={receiveSoundRef} src="/Recive.mp3" />
      </>
    );
  }
}
