**English** | [한국어](README.ko.md)

# 🐱 Mood Cat

> A mini app that shows a cat meme when you type how you feel — like "happy" or "hungry".

Nothing special — the whole point is to learn and build something fun.

## Demo

**👉 [Open the site](https://mjlee0914.github.io/mood-cat/)**

> The server (BE) runs on Render's free plan, so it falls asleep when nobody uses it 😴 The first search may take a moment to wake it up.

```
Input:   "I totally bombed my exam :("
Mood:    sad
Caption: "It's okay, I dropped my churu too."
Image:   (a sad cat GIF)
```

## Why I Built This

The LangChain Runnable / LCEL lectures were mostly theory, and the ideas didn't quite click for me.
So I decided to learn by building a small project myself.
Also, cats are the best, and cat memes are hilarious!

### Concepts I'm Practicing

- Composing chains with the `A | B | C` pipe (LCEL)
- `@chain`, `invoke()`, `batch()`
- Keeping earlier values with `RunnablePassthrough.assign()`
- Handling failures with `.with_retry()` and `.with_fallbacks()`
- `.stream()`

## How It Works

```
Input text
  → [Mood classification]  free text → one fixed mood label (LLM)
  → [Caption]              a one-liner in a cat's voice (LLM)
  → [GIF search]           search GIPHY for "{mood} cat" (API)
  → { text, mood, caption, image_url }
```

The LLM only classifies the mood and writes the caption. Images come from an API instead of being generated, so results are stable and cheap.

### A Cat Shows Up Even When Things Fail

| Step                    | On failure                                                                                                                                            |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| LLM mood classification | up to 3 attempts → keyword classifier (Step 1)                                                                                                        |
| LLM caption             | up to 3 attempts → "서버가 낮잠중이다냥" ("the server is napping, meow")                                                                              |
| GIPHY                   | up to 3 attempts → [teabagging cat](https://giphy.com/gifs/cat-salam-salamualaikum-alaikum-WykUqckDqi95YIqtFZ) (also when the search returns nothing) |

I broke the OpenAI and GIPHY keys on purpose and checked that all four cases (normal / OpenAI down / GIPHY down / both down) still return a result.

## Tech Stack

| Part | Tech |
|---|---|
| AI chain | Python, LangChain (`langchain-core`, `langchain-openai`), OpenAI API |
| GIF search | GIPHY API |
| Server (BE) | FastAPI, Uvicorn |
| Web page (FE) | HTML / CSS / JavaScript (no framework), GSAP |
| Sound | Web Audio API (BGM, "meow", and "boom" synthesized in code, no audio files) |
| Deploy | Render (BE), GitHub Pages (FE) |

### What the web page (FE) does
- A deliberately janky design inspired by 2007 homepages and Korean PowerPoint school slides
- English / Korean switch (auto-selected from the browser language)
- Intentionally annoying UI: a button that runs away, cookie dialogs, a nagging timer, a fake button
- A rainbow trail that follows the mouse, 💥 on click, and a typewriter effect for captions

## Getting Started

**Requirements:** Python 3.11+ (developed on 3.13), an OpenAI API key, a GIPHY API key

```bash
# 1. Clone the repo
git clone https://github.com/mjlee0914/mood-cat.git
cd mood-cat

# 2. Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up API keys
cp .env.example .env             # then put your real keys in .env
```

| Key              | Where to get it                                         |
| ---------------- | ------------------------------------------------------- |
| `OPENAI_API_KEY` | [OpenAI Platform](https://platform.openai.com/api-keys) |
| `GIPHY_API_KEY`  | [GIPHY Developers](https://developers.giphy.com/)       |

> `.env` is listed in `.gitignore`, so it never gets committed.

### Run as a web app

You need **two terminals**: one for the server (BE) and one for the web page (FE).

```bash
# Terminal 1: server (BE)
uvicorn api:app --reload
# → try the API at http://127.0.0.1:8000/docs

# Terminal 2: web page (FE)
python -m http.server 5500 --directory frontend
# → open http://localhost:5500 in your browser
```

> Opened from `localhost`, the page talks to the local server (port 8000). Opened from GitHub Pages, it talks to the Render server.

### Run in the terminal only

```bash
python main.py
```

It prints a dictionary like this. The caption and GIF may change on every run.

```python
{
    "text": "I'm so hungry",
    "mood": "hungry",
    "caption": "I'm so hungry, feed me now, meow!",
    "image_url": "https://media0.giphy.com/media/.../giphy.gif",
}
```

> To try another sentence, change the text at the bottom of `main.py` (e.g. `{"text": "I'm so hungry"}`).
> Captions follow the input language: Korean input gets a "-냥" ending, English input gets a "meow".

## Deploy

| Part | Where | How |
|---|---|---|
| Server (BE) | [Render](https://render.com) free plan | Configured automatically from `render.yaml` in the repo (Blueprint) |
| Web page (FE) | GitHub Pages | Every push to `main` runs `.github/workflows/pages.yml`, which deploys only the `frontend/` folder |

- API keys are never committed. They only live in Render's environment variables.
- The server only accepts requests from `https://mjlee0914.github.io` (CORS).

## Progress

- [x] Step 0. Environment setup
- [x] Step 1. Keyword mood classifier (no LLM)
- [x] Step 2. LLM mood classifier
- [x] Step 3. Combine mood + caption + GIF
- [x] Step 4. Retry / fallback
- [x] Web page (FE) + API server (BE)
- [x] Deploy (Render + GitHub Pages)
- [ ] Step 5. (Optional) Caption streaming
- [ ] Step 6. (Optional) Blog demo
- [ ] Step 7. Retrospective

## What I Learned

<!-- TODO: fill in during Step 7 -->

## References

- A personal study project based on the LangChain Runnable lecture (Nov 20) from the KANT AX bootcamp.
- [Project plan](https://mjlee0914.github.io/coding/mood-cat/en/)
- [LangChain docs](https://python.langchain.com/)

## Credits

- GIFs: [GIPHY](https://giphy.com/) (Powered by GIPHY)
- The cat memes on the page (hello cat, kung fu cat, laptop cat, etc.) belong to their original creators.
- The BGM and sound effects are synthesized with Web Audio.
