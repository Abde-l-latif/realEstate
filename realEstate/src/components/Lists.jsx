import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaBed, FaBath } from "react-icons/fa";

export default function Lists({ lists }) {
  return (
    <div className="w-[280px] rounded-lg overflow-hidden bg-white flex flex-col shadow-md hover:shadow-lg">
      <img
        src={lists.imgUrl[0]}
        className="h-[200px] w-full object-cover hover:scale-110 duration-500"
      />
      <div className="p-3 flex flex-col gap-2">
        <p className="capitalize font-semibold truncate w-[100px]">
          {lists.name}
        </p>
        <div className="flex gap-2 items-center">
          <FaLocationDot className="text-green-700 text-sm" />
          <p className="text-xs text-slate-800">{lists.address}</p>
        </div>
        <p className="text-sm text-slate-800 line-clamp-2">
          {lists.description}
        </p>
        <div className="flex justify-between">
          <div className=" text-white flex items-center font-normal text-sm bg-red-800 rounded p-1">
            ${lists.regularPrice.toLocaleString("en-US")}
            {lists.type === "rent" && "/month"}
          </div>
          {lists.offer && (
            <div className=" text-white flex items-center font-normal text-sm bg-green-700 rounded p-1">
              {"$ " +
                (+lists.regularPrice - +lists.discountPrice).toLocaleString(
                  "en-US"
                )}
              {lists.type !== "rent" ? " discount" : ""}
              {lists.offer && lists.type === "rent" && "/month discount"}
            </div>
          )}
        </div>
        <div className=" flex justify-between">
          <div className="flex items-center gap-2 text-green-800">
            <FaBed />
            <p>
              {lists.bedrooms}
              <span>{lists.bedrooms == 1 ? " Bed" : " Beds"}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-green-800">
            <FaBath />
            <p>
              {lists.bathrooms}
              <span>{lists.bathrooms == 1 ? " Bath" : " Baths"}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
