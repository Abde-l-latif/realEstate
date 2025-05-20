import React from "react";
import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  signinfailure,
  signinsuccess,
  signinloading,
} from "../redux/user/userSlice.js";
import GoogleButton from "../components/GoogleButton.jsx";
import { svg, parent, fill } from "../styles/waves.module.css";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.user);
  const handelChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handelPostAuthSignin = async (e) => {
    try {
      e.preventDefault();
      dispatch(signinloading());
      const data = await fetch("/api/auth/signin", {
        method: "post",
        body: JSON.stringify(formData),
        headers: {
          "content-type": "application/json",
        },
      });
      const res = await data.json();
      if (res.success == false) {
        dispatch(signinfailure(res.message));
        return;
      }
      dispatch(signinsuccess(res));
      navigate("/");
    } catch (error) {
      dispatch(signinfailure(error.message));
    }
  };

  return (
    <>
      <div className="pt-20">
        <h1 className="text-center my-5 text-2xl font-bold text-slate-700">
          Sign-in
        </h1>
        <div className="flex flex-col items-center">
          <form
            onSubmit={handelPostAuthSignin}
            className="flex flex-col max-w-96 gap-2 min-w-72 md:min-w-96"
          >
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
              {loading ? "LOADING..." : "SIGN IN"}
            </button>
            <GoogleButton />
          </form>
          <p className="mt-3 text-base">
            dont have an account ?
            <Link to="/sign-up">
              <span className="text-blue-600 mx-2 font-medium hover:underline">
                Sign up
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
