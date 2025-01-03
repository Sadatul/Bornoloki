# Banglish-to-Bangla Conversion Backend

Welcome to the **Banglish-to-Bangla** backend—a server-side application that converts Banglish (a mixture of Bengali words written in the Latin alphabet) to Bangla script and provides advanced features like user authentication, document management, continuous learning, and more. This project aims to serve teachers like **Rina** and her students, empowering them to translate, store, and share Bangla content seamlessly.

## Table of Contents

1. [Overview](#overview)  
2. [Core Features Implemented](#core-features-implemented)  
3. [Tech Stack & Requirements](#tech-stack--requirements)  
4. [Installation & Setup](#installation--setup)  
5. [Project Structure](#project-structure)  
6. [Environment Variables](#environment-variables)  
7. [Running the App](#running-the-app)  
8. [API Usage](#api-usage)  
   - [Authentication](#authentication)  
   - [Banglish-to-Bangla Translation](#banglish-to-bangla-translation)  
   - [Documents & Search](#documents--search)  
   - [Continuous Learning API](#continuous-learning-api)  
9. [Future Enhancements](#future-enhancements)  
10. [License](#license)

---

## Overview

In many Bengali-speaking regions, people often type in **Banglish** for convenience, but need accurate **Bangla** text for formal writing and sharing. This backend:

- **Authenticates** users securely.  
- **Translates** Banglish to Bangla with high accuracy.  
- **Manages** user-uploaded documents (including optional public/private settings).  
- **Provides** a continuous learning API so the translation model can improve over time based on user submissions.  
- **Offers** search functionality for documents in both Banglish and Bangla.

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

> **Note:** Some advanced features (like PDF export, real-time collaboration, or voice interaction) might be partially implemented or planned for future development.

---

## Tech Stack & Requirements

- **Python 3.9+**  
- **FastAPI** for building the RESTful API.  
- **SQLModel** or **SQLAlchemy** for database handling.  
- **PostgreSQL** (or any SQL database) as the primary DB.  
- **Redis** (optional) for caching.  
- **OpenAI / Custom Model** for translation (optional, depending on your chosen approach).
- **Docker** (optional) for containerization.

**Python Libraries** (partial list):
- `fastapi`, `uvicorn`  
- `sqlmodel` or `sqlalchemy`  
- `python-dotenv`  
- `requests`, `redis`  
- `transformers`, `datasets` (if using local ML model)  
- `PyPDF2` or `pdfkit` (if implementing PDF-related tasks)

---

## Installation & Setup

1. **Clone** the repository:
   ```bash
   git clone https://github.com/your-org/banglish-bangla-backend.git
   cd banglish-bangla-backend
   ```

2. **Install** dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up** your environment variables in [`.env`](#environment-variables).

4. **Initialize** the database:
   ```bash
   # (Only if needed)
   python -c "from app.database import init_db; init_db()"
   ```

5. **Run** the server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The API will be available at: **http://127.0.0.1:8000**

---

## Project Structure

A simplified view of the file organization:

```
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
DB_URL=postgresql://user:pass@localhost:5432/db_name
REDIS_HOST=localhost
REDIS_PORT=6379
OPENAI_API_KEY=sk-xxxxxxxx
# Add other relevant variables
```

**Note:** You can create a `.env.example` to share with your team.

---

## Running the App

1. **Without Docker**:  
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. **With Docker** (if provided):
   ```bash
   docker-compose up --build
   ```
   This will spin up containers for your FastAPI app, database, Redis, etc., as configured.

---

## API Usage

### Base URL
All endpoints are prefixed by your server domain/port (e.g., **http://127.0.0.1:8000**).

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

- **`GET /user/search?name=...`**  
  Search for a user by name. (Requires authorization token.)

- **`GET /user/protected`**  
  A protected route example—only accessible if the request includes a valid bearer token.

- **`GET /user/user-only`**  
  Example admin-only route requiring valid token + admin role.

**Security**: Each secured endpoint expects a `Bearer <token>` in the `Authorization` header.

---

### Banglish-to-Bangla Translation

- **`POST /v1/banglish-to-bangla`**  
  Accepts a JSON body like:
  ```json
  {
    "banglish_text": "ami tomay valobashi",
    "temperature": 0.2
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

