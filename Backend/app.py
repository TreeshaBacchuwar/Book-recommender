from flask import Flask, request, jsonify
import requests # type: ignore
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow React frontend to access backend

@app.route('/api/books')
def get_books():
    genre = request.args.get('genre', '')
    genre_map = {
    'Sci-Fi': 'Science Fiction',
    'Fiction': 'Fiction',
    'Fantasy': 'Fantasy',
    'Horror': 'Horror',
    'Romance':'Romance'
    }
    api_genre = genre_map.get(genre, genre)
    if not genre:
        return jsonify({'books': []})

    google_api_url = f'https://www.googleapis.com/books/v1/volumes?q=subject:{api_genre}&maxResults=20'
    response = requests.get(google_api_url)
    data = response.json()

    books = []
    for item in data.get('items', []):
        volume_info = item.get('volumeInfo', {})
        title = volume_info.get('title', 'No Title')
        image_links = volume_info.get('imageLinks', {})
        google_cover = image_links.get('thumbnail')  # Google Books cover URL (may be None)

        books.append({
            'title': title,
            'google_cover': google_cover
        })

    return jsonify({'books': books})

if __name__ == '__main__':
    app.run(debug=True)
