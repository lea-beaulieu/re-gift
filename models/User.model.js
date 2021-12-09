const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    firstname : {
      type: String, 
    },
    lastname: {
      type: String,
    },
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
    city: {
      type: String,
    },
    zip: {
      type: String,
      match: [/([0-9]{5})$/, 'Veuillez entrer un code postal français.'],
    },
    
    // avatar: {
    //   type: String,
    //   unique: true,
    // },
    
    
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
