const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Absolute path to the photos folder
const PHOTO_DIR = path.join(__dirname, "photos");

const IMAGE_EXTENSIONS = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".avif"
];

// Make sure photos folder exists
if (!fs.existsSync(PHOTO_DIR)) {
    fs.mkdirSync(PHOTO_DIR);
    console.log("Created photos folder:", PHOTO_DIR);
}

console.log("=================================");
console.log("Starting New Year Website");
console.log("=================================");
console.log("Website folder:", __dirname);
console.log("Photos folder:", PHOTO_DIR);
console.log("=================================");


// ========================================
// GET PHOTOS
// ========================================

app.get("/api/photos", (req, res) => {

    try {

        console.log("Scanning photos folder...");

        const files = fs.readdirSync(PHOTO_DIR);

        console.log("Files found:", files);


        const photos = files
            .filter(file => {

                const extension =
                    path.extname(file).toLowerCase();

                return IMAGE_EXTENSIONS.includes(extension);

            })
            .sort((a, b) =>
                a.localeCompare(
                    b,
                    undefined,
                    {
                        numeric: true,
                        sensitivity: "base"
                    }
                )
            )
            .map(file => {

                return {
                    name: file,
                    url:
                        "/photos/" +
                        encodeURIComponent(file)
                };

            });


        console.log("Images found:", photos.length);

        console.log(photos);


        res.json(photos);

    } catch (error) {

        console.error(
            "ERROR READING PHOTOS:",
            error
        );

        res.status(500).json({
            error: error.message
        });

    }

});


// ========================================
// SERVE PHOTOS
// ========================================

app.use(
    "/photos",
    express.static(PHOTO_DIR)
);


// ========================================
// SERVE WEBSITE
// ========================================

app.use(
    express.static(__dirname)
);


// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {

    console.log("");
    console.log("=================================");
    console.log("SERVER RUNNING");
    console.log("=================================");
    console.log(
        `Open: http://localhost:${PORT}`
    );
    console.log("");
});