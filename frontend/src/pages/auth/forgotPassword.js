import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { isEmail } from '/imports/ui/components/Functions.jsx';
import { errorMessage } from './auth.helpers';
import Loader from '../../components/Loader.jsx';
import { WarningIcon } from '../../components/Icons.jsx';
import './auth.css';

export default function ForgotPassword() {
  const [values, setValues] = useState({ email: '', submitted: false, error: '', loading: false });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, error: '', [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!values.email) return setValues({ ...values, error: 'missing-email' });
    if (!isEmail(values.email)) return setValues({ ...values, error: 'invalid-email' });

    setValues({ ...values, loading: true });

    Accounts.forgotPassword({
      email: values.email.toLowerCase(),
    }, (error) => {
      setValues({ ...values, loading: false });
      if (error) return setValues({ ...values, error: error.reason });
      setValues({ ...values, email: '', error: '', submitted: true });
    });
  };

  return (
    <form onSubmit={handleSubmit} className="auth">
      <h4>Forgot Password</h4>
      <p className="subtitle">Use your email to reset your password</p>

      <label>
        <span>Email Address</span>
        <input type="text" name="email" value={values.email} onChange={handleChange} placeholder="e.g. john.doe@example.com" />
      </label>

      <div className="actions">
        <button type="submit" disabled={values.loading || values.submitted} className="button primary">
          {values.loading ? <Loader /> : values.submitted ? 'Recovery Intructions Sent to Your Email' : 'Recover Password'}
          {values.submitted && <CheckCircleIcon />}
        </button>

        {values.error && <p className="error-message"><WarningIcon />{errorMessage(values.error)}</p>}
      </div>

      <p>Remember your password? <Link to="/signin">Sign in</Link></p>
    </form>
  );
}