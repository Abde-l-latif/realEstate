import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  uploadSuccess,
  uploadLoading,
  uploadfailure,
  DeleteSuccess,
  DeleteLoading,
  Deletefailure,
  signOutfailure,
  signOutLoading,
  signOutSuccess,
} from "../redux/user/userSlice";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";

export default function Profile() {
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [eerror, setError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updatesuccess, setupdatesuccess] = useState(false);
  const fileref = useRef(null);
  const { userInfo, error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [errorListing, setErrorListing] = useState(false);
  const [getListings, setGetListings] = useState([]);

  useEffect(() => {
    if (file) {
      handelchangeimage(file);
    }
  }, [file]);

  const handelchangeimage = (file) => {
    const storage = getStorage(app);
    const fileName = file.name;
    const refStorage = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(refStorage, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setError(true);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(uploadLoading());
      const PostUpdate = await fetch(`/api/user/updateUser/${userInfo._id}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const res = await PostUpdate.json();
      if (res.success === false) return dispatch(uploadfailure(res.message));
      dispatch(uploadSuccess(res));
      setupdatesuccess(true);
    } catch (error) {
      dispatch(uploadfailure(error.message));
    }
  };

  const handelSignOut = async () => {
    try {
      dispatch(signOutLoading());
      const SIGNOUT = await fetch("/api/auth/signout");
      const res = await SIGNOUT.json();
      if (res.success === false) {
        return dispatch(signOutfailure(res.message));
      }
      dispatch(signOutSuccess(res));
    } catch (error) {
      dispatch(signOutfailure(error));
    }
  };

  const DeleteAccount = async () => {
    try {
      dispatch(DeleteLoading());
      const Delete = await fetch(`/api/user/deleteUser/${userInfo._id}`, {
        method: "DELETE",
      });
      await Delete.json();
      dispatch(DeleteSuccess(false));
    } catch (error) {
      dispatch(Deletefailure(error));
    }
  };

  const showListings = async () => {
    try {
      const getLists = await fetch(`/api/listing/listings/${userInfo._id}`);
      const data = await getLists.json();
      if (data.success === false) {
        return setErrorListing(true);
      }
      setGetListings(data.getListings);
    } catch (error) {
      console.log(error);
      setErrorListing(true);
    }
  };

  const deleteList = async (listId) => {
    try {
      await fetch(`/api/listing/delete/${listId}`, { method: "DELETE" });
      setGetListings(getListings.filter((filtry) => filtry._id !== listId));
    } catch (error) {
      console.log(error);
      setErrorListing(true);
    }
  };

  return (
    <>
      <div className="pt-10 px-2 flex justify-center">
        <div className="p-1">
          <h1 className="text-center my-5 text-2xl font-bold text-slate-700">
            Profile
          </h1>
          <div className="md:flex-row gap-3 flex-col flex">
            <div className="flex items-center flex-col ">
              <form
                className="w-[300px] sm:w-[350px]  flex flex-col items-center gap-3"
                onSubmit={handelSubmit}
              >
                <input
                  type="file"
                  ref={fileref}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                />
                <img
                  className="rounded-full mt-2 cursor-pointer w-40 h-40 object-cover"
                  src={formData.avatar || userInfo.avatar}
                  alt="profile"
                  onClick={() => fileref.current.click()}
                />
                {filePerc > 0 && filePerc < 100 ? (
                  <p className="text-slate-600"> uploading {filePerc} % </p>
                ) : filePerc == 100 ? (
                  <p className="text-green-600">
                    image has been uploaded seccussfully !!
                  </p>
                ) : eerror == true ? (
                  <p className="text-red-600">
                    an error is being display and the image has to be less the
                    2(MB){" "}
                  </p>
                ) : (
                  ""
                )}
                <input
                  className="border p-1 outline-none w-full text-sm rounded-sm"
                  type="text"
                  placeholder="userName ..."
                  id="userName"
                  defaultValue={userInfo.name}
                  onChange={(e) => {
                    setFormData({ ...formData, [e.target.id]: e.target.value });
                  }}
                />
                <input
                  className="border p-1 outline-none w-full text-sm rounded-sm"
                  type="email"
                  placeholder="email ..."
                  defaultValue={userInfo.email}
                  id="email"
                  onChange={(e) => {
                    setFormData({ ...formData, [e.target.id]: e.target.value });
                  }}
                />
                <input
                  className="border p-1 outline-none w-full text-sm rounded-sm"
                  type="password"
                  placeholder="password ..."
                  id="password"
                  onChange={(e) => {
                    setFormData({ ...formData, [e.target.id]: e.target.value });
                  }}
                />
                <button
                  disabled={loading}
                  className="bg-slate-700 p-2 text-white w-full rounded-sm font-medium hover:opacity-95"
                >
                  {loading ? "Loading..." : "UPDATE"}
                </button>

                <Link
                  to="/create-listing"
                  className="bg-green-700 p-2 text-white w-full rounded-sm font-medium hover:opacity-95 text-center"
                >
                  Create Listing
                </Link>
              </form>
              <div className="flex justify-between text-red-600 mt-3 w-[300px] sm:w-[350px]  font-medium">
                <p
                  className="cursor-pointer hover:text-red-700"
                  onClick={DeleteAccount}
                >
                  Delete Account
                </p>
                <p
                  className="cursor-pointer hover:text-red-700"
                  onClick={handelSignOut}
                >
                  Sign out
                </p>
              </div>
              <p
                className="text-center text-green-700 font-semibold cursor-pointer border border-green-700 p-2 mt-3 rounded hover:shadow-lg"
                onClick={showListings}
              >
                {" "}
                Show Listings{" "}
              </p>
              <p
                className={
                  error
                    ? "text-red-500 border-red-500 border p-2 mt-5 w-full text-center"
                    : ""
                }
              >
                {error ? error.message : ""}
              </p>
              <p
                className={
                  updatesuccess
                    ? "text-green-500 border-green-500 border p-2 mt-5 w-full text-center"
                    : ""
                }
              >
                {updatesuccess
                  ? "the account has been updated successfully"
                  : ""}
              </p>
            </div>
            {getListings && getListings.length > 0 && (
              <div className="w-[300px] sm:w-96 flex flex-col gap-2 items-center bg-transparent p-2 rounded">
                <h1 className="text-slate-500 font-semibold"> Listings</h1>
                {getListings.map((list, index) => {
                  return (
                    <div
                      key={index}
                      className=" rounded bg-white/30 p-2 flex items-center justify-between w-full"
                    >
                      <Link to={`/listing/${list._id}`}>
                        <img
                          src={list.imgUrl[0]}
                          alt="image"
                          className="w-20 h-20 object-contain"
                        />
                      </Link>
                      <Link to={`/listing/${list._id}`}>
                        <p className="w-[100px] truncate"> {list.name} </p>
                      </Link>
                      <div className="flex flex-col">
                        <button
                          onClick={() => {
                            deleteList(list._id);
                          }}
                          className="text-red-700 font-semibold hover:opacity-90"
                        >
                          {" "}
                          DELETE{" "}
                        </button>
                        <Link to={`/updateList/${list._id}`}>
                          <button className="text-green-700 font-semibold hover:opacity-90">
                            EDIT
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
                <p className="text-red-700"> {errorListing && errorListing} </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
