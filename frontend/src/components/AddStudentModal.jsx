import React, { useState, useRef, useEffect } from 'react';

export default function AddStudentModal({ isOpen, onClose, onStudentAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Camera States
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Hooks must be before early returns
  useEffect(() => {
    // Cleanup camera if modal closes unexpectedly
    if (!isOpen) {
        stopCamera();
    } else {
        fetchFacultyCourses();
    }
  }, [isOpen]);

  const fetchFacultyCourses = async () => {
    const faculty_id = window.localStorage.getItem('user_id');
    if (!faculty_id) return;
    try {
      const res = await fetch(`http://localhost:3000/api/faculty/courses/${faculty_id}`);
      const data = await res.json();
      setCourses(Array.isArray(data) ? data : []);
      if (data.length > 0) setCourseId(data[0].id);
    } catch (e) {
      console.error("Failed to fetch courses:", e);
    }
  };

  const startCamera = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setCameraActive(true);
      setCapturedImage(null);
    } catch (err) {
      setError('Camera access denied or unavailable.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      // Force 640x480 resolution for consistency in python models
      canvasRef.current.width = 640;
      canvasRef.current.height = 480;
      context.drawImage(videoRef.current, 0, 0, 640, 480);
      
      const imageDataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
      setCapturedImage(imageDataUrl);
      stopCamera();
    }
  };

  const retakeImage = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!capturedImage) {
      setError('Please capture a biometric facial snapshot to proceed.');
      return;
    }
    
    setLoading(true);
    setError('');

    // Get user from props or context
    const faculty_id = window.localStorage.getItem('user_id') || ''; // Fallback or update component signature

    try {
      const response = await fetch('http://localhost:3000/api/faculty/add-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, imageBase64: capturedImage, faculty_id, course_id: courseId })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to add student');

      onStudentAdded(data.student);
      handleClose();
      // Reset form
      setName('');
      setEmail('');
      setCapturedImage(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
      <div className="bg-surface-container-low w-full max-w-lg rounded-2xl border border-outline-variant/20 shadow-2xl p-8 relative animate-in zoom-in-95 duration-300 my-8">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="mb-6">
          <h2 className="font-headline text-2xl font-bold text-on-surface">Add New Student</h2>
          <p className="text-on-surface-variant text-sm mt-1">Capture a biometric facial scan to register the student in the system.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-error-container/20 border border-error-container text-error text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Facial Capture Section */}
          <div className="space-y-2">
             <label className="font-label text-xs uppercase tracking-widest font-semibold text-primary/80 ml-1">Facial Scan</label>
             <div className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden relative aspect-video flex items-center justify-center bg-[#0b1326]">
                {!cameraActive && !capturedImage && (
                   <button type="button" onClick={startCamera} className="px-6 py-3 rounded-full bg-primary/20 text-primary font-bold text-xs uppercase tracking-wider hover:bg-primary/30 transition-all flex items-center gap-2">
                     <span className="material-symbols-outlined text-lg">videocam</span> Start Camera
                   </button>
                )}

                <div className={`w-full h-full relative ${cameraActive ? 'block' : 'hidden'}`}>
                   <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform scale-x-[-1]"></video>
                   <button type="button" onClick={captureImage} className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-white text-black font-black text-xs uppercase tracking-wider hover:scale-105 transition-all shadow-xl">
                      Capture Photo
                   </button>
                </div>

                {capturedImage && (
                   <div className="w-full h-full relative">
                      <img src={capturedImage} alt="Captured face" className="w-full h-full object-cover transform scale-x-[-1]" />
                      <div className="absolute top-2 right-2 bg-green-500/90 text-white text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                         <span className="material-symbols-outlined text-xs">verified</span> Ready
                      </div>
                      <button type="button" onClick={retakeImage} className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-surface-container/80 backdrop-blur-md text-white border border-white/10 font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all">
                         Retake Photo
                      </button>
                   </div>
                )}
                
                <canvas ref={canvasRef} className="hidden" />
             </div>
          </div>

          <div className="space-y-2">
            <label className="font-label text-xs uppercase tracking-widest font-semibold text-primary/80 ml-1">Assigned Course</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">book</span>
              <select 
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full bg-[#0b1326] border-0 border-b border-white/10 py-4 pl-12 pr-4 text-white focus:ring-0 focus:border-primary transition-all rounded-t-lg appearance-none"
              >
                {courses.length > 0 ? courses.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                )) : (
                  <option value="">No courses available. Create one first.</option>
                )}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-label text-xs uppercase tracking-widest font-semibold text-primary/80 ml-1">Full Name</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">person</span>
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant/30 py-4 pl-12 pr-4 text-on-surface focus:ring-0 focus:border-primary transition-all rounded-t-lg placeholder:text-outline/30"
                placeholder="Julian Vane"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-label text-xs uppercase tracking-widest font-semibold text-primary/80 ml-1">Email Address</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">alternate_email</span>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-lowest border-0 border-b border-outline-variant/30 py-4 pl-12 pr-4 text-on-surface focus:ring-0 focus:border-primary transition-all rounded-t-lg placeholder:text-outline/30"
                placeholder="student@university.edu"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={handleClose}
              className="flex-1 py-4 border border-outline-variant text-on-surface font-bold rounded-xl hover:bg-surface-variant transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading || !capturedImage}
              className="flex-1 py-4 bg-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Register'}
              {!loading && <span className="material-symbols-outlined text-xl">person_add</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
