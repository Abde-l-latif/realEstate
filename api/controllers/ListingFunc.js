const Listing = require("../model/Listing.model.js");
const ErrorCustom = require("../utils/error.js");
const CreateListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

const GetListing = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const getListings = await Listing.find({ userRef: req.params.id });
      res.status(200).json({ getListings });
    } catch (error) {
      next(error);
    }
  } else {
    return ErrorCustom(401, "you can only view your own listings");
  }
};

const DeleteListing = async (req, res, next) => {
  const list = await Listing.findById(req.params.id);
  if (req.user.id !== list.userRef) {
    return ErrorCustom(401, "you can only delete your own listings");
  }
  try {
    await Listing.deleteOne({ _id: req.params.id });
    res.status(204).json("the list has been deleted successfully !!");
  } catch (error) {
    next(error);
  }
};

const UpdateListing = async (req, res, next) => {
  const list = await Listing.findById(req.params.id);
  if (req.user.id !== list.userRef) {
    next(ErrorCustom(401, "you can only update your own listings"));
  }
  try {
    const Update = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(Update);
  } catch (error) {
    next(error);
  }
};

const gettingListing = async (req, res, next) => {
  const list = await Listing.findById(req.params.id);
  try {
    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    let furnished = req.query.furnished;
    let parking = req.query.parking;
    let type = req.query.type;
    if (parking === undefined || parking === "false") {
      parking = { $in: [true, false] };
    }
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [true, false] };
    }
    if (offer === undefined || offer === "false") {
      offer = { $in: [true, false] };
    }
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";
    const data = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .limit(limit)
      .sort({ [sort]: order })
      .skip(startIndex);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  CreateListing,
  GetListing,
  DeleteListing,
  UpdateListing,
  gettingListing,
  getListings,
};
