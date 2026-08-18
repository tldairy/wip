// ========================================
// COUNTDOWN
// ========================================

const newYear = new Date(
  "January 1, 2027 00:00:00"
).getTime();


function updateCountdown() {

  const now = Date.now();
  const difference = newYear - now;

  if (difference <= 0) {

    document.getElementById("days").textContent = "0";
    document.getElementById("hours").textContent = "0";
    document.getElementById("minutes").textContent = "0";
    document.getElementById("seconds").textContent = "0";

    return;
  }

  const days = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (difference / (1000 * 60 * 60)) % 24
  );

  const minutes = Math.floor(
    (difference / (1000 * 60)) % 60
  );

  const seconds = Math.floor(
    (difference / 1000) % 60
  );


  document.getElementById("days").textContent =
    days;

  document.getElementById("hours").textContent =
    String(hours).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(minutes).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(seconds).padStart(2, "0");
}


updateCountdown();

setInterval(updateCountdown, 1000);


// ========================================
// SLIDESHOW
// ========================================

let photos = [];

let currentPhoto = 0;

let slideshowTimer = null;


// ========================================
// GET PHOTOS FROM STATIC MANIFEST
// ========================================

async function loadPhotos() {

  try {

    const response =
      await fetch("photos.json");

    if (!response.ok) {
      throw new Error("Failed to load photos");
    }

    photos = await response.json();

    console.log(
      `Loaded ${photos.length} photos`
    );

    if (photos.length === 0) {

      console.warn(
        "No photos were found in the photos folder."
      );

      return;
    }

    // Preload images
    photos.forEach(photo => {
      const image = new Image();
      image.src = photo.url;
    });

  } catch (error) {

    console.error(
      "Could not load photos:",
      error
    );

  }
}


// Load photos when website starts
loadPhotos();


// ========================================
// SHOW PHOTO
// ========================================

function showPhoto(index) {

  if (photos.length === 0) {
    return;
  }

  currentPhoto =
    (index + photos.length) % photos.length;

  const image =
    document.getElementById("slideImage");

  const counter =
    document.getElementById("counter");


  image.style.opacity = "0";


  setTimeout(() => {

    image.src = photos[currentPhoto].url;

    image.onload = () => {
      image.style.opacity = "1";
    };

  }, 200);


  counter.textContent =
    `${currentPhoto + 1} / ${photos.length}`;
}


// ========================================
// NEXT PHOTO
// ========================================

function nextPhoto() {

  if (photos.length === 0) {
    return;
  }

  showPhoto(currentPhoto + 1);

  restartSlideshow();
}


// ========================================
// PREVIOUS PHOTO
// ========================================

function previousPhoto() {

  if (photos.length === 0) {
    return;
  }

  showPhoto(currentPhoto - 1);

  restartSlideshow();
}


// ========================================
// OPEN SLIDESHOW
// ========================================

async function openSlideshow() {

  // If photos haven't loaded yet, try again
  if (photos.length === 0) {
    await loadPhotos();
  }

  if (photos.length === 0) {

    alert(
      "No photos were found in the photos folder."
    );

    return;
  }


  document
    .getElementById("slideshow")
    .classList.add("active");


  currentPhoto = 0;

  showPhoto(currentPhoto);

  restartSlideshow();
}


// ========================================
// CLOSE SLIDESHOW
// ========================================

function closeSlideshow() {

  document
    .getElementById("slideshow")
    .classList.remove("active");

  clearInterval(slideshowTimer);

  slideshowTimer = null;
}


// ========================================
// AUTOMATIC SLIDESHOW
// ========================================

function restartSlideshow() {

  clearInterval(slideshowTimer);

  slideshowTimer = setInterval(() => {

    showPhoto(currentPhoto + 1);

  }, 4000);
}


// ========================================
// KEYBOARD CONTROLS
// ========================================

document.addEventListener(
  "keydown",
  event => {

    const slideshow =
      document.getElementById("slideshow");

    if (
      !slideshow.classList.contains("active")
    ) {
      return;
    }


    if (event.key === "Escape") {
      closeSlideshow();
    }


    if (event.key === "ArrowRight") {
      nextPhoto();
    }


    if (event.key === "ArrowLeft") {
      previousPhoto();
    }

  }
);