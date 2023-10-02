import React, { Fragment } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAccount } from '/imports/ui/hooks/useAccount.jsx';
import Navbar from '/imports/ui/components/Navbar.jsx';
import Footer from '/imports/ui/components/Footer.jsx';
import '/imports/ui/layouts/PrivateLayout.css';

export default function PrivateLayout() {
  const { userId } = useAccount();

  if (!userId) return <Navigate to="/" />;

  return (
    <Fragment>
      <Navbar />

      <main className="private">
        <Outlet />
      </main>

      <Footer />
    </Fragment>
  );
}