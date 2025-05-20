import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

export default function PrivateProfile() {
  const { userInfo } = useSelector((state) => state.user);
  return (
    <div>{userInfo ? <Outlet /> : <Navigate to="/sign-in"></Navigate>}</div>
  );
}
