import React, { Fragment } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAccount } from '/imports/ui/hooks/useAccount';
import Navbar from '/imports/ui/components/Navbar.jsx';
import Footer from '/imports/ui/components/Footer.jsx';
import '/imports/ui/layouts/PublicLayout.css';

export default PublicLayout = () => {
  const { userId } = useAccount();

  if (userId) return <Navigate to="/standard"/>;

  return (
    <Fragment>
      <Navbar />

      <main className="public">
        <Outlet />
      </main>

      <Footer />
    </Fragment>
  );
};