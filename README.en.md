# digita.

Touch-typing practice for Brazilian Portuguese.

**▶ [fernando-trajano.github.io/digita](https://fernando-trajano.github.io/digita/)**

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

**Version 1 is complete.** The whole flow works: choosing your keyboard, the placement
test, the 18 home-row lessons, the result screen with stars, the track map and the home
screen. The other 6 tracks show up as "coming soon" — the goal is a 30-day programme of
roughly 100 five-minute lessons.

### What works today

- Keyboard (ABNT2 or US) and system detection, with your manual choice always overriding
  the automatic guess
- A one-minute placement test that lets confident typists skip ahead
- 18 lessons with an on-screen keyboard and hands, a cursor that locks on mistakes, and
  live metrics
- Stars for speed, with a 90% accuracy floor to complete a lesson
- Progress, day streak and most-missed keys, all kept in your browser
- Export and import your progress as a file
- Portuguese and English, light and dark mode, optional sounds

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
