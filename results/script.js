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
                // Support both shapes:
                // - { authenticityPercentage, verificationUrls, verdict, report }
                // - { output: { authenticityPercentage, verificationUrls, verdict, report } }
                const raw = result.lastResult;
                const data = (raw && typeof raw === 'object' && raw.output && typeof raw.output === 'object')
                    ? raw.output
                    : raw;

                const authenticity = (data && data.authenticityPercentage !== undefined)
                    ? Number(data.authenticityPercentage)
                    : undefined;
                const clampedAuthenticity = (authenticity === undefined || Number.isNaN(authenticity))
                    ? undefined
                    : Math.max(0, Math.min(100, authenticity));
                
                // Update authenticity percentage
                if (clampedAuthenticity !== undefined) {
                    const percentageEl = document.querySelector('.percentage');
                    if (percentageEl) percentageEl.textContent = clampedAuthenticity + '%';
                    
                    // Update status based on percentage
                    const statusEl = document.querySelector('.status');
                    if (statusEl) {
                        if (clampedAuthenticity >= 70) {
                            statusEl.textContent = 'SAFE';
                            statusEl.style.color = '#00ff88';
                        } else if (clampedAuthenticity >= 40) {
                            statusEl.textContent = 'SUSPICIOUS';
                            statusEl.style.color = '#ffaa00';
                        } else {
                            statusEl.textContent = 'FAKE';
                            statusEl.style.color = '#ff4466';
                        }
                    }
                    
                    // Initialize progress circle
                    initializeProgressCircle(clampedAuthenticity);
                }
                
                // Update manipulation score (inverse of authenticity)
                if (clampedAuthenticity !== undefined) {
                    const manipulationScore = 100 - clampedAuthenticity;
                    const manipulationEl = document.querySelector('.manipulation-percentage');
                    if (manipulationEl) manipulationEl.textContent = manipulationScore + '%';
                    const manipulationFill = document.querySelector('.progress-bar .progress-fill');
                    if (manipulationFill) manipulationFill.style.width = manipulationScore + '%';
                }
                
                // Update verification sources
                const urls = (data && Array.isArray(data.verificationUrls)) ? data.verificationUrls : null;
                if (urls) {
                    const sourcesList = document.querySelector('.sources-list');
                    if (!sourcesList) return;
                    sourcesList.innerHTML = '';
                    
                    urls.forEach(url => {
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
                    if (verdictText) {
                        verdictText.innerHTML = `Based on comprehensive analysis, this content is classified as <strong>${data.verdict}</strong>.`;
                    }
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
                if (analysisTime) {
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
