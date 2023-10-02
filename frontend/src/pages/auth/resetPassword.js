import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import { isValidPassword } from '/imports/ui/components/Functions.jsx';
import { errorMessage } from '/imports/ui/authentication/Auth.helpers';
import Loader from '/imports/ui/components/Loader.jsx';
import { WarningIcon } from '/imports/ui/components/Icons.jsx';
import '/imports/ui/authentication/Auth.css';

export default function ResetPassword() {
  const [values, setValues] = useState({ email: '', password: '', confirm_password: '', submitted: false, error: '', loading: false });
  const { token } = useParams();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, error: '', [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (values.submitted) return navigate('/signin');

    if (!values.password) return setValues({ ...values, error: 'missing-password' });
    if (!isValidPassword(values.password)) return setValues({ ...values, error: 'invalid-password' });
    if (!values.confirm_password) return setValues({ ...values, error: 'missing-confirm-password' });
    if (values.password !== values.confirm_password) return setValues({ ...values, error: 'different-password' });

    setValues({ ...values, loading: true });

    Accounts.resetPassword(token, values.password, (error) => {
      setValues({ ...values, loading: false });
      if (error) return setValues({ ...values, error: error.reason });
      navigate('/');
    });
  };

  return (
    <form onSubmit={handleSubmit} className="auth reset-password">
      <h4>Reset Password</h4>
      <p className="subtitle">Enter your new password to sign in.</p>

      <label>
        <span>New Password</span>
        <input type="password" name="password" value={values.password} onChange={handleChange} placeholder="e.g. password123" />
      </label>

      <label>
        <span>Confirm Password</span>
        <input type="password" name="confirm_password"  value={values.confirm_password} onChange={handleChange} placeholder="e.g. password123" />
      </label>

      <div className="actions">
        <button type="submit" disabled={values.loading} className="button primary">
          {values.loading ? <Loader /> : 'Reset Password'}
        </button>

        {values.error && <p className="error-message"><WarningIcon />{errorMessage(values.error)}</p>}
      </div>
    </form>
  );
}