const mongoose = require('mongoose');
const ROLES = require('../constants/userRoles');

const { Schema } = mongoose;

const schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: ROLES.USER },
  firstName: { type: String },
  lastName: { type: String },
  website: { type: String },
  avatar: { type: String },
  birthday: { type: Date },
  createdAt: { type: Date, default: Date.now() },
  followers: [Schema.Types.ObjectId],
  following: [Schema.Types.ObjectId]
}, { versionKey: false });

module.exports = mongoose.model('users', schema);
