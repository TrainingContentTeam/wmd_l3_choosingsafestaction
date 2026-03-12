# Choosing the Safest Action

This project is a self-contained story-based knowledge check designed for a Rise web object or similar embedded course block.

The interaction presents four workplace situations and asks the learner to choose the safest action. It uses:

- a single static `index.html` entry point
- local placeholder scene artwork in `assets/`
- responsive CSS in `styles.css`
- interaction logic, feedback, and UI audio in `script.js`
- `window.parent.postMessage({ type: "complete" }, "*")` on completion

## Files

- `index.html`: interaction markup
- `styles.css`: visual design, layout, animation, and responsive behavior
- `script.js`: scenario data, state, feedback, audio, and completion handling
- `assets/scene-1.svg` to `assets/scene-4.svg`: placeholder images for each situation
- `assets/README.md`: note about replacing placeholders

## Scenario Focus

The learner moves through these situations:

1. Leaving the building immediately by the instructed route
2. Avoiding a suspicious container and reporting it
3. Waiting for official guidance after possible exposure
4. Relying on official communications instead of rumors

The design is intentionally lightweight and dependency-free so it can be packaged directly into course content.
