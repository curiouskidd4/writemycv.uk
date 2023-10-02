import React from 'react';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAccount } from '/imports/ui/hooks/useAccount.jsx';
import '/imports/ui/layouts/AdminLayout.css';

export default function AdminLayout() {
  const { userId } = useAccount();

  // TODO. show only if user is admin
  if (!userId) return <Navigate to="/" />;

  return (
    <main>
      <Outlet />
    </main>
  );
}