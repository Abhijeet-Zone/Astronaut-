from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})

@app.post("/api/calculate_fatigue")
def calculate_fatigue():
    try:
        # Try JSON first (silent to avoid 400 on invalid JSON)
        data = request.get_json(silent=True) or {}
        # If empty, try form-encoded or query params
        if not data:
            data = request.form.to_dict() or request.args.to_dict() or {}

        def to_float(x, default=0.0):
            try:
                return float(x)
            except Exception:
                return default

        hr = to_float(data.get("hr", 0))
        hrv = to_float(data.get("hrv", 0))
        spo2 = to_float(data.get("spo2", 0))
        sleep = to_float(data.get("sleep", 0))
        activity = to_float(data.get("activity", 0))

        # Basic validation (allow zeros but warn through alerts instead of 400)
        # If critical fields are missing, provide a helpful message but still respond with defaults
        validation_warnings = []
        if hr <= 0 or hrv <= 0 or spo2 <= 0:
            validation_warnings.append("One or more inputs are missing or zero; results may be inaccurate.")

        # Simple heuristic model (0..100)
        # Lower HRV, lower SpO2, lower sleep, and higher activity increase fatigue.
        hrv_component = max(0.0, min(1.0, (50 - hrv) / 50))  # HRV below 50 increases fatigue
        spo2_component = max(0.0, min(1.0, (99 - spo2) / 10))  # SpO2 below 99 increases fatigue
        sleep_component = max(0.0, min(1.0, (7 - sleep) / 7))  # Sleep below 7h increases fatigue
        activity_component = max(0.0, min(1.0, (activity - 3) / 7))  # Activity above 3 increases fatigue
        hr_component = max(0.0, min(1.0, (hr - 60) / 60))  # Higher HR increases fatigue

        fatigue_score = (
            0.32 * hrv_component +
            0.18 * spo2_component +
            0.22 * sleep_component +
            0.18 * activity_component +
            0.10 * hr_component
        ) * 100

        fatigue_score = round(max(0.0, min(100.0, fatigue_score)))

        if fatigue_score < 30:
            fatigue_state = "Optimal"
        elif fatigue_score < 60:
            fatigue_state = "Moderate"
        else:
            fatigue_state = "Critical"

        # Build alerts array matching UI expectations
        alerts = []
        alerts.extend([{ "metric": "Input", "level": "amber", "message": msg } for msg in validation_warnings])
        if spo2 < 95:
            alerts.append({
                "metric": "SpO2",
                "level": "red" if spo2 < 92 else "amber",
                "message": f"Low oxygen saturation detected: {spo2}%. Consider rest and supplemental O2 if available."
            })
        if hrv < 30:
            alerts.append({
                "metric": "HRV",
                "level": "amber",
                "message": f"Reduced HRV ({hrv} ms) indicates elevated stress/fatigue. Hydration and recovery recommended."
            })
        if sleep < 5:
            alerts.append({
                "metric": "Sleep",
                "level": "amber",
                "message": f"Short sleep duration recorded ({sleep} h). Schedule recovery period."
            })
        if activity > 8:
            alerts.append({
                "metric": "Activity",
                "level": "amber",
                "message": f"High workload intensity ({activity}/10). Monitor for overexertion."
            })

        return jsonify({
            "fatigueScore": fatigue_score,
            "fatigueState": fatigue_state,
            "alerts": alerts,
            "inputs": {
                "hr": hr,
                "hrv": hrv,
                "spo2": spo2,
                "sleep": sleep,
                "activity": activity,
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Default to 127.0.0.1:5000 which matches the frontend
    app.run(host="127.0.0.1", port=5000, debug=True)
