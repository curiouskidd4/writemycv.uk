import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import MembershipsCollection from '/imports/api/memberships/memberships';
import MembershipItem from '/imports/ui/admin/MembershipItem.jsx';
import '/imports/ui/admin/Admin.css';

export default function Memberships() {
  const { isLoading, memberships } = useTracker(() => {
    const subs = Meteor.subscribe('memberships/list');

    return {
      isLoading: !subs.ready(),
      memberships: MembershipsCollection.find().fetch(),
    };
  }, []);

  if (isLoading) return;

  return (
    <div className="wrapper admin">
      <div className="header">
        <h1>Administration</h1>
      </div>

      <div className="item list">
        <div className="navbar">
          <NavLink to="/admin/users">Users</NavLink>
          {/* <NavLink to="/admin/memberships">Memberships</NavLink> */}
        </div>

        {memberships.map((membership) => <MembershipItem key={membership._id} membership={membership} />)}
      </div>
    </div>
  );
}