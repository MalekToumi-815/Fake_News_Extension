
// Get the scan button and language select elements
const scanBtn = document.getElementById('scan-btn');
const languageSelect = document.getElementById('language-select');

// Helper function to crop image blob
async function cropImageBlob(blob, region) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = region.width;
            canvas.height = region.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, region.x, region.y, region.width, region.height, 0, 0, region.width, region.height);
            
            canvas.toBlob(resolve, 'image/jpeg', 0.9);
        };
        img.src = URL.createObjectURL(blob);
    });
}

// Add click event listener to the scan button
scanBtn.addEventListener('click', async () => {
    try {
        // Disable button to prevent multiple clicks
        scanBtn.disabled = true;
        scanBtn.textContent = 'Scanning...';

        // Get selected language
        const selectedLanguage = languageSelect.value;

        // Get the active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // Inject the selection script
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: startRegionSelectionOnPage
        });

        if (results && results[0] && results[0].result) {
            const selectedRegion = results[0].result;
            
            // Capture the tab and crop to selected region
            const screenshotDataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
                format: 'jpeg',
                quality: 90
            });

            // Convert to blob and crop
            const imgResponse = await fetch(screenshotDataUrl);
            const blob = await imgResponse.blob();
            
            // Crop the blob to the selected region
            const croppedBlob = await cropImageBlob(blob, selectedRegion);

            console.log('Screenshot captured:', croppedBlob);
            console.log('Blob size:', croppedBlob.size, 'bytes');
            console.log('language:', selectedLanguage);
            
            // TODO: Send to API with analyzeImage(croppedBlob, selectedLanguage)
        }

        // Reset button
        scanBtn.disabled = false;
        scanBtn.innerHTML = '<span class="button-icon">🔍</span>Scan This Page';

    } catch (error) {
        console.error('Error during scan:', error);
        scanBtn.disabled = false;
        scanBtn.innerHTML = '<span class="button-icon">🔍</span>Scan This Page';
        alert('Error scanning page. Please try again or navigate to a valid webpage.');
    }
});

// Function to inject into the page
function startRegionSelectionOnPage() {
    return new Promise((resolve) => {
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

            resolve(region);
        });

        // Allow escape to cancel
        const cancelHandler = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                selectionBox.remove();
                document.removeEventListener('keydown', cancelHandler);
                resolve(null);
            }
        };

        document.addEventListener('keydown', cancelHandler);
    });
}
