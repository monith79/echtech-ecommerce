'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  role: string;
}

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setMessage('');
      try {
        // IMPORTANT: In a real app, this token would be retrieved from a secure
        // place (e.g., HttpOnly cookie or global state) after login.
        // For this prototype, a temporary token for the default 'admin' user is hardcoded.
        // This token may be expired. To get a new one, log in as the admin user.
        const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzI2MDgyODAwLCJleHAiOjE3MjYwODY0MDB9.5_j4B_w-Z_j4B_w-Z_j4B_w-Z_j4B_w-Z_j4B_w-Z_jE"; // Replace with a valid token if expired

        const response = await axios.get('http://localhost:5001/api/admin/users', {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
        setUsers(response.data);
      } catch (error: any) {
        if (error.response) {
          setMessage(error.response.data.message || 'Failed to fetch users. Is your token valid and not expired?');
        } else {
          setMessage('An error occurred while fetching users.');
        }
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <h2>Admin Dashboard</h2>
        <p>This page displays all registered users.</p>
        {message && <div className="alert alert-danger">{message}</div>}
        <div className="card">
          <div className="card-header">Users</div>
          <div className="card-body">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
