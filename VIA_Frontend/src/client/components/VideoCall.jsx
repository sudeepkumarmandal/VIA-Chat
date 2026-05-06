import { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import socket from "../socket/socket";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { BASE_URL } from "../../config";
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

function VideoCall({
  roomId,
  userId,
  isVideoCall = true,
  setCalls,
  usersInRoom,
  setCallTime,
}) {
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [remoteVideoStatus, setRemoteVideoStatus] = useState({});

  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const isSingleUser = remoteUsers.length === 1;

  const appId = "19e08d3f4ac840878e0e3acc45cf1da7";
  const uid = userId
    ? Number(userId.slice(-6), 16) % 100000
    : Math.floor(Math.random() * 100000);

  const handleMicToggle = () => {
    if (!localTracks[0]) return; // 🔥 safety

    const audioTrack = localTracks[0];

    audioTrack.setEnabled(!micOn);
    setMicOn(!micOn);
  };

  const handleVideoToggle = () => {
    console.log("click the vido call");

    if (!localTracks[1]) return;

    const videoTrack = localTracks[1];

    if (videoOn) {
      videoTrack.setEnabled(false);
      setVideoOn(false);
    } else {
      videoTrack.setEnabled(true);
      setVideoOn(true);

      // 🔥 wait for DOM update
      setTimeout(() => {
        videoTrack.play("local-player");
      }, 100);
    }
  };

  useEffect(() => {
    socket.on("callEnded", async () => {
      await cleanupCall();
    });

    return () => socket.off("callEnded");
  }, [localTracks]);

  // Extract cleanup logic into reusable function
  const cleanupCall = async () => {
    localTracks.forEach((track) => track.stop());
    localTracks.forEach((track) => track.close());
    await client.leave();
    setRemoteUsers([]);
    setLocalTracks([]);
    setRemoteVideoStatus({});
    setMicOn(true);
    setVideoOn(true);
    setCallTime(null);
    setCalls(false);
  };

  const handleEndCall = async () => {
    socket.emit("endCall", { roomId, usersInRoom }); // 🔥 notify others
    await cleanupCall();
  };

  // ✅ KEY FIX: Re-play remote video whenever remoteUsers or remoteVideoStatus changes
  useEffect(() => {
    remoteUsers.forEach((user) => {
      if (remoteVideoStatus[user.uid] && user.videoTrack) {
        setTimeout(() => {
          user.videoTrack.play(`remote-${user.uid}`);
        }, 100);
      }
    });
  }, [remoteUsers, remoteVideoStatus]);

  useEffect(() => {
    if (!roomId) return; //
    const init = async () => {
      try {
        const uid = Math.floor(Math.random() * 100000);

        const res = await axios.post(`${BASE_URL}/api/agora/token`, {
          channelName: roomId,
          uid,
        });

        const token = res.data.token;

        await client.join(appId, roomId, token, uid);

        const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        setLocalTracks(tracks);

        await client.publish(tracks);

        setTimeout(() => {
          tracks[1].play("local-player");
        }, 100);

        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);

          setRemoteUsers((prev) => {
            if (prev.find((u) => u.uid === user.uid)) return prev;
            return [...prev, user];
          });

          if (mediaType === "video") {
            setTimeout(() => {
              user.videoTrack.play(`remote-${user.uid}`);
            }, 100);
          }

          if (mediaType === "audio") {
            user.audioTrack.play();
          }

          if (mediaType === "video") {
            setRemoteVideoStatus((prev) => ({
              ...prev,
              [user.uid]: true, // camera ON
            }));
          }
        });

        client.on("user-unpublished", (user, mediaType) => {
          if (mediaType === "video") {
            setRemoteVideoStatus((prev) => ({
              ...prev,
              [user.uid]: false, // camera OFF
            }));
          }
        });

        client.on("user-left", (user) => {
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        });
      } catch (err) {
        console.error(err);
      }
    };

    init();

    return () => {
      client.removeAllListeners();
    };
  }, [roomId]);

  return (
    <div className="h-screen w-screen bg-black relative flex flex-col overflow-hidden group">
      {/* 🔵 MAIN SCREEN */}
      <div className="flex-1 relative">
        {/* ✅ AUDIO CALL UI */}
        {!isVideoCall && (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center text-4xl">
              🎤
            </div>
            <p className="mt-4 text-lg">Audio Call</p>
          </div>
        )}

        {/* ✅ VIDEO CALL UI */}
        {isVideoCall && (
          <>
            {isSingleUser && (
              <div className="w-full h-full flex items-center justify-center bg-black">
                {remoteVideoStatus[remoteUsers[0].uid] ? (
                  <div
                    id={`remote-${remoteUsers[0].uid}`}
                    className="w-full h-full text-2xl " //animate-pulse
                  >
                    {/* 📞 Calling... */}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-white">
                    <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center text-4xl">
                      {/* 📷 */}
                      <VideoOff size={32} />
                    </div>
                    <p className="mt-3 text-lg">Camera Off</p>
                  </div>
                )}
              </div>
            )}

            {/* 🔥 MULTIPLE USERS GRID */}
            {!isSingleUser && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 h-full">
                {remoteUsers.map((user) => (
                  <div
                    key={user.uid}
                    className="bg-gray-800 rounded-xl flex items-center justify-center"
                  >
                    {remoteVideoStatus[user.uid] ? (
                      <div
                        id={`remote-${user.uid}`}
                        className="w-full h-full"
                      ></div>
                    ) : (
                      <div className="text-white text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gray-600 flex items-center justify-center text-2xl">
                          {/* 📷 */}
                          <VideoOff size={32} />
                        </div>
                        <p className="mt-2 text-sm">Camera Off</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* 🟢 LOCAL VIDEO (TOP RIGHT SMALL) */}
        {isVideoCall && (
          <div className="absolute top-4 right-4 w-32 h-40 bg-gray-700 rounded-xl border-2 border-white flex items-center justify-center">
            {/* 🔥 ALWAYS KEEP VIDEO CONTAINER */}
            <div
              id="local-player"
              className={`w-full h-full ${videoOn ? "block" : "hidden"}`}
            ></div>

            {/* 🔥 SHOW ICON WHEN CAMERA OFF */}
            {!videoOn && (
              <div className="absolute text-white text-center">
                <div className="text-2xl">
                  {/* 📷 */}
                  <VideoOff size={32} />
                </div>
                <p className="text-xs">Camera Off</p>
              </div>
            )}
          </div>
        )}

        {/* 🟢 LOCAL AUDIO ICON (TOP RIGHT) */}
        {!isVideoCall && (
          <div className="absolute top-4 right-4 w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-white">
            🎧
          </div>
        )}
      </div>

      {/* 🔻 CONTROLS */}
      <div
        className="
            h-24 flex items-center justify-center gap-6
            absolute bottom-0 w-full
            bg-gray-900/60 backdrop-blur-md
            transition-all duration-300
            opacity-100 md:opacity-0 md:group-hover:opacity-100
          "
      >
        {/* 🎤 MIC TOGGLE */}
        <button
          onClick={handleMicToggle}
          className={`p-4 rounded-full ${micOn ? "bg-gray-700" : "bg-red-600"}`}
        >
          {micOn ? (
            <Mic className="text-white" />
          ) : (
            <MicOff className="text-white" />
          )}
        </button>

        {/* 🎥 VIDEO TOGGLE (ONLY VIDEO CALL) */}
        {isVideoCall && (
          <button
            onClick={handleVideoToggle}
            className={`p-4 rounded-full ${
              videoOn ? "bg-gray-700" : "bg-red-600"
            }`}
          >
            {videoOn ? (
              <Video className="text-white" />
            ) : (
              <VideoOff className="text-white" />
            )}
          </button>
        )}

        {/* ❌ END CALL */}
        <button className="p-4 rounded-full bg-red-600" onClick={handleEndCall}>
          <PhoneOff className="text-white" />
        </button>
      </div>
    </div>
  );
}

export default VideoCall;
