# 📘 Vocabloom Component Documentation

---
![Search Word Feature Diagram](./assets/Search%20Word%20Feature%20Component%20Relationship.jpg)
## 🔍 `SearchBar.tsx`

## 🔍 SearchBar.tsx

**Purpose:**  
Lets users type a word and trigger a search.

**Props:**
- `value: string` – current text in the input
- `onChange: (value: string)` – called when the user types
- `onSearch: () => void` – called when the search button is clicked

**How it works:**
- User types a word
- On button click, `onSearch` is triggered

---

## 📄 WordResultCard.tsx

**Purpose:**  
Displays the result when a word is found.

**Props:**
- `data: WordData` – word info (text, phonetic, audio, meanings)
- `onSave: () => void` – triggered when “Save Word” is clicked

**How it works:**
- Shows word, phonetic, audio (if available), and meanings
- Includes a “Save Word” button

---

## ❗ ErrorMessage (future component)

**Purpose:**  
Shows a message when a word isn’t found.

**Example message:**  
`Sorry! Word not found.`

> *Note:* Can be refactored into a reusable component later.

---

## 🏠 HomePage.tsx

**Purpose:**  
Main screen where users search for words.

**Includes:**
- `SearchBar` at the top
- `WordResultCard` if a word is found
- `ErrorMessage` if not
- Uses `axios` to get word data from the API

---

## 🧱 Component Tree

```txt
App
├── Navbar
└── Routes
    ├── path="/" → HomePage
    │   ├── SearchBar
    │   └── WordResultCard (or ErrorMessage)
    └── path="/logout" → Logout
