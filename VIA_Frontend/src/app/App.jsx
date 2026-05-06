import RoutesConfig from "./routes";
import { createContext, useState } from "react";
export const ct = createContext({});
import Cookies from "js-cookie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  const savedAuth = Cookies.get("auth");
  const initialToken = savedAuth ? JSON.parse(savedAuth) : null;
  const [token, setToken] = useState(initialToken);
  const updateToken = (Data) => {
    setToken(Data);
  };

  let obj = { token: token, updateToken: updateToken };
  return (
    <>
      <ToastContainer position="top-center" autoClose={5000} />

      <ct.Provider value={obj}>
        <RoutesConfig />
      </ct.Provider>
    </>
  );
}

export default App;
