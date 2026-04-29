# Fake News Verification Extension

This project is a complete browser extension backed by a powerful automation workflow built in **n8n**. It enables users to detect and fact-check suspect content (like social media posts, news snippets, or misleading images) directly from their browser, analyze the visual and textual data, and instantly display a verified fact-checking report.

## How It Works

1. **User Interaction (Extension Frontend)**: The user opens the extension popup in their browser, selects their preferred language, and clicks a button to capture a screenshot of the content they are currently viewing.
2. **Transmission**: The frontend JavaScript securely extracts the image data and sends it, along with the requested translation language, to the n8n backend via a webhook `POST` request.
3. **Analysis (Backend)**: 
   - Uses Google Gemini to extract text directly from the screenshot (OCR).
   - Uses Google Gemini to generate a visual description of the image context.
4. **Fact-Checking Agent**: 
   - A LangChain AI Agent analyzes the combined text and image context.
   - It intelligently queries the **Google Fact Check API** to verify factual claims against previously validated news.
   - It runs a custom **Source Suggester Tool** to find authoritative sources based on the identified topic.
5. **Response & Display**: The n8n workflow enforces a strict structured JSON output and streams it back to the extension. The frontend UI captures this and renders a clean dashboard showing: an authenticity percentage, verification URLs, a final verdict (Real/Fake/Mixed/Unverified), and a translated, highly detailed report.

## Technologies Used

### Frontend / Browser Extension
* **Browser Extension APIs (Manifest V3)**: Manages tab capture, background service workers, and extension permissions to safely screenshot the active page.
* **HTML / CSS / JavaScript**: Handles the clean modern popup UI, loading states, and dynamic result rendering within the extension window.
* **Fetch API**: Forms the secure data pipeline connecting the extension's user interface to the backend webhook, transmitting `multipart/form-data`.

### Core Automation (Backend)
* ** <img width="1675" height="928" alt="image" src="https://github.com/user-attachments/assets/84c39a7a-0a2b-4e3f-af97-c1aa078f56a5" />
  **: The core workflow automation platform. It visually orchestrates the entire pipeline from receiving the webhook to executing multi-agent AI logic and returning the final response.

### AI & Large Language Models
* **Google Gemini API**: Powers the core AI capabilities of the project (`gemini-3-flash-preview`).
  * Used for vision tasks: extracting raw text from uploaded screenshots and providing situational descriptions of the images.
  * Acts as the underlying reasoning engine for the LangChain agent.
* **LangChain (via n8n integration)**: Drives the AI Agent (`@n8n/n8n-nodes-langchain.agent`). Used for tool-calling, multi-step reasoning, and leveraging a structured output parser to ensure the final report follows a strict JSON schema.

### APIs & Tools
* **Google Fact Check Tools API**: Queried dynamically by the AI agent to search for verified factual claims and trusted news validations across the web.
* **Custom Code**: Utilized inside the "Source Suggester Tool" node to logically route different topics (e.g., medical, political, science) to specifically known authoritative domains (like Reuters, Mayo Clinic, or Nature).
