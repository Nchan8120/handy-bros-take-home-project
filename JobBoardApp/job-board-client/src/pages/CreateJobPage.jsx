import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CreateJobPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ summary: '', body: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.summary.trim().length < 5) {
      setError('Title must be at least 5 characters.');
      return;
    }
    if (form.body.trim().length < 20) {
      setError('Description must be at least 20 characters.');
      return;
    }

    try {
      const res = await api.post('/jobs', form);
      navigate(`/jobs/${res.data.id}`);
    } catch {
      setError('Failed to create job. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Post a job</h2>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job title</label>
            <input
              type="text"
              name="summary"
              value={form.summary}
              onChange={handleChange}
              placeholder="e.g. Plumber needed in Hamilton"
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="body"
              value={form.body}
              onChange={handleChange}
              placeholder="Describe the job in detail..."
              rows={6}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn-primary">Post job</button>
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}