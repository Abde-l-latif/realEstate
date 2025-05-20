import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css";
import Lists from "../components/Lists";

export default function Home() {
  const [offerList, setOfferList] = useState(null);
  const [rentList, setRentList] = useState(null);
  const [saleList, setSaleList] = useState(null);

  console.log(offerList);

  useEffect(() => {
    const getOfferLists = async () => {
      try {
        const offerListsFetch = await fetch(
          `/api/listing/listings?offer=true&limit=4`
        );
        const fetchOffer = await offerListsFetch.json();
        setOfferList(fetchOffer);
        getSaleLists();
        getRentLists();
      } catch (error) {
        console.log(error);
      }
    };
    const getSaleLists = async () => {
      try {
        const saleListsFetch = await fetch(
          `/api/listing/listings?type=sale&limit=4`
        );
        const fetchSale = await saleListsFetch.json();
        setSaleList(fetchSale);
      } catch (error) {
        console.log(error);
      }
    };
    const getRentLists = async () => {
      try {
        const rentListsFetch = await fetch(
          `/api/listing/listings?type=rent&limit=4`
        );
        const fetchRent = await rentListsFetch.json();
        setRentList(fetchRent);
      } catch (error) {
        console.log(error);
      }
    };
    getOfferLists();
  }, []);

  return (
    <>
      <div className="">
        <div className="font-bold text-4xl  pt-32  px-2 sm:px-28 pb-20">
          <div className=" flex flex-col gap-3 bg-white/40 rounded-lg p-4">
            <div>
              <p>
                Find your next <span className="text-slate-700"> perfect </span>
              </p>
              <p> place with ease </p>
            </div>
            <p className="text-xs font-normal text-slate-500">
              realEstate is the best place to find your next perfect place to
              live. <br /> We have a wide range of properties for you to choose
              from.
            </p>
            <Link
              to={`/search`}
              className="text-sm p-2 rounded hover:opacity-90 bg-slate-800 text-white"
            >
              Let's start now ...
            </Link>
          </div>
        </div>
        <div className="">
          <Swiper modules={[Navigation]} navigation>
            {offerList &&
              offerList.length >= 0 &&
              offerList.map((Url) => {
                return (
                  <SwiperSlide key={Url.imgUrl}>
                    <div
                      className="w-screen h-[400px]"
                      style={{
                        background: `url(${Url.imgUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
        <div className=" pt-3 px-2 flex flex-col items-center sm:block md:px-20 pb-3">
          <h1 className="text-2xl font-bold text-slate-800"> Recent offer </h1>
          <Link to={`/search?offer=true`}>
            <p className="text-sm text-sky-700 underline cursor-pointer">
              show more offer
            </p>
          </Link>
          <div className="flex gap-3 justify-center sm:justify-normal flex-wrap mt-3">
            {offerList &&
              offerList.map((x, index) => {
                return (
                  <div key={index}>
                    <Link to={`/listing/${x._id}`}>
                      <Lists lists={x} />
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
        <div className=" pt-3 px-2 flex flex-col items-center sm:block md:px-20 pb-3">
          <h1 className="text-2xl font-bold text-slate-800"> Recent sales </h1>
          <Link to={`/search?type=sale`}>
            <p className="text-sm text-sky-700 underline cursor-pointer">
              show more sales
            </p>
          </Link>
          <div className="flex gap-3 justify-center sm:justify-normal flex-wrap mt-3">
            {saleList &&
              saleList.map((x, index) => {
                return (
                  <div key={index}>
                    <Link to={`/listing/${x._id}`}>
                      <Lists lists={x} />
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
        <div className=" pt-3 px-2 flex flex-col items-center sm:block md:px-20 pb-3">
          <h1 className="text-2xl font-bold text-slate-800"> Recent rents </h1>
          <Link to={`/search?type=rent`}>
            <p className="text-sm text-sky-700 underline cursor-pointer">
              show more rents
            </p>
          </Link>
          <div className="flex gap-3 justify-center sm:justify-normal flex-wrap mt-3">
            {rentList &&
              rentList.map((x, index) => {
                return (
                  <div key={index}>
                    <Link to={`/listing/${x._id}`}>
                      <Lists lists={x} />
                    </Link>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
