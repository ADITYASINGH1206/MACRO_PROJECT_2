import React, { useState } from 'react';

export default function AddStudentModal({ isOpen, onClose, onStudentAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/faculty/add-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to add student');

      onStudentAdded(data.student);
      onClose();
      // Reset form
      setName('');
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-surface-container-low w-full max-w-md rounded-2xl border border-outline-variant/20 shadow-2xl p-8 relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="mb-8">
          <h2 className="font-headline text-2xl font-bold text-on-surface">Add New Scholar</h2>
          <p className="text-on-surface-variant text-sm mt-1">Register a new student into the institutional archive.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-error-container/20 border border-error-container text-error text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="vane@scholarly.edu"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 border border-outline-variant text-on-surface font-bold rounded-xl hover:bg-surface-variant transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-primary text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
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
