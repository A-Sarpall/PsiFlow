from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database initialization
def init_db():
    conn = sqlite3.connect('fraternity.db')
    c = conn.cursor()
    
    # Create tables
    c.execute('''
        CREATE TABLE IF NOT EXISTS member_counts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            count_type TEXT NOT NULL,
            count_value INTEGER NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL,
            amount REAL NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database when the app starts
init_db()

# Route to update member counts
@app.route('/api/update-count', methods=['POST'])
def update_count():
    data = request.json
    count_type = data.get('type')
    count_value = data.get('value')
    
    if not count_type or count_value is None:
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        conn = sqlite3.connect('fraternity.db')
        c = conn.cursor()
        c.execute(
            'INSERT INTO member_counts (count_type, count_value) VALUES (?, ?)',
            (count_type, count_value)
        )
        conn.commit()
        conn.close()
        return jsonify({'message': f'{count_type} updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to add expenses
@app.route('/api/add-expense', methods=['POST'])
def add_expense():
    data = request.json
    description = data.get('description')
    amount = data.get('amount')
    
    if not description or amount is None:
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        conn = sqlite3.connect('fraternity.db')
        c = conn.cursor()
        c.execute(
            'INSERT INTO expenses (description, amount) VALUES (?, ?)',
            (description, float(amount))
        )
        conn.commit()
        conn.close()
        return jsonify({'message': 'Expense added successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to get all data
@app.route('/api/get-data', methods=['GET'])
def get_data():
    try:
        conn = sqlite3.connect('fraternity.db')
        c = conn.cursor()
        
        # Get latest counts
        c.execute('''
            SELECT count_type, count_value 
            FROM member_counts 
            GROUP BY count_type 
            HAVING timestamp = MAX(timestamp)
        ''')
        counts = {row[0]: row[1] for row in c.fetchall()}
        
        # Get all expenses
        c.execute('SELECT description, amount, timestamp FROM expenses')
        expenses = [
            {'description': row[0], 'amount': row[1], 'timestamp': row[2]} 
            for row in c.fetchall()
        ]
        
        conn.close()
        return jsonify({
            'counts': counts,
            'expenses': expenses
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)