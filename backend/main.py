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
movies_path = BASE_DIR / "tmdb_5000_movies.csv"
credits_path = BASE_DIR / "tmdb_5000_credits.csv"

# Initialize the stemmer
ps = PorterStemmer()



def convert(obj):
    """Extract names from genres or keywords safely."""
    try:
        return [
            item["name"]
            for item in ast.literal_eval(obj)
        ]
    except (ValueError, SyntaxError, TypeError, KeyError):
        return []


def convert3(obj):
    """Extract the first three cast members safely."""
    try:
        return [
            item["name"]
            for item in ast.literal_eval(obj)[:3]
        ]
    except (ValueError, SyntaxError, TypeError, KeyError):
        return []



def fetch_director(obj):
    """Extract the director's name safely."""
    try:
        crew = ast.literal_eval(obj)

        for item in crew:
            if item.get("job") == "Director":
                return [item["name"]]

    except (ValueError, SyntaxError, TypeError, AttributeError):
        return []

    return []


def stem(text):
    """Apply stemming to movie tags."""
    return " ".join(ps.stem(word) for word in text.split())


# Load datasets
movies = pd.read_csv(movies_path, low_memory=False)

credits = pd.read_csv(
    credits_path,
    usecols=["movie_id", "title", "casts", "crew"],
    low_memory=False,
)

# Rename 'casts' to 'cast' to match the recommendation code
credits.rename(columns={"casts": "cast"}, inplace=True)

# Ensure movie IDs have the same data type
movies["movie_id"] = pd.to_numeric(
    movies["movie_id"], errors="coerce"
)

credits["movie_id"] = pd.to_numeric(
    credits["movie_id"], errors="coerce"
)

# Remove rows with invalid movie IDs
movies.dropna(subset=["movie_id"], inplace=True)
credits.dropna(subset=["movie_id"], inplace=True)

movies["movie_id"] = movies["movie_id"].astype("int64")
credits["movie_id"] = credits["movie_id"].astype("int64")

# Merge movie and credits datasets
movies = movies.merge(
    credits[["movie_id", "cast", "crew"]],
    on="movie_id",
    how="inner",
)

# Keep the original movie title
movies.rename(columns={"title_x": "title"}, inplace=True)

# Remove duplicate title column if it exists
if "title_y" in movies.columns:
    movies.drop(columns=["title_y"], inplace=True)

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
].copy()

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
for column in ["genres", "keywords", "cast", "crew"]:
    movies[column] = movies[column].apply(
        lambda items: [
            item.replace(" ", "") for item in items
        ]
    )

movies["overview"] = movies["overview"].apply(
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

new_df["tags"] = new_df["tags"].apply(
    lambda items: " ".join(items)
)

# Convert tags into numerical vectors
cv = CountVectorizer(
    max_features=5000,
    stop_words="english",
)

vectors = cv.fit_transform(new_df["tags"])

# Apply stemming to tags
new_df["tags"] = new_df["tags"].apply(stem)

# Calculate cosine similarity between movies
similarity = cosine_similarity(vectors)


@app.route("/movie/<string:movie>", methods=["GET"])
def recommend(movie):
    """Return the five most similar movies."""

    # Find the requested movie, ignoring capitalization
    matched_movies = new_df[
        new_df["title"].str.casefold()
        == movie.strip().casefold()
    ]

    if matched_movies.empty:
        return jsonify({
            "error": f"Movie '{movie}' was not found."
        }), 404

    movie_index = matched_movies.index[0]

    # Get similarity scores for the selected movie
    distances = similarity[movie_index]

    # Rank movies by similarity and exclude the selected movie
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
    return jsonify({
        "message": "CineGenie recommendation API is running!"
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=False)
