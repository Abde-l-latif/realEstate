import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import About from "./pages/About.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import Header from "./components/Header.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import PrivateProfile from "./components/PrivateProfile.jsx";
import CreateListing from "./pages/createListing.jsx";
import UpdateListing from "./pages/UpdateListing.jsx";
import Listing from "./pages/listing.jsx";
import Search from "./pages/Search.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route element={<PrivateProfile />}>
                <Route path="profile" element={<Profile />} />
                <Route path="create-listing" element={<CreateListing />} />
                <Route path="updateList/:id" element={<UpdateListing />} />
              </Route>
              <Route path="sign-in" element={<SignIn />} />
              <Route path="sign-up" element={<SignUp />} />
              <Route path="listing/:id" element={<Listing />} />
              <Route path="search" element={<Search />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
