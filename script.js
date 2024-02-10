document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('video');
    const canvas = document.createElement('canvas'); // Move canvas creation here if not interacting with it in the DOM
    const ctx = canvas.getContext('2d');
    video.controls = false; // Ensure controls are not displayed

    const constraints = {
        video: {
            facingMode: 'environment' // Attempt to use the back camera
        }
    };

    function detectYellowColor() {
        if (video.readyState >= HTMLVideoElement.HAVE_CURRENT_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const red = data[i];
                const green = data[i + 1];
                const blue = data[i + 2];
                if (red > 200 && green > 200 && blue < 50) { // Adjusted for specific color detection
                    window.location.href = 'https://effectizationstudio.com';
                    return;
                }
            }
            requestAnimationFrame(detectYellowColor);
        } else {
            requestAnimationFrame(detectYellowColor);
        }
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                video.srcObject = stream;
                video.play();
                video.addEventListener('loadedmetadata', () => {
                    detectYellowColor();
                });
            })
            .catch(err => console.error("Error accessing the camera:", err));
    }
});
