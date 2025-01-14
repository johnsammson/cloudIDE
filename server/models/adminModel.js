const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    port: {
        type: Number,
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
