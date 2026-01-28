const checkInQuestions = [
    "How would you rate the overall effort and severity of your stuttering today?",
    "How much did you avoid speaking situations today?",
    "How much physical tension did you feel while speaking?",
    "How confident did you feel in your communication?",
    "How satisfied are you with your speech overall?"
];

let currentStep = 1;

function navigateTo(page) {
    console.log('Navigating to ' + page);
    
    if (page === 'daily-check-in') {
        openCheckIn();
        return;
    }

    // Check if clicked item is a nav item
    if (['home', 'prepare', 'cuebot', 'reflect'].includes(page)) {
        // Update active state
        document.querySelectorAll('.nav-item').forEach(el => {
            el.classList.remove('active');
        });
        
        // Find the element that called this function and add active class
        // In a real app we'd target by matching Nav Item ID
    }
    
    // alert('You clicked: ' + page);
}

// Check In Modal Logic
function openCheckIn() {
    document.getElementById('checkin-modal').classList.add('open');
    resetCheckIn();
}

function closeCheckIn() {
    document.getElementById('checkin-modal').classList.remove('open');
}

function resetCheckIn() {
    currentStep = 1;
    updateStepUI();
    // Reset dial to default position (e.g. 3)
    scrollToRating(3);
}

function nextStep() {
    if (currentStep < 5) {
        currentStep++;
        updateStepUI();
    } else {
        // Finish logic
        alert("Daily Check In Completed!");
        closeCheckIn();
    }
}

function updateStepUI() {
    // Update Counter
    document.getElementById('step-counter').textContent = `${currentStep}/5`;
    
    // Update Question
    const question = checkInQuestions[currentStep - 1] || checkInQuestions[0];
    document.getElementById('question-text').textContent = question;
    
    // Update Button
    const nextBtn = document.getElementById('next-btn');
    if (currentStep === 5) {
        nextBtn.className = 'finish-btn'; // changed class structure
        nextBtn.innerHTML = 'Finish';
    } else {
        nextBtn.className = 'next-btn';
        nextBtn.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
    }
}

// Dial Logic
function initDial() {
    const dialWrapper = document.getElementById('dial-wrapper');
    if (!dialWrapper) return;
    
    // Create numbers 1-10
    for(let i=1; i<=10; i++) {
        const el = document.createElement('div');
        el.className = 'dial-number';
        el.textContent = i;
        el.id = `dial-num-${i}`;
        dialWrapper.appendChild(el);
    }
    
    // Add Scroll Listener for scaling effect
    dialWrapper.addEventListener('scroll', () => {
        handleDialScroll(dialWrapper);
    });

    // Initial scroll to 3 after a small delay to ensure layout
    setTimeout(() => scrollToRating(3), 100);
}

function handleDialScroll(wrapper) {
    const center = wrapper.scrollLeft + (wrapper.offsetWidth / 2);
    const numbers = document.querySelectorAll('.dial-number');
    
    let closestDist = Infinity;
    let closestNum = null;

    numbers.forEach(num => {
        const numCenter = num.offsetLeft + (num.offsetWidth / 2);
        const dist = Math.abs(center - numCenter);
        
        // Arc Logic:
        // Calculate Y translation based on distance from center (parabola)
        // y = x^2 * factor
        // Closer to center (dist 0) -> y = 0
        // Further away -> y increases (moves down)
        
        const maxDist = 200; // Range of effect
        let translateY = 0;
        let scale = 0.8;
        
        if (dist < maxDist) {
            // Visualize a semi-circle or hill
            // Normalized distance (0 to 1)
            const norm = dist / maxDist;
            translateY = (norm * norm) * 80; // Push down up to 80px at edges
            
            // Scale logic
            scale = 1.3 - (norm * 0.5); 
        } else {
            translateY = 80;
            scale = 0.8;
        }

        // Apply Transform: Scale + TranslateY
        num.style.transform = `translateY(${translateY}px) scale(${Math.max(0.7, scale)})`;
        
        // Update styling for active vs inactive
        if (dist < 45) { // Threshold for "active"
            num.classList.add('active');
            num.classList.remove('inactive');
        } else {
            num.classList.remove('active');
            num.classList.add('inactive');
        }

        if (dist < closestDist) {
            closestDist = dist;
            closestNum = num;
        }
    });

    if (closestNum) {
        const val = closestNum.textContent;
        const ratingDisplay = document.getElementById('current-rating');
        if (ratingDisplay.textContent !== val) {
             ratingDisplay.textContent = val;
             // Optional: vibrate or sound effect on change
        }
    }
}

function scrollToRating(val) {
    const wrapper = document.getElementById('dial-wrapper');
    const target = document.getElementById(`dial-num-${val}`);
    if (wrapper && target) {
        // Calculate position to center this element
        // scrollLeft = elementLeft + elementHalfWidth - containerHalfWidth
        const scrollPos = target.offsetLeft + (target.offsetWidth / 2) - (wrapper.offsetWidth / 2);
        wrapper.scrollTo({
            left: scrollPos,
            behavior: 'smooth'
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Reframe app loaded');
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    initDial();
});
