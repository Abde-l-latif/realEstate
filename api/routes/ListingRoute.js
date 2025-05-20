const express = require("express");
const ListingRoute = express.Router();
const { VerifyUser } = require("../utils/VerifyUser");
const {
  CreateListing,
  GetListing,
  DeleteListing,
  UpdateListing,
  gettingListing,
  getListings,
} = require("../controllers/ListingFunc");

ListingRoute.post("/create", VerifyUser, CreateListing);
ListingRoute.get("/listings/:id", VerifyUser, GetListing);
ListingRoute.delete("/delete/:id", VerifyUser, DeleteListing);
ListingRoute.post("/update/:id", VerifyUser, UpdateListing);
ListingRoute.get("/getting/:id", gettingListing);
ListingRoute.get("/listings", getListings);

module.exports = ListingRoute;
