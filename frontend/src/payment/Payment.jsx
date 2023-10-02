import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardNumberElement, CardCvcElement, CardExpiryElement } from '@stripe/react-stripe-js';
import { membershipDetails, paymentErrorMessage } from '/imports/ui/payment/Payment.helpers';
import Loader from '/imports/ui/components/Loader.jsx';
import { AddIcon, WarningIcon } from '/imports/ui/components/Icons.jsx';
import MembershipsCollection from '/imports/api/memberships/memberships';
import '/imports/ui/payment/Payment.css';

const stripePromise = loadStripe(Meteor.settings.public.stripePublicKey, { locale: 'en' });

export default function Payment() {
  const location = useLocation();

  const [values, setValues] = useState({
    amountLicenses: location?.state?.amountLicenses || '1',
    membershipPlan: location?.state?.subscriptionPlan || 'singleMonth',
    error: '',
    loading: false
  });

  const { isLoading, user, membership } = useTracker(() => {
    const subs = Meteor.subscribe('membership/payment');

    return {
      isLoading: !subs.ready(),
      user: Meteor.user(),
      membership: MembershipsCollection.findOne()
    };
  }, []);

  if (isLoading) return;
  if (membership) return <Navigate to="/account" />;

  return (
    <div className="wrapper payment">
      <div className="header">
        <h1>Subscription</h1>
      </div>

      <Elements stripe={stripePromise}>
        <PaymentPlans values={values} setValues={setValues} />
        <PaymentSummary values={values} />
        <PaymentForm values={values} setValues={setValues} user={user} />
      </Elements>
    </div>
  );
}

function PaymentPlans({ values, setValues }) {
  const handleMembershipPlan = (plan) => {
    let amountLicenses = (plan === 'multipleYear') ? '5' : '1';
    setValues({ ...values, membershipPlan: plan, amountLicenses });
  };

  return (
    <div className="item plans">
      <div className="option">
        <h2>Single User</h2>
        <p>$166 / month</p>
        <button
          type="button"
          onClick={() => handleMembershipPlan('singleMonth')}
          disabled={values.membershipPlan === 'singleMonth'}
          className="button secondary"
        >
          {values.membershipPlan !== 'singleMonth' && <AddIcon />}
          {values.membershipPlan === 'singleMonth' ? 'Selected' : 'Select Plan'}
        </button>
      </div>

      <div className="option">
        <h2>Single User</h2>
        <p>$1999 / year</p>
        <button
          type="button"
          onClick={() => handleMembershipPlan('singleYear')}
          disabled={values.membershipPlan === 'singleYear'}
          className="button secondary"
        >
          {values.membershipPlan !== 'singleYear' && <AddIcon />}
          {values.membershipPlan === 'singleYear' ? 'Selected' : 'Select Plan'}
        </button>
      </div>

      <div className="option">
        <h2>Multiple Users</h2>
        <p>From $499 / user year</p>

        <button
          type="button"
          onClick={() => handleMembershipPlan('multipleYear')}
          disabled={values.membershipPlan === 'multipleYear'}
          className="button secondary"
        >
          {values.membershipPlan !== 'multipleYear' && <AddIcon />}
          {values.membershipPlan === 'multipleYear' ? 'Selected' : 'Select Plan'}
        </button>
      </div>
    </div>
  );
}

function PaymentSummary({ values }) {
  const details = membershipDetails(values.membershipPlan, values.amountLicenses);

  const isMultipleUsersMembership = values.membershipPlan === 'multipleYear';
  const membershipLabel = values.membershipPlan === 'singleMonth' ? ' / month' : values.membershipPlan === 'multipleYear' ? ' / user year' : ' / year';

  return (
    <div className="item summary">
      <h4>Summary</h4>

      <p>Selected Plan: {details.name}</p>
      <p>Amount Licenses: {values.amountLicenses}</p>
      <p>Price License: ${details.price} {membershipLabel}</p>
      <p>Total Payment Amount: ${values.amountLicenses ? details.price * parseInt(values.amountLicenses) : 0}</p>
    </div>
  );
}

function PaymentForm({ values, setValues, user }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  // Disable form submission until stripe is loaded
  if (!stripe || !elements) return;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, error: '', [name]: value });
  };

  const isMultipleUsers = values.membershipPlan === 'multipleYear';

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Platform field validations
    if (!values.amountLicenses) return setValues({ ...values, error: 'missing-amount-licenses' });

    // Stripe validations
    const card = elements.getElement(CardNumberElement);
    const card_cvc = elements.getElement(CardCvcElement);
    const card_expiration = elements.getElement(CardExpiryElement);

    if (card._empty) return setValues({ ...values, error: 'missing-card-number' });
    if (card._invalid) return setValues({ ...values, error: 'invalid-card-number' });
    if (card_cvc._empty) return setValues({ ...values, error: 'missing-card-cvc' });
    if (card_cvc._invalid) return setValues({ ...values, error: 'invalid-card-cvc' });
    if (card_expiration._empty) return setValues({ ...values, error: 'missing-card-date' });
    if (card_expiration._invalid) return setValues({ ...values, error: 'invalid-card-date' });

    setValues({ ...values, error: '', loading: true });
    handleCreateSubscription();
  };

  const handleCreateSubscription = async () => {
    Meteor.call('membership.create', {
      userName: user.profile.name,
      userEmail: user.emails[0].address,
      membershipPlan: values.membershipPlan,
      amountLicenses: parseInt(values.amountLicenses),
    }, (error, clientSecret) => {
      if (error) return setValues({ ...values, error: error.reason, loading: false });
      handleCompleteSubscription(clientSecret);
    });
  };

  const handleCompleteSubscription = async (clientSecret) => {
    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: { name: values.name, email: values.email }
      }
    });

    if (error) return setValues({ ...values, error: error.message, loading: false });

    setValues({ ...values, loading: false });
    navigate('/account');
  };

  return (
    <div className="item form">
      <div className="head">
        <h4>Payment</h4>
      </div>

      <form onSubmit={handleSubmit} className="body">
        {isMultipleUsers &&
          <label>
            <span>Amount Licenses <div>{values.amountLicenses}</div></span>
            <input type="range" name="amountLicenses" value={values.amountLicenses} onChange={handleChange} min={5} max={300} />
          </label>
        }

        <label>
          <span>Card Number</span>
          <CardNumberElement />
        </label>

        <label>
          <span>CVC</span>
          <CardCvcElement />
        </label>

        <label>
          <span>Expiration Date</span>
          <CardExpiryElement />
        </label>

        <div className="actions">
          <button type="submit" disabled={values.loading} className="button primary">
            {values.loading ? <Loader /> : 'Subscribe'}
          </button>

          {values.error && <p className="error-message"><WarningIcon /> {paymentErrorMessage(values.error)}</p>}
        </div>
      </form>
    </div>
  );
}