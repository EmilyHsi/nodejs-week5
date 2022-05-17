const mongoose = require('mongoose');
const postsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, 'user ID 未填寫']
    },
    content: {
      type: String,
      required: [true, 'Content 未填寫'],
    },
    image: {
      type: String,
      default: ""
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    },
    // likes: {
    //   type: Number,
    //   default: 0
    // },
    // comments:{
    //   type: Number,
    //   default: 0
    // }
  },
  {
    versionKey: false
  }
);

const posts = mongoose.model(
  'posts',
  postsSchema
);

module.exports = posts;