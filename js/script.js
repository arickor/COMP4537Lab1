class Note {
    constructor(content = "", index) {
        this.content = content;
        this.index = index;
        this.createNoteUI();
    }

    // Create the note UI (textarea and remove button)
    createNoteUI() {
        this.noteDiv = document.createElement('div');
        this.noteDiv.classList.add('note', 'mb-2');

        // Create text area
        this.textArea = document.createElement('textarea');
        this.textArea.value = this.content;
        this.textArea.classList.add('form-control', 'mb-2');
        this.noteDiv.appendChild(this.textArea);

        // Create remove button
        this.removeBtn = document.createElement('button');
        this.removeBtn.textContent = "Remove";
        this.removeBtn.classList.add('btn', 'btn-danger', 'mb-2');
        this.noteDiv.appendChild(this.removeBtn);

        // Append note to container
        notesContainer.appendChild(this.noteDiv);

        // Add event listeners for text input and remove button
        this.textArea.addEventListener('input', () => {
            this.updateNote();
        });

        this.removeBtn.addEventListener('click', () => {
            this.removeNote();
        });
    }

    // Update the content of the note
    updateNote() {
        notes[this.index] = this.textArea.value;
        this.saveToLocalStorage();
    }

    // Remove note from the UI and LocalStorage
    removeNote() {
        this.noteDiv.remove();
        notes.splice(this.index, 1);
        this.saveToLocalStorage();
        // Refresh indexes for remaining notes
        Note.refreshIndexes();
    }

    // Save notes to LocalStorage
    saveToLocalStorage() {
        localStorage.setItem('notes', JSON.stringify(notes));
        if (lastSaved) {
            lastSaved.textContent = `Last Saved: ${new Date().toLocaleTimeString()}`;
        }
    }

    // Static method to refresh indexes after a note is removed
    static refreshIndexes() {
        Array.from(notesContainer.children).forEach((noteDiv, index) => {
            const textArea = noteDiv.querySelector('textarea');
            const note = new Note(textArea.value, index);
            notes[index] = textArea.value;
        });
    }

    // Static method to load notes from LocalStorage
    static loadNotesFromStorage() {
        const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];
        storedNotes.forEach((noteContent, index) => {
            new Note(noteContent, index);
            notes.push(noteContent);
        });
    }
}

// Global variables
let notes = [];
const notesContainer = document.getElementById('notesContainer');
const lastSaved = document.getElementById('lastSaved');
const lastRetrieved = document.getElementById('lastRetrieved');

// Function to display notes in reader.html
function displayNotes() {
    notes = JSON.parse(localStorage.getItem('notes')) || [];
    notesContainer.innerHTML = ""; // Clear the container

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
    Note.loadNotesFromStorage();

    // Add event listener for the "Add Note" button
    document.getElementById('addNoteBtn').addEventListener('click', () => {
        const newNote = new Note("", notes.length);
        notes.push("");
        newNote.saveToLocalStorage();
    });

    // Auto-save every 2 seconds
    setInterval(() => {
        if (lastSaved) {
            lastSaved.textContent = `Last Saved: ${new Date().toLocaleTimeString()}`;
        }
    }, 2000);

} else if (lastRetrieved) {
    // This means we are on reader.html
    // Load and display notes on reader page
    displayNotes();

    // Refresh the notes every 2 seconds to stay updated with changes from writer.html
    setInterval(displayNotes, 2000);
}
