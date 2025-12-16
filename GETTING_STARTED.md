# GardenGuru — Getting Started (Local Development)

## Prerequisites
- Node.js 18+ (tested with v22)
- MongoDB running locally on `mongodb://127.0.0.1:27017`

## 1) Backend (API)
```bash
cd server
npm install
# Ensure you have server/.env
#
# MONGO_URI=mongodb://127.0.0.1:27017/gardenguru
# JWT_SECRET=<your_secret>
# PORT=5001
npm run dev
```
- API runs at: http://localhost:5001
- On first run you should see: "Server running on port 5001" and "MongoDB Connected"

## 2) Frontend (Client)
```bash
cd client
npm install
npm run dev
```
- App runs at: http://localhost:5173
- The client is configured to call the API at `http://localhost:5001` in files like `client/src/context/AuthContext.jsx` and other pages.

## 3) Seed sample data (optional)
```bash
cd server
node seed.js
```
- Adds example plants to the database so the Plant Library is populated.

## 4) Quick Auth Test (optional)
```bash
cd server
node test_auth.js
```
- Registers a test user, then logs in to verify JWT auth is working.

## Troubleshooting
- Run commands from the correct folders (root has no dev script):
  - Use `npm run dev` inside `server/` and inside `client/`.
- Free a busy port (macOS):
```bash
lsof -ti :5173 | xargs kill -9   # free Vite port
lsof -ti :5001 | xargs kill -9   # free API port
```
- Ensure MongoDB is running:
```bash
lsof -nP -iTCP:27017 -sTCP:LISTEN
```

## Screenshots
Place screenshots in `docs/images/` or update the paths below to match your locations.

- Home Page
  
  ![Home](docs/images/home.png)

- Plant Library (empty)
  
  ![Plant Library - Empty](docs/images/library-empty.png)

- Dashboard
  
  ![Dashboard](docs/images/dashboard.png)

- Plant Library (with data)
  
  ![Plant Library - Filled](docs/images/library-filled.png)

Note: A sample asset also exists at `client/public/uploaded_image_1765475834720.png` if you want to reference it directly in docs.