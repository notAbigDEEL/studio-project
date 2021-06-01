const asyncHandler = require('../middleware/async')
const Studio = require("../models/studio");

// @desc        Get all studios
// @route       GET /api/v1/studios
// @access      Public
exports.getStudios = asyncHandler(async (req, res, next) => {
  const studios = await Studio.find();
  res
    .status(200)
    .json({ success: true, data: studios });
});

// @desc        Get a studio
// @route       GET /api/v1/studios/:id
// @access      Public
exports.getStudio = asyncHandler(async (req, res, next) => {
  const studio = await Studio.findById(req.params.id);
  if (!studio) {
    return res
      .status(400)
      .json({ success: false });
  }
  res
    .status(200)
    .json({ success: true, data: studio });
});

// @desc        Create a studio
// @route       POST /api/v1/studios/
// @access      Private
exports.createStudio = asyncHandler(async (req, res, next) => {
  const studio = await Studio.create(req.body);
  res
    .status(201)
    .json({
        success: true,
        data: studio,
  });
});

// @desc        Update a studio
// @route       PUT /api/v1/studios/:id
// @access      Private
exports.updateStudio = asyncHandler(async (req, res, next) => {
  const studio = await Studio.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!studio) {
    return res
      .status(400)
      .json({ success: false });
  }
  res
    .status(200)
    .json({ success: true, msg: `Update studio ${req.params.id}` });
});

// @desc        delete a studios
// @route       DELETE /api/v1/studios/:id
// @access      Private
exports.deleteStudio = asyncHandler(async (req, res, next) => {
  const studio = await Studio.findByIdAndDelete(req.params.id);
  if (!studio) {
    return res
    .status(400)
    .json({ success: false });
  }
  res
    .status(200)
    .json({ success: true, msg: `Deleted studio ${req.params.id}` });
});


// @desc      Get studios within a radius
// @route     GET /api/v1/studios/radius/:zipcode/:distance
// @access    Private
exports.getStudiosInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get latitude/longitude from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const studios = await Studio.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: studios.length,
    data: studios
  });
});

