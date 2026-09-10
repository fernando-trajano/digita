# digita.

Touch-typing practice for Brazilian Portuguese.

🇧🇷 [Leia em português](README.md)

---

## What it is

A site for learning to type without looking at the keyboard, built for people who write in
Portuguese. Most typing tutors are designed around English and skip exactly what trips
Brazilians up: the **Ç**, the **accents**, and the differences between the **ABNT2** and
**US** keyboard layouts.

`digita.` covers that with:

- **Real Portuguese words and sentences**, restricted to the keys already taught.
- **A dedicated track for accents and Ç**, with the right method for each layout.
- **Help for US keyboards** — common on imported MacBooks: how to type `é`, `ã` and `ç`
  on macOS (`Option + E`, `Option + C`) and on Windows (US International layout).
- **An on-screen keyboard and hands**, each finger in its own color, showing which finger
  to use.

## Project status

Work in progress. **Version 1** ships the full flow with the *home row* track (18 lessons);
the other 6 tracks show up as "coming soon". The goal is a 30-day program of roughly
100 five-minute lessons.

## Tech

Plain HTML, CSS and JavaScript — **no frameworks, no dependencies, no build step**.
Progress lives in your browser's `localStorage`: there is no login and nothing is sent
anywhere.

## Running it locally

The project uses ES modules, so browsers refuse to open `index.html` by double-clicking
it. The folder has to be served. Using the Python that ships with macOS:

```bash
python3 servidor.py
```

Then open **http://localhost:8010**.

`servidor.py` is a 40-line dependency-free local server that tells the browser not to
cache anything, so a code change shows up as soon as the page reloads.

## Layout

```
css/     styles — tema.css holds every color as a CSS variable
js/      logic — screens, keyboard, typing engine, metrics
dados/   content — lessons, keyboard layouts and translations (PT/EN)
assets/  icons
```

Content and logic are kept apart on purpose: new lessons can be added by editing
`dados/licoes/` alone, without touching the code.

## License

[MIT](LICENSE) — © 2026 Fernando Rodrigo Trajano da Silva.
