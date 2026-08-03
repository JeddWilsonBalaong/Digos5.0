// Privacy Policy Modal Functionality - Shared across all pages
document.addEventListener('DOMContentLoaded', function() {
    // Check if privacy modal exists on the page
    const privacyModal = document.getElementById('privacyModal');
    if (!privacyModal) return;
    
    const acceptBtn = document.getElementById('acceptPrivacy');
    const declineBtn = document.getElementById('declinePrivacy');
    
    // Check if user has already accepted privacy policy
    const hasAcceptedPrivacy = localStorage.getItem('rbdi-privacy-accepted');
    const hasDeclinedPrivacy = localStorage.getItem('rbdi-privacy-declined');
    
    // Only show modal if user hasn't made a choice yet
    if (!hasAcceptedPrivacy && !hasDeclinedPrivacy) {
        // Show modal after a short delay for better UX
        setTimeout(() => {
            privacyModal.classList.add('show');
            
            // Prevent scrolling when modal is open
            document.body.style.overflow = 'hidden';
        }, 1000);
    }
    
    // Accept privacy policy
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            localStorage.setItem('rbdi-privacy-accepted', 'true');
            localStorage.setItem('rbdi-privacy-date', new Date().toISOString());
            localStorage.removeItem('rbdi-privacy-declined'); // Remove declined status if exists
            
            hideModal();
            showNotification('Privacy policy accepted. Thank you!', 'success');
        });
    }
    
    // Decline privacy policy
    if (declineBtn) {
        declineBtn.addEventListener('click', function() {
            localStorage.setItem('rbdi-privacy-declined', 'true');
            localStorage.removeItem('rbdi-privacy-accepted'); // Remove accepted status if exists
            
            hideModal();
            showNotification('Some features may be limited without accepting our privacy policy.', 'warning');
        });
    }
    
    // Close modal when clicking outside of it
    privacyModal.addEventListener('click', function(e) {
        if (e.target === privacyModal) {
            // Don't allow closing by clicking outside - force user to make a choice
            showNotification('Please accept or decline our privacy policy to continue.', 'info');
        }
    });
    
    // Prevent closing modal with escape key - force user to make a choice
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && privacyModal.classList.contains('show')) {
            e.preventDefault();
            showNotification('Please accept or decline our privacy policy to continue.', 'info');
        }
    });
    
    function hideModal() {
        privacyModal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Utility function to show notifications
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.privacy-notification');
        existingNotifications.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = `privacy-notification alert alert-${getAlertClass(type)} position-fixed`;
        notification.style.cssText = `
            top: 20px; 
            right: 20px; 
            z-index: 10001; 
            max-width: 350px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            border-radius: 8px;
            animation: slideInRight 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${getIconClass(type)} me-2"></i>
                <span>${message}</span>
                <button type="button" class="btn-close btn-close-${type === 'warning' ? 'white' : 'dark'} ms-auto" aria-label="Close"></button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Add close functionality
        const closeBtn = notification.querySelector('.btn-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    function getAlertClass(type) {
        switch (type) {
            case 'success': return 'success';
            case 'warning': return 'warning';
            case 'error': return 'danger';
            default: return 'info';
        }
    }
    
    function getIconClass(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'warning': return 'exclamation-triangle';
            case 'error': return 'exclamation-circle';
            default: return 'info-circle';
        }
    }
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);