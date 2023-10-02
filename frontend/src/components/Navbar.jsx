import React, { useState, useRef, useEffect, Fragment } from 'react';
import { useLocation, Link, NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useAccount } from '/imports/ui/hooks/useAccount.jsx';
import { hasRights } from '/imports/ui/components/Functions';
import { MenuIcon, UserIcon } from '/imports/ui/components/Icons.jsx';
import '/imports/ui/components/Navbar.css';

export default function Navbar() {
  const { userId } = useAccount();

  return (
    <nav className={userId ? 'private' : 'public'}>
      <div className="wrapper">
        {userId ? <NavbarPrivate /> : <NavbarPublic />}
      </div>
    </nav>
  );
}

function NavbarPrivate() {
  return (
    <Fragment>
      <div className="left-content">
        <a href="/standard" className="logo">
          <img src="/logo.png" alt="School Leader's Advantage | Logo" />
        </a>
        {/* {!hasRights(['member','admin']) && <Link to="/payment" className="button primary">Upgrade Now</Link>} */}
      </div>

      <div className="right-content">
        <div className="options">
          <NavLink to="/standard">SLA Standards</NavLink>
          <NavLink to="/state-standard">State Standards</NavLink>
          <NavLink to="/project">Item (Projects)</NavLink>
          <NavLink to="/favorite">Favorites</NavLink>
          <NavLink to="/help">Help</NavLink>
          <NavLink to="/question">Ask a Question</NavLink>
        </div>

        <NavPrivateDropdown />
      </div>

      <NavPrivateMobile />
    </Fragment>
  );
}

function NavbarPublic() {
  const location = useLocation();

  return (
    <Fragment>
      <div className="left-content">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="School Leader's Advantage | Logo" />
        </Link>
      </div>

      <div className="right-content">
        <Link to="/signin" state={location.state} className="button secondary white">Sign in</Link>
        <Link to="/signup" state={location.state} className="button primary white">Sign up</Link>
      </div>
    </Fragment>
  );
}

function NavPrivateDropdown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownContentRef = useRef(null);

  const handleWindowClick = (event) => {
    if (!showDropdown) return;
    if (!dropdownContentRef.current?.contains(event.target)) setShowDropdown(false);
  };

  useEffect(() => {
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  });

  const toggleDropdown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowDropdown(!showDropdown);
  }

  const handleLogout = (event) => {
    event.preventDefault();
    Meteor.logout();
  }

  return (
    <div className="menu-dropdown" onClick={toggleDropdown}>
      <button className={clsx('profile', showDropdown && 'active')}>
        <UserIcon />
      </button>

      <div className="content" ref={dropdownContentRef} style={{ display: showDropdown ? 'block' : 'none' }}>
        <Link to="/account">Account</Link>
        {hasRights('admin') && <Link to="/admin/users">Administrator</Link>}
        <a onClick={handleLogout}>Logout</a>
      </div>
    </div>
  );
}

function NavPrivateMobile() {
  const [expandNavbar, setExpandNavbar] = useState(false);
	const toggleExpandNavbar = () => setExpandNavbar(!expandNavbar);

  const handleLogout = (event) => {
    event.preventDefault();
    setExpandNavbar(!expandNavbar)
    Meteor.logout();
  }

  return (
    <Fragment>
      <div className={clsx('mobile-toggle', expandNavbar && 'active')} onClick={toggleExpandNavbar}>
        <MenuIcon />
      </div>

      <div className={clsx('mobile-content', expandNavbar && 'active')}>
        <NavLink to="/standard" onClick={toggleExpandNavbar}>SLA Standards</NavLink>
        <NavLink to="/state-standard" onClick={toggleExpandNavbar}>State Standards</NavLink>
        <NavLink to="/project" onClick={toggleExpandNavbar}>Projects</NavLink>
        <NavLink to="/favorite" onClick={toggleExpandNavbar}>Favorites</NavLink>
        <Link to="/account" onClick={toggleExpandNavbar}>Account</Link>
        <Link to="/help">Help</Link>
        <Link to="/question" onClick={toggleExpandNavbar}>Ask a Question</Link>
        {hasRights('admin') && <Link to="/admin/users" onClick={toggleExpandNavbar}>Administrator</Link>}
        <a onClick={handleLogout}>Logout</a>

        {/* {!hasRights(['member','admin']) && <Link to="/payment" className="button primary" onClick={toggleExpandNavbar}>Upgrade Now</Link>} */}
      </div>
    </Fragment>
  );
}