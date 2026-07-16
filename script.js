// Configuration
const TARGET_DATE = new Date(2026, 8, 30); // September 30, 2026
const STORAGE_KEY = 'loveNoteJar';

// State
let notes = {};
let currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
    renderJar();
    updateTodayInfo();
    setupEventListeners();
    renderNotesEditor();
});

// Load notes from localStorage
function loadNotes() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        notes = JSON.parse(stored);
    } else {
        notes = {};
    }
}

// Save notes to localStorage
function saveNotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    showSaveStatus('Changes saved! 💾');
}

// Show save status
function showSaveStatus(message) {
    const status = document.getElementById('saveStatus');
    status.textContent = message;
    setTimeout(() => {
        status.textContent = '';
    }, 3000);
}

// Get date string (YYYY-MM-DD)
function getDateString(date) {
    return date.toISOString().split('T')[0];
}

// Parse date string
function parseDate(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
}

// Get all dates from today to September 30
function getAllDates() {
    const dates = [];
    let current = new Date(currentDate);
    
    while (current <= TARGET_DATE) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    
    return dates;
}

// Format date for display
function formatDate(date) {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Render the jar display
function renderJar() {
    const preview = document.getElementById('notesPreview');
    preview.innerHTML = '';
    
    const allDates = getAllDates();
    const filledNotes = Object.keys(notes).length;
    
    // Show notes in jar
    for (let i = 0; i < Math.min(filledNotes, 30); i++) {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note-preview';
        noteDiv.style.setProperty('--rotation', Math.random() > 0.5 ? '-15deg' : '15deg');
        preview.appendChild(noteDiv);
    }
    
    if (filledNotes === 0) {
        preview.innerHTML = '<p style="color: #ccc; font-size: 0.9em;">Start customizing to fill the jar! 💕</p>';
    }
}

// Update today's info
function updateTodayInfo() {
    const daysRemaining = Math.ceil((TARGET_DATE - currentDate) / (1000 * 60 * 60 * 24));
    const todayStr = getDateString(currentDate);
    const hasNote = notes[todayStr];
    
    const infoText = document.getElementById('todayInfo');
    infoText.innerHTML = `
        <strong>${formatDate(currentDate)}</strong><br>
        ${daysRemaining} days until September 30th 💫
        ${hasNote ? '<br>✨ Today\'s note is waiting!' : ''}
    `;
}

// Open note modal
function openNoteModal() {
    const todayStr = getDateString(currentDate);
    const todayNote = notes[todayStr];
    
    if (!todayNote) {
        alert('No note set for today yet. Customize messages to add one! 💕');
        return;
    }
    
    document.getElementById('todayNote').textContent = todayNote;
    document.getElementById('noteDate').textContent = formatDate(currentDate);
    document.getElementById('noteModal').style.display = 'block';
}

// Close note modal
function closeNoteModal() {
    document.getElementById('noteModal').style.display = 'none';
}

// Toggle editor visibility
function toggleEditor() {
    const editor = document.getElementById('editorSection');
    editor.classList.toggle('hidden');
}

// Render notes editor
function renderNotesEditor() {
    const allDates = getAllDates();
    const container = document.getElementById('notesEditor');
    container.innerHTML = '';
    
    allDates.forEach((date) => {
        const dateStr = getDateString(date);
        const noteValue = notes[dateStr] || '';
        
        const group = document.createElement('div');
        group.className = 'note-input-group';
        group.innerHTML = `
            <label>
                <span class="date">${formatDate(date)}</span>
            </label>
            <textarea 
                data-date="${dateStr}" 
                placeholder="Write a love note for this day..."
            >${noteValue}</textarea>
        `;
        
        container.appendChild(group);
        
        // Add listener for auto-save on change
        const textarea = group.querySelector('textarea');
        textarea.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            if (value) {
                notes[dateStr] = value;
            } else {
                delete notes[dateStr];
            }
        });
    });
}

// Generate all dates button
function generateAllDates() {
    const allDates = getAllDates();
    const exampleMessages = [
        'I love you more than words can say! 💕',
        'You make every day brighter. ✨',
        'Thank you for being my person. 💑',
        'I'm so grateful for your smile. 😊',
        'You're my favorite person. 💫',
        'Every moment with you is special. ⏰',
        'You inspire me every day. 🌟',
        'I love your laugh so much. 😄',
        'You're my greatest adventure. 🗺️',
        'Forever isn't long enough with you. 💞'
    ];
    
    allDates.forEach((date, index) => {
        const dateStr = getDateString(date);
        if (!notes[dateStr]) {
            const message = exampleMessages[index % exampleMessages.length];
            notes[dateStr] = `${message}\n\nDay ${index + 1}`;
        }
    });
    
    saveNotes();
    renderNotesEditor();
    renderJar();
    showSaveStatus('All dates generated! 🎉');
}

// Setup event listeners
function setupEventListeners() {
    // Modal
    document.getElementById('openNoteBtn').addEventListener('click', openNoteModal);
    document.querySelector('.close').addEventListener('click', closeNoteModal);
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('noteModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Editor toggle
    document.getElementById('toggleEditorBtn').addEventListener('click', toggleEditor);
    document.getElementById('closeEditorBtn').addEventListener('click', toggleEditor);
    
    // Save button
    document.getElementById('saveCustBtn').addEventListener('click', () => {
        saveNotes();
        renderJar();
        updateTodayInfo();
    });
    
    // Generate dates button
    document.getElementById('generateDatesBtn').addEventListener('click', generateAllDates);
}
