// Initialize progress circle
function initializeProgressCircle(percentage) {
    const circle = document.getElementById('progressCircle');
    const circumference = 2 * Math.PI * 90; // radius is 90
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDashoffset = strokeDashoffset;
}

// Expandable sections functionality
const explanationBtn = document.getElementById('explanationBtn');
const explanationContent = document.getElementById('explanationContent');

explanationBtn.addEventListener('click', () => {
    const isOpen = explanationContent.style.display !== 'none';
    
    if (isOpen) {
        explanationContent.style.display = 'none';
        explanationBtn.classList.remove('open');
    } else {
        explanationContent.style.display = 'block';
        explanationBtn.classList.add('open');
    }
});

// Action buttons functionality
document.addEventListener('DOMContentLoaded', () => {
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
    
    // Initialize progress circle with 85%
    initializeProgressCircle(85);
});
