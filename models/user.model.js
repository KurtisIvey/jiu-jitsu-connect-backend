const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/* posts will be referenced through userId and found using query for individ page
 */
const userSchema = new mongoose.Schema({
  //required
  username: {
    type: String,
    lowercase: true,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  // added manually later
  profilePicUrl: {
    type: String,
    trim: true,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friendRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  /* friends will be added later through friend requests 
  friends: [{ type: ObjectId, ref: "User" }],*/
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// static method to log in user
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("Email and password are required.");
  }
  const user = await this.findOne({ email })
    .select("+password")
    .populate("friendRequests");
  if (!user) {
    throw Error("User not found.");
  }
  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    throw Error("Incorrect password.");
  }
  return user;
};

module.exports = mongoose.model("User", userSchema);
