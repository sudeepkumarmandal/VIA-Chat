import { useNavigate, Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { ct } from "../../app/App";
import Cookies from "js-cookie";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";


export default function LoginPage() {
  const navigate = useNavigate();
  const obj = useContext(ct);

  const [success, setSuccess] = useState();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitL = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, formData);
      // setSuccess("successfully Login 🎉 ");
      toast.success("successfully Login 🎉");

      const userData = {
        token: res.data.token,
        name: res.data.user.name,
        _id: res.data.user._id,
      };
      obj.updateToken({
        token: res.data.token,
        name: res.data.user.name,
        _id: res.data.user._id,
      });

      // Save to cookie — expires in 7 days

      Cookies.set("auth", JSON.stringify(userData), {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });

      navigate("/chatpage");
    } catch (err) {
       toast.error("Login Failed ❌");
      // setSuccess("Error Login  ");
    }
  };

  useEffect(() => {
    if (obj.token) {
      navigate("/chatpage");
    }
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-primary">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        {success && (
          <div className="flex items-center justify-center mb-4 p-3 bg-green-100 text-green-600 rounded-lg text-sm">
            {success}
          </div>
        )}
        <h2 className="text-2xl font-semibold mb-6">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg"
          name="email"
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border rounded-lg"
          name="password"
          onChange={handleChange}
        />

        <button
          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700"
          onClick={handleSubmitL}
        >
          Login
        </button>
        <p className="text-center text-sm text-gray-500 mt-6">
          if Account does'nt exist ?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
           Don’t have an account? Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
