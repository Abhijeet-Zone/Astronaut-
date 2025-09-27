# -----------------------------------------------------------------------------
# SIMPLIFIED SPACE FATIGUE - BACKEND SERVER (FOR TESTING)
# -----------------------------------------------------------------------------
# This is a simplified version that works without the Gemini API key
# for testing the frontend-backend connection.

import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- FLASK APPLICATION SETUP ---
app = Flask(__name__)
CORS(app)

# --- SIMPLIFIED FATIGUE CALCULATION ---
def calculate_fatigue_score(hr, hrv, spo2, sleep, activity):
    """Simple fatigue calculation without AI"""
    score = 0
    
    # Heart Rate scoring (0-20 points)
    if hr < 50 or hr > 100:
        score += 20
    elif hr < 60 or hr > 90:
        score += 10
    
    # HRV scoring (0-25 points)
    if hrv < 30:
        score += 25
    elif hrv < 40:
        score += 15
    elif hrv < 50:
        score += 5
    
    # SpO2 scoring (0-20 points)
    if spo2 < 94:
        score += 20
    elif spo2 < 96:
        score += 10
    
    # Sleep scoring (0-20 points)
    if sleep < 5:
        score += 20
    elif sleep < 6:
        score += 15
    elif sleep < 7:
        score += 5
    
    # Activity scoring (0-15 points)
    if activity > 8:
        score += 15
    elif activity > 6:
        score += 10
    elif activity > 4:
        score += 5
    
    return min(score, 100)  # Cap at 100

def get_fatigue_state(score):
    """Convert score to state"""
    if score <= 20:
        return 'Optimal'
    elif score <= 40:
        return 'Low'
    elif score <= 60:
        return 'Moderate'
    elif score <= 80:
        return 'High'
    else:
        return 'Critical'

def generate_alerts(hr, hrv, spo2, sleep, activity):
    """Generate alerts based on metrics"""
    alerts = []
    
    if hr < 50 or hr > 100:
        alerts.append({
            "metric": "HR",
            "level": "red",
            "message": f"Heart rate ({hr} bpm) is outside normal range (50-100 bpm)."
        })
    elif hr < 60 or hr > 90:
        alerts.append({
            "metric": "HR", 
            "level": "amber",
            "message": f"Heart rate ({hr} bpm) is elevated, indicating stress or exertion."
        })
    
    if hrv < 30:
        alerts.append({
            "metric": "HRV",
            "level": "red", 
            "message": f"HRV ({hrv} ms) is critically low, indicating significant physiological stress or fatigue."
        })
    elif hrv < 40:
        alerts.append({
            "metric": "HRV",
            "level": "amber",
            "message": f"HRV ({hrv} ms) is below optimal range, suggesting increased stress."
        })
    
    if spo2 < 94:
        alerts.append({
            "metric": "SpO2",
            "level": "red",
            "message": f"Blood oxygen ({spo2}%) is critically low, requiring immediate attention."
        })
    elif spo2 < 96:
        alerts.append({
            "metric": "SpO2",
            "level": "amber", 
            "message": f"Blood oxygen ({spo2}%) is below optimal range."
        })
    
    if sleep < 5:
        alerts.append({
            "metric": "Sleep",
            "level": "red",
            "message": f"Sleep duration ({sleep} hrs) is critically insufficient for recovery."
        })
    elif sleep < 6:
        alerts.append({
            "metric": "Sleep",
            "level": "amber",
            "message": f"Sleep duration ({sleep} hrs) is below optimal range, impacting recovery."
        })
    
    if activity > 8:
        alerts.append({
            "metric": "Activity",
            "level": "amber",
            "message": f"High activity level ({activity}/10) may be contributing to fatigue."
        })
    
    return alerts

# --- API ENDPOINT ---
@app.route('/api/calculate_fatigue', methods=['POST'])
def calculate_fatigue():
    """API endpoint to calculate fatigue based on telemetry data."""
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    
    # Basic validation
    required_keys = ['hr', 'hrv', 'spo2', 'sleep', 'activity']
    if not all(key in data for key in required_keys):
        return jsonify({"error": "Missing one or more required fields: hr, hrv, spo2, sleep, activity"}), 400

    try:
        # Extract data
        hr = int(data.get('hr', 0))
        hrv = int(data.get('hrv', 0))
        spo2 = int(data.get('spo2', 0))
        sleep = float(data.get('sleep', 0))
        activity = int(data.get('activity', 0))
        
        # Calculate fatigue
        fatigue_score = calculate_fatigue_score(hr, hrv, spo2, sleep, activity)
        fatigue_state = get_fatigue_state(fatigue_score)
        alerts = generate_alerts(hr, hrv, spo2, sleep, activity)
        
        result = {
            "fatigueScore": fatigue_score,
            "fatigueState": fatigue_state,
            "alerts": alerts
        }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500

# --- MAIN EXECUTION ---
if __name__ == '__main__':
    print("-----------------------------------------------------")
    print("🚀 Starting Space Fatigue Backend Server...")
    print("✅ Simplified version (no AI required)")
    print("✅ Listening on: http://127.0.0.1:5000")
    print("-----------------------------------------------------")
    app.run(port=5000, debug=True)
