function navigateTo(page) {
    console.log('Navigating to ' + page);
    
    // Check if clicked item is a nav item
    if (['home', 'prepare', 'cuebot', 'reflect'].includes(page)) {
        // Update active state
        document.querySelectorAll('.nav-item').forEach(el => {
            el.classList.remove('active');
        });
        
        // Find the element that called this function and add active class
        // This is a simplified way; better would be to pass event or id
        // Since we don't have event passed, we can select by the expected index or id
        // For now, let's just alert
    }
    
    alert('You clicked: ' + page);
    
    // In a real application, this would redirect or change the view
    // window.location.href = page + '.html';
}

// Add event listeners to nav items to handle active state visually
document.addEventListener('DOMContentLoaded', () => {
    console.log('Reframe app loaded');
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
