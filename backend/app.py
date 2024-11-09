from flask import Flask, request, jsonify  # Added jsonify import
from flask_cors import CORS
import pandas as pd
import sqlite3

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        # Process the file
        df = pd.read_excel(file)
        
        # Connect to SQLite and save the data
        with sqlite3.connect('data.db') as conn:
            df.to_sql('user_data', conn, if_exists='replace', index=False)
        
        return jsonify({"message": "File uploaded and data stored successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_data', methods=['GET'])
def get_data():
    try:
        with sqlite3.connect('data.db') as conn:
            query = "SELECT * FROM user_data"
            df = pd.read_sql(query, conn)
            data = df.to_dict(orient='records')
            return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": f"Error retrieving data: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)