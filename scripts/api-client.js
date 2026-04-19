async function analyzeImage(imageData, language) {
    try {
        // n8n Webhook expects multipart/form-data with a FILE part named `image`.
        // In n8n, this arrives as: item.binary.image
        const n8nLink = 'https://raedaroua.app.n8n.cloud/webhook/fake-news-check';
        console.log('[API-CLIENT] analyzeImage called with language:', language);
        console.log('[API-CLIENT] Image data type:', typeof imageData);
        console.log('[API-CLIENT] Image data size:', imageData.byteLength || imageData.size, 'bytes');

        if (!n8nLink) {
            throw new Error('N8N_LINK is not defined');
        }

        // Convert ArrayBuffer back to Blob if needed
        let imageBlob;
        if (imageData instanceof Blob) {
            imageBlob = imageData;
            console.log('[API-CLIENT] Image is already a Blob');
        } else if (imageData instanceof ArrayBuffer) {
            imageBlob = new Blob([imageData], { type: 'image/jpeg' });
            console.log('[API-CLIENT] Converted ArrayBuffer to Blob');
        } else {
            // Fallback: treat as ArrayBuffer
            imageBlob = new Blob([new Uint8Array(imageData)], { type: 'image/jpeg' });
            console.log('[API-CLIENT] Converted array to Blob');
        }

        // Use a real File to make n8n reliably recognize the upload as binary.
        const imageFile = new File([imageBlob], 'screenshot.jpeg', {
            type: imageBlob.type || 'image/jpeg',
        });
        console.log('[API-CLIENT] Prepared File:', {
            name: imageFile.name,
            type: imageFile.type,
            size: imageFile.size,
        });

        const formData = new FormData();
        // Field name must be exactly `image` (matches binary property name expected in n8n)
        formData.set('image', imageFile);
        formData.set('language', language);
        console.log('[API-CLIENT] FormData created with image and language');

        // Debug what will be sent
        try {
            for (const [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log('[API-CLIENT] FormData entry:', key, {
                        name: value.name,
                        type: value.type,
                        size: value.size,
                    });
                } else {
                    console.log('[API-CLIENT] FormData entry:', key, value);
                }
            }
        } catch {
            // Some environments may not allow iterating FormData entries.
        }

        console.log('[API-CLIENT] Sending POST request to:', n8nLink);
        const response = await fetch(n8nLink, {
            method: 'POST',
            body: formData,
        });

        console.log('[API-CLIENT] Response received with status:', response.status);
        
        // Log response text for debugging
        const responseText = await response.text();
        console.log('[API-CLIENT] Response text:', responseText);
        
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}: ${responseText}`);
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.warn('[API-CLIENT] Could not parse response as JSON, returning raw text');
            data = { rawResponse: responseText };
        }
        
        console.log('[API-CLIENT] Response data:', data);
        return data;

    } catch (error) {
        console.error('[API-CLIENT] Error analyzing image:', error);
        throw error;
    }
}

export default analyzeImage;
