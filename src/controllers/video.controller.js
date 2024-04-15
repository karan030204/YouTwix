import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  //   console.log(title, " ", description);
  //title and description is compulsory
  if (!title || !description) {
    throw new ApiError(400, "Title and Description are required");
  }

  //get the local path of the video and thumbnail
  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  //Video and thumbnail is compulsory if either of them is absent then we will show the error
  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "Video and Thumbnail are required");
  }

  //upload to cloudinary
  const video = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  // we need url compulsory for video and thumbnail
  if (!video || !thumbnail) {
    throw new ApiError(400, "Error While uploading Video and Thumbnail ");
  }

  // storing the video to db
  const videoUploaded = await Video.create({
    videoFile: video.url,
    thumbnail: thumbnail.url,
    owner: req.user?._id,
    title,
    description,
    duration: video.duration,
  });

  if (!videoUploaded) {
    throw new ApiError(400, "Error while storing to mongoDb");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, videoUploaded, "Video is successfully Uploaded")
    );
});

const getVideoById = asyncHandler(async (req, res) => {

    //id of the video which we want
  const { videoId } = req.params;
  //TODO: get video by id

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video not found with videoId");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video is fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
    // id of the video which we want to update
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail

  if (!videoId) {
    throw new ApiError(400, "Video Id is required ");
  }

  //getting new title and description
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and Description is required ");
  }

  //local path for new thumbnail
  const thumbnailLocalPathUpdated = req.file?.path;

  if (!thumbnailLocalPathUpdated) {
    throw new ApiError(400, "Thumbnail is required");
  }

  //upload thumbnail on cloudinary
  const thumbnailUpdated = await uploadOnCloudinary(thumbnailLocalPathUpdated);

  if (!thumbnailUpdated) {
    throw new ApiError(400, "Error while uploading thumbnail to Cloudinary");
  }

  //delete the old thumbnail from cloudinary

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: thumbnailUpdated.url,
      },
    },
    { new: true }
  );

  if (!updateVideo) {
    throw new ApiError(400, "Video is not updated");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video is Updated Successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    //id of the video to be deleted
  const { videoId } = req.params;
  //TODO: delete video

  if (!videoId) {
    throw new ApiError(400, "Video Id is required");
  }

  const data = await Video.deleteOne({ _id: videoId });

  if (!data) {
    throw new ApiError(400, "Error while deleting the video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Video is successfully deleted"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

   


});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
