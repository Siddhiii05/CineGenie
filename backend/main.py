import ast
import os
from pathlib import Path

import pandas as pd
from flask import Flask, jsonify
from nltk.stem.porter import PorterStemmer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# File paths
BASE_DIR = Path(__file__).resolve().parent

# Initialize the stemmer
ps = PorterStemmer()


def convert(obj):
    """Extract names from genres or keywords."""
    items = []
    for item in ast.literal_eval(obj):
        items.append(item["name"])
    return items


def convert3(obj):
    """Extract the first three cast members."""
    items = []
    for item in ast.literal_eval(obj)[:3]:
        items.append(item["name"])
    return items


def fetch_director(obj):
    """Extract the director's name."""
    items = []
    for item in ast.literal_eval(obj):
        if item["job"] == "Director":
            items.append(item["name"])
            break
    return items


def stem(text):
    """Apply stemming to the movie tags."""
    words = []
    for word in text.split():
        words.append(ps.stem(word))
    return " ".join(words)


# Load movie and credits datasets
movies_path = BASE_DIR / "tmdb_5000_movies.csv"
credits_path = BASE_DIR / "tmdb_5000_credits.csv"

movies = pd.read_csv(movies_path)
credits = pd.read_csv(credits_path)

# Merge datasets using the movie ID
movies = movies.merge(credits, on="movie_id")

# Standardize the title column
movies.rename(columns={"title_x": "title"}, inplace=True)
movies.drop("title_y", axis=1, inplace=True)

# Select relevant columns
movies = movies[
    [
        "movie_id",
        "title",
        "overview",
        "genres",
        "keywords",
        "cast",
        "crew",
    ]
]

# Remove rows with missing values
movies.dropna(inplace=True)

# Extract useful information
movies["genres"] = movies["genres"].apply(convert)
movies["keywords"] = movies["keywords"].apply(convert)
movies["cast"] = movies["cast"].apply(convert3)
movies["crew"] = movies["crew"].apply(fetch_director)

# Convert overview into a list of words
movies["overview"] = movies["overview"].apply(lambda x: x.split())

# Remove spaces from names so related terms are treated consistently
movies["genres"] = movies["genres"].apply(
    lambda items: [item.replace(" ", "") for item in items]
)

movies["cast"] = movies["cast"].apply(
    lambda items: [item.replace(" ", "") for item in items]
)

movies["overview"] = movies["overview"].apply(
    lambda items: [item.replace(" ", "") for item in items]
)

movies["crew"] = movies["crew"].apply(
    lambda items: [item.replace(" ", "") for item in items]
)

movies["keywords"] = movies["keywords"].apply(
    lambda items: [item.replace(" ", "") for item in items]
)

# Combine movie information into tags
movies["tags"] = (
    movies["overview"]
    + movies["genres"]
    + movies["keywords"]
    + movies["cast"]
    + movies["crew"]
)

# Create the final recommendation dataset
new_df = movies[["movie_id", "title", "tags"]].copy()

new_df["tags"] = new_df["tags"].apply(lambda items: " ".join(items))

# Convert tags into numerical vectors
cv = CountVectorizer(max_features=5000, stop_words="english")
vectors = cv.fit_transform(new_df["tags"])

# Apply stemming to tags
new_df["tags"] = new_df["tags"].apply(stem)

# Calculate cosine similarity between movies
similarity = cosine_similarity(vectors)


@app.route("/movie/<string:movie>", methods=["GET"])
def recommend(movie):
    """Return the five most similar movies."""

    # Find the requested movie
    matched_movies = new_df[
        new_df["title"].str.casefold() == movie.strip().casefold()
    ]

    if matched_movies.empty:
        return jsonify({"error": f"Movie '{movie}' was not found."}), 404

    movie_index = matched_movies.index[0]

    # Calculate similarity scores and rank movies
    distances = similarity[movie_index]

    movies_list = sorted(
        enumerate(distances),
        reverse=True,
        key=lambda item: item[1],
    )[1:6]

    # Return recommended movie IDs
    recommendations = {}

    for index, item in enumerate(movies_list, start=1):
        movie_id = new_df.iloc[item[0]]["movie_id"]
        recommendations[f"movie_name{index}"] = str(movie_id)

    return jsonify(recommendations)


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "CineGenie recommendation API is running!"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)
