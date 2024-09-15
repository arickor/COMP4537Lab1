// Global variables
let notes = JSON.parse(localStorage.getItem('notes')) || [];
const notesContainer = document.getElementById('notesContainer');
const lastSaved = document.getElementById('lastSaved');
const lastRetrieved = document.getElementById('lastRetrieved');

// Function to save notes to localStorage and update the 'last saved' time
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
    if (lastSaved) {
        lastSaved.textContent = `Last Saved: ${new Date().toLocaleTimeString()}`;
    }
}

// Function to add a note UI in writer.html
function addNoteUI(content = "") {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note');

    const textArea = document.createElement('textarea');
    textArea.value = content;
    textArea.classList.add('form-control', 'mb-2');
    noteDiv.appendChild(textArea);

    const removeBtn = document.createElement('button');
    removeBtn.textContent = "Remove";
    removeBtn.classList.add('btn', 'btn-danger', 'mb-2');
    noteDiv.appendChild(removeBtn);

    // Remove note on button click
    removeBtn.addEventListener('click', () => {
        noteDiv.remove();
        notes = notes.filter(note => note !== content);
        saveNotes();
    });

    // Update notes array when user types in the textarea
    textArea.addEventListener('input', () => {
        const index = Array.from(notesContainer.children).indexOf(noteDiv);
        notes[index] = textArea.value;
    });

    notesContainer.appendChild(noteDiv);
}

// Function to load and display notes in reader.html
function displayNotes() {
    // Reload notes from localStorage every time this function is called
    notes = JSON.parse(localStorage.getItem('notes')) || [];
    notesContainer.innerHTML = ""; // Clear the container

    // Check if there are any notes stored
    if (notes.length === 0) {
        const noNotesMessage = document.createElement('p');
        noNotesMessage.textContent = "No notes found.";
        notesContainer.appendChild(noNotesMessage);
    } else {
        notes.forEach(note => {
            const noteDiv = document.createElement('div');
            noteDiv.classList.add('note', 'mb-2');
            const noteText = document.createElement('p');
            noteText.textContent = note || "Empty Note"; // Handle empty note
            noteDiv.appendChild(noteText);
            notesContainer.appendChild(noteDiv);
        });
    }

    if (lastRetrieved) {
        lastRetrieved.textContent = `Last Retrieved: ${new Date().toLocaleTimeString()}`;
    }
}

// Initialize functionality based on the current page
if (document.getElementById('addNoteBtn')) {
    // This means we are on writer.html
    // Load existing notes into writer
    notes.forEach(note => addNoteUI(note));

    // Add event listener for the "Add Note" button
    document.getElementById('addNoteBtn').addEventListener('click', () => {
        notes.push("");
        addNoteUI();
        saveNotes();
    });

    // Auto-save every 2 seconds
    setInterval(saveNotes, 2000);
} else if (lastRetrieved) {
    // This means we are on reader.html
    // Load and display notes on reader page
    displayNotes();

    // Refresh the notes every 2 seconds to stay updated with changes from writer.html
    setInterval(displayNotes, 2000);
}
