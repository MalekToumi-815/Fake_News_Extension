# Fake News AI Detection Extension

A powerful Chrome extension that analyzes web content to detect fake news, manipulated media, and suspicious content using advanced AI analysis.

## Features

- 🔍 **Screenshot Analysis** - Captures and analyzes webpage content
- 📊 **Risk Assessment** - Provides authenticity scores and manipulation detection
- 🌍 **Multi-language Support** - English, French, Arabic, and Tunisian
- 🛡️ **Detailed Reports** - Comprehensive analysis with verification sources
- ⚡ **Real-time Detection** - Fast analysis with actionable recommendations

## Installation

### Prerequisites
- Google Chrome/Chromium browser (version 90+)
- Node.js (optional, for development)

### Steps to Install

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/Fake_News_Extension.git
   cd Fake_News_Extension
   ```

2. **Load Extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right corner)
   - Click **Load unpacked**
   - Select the `Fake_News_Extension` folder
   - The extension icon should now appear in your Chrome toolbar

## How to Use the Extension

### Step 1: Open the Extension
- Click the **Fake News AI** icon in your Chrome toolbar
- A popup window will appear with language options

### Step 2: Select Language
- Choose your preferred language from the dropdown:
  - English
  - French
  - Arabic
  - Tunisian

### Step 3: Scan the Page
- Click the **"Scan This Page"** button
- The extension will:
  - Capture a screenshot of the current webpage
  - Analyze the content
  - Open a detailed results page in a new tab

### Step 4: Review Analysis Results
The results page displays:

- **Safety Score** (85% in demo) - Overall authenticity assessment
- **Risk Level** - Low, Medium, or High Risk classification
- **Confidence Level** - Reliability of the analysis
- **Analysis Summary** - Detailed explanation of findings
- **Keywords** - Important terms identified in the content
- **Manipulation Score** - Percentage of detected manipulation
- **Verification Sources** - Links to fact-checking databases
- **Recommended Actions** - Safety guidelines and best practices

### Step 5: Take Action
- **Search on Google** - Verify content with search results
- **Compare Sources** - Cross-reference with other sources
- **Share Analysis** - Share findings with others

## Project Structure

```
Fake_News_Extension/
├── manifest.json           # Extension configuration
├── README.md              # This file
├── popup/
│   ├── popup.html         # Popup UI
│   ├── popup.css          # Popup styles
│   └── popup.js           # Popup logic
├── scripts/
│   ├── background.js      # Background service worker
│   └── api-client.js      # API integration
└── results/
    ├── index.html         # Results page UI
    ├── styles.css         # Results styling
    └── script.js          # Results interactivity
```

## Development

### File Descriptions

- **manifest.json** - Defines extension permissions and configuration
- **popup.html/css/js** - User interface for scanning and language selection
- **background.js** - Service worker handling extension lifecycle
- **api-client.js** - Handles API communication for analysis
- **results/** - Complete results page with analysis visualization

### Future Enhancements

- [ ] API integration for real analysis
- [ ] Database caching for performance
- [ ] Browser history scanning
- [ ] Batch analysis capabilities
- [ ] User account system for saved reports
- [ ] Chrome Sync for cross-device settings

## API Integration

Currently using **mock data** for demonstration. To connect real API:

1. Update `api-client.js` with your API endpoint
2. Modify `popup.js` to send screenshot data to the API
3. Process results in `results/script.js`

## Troubleshooting

### Extension Not Appearing
- Verify Chrome extension is loaded at `chrome://extensions/`
- Check "Developer mode" is enabled
- Try reloading the extension

### Screenshot Not Capturing
- Ensure the webpage is fully loaded
- Try scanning a different page to verify functionality
- Check browser console for errors (F12)

### Analysis Not Working
- Verify internet connection
- Check API endpoint is accessible
- Review Chrome extension errors in console

## Security & Privacy

- Screenshots are processed locally or sent securely to API
- No personal data is stored or tracked
- All analysis is temporary and not logged
- Results are not shared with third parties

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues, questions, or feature requests, please open an issue on the repository or contact the development team.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Version:** 1.0.0  
**Last Updated:** April 19, 2026