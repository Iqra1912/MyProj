from flask import Blueprint, request, jsonify
import pandas as pd
from app.utils.dataset_analyzer import analyze_dataset
from app.utils.insight_generator import generate_insights

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/upload", methods=["POST"])

def upload_file():

    file = request.files.get("file")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    try:

        if file.filename.endswith(".csv"):
            df = pd.read_csv(file)

        elif file.filename.endswith(".xlsx"):
            df = pd.read_excel(file)

        else:
            return jsonify({"error": "Unsupported format"}), 400

        charts = analyze_dataset(df)
        insights = generate_insights(df)

        # DEBUG
        print("Generated charts:", charts)

        return jsonify({
            "data": df.head(100).to_dict(orient="records"),
            "charts": charts,
            "insights": insights
        })

    except Exception as e:
        print("UPLOAD ERROR:", str(e))
        return jsonify({"error": str(e)}), 500
