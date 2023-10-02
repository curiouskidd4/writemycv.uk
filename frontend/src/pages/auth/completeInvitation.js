import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { isValidPassword } from '../../components/Functions.jsx';
import { errorMessage } from './auth.helpers';
import Loader from '../../components/Loader.jsx';
import { WarningIcon } from '../../components/Icons.jsx';
import './auth.css';

export default function CompleteInvitation() {
  const [values, setValues] = useState({
    name: '',
    password: '',
    error: '',
    loading: false
  });

  const { token } = useParams();
  const navigate = useNavigate();

  const { isLoading, invitation } = useTracker(() => {
    const subs = Meteor.subscribe('invitation', {
      invitationToken: token,
    });

    return {
      isLoading: !subs.ready(),
      invitation: InvitationsCollection.findOne({ token }),
    };
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, error: '', [name]: value });
  };

  if (isLoading) return;
  if (!invitation) return <p>Invitation doesn't exist or has already been used</p>;

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!values.name) return setValues({ ...values, error: 'missing-name' });
    if (!values.password) return setValues({ ...values, error: 'missing-password' });
    if (!isValidPassword(values.password)) return setValues({ ...values, errorState: 'invalid-password' });

    setValues({ ...values, loading: true });

    // Create user
    Accounts.createUser({
      email: invitation.email,
      password: values.password,
      profile: { name: values.name },
      roles: invitation.roles,
    }, (error, response) => {
      if (error) return setValues({ ...values, error: error.reason, loading: false });

      const userId = response.id;
      handleCompleteInvitation(userId);
    });
  };

  const handleCompleteInvitation = (userId) => {
    // Complete invitation + add user to membership
    Meteor.call('invitation.complete', {
      invitationId: invitation._id,
      membershipId: invitation.membershipId,
      userId: userId,
      userEmail: invitation.email,
    }, (error) => {
      if (error) return setValues({ ...values, error: error.reason, loading: false });
      setValues({ ...values, loading: false });
      navigate('/standard');
    })
  }

  return (
    <form onSubmit={handleSubmit} className="auth">
      <h4>Complete Invitation</h4>
      <p className="subtitle">Hello {invitation.email}, complete your invitation here:</p>

      <label>
        <span>Name</span>
        <input type="text" name="name" value={values.name} onChange={handleChange} placeholder="e.g. John Doe" />
      </label>

      <label>
        <span>Password</span>
        <input type="password" name="password" value={values.password} onChange={handleChange} placeholder="e.g. password123" />
      </label>

      <div className="actions">
        <button type="submit" disabled={values.loading} className="button primary">
          {values.loading ? <Loader /> : 'Complete Invitation'}
        </button>

        {values.error && <p className="error-message"><WarningIcon />{errorMessage(values.error)}</p>}
      </div>

      <p>Already have an account? <Link to="/signin">Sign in</Link></p>
    </form>
  );
}