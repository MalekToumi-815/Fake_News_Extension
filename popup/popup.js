import analyzeImage from '../scripts/api-client.js';

// Get the scan button element
const scanBtn = document.getElementById('scan-btn');

// Add click event listener to the scan button
scanBtn.addEventListener('click', async () => {
    try {
        // Disable button to prevent multiple clicks
        scanBtn.disabled = true;
        scanBtn.textContent = 'Scanning...';

        // Capture visible tab screenshot
        const screenshotDataUrl = await await chrome.tabs.captureVisibleTab(null, { 
                format: 'jpeg', 
                quality: 30  // Dropping to 30% significantly reduces string length
            });

        // Convert data URL to Blob
        const response = await fetch(screenshotDataUrl);
        const blob = await response.blob();

        // Call the analyzeImage function with the captured image
        const result = await analyzeImage(blob);

        // Reset button
        scanBtn.disabled = false;
        scanBtn.innerHTML = '<span class="button-icon">🔍</span>Scan This Page';

        // Handle the result (send to results page or display)
        console.log('Analysis result:', result);

        // Send the result to the background script
        chrome.runtime.sendMessage({ 
            type: 'ANALYSIS_RESULT', 
            data: result 
        });

    } catch (error) {
        console.error('Error during scan:', error);
        scanBtn.disabled = false;
        scanBtn.innerHTML = '<span class="button-icon">🔍</span>Scan This Page';
        alert('Error scanning page. Please try again.');
    }
});
