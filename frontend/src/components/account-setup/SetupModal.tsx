// Node modules
import { useState, useEffect } from 'react';

// Styles
import './setupModal.css';

// Services
import SetupService from '../../services/setupService';

// Handlers
import {
  handleNextStep1,
  handleNextStep2,
  handleNextStep3,
  handlePreviousStep,
  handleProjectToggle,
  submitSetup as submitSetupHandler,
} from './stepsHandler';

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

  const onSubmitSetup = () =>
    submitSetupHandler(
      fullName,
      role,
      projectIds,
      setLoading,
      setError,
      onComplete,
    );

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
            <button
              onClick={() => handleNextStep1(fullName, setError, setStep)}
              className="setup-btn"
            >
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
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => handlePreviousStep(step, setStep, setError)}
                className="setup-btn"
                style={{ backgroundColor: '#6c757d' }}
                disabled={loading}
              >
                Back
              </button>
              <button
                onClick={() => handleNextStep2(role, setStep, onSubmitSetup)}
                className="setup-btn"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Next'}
              </button>
            </div>
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
                        onChange={() =>
                          handleProjectToggle(p._id, role, setProjectIds)
                        }
                      />{' '}
                      {p.name}
                    </label>
                  </div>
                ))
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => handlePreviousStep(step, setStep, setError)}
                className="setup-btn"
                style={{ backgroundColor: '#6c757d' }}
                disabled={loading}
              >
                Back
              </button>
              <button
                onClick={() =>
                  handleNextStep3(role, projectIds, setError, onSubmitSetup)
                }
                className="setup-btn"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Finish Setup'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
