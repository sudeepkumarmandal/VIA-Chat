import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ChatPage from "../client/pages/ChatPage";
import LoginPage from "../client/pages/LoginPage";
import RegisterPage from "../client/pages/RegisterPage";

export default function RoutesConfig() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<MainLayout />}>
        <Route path="chatpage" element={<ChatPage />} />
      </Route>
    </Routes>
  );
}
