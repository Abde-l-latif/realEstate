import React, { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { svg, parent, fill } from "../styles/waves.module.css";
import { useNavigate, useParams } from "react-router";

export default function UpdateListing() {
  const navigate = useNavigate();
  const [files, setFile] = useState([]);
  const { userInfo } = useSelector((state) => state.user);
  const { id } = useParams();

  const [FormData, setFormData] = useState({
    imgUrl: [],
    type: "rent",
    name: "",
    description: "",
    address: "",
    regularPrice: 0,
    discountPrice: 0,
    furnished: false,
    parking: false,
    bedrooms: 1,
    bathrooms: 1,
    offer: false,
    userRef: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [handelError, setHandelError] = useState(false);
  const [handelSubmitError, setHandelSubmitError] = useState(false);

  useEffect(() => {
    const getDataListing = async () => {
      try {
        const data = await fetch(`/api/listing/getting/${id}`);
        const res = await data.json();
        setFormData(res);
      } catch (error) {
        console.log(error);
      }
    };
    getDataListing();
  }, []);

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject(error);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handelSubmitImage = () => {
    if (files.length < 7 && files.length > 0) {
      setLoading(true);
      const promises = [];
      for (let i = 0; files.length + FormData.imgUrl.length > i; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((URLs) => {
          setFormData({
            ...FormData,
            imgUrl: FormData.imgUrl.concat(URLs),
          });
          setHandelError(false);
          setLoading(false);
        })
        .catch((error) => {
          setHandelError(
            "image upload failed it needs to be less than (2MB)" +
              " " +
              error.message
          );
          setLoading(false);
        });
    } else {
      setHandelError(
        "the images needs to be less than 6 or more than 0 per listing !!"
      );
      setLoading(false);
    }
  };
  const handelDelete = (index) => {
    setFormData({
      ...FormData,
      imgUrl: FormData.imgUrl.filter((_, i) => {
        return index !== i;
      }),
    });
  };

  const handelChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...FormData, type: e.target.id });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...FormData, [e.target.id]: e.target.checked });
    }
    if (
      e.target.type === "text" ||
      e.target.type === "number" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...FormData, [e.target.id]: e.target.value });
    }
  };

  const SubmitForm = async (e) => {
    e.preventDefault();
    try {
      setLoadingSubmit(true);
      if (+FormData.discountPrice > +FormData.regularPrice) {
        setLoadingSubmit(false);
        return setHandelSubmitError(
          "discount price cannot be greater than regular price !"
        );
      }
      if (FormData.imgUrl.length < 1) {
        setLoadingSubmit(false);
        return setHandelSubmitError("you must upload at least one picture !");
      }
      if (
        FormData.name.length < 3 ||
        FormData.address.length < 3 ||
        FormData.description.length < 3
      ) {
        setLoadingSubmit(false);
        return setHandelSubmitError(
          "name and address, description need to have more than 3 characters !!!"
        );
      }
      const postListing = await fetch(`/api/listing/update/${id}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ ...FormData, userRef: userInfo._id }),
      });
      const response = await postListing.json();
      if (response.success === false) {
        setHandelSubmitError(response.message);
      }
      setHandelSubmitError(false);
      setLoadingSubmit(false);
      navigate(`/listing/${response._id}`);
    } catch (error) {
      setHandelSubmitError(error.message);
      setLoadingSubmit(false);
    }
  };

  return (
    <>
      <div className="pt-20 mb-40">
        <h1 className="text-center my-5 text-2xl font-bold text-slate-700">
          Update Listing
        </h1>
        <form
          className="flex max-w-4xl mx-auto gap-6 sm:flex-row flex-col mt-2 p-3"
          onSubmit={SubmitForm}
        >
          <div className="flex flex-col gap-4 flex-1">
            <input
              type="text"
              placeholder="Name"
              id="name"
              className="p-2 border border-grey-500 outline-none rounded"
              value={FormData.name}
              onChange={handelChange}
            />
            <textarea
              type="text"
              placeholder="description"
              id="description"
              className="p-2 border border-grey-500 outline-none rounded max-h-60 min-h-20"
              value={FormData.description}
              onChange={handelChange}
            />
            <input
              type="text"
              placeholder="Address"
              id="address"
              className="p-2 border border-grey-500 outline-none rounded"
              value={FormData.address}
              onChange={handelChange}
            />
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-6 h-6 border"
                  checked={FormData.type === "sale"}
                  onChange={handelChange}
                />
                <p> Sell </p>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-6 h-6 border"
                  checked={FormData.type === "rent"}
                  onChange={handelChange}
                />
                <p> Rent </p>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-6 h-6 border"
                  checked={FormData.parking}
                  onChange={handelChange}
                />
                <p> Parking spot </p>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-6 h-6 border"
                  checked={FormData.furnished}
                  onChange={handelChange}
                />
                <p> Furnished </p>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-6 h-6 border"
                  checked={FormData.offer}
                  onChange={handelChange}
                />
                <p> Offer </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bedrooms"
                  className="border border-grey-500 w-14 h-10 outline-none p-2"
                  max={10}
                  min={1}
                  value={FormData.bedrooms}
                  onChange={handelChange}
                />
                <p>Beds</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="bathrooms"
                  className="border border-grey-500 w-14 h-10 outline-none p-2"
                  max={10}
                  value={FormData.bathrooms}
                  min={1}
                  onChange={handelChange}
                />
                <p>Baths</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="regularPrice"
                  className="border border-grey-500  w-20 h-10 outline-none p-2"
                  value={FormData.regularPrice}
                  min={50}
                  max={1000000}
                  onChange={handelChange}
                />
                <div className="flex flex-col text-base items-center">
                  <p>Regular price</p>
                  {FormData.type === "rent" && (
                    <p className="text-xs text-slate-600 ">($ / Month)</p>
                  )}
                </div>
              </div>
              {FormData.offer && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id="discountPrice"
                    className="border border-grey-500  w-20 h-10 outline-none p-2"
                    value={FormData.discountPrice}
                    onChange={handelChange}
                  />
                  <div className="flex flex-col text-base items-center">
                    <p>Discount price</p>
                    {FormData.type === "rent" && (
                      <p className="text-xs text-slate-600 ">($ / Month)</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-3">
            <p className="font-semibold">
              Images :{" "}
              <span className="text-slate-500 font-normal text-sm">
                the first image will be the cover (max 6){" "}
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              <input
                type="file"
                className="border border-grey-300 p-2 rounded"
                accept="image/*"
                multiple
                onChange={(e) => {
                  setFile(e.target.files);
                }}
              />
              <button
                className="border border-green-700 text-green-700 rounded p-2 flex items-center cursor-pointer hover:shadow-md "
                disabled={loading}
                onClick={handelSubmitImage}
                type="button"
              >
                <p>{loading ? "Loading..." : " UPLOAD "}</p>
              </button>
            </div>
            <p className="text-red-700"> {handelError && handelError} </p>
            {FormData.imgUrl.length > 0 &&
              FormData.imgUrl.map((URLs, index) => {
                return (
                  <div
                    key={index}
                    className="bg-white/30 p-3 rounded flex justify-between"
                  >
                    <img
                      src={URLs}
                      alt="image uploaded"
                      className="w-40 h-20 object-contain rounded "
                    />
                    <button
                      type="button"
                      className="text-red-700 font-semibold hover:opacity-85"
                      onClick={() => {
                        handelDelete(index);
                      }}
                    >
                      {" "}
                      DELETE{" "}
                    </button>
                  </div>
                );
              })}
            <button
              className="text-white bg-slate-700 p-2 rounded hover:opacity-95"
              disabled={loading || loadingSubmit}
            >
              {loading || loadingSubmit ? "UPLOADING..." : "UPLOAD LISTING"}
            </button>
            <p className="text-red-600 text-center">
              {handelSubmitError && handelSubmitError}{" "}
            </p>
          </div>
        </form>
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
