import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function JobDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [interested, setInterested] = useState(false);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJob = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data);
    } catch {
      console.error('Failed to fetch job');
    } finally {
      setLoading(false);
    }
  };

  const fetchInterestedUsers = async () => {
    try {
      const res = await api.get(`/jobs/${id}/interest`);
      setInterestedUsers(res.data);
    } catch {
      // Not the poster or not logged in — that's fine
    }
  };

  useEffect(() => {
    fetchJob();
    if (user?.role === 'Poster') fetchInterestedUsers();
  }, [id]);

  const handleInterest = async () => {
    try {
      const res = await api.post(`/jobs/${id}/interest`);
      setInterested(res.data.status === 'added');
      fetchJob(); // refresh interest count
    } catch {
      console.error('Failed to toggle interest');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      navigate('/');
    } catch {
      console.error('Failed to delete job');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!job) return <p>Job not found.</p>;

  return (
    <div>
      <Link to="/" style={{ fontSize: '0.9rem', color: '#2563eb' }}>← Back to listings</Link>

      <div className="card" style={{ marginTop: '1rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>{job.summary}</h2>
          <span style={{
            background: '#eff6ff',
            color: '#2563eb',
            padding: '0.2rem 0.6rem',
            borderRadius: '999px',
            fontSize: '0.85rem'
          }}>
            {job.interestCount} interested
          </span>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '1.5rem' }}>
          Posted by <strong>{job.postedBy}</strong> · {new Date(job.postedDate).toLocaleDateString()}
        </div>

        <p style={{ lineHeight: 1.7, marginBottom: '1.5rem' }}>{job.body}</p>

        {/* Viewer actions */}
        {user?.role === 'Viewer' && (
          <button
            onClick={handleInterest}
            className={interested ? 'btn-secondary' : 'btn-primary'}
          >
            {interested ? '✓ Interested' : 'Express interest'}
          </button>
        )}

        {/* Poster actions — only show if this is their job */}
        {user?.role === 'Poster' && job.postedById === Number(user.id) && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to={`/jobs/${id}/edit`}>
              <button className="btn-secondary">Edit</button>
            </Link>
            <button className="btn-danger" onClick={handleDelete}>Delete</button>
          </div>
        )}

        {/* Not logged in */}
        {!user && (
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            <Link to="/login">Log in</Link> to express interest in this job.
          </p>
        )}
      </div>

      {/* Interested users list — only visible to the poster */}
      {user?.role === 'Poster' && job.postedById === Number(user.id) && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Interested users</h3>
          {interestedUsers.length === 0 ? (
            <p style={{ color: '#888', fontSize: '0.9rem' }}>No one has expressed interest yet.</p>
          ) : (
            interestedUsers.map(u => (
              <div key={u.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <span>{u.username}</span>
                <span style={{ fontSize: '0.85rem', color: '#888' }}>
                  {new Date(u.expressedAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}