// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Get references to other DOM elements
const getImagesBtn = document.getElementById('get-images-btn');
const loadingMessage = document.getElementById('loading-message');
const gallery = document.getElementById('gallery');

// Get references to modal elements
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalVideo = document.getElementById('modal-video');
const modalTitle = document.getElementById('modal-title');
const modalDate = document.getElementById('modal-date');
const modalExplanation = document.getElementById('modal-explanation');
const closeBtn = document.querySelector('.close-btn');

// Get reference to space fact element
const spaceFact = document.getElementById('space-fact');

// NASA APOD API key and endpoint
const API_KEY = 'ogmFeBydY0W0EPo5zT3UFaeM1wkZcqP3K94Qyq93';
const API_URL = 'https://api.nasa.gov/planetary/apod';

// Array of fun space facts
const spaceFacts = [
  '🌟 The Sun accounts for 99.86% of the mass in our solar system!',
  '🌙 A day on Venus is longer than a year on Venus!',
  '🪐 Saturn\'s rings are made of billions of pieces of ice and rock!',
  '🌌 There are more stars in the universe than grains of sand on all Earth\'s beaches!',
  '☄️ The footprints on the Moon will last for millions of years due to no wind or water!'
];

// Function to display a random space fact
function displayRandomFact() {
  // Get a random index from the spaceFacts array
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  // Display the random fact in the space-fact div
  spaceFact.textContent = spaceFacts[randomIndex];
}

// Function to create a gallery card for each APOD item
function createGalleryCard(item) {
  // Check if the media type is 'image' or 'video'
  if (item.media_type === 'image') {
    // Display image normally
    return `
      <div class="gallery-card">
        <img src="${item.url}" alt="${item.title}" class="gallery-image" />
        <div class="gallery-info">
          <h3>${item.title}</h3>
          <p>${item.date}</p>
        </div>
      </div>
    `;
  } else if (item.media_type === 'video') {
    // Display a video placeholder for videos
    return `
      <div class="gallery-card">
        <div class="video-placeholder">▶️ Video</div>
        <div class="gallery-info">
          <h3>${item.title}</h3>
          <p>${item.date}</p>
        </div>
      </div>
    `;
  }
  
  // Skip other media types
  return '';
}

// Function to display an error message
function showError(message) {
  gallery.innerHTML = `<div class="error-message">${message}</div>`;
}

// Function to open the modal with image or video details
function openModal(item) {
  // Populate modal with the item's data
  modalTitle.textContent = item.title;
  modalDate.textContent = item.date;
  modalExplanation.textContent = item.explanation;
  
  // Check if the item is an image or video
  if (item.media_type === 'image') {
    // Show image and hide video
    modalImage.src = item.url;
    modalImage.alt = item.title;
    modalImage.style.display = 'block';
    modalVideo.style.display = 'none';
  } else if (item.media_type === 'video') {
    // Show video and hide image
    modalVideo.src = item.url;
    modalVideo.style.display = 'block';
    modalImage.style.display = 'none';
  }
  
  // Show the modal
  modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
  modal.style.display = 'none';
}

// Function to fetch and display images
async function fetchAndDisplayImages() {
  // Get the selected dates
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Clear previous gallery and show loading message
  gallery.innerHTML = '';
  loadingMessage.style.display = 'block';

  try {
    // Build the API URL with query parameters
    const url = `${API_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

    // Fetch data from NASA APOD API
    const response = await fetch(url);

    // Check if the response is OK
    if (!response.ok) {
      throw new Error('Failed to fetch data from NASA API.');
    }

    // Parse the JSON data
    const data = await response.json();

    // Check if data is an array (for date range) or a single object
    const items = Array.isArray(data) ? data : [data];

    // Filter to only include images and videos
    const displayableItems = items.filter(item => 
      item.media_type === 'image' || item.media_type === 'video'
    );

    // Create gallery cards for each item
    const cards = displayableItems.map(createGalleryCard).join('');

    // Display the cards or a message if no images found
    gallery.innerHTML = cards || '<div>No images found for the selected dates.</div>';
    
    // Add click event listeners to each gallery card
    const galleryCards = document.querySelectorAll('.gallery-card');
    galleryCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        // Open modal with the corresponding item data
        openModal(displayableItems[index]);
      });
    });
  } catch (error) {
    // Show error message if something goes wrong
    showError(error.message);
  } finally {
    // Hide the loading message
    loadingMessage.style.display = 'none';
  }
}

// Add click event listener to the button
getImagesBtn.addEventListener('click', fetchAndDisplayImages);

// Add event listener to close button
closeBtn.addEventListener('click', closeModal);

// Add event listener to close modal when clicking outside the modal content
modal.addEventListener('click', (event) => {
  // Only close if the click is on the modal background, not the content
  if (event.target === modal) {
    closeModal();
  }
});

// Display a random space fact when the page loads
displayRandomFact();
