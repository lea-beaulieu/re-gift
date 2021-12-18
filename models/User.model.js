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
    match:  [/^\S+@\S+\.\S+$/, 'Merci de renseigner une adresse email valide.'],
    unique: true,
    lowercase: true,
    trim: true,
    },
  password: String,
  city: String,
  zip: {
    type: String,
    match: [/([0-9]{5})$/, 'Veuillez entrer un code postal français.'],
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