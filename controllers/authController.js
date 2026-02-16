import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({
      name,
      email,
      password,
      role: role || "user", // allow admin creation explicitly
      // status defaults to "inactive" in the model
    });

    res.status(201).json({
      success: true,
      message:
        "Registered successfully. Your account is inactive by default. Please contact admin to activate.",
      user: { name: user.name, email: user.email, role: user.role, status: user.status },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (user.status !== "active") {
      return res.status(403).json({
        message: "User is inactive. Please contact admin to activate your account.",
      });
    }

    const token = user.getJWTToken();
    res.status(200).json({
      success: true,
      token,
      user: { name: user.name, email: user.email, role: user.role, status: user.status },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
