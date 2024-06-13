// Function to upload the most recently modified image
async function uploadMostRecentImage() {
    try {
        var latestImage = document.getElementById('latest-image');
        // Set the src attribute to the new image URL (recent.jpg does not exist currently)
        latestImage.src = '/var/www/html/dev/uploads/newest.jpg';

	// Add event listener for error
        latestImage.addEventListener('error', function() {
            // If image loading fails, set the source to 'loading.gif'
            latestImage.src = 'loading.gif';
        });


      } catch (error) {
        console.error('Error uploading most recent image:', error);
    }
}

// Update UI every one second
setInterval(async () => {
  uploadMostRecentImage();
}, 1000);
