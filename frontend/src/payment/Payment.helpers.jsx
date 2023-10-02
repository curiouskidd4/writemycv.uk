export function paymentErrorMessage(state) {
  switch (state) {
  case 'missing-amount-licenses':
    return 'Amount licenses is required.';
  case 'missing-card-number':
    return 'Card number is required.';
  case 'invalid-card-number':
    return 'Enter a valid card number.';
  case 'missing-card-cvc':
    return 'Card verification code is required.';
  case 'invalid-card-cvc':
    return 'Enter a valid card verification code.';
  case 'missing-card-date':
    return 'Card expiration date is required.';
  case 'invalid-card-date':
    return 'Enter a valid card expiration date.';
  default:
    return state;
  }
}

export function membershipDetails(membership, amountLicenses) {
  let name, price;

  if (membership === 'singleMonth') {
    name = 'Single User - Month';
    price = 166;
  }

  if (membership === 'singleYear') {
    name = 'Single User - Year';
    price = 1999;
  }

  if (membership === 'multipleYear') {
    name = 'Multiple Users - Year';

    if (amountLicenses > 100) price = 299;
    else if (amountLicenses > 75) price = 349;
    else if (amountLicenses > 50) price = 399;
    else if (amountLicenses > 25) price = 449;
    else if (amountLicenses > 0) price = 499;
    else price = 0;

    if (amountLicenses < 0) price = 0;
  }

  return { name, price };
}