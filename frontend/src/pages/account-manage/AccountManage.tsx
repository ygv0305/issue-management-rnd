// Node modules

// RBAC
import withPermission from '../../lib/rbac/withPermission';
import { PERMISSIONS } from '../../lib/rbac/allPermission';

// Styles
import './accountManage.css';

const MOCK_PENDING_USERS = [
  {
    id: 'USR-101',
    email: 'student1@aut.ac.nz',
    fullName: 'John Doe',
    role: 'Student',
    requestedAt: '2026-03-24',
  },
  {
    id: 'USR-102',
    email: 'supervisor1@aut.ac.nz',
    fullName: 'Jane Smith',
    role: 'Supervisor',
    requestedAt: '2026-03-25',
  },
];

function AccountManage() {
  const handleApprove = (userId: string) => {
    alert(`Approving user: ${userId}`);
  };

  const handleReject = (userId: string) => {
    if (window.confirm(`Are you sure you want to reject user ${userId}?`)) {
      alert(`User ${userId} rejected.`);
    }
  };

  return (
    <div className="account-manage-container">
      <h2>Account Management</h2>

      <div className="account-section">
        <h3>Pending Approvals</h3>

        {MOCK_PENDING_USERS.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Requested At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PENDING_USERS.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.requestedAt}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-approve"
                        onClick={() => handleApprove(user.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleReject(user.id)}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No pending accounts to review.</p>
        )}
      </div>
    </div>
  );
}

// Ensure only Admin (or roles with APPROVE_USER permission) can access this page
export default withPermission(AccountManage, PERMISSIONS.APPROVE_USER);
