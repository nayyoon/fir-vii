// src/pages/Dashboard.jsx
import React from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <div className="container text-center mt-5">
      <h1>🚀 Welcome to your Dashboard!</h1>
      {user && (
        <>
          <p><strong>Email:</strong> {user.email}</p>
          {user.displayName && <p><strong>Name:</strong> {user.displayName}</p>}
        </>
      )}
      <button className="btn btn-danger mt-4" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
