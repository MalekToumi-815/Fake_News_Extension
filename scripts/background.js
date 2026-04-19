import analyzeImage from './api-client.js';

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[BACKGROUND] Message received from popup:', message.type);
    if (message.type === 'ANALYZE_IMAGE') {
        // Get image and language from message
        const imageData = message.image;
        const language = message.language;
        console.log('[BACKGROUND] Image data received, type:', typeof imageData);
        console.log('[BACKGROUND] Image data size:', imageData.byteLength || 'unknown', 'bytes');
        console.log('[BACKGROUND] Language:', language);

        // Call analyzeImage function
        console.log('[BACKGROUND] Calling analyzeImage function...');
        analyzeImage(imageData, language)
            .then((result) => {
                console.log('[BACKGROUND] Analysis result received:', result);
                // Store result in chrome.storage
                console.log('[BACKGROUND] Storing result in chrome.storage.local');
                chrome.storage.local.set({ lastResult: result });
                console.log('[BACKGROUND] Sending success response to popup');
                sendResponse({ success: true, result });
            })
            .catch((error) => {
                console.error('[BACKGROUND] Error analyzing image:', error);
                console.error('[BACKGROUND] Sending error response to popup');
                sendResponse({ success: false, error: error.message });
            });

        // Return true to indicate we'll send response asynchronously
        return true;
    }
});