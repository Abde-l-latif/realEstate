import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useSelector } from "react-redux";

import {
  FaMapMarkerAlt,
  FaBath,
  FaBed,
  FaParking,
  FaChair,
} from "react-icons/fa";
import Contact from "./Contact";

export default function Listing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [listData, setListData] = useState(null);
  const [contact, setContact] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const { id } = useParams();

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const data = await fetch(`/api/listing/getting/${id}`);
        const res = await data.json();
        if (res.success == false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListData(res);
        setError(false);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(true);
        setLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <>
      <div>
        {listData && listData.imgUrl.length >= 0 && !loading && !error && (
          <div>
            <Swiper navigation modules={[Navigation]}>
              {listData.imgUrl.map((src, index) => {
                return (
                  <div key={index}>
                    <SwiperSlide key={src}>
                      <div
                        style={{
                          background: `url(${src})`,
                          backgroundRepeat: "no-repeat",
                          objectFit: "cover",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                        className="h-[500px]"
                      ></div>
                    </SwiperSlide>
                  </div>
                );
              })}
            </Swiper>
            <div className="w-screen p-2 sm:mx-auto mt-4 flex flex-col  gap-2   ">
              <div className="text-xl font-semibold flex gap-1 mb-3">
                <h1>{listData.name} </h1>
                {listData.type === "rent" ? (
                  <p>
                    {" "}
                    - $ {listData.regularPrice.toLocaleString(
                      "en-US"
                    )}/month{" "}
                  </p>
                ) : (
                  <p> - $ {listData.regularPrice.toLocaleString("en-US")}</p>
                )}
              </div>

              <div className="flex gap-2 items-center">
                <FaMapMarkerAlt className="text-green-700" />
                <p className="text-sm">{listData.address} </p>
              </div>

              <div className="flex gap-3">
                {listData.type === "rent" ? (
                  <p className="bg-red-700 text-white w-fit px-4 rounded">
                    {" "}
                    For Rent{" "}
                  </p>
                ) : (
                  <p className="bg-red-700 text-white w-fit px-4 rounded">
                    {" "}
                    For Sell
                  </p>
                )}
                {listData.offer && (
                  <p className="bg-green-700 text-white w-fit px-4 rounded">
                    {" "}
                    ${" "}
                    {(
                      +listData.regularPrice - +listData.discountPrice
                    ).toLocaleString("en-US")}{" "}
                    discount{" "}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                <p className="font-bold"> Description : </p>
                <p className="text-slate-800">{listData.description}</p>
              </div>

              <ul className="text-green-800 flex gap-3 items-center  flex-wrap font-medium">
                <li className="flex items-center gap-2">
                  <FaBath />
                  {listData.bathrooms == 1 ? (
                    <p>{listData.bathrooms} bath </p>
                  ) : (
                    <p> {listData.bathrooms} baths </p>
                  )}
                </li>
                <li className="flex items-center gap-2">
                  <FaBed />
                  {listData.bedrooms == 1 ? (
                    <p>{listData.bedrooms} bed </p>
                  ) : (
                    <p> {listData.bedrooms} beds </p>
                  )}
                </li>
                <li className="flex items-center gap-2">
                  <FaParking />

                  {listData.parking ? <p> parking </p> : <p> No Parking </p>}
                </li>
                <li className="flex items-center gap-2">
                  <FaChair />

                  {listData.parking ? (
                    <p> Furnished </p>
                  ) : (
                    <p> Not Furnished </p>
                  )}
                </li>
              </ul>
              {!userInfo && !contact && (
                <button
                  className="text-white bg-slate-700 p-2  rounded-lg mt-1 hover:opacity-90"
                  onClick={() => setContact(true)}
                >
                  CONTACT LANDLORD
                </button>
              )}
              {contact && <Contact Listing={listData} />}
            </div>
          </div>
        )}
        <h1 className="text-center font-semibold mt-4 text-lg text-slate-700 pt-20">
          {loading && "Loading..."}
        </h1>
        <p className="text-red-700 font-semibold text-center">
          {error && "thier is some Error in fetching !!"}
        </p>
      </div>
    </>
  );
}
