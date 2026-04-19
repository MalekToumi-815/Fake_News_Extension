

// Get the scan button element
const scanBtn = document.getElementById('scan-btn');

// Add click event listener to the scan button
scanBtn.addEventListener('click', async () => {
    try {
        // Disable button to prevent multiple clicks
        scanBtn.disabled = true;
        scanBtn.textContent = 'Scanning...';

        // Capture visible tab screenshot
        const screenshotDataUrl = await chrome.tabs.captureVisibleTab(null, { 
                format: 'jpeg', 
                quality: 30  // Dropping to 30% significantly reduces string length
            });

        // Convert data URL to Blob
        const response = await fetch(screenshotDataUrl);
        const blob = await response.blob();

        // Call the analyzeImage function with the captured image
        //const result = await analyzeImage(blob);

        // Reset button
        scanBtn.disabled = false;
        scanBtn.innerHTML = '<span class="button-icon">🔍</span>Scan This Page';

        console.log('Screenshot captured:', blob);
        console.log('Blob size:', blob.size, 'bytes');

        // Send the result to the background script
        /*chrome.runtime.sendMessage({ 
            type: 'ANALYSIS_RESULT', 
            data: result 
        });*/

    } catch (error) {
        console.error('Error during scan:', error);
        scanBtn.disabled = false;
        scanBtn.innerHTML = '<span class="button-icon">🔍</span>Scan This Page';
        alert('Error scanning page. Please try again.');
    }
});
