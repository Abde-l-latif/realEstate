import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";

export default function Header() {
  const { userInfo } = useSelector((state) => state.user);
  const [searchItem, setSearchItem] = useState("");
  const [isScroll, setIsScroll] = useState(false);
  const navigate = useNavigate();

  const submitSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    params.set("searchTerm", searchItem);
    params.toString();
    navigate(`/search?${params}`);
  };

  useEffect(() => {
    const handelScroll = () => {
      if (window.scrollY > 1) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    };
    window.addEventListener("scroll", handelScroll);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const getSearchTerm = params.get("searchTerm");
    if (getSearchTerm) {
      setSearchItem(getSearchTerm);
    }
  }, [window.location]);

  return (
    <>
      <header
        className={
          isScroll
            ? "bg-pink-100 p-3 fixed w-screen duration-700 shadow-md z-10"
            : "bg-white/30 p-3 fixed w-screen z-10 "
        }
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-1">
          <Link to={"/"}>
            <h1 className="sm:text-2xl  text-lg">
              real<span className="text-slate-500 font-medium">Estate</span>
            </h1>
          </Link>
          <form className="box-border rounded-sm flex items-center gap-2 sm:w-80 w-40">
            <input
              type="text"
              placeholder="Search..."
              className=" outline-none  p-2 rounded-3xl bg-white/40 w-11/12 text-xs font-medium"
              onChange={(e) => {
                setSearchItem(e.target.value);
              }}
              value={searchItem}
            />
            <button onClick={submitSearch}>
              <FaSearch className=" text-slate-600 cursor-pointer text-base hover:text-slate-800" />
            </button>
          </form>
          <ul className="flex gap-5 sm:text-sm text-xs items-center ">
            <Link
              to="/"
              className="border sm:flex justify-center items-center rounded-3xl px-2 py-1 border-slate-800 hover:bg-slate-800 group blo hidden  "
            >
              <li className=" cursor-pointer text-slate-800 font-bold rounded-sm group-hover:text-white">
                Home
              </li>
            </Link>
            <Link
              to="/about"
              className="border sm:flex justify-center items-center rounded-3xl px-2 py-1 border-slate-800 hover:bg-slate-800 group hidden"
            >
              <li className=" cursor-pointer text-slate-800 font-bold rounded-sm group-hover:text-white">
                About
              </li>
            </Link>
            <Link
              to="/profile"
              className={
                userInfo
                  ? ""
                  : "border flex justify-center items-center rounded-3xl px-2 border-slate-800 hover:bg-slate-800 group text-center sm:text-start "
              }
            >
              {userInfo ? (
                <div className="flex items-center gap-2 w-[100px]">
                  <img
                    className="rounded-full w-7 h-7"
                    src={userInfo.avatar}
                    alt="profile"
                  />
                  <p className="text-xs font-bold text-center capitalize text-slate-800">
                    {userInfo.name}
                  </p>
                </div>
              ) : (
                <li className="cursor-pointer  text-slate-800 font-bold py-1 rounded-sm group-hover:text-white">
                  Sign in
                </li>
              )}
            </Link>
          </ul>
        </div>
      </header>
    </>
  );
}
