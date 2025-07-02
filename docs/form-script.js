// Google Sheets form handler
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevent default form submission
            
            // Send data to Google Sheet
            try {
                const formData = {
                    name: this.elements.name.value,
                    email: this.elements.email.value,
                    message: this.elements.message.value,
                    date: new Date().toISOString()
                };
                
                // Google Sheet Apps Script Web App URL
                const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzNRzx2tQR6IS_KA9HlyZr3KiGQJKVfsnJ6JUe4gKUGzsNZWlcqa26-6beYkISXMw2M/exec';
                
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Log the data being sent for debugging
                console.log('Sending form data:', formData);
                console.log('To URL:', SCRIPT_URL);
                
                // Use form-urlencoded format instead of JSON for better compatibility
                const formBody = new URLSearchParams();
                Object.keys(formData).forEach(key => {
                    formBody.append(key, formData[key]);
                });
                
                // Use fetch to send data to Google Sheet
                fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', // This is required for cross-origin requests to Google Apps Script
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formBody.toString(),
                })
                .then(response => {
                    console.log('Response received:', response);
                    // Reset form
                    contactForm.reset();
                    // Redirect to thank-you page
                    window.location.href = 'thank-you.html';
                })
                .catch(error => {
                    console.error('Error sending to Google Sheet:', error);
                    alert('Something went wrong. Please try again later.');
                })
                .finally(() => {
                    // Restore button state
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
            } catch (error) {
                console.error('Error in form processing:', error);
                alert('Something went wrong. Please try again later.');
            }
        });
    }
});
