import React, { useState } from 'react';
import loadable from '@loadable/component';
import { dateFormat } from '/imports/ui/components/Functions.jsx';
const UserModal = loadable(() => import('/imports/ui/admin/UserModal.jsx'));
import '/imports/ui/admin/Admin.css';

export default function UserItem({ user }) {
  const [editModal, setEditModal] = useState(false);
  const handleEditModal = () => setEditModal(!editModal);

  return (
    <div className="admin-item">
      <div className="information">
        <h4>{user.emails[0].address}</h4>
        <p>Joined {dateFormat(user.createdAt, "MMMM DD, YYYY - hh:mm A")}</p>
      </div>

      <button type="button" onClick={handleEditModal} className="button secondary">Edit</button>

      {editModal && <UserModal user={user} isOpen={editModal} onClose={handleEditModal} />}
    </div>
  );
}