async function analyzeImage(imageBase64, language) {
    try {
        const n8nLink = process.env.N8N_LINK;

        if (!n8nLink) {
            throw new Error('N8N_LINK environment variable is not defined');
        }

        const payload = {
            image: imageBase64,
            language: language
        };

        const response = await fetch(n8nLink, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
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
