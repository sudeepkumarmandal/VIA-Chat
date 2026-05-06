import { ct } from "../../app/App";
import ChatSidebar from "../chat/ChatSiderbar";
import ChatWindow from "../chat/ChatWindow";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import VideoCall from "../components/VideoCall";
import socket from "../socket/socket";
import IncomingCall from "../components/IncomingCall";
import Cookies from "js-cookie";
export default function ChatPage() {
  let obj = useContext(ct);
  let navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(null);

  const { sidebarOpen, setSidebarOpen } = useOutletContext();
  const [Refresh, setRefresh] = useState(false);
  const [CallIs, setCalls] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callData, setCallData] = useState(null);
  const [callTimeout, setCallTime] = useState(null);
  const [calling, setCalling] = useState(false);
  const [timeLeftofline, setTimeLeftOfline] = useState(5);
  const [usersInRoom, setUsersInRoom] = useState([]);
  //   userId = "";
  let roomId = callData?.roomId || selectedChat?._id;
  let userId = selectedChat?.createdBy?._id;

  //when video call is on that time sidebar close

  useEffect(() => {
    const savedAuth = Cookies.get("auth");
    if (!obj.token && !savedAuth) {
      navigate("/login");
    }
  }, []);

  if (selectedChat) {
    roomId = selectedChat._id;

    userId = selectedChat.createdBy._id;
  }

  const refreshSidebar = () => {
    setRefresh((prev) => !prev);
  };
  useEffect(() => {
    if (obj?.token?._id) {
      socket.emit("register", obj.token._id);
    }
  }, [obj]);

  useEffect(() => {
    socket.on("incomingCall", (data) => {
      setIncomingCall(data);
      setCalling(false);
    });

    socket.on("callAccepted", ({ roomId }) => {
      setCalls(true); // open video
      setCalling(false); // stop ringing
      setCallData({ roomId });
    });

    socket.on("callRejected", () => {
      alert("User rejected your call");
      setCalls(false);
      setCalling(false); // stop calling UI
      setCallTime(null);
    });

    socket.on("userOffline", () => {
      setTimeout(() => {
        alert("User is offline");
        setCallTime(null);

        setCalls(false); // close video screen (optional)
      }, 20000);

      setCalling(false); // stop calling UI
    });

    return () => {
      socket.off("incomingCall");
      socket.off("callAccepted");
      socket.off("callRejected");
      socket.off("userOffline");
    };
  }, []);

  const acceptCall = () => {
    socket.emit("acceptCall", {
      to: incomingCall.from,
      roomId: incomingCall.roomId,
    });

    setCalls(true);
    setCallData(incomingCall);
    setIncomingCall(null);
  };
  //AUTO REJECT (TIMEOUT)
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (!incomingCall) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);

          if (incomingCall) {
            rejectCall();
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [incomingCall]);

  //RESET TIMER
  useEffect(() => {
    if (incomingCall) {
      setTimeLeft(10); // reset timer
    }
  }, [incomingCall]);

  const rejectCall = () => {
    socket.emit("rejectCall", {
      to: incomingCall.from,
    });

    setIncomingCall(null);
    setCalling(false);
  };

  useEffect(() => {
    if (callTimeout) {
      setCalling(true); // show "Calling..."
      setCalls(true);
    }
  }, [callTimeout]);

  return (
    <>
      {/* ✅ ALWAYS RENDER (but hide when call active) */}
      <div className={CallIs ? "hidden" : "flex w-full"}>
        {sidebarOpen && (
          <ChatSidebar
            Refresh={Refresh}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
          />
        )}

        <ChatWindow
          refreshSidebar={refreshSidebar}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          setCallTime={setCallTime}
          setSidebarOpen={setSidebarOpen}
          setUsersInRoom={setUsersInRoom}
        />
      </div>

      {/* 🟣 INCOMING CALL POPUP */}
      <IncomingCall
        callData={incomingCall}
        onAccept={acceptCall}
        onReject={rejectCall}
      />

      {/* ✅ OVERLAY VIDEO CALL */}
      {CallIs && (
        <div className="fixed inset-0 z-50">
          <VideoCall
            roomId={roomId}
            userId={userId}
            setCalls={setCalls}
            setSidebarOpen={setSidebarOpen}
            setCallTime={setCallTime}
            usersInRoom={usersInRoom}
          />
        </div>
      )}
    </>
  );
}
