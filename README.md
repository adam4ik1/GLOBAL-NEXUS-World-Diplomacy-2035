# GLOBAL NEXUS — World Diplomacy 2035

An interactive 3D diplomatic district for an International Relations & Diplomacy course project. Built with Three.js, HTML, CSS and JavaScript.

## Features
- Explore a 3D diplomatic city with orbit rotation, zoom and pan.
- Click 9 interactive institutions to open their information profiles.
- Daylight / night mode and reset-camera controls.
- Diplomatic network routes, animated data particles, illuminated buildings and a responsive dashboard.
- Educational simulation: all indicators and activity metrics are illustrative, not live geopolitical data.

## Institutions
1. United Nations Forum — multilateral diplomacy
2. Embassy Quarter — bilateral relations and consular work
3. Peace & Security Council — conflict prevention and mediation
4. Global Trade Exchange — trade and investment diplomacy
5. Climate Action Centre — climate negotiations and global governance
6. International Court — international law and dispute settlement
7. Cultural Exchange Pavilion — public and cultural diplomacy
8. Global Media Centre — strategic communication and public diplomacy
9. Development Partnership Bank — development finance and cooperation

## Run locally
Because this project uses JavaScript ES modules, run it through a local web server rather than opening `index.html` directly.

### Option A: Python
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000

### Option B: VS Code
Install the Live Server extension, right-click `index.html`, and choose **Open with Live Server**.

## Deploy to Render (Static Site)
1. Upload `index.html`, `styles.css`, `main.js`, and `README.md` to the root of a GitHub repository.
2. In Render choose **New → Static Site** and connect the repository.
3. Use these settings:
   - Branch: `main`
   - Root Directory: leave blank (if files are in repository root)
   - Build Command: leave blank
   - Publish Directory: `.`
4. Click **Create Static Site**. Render will provide a public `onrender.com` URL.

## Technical notes
- Three.js and OrbitControls are loaded from jsDelivr CDN using an import map. Internet access is required for the 3D engine and Google Fonts.
- Render is configured as a static site; no server-side runtime or API key is required.
- The scene is generated procedurally in `main.js`; no separate 3D assets are needed.
- If the scene is blank, open browser DevTools → Console and check whether the CDN is blocked by the network. Try another network or reload after the CDN is available.

## Submission to Padlet
**Project:** GLOBAL NEXUS — World Diplomacy 2035  
**Field:** International Relations & Diplomacy  
**Description:** An interactive 3D diplomatic district demonstrating multilateral institutions, bilateral relations, peace and security, international trade, climate diplomacy, international law, cultural exchange and development cooperation. Users can orbit and zoom around the city and select each institution to explore its diplomatic role and global impact.

Add your name, a screenshot of the deployed city, and your public Render URL before submitting.
