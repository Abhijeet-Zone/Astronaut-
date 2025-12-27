import React, { useState, useRef, useEffect } from 'react';
import './EyeScanner.css';
import { analyzeEyesWithGemini } from '../../services/gemini';


const EyeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [selectedEye, setSelectedEye] = useState('both');
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [leftFile, setLeftFile] = useState(null);
  const [rightFile, setRightFile] = useState(null);
  const [leftPreview, setLeftPreview] = useState(null);
  const [rightPreview, setRightPreview] = useState(null);

  // No longer simulate data; we'll fetch AI results from Gemini
  
  // Helper: capture current camera frame into a File for a target eye
  const captureFrameToEye = async (targetEye) => {
    return new Promise((resolve) => {
      if (!videoRef.current || !canvasRef.current) return resolve(null);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);

      // Apply same enhancement as manual capture
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.5);
        data[i + 1] = data[i + 1] * 0.7;
        data[i + 2] = data[i + 2] * 0.3;
      }
      ctx.putImageData(imageData, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);
        const file = new File([blob], `${targetEye}-eye.png`, { type: 'image/png' });
        const url = URL.createObjectURL(blob);
        if (targetEye === 'left') {
          if (leftPreview) URL.revokeObjectURL(leftPreview);
          setLeftFile(file);
          setLeftPreview(url);
        } else {
          if (rightPreview) URL.revokeObjectURL(rightPreview);
          setRightFile(file);
          setRightPreview(url);
        }
        resolve(file);
      }, 'image/png');
    });
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Camera access required for eye scanning. Please enable camera permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const startScan = async () => {
    // Work with local vars to avoid relying on async state timing
    let currLeft = leftFile;
    let currRight = rightFile;

    // If no files yet but camera is active, auto-capture into selected target
    if (!currLeft && !currRight && cameraActive) {
      const targetEye = selectedEye === 'both' ? 'left' : selectedEye;
      const captured = await captureFrameToEye(targetEye);
      if (captured) {
        if (targetEye === 'left') currLeft = captured; else currRight = captured;
      }
    }
    if (!currLeft && !currRight) {
      alert('Please upload or capture at least one eye image (left and/or right).');
      return;
    }
    setIsScanning(true);
    setScanResults(null);
    try {
      const payload = {
        leftFile: selectedEye !== 'right' ? currLeft : null,
        rightFile: selectedEye !== 'left' ? currRight : null,
      };
      console.log('Analyzing with files:', {
        hasLeft: !!payload.leftFile,
        hasRight: !!payload.rightFile,
        selectedEye,
      });
      const results = await analyzeEyesWithGemini(payload);
      setScanResults({
        timestamp: new Date(),
        ai: results,
      });
    } catch (e) {
      console.error('Gemini analysis failed', e);
      alert('Failed to analyze images. Please check your API key and network.');
    } finally {
      setIsScanning(false);
    }
  };

  const captureRetinalImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      
      // Apply retinal imaging filter effect
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        // Enhance red channel for retinal visualization
        data[i] = Math.min(255, data[i] * 1.5);     // Red
        data[i + 1] = data[i + 1] * 0.7;            // Green
        data[i + 2] = data[i + 2] * 0.3;            // Blue
      }
      
      ctx.putImageData(imageData, 0, 0);

      // Save captured image into the selected eye's file input
      // If 'Both Eyes' is selected, default to Left for first capture
      const targetEye = selectedEye === 'both' ? 'left' : selectedEye;

      canvas.toBlob((blob) => {
        if (!blob) return;
        const file = new File([blob], `${targetEye}-eye.png`, { type: 'image/png' });
        const url = URL.createObjectURL(blob);
        if (targetEye === 'left') {
          if (leftPreview) URL.revokeObjectURL(leftPreview);
          setLeftFile(file);
          setLeftPreview(url);
        } else if (targetEye === 'right') {
          if (rightPreview) URL.revokeObjectURL(rightPreview);
          setRightFile(file);
          setRightPreview(url);
        }
      }, 'image/png');
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return '#00ff88';
      case 'Moderate': return '#ffaa00';
      case 'High': return '#ff6b6b';
      default: return '#f1f1f1';
    }
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'Good': return '#00ff88';
      case 'Concerning': return '#ff6b6b';
      case 'Normal': return '#00d4ff';
      case 'Detected': return '#ff6b6b';
      case 'Present': return '#ffaa00';
      default: return '#f1f1f1';
    }
  };

  return (
    <div className="eye-scanner-container">
      <div className="scanner-header">
        <h2>👁️ Advanced Eye Scanner & SANS Detection</h2>
        <p>Spaceflight Associated Neuro-ocular Syndrome (SANS) Monitoring System</p>
      </div>

      <div className="scanner-content">
        <div className="camera-section">
          <div className="camera-container">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`camera-feed ${isScanning ? 'scanning' : ''}`}
            />
            <canvas ref={canvasRef} className="retinal-canvas" style={{ display: 'none' }} />
            
            {isScanning && (
              <div className="scan-overlay">
                <div className="scan-grid"></div>
                <div className="scan-progress">
                  <div className="progress-ring">
                    <svg width="120" height="120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="rgba(0, 212, 255, 0.2)"
                        strokeWidth="4"
                        fill="none"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="#00d4ff"
                        strokeWidth="4"
                        fill="none"
                        className="progress-circle"
                      />
                    </svg>
                    <div className="progress-text">Analyzing...</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="scanner-controls">
            <div className="eye-selection">
              <label>Scan Target:</label>
              <select 
                value={selectedEye} 
                onChange={(e) => setSelectedEye(e.target.value)}
                disabled={isScanning}
              >
                <option value="both">Both Eyes</option>
                <option value="left">Left Eye</option>
                <option value="right">Right Eye</option>
              </select>
            </div>

            <div className="upload-controls">
              <div className="upload-field">
                <label>Left Eye Image</label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isScanning}
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setLeftFile(f);
                    if (leftPreview) URL.revokeObjectURL(leftPreview);
                    setLeftPreview(f ? URL.createObjectURL(f) : null);
                  }}
                />
                {leftPreview && (
                  <img src={leftPreview} alt="Left eye preview" style={{ width: 100, height: 100, objectFit: 'cover', marginTop: 8, borderRadius: 6 }} />
                )}
              </div>
              <div className="upload-field">
                <label>Right Eye Image</label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isScanning}
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setRightFile(f);
                    if (rightPreview) URL.revokeObjectURL(rightPreview);
                    setRightPreview(f ? URL.createObjectURL(f) : null);
                  }}
                />
                {rightPreview && (
                  <img src={rightPreview} alt="Right eye preview" style={{ width: 100, height: 100, objectFit: 'cover', marginTop: 8, borderRadius: 6 }} />
                )}
              </div>
            </div>

            <div className="control-buttons">
              {!cameraActive ? (
                <button className="camera-btn" onClick={startCamera}>
                  📹 Activate Camera
                </button>
              ) : (
                <button className="camera-btn active" onClick={stopCamera}>
                  📹 Camera Active
                </button>
              )}
              
              <button 
                className="scan-btn"
                onClick={startScan}
                disabled={isScanning}
              >
                {isScanning ? '🔍 Analyzing...' : '🔍 Analyze Eye Images'}
              </button>
              
              <button 
                className="capture-btn"
                onClick={captureRetinalImage}
                disabled={!cameraActive || isScanning}
              >
                📸 Capture Retinal Image
              </button>
            </div>
          </div>
        </div>

        {scanResults && (
          <div className="results-section">
            <div className="results-header">
              <h3>📊 eye Analysis Results</h3>
              <div className="scan-timestamp">
                {scanResults.timestamp.toLocaleString()}
              </div>
            </div>
          

            <div className="eye-details">
              <div className="eye-data">
                <h4>👁️ Left Eye</h4>
                <div className="metrics">
                  <div className="metric">
                    <span>Risk:</span>
                    <span style={{ color: getRiskColor(scanResults.ai?.eyes?.left?.riskLevel) }}>
                      {scanResults.ai?.eyes?.left?.riskLevel || 'Low'}
                    </span>
                  </div>
                  {!!(scanResults.ai?.eyes?.left?.findings?.length) && (
                    <div className="metric">
                      <span>Findings:</span>
                      <span>
                        <ul>
                          {scanResults.ai.eyes.left.findings.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </span>
                    </div>
                  )}
                  {!!(scanResults.ai?.eyes?.left?.possibleConditions?.length) && (
                    <div className="metric">
                      <span>Possible Conditions:</span>
                      <span>
                        <ul>
                          {scanResults.ai.eyes.left.possibleConditions.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </span>
                    </div>
                  )}
                  {!!(scanResults.ai?.eyes?.left?.recommendedActions?.length) && (
                    <div className="metric">
                      <span>Recommended Actions:</span>
                      <span>
                        <ul>
                          {scanResults.ai.eyes.left.recommendedActions.map((a, i) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      </span>
                    </div>
                  )}
                  {!!(scanResults.ai?.eyes?.left?.precautions?.length) && (
                    <div className="metric">
                      <span>Precautions:</span>
                      <span>
                        <ul>
                          {scanResults.ai.eyes.left.precautions.map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="eye-data">
                <h4>👁️ Right Eye</h4>
                <div className="metrics">
                  <div className="metric">
                    <span>Risk:</span>
                    <span style={{ color: getRiskColor(scanResults.ai?.eyes?.right?.riskLevel) }}>
                      {scanResults.ai?.eyes?.right?.riskLevel || 'Low'}
                    </span>
                  </div>
                  {!!(scanResults.ai?.eyes?.right?.findings?.length) && (
                    <div className="metric">
                      <span>Findings:</span>
                      <span>
                        <ul>
                          {scanResults.ai.eyes.right.findings.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </span>
                    </div>
                  )}
                  {!!(scanResults.ai?.eyes?.right?.possibleConditions?.length) && (
                    <div className="metric">
                      <span>Possible Conditions:</span>
                      <span>
                        <ul>
                          {scanResults.ai.eyes.right.possibleConditions.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </span>
                    </div>
                  )}
                  {!!(scanResults.ai?.eyes?.right?.recommendedActions?.length) && (
                    <div className="metric">
                      <span>Recommended Actions:</span>
                      <span>
                        <ul>
                          {scanResults.ai.eyes.right.recommendedActions.map((a, i) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      </span>
                    </div>
                  )}
                  {!!(scanResults.ai?.eyes?.right?.precautions?.length) && (
                    <div className="metric">
                      <span>Precautions:</span>
                      <span>
                        <ul>
                          {scanResults.ai.eyes.right.precautions.map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!!(scanResults.ai?.urgentFlags?.length) && (
              <div className="recommendations">
                <h4>🚩 Urgent Flags</h4>
                <ul>
                  {scanResults.ai.urgentFlags.map((u, i) => (
                    <li key={i}>{u}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EyeScanner;
