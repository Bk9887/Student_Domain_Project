const mongoose = require("mongoose");

const appConfigSchema = new mongoose.Schema(
    {
        maintenanceMode: {
            type: Boolean,
            default: false
        },
        announcement: {
            type: String,
            default: ""
        },
        showAiMentor: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("AppConfig", appConfigSchema);
