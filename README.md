## 📚 Book Recommender App

A simple web application that recommends books by genre using the Google Books API and Open Library. Built with **React** (frontend) and **Flask** (backend), it fetches real-time book data, supports light/dark mode, search, and lets you find and favorite books.

---

### 🚀 Features

* 🔍 Search for books by **genre**
* 🎨 Toggle between **Light/Dark mode**
* 💖 Mark and store **favorite books** (saved locally)
* 🖼️ Automatically fetches book covers from **Google Books** and **Open Library**
* 📖 Live search by book title
* 🎭 Responsive UI with background and style themes

---

### 🛠️ Tech Stack

| Frontend | Backend | APIs                                      |
| -------- | ------- | ----------------------------------------- |
| React.js | Flask   | Google Books API, Open Library Covers API |

---

### 📦 Setup Instructions

#### 🔧 Prerequisites:

* Node.js and npm
* Python 3.x and pip

---

### 🖥️ Frontend Setup (React)

```bash
cd book-recommender-frontend
npm install
npm start
```

---

### 🔌 Backend Setup (Flask)

```bash
cd book-recommender-backend
pip install -r requirements.txt
python app.py
```

By default, the Flask server runs on `http://localhost:5000` and the React frontend on `http://localhost:3000`.

---

### 🌐 APIs Used

* [Google Books API](https://developers.google.com/books/)
* [Open Library Covers API](https://openlibrary.org/dev/docs/api/covers)

---

### 📌 Future Improvements

* Add user login and persistent favorites
* Pagination for large result sets
* Add more genres and sorting options

---

Made with ❤️ by \[Treesha Bacchuwar]


