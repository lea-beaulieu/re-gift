const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  firstname : String, 
  lastname: String,
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    match:  [/^\S+@\S+\.\S+$/, 'Please enter a valid email.'], // Validation
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: String,
  city: String,
  zip: {
    type: String,
    match: [/([0-9]{5})$/, 'Please enter a french ZIP code.'], // Validation
  },
  avatar: String,  
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;