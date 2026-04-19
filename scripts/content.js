// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('[CONTENT] Message received from popup:', request.action);
    if (request.action === 'startSelection') {
        startRegionSelection(sendResponse);
        return true; // Keep the message channel open for async response
    }
});

function startRegionSelection(callback) {
    console.log('[CONTENT] Starting region selection');
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'screenshot-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        cursor: crosshair;
        z-index: 2147483647;
    `;

    // Create selection box
    const selectionBox = document.createElement('div');
    selectionBox.id = 'selection-box';
    selectionBox.style.cssText = `
        position: fixed;
        border: 2px solid #2563eb;
        background: rgba(37, 99, 235, 0.1);
        display: none;
        z-index: 2147483648;
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(selectionBox);

    let isSelecting = false;
    let startX, startY, endX, endY;

    overlay.addEventListener('mousedown', (e) => {
        console.log('[CONTENT] Mouse down at:', e.clientX, e.clientY);
        isSelecting = true;
        startX = e.clientX;
        startY = e.clientY;
        selectionBox.style.display = 'block';
    });

    overlay.addEventListener('mousemove', (e) => {
        if (!isSelecting) return;

        endX = e.clientX;
        endY = e.clientY;

        const minX = Math.min(startX, endX);
        const minY = Math.min(startY, endY);
        const maxX = Math.max(startX, endX);
        const maxY = Math.max(startY, endY);

        selectionBox.style.left = minX + 'px';
        selectionBox.style.top = minY + 'px';
        selectionBox.style.width = (maxX - minX) + 'px';
        selectionBox.style.height = (maxY - minY) + 'px';
    });

    overlay.addEventListener('mouseup', () => {
        if (!isSelecting) return;
        isSelecting = false;
        console.log('[CONTENT] Mouse up, calculating region');

        // Clean up
        overlay.remove();
        selectionBox.remove();

        // Calculate region
        const minX = Math.min(startX, endX);
        const minY = Math.min(startY, endY);
        const maxX = Math.max(startX, endX);
        const maxY = Math.max(startY, endY);

        const region = {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
        
        console.log('[CONTENT] Region calculated:', region);
        console.log('[CONTENT] Sending success response with region');
        callback({ success: true, region });
    });

    // Allow escape to cancel
    const cancelHandler = (e) => {
        if (e.key === 'Escape') {
            console.log('[CONTENT] Escape pressed, cancelling selection');
            overlay.remove();
            selectionBox.remove();
            document.removeEventListener('keydown', cancelHandler);
            console.log('[CONTENT] Sending cancel response');
            callback({ success: false });
        }
    };

    document.addEventListener('keydown', cancelHandler);
}
