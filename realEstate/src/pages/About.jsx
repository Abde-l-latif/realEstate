import React from "react";
import { svg, parent, fill } from "../styles/waves.module.css";

export default function About() {
  return (
    <>
      <div className="py-20 px-4 max-w-6xl mx-auto mb-24">
        <div className=" bg-white/70 mt-4 p-3 rounded-lg">
          <h1 className="text-3xl font-bold mb-4 text-slate-800">
            About realEstate
          </h1>
          <p className="mb-4 text-slate-700">
            realEstate is a leading real estate agency that specializes in
            helping clients buy, sell, and rent properties in the most desirable
            neighborhoods. Our team of experienced agents is dedicated to
            providing exceptional service and making the buying and selling
            process as smooth as possible.
          </p>
          <p className="mb-4 text-slate-700">
            Our mission is to help our clients achieve their real estate goals
            by providing expert advice, personalized service, and a deep
            understanding of the local market. Whether you are looking to buy,
            sell, or rent a property, we are here to help you every step of the
            way.
          </p>
          <p className="mb-4 text-slate-700">
            Our team of agents has a wealth of experience and knowledge in the
            real estate industry, and we are committed to providing the highest
            level of service to our clients. We believe that buying or selling a
            property should be an exciting and rewarding experience, and we are
            dedicated to making that a reality for each and every one of our
            clients.
          </p>
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
