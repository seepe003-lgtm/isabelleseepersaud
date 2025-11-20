// Enhanced Image Loading Handler
document.addEventListener('DOMContentLoaded', function() {
    // Handle lazy loading images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    lazyImages.forEach(img => {
        // Add loading class initially
        img.classList.add('image-loading');
        
        // Handle successful load
        img.addEventListener('load', function() {
            this.classList.remove('image-loading');
            this.classList.add('loaded');
        });
        
        // Enhanced error handling
        img.addEventListener('error', function() {
            this.classList.remove('image-loading');
            this.classList.add('error-fallback');
            
            // Try fallback image if not already using it
            if (!this.src.includes('mypic.svg')) {
                console.log('Image failed to load:', this.src);
                const originalSrc = this.src;
                this.src = this.src.replace(/[^/]*$/, 'mypic.svg');
                
                // If fallback also fails, show text alternative
                this.addEventListener('error', function() {
                    this.style.display = 'none';
                    
                    // Create text replacement
                    const textDiv = document.createElement('div');
                    textDiv.className = 'image-placeholder';
                    textDiv.style.cssText = `
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #f7fafc;
                        color: #718096;
                        border: 2px dashed #e2e8f0;
                        border-radius: 8px;
                        padding: 20px;
                        text-align: center;
                        font-size: 0.9rem;
                        width: 100%;
                        height: ${this.height || 200}px;
                        box-sizing: border-box;
                    `;
                    textDiv.innerHTML = `
                        <div>
                            <div style="font-weight: 600; margin-bottom: 8px;">📷 Image Unavailable</div>
                            <div>${this.alt || 'Image could not be loaded'}</div>
                        </div>
                    `;
                    
                    this.parentNode.insertBefore(textDiv, this);
                }, { once: true });
            }
        });
    });
    
    // Add intersection observer for better performance
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        // Observe images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Preload critical images
    const criticalImages = [
        'images/IMG_4250.JPG',
        'images/mypic.svg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});