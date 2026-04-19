// Initialize progress circle
function initializeProgressCircle(percentage) {
    const circle = document.getElementById('progressCircle');
    const circumference = 2 * Math.PI * 90; // radius is 90
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = strokeDashoffset;
}

// Populate page with API response data
async function populateResults() {
    try {
        // Get stored result from chrome.storage
        chrome.storage.local.get('lastResult', (result) => {
            if (result.lastResult) {
                const data = result.lastResult;
                
                // Update authenticity percentage
                if (data.authenticityPercentage !== undefined) {
                    document.querySelector('.percentage').textContent = data.authenticityPercentage + '%';
                    
                    // Update status based on percentage
                    const statusEl = document.querySelector('.status');
                    if (data.authenticityPercentage >= 70) {
                        statusEl.textContent = 'SAFE';
                        statusEl.style.color = '#00ff88';
                    } else if (data.authenticityPercentage >= 40) {
                        statusEl.textContent = 'SUSPICIOUS';
                        statusEl.style.color = '#ffaa00';
                    } else {
                        statusEl.textContent = 'FAKE';
                        statusEl.style.color = '#ff4466';
                    }
                    
                    // Initialize progress circle
                    initializeProgressCircle(data.authenticityPercentage);
                }
                
                // Update manipulation score (inverse of authenticity)
                if (data.authenticityPercentage !== undefined) {
                    const manipulationScore = 100 - data.authenticityPercentage;
                    document.querySelector('.manipulation-percentage').textContent = manipulationScore + '%';
                    document.querySelector('.progress-bar .progress-fill').style.width = manipulationScore + '%';
                }
                
                // Update verification sources
                if (data.verificationUrls && Array.isArray(data.verificationUrls)) {
                    const sourcesList = document.querySelector('.sources-list');
                    sourcesList.innerHTML = '';
                    
                    data.verificationUrls.forEach(url => {
                        const link = document.createElement('a');
                        link.href = url;
                        link.className = 'source-link';
                        link.target = '_blank';
                        link.innerHTML = `<span class="link-icon">🔗</span>${url}`;
                        sourcesList.appendChild(link);
                    });
                }
                
                // Update verdict
                if (data.verdict) {
                    const verdictText = document.querySelector('.verdict-text');
                    verdictText.innerHTML = `Based on comprehensive analysis, this content is classified as <strong>${data.verdict}</strong>.`;
                }
                
                // Update report
                if (data.report) {
                    const reportItem = document.querySelector('.report-item:nth-child(3)');
                    if (reportItem) {
                        const pElement = reportItem.querySelector('p');
                        if (pElement) {
                            pElement.textContent = data.report;
                        }
                    }
                }
                
                // Update analysis timestamp
                const analysisTime = document.getElementById('analysisTime');
                const now = new Date();
                analysisTime.textContent = now.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZoneName: 'short'
                });
            }
        });
    } catch (error) {
        console.error('Error populating results:', error);
    }
}

// Action buttons functionality
document.addEventListener('DOMContentLoaded', () => {
    // Populate results from stored data
    populateResults();
    
    const googleBtn = document.querySelector('.btn-secondary');
    const compareBtn = document.querySelector('.btn-primary');
    const shareBtn = document.querySelector('.btn-tertiary');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            alert('Opening Google search in a new tab...');
            // In a real app: window.open('https://google.com/search?q=...', '_blank');
        });
    }
    
    if (compareBtn) {
        compareBtn.addEventListener('click', () => {
            alert('Compare Sources feature coming soon...');
        });
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            alert('Share Analysis feature coming soon...');
        });
    }
    
    // Source links
    document.querySelectorAll('.source-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Opening source: ' + link.textContent.trim());
            // In a real app: window.open(link.href, '_blank');
        });
    });
});
