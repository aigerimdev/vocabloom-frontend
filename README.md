# Vocabloom (Frontend)

Mobile-first vocabulary learning app. Search words, save them, tag by topic, and add personal notes. All main pages are protected—users must sign up and log in.

## Goal
Vocabloom is designed for **English learners**, especially those studying English as a second language (ESL).  
It helps users build and organize their vocabulary by:
- **Search powered by an open dictionary API** — when a user types a word, the app retrieves **phonetics**, **audio**, **part of speech**, **meanings**, **definitions**, and **examples**.
- Saving and tagging words for easy review
- Adding personal notes
- Accessing their word collection anytime on mobile, tablet, or desktop

## 🚀 Demo
- Demo video here: [![Vocabloom Demo Video](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)]
- Live app: https://vocabloomapp.netlify.app
- Frontend Repo: https://github.com/aigerimdev/vocabloom-frontend

## Features
- Search words with phonetics, definitions, part of speach, examples and audio
- Save words to a personal collection
- Create a tag
- Tag words by topic/category
- Personal notes for each word (add / edit)
- Protected routes — sign up and log in required
- Mobile-first & responsive (phone, tablet, desktop)

## Tech Stack
- **Frontend:** React, TypeScript, Vite, React Router, Axios
- **Testing:** Jest, React Testing Library
- **Backend:** Django REST Framework

## How It Works
- The frontend talks to the Django API.
- Authentication uses **access and refresh tokens** for secure login and session management.
- After login, users can search, save, tag, and write notes.


## Quick Start

```bash
1. Install dependencies
npm install

2. Start the development server
npm start

Visit: http://localhost:5173

3. Run tests
npm test
```

## User Flow
- User Flow Diagram: https://www.canva.com/design/DAGvhzw1iVE/XuTrizhOCrFZ13kpLiPTog/edit?ui=eyJIIjp7IkEiOnRydWV9fQ