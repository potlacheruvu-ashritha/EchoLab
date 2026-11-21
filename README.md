# EchoLab

**A multilingual creator studio that turns one long recording into platform-native clips — and refuses to publish the ones it can't back up.**

Built for creators working in code-switched languages (Telugu + English, Hinglish, and similar), where most repurposing tools either ignore the language mix or flatten it into generic English captions.

---

## The problem

A creator records a 40-minute conversation in mixed Telugu and English. Today they either:

- hand-cut clips for hours, or
- run it through a transcription tool that mangles the code-switching and hands back 30 undifferentiated "highlights".

EchoLab does three things those tools don't: it **shows its evidence** for every clip it picks, it **adapts to that creator's voice** instead of a house style, and it **stops claims it can't verify** from reaching a scheduled post.

## How it works

```
Recording ──▶ Gemini video understanding ──▶ Clip candidates
                                             ├─ Multimodal proof (audio + visual)
                                             ├─ Skipped segments (and why)
                                             ├─ Claim Firewall
                                             ├─ Glossary (code-switch terms)
                                             └─ Platform variants (Reel / LinkedIn / WhatsApp)
                                                        │
                                                        ▼
                                              Content calendar gate
```

The backend uploads the file to the Gemini Files API, polls until the file is `ACTIVE`, then asks for a single structured JSON result. It tries models in order (`gemini-3.5-flash` → `3.7-flash` → `3.8-flash`), repairs markdown-fenced or chatty JSON, and always deletes the uploaded file when it's done.

## What's in the workspace

| Section | What it does |
|---|---|
| **Overview** | Active episode, pipeline stats, top clip candidates, what's publishing next |
| **Video Studio** | Clip-by-clip review with multimodal proof cards, skipped-segment tab, glossary tab |
| **Brand DNA** | Style rules inferred from the recording, each toggleable — the memory layer |
| **Platform Content** | Per-platform copy, and the **Claim Firewall** with per-claim verdicts |
| **Content Calendar** | Publish slots; a held claim blocks approval |
| **Analytics** | Reach and retention views for published clips |

### Multimodal proof cards

Every clip carries the evidence for why it was chosen, not just a score:

- **Audio proof** — emphasis peaks, pitch contour, delivery cadence
- **Visual proof** — framing, eye contact, gesture, transitions
- **Brand fit** — how it matches the creator's established tone
- **Risk** — verified from source, or held for review
- **Language mix** — e.g. `English 70% + Telugu 30%`

### Claim Firewall

Any superlative, comparative price, guarantee, or health claim is extracted and given one of three verdicts: **Verified from source**, **Creator-approved**, or **Held for review**. A held claim cannot be approved into the calendar until the creator resolves it. This is the part of the product that makes repurposing safe to ship, and it's the demo's centrepiece.

### Glossary and language mix

Code-switched terms are captured with their translation, usage notes, and category (Slang / Business / Place / Cultural) so captions stay accurate rather than transliterated.

## Quickstart

Requires **Node 20+**, **Python 3.11+**, and a Gemini API key.

### 1. Backend

```bash
cd backend
python -m venv .venv
# Windows (Git Bash): .venv/Scripts/python.exe   |   macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env          # then add your GEMINI_API_KEY
uvicorn main:app --reload --port 8000
```

Health check: `curl http://localhost:8000/` → `{"status":"EchoLab backend running","models":[...]}`

Interactive API docs: <http://localhost:8000/docs>

Get a key at <https://aistudio.google.com/apikey>.

### 2. Frontend

```bash
npm install        # or: pnpm install
npm run dev
```

Open <http://localhost:3000>. The UI is preloaded with a worked example ("Chai with the Founder") so it's fully explorable before you upload anything.

> **Without a Gemini key** the backend still works: `/api/analyze` returns a shaped demo payload with `demo_mode: true`. The UI does not branch on this — it's there so the response is honest about its origin.

## API

### `POST /api/analyze`

`multipart/form-data` with a `file` field containing a video.

Returns a single object:

```json
{
  "demo_mode": false,
  "episode_title": "...",
  "detected_language": "Telugu + English (Code-switched)",
  "clips": [{
    "title": "...", "start": "02:14", "end": "02:52",
    "excerpt": "...", "reason": "...", "hook_type": "...", "score": 96,
    "audio_proof": "...", "visual_proof": "...", "brand_fit": "...",
    "risk": "...", "language_mix": "...",
    "reel_caption": "...", "linkedin_copy": "...", "whatsapp_status": "..."
  }],
  "skipped_segments": [{ "start": "...", "end": "...", "reason": "...", "clarity": 0.54, "flag": "Low clarity" }],
  "claims": [{ "text": "...", "status": "Held for review", "timestamp": "...", "category": "...", "evidence": "...", "clip_id": 4 }],
  "glossary": [{ "term": "...", "translation": "...", "notes": "...", "category": "Slang" }],
  "brand_rules": [{ "text": "...", "source": "...", "on": true, "fresh": true }],
  "transcript": [{ "start": "00:18", "text": "..." }]
}
```

## Demo script (2 minutes)

1. **Overview** — the episode is processed; point at the held claim in the stats row.
2. **Video Studio** — open a clip, show the audio and visual proof lines. That's the "why this clip" story.
3. **Skipped segments tab** — shows what was thrown away and the clarity score that caused it.
4. **Platform Content → Claim Firewall** — the pricing claim is held. Approve or reject it.
5. **Content Calendar** — the gated slot. This is the loop closing: AI proposes, evidence justifies, human authorises.

## Stack

- **Frontend** — Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS v4, Base UI, lucide-react
- **Backend** — FastAPI, Uvicorn, `google-genai` (Gemini 3.x Flash video understanding)
- **No database** — workspace state is in the client for this build; the backend is stateless

## Known limitations

- The frontend calls the API at `http://localhost:8000` (`components/studio.tsx`). Point it at a hosted backend and this needs to move to an env var.
- Workspace state (claim decisions, calendar slots) is in-memory only and resets on reload.
- Video analysis is real but slow: Gemini processing can take minutes on a long file. Use a short clip for a live demo.
- CORS is wide open (`*`), which is fine for local development and not for a public deployment.

## Repository layout

```
app/                Next.js App Router entry (single workspace route)
components/
  workspace.tsx     state wiring across sections
  studio.tsx        Video Studio, proof cards, upload flow
  channels.tsx      platform content, Claim Firewall, analytics
  overview.tsx      workspace overview
lib/episode.ts      types and the seeded episode
backend/main.py     FastAPI app, Gemini pipeline, demo fallback
```
