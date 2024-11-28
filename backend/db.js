const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
require('dotenv').config();
const mongo_url = process.env.DATABASE_URL;

console.log("MongoDB URL:", mongo_url);
 mongoose.connect(mongo_url)
 .then( () => {
    console.log("Mongodb connected successfully");
 })
 .catch( (err) =>{
    console.log("Error :" , err);
    console.log("Connection to mongodb failed!");
 })

const userSchema = mongoose.Schema({
    name : {type: String , required: true},
    username : {type: String , required: true},
    email : {type: String , required: true, unique: true ,
        validate: {
            validator: function (v) {
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email regex
            },
            message: (props) => `${props.value} is not a valid email address!`}
        },
    password_hash: {
        type: String,
        required: true
    }
})


userSchema.methods.createHash = async function (plaintext){

    const saltRounds =10;
    // bcrypt.genSalt , bcrypt.hash( passowrd, salt)
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(plaintext, salt);

}

userSchema.pre("save", async function(next){
    if (!this.isModified("password")) return next(); // Skip if password isn't modified

  // Call createHash method to hash the password
    this.password = await this.createHash(this.password);
    next();
})

// validate password - 
userSchema.methods.validatePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password_hash);
  };

const User = mongoose.model("User", userSchema);

module.exports = User;