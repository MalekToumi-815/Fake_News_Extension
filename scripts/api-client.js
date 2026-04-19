async function analyzeImage(imageBlob, language) {
    try {
        const n8nLink = 'https://raedaroua.app.n8n.cloud/webhook-test/fake-news-check';

        if (!n8nLink) {
            throw new Error('N8N_LINK is not defined');
        }

        const formData = new FormData();
        formData.append('image', imageBlob, 'screenshot.jpeg');
        formData.append('language', language);

        const response = await fetch(n8nLink, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error analyzing image:', error);
        throw error;
    }
}

export default analyzeImage;
