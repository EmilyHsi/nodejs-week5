const handleSuccess = require('../service/handleSuccess');
// const handleError = require('../service/handleError');
const appError = require('../service/appError');
const handleErrorAsync = require('../service/handleErrorAsync');
const Post = require('../model/post');
const User = require('../model/user');
const mongoose = require('mongoose');

// const { router } = require('../app');

const posts = {
  getPosts: handleErrorAsync(async (req, res) => {
    const timeSort = req.query.timeSort === "asc" ? "createdAt" : "-createdAt"; 
    const q = req.query.keyword !== undefined ? { "content": new RegExp(req.query.keyword) } : {};
    const allPosts = await Post.find(q).populate({
      path: 'user',
      select: 'name photo'
    }).sort(timeSort);
    handleSuccess(res, allPosts);
  }),
  createdPosts: handleErrorAsync(async (req, res, next) => {
    const { body } = req;
    const userId = await User.findById(body.user).exec();
    const checkUser = mongoose.isValidObjectId(userId);
    if (!checkUser) {
      appError('400', '使用者不存在', next);
    } else {
      if (body.content || body.user) {
        const newPost = await Post.create(
          {
            user: body.user,
            content: body.content,
            image: body.image
          }
        );
        handleSuccess(res, newPost);
      } else {
        appError('400', '請填寫 content', next);
      }
    }
  }),
  deletePost: handleErrorAsync(async (req, res, next) => {
    if (req.originalUrl === '/posts/') {
      appError('400', '請檢查路徑，若需刪除單筆資料請帶入id', next);
    } else {
      await Post.deleteMany({});
      handleSuccess(res, []);
    }
  }),
  deleteOnePost: handleErrorAsync(async (req, res, next) => {
    const postId = req.params.id;
    if (mongoose.isValidObjectId(postId) === false) {
      appError('400', '查無此ID', next);
    } else {
      await Post.findByIdAndDelete(id);
      const posts = await Post.find();
      handleSuccess(res, posts);
    }
  }),
  updatePost: handleErrorAsync(async (req, res, next) => {
    const { body } = req;
    const postId = req.params.id;
    const userId = await User.findById(body.user).exec();
    const checkUser = mongoose.isValidObjectId(userId);
    if(!checkUser) {
      return (appError(400, "使用者不存在", next));
    } else {
      if (mongoose.isValidObjectId(postId) === false) {
        appError('400', '查無此貼文ID', next);
      } else {
        if (body.content) {
          await Post.findByIdAndUpdate(postId, body);
          const updatePost = await Post.find().populate({
            path: 'user',
            select: 'name photo'
          });
          handleSuccess(res, updatePost);
        } else {
          appError('400', '請填寫 content', next);
        }
      }
    }
  }),
}

module.exports = posts;