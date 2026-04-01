import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MyJobsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyJobs = async () => {
    try {
      const res = await api.get('/jobs');
      const myJobs = res.data.items.filter(j => j.postedById === Number(user.id));
      setJobs(myJobs);
    } catch {
      console.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter(j => j.id !== id));
    } catch {
      console.error('Failed to delete job');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>My jobs</h2>
        <Link to="/jobs/create">
          <button className="btn-primary">Post a new job</button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: '#666' }}>
          <p style={{ marginBottom: '1rem' }}>You haven't posted any jobs yet.</p>
          <Link to="/jobs/create">
            <button className="btn-primary">Post your first job</button>
          </Link>
        </div>
      ) : (
        jobs.map(job => (
          <div className="card" key={job.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ marginBottom: '0.4rem' }}>{job.summary}</h3>
                <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.75rem' }}>
                  Posted {new Date(job.postedDate).toLocaleDateString()} · {job.interestCount} interested
                </p>
                <p style={{ color: '#555', fontSize: '0.95rem' }}>
                  {job.body.length > 120 ? job.body.substring(0, 120) + '...' : job.body}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem', flexShrink: 0 }}>
                <Link to={`/jobs/${job.id}`}>
                  <button className="btn-secondary">View</button>
                </Link>
                <Link to={`/jobs/${job.id}/edit`}>
                  <button className="btn-secondary">Edit</button>
                </Link>
                <button className="btn-danger" onClick={() => handleDelete(job.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}