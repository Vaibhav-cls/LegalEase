const mongoose = require("mongoose");
const Tag = require("../models/tag");

const connectDB = async (MONGO_URL) => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to DB");

        // Setup indexes
        const existingIndexes = await Tag.collection.indexes();
        const indexExists = existingIndexes.some((index) => index.name === "name_text_index");

        if (!indexExists) {
            await Tag.collection.createIndex({ name: "text" }, { name: "name_text_index" });
            console.log("Text index created successfully.");
        }
    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1); // Exit if DB connection fails
    }
};

module.exports = connectDB;
