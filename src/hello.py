from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory storage for demonstration purposes
data_store = {
    'goalAmount': 1000,
    'donations': 0,
    'sponsorships': 0,
    'events': 0,
    'merchandise': 0,
    'missingAmount': 1000
}

@app.route('/api/save-data', methods=['POST'])
def save_data():
    global data_store
    data = request.json
    data_store.update(data)
    print('Received data:', data_store)
    return jsonify({'message': 'Data saved successfully!'})

@app.route('/api/get-data', methods=['GET'])
def get_data():
    return jsonify(data_store)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
