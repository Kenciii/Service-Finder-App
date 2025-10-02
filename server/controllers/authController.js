import Users from "../models/userModel.js";

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName) return next("First name is required");
    if (!lastName) return next("Last name is required");
    if (!email) return next("Email is required");
    if (!password) return next("Password is required");
    if (password.length < 6)
      return next("Password must be at least 6 characters");

    const userExist = await Users.findOne({ email });
    if (userExist) return next("Email address already exists");

    const user = await Users.create({
      firstName,
      lastName,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully. Please log in.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    next(error.message || "Server error during registration");
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return next("Please provide user credentials");

    const user = await Users.findOne({ email }).select("+password");
    if (!user) return next("Invalid email or password");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return next("Invalid email or password");

    user.password = undefined;

    const token = user.createJWT();

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error.message || "Server error during login");
  }
};