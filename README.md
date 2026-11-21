**English** | [한국어](README.ko.md)

# 🐱 Mood Cat

> A mini app that shows a cat meme when you type how you feel — like "happy" or "hungry".

Nothing special — the whole point is to learn and build something fun.

## Demo

<!-- TODO: GIF or screenshot of a run -->

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

| Step                    | On failure                                         |
| ----------------------- | -------------------------------------------------- |
| LLM mood classification | retry 3 times → keyword classifier                 |
| LLM caption             | retry 3 times → "...meow? (the server is napping)" |
| GIPHY                   | retry 3 times → CATAAS image                       |

## Tech Stack

- Python, LangChain (`langchain-core`, `langchain-openai`)
- OpenAI API
- GIPHY API, CATAAS

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

<!-- TODO: add the run command after Step 1 -->

## Progress

- [x] Step 0. Environment setup
- [x] Step 1. Keyword mood classifier (no LLM)
- [ ] Step 2. LLM mood classifier
- [ ] Step 3. Combine mood + caption + GIF
- [ ] Step 4. Retry / fallback
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
- Cat photos: [CATAAS](https://cataas.com/)
