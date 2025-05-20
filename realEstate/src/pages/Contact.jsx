import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function Contact({ Listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const getLandLord = async () => {
      try {
        const getUser = await fetch(`/api/user/${Listing.userRef}`);
        const res = await getUser.json();
        setLandlord(res);
      } catch (error) {
        console.log(error);
      }
    };
    getLandLord();
  }, [Listing.userRef]);
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  console.log(landlord);

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            contact <span className="font-bold"> {landlord.name} </span> for{" "}
            <span className="font-bold">{Listing.name}</span>
          </p>
          <textarea
            placeholder="Enter your message here ..."
            type="textarea"
            raw={3}
            className="w-full border p-2 outline-none"
            onChange={onChange}
            value={message}
          ></textarea>
          <Link
            className="bg-slate-700 text-white p-2 rounded-lg hover:opacity-90 text-center"
            to={`mailto:${landlord.email}?subject=Regarding ${
              Listing.name
            }&body=${encodeURIComponent(message.toUpperCase().trim())}`}
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
