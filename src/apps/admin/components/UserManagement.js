import React, { useState, useEffect } from 'react';
import '../styles/UserManagement.css';
import '../styles/AdminShared.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    is_active: ''
  });

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.is_active !== '') params.append('is_active', filters.is_active);

      const response = await fetch(`http://127.0.0.1:8000/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });

      if (response.ok) {
        fetchUsers(); // Refresh the list
      } else {
        alert('Failed to update user status');
      }
    } catch (error) {
      alert('Error updating user status');
    }
  };

  const handleDeleteUser = async (userId, userRole) => {
    if (userRole === 'admin') {
      alert('Cannot delete admin users');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          fetchUsers(); // Refresh the list
        } else {
          alert('Failed to delete user');
        }
      } catch (error) {
        alert('Error deleting user');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <h2>User Management</h2>
        <p>Manage all platform users, roles, and permissions</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Filter by Role:</label>
          <select 
            value={filters.role} 
            onChange={(e) => setFilters({...filters, role: e.target.value})}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="vendor">Vendor</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by Status:</label>
          <select 
            value={filters.is_active} 
            onChange={(e) => setFilters({...filters, is_active: e.target.value})}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Username</th>
              <th>Full Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.full_name || 'N/A'}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="actions">
                  <button
                    className={`action-btn ${user.is_active ? 'deactivate' : 'activate'}`}
                    onClick={() => handleStatusToggle(user.id, user.is_active)}
                  >
                    {user.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  {user.role !== 'admin' && (
                    <button
                      className="action-btn delete"
                      onClick={() => handleDeleteUser(user.id, user.role)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <div className="no-data">
          <p>No users found matching the current filters.</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;