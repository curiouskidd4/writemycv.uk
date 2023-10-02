export function userErrorMessage(state) {
  switch (state) {
  case 'missing-email':
    return 'Email address is required.';
  case 'invalid-email':
    return 'Enter a valid email address.';
  case 'missing-name':
    return 'Name is required.';
  default:
    return state;
  }
}