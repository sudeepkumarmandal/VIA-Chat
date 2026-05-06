const User = require("../models/users")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// 🔹 Register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    
    // Check if user exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "User already exists" })
    }


    // Hash password
    //Salt is a random string added to a password before hashing.
    //Because if two users have same password:
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)



    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    res.status(201).json({
      message: "User registered successfully",
      user
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// 🔹 Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
   
   
    // Check user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      message: "Login successful",
      token,
      user
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}