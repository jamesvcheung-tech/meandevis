// Configuration
const TARGET_DATE = new Date(2026, 8, 30); // September 30, 2026
const STORAGE_KEY = 'loveNoteJar';
const ADMIN_PASSWORD = 'Cougnnf8'; // Change this to your own password
const PASSWORD = 'bunny'; // Easter egg password

// State
let notes = {};
let currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);
let isAdminAuth = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
    renderJar();
    updateTodayInfo();
    setupEventListeners();
    renderNotesEditor();
});

// Load notes from localStorage
@@ -72,15 +72,16 @@ function formatDate(date) {
    return date.toLocaleDateString('en-US', options);
}

// Render the jar display with paper notes
// Render the jar display
function renderJar() {
    const preview = document.getElementById('notesPreview');
    preview.innerHTML = '';

    const allDates = getAllDates();
    const filledNotes = Object.keys(notes).length;

    // Show notes in jar (max 10 visible)
    for (let i = 0; i < Math.min(filledNotes, 10); i++) {
    // Show notes in jar
    for (let i = 0; i < Math.min(filledNotes, 30); i++) {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note-preview';
        noteDiv.style.setProperty('--rotation', Math.random() > 0.5 ? '-15deg' : '15deg');
@@ -112,7 +113,13 @@ function openNoteModal() {
    const todayNote = notes[todayStr];

    if (!todayNote) {
        alert('No note set for today yet. 💕');
        // Easter egg: ask for password
        const password = prompt('This jar is locked with a password. What is it? 🔐');
        if (password === PASSWORD) {
            alert('Aw, you know me so well! 💕 But there\'s no note for today yet. Customize messages to add one!');
        } else {
            alert('This isn\'t for you bunny 💕');
        }
        return;
    }

@@ -126,90 +133,10 @@ function closeNoteModal() {
    document.getElementById('noteModal').style.display = 'none';
}

// Open gallery modal
function openGalleryModal() {
    const container = document.getElementById('galleryContainer');
    const allDates = getAllDates();
    container.innerHTML = '';
    
    // Get all past notes (notes from before today)
    const pastNotes = [];
    allDates.forEach((date) => {
        const dateStr = getDateString(date);
        if (date < currentDate && notes[dateStr]) {
            pastNotes.push({
                date: date,
                dateStr: dateStr,
                note: notes[dateStr]
            });
        }
    });
    
    if (pastNotes.length === 0) {
        container.innerHTML = '<div class="gallery-empty"><p>No past notes yet...</p><p>Once you open notes from previous days, they\'ll appear here! 💕</p></div>';
    } else {
        // Display in reverse order (most recent first)
        pastNotes.reverse().forEach((item) => {
            const card = document.createElement('div');
            card.className = 'gallery-note-card';
            card.innerHTML = `
                <div class="gallery-note-date">${formatDate(item.date)}</div>
                <div class="gallery-note-text">${item.note}</div>
            `;
            container.appendChild(card);
        });
    }
    
    document.getElementById('galleryModal').style.display = 'block';
}

// Close gallery modal
function closeGalleryModal() {
    document.getElementById('galleryModal').style.display = 'none';
}

// Open password modal
function openPasswordModal() {
    document.getElementById('passwordModal').style.display = 'block';
    document.getElementById('passwordInput').focus();
    document.getElementById('passwordError').textContent = '';
}

// Close password modal
function closePasswordModal() {
    document.getElementById('passwordModal').style.display = 'none';
    document.getElementById('passwordInput').value = '';
    document.getElementById('passwordError').textContent = '';
}

// Check password
function checkPassword() {
    const input = document.getElementById('passwordInput');
    if (input.value === ADMIN_PASSWORD) {
        isAdminAuth = true;
        closePasswordModal();
        openEditor();
    } else {
        document.getElementById('passwordError').textContent = 'Incorrect password';
        input.value = '';
        input.focus();
    }
}

// Open editor
function openEditor() {
// Toggle editor visibility
function toggleEditor() {
    const editor = document.getElementById('editorSection');
    editor.classList.remove('hidden');
    renderNotesEditor();
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
}

// Close editor
function closeEditor() {
    const editor = document.getElementById('editorSection');
    editor.classList.add('hidden');
    document.body.style.overflow = 'auto';
    editor.classList.toggle('hidden');
}

// Render notes editor
@@ -256,13 +183,13 @@ function generateAllDates() {
        'I love you more than words can say! 💕',
        'You make every day brighter. ✨',
        'Thank you for being my person. 💑',
        'I\'m so grateful for your smile. 😊',
        'You\'re my favorite person. 💫',
        'I'm so grateful for your smile. 😊',
        'You're my favorite person. 💫',
        'Every moment with you is special. ⏰',
        'You inspire me every day. 🌟',
        'I love your laugh so much. 😄',
        'You\'re my greatest adventure. 🗺️',
        'Forever isn\'t long enough with you. 💞'
        'You're my greatest adventure. 🗺️',
        'Forever isn't long enough with you. 💞'
    ];

    allDates.forEach((date, index) => {
@@ -281,7 +208,7 @@ function generateAllDates() {

// Setup event listeners
function setupEventListeners() {
    // Note modal
    // Modal
    document.getElementById('openNoteBtn').addEventListener('click', openNoteModal);
    document.querySelector('.close').addEventListener('click', closeNoteModal);
    window.addEventListener('click', (e) => {
@@ -291,35 +218,17 @@ function setupEventListeners() {
        }
    });

    // Gallery modal
    document.getElementById('galleryBtn').addEventListener('click', openGalleryModal);
    window.addEventListener('click', (e) => {
        const galleryModal = document.getElementById('galleryModal');
        if (e.target === galleryModal) {
            closeGalleryModal();
        }
    });
    
    // Password modal
    document.getElementById('adminBtn').addEventListener('click', openPasswordModal);
    document.addEventListener('keypress', (e) => {
        if (document.getElementById('passwordModal').style.display === 'block' && e.key === 'Enter') {
            checkPassword();
        }
    });
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('passwordModal');
        if (e.target === modal) {
            closePasswordModal();
        }
    });
    // Editor toggle
    document.getElementById('toggleEditorBtn').addEventListener('click', toggleEditor);
    document.getElementById('closeEditorBtn').addEventListener('click', toggleEditor);

    // Editor
    document.getElementById('closeEditorBtn').addEventListener('click', closeEditor);
    // Save button
    document.getElementById('saveCustBtn').addEventListener('click', () => {
        saveNotes();
        renderJar();
        updateTodayInfo();
    });
    
    // Generate dates button
    document.getElementById('generateDatesBtn').addEventListener('click', generateAllDates);
}
