# Vocabloom (Frontend)

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
- Frontend Repo: https://github.com/aigerimdev/vocabloom-frontend

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