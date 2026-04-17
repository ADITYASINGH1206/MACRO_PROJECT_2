import React, { useRef, useEffect, useState } from 'react';

export default function BiometricFeed({ isDarkMode, onAttendanceLogged, courses = [], selectedCourseId }) {
  const videoRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const hiddenCanvasRef = useRef(null);
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isEngineReady, setIsEngineReady] = useState(false);

  // Setup Camera and WebSocket
  useEffect(() => {
    if (!selectedCourseId) return;

    let animationFrameId;

    const init = async () => {
      try {
        setError(null);
        setIsConnected(false);
        setIsEngineReady(false);

        // 1. Start Camera
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 640, height: 480, frameRate: { ideal: 30 } } 
        });
        if (videoRef.current) videoRef.current.srcObject = stream;

        // 1.5 Pre-flight check
        try {
            const resp = await fetch('http://localhost:8008/health');
            if (resp.ok) setIsEngineReady(true);
        } catch (e) {
            console.warn("[BIOMETRIC] Health check failed...");
        }

        // 2. Start WebSocket with Contextual course_id
        const socket = new WebSocket(`ws://localhost:8008/ws?course_id=${selectedCourseId}`);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log(`[BIOMETRIC] Connected for Course: ${selectedCourseId}`);
            setIsConnected(true);
        };

        socket.onmessage = (event) => {
          const detections = JSON.parse(event.data);
          drawOverlays(detections);
          if (onAttendanceLogged) onAttendanceLogged(detections);
        };

        socket.onerror = (err) => {
            console.error("[BIOMETRIC] WebSocket Handshake Error:", err);
            setError("Camera Connection Error (Check Console)");
        };

        socket.onclose = (event) => {
            console.warn("[BIOMETRIC] Link Terminated. Code:", event.code);
            setIsConnected(false);
        };

        // 3. Start Transmission Loop
        const sendFrame = () => {
          if (socket.readyState === WebSocket.OPEN && videoRef.current && hiddenCanvasRef.current) {
            const ctx = hiddenCanvasRef.current.getContext('2d');
            ctx.drawImage(videoRef.current, 0, 0, 640, 480);
            
            // Convert to base64
            const frameData = hiddenCanvasRef.current.toDataURL('image/jpeg', 0.6); 
            socket.send(frameData);
          }
          setTimeout(() => {
            animationFrameId = requestAnimationFrame(sendFrame);
          }, 100);
        };

        sendFrame();
      } catch (err) {
        setError('Hardware Error: Unified Camera access denied.');
      }
    };

    init();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (socketRef.current) socketRef.current.close();
      if (videoRef.current?.srcObject) {
         videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [selectedCourseId]);

  const drawOverlays = (detections) => {
    const ctx = overlayCanvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 640, 480);
    
    detections.forEach(det => {
      const { x1, y1, x2, y2, label, color } = det;
      
      // Box
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

      // Label
      ctx.fillStyle = color;
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillText(label, x1, y1 > 20 ? y1 - 10 : y1 + 20);
      
      if (label.includes('Verified')) {
         ctx.shadowBlur = 15;
         ctx.shadowColor = color;
         ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
         ctx.shadowBlur = 0;
      }
    });
  };

  return (
    <div className="relative w-full max-w-[640px] aspect-video mx-auto bg-black rounded-3xl overflow-hidden border border-white/10 shadow-3xl group">
      {/* Raw Video Layer */}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" 
      />
      
      {/* ML Overlay Canvas */}
      <canvas 
        ref={overlayCanvasRef} 
        width="640" 
        height="480" 
        className="absolute inset-0 w-full h-full z-10 scale-x-[-1]" 
      />

      <canvas ref={hiddenCanvasRef} width="640" height="480" className="hidden" />

      {/* Header Context Bar */}
      <div className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full">
           <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-orange-400 animate-bounce'}`}></div>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
              {isConnected ? `Active Course: ${courses.find(c => c.id === selectedCourseId)?.code || 'Active'}` : 'Connecting...'}
           </span>
        </div>
      </div>

      {/* UI States */}
      {(!isConnected || !selectedCourseId) && !error && (
        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-white p-8 text-center">
            {!selectedCourseId ? (
               <>
                 <span className="material-symbols-outlined text-4xl mb-4 text-primary">school</span>
                 <p className="font-black text-xl tracking-tight mb-2">Select a Course</p>
                 <p className="text-xs opacity-60 max-w-xs">Please select a course to start the attendance feed.</p>
               </>
            ) : (
               <>
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="font-bold tracking-tighter uppercase text-xs opacity-70">Connecting to camera...</p>
               </>
            )}
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-20 bg-error-container/90 backdrop-blur-md flex flex-col items-center justify-center text-white p-8 text-center">
            <span className="material-symbols-outlined text-5xl mb-4 text-error">dangerous</span>
            <p className="font-black text-xl tracking-tight mb-2">Connection Error</p>
            <p className="text-xs opacity-80 max-w-xs">{error}</p>
        </div>
      )}
    </div>
  );
}
