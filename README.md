# PrepPilot

PrepPilot is a MERN interview-prep chatbot that generates role-specific interview questions, evaluates answers with AI, and stores interview sessions in MongoDB for later review.

## Stack

- React + Vite frontend
- Express + Node.js API
- MongoDB with Mongoose
- OpenAI or Gemini for AI generation and evaluation
- Tailwind CSS for styling

## Features

- Landing page with product overview and role support
- Dashboard with session stats and recent sessions
- New interview session creation
- Role and level selection
- Resume or job description input
- Resume upload support for PDF, TXT, and MD files
- AI-generated question sets
- One-question-at-a-time interview flow
- AI evaluation with structured feedback
- Session history and delete action
- Loading, empty, and error states

## Project Structure

- `client/` React app
- `server/` Express API
- `.env.example` shared environment template
- `package.json` root workspace scripts

## Environment Variables

Copy `.env.example` to `.env` and fill in your values.

```bash
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/preppilot
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
```

## Setup

1. Install dependencies from the repository root:

```bash
npm install
```

2. Start MongoDB locally or use a hosted MongoDB URI.

3. Create your `.env` file from `.env.example`.

4. Start both client and server:

```bash
npm run dev
```

The React app runs on `http://localhost:5173` and the API runs on `http://localhost:5000`.

## API Endpoints

- `GET /api/health` - health check
- `GET /api/sessions` - list sessions
- `POST /api/sessions` - create a new session
- `GET /api/sessions/:sessionId` - fetch a session
- `DELETE /api/sessions/:sessionId` - delete a session
- `POST /api/sessions/:sessionId/generate` - generate interview questions
- `POST /api/sessions/:sessionId/answer` - evaluate an answer and save feedback

## Resume Upload Flow

- For resume-based sessions, users can upload a PDF, TXT, or MD file.
- The server extracts text from the uploaded file and stores the extracted content in MongoDB.
- Users can also paste resume text manually if they do not want to upload a file.
- Job description sessions remain paste-based to keep the MVP simple.

## AI Response Contracts

Question generation must return:

```json
{
  "questions": [
    {
      "question": "...",
      "difficulty": "easy"
    }
  ]
}
```

Answer evaluation must return:

```json
{
  "score": 85,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "betterAnswer": "...",
  "tips": ["..."]
}
```

## Future Improvements

- Add authentication with Clerk or NextAuth
- Support file upload for actual resume parsing
- Add answer history replay and scoring trends
- Add timed interview mode
- Add richer analytics and role comparison
- Add test coverage for API and UI flows

## Notes

- The MVP keeps all AI calls server-side.
- Session history is stored in MongoDB.
- The frontend expects strict JSON from the model, so response validation is important.
