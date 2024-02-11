document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('cameraFeed');
    video.controls = false; // Ensure controls are not displayed

    const switchCameraBtn = document.getElementById('switchCameraBtn');
    let currentStream = null;
    let useFrontCamera = true; // Start with the front camera
    let analyzing = false; // Flag to prevent multiple simultaneous analyses

    function stopCurrentVideoStream() {
        if (currentStream) {
            currentStream.getTracks().forEach(track => {
                track.stop();
            });
        }
    }

    function adjustVideoStyle() {
        if (window.innerHeight > window.innerWidth) { 
            video.style.width = 'auto';
            video.style.height = '100vh';
            video.style.objectFit = 'cover';
        } else {
            video.style.height = 'auto';
            video.style.width = '100vw';
            video.style.objectFit = 'cover';
        }
        video.style.transform = useFrontCamera ? 'scaleX(-1)' : 'scaleX(1)';
    }

    function detectYellowColor() {
        if (analyzing) return; // Skip if already analyzing a frame
        analyzing = true;
        let canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            let red = data[i];
            let green = data[i + 1];
            let blue = data[i + 2];
            if (red > 200 && green > 200 && blue < 100) { // Simplified yellow detection
                window.location.href = "https://www.effectizationstudio.com"; // Change to your desired URL
                return;
            }
        }
        analyzing = false; // Reset flag after analysis
    }

    function getCameraStream() {
        stopCurrentVideoStream();
        navigator.mediaDevices.getUserMedia({
            video: { facingMode: useFrontCamera ? 'user' : 'environment' }
        }).then(function(stream) {
            currentStream = stream;
            video.srcObject = stream;
            video.play();
            video.onloadedmetadata = adjustVideoStyle;
            // Start detecting yellow color after the camera feed is successfully loaded
            setInterval(detectYellowColor, 1000); // Check every second, adjust as needed
        }).catch(function(error) {
            console.error("Error accessing the camera: ", error);
        });
    }

    adjustVideoStyle();
    window.addEventListener('resize', adjustVideoStyle);
    switchCameraBtn.addEventListener('click', function() {
        useFrontCamera = !useFrontCamera;
        getCameraStream();
    });

    getCameraStream();
});
