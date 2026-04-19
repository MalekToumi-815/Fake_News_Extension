
// Get the scan button and language select elements
const scanBtn = document.getElementById('scan-btn');
const languageSelect = document.getElementById('language-select');

// Add click event listener to the scan button
scanBtn.addEventListener('click', async () => {
    try {
        // Disable button to prevent multiple clicks
        scanBtn.disabled = true;
        scanBtn.textContent = 'Scanning...';

        // Get selected language
        const selectedLanguage = languageSelect.value;

        // Capture visible tab screenshot
        const screenshotDataUrl = await chrome.tabs.captureVisibleTab(null, { 
                format: 'jpeg', 
                quality: 30
            });

        // Convert data URL to Blob
        const response = await fetch(screenshotDataUrl);
        const blob = await response.blob();

        console.log('Screenshot captured:', blob);
        console.log('Blob size:', blob.size, 'bytes');
        console.log('language:', selectedLanguage);
        
        // Open results page in new tab
        const resultsUrl = chrome.runtime.getURL('results/index.html');
        chrome.tabs.create({ url: resultsUrl });
        
        // Close the popup
        window.close();

        // Reset button
        scanBtn.disabled = false;
        scanBtn.innerHTML = '<span class="button-icon">🔍</span>Scan This Page';

    } catch (error) {
        console.error('Error during scan:', error);
        scanBtn.disabled = false;
        scanBtn.innerHTML = '<span class="button-icon">🔍</span>Scan This Page';
        alert('Error scanning page. Please try again.');
    }
});
