# 🎬 CineGenie — Movie Recommendation System

CineGenie is a full-stack movie recommendation web application that helps users discover movies, explore trending and upcoming releases, view movie details, and get personalized recommendations based on movie similarities.

## ✨ Features

- 🎥 Browse trending and upcoming movies.
- 🔍 Search and explore movies.
- 🎭 View movie details, cast information, and related movies.
- 🤖 Get movie recommendations based on content similarity.
- 🔐 User authentication with Google Login.
- 📱 Responsive user interface.

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- CSS
- React Router
- Axios
- Material UI

### Backend
- Node.js
- Express.js
- Passport.js
- Google OAuth 2.0
- Express Session

### Recommendation Engine
- Python
- Flask
- Pandas
- NumPy
- Scikit-learn
- NLTK
- TMDB movie dataset

## 📂 Project Structure

```text
CineGenie/
├── client/                  # React frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
│
├── backend/                 # Node.js backend and Python recommendation API
│   ├── routes/              # API routes
│   ├── CustomData/          # Movie data
│   ├── server.js             # Express server
│   ├── passport.js           # Authentication configuration
│   ├── main.py               # Python recommendation engine
│   ├── requirements.txt      # Python dependencies
│   └── package.json          # Node.js dependencies
│
└── README.md
```

## ⚙️ Getting Started


### 1. Clone the Repository

```bash
git clone https://github.com/Siddhiii05/CineGenie.git
cd CineGenie
```

### 2. Set Up the Frontend

```bash
cd client
npm install --legacy-peer-deps
npm start
```

The React application runs at `http://localhost:3000` by default.

### 3. Set Up the Node.js Backend

Open a separate terminal:

```bash
cd backend
npm install
node server.js
```

The Express server runs on the configured port, which defaults to `5000`.

### 4. Set Up the Python Recommendation API

Open another terminal:

```bash
cd backend
```



## 🔑 Environment Variables

Create local `.env` files using the environment variables required by your application.

Configure the appropriate values for:

- Session secret
- Google OAuth client ID and secret
- Google OAuth callback URL
- Frontend URL
- Recommendation API URL

**Never commit `.env` files, credentials, or API secrets to GitHub.**

## 👩‍💻 Author

Siddhi Bobade

