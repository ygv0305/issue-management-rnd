// Node modules
import { useState, useEffect } from 'react';

// Styles
import './setupModal.css';

// Services
import SetupService from '../../services/setupService';

// Types
import type { ProjectData } from '../../types/authTypes';
import type { User } from '../../types/authTypes';

interface SetupModalProps {
  onComplete: (user: User) => void;
}

export default function SetupModal({ onComplete }: SetupModalProps) {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Student');
  const [projectIds, setProjectIds] = useState<string[]>([]);
  const [availableProjects, setAvailableProjects] = useState<ProjectData[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await SetupService.getProjects();
        if (data.success) {
          setAvailableProjects(data.projects);
        }
      } catch (error) {
        console.error('Failed to fetch projects', error);
      }
    };
    fetchProjects();
  }, []);

  const handleNextStep1 = () => {
    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleNextStep2 = () => {
    if (['PaperLeader', 'Admin'].includes(role)) {
      submitSetup(); // Skip project selection
    } else {
      setStep(3);
    }
  };

  const handleProjectToggle = (id: string) => {
    setProjectIds((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);

      if (role === 'Student' && prev.length >= 1) {
        // Replace if just 1 project allowed for Student
        return [id];
      }
      if (['Supervisor', 'Client'].includes(role) && prev.length >= 5) {
        return prev; // Ignore
      }
      return [...prev, id];
    });
  };

  const handleNextStep3 = () => {
    if (role === 'Student' && projectIds.length !== 1) {
      setError('You must select exactly one project.');
      return;
    }
    if (
      ['Supervisor', 'Client'].includes(role) &&
      (projectIds.length === 0 || projectIds.length > 5)
    ) {
      setError('You must select between 1 and 5 projects.');
      return;
    }
    setError('');
    submitSetup();
  };

  const submitSetup = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await SetupService.setupProfile({
        fullName,
        role,
        projectIds,
      });
      if (response.success && response.user) {
        onComplete(response.user);
      } else {
        setError(response.message || 'Setup failed. Please try again.');
        setLoading(false);
      }
    } catch (error: any) {
      console.error(error);
      setError(error.response?.data?.message || 'Error completing setup.');
      setLoading(false);
    }
  };

  return (
    <div className="setup-modal-overlay">
      <div className="setup-modal-content">
        <h2>Welcome! Let's get you set up.</h2>

        {error && <div className="setup-error">{error}</div>}

        {step === 1 && (
          <div>
            <label>Full Name:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="setup-input"
            />
            <button onClick={handleNextStep1} className="setup-btn">
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <label>Role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="setup-input"
            >
              <option value="Student">Student</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Client">Client</option>
              <option value="PaperLeader">Paper Leader</option>
              <option value="Admin">Admin</option>
            </select>
            <button
              onClick={handleNextStep2}
              className="setup-btn"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Next'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <label>Select Project(s):</label>
            <p className="project-helper-text">
              {role === 'Student'
                ? 'Select exactly 1 project.'
                : 'Select up to 5 projects.'}
            </p>
            <div className="project-list">
              {availableProjects.length === 0 ? (
                <p>No projects available.</p>
              ) : (
                availableProjects.map((p) => (
                  <div key={p._id} className="project-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={projectIds.includes(p._id)}
                        onChange={() => handleProjectToggle(p._id)}
                      />{' '}
                      {p.name}
                    </label>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={handleNextStep3}
              className="setup-btn"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Finish Setup'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
