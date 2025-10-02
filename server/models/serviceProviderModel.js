import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const serviceProviderSchema = new Schema({
  name: {
    type: String,
    required: [true, "Service Provider Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: true,
  },
  contact: { type: String },
  location: { type: String },
  about: { type: String },
  profileUrl: { type: String },
  servicePosts: [{ type: Schema.Types.ObjectId, ref: "Services" }],

  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0
  }
});

serviceProviderSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

serviceProviderSchema.methods.comparePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

serviceProviderSchema.methods.createJWT = function () {
  return JWT.sign({ userId: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "2d",
  });
};

serviceProviderSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = (sum / this.reviews.length).toFixed(1);
  }
  return this.averageRating;
};

const ServiceProviders = mongoose.model("ServiceProviders", serviceProviderSchema);

export default ServiceProviders;