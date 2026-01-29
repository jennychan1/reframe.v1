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

    // View Switching Logic
    const supportedViews = ['home', 'prepare', 'script-practice'];
    if (supportedViews.includes(page)) {
        // Hide all views
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
        // Show target view
        const targetView = document.getElementById(`view-${page}`);
        if (targetView) {
            targetView.classList.add('active-view');
        }
        
        // Handle Nav Visibility
        const bottomNav = document.querySelector('.bottom-nav');
        if(page === 'script-practice') {
            bottomNav.style.display = 'none';
        } else {
            bottomNav.style.display = 'flex';
        }

        // Feature: Prepare Intro
        if (page === 'prepare') {
            const hasSeenIntro = sessionStorage.getItem('hasSeenPrepareIntro');
            if (!hasSeenIntro) {
                document.getElementById('prepare-intro-modal').classList.add('show');
            }
        }
    } else if (['cuebot', 'reflect'].includes(page)) {
        alert(page + ' page coming soon!');
    }

    // Update Bottom Nav Active State
    if (['home', 'prepare', 'cuebot', 'reflect'].includes(page)) {
         document.querySelectorAll('.nav-item').forEach(item => {
            // Check if items onclick attribute matches the page
            const onclick = item.getAttribute('onclick');
            if (onclick && onclick.includes(`'${page}'`)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
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

function closePrepareIntro() {
    document.getElementById('prepare-intro-modal').classList.remove('show');
    sessionStorage.setItem('hasSeenPrepareIntro', 'true');
}


// Upload Modal Logic
function openUploadModal() {
    document.getElementById('upload-modal').classList.add('show');
    initDragAndDrop();
}

function closeUploadModal() {
    document.getElementById('upload-modal').classList.remove('show');
    // Reset text
    document.getElementById('upload-text').innerHTML = '<strong>Click to upload</strong>or drag and drop here';
}

function initDragAndDrop() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);
    
    // Handle selected files
    fileInput.addEventListener('change', function() {
        if (this.files.length) {
            handleFiles(this.files);
        }
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropZone.classList.add('dragover');
    }

    function unhighlight(e) {
        dropZone.classList.remove('dragover');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            document.getElementById('upload-text').innerHTML = '<strong>File Selected:</strong>' + file.name;
            
            // Process file
            if (file.type === 'application/pdf') {
                extractPdfText(file);
            } else {
                // Fallback for demo or text files
                // For images we'd need OCR (tesseract.js) which is heavy, so we'll mock or read text if txt
                 const reader = new FileReader();
                 reader.onload = (e) => {
                     loadScriptView(e.target.result);
                 };
                 // Try reading as text, if garbage, show generic
                 reader.readAsText(file);
            }
             closeUploadModal();
        }
    }
}

async function extractPdfText(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n\n';
        }
        
        loadScriptView(fullText);
    } catch (e) {
        console.error('PDF Error:', e);
        alert('Could not read PDF. Loading demo text.');
        loadScriptView("Stuttering is the most common speech disorder that affects those with residual childhood onset fluency issues. \n\nEach of my interviews was tailored to what I knew about their experiences.\n\nFor adults with speech impediments, finding fluency and confidence tools is critical.");
    }
}

function loadScriptView(text) {
    if (!text || text.length < 5) {
        text = "Stuttering is the most common speech disorder that affects those with residual childhood onset fluency issues. \n\nEach of my interviews was tailored to what I knew about their experiences.\n\nFor adults with speech impediments, finding fluency and confidence tools is critical.";
    }
    
    document.getElementById('script-content').innerText = text;
    
    // Switch View
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
    document.getElementById('view-script-practice').classList.add('active-view');
    
    // Hide Bottom Nav
    document.querySelector('.bottom-nav').style.display = 'none';
}

// Recording Logic
let mediaRecorder;
let audioChunks = [];
let audioBlob;
let audioUrl;
let isRecording = false;

async function toggleRecording() {
    const btn = document.getElementById('record-btn');
    
    if (!isRecording) {
        // Start Recording
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                audioUrl = URL.createObjectURL(audioBlob);
                showPlaybackUI();
            };
            
            mediaRecorder.start();
            isRecording = true;
            btn.classList.add('active'); // Turn red
        } catch (e) {
            alert('Microphone access denied or not supported. Simulating recording.');
            isRecording = true;
            btn.classList.add('active');
        }
    } else {
        // Stop Recording
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        } else {
            // Simulated stop
            showPlaybackUI();
        }
        isRecording = false;
        btn.classList.remove('active');
    }
}

function showPlaybackUI() {
    document.getElementById('record-btn').style.display = 'none';
    document.getElementById('playback-controls').style.display = 'flex';
    document.getElementById('next-step-btn').style.display = 'block';
}

function resetRecording() {
    audioChunks = [];
    audioUrl = null;
    document.getElementById('playback-controls').style.display = 'none';
    document.getElementById('next-step-btn').style.display = 'none';
    document.getElementById('record-btn').style.display = 'flex';
}

function playRecording() {
    if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play();
    } else {
        alert('Playing simulated recording...');
    }
}

