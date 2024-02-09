document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('video');

    
    // Request access to the webcam.
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.srcObject = stream;
                video.play();
            })
            .catch(err => console.error("Error accessing the camera:", err));
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    function detectYellowColor() {
        // Only proceed if the video has started playing and has a current time greater than 0
        if (video.readyState >= HTMLVideoElement.HAVE_CURRENT_DATA && video.currentTime > 0) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
    
            try {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
    
                for (let i = 0; i < data.length; i += 4) {
                    const red = data[i];
                    const green = data[i + 1];
                    const blue = data[i + 2];
                    if (red > 255 && green > 220 && blue < 50) {
                        window.location.href = 'https://effectizationstudio.com'; // Change to your desired URL
                        return; // Exit the function after redirecting
                    }
                }
            } catch (error) {
                console.error("Error processing video frame:", error);
            }
        }
        requestAnimationFrame(detectYellowColor);
    }
    

    video.addEventListener('loadedmetadata', () => {
        // Set canvas size to video size once the metadata is loaded.
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        detectYellowColor();
    });
});
