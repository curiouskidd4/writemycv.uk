import React from 'react';
import { dateFormat } from '/imports/ui/components/Functions.jsx';
import '/imports/ui/admin/Admin.css';

export default function MembershipItem({ membership }) {
  const user = Meteor.users.findOne({ _id: membership.ownerId });

  return (
    <div className="admin-item membership">
      <p>Amount Licenses: {membership.amountLicenses}</p>
      <p>Remaining Licenses: {membership.usedLicenses} of {membership.amountLicenses} licenses used</p>
      <p>Next Billing Date: {dateFormat(membership.periodEndDate, 'MMMM DD, YYYY')}</p>
      <p>Membership Owner: {user.emails[0].address}</p>
    </div>
  );
}