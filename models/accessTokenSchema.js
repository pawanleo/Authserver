const mongoose = require("mongoose");

const accessTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  expiresIn: { type: Date, required: true },
});
const AccessToken = mongoose.model("AccessToken", accessTokenSchema);

module.exports = AccessToken;
