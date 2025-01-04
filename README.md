# Banglish-to-Bangla Conversion Backend

![Bornolikhi Cover](assets/cover.jpg)

Welcome to the **Bornoloki** application that converts Banglish (a mixture of Bengali words written in the Latin alphabet) to Bangla script and provides advanced features like user authentication, document management, continuous learning, and more. This project aims to serve users to translate, store, and share Bangla content seamlessly.

## Table of Contents

1. [Overview](#overview)  
2. [Core Features Implemented](#core-features-implemented)  
3. [Layered Architecture](#layered-architecture)  
4. [Tech Stack & Requirements](#tech-stack--requirements)  
5. [Installation & Setup](#installation--setup)  
6. [Project Structure](#project-structure)  
7. [Environment Variables](#environment-variables)  
8. [Running the App](#running-the-app)  
9. [API Usage](#api-usage)  
   - [Authentication](#authentication)  
   - [Banglish-to-Bangla Translation](#banglish-to-bangla-translation)  
   - [Documents & Search](#documents--search)  
   - [Continuous Learning API](#continuous-learning-api)  
10. [Future Enhancements](#future-enhancements)  
11. [License](#license)

---

## Overview

In many Bengali-speaking regions, people often type in **Banglish** for convenience, but need accurate **Bangla** text for formal writing and sharing. Our app provides a seamless way for users to type banglish stories and translate them to English. Users can also share there stories with others by making it public. Our advanced chatbot can respond to users based on their stories. All of these is backed by supabased based JWT authentication system

This project addresses the hackathon scenario where Rina, a teacher, needs an easy way to convert her stories into Bangla for her students, while students want a chatbot and advanced features to learn proper Bangla expressions.

---

## Core Features Implemented

1. **User Authentication**  
   - **Login** and **Registration** with secure token-based endpoints.  
   - **Protected Routes** that require valid tokens.

2. **Banglish → Bangla Conversion**  
   - **Robust translation** endpoint to convert Banglish text to Bangla.  
   - Optionally uses advanced AI models (OpenAI, custom fine-tuned model, etc.).

3. **Documents & Search**  
   - **Create** and **store** user documents (with original & converted text).  
   - **Search** user documents via queries in either Banglish or Bangla.  
   - Public/Private flags for document visibility.

4. **Continuous Learning**  
   - Users can **contribute** new translation pairs (Banglish text + corrected Bangla).  
   - **Admins** can verify those pairs before they become part of the training data.

5. **Basic Admin Controls**  
   - Admin routes for verification and user management.

6. **Share stories**
   - Users can make there stories public
   - Other users can searh there profiles and view these public stories

> **Note:** Some advanced features (like PDF export, real-time collaboration, or voice interaction) might be partially implemented or planned for future development.

---

### Layered Architecture
Our application follows a clean, layered architecture pattern that separates concerns and promotes maintainability:

![Layered Architecture](assets/layered_architecture.png)

---

## Tech Stack & Requirements

- **Python 3.9+**  
- **FastAPI** for building the RESTful API.  
- **SQLModel** for database handling.  
- **PostgreSQL** (or any SQL database) as the primary DB.  
- **Redis** (optional) for caching.  
- **OpenAI / Custom Model** for translation (optional, depending on your chosen approach).
- **Docker** for containerization.

**Python Libraries** (partial list):
- `fastapi`, `uvicorn`  
- `sqlmodel` or `sqlalchemy`  
- `python-dotenv`  
- `requests`, `redis`  
- `transformers`, `datasets` (if using local ML model)  
- `PyPDF2` or `pdfkit` (if implementing PDF-related tasks)

---

## Installation & Setup

### Backend Setup:
1. **Clone** the repository:
   ```bash
   git clone https://github.com/Sadatul/Bitfest.git
   cd Bitfest/backend
   ```
### Run local
2. **Install** dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. **Set up** your environment variables in [`.env`](#environment-variables) based on .evn.example.

4. **Set up** You can setup or own database and qdrant vector database. Or you can use our docker compose to run everything seamlessly. To run the app locally please comment out the backed service in docker compose.

5. **Run** the server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at: **http://127.0.0.1:8000**

### Run with docker
1. **Clone** the repository:
   ```bash
   git clone https://github.com/Sadatul/Bitfest.git
   cd Bitfest/backend
   ```
2. **Set up** your environment variables in [`.env`](#environment-variables) based on .evn.example.
3. Run the following command
   ```bash
      docker compose up --build -d
   ```
   The API will be available at: **http://localhost:8080**
---
### Frontend Setup:
6. ```bash
   cd ../frontend [Assuming you are in backend folder]
   npm i
   npm run dev
   ```
   The frontend will be available at: **http://localhost:5173**
## Project Structure

A simplified view of the file organization:

```
   README.md
   frontend/
   ├── components.json
   ├── .env
   ├── eslint.config.js
   ├── .gitignore
   ├── index.html
   ├── package.json
   ├── package-lock.json
   ├── postcss.config.js
   ├── public
   │   └── vite.svg
   ├── README.md
   ├── src
   │   ├── App.css
   │   ├── App.jsx
   │   ├── assets
   │   │   └── react.svg
   │   ├── components
   │   │   ├── Animation
   │   │   │   ├── AnimateWave.jsx
   │   │   │   ├── FloatingLetter.jsx
   │   │   │   └── FloatingLetters.jsx
   │   │   ├── AppLayout.jsx
   │   │   ├── Auth
   │   │   │   ├── AuthLayout.jsx
   │   │   │   ├── LoginForm.jsx
   │   │   │   └── PrivateRoute.jsx
   │   │   ├── ChatInput.jsx
   │   │   ├── ChatMessage.jsx
   │   │   ├── DocumentList.jsx
   │   │   ├── Profile
   │   │   ├── SearchResults.jsx
   │   │   └── ui
   │   │       ├── avatar.jsx
   │   │       ├── button.jsx
   │   │       ├── card.jsx
   │   │       ├── input.jsx
   │   │       └── tabs.jsx
   │   ├── contexts
   │   │   ├── AuthContext.jsx
   │   │   ├── ChatContext.jsx
   │   │   ├── DocumentContext.jsx
   │   │   ├── SearchContext.jsx
   │   │   └── ThemeContext.jsx
   │   ├── index.css
   │   ├── lib
   │   │   ├── openai.js
   │   │   ├── supabase.js
   │   │   ├── utils.js
   │   │   └── utils.ts
   │   ├── main.jsx
   │   ├── pages
   │   │   ├── Chatbot.jsx
   │   │   ├── ProfilePage.jsx
   │   │   └── TextEditor.jsx
   │   ├── styles
   │   │   └── editor.css
   │   └── utils
   │       └── gemini.js
   ├── tailwind.config.js
   ├── tsconfig.json
   └── vite.config.js

   backend/
   ├── app/
   │   ├── main.py                   # FastAPI entry point
   │   ├── config.py                 # Load environment variables (Settings class)
   │   ├── database.py               # Database session & initialization
   │   ├── models/                   # SQLModel or SQLAlchemy models
   │   ├── routers/                  # All API endpoints grouped by feature
   │   ├── schemas/                  # Pydantic models for requests/responses
   │   ├── utils/                    # Helper functions (post-processing, caching, etc.)
   │   └── redis.py                  # Redis client setup
   ├── requirements.txt
   ├── Dockerfile
   ├── compose.yaml
   └── .env
```

---

## Environment Variables

Create a file named `.env` (excluded from Git) with content like:

```
DB_URL=postgresql://byteforger:byteforgers@postgres_db:5432/bitfest
REDIS_HOST=redis-stack
REDIS_PORT=6379
SUPABASE_JWT_PUBLIC_KEY=********
SUPABASE_URL=******
SUPABASE_SERVICE_ROLE_KEY=***************
OPENAI_API_KEY=**************
QDRANT_URL=*****************
QDRANT_API_KEY=********
```
**Note**:
   This .env is given for docker compose run setup. If you choose to run without docker a few changes needs to be made...
   
   * change postgres_db host of DB_URL to localhost
   * redis-stack to localhost
   * go to backend/app/utils/embeddings.py -> Change QdrantClient url to localhost (Extremely sorry for this inconvinience)


---

## API Usage

### Base URL
All endpoints are prefixed by your server domain/port (e.g., **http://127.0.0.1:8000**). You can visit ```/docs``` endpoint to get swagger ui to connect see all api endpoints.

Below is a **brief summary** of key routes based on your OpenAPI JSON.

---

### Authentication

- **`POST /user/register`**  
  Create a new user account. You must provide the role (`"user"` or `"admin"`).
  
  ```json
  {
    "role": "user"
  }
  ```

- **`GET /user/search?query=...`**  
  Search for a user by name. (Requires authorization token.)
- **`GET /user/{user_id}`**
  Get non-sensitive info for a user
  ```

**Security**: Each secured endpoint expects a `Bearer <token>` in the `Authorization` header.

---

### Banglish-to-Bangla Translation

- **`POST /v1/banglish-to-bangla`**  
  Accepts a JSON body like:
  ```json
  {
    "banglish_text": "ami tomay valobashi",
    "temperature": 0.2 [Optional]
  }
  ```
  Returns the Bangla version:
  ```json
  {
    "bangla_text": "আমি তোমায় ভালোবাসি"
  }
  ```
- **Deprecated Endpoint**: `POST /v1/banglish-to-bangla-deprecated`  
  An older version kept for backward compatibility.

---

### Documents & Search
1. **`POST /document/`**  
   Create a new document. Example request:
   ```json
   {
     "title": "My Story",
     "original_text": "ami tomay valobashi",
     "formatting": null,
     "is_public": false
   }
   ```
   Returns the newly created document with ID, user ID, etc.

2. **`GET /document/search?query=...&is-bangla=false&limit=5`**  
   - Search documents by `query`.
   - `is-bangla=false` means you’re searching the **Banglish** field; `true` means searching the **Bangla**-converted field.
   - `limit=5` sets the max results.

3. **`GET /document/{document_id}`**  
   - Retrieve a single document by ID.
4. **`GET /document/user/{user_id}/public`**  
   - Retrieve a public documents for user with user_id
3. **`GET /document/my/all`** [Authentication required] 
   - Retrieve all documents(prviate and public) for owner
---

### Continuous Learning API

This feature allows **users** to contribute corrected Banglish→Bangla pairs, and **admins** to verify them.

| Endpoint                                 | HTTP Verb | Description                                                                    |
|------------------------------------------|-----------|--------------------------------------------------------------------------------|
| **`/training-data/`**                   | **POST**  | **Users** submit new pairs (banglish_text, proposed_bangla_text).             |
| **`/training-data/unverified`**         | **GET**   | **Admins** list all unverified contributions.                                 |
| **`/training-data/verify/{id}`**        | **PATCH** | **Admins** verify or reject a contribution (`is_verified`).                   |
| **`/training-data/export-verified`**    | **GET**   | Export all verified pairs (useful for retraining/fine-tuning your model).     |

> **Example**:  
> **POST** `/training-data/`  
> ```json
> {
>   "banglish_text": "ami tomay valobashi",
>   "proposed_bangla_text": "আমি তোমায় ভালোবাসি"
> }
> ```  
> If verified by an admin, this data can become part of your training set for improved accuracy over time.

---

## Future Enhancements

- **Voice Interaction**: Enable real-time speech-to-text for Bangla or Banglish.  
- **Smart Editor**: Provide auto-corrections for common Banglish typos.  
- **Chatbot Integration**: Expand on the PDF-based Q&A to handle more complex queries.  
- **Analytics Dashboard**: Track usage metrics (number of translations, user stats, etc.).  
- **PDF Export**: Generate shareable PDFs with custom Bangla fonts and AI-generated captions.  
- **Real-Time Collaboration**: Let multiple users edit the same document concurrently.

---

## License

This project is intended for hackathon or educational use. Licensing can be updated based on your team’s preference—often [MIT License](https://choosealicense.com/licenses/mit/) or [Apache 2.0](https://choosealicense.com/licenses/apache-2.0/) is suitable.

