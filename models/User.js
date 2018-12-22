const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  birthday: { type: Date, default: null },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now() },
  followers: [Schema.Types.ObjectId],
  following: [Schema.Types.ObjectId]
}, { versionKey: false });

module.exports = mongoose.model('users', schema);
