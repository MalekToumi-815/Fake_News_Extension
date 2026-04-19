import analyzeImage from './api-client.js';

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'ANALYZE_IMAGE') {
        // Get image and language from message
        const imageBlob = message.image;
        const language = message.language;

        // Call analyzeImage function
        analyzeImage(imageBlob, language)
            .then((result) => {
                console.log('Analysis result:', result);
                // Store result in chrome.storage
                chrome.storage.local.set({ lastResult: result });
                sendResponse({ success: true, result });
            })
            .catch((error) => {
                console.error('Error analyzing image:', error);
                sendResponse({ success: false, error: error.message });
            });

        // Return true to indicate we'll send response asynchronously
        return true;
    }
});