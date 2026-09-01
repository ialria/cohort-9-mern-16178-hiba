# cohort-9-mern-16178-hiba
Cohort 9 — MERN (NodeJS+ReactJS) assignment for Hiba Saud Anwari

# Leaflet Notes App

A full-stack notes management application built with the **MERN stack**, providing secure authentication, note creation and management, rich-text editing, search, sorting, pinning, trash management, import/export functionality, and password-strength validation.

The project is divided into a React-based frontend and a Node.js/Express backend, with Prisma ORM and MySQL used for database management.

##  Project Overview

**Leaflet Notes App** is a full-stack web application designed to help users create, organize, search, edit, and manage their personal notes.

The application provides an authenticated environment where users can:

* Create notes
* Edit existing notes
* Delete notes
* Pin important notes
* Move notes to trash
* Restore deleted notes
* Permanently delete notes
* Search notes
* Sort notes
* Import notes from JSON and TXT files
* Export notes
* Edit notes using a rich-text editor
* Register and log in securely
* Reset passwords
* Check password strength during registration

The project also includes automated testing, logging, code-quality analysis, and accessibility considerations.

#  Features

##  Authentication

The application provides user authentication functionality including:

* User registration
* User login
* User logout
* Password validation
* Password-strength checking
* Forgot-password functionality
* Password reset functionality
* Authentication-protected application routes
* Cookie-based authentication
* Form validation and error handling

### Password Strength

The signup form uses the **zxcvbn** library to evaluate password strength.

Password strength is checked asynchronously and the UI provides feedback to the user while creating an account.

## 📝 Notes Management

Users can manage their notes through the dashboard.

### Create Notes

Users can create new notes with:

* Title
* Rich-text content

### Edit Notes

Existing notes can be opened and edited.

The application tracks note changes and provides save-state feedback.

### Delete Notes

Notes can be moved to the trash instead of being immediately permanently deleted.

### Restore Notes

Notes in the trash can be restored.

### Delete Forever

Users can permanently remove notes from the trash.

## 📌 Pin Notes

Important notes can be pinned.

Pinned notes are displayed according to the application's sorting and organization rules.

The application uses `isPinned` to represent the pinned state of a note.


## 🔎 Search

Users can search through their notes.

The application provides note previews while searching so users can quickly identify the note they are looking for.

##  Sorting

Notes can be sorted using different options:

* Date
* Title
* Pinned

Sorting also supports:

* Ascending order
* Descending order

The sorting logic also takes pinned notes into consideration when appropriate.

##  Trash Management

The application provides a dedicated trash workflow.

Users can:

1. Move a note to trash
2. View deleted notes
3. Restore a note
4. Permanently delete a note

This prevents accidental permanent deletion of notes.

##  Import Notes

The application supports importing notes from:

* `.json`
* `.txt`

Multiple files can be imported at once.

### JSON Import

JSON files are validated before being imported.

The expected note structure includes properties such as:

```json
[
  {
    "title": "My Note",
    "content": "This is my note."
  }
]
```

Invalid JSON note structures are rejected with an appropriate error message.

### TXT Import

TXT files are converted into notes automatically.

The filename is used as the note title and the file contents become the note content.


## Export Notes

Users can export notes from the application.

The export functionality supports exporting individual notes as well as multiple notes where applicable.


##  Rich Text Editing

Notes support rich-text editing using a rich-text editor.

This allows users to format their note content rather than being restricted to plain text.


## 🎨 User Interface

The frontend uses:

* React
* Tailwind CSS
* Responsive layouts
* Reusable components
* Toast notifications
* Icons
* Accessible form controls

The application also provides visual feedback for:

* Validation errors
* Successful registration
* Saving states
* Loading states
* Import errors
* API errors


# 🛠️ Technology Stack

## Frontend

* **React.js**
* **Vite**
* **JavaScript**
* **Tailwind CSS**
* **React Router**
* **ReactQuill**
* **Jest**
* **React Testing Library**
* **zxcvbn**
* **canvas-confetti**

## Backend

* **Node.js**
* **Express.js**
* **Prisma ORM**
* **MySQL**
* **Pino Logger**

## Testing & Code Quality

* **Jest**
* **React Testing Library**
* **SonarQube**
* **SonarQube Scanner**

## Development Tools

* Git
* GitHub
* VS Code
* Prisma
* npm

# Application State Management

The application uses React Context to manage shared application state.

### NotesContext

The `NotesContext` manages note-related operations such as:

* Creating notes
* Updating notes
* Getting notes
* Restoring notes
* Moving notes to trash
* Permanently deleting notes
* Pinning/unpinning notes

### SidebarContext

Manages sidebar-related UI state.

### ModalContext

Manages modal-related UI state.

#  Authentication Flow

The authentication flow is handled between the frontend and backend.

A simplified flow is:

```text
User
 │
 ▼
Frontend Authentication Form
 │
 ▼
API Request
 │
 ▼
Express Backend
 │
 ▼
Authentication Controller
 │
 ▼
Database
 │
 ▼
Authentication Response
 │
 ▼
Frontend
```

Authentication tokens are handled using cookies.

The backend authentication middleware reads the authentication cookie to verify authenticated requests.

# Database

The application uses:

**MySQL**

with:

**Prisma ORM**

The database contains the application's persistent data, including user and note information.

The Prisma schema is located at:

```text
backend/prisma/schema.prisma
```

# API Communication

Frontend API requests are centralized through the application's API utility.

Example:

```javascript
apiFetch("/api/auth/signup", {
  method: "POST",
  body: JSON.stringify({
    username,
    email,
    password,
  }),
});
```

This provides a consistent way for the frontend to communicate with the backend.

---

# Error Handling

The application handles errors at multiple levels.

### Frontend

Frontend validation handles errors such as:

* Empty fields
* Invalid email addresses
* Short passwords
* Long passwords
* Weak passwords
* Password mismatch
* Invalid imported files
* Unsupported file types
* Failed API requests

### Backend

The backend includes error-handling middleware and structured logging.


# Form Validation

The signup form validates:

### Username

The username cannot be empty.

### Email

The email is checked for a valid structure.

### Password

The password must:

* Not be empty
* Contain at least 8 characters
* Contain no more than 64 characters
* Meet the required password-strength score

### Confirm Password

The confirmation password must match the original password.

#  Password Security

Password strength is evaluated using:

**zxcvbn**

The application does not simply check password length. It also evaluates password strength and rejects passwords that are considered too weak.


# Logging

The backend uses **Pino** for application logging.

Logging is used to help monitor backend operations and diagnose errors.

Errors are logged with useful context while user-facing messages remain appropriate for the frontend.


# Testing

The project includes automated tests using:

* Jest
* React Testing Library

Tests cover important application behavior including:

* Authentication forms
* Signup validation
* Forgot-password behavior
* Notes context
* Note sorting
* Note actions
* Import functionality
* File validation
* Error handling
* UI interactions

Example test command:

```bash
npm test
```

#  NoteActionBar Testing

The note action bar tests cover:

* Rendering Sort and Import controls
* Rendering icons
* Opening the sort menu
* Closing the sort menu
* Selecting Date sorting
* Selecting Title sorting
* Selecting Pinned sorting
* Selecting ascending order
* Selecting descending order
* Active sorting indicators
* Hidden file input
* JSON imports
* TXT imports
* Multiple TXT imports
* Invalid JSON rejection
* Unsupported file rejection
* Import failures
* Empty file selection

# SonarQube

SonarQube is used for static code analysis and code-quality monitoring.

The project is configured using:

```text
sonar-project.properties
```

SonarQube is used to identify:

* Bugs
* Code smells
* Maintainability issues
* Reliability issues
* Cognitive complexity
* Other code-quality problems

The project can be analyzed using SonarScanner.

Example:

```powershell
sonar-scanner.bat
```

The analysis results can then be viewed in the SonarQube project dashboard.


#  Code Quality

During development, SonarQube analysis was used to identify and improve issues such as:

* Cognitive complexity
* Maintainability problems
* Code smells
* Reliability issues
* Accessibility-related concerns

Functions were refactored where necessary to keep the code maintainable and easier to understand.


#  Clone the Repository

```bash
git clone <repository-url>
```

Navigate into the project:

```bash
cd cohort-9-mern-16178-hiba
```

# 📱 Main Application Flow

A typical user journey is:

```text
Open Application
      ↓
Create Account / Login
      ↓
Dashboard
      ↓
Create Note
      ↓
Edit Note
      ↓
Save Note
      ↓
Search / Sort / Pin
      ↓
Move to Trash
      ↓
Restore or Delete Forever
```

---

# Note Lifecycle

A note can follow this lifecycle:

```text
Create
  ↓
Active Note
  ↓
Edit
  ↓
Pin / Unpin
  ↓
Move to Trash
  ↓
Restore
  ↓
Active Note
```

Or:

```text
Active Note
    ↓
Move to Trash
    ↓
Delete Forever
    ↓
Permanently Removed
```

---

# Import Workflow

```text
Select Import
      ↓
Choose JSON/TXT Files
      ↓
Validate File
      ↓
Read File Content
      ↓
Convert Into Note Data
      ↓
Import Notes
      ↓
Display Notes
```

Unsupported files and invalid note structures are rejected with appropriate error messages.


#  Quality Assurance

The project uses multiple layers of quality assurance:

### Automated Testing

Jest and React Testing Library are used to verify application behavior.

### Static Analysis

SonarQube is used to identify code-quality issues.

### Manual Testing

Important user flows are also manually verified through the application UI.


#  Accessibility

Accessibility considerations have been included throughout the application.

Examples include:

* Labels associated with form fields
* `aria-invalid` attributes
* `aria-describedby` for validation messages
* Accessible button names
* Keyboard-friendly controls
* Semantic HTML elements

# 👩 Development

This project was developed as a full-stack web application with a focus on:

* Clean component structure
* Reusable React components
* Secure authentication
* Database-driven note management
* Error handling
* Automated testing
* Code quality
* Maintainability
* Accessibility

---

#  Summary

**Leaflet Notes App** is a complete full-stack notes management system that combines a modern React frontend with a Node.js/Express backend and MySQL database.

The application provides a complete note-management workflow along with authentication, password-strength validation, rich-text editing, search, sorting, pinning, trash management, import/export functionality, automated testing, logging, and SonarQube-based code-quality analysis.


##  Project Status

**Status:** Completed / Under active development

The project includes the core authentication, notes management, dashboard, state management, testing, error handling, and code-quality workflows required for a full-stack notes application.
