import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import Navbar from "../../components/Navbar";
import axiosInstance from "../../utils/axiosInstance";
import { validateEmail } from "../../utils/helper";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate()


  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    if(!password){
      setError("Please enter a password");
    }

    setError("")

    //Login Api Call
    try {
      const response = await axiosInstance.post("/login",{
        email:email,
        password:password,
      })

      if(response.data && response.data.accessToken){
        localStorage.setItem("token",response.data.accessToken)
        navigate("/")
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }else{
        setError("Something went wrong");
      }
    }

  }
  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center mt-32">
        <div className=" w-96 border rounded-md py-12 px-8">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-8">Login</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)}/>


            {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
            <button
              type="submit"
              className="btn-primary"
            >
              Login
            </button>

            <p className="text-sm text-center mt-2">
              Don't have an account?{" "}
              <Link to={'/signUp'} className=" text-primary underline">Create an Account</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
