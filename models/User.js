const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  date: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now() },
  followers: [Schema.Types.ObjectId],
  following: [Schema.Types.ObjectId]
});

module.exports = mongoose.model('users', schema);
