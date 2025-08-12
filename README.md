# Vocabloom🌱 

Mobile-first vocabulary learning app. Search words, save them, tag by topic, and add personal notes. All main pages are protected—users must sign up and log in.

## Goal
Vocabloom is designed for **English learners**, especially those studying English as a second language (ESL).  
It helps users build and organize their vocabulary with tools that go beyond a basic dictionary.

## Highlights
- **Smart Word Search** — Get phonetics, audio, part of speech, meanings, definitions, and examples (dictionary API)
- **Personal Vocabulary Collection** — Save and tag words for easy review
- **Custom Word** — Add your own words with personalized meanings, phonetics, and tags  
- **Personal Notes & Examples** — Keep your own notes and example sentences for each word  
- **Amazon Polly Audio** — Listen the examples in natural-sounding speech  
- **AI Examples** — Generate examples with Gemini AI by difficulty and context  
- **Mobile-First Design** — Works great on phone, tablet, or desktop  


## 🚀 Demo
- Demo video here: [![Vocabloom Demo Video](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)]
- Live app: https://vocabloomapp.netlify.app
- Backend URL: https://vocabloom-backend.onrender.com/api/schema/swagger-ui/#/Audio/audio_create
- Frontend Repo: https://github.com/aigerimdev/vocabloom-frontend
- Frontend Repo: https://github.com/linakl19/vocabloom_backend

## **MVP Features**
- Search words with phonetics, definitions, part of speech, examples, and audio  
- Save words to a personal collection and delete them  
- Create and delete tags  
- Tag words by topic/category  
- Protected routes — signup and login required  
- Mobile-first & responsive design (phone, tablet, desktop)  

## **Additional Features**
- **Personal Notes** — Add and edit your own notes for any word  
- **Personal Word Creation** — Create custom word entries with your own meanings, explanations, phonetics, and tags  
- **My Word List & Tag Browsing** — View saved or created words in your personal list or filter them by tags  
- **User Examples** — Add your own example sentences for any searched or created word  
- **Amazon Polly Integration** — Hear your examples read aloud in natural-sounding speech  
- **AI-Generated Examples** — Use Gemini AI to create example sentences based on difficulty level and context  

## Tech Stack
- **Frontend:** React, TypeScript, Vite, React Router, Axios, Dictionary API
- **Fronted Testing:** Jest, React Testing Library

## How It Works
- The frontend talks to the Django API.
- Authentication uses **access and refresh tokens** for secure login and session management.
- After login, users can search, save, tag, and write notes.
## How It Works
- The React frontend talks to a Django REST API.
- Authentication uses **access** and **refresh** tokens for secure login and session renewal.
- After signing in, users can:
  - **Search** words (phonetics, meanings, definitions, examples, audio).
  - **Save** words to *My Word List* with or without a tag.
  - **Add/Edit Personal Notes** on any saved word.
  - **Generate Example Sentences** with Gemini AI (choose difficulty and context).
  - **Listen to Audio** for words and examples via Amazon Polly (natural TTS).
  - **Add Personal Words** — create your own entries (word, phonetics, meanings, examples, optional tag) using **PersonalWordForm**. These behave like saved words: you can tag them, add notes, generate/listen to examples, and delete them if needed.
- Destructive actions (e.g., deleting a word or tag) use a confirmation modal, and any errors are shown inline with an error banner.
- Destructive actions (e.g., deleting a word or tag) require confirmation, and any errors are shown inline.


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
- Component Relationship Diagram: https://www.canva.com/design/DAGt2jtDDAE/DH_6OfWdCx1uRhStY0j9iA/edit?ui=eyJIIjp7IkEiOnRydWV9fQ
- User Flow Diagram: https://www.canva.com/design/DAGvhzw1iVE/XuTrizhOCrFZ13kpLiPTog/edit?ui=eyJIIjp7IkEiOnRydWV9fQ
## Team
**Ada Developers Academy C23**
- **Aigerim Kalygulova**
  - GitHub: https://github.com/aigerimdev
- **Lina Martines** 
  - GitHub: https://github.com/linakl19