// import React, { useState } from 'react';


// export default function UserModal({ isOpen, onClose, user }) {
//   const [values, setValues] = useState({
//     email: user.emails[0].address,
//     name: user.profile.name,
//     error: '',
//     loading: false
//   });

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setValues({ ...values, [name]: value });
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//     if (!values.email) return setValues({ ...values, error: 'missing-email' });
//     if (!isEmail(values.email)) return setValues({ ...values, error: 'invalid-email' });
//     if (!values.name) return setValues({ ...values, error: 'missing-name' });

//     setValues({ ...values, loading: true });

//     Meteor.call('user.update', {
//       userId: user._id,
//       userEmail: values.email.toLowerCase(),
//       userName: values.name,
//     }, (error) => {
//       if (error) return setValues({ ...values, error: error.reason, loading: false });
//       return onClose();
//     });
//   };

//   return (

//       <form onSubmit={handleSubmit}>
//         <label>
//           <span>Email Address</span>
//           <input type="text" name="email" value={values.email} onChange={handleChange} placeholder="e.g. john.doe@example.com" />
//         </label>

//         <label>
//           <span>Name</span>
//           <input type="text" name="name" value={values.name} onChange={handleChange} placeholder="e.g. John Doe" />
//         </label>

//         <div className="actions">
//           <button type="submit" disabled={values.loading} className="button primary">
//             {values.loading ? <Loader /> : 'Save Changes'}
//           </button>

//           {/* {values.error && <p>{values.error}</p>} */}
//           {values.error && <p className="error-message"><WarningIcon /> {userErrorMessage(values.error)}</p>}
//         </div>
//       </form>
//     </Modal>
//   );
// }