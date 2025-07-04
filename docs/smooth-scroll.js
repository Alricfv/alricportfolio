// Smooth scrolling functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links that have hash links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    // Add click event listener to each link
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            // Prevent default anchor behavior
            e.preventDefault();
            
            // Get the target element id
            const targetId = this.getAttribute('href');
            
            // Handle special case for home link
            if (targetId === '#') {
                // Scroll to top smoothly
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            // Get the target element
            const targetElement = document.querySelector(targetId);
            
            // If target element exists
            if (targetElement) {
                // Get the position of the element relative to the document
                const yPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                // Scroll smoothly to the target
                window.scrollTo({
                    top: yPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without refreshing the page (optional)
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Also add smooth scrolling to "back to top" button if it exists
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
