const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: function() {
            // 'this.isNew' is true when creating a new document
            return this.isNew;  // Only require name on new user creation (sign-up)
          },
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        default: "NORMAL",
    }
}, { timestamps: true });

const User = mongoose.model("user", userSchema);

module.exports = User;
