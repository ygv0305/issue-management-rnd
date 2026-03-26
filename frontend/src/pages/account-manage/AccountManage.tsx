// Node modules
import { useEffect, useState } from 'react';

// RBAC
import withPermission from '../../lib/rbac/withPermission';
import { PERMISSIONS } from '../../lib/rbac/allPermission';

// Services
import adminService from '../../services/adminService';

// Types
import type { PendingUser } from '../../types/issueTypes';

// Styles
import './accountManage.css';

function AccountManage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await adminService.getPendingUsers();
      if (res.success) {
        setPendingUsers(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      await adminService.approveUser(userId, 'Approved');
      alert('User approved successfully!');
      fetchUsers();
    } catch (error) {
      console.error('Failed to approve user:', error);
      alert('Failed to approve user.');
    }
  };

  const handleReject = async (userId: string) => {
    if (window.confirm('Are you sure you want to reject this user?')) {
      try {
        await adminService.approveUser(userId, 'Rejected');
        alert('User rejected.');
        fetchUsers();
      } catch (error) {
        console.error('Failed to reject user:', error);
        alert('Failed to reject user.');
      }
    }
  };

  if (loading) return <div className="account-manage-container">Loading users...</div>;

  return (
    <div className="account-manage-container">
      <h2>Account Management</h2>

      <div className="account-section">
        <h3>Pending Approvals</h3>

        {pendingUsers.length > 0 ? (
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
              {pendingUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user._id.slice(-6).toUpperCase()}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-approve"
                        onClick={() => handleApprove(user._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleReject(user._id)}
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
