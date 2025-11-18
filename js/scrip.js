// Additional JavaScript functionality for the website

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add loading animation
function showLoading() {
    console.log('Page loading...');
}

// Hide loading animation
function hideLoading() {
    console.log('Page loaded');
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    hideLoading();
    
    // Add any other initialization code here
    console.log('Website initialized');
});