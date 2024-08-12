import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Name is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }
    setError('')

    //signup api call here 
    try {
      const response = await axiosInstance.post("/create-account",{
        email:email,
        fullName:name,
        password:password,
      })

      //handle successful registration response
      if(response.data && response.data.error){
        setError(response.data.message);
        return
      }

      if(response.data && response.data.accessToken){
        localStorage.setItem("token",response.data.accessToken)
        navigate("/login")
      }

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }else{
        setError("Something went wrong");
      }
    }
  };
  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center mt-32">
        <div className=" w-96 border rounded-md py-12 px-8">
          <form onSubmit={handleSignUp}>

          <h4 className="text-2xl mb-8">SignUp</h4>
          <input
            type="text"
            placeholder="Name"
            className="input-box"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Email"
            className="input-box"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
          <button type="submit" className="btn-primary">
            SignUp
          </button>

          <p className="text-sm text-center mt-2">
            Already have an account?{" "}
            <Link to={"/login"} className=" text-primary underline">
              Login
            </Link>
          </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
