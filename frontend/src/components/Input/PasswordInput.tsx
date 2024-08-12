import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, SetIsShowPassword] = useState(false);

  const togglePassword = () => {
    SetIsShowPassword(!isShowPassword);
  };

  return (
    <div className=" flex items-center bg-transparent border-2 px-5 rounded-md mb-4 ">
      <input
        type={isShowPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Password"}
        className="w-full text-sm bg-transparent py-2 mr-2 outline-none"
      />

      {isShowPassword ? (
        <FaRegEyeSlash
          size={22}
          className="text-primary cursor-pointer"
          onClick={() => togglePassword()}
        />
      ) : (
        <FaRegEye
          size={22}
          className="text-primary cursor-pointer"
          onClick={() => togglePassword()}
        />
      )}
    </div>
  );
};

export default PasswordInput;
