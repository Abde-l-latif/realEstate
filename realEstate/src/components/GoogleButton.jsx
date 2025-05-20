// import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import { signinsuccess } from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

export default function GoogleButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handelOauth = async () => {
    try {
      const Provider = new GoogleAuthProvider();
      Provider.setCustomParameters({
        prompt: "select_account",
      });
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, Provider);
      const { displayName, email, photoURL } = result.user;
      const PostGoogleAuth = await fetch("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ name: displayName, email, photo: photoURL }),
        headers: {
          "content-type": "application/json",
        },
      });
      const data = await PostGoogleAuth.json();
      dispatch(signinsuccess(data));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="text-white bg-red-600 p-2 font-semibold text-center rounded-md hover:opacity-90 cursor-pointer"
      onClick={handelOauth}
    >
      <button type="button"> Connect with google </button>
    </div>
  );
}
