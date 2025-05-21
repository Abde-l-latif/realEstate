import React from "react";
import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";
import { svg, parent, fill } from "../styles/waves.module.css";
export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handelChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handelPostAuthSignup = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const data = await fetch("/api/auth/signup", {
        method: "post",
        body: JSON.stringify(formData),
        headers: {
          "content-type": "application/json",
        },
      });
      const res = await data.json();
      setLoading(false);
      if (res.success == false) {
        setError(res.message);
        return;
      }
      setError(null);
      navigate("/sign-in");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <div className="pt-14">
        <h1 className="text-center my-5 text-2xl font-bold text-slate-700">
          {" "}
          Sign-up{" "}
        </h1>
        <div className="flex flex-col items-center">
          <form
            onSubmit={handelPostAuthSignup}
            className="flex flex-col max-w-96 gap-2 min-w-72 md:min-w-96"
          >
            <input
              type="text"
              placeholder="username..."
              id="name"
              className="border  p-2 rounded-lg text-sm outline-none"
              onChange={handelChange}
            />
            <input
              type="email"
              placeholder="email..."
              id="email"
              className="border  p-2 rounded-lg outline-none text-sm"
              onChange={handelChange}
            />
            <input
              type="password"
              placeholder="password..."
              id="password"
              className="border  p-2 rounded-lg outline-none text-sm"
              onChange={handelChange}
            />
            <button
              disabled={loading}
              className="bg-slate-700 text-white p-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-80"
            >
              {loading ? "LOADING..." : "SIGN UP"}
            </button>
          </form>
          <p className="mt-3 text-base">
            have an account ?
            <Link to="/sign-in">
              <span className="text-blue-600 mx-2 font-medium hover:underline">
                Sign in
              </span>
            </Link>
          </p>
          <div
            className={
              error ? "p-2 bg-red-300 rounded-md w-96 text-center mt-3" : null
            }
          >
            <p className="text-red-600"> {error} </p>
          </div>
        </div>
      </div>
      <div className={parent}>
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className={svg}
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className={fill}
          ></path>
        </svg>
      </div>
    </>
  );
}
