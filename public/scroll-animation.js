// Super simple scroll animation script

document.addEventListener('DOMContentLoaded', function() {
    // Wait for intro animation to complete
    setTimeout(function() {
        // Get all elements to animate
        const animatedElements = document.querySelectorAll('.scroll-fade-up');
        
        // Function to check if element is in viewport
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
                rect.bottom >= 0
            );
        }
        
        // Function to check scroll position and animate elements
        function checkScroll() {
            animatedElements.forEach(function(element) {
                if (isInViewport(element)) {
                    element.classList.add('scroll-visible');
                }
            });
        }
        
        // Listen for scroll events
        window.addEventListener('scroll', checkScroll);
        
        // Check initial state
        checkScroll();
        
        // Force check again after a short delay (in case of rendering delays)
        setTimeout(checkScroll, 500);
    }, 3500); // Wait for intro animation to finish
});
