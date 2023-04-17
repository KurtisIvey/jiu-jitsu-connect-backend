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

/* userSchema.pre("save", async function (next) {
  //console.log("presave catch" + this.password);
  console.log("reaching");
  this.password = await bcrypt.hash(this.password, 10);
  console.log(this.password);
  next();
}); */

/* userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    // check if password is modified then has it
    let user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
      if (err) {
        return next(err)
      }
      user.password = hash;
      next()
    })
  }else{
    next();
  }
}) */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    console.log("reaching ismodified");
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

  const user = await this.findOne({ email }).select("+password");

  if (!user) {
    console.log("reach user not found");
    throw Error("User not found.");
  }

  const auth = await bcrypt.compare(password, user.password);
  console.log(auth);
  if (!auth) {
    console.log("incorrect password");
    console.log(
      `user in db password: ${user.password}, compared pass on entry: ${password}`
    );
    console.log(auth);

    throw Error("Incorrect password.");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
