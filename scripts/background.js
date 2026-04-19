// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'ANALYSIS_RESULT') {
        // Store result in chrome.storage
        chrome.storage.local.set({ lastResult: message.data });
        sendResponse({ success: true });
    }
});