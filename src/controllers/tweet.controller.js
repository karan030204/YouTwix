import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  // Content, Owner from frontend
  // if not then throw error

  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is missing");
  }

  const tweet = await Tweet.create({
    content,
    owner: req.user?._id,
  });

  if (!tweet) {
    throw new ApiError("Error while creating Tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet is Created Successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets

  const id = req.user?._id;

  console.log(id);

  const tweets = await Tweet.find({ owner: id });
  //It will look for that field in the document and it will try to map that value to that field in all documents and whereever that document occur it will take all those documents
  // const tweets = await Tweet.find({id}) // This will not work as there is not field named id in the document so it will give empty valueas it tries to match with the value

  console.log(tweets);

  if (!tweets) {
    throw new ApiError(400, "This user has not created any tweets");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, tweets, "All user tweets are fetched successfully")
    );
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  //Content to update, Which tweet to udpate ( for that we required tweet id ) ?
  const { content: new_content, tweet_id } = req.body;

  if (!new_content || !tweet_id) {
    throw new ApiError(400, "new_content or tweet_id is missing");
  }

  const updated_tweet = await Tweet.findByIdAndUpdate(
    tweet_id,
    {
      $set: {
        content: new_content,
      },
    },
    { new: true }
  );

  if (!updated_tweet) {
    throw new ApiError(400, "Error while updating Tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updated_tweet, "Tweet is updated Successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
    const {tweet_id} = req.body

    if(!tweet_id){
        throw new ApiError(400, "Tweet_id is missing")
    }

    const deleted_tweet = await Tweet.deleteOne({_id : tweet_id})

    if(!deleted_tweet){
        throw new ApiError(400, "While deleting tweet")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, deleted_tweet, "Tweet is successfully deleted"))
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
