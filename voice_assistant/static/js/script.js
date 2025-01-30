// Get references to DOM elements
const recordButton = document.getElementById("record");
const responseAudio = document.getElementById("responseAudio");
const loader = document.createElement("div");
loader.className = "loader";

// Function to handle recording and sending the audio
async function handleRecording() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Your browser does not support audio recording.");
        return;
    }

    // Add loader to indicate processing
    document.body.appendChild(loader);
    loader.style.display = "block";

    try {
        // Request audio permissions and start recording
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            // Combine audio chunks into a Blob
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

            // Send the audio to the backend
            const formData = new FormData();
            formData.append("audio", audioBlob);

            try {
                const response = await fetch("/", {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();

                    if (result.audio_url) {
                        // Set the audio source to the returned audio file
                        responseAudio.src = result.audio_url;
                        responseAudio.play();
                    } else {
                        alert("Error processing your request.");
                    }
                } else {
                    alert("Server error: Unable to process your question.");
                }
            } catch (error) {
                alert("Error sending the audio: " + error.message);
            }

            // Remove loader
            loader.style.display = "none";
        };

        // Start recording
        mediaRecorder.start();

        // Automatically stop recording after 5 seconds
        setTimeout(() => {
            mediaRecorder.stop();
        }, 5000);
    } catch (error) {
        alert("Error accessing microphone: " + error.message);
        loader.style.display = "none";
    }
}

// Add event listener to the record button
recordButton.addEventListener("click", handleRecording);
