import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { UseFormRegister } from "react-hook-form";
import { LoginAccountFormData } from "@/schema/login.schema";

interface PasswordInputProps {
  className?: string;
  register?: UseFormRegister<LoginAccountFormData>,
  name: keyof LoginAccountFormData,
  placeholder?: string,
  id?: string
}

const PasswordInput: React.FC<PasswordInputProps> = ({ className = "", register, id, name = "password", placeholder ="Enter your password" }) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev)
  }

  return (
    <div className="relative w-full">
      <input
        type={isPasswordVisible ? "text" : "password"}
        {...(register ? register(name) : {})}
        placeholder={placeholder}
        id={id}
        className={`border border-gray-200 rounded-md p-4 text-sm block w-full outline-none focus:ring-2
                      transition-all duration-200 pr-12 ${className}`}
      />

      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-red-500 focus:outline-none"
        aria-label={isPasswordVisible ? "Hide password" : "Show password"}
      >
        {isPasswordVisible ? (
          <Icon icon="ph:eye-bold" width="20" height="20" />
        ) : (
          <Icon icon="ion:eye-off" width="20" height="20" />
        )}
      </button>
    </div>
  )
}

export default PasswordInput;
