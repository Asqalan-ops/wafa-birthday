# Birthday website for Wafa
Static site (HTML + CSS + JS). No build step, no dependencies.

## Run locally
    cd wafa-birthday
    python3 -m http.server 8000     # or: npx serve
Open http://localhost:8000 (opening index.html directly also works).

## Deploy to Vercel
    npm i -g vercel && vercel        # run inside this folder, accept defaults
or push the folder to GitHub and import it at vercel.com/new (Framework: "Other", no build command).

## Customize
- All text lives in index.html (letter, cards, timeline, wishes, signature "Kraven").
- Music + behavior flags: top of script.js. Colors/fonts: variables at top of styles.css.
