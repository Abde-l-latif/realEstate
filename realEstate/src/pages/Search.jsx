import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Lists from "../components/Lists";

export default function Search() {
  const navigate = useNavigate();
  const [searchDataQuery, setSearchDataQuery] = useState({
    searchTerm: "",
    type: "all",
    offer: false,
    parking: false,
    furnished: false,
    sort: "created_at",
    order: "desc",
  });
  const [lists, setLists] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const handelShowMore = async () => {
    const startIndex = lists.length;
    try {
      const Url = new URLSearchParams(location.search);
      Url.set("startIndex", startIndex);
      const querys = Url.toString();
      const filtredList = await fetch(`/api/listing/listings?${querys}`);
      const res = await filtredList.json();
      if (res.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setLists([...lists, ...res]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const Url = new URLSearchParams(location.search);
    const searchUrl = Url.get("searchTerm");
    const typeUrl = Url.get("type");
    const offerUrl = Url.get("offer");
    const parkingUrl = Url.get("parking");
    const furnishedUrl = Url.get("furnished");
    const sortUrl = Url.get("sort");
    const orderUrl = Url.get("order");
    if (
      searchUrl ||
      typeUrl ||
      offerUrl ||
      parkingUrl ||
      furnishedUrl ||
      sortUrl ||
      orderUrl
    ) {
      setSearchDataQuery({
        searchTerm: searchUrl || "",
        type: typeUrl || "all",
        offer: offerUrl === "true" ? true : false,
        parking: parkingUrl === "true" ? true : false,
        furnished: furnishedUrl === "true" ? true : false,
        sort: sortUrl || "created_at",
        order: orderUrl || "desc",
      });
    }
    const getFiltredLists = async () => {
      try {
        setLoading(true);
        const stringUrl = Url.toString();
        const filtredList = await fetch(`/api/listing/listings?${stringUrl}`);
        const res = await filtredList.json();
        if (res.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
        setLists(res);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getFiltredLists();
  }, [location.search]);
  const OnChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSearchDataQuery({ ...searchDataQuery, type: e.target.id });
    }
    if (e.target.id === "sort_order") {
      let sort = e.target.value.split("_")[0] || "created_at";
      let order = e.target.value.split("_")[1] || "desc";
      setSearchDataQuery({ ...searchDataQuery, sort, order });
    }
    if (
      e.target.id == "parking" ||
      e.target.id == "furnished" ||
      e.target.id == "offer"
    ) {
      setSearchDataQuery({
        ...searchDataQuery,
        [e.target.id]:
          e.target.checked || e.target.checked == "true" ? true : false,
      });
    }
    if (e.target.id == "searchTerm") {
      setSearchDataQuery({ ...searchDataQuery, [e.target.id]: e.target.value });
    }
  };
  const SubmitForm = (e) => {
    e.preventDefault();
    const Url = new URLSearchParams();
    Url.set("searchTerm", searchDataQuery.searchTerm);
    Url.set("type", searchDataQuery.type);
    Url.set("offer", searchDataQuery.offer);
    Url.set("parking", searchDataQuery.parking);
    Url.set("furnished", searchDataQuery.furnished);
    Url.set("sort", searchDataQuery.sort);
    Url.set("order", searchDataQuery.order);
    navigate(`/search?${Url}`);
  };
  return (
    <div className="min-h-screen flex flex-col sm:flex-row w-full h-fit pt-20">
      <form
        className="border-r border-white p-6 h-fill flex flex-col gap-5"
        onSubmit={SubmitForm}
      >
        <div className=" flex gap-2 items-center">
          <label htmlFor="search" className="font-semibold">
            Search Term :
          </label>
          <input
            type="text"
            name="search"
            placeholder="search a list..."
            id="searchTerm"
            className="p-1 outline-none bg-white/80 rounded"
            onChange={OnChange}
          />
        </div>
        <div className="flex items-center gap-3 text-sm">
          <p className="font-semibold text-base"> Type : </p>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="all"
              name="rent_sale"
              className="w-5 h-5 border"
              onChange={OnChange}
              checked={searchDataQuery.type == "all"}
            />
            <label htmlFor="rent_sale"> Rent & Sale </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rent"
              name="rent"
              className="w-5 h-5 border"
              onChange={OnChange}
              checked={searchDataQuery.type == "rent"}
            />
            <label htmlFor="rent"> Rent </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sale"
              name="sale"
              className="w-5 h-5 border"
              onChange={OnChange}
              checked={searchDataQuery.type == "sale"}
            />
            <label htmlFor="sale"> Sale </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="offer"
              name="offer"
              className="w-5 h-5 border"
              onChange={OnChange}
              checked={searchDataQuery.offer}
            />
            <label htmlFor="offer"> Offer </label>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <h1 className="font-semibold text-base"> Amenities: </h1>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="parking"
              name="parking"
              className="w-5 h-5 border"
              checked={searchDataQuery.parking}
              onChange={OnChange}
            />
            <label htmlFor="parking"> Parking </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="furnished"
              name="furnished"
              className="w-5 h-5 border"
              onChange={OnChange}
              checked={searchDataQuery.furnished}
            />
            <label htmlFor="furnished"> Furnished </label>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <h1 className="font-semibold text-base"> Sort :</h1>
          <select
            name="sort_order"
            id="sort_order"
            className="p-2 bg-white/90 outline-none"
            onChange={OnChange}
            defaultValue={"created_at_desc"}
          >
            <option value="regularPrice_desc"> Price hight to low </option>
            <option value="regularPrice_asc"> Price Low to Hight </option>
            <option value="createdAt_desc"> Latest </option>
            <option value="createdAt_asc"> Oldest </option>
          </select>
        </div>
        <button className="bg-slate-700 text-white font-semibold rounded p-2 hover:opacity-90">
          Search
        </button>
      </form>
      <div className="h-full w-full p-6 border-b flex-1">
        <div className="text-slate-700 border-b  border-white text-xl font-bold pb-1">
          <h1>Listing Results : </h1>
        </div>
        <div className="flex gap-3 flex-wrap mt-3">
          {!loading &&
            lists &&
            lists.map((x, index) => {
              return (
                <div key={index}>
                  <Link to={`/listing/${x._id}`}>
                    <Lists lists={x} />
                  </Link>
                </div>
              );
            })}
        </div>
        {showMore && (
          <p
            className="text-green-700 font-bold p-2 w-fit mx-auto cursor-pointer hover:opacity-90"
            onClick={handelShowMore}
          >
            Show more ...
          </p>
        )}
      </div>
    </div>
  );
}
