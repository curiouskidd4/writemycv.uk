export function errorMessage(state) {
    switch (state) {
    case 'missing-name':
      return 'Name is required.';
    case 'missing-email':
      return 'Email address is required.';
    case 'invalid-email':
      return 'Enter a valid email address.';
    case 'used-email':
      return 'Email already exists.';
    case 'missing-password':
      return 'Password is required.';
    case 'invalid-password':
      return 'Password is too short (minimum is 6 characters).';
    case "missing-confirm-password":
      return 'Confirm your password.';
    case 'different-password':
      return 'Password\s dont match. Try again';
    case 'missing-access-key':
      return 'Access key is required.';
    case 'invalid-access-key':
      return 'Enter a valid access key.';
    case 'missing-terms':
      return 'Accept the terms and policy to continue';
    default:
      return state;
    }
  }