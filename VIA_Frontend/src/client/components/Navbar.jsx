import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ct } from "../../app/App";
import { Menu, X } from "lucide-react";
import Cookies from "js-cookie";
export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const obj = useContext(ct);
  const nagviate = useNavigate();

  const logoutFun = () => {
    Cookies.remove("auth");
    obj.updateToken(null);

    nagviate("/");
  };

  return (
    <div className="h-16 bg-primary text-white flex items-center justify-between px-6 shadow-md flex-shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <h1 className="text-lg md:text-xl font-semibold hidden sm:block">
          VIA - Video Interaction App
        </h1>
      </div>

      <div className="flex gap-4">
        <button
          className="bg-black px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          onClick={() =>
            window.open("https://github.com/sudeepkumarmandal/VIA-Chat", "_blank")
          }
        >
          GitHub
        </button>
        <button
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
          onClick={logoutFun}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
