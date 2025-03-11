import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Field Validation Function
  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      error = `${name} is required`;
    } else if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = "Invalid email format";
      }
    } else if (name === "password") {
      if (value.length < 6) {
        error = "Password must be at least 6 characters long";
      }
    } else if (name === "username") {
      if (value.length < 3) {
        error = "Username must be at least 3 characters long";
      }
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(value)) {
        error = "Username can only contain letters, numbers, and underscores";
      }
    }
    return error;
  };

  // Handle Input Change and Validate Field
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    setErrors({ ...errors, [id]: validateField(id, value) });
  };

  // Validate the Entire Form Before Submission
  const validateForm = () => {
    let newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        toast.error(data.message || "Something went wrong!");
        return;
      }
      toast.success("Account created successfully!");
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "Something went wrong!");
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-bold my-7 text-white">Sign up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            placeholder="Username"
            id="username"
            className={`bg-slate-300 p-3 rounded-lg w-full ${errors.username ? "border border-red-500" : ""}`}
            onChange={handleChange}
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            id="email"
            className={`bg-slate-300 p-3 rounded-lg w-full ${errors.email ? "border border-red-500" : ""}`}
            onChange={handleChange}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            id="password"
            className={`bg-slate-300 p-3 rounded-lg w-full ${errors.password ? "border border-red-500" : ""}`}
            onChange={handleChange}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-2 mt-5 text-white">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-500">Sign in</span>
        </Link>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default Signup;
