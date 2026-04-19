
// Get the scan button and language select elements
const scanBtn = document.getElementById('scan-btn');
const languageSelect = document.getElementById('language-select');

// Add click event listener to the scan button
scanBtn.addEventListener('click', async () => {
    try {
        console.log('[POPUP] Scan button clicked');
        // Disable button to prevent multiple clicks
        scanBtn.disabled = true;
        scanBtn.textContent = 'Scanning...';

        // Get selected language
        const selectedLanguage = languageSelect.value;
        console.log('[POPUP] Selected language:', selectedLanguage);

        // Get the active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        console.log('[POPUP] Active tab:', tab.id, tab.url);

        // Capture the entire visible tab
        console.log('[POPUP] Capturing visible tab...');
        const screenshotDataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
            format: 'jpeg',
            quality: 50
        });
        console.log('[POPUP] Screenshot captured, converting to blob...');

        // Convert to blob
        const imgResponse = await fetch(screenshotDataUrl);
        const imageBlob = await imgResponse.blob();
        console.log('[POPUP] Image blob created successfully');
        console.log('[POPUP] Blob size:', imageBlob.size, 'bytes');
        console.log('[POPUP] Blob type:', imageBlob.type);
        
        // Convert blob to ArrayBuffer for message passing
        console.log('[POPUP] Converting blob to ArrayBuffer for message passing...');
        const imageArrayBuffer = await imageBlob.arrayBuffer();
        console.log('[POPUP] Blob converted to ArrayBuffer');
        
        // Send image and language to background.js
        console.log('[POPUP] Sending ANALYZE_IMAGE message to background.js');
        chrome.runtime.sendMessage({
            type: 'ANALYZE_IMAGE',
            image: imageArrayBuffer,
            language: selectedLanguage
        }, (response) => {
            console.log('[POPUP] Response received from background:', response);
            if (response && response.success) {
                console.log('[POPUP] Analysis completed successfully');
                alert('Analysis completed! Opening results...');
                // Optionally open results page
                chrome.tabs.create({ url: 'chrome-extension://' + chrome.runtime.id + '/results/index.html' });
            } else {
                console.error('[POPUP] Analysis failed:', response ? response.error : 'Unknown error');
                alert('Analysis failed. Please try again.');
            }
            // Reset button
            scanBtn.disabled = false;
            scanBtn.innerHTML = '<span class="button-icon">🔍</span>Scan This Page';
        });

    } catch (error) {
        console.error('[POPUP] Error during scan:', error);
        scanBtn.disabled = false;
        scanBtn.innerHTML = '<span class="button-icon">🔍</span>Scan This Page';
        alert('Error scanning page. Please try again or navigate to a valid webpage.');
    }
});
