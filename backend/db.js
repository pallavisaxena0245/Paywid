const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

// User schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        validate: {
            validator: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password: { type: String, required: true },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Skip if not modified
    this.password = await bcrypt.hash(this.password, 10); // Hash password
    next();
});

// Validate password
userSchema.methods.validatePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
