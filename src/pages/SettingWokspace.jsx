// import React, { useState } from 'react';
// import styles from './SettingWorkspace.module.css';
// import { profile, visible, lock, Logout } from '../data/useImportAssets';
// import { setIsAuthenticated, setCurrentUser } from '../configureslice/reduxSlice';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { updateUser } from '../api/user';

// const SettingWorkspace = () => {
//     const [email, setEmail] = useState('');
//     const [oldPassword, setOldPassword] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [showEmail, setShowEmail] = useState(false);
//     const [showOldPassword, setShowOldPassword] = useState(false);
//     const [showNewPassword, setShowNewPassword] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('');
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const validateEmail = (email) => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     };

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('userId');
//         localStorage.removeItem('username');
//         dispatch(setIsAuthenticated(false));
//         dispatch(setCurrentUser(null));
//         navigate('/login');
//     };

//     const handleUpdate = async () => {
//         if (email && !validateEmail(email)) {
//             setErrorMessage('Invalid email format');
//             return;
//         }
//         if (oldPassword && newPassword && oldPassword === newPassword) {
//             setErrorMessage('New password cannot be the same as the old password');
//             return;
//         }
//         if (newPassword.length < 6) {
//             setErrorMessage('New password must be at least 6 characters long');
//             return;
//         }
//         try {
//             const result = await updateUser(email, oldPassword, newPassword);
//             console.log(result);
//             setErrorMessage('');
//         } catch (error) {
//             console.log('Update failed:', error);
//             setErrorMessage(error.response.data.message);
//         }
//     };

//     return (
//         <div className={styles.settings}>
//             <header className={styles.header}>
//                 <span>Settings</span>
//             </header>
//             <div className={styles.inputDiv}>
//                 <div className={styles.inputField}>
//                     <img src={profile} alt="profile" className={styles.image} />
//                     <input type="text" placeholder="Name" className={styles.input} />
//                 </div>
//                 <div className={styles.inputField}>
//                     <img src={lock} alt="lock" className={styles.image} />
//                     <input
//                         type={showEmail ? "text" : "email"}
//                         placeholder="Update Email"
//                         className={`${styles.input} ${errorMessage.includes('email') ? styles.error : ''}`}
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                     />
//                     <img
//                         src={visible}
//                         alt="toggle visibility"
//                         className={styles.image}
//                         onClick={() => setShowEmail(!showEmail)}
//                     />
//                 </div>
//                 <div className={styles.inputField}>
//                     <img src={lock} alt="lock" className={styles.image} />
//                     <input
//                         type={showOldPassword ? "text" : "password"}
//                         placeholder="Old Password"
//                         className={`${styles.input} ${errorMessage.includes('Old password') ? styles.error : ''}`}
//                         value={oldPassword}
//                         onChange={(e) => setOldPassword(e.target.value)}
//                     />
//                     <img
//                         src={visible}
//                         alt="toggle visibility"
//                         className={styles.image}
//                         onClick={() => setShowOldPassword(!showOldPassword)}
//                     />
//                 </div>
//                 <div className={styles.inputField}>
//                     <img src={lock} alt="lock" className={styles.image} />
//                     <input
//                         type={showNewPassword ? "text" : "password"}
//                         placeholder="New Password"
//                         className={`${styles.input} ${errorMessage.includes('password') ? styles.error : ''}`}
//                         value={newPassword}
//                         onChange={(e) => setNewPassword(e.target.value)}
//                     />
//                     <img
//                         src={visible}
//                         alt="toggle visibility"
//                         className={styles.image}
//                         onClick={() => setShowNewPassword(!showNewPassword)}
//                     />
//                 </div>
//             </div>
//             {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
//             <div className={styles.buttonContainer}>
//                 <button className={styles.update} onClick={handleUpdate}>Update</button>
//             </div>
//             <div className={styles.footer} onClick={handleLogout}>
//                 <img src={Logout} alt="Logout" className={styles.footerImage} />
//                 <p className={styles.typography}>Log out</p>
//             </div>
//         </div>
        
//     );
// };

// export default SettingWorkspace;

import React, { useState } from "react";
import styles from "./SettingWorkspace.module.css";
import { profile, visible, lock, Logout } from "../data/useImportAssets";
import { setIsAuthenticated, setCurrentUser } from "../configureslice/reduxSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../api/user";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SettingWorkspace = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    dispatch(setIsAuthenticated(false));
    dispatch(setCurrentUser(null));
    navigate("/login");
    toast.success("Logged out successfully!");
  };

//   const handleUpdate = async () => {
//     // Handle name update
//     if (name) {
//       try {
//         await updateUser(name);
//         toast.success("Name updated successfully!");
//         setName(""); // Clear name field
//       } catch (error) {
//         toast.error(error.response?.data?.message || "Failed to update name.");
//       }
//     }

//     // Handle email update
//     if (email) {
//       if (!validateEmail(email)) {
//         toast.error("Invalid email format.");
//         return;
//       }
//       try {
//         await updateUser(email);
//         toast.success("Email updated successfully!");
//         setEmail(""); // Clear email field
//       } catch (error) {
//         toast.error(error.response?.data?.message || "Failed to update email.");
//       }
//     }

//     // Handle password update
//     if (oldPassword || newPassword) {
//       if (!oldPassword || !newPassword) {
//         toast.error("Both old and new passwords are required to change your password.");
//         return;
//       }
//       if (oldPassword === newPassword) {
//         toast.error("New password cannot be the same as the old password.");
//         return;
//       }
//       if (newPassword.length < 6) {
//         toast.error("New password must be at least 6 characters long.");
//         return;
//       }
//       try {
//         await updateUser( oldPassword, newPassword );
//         toast.success("Password updated successfully!");
//         setOldPassword(""); // Clear password fields
//         setNewPassword("");
//       } catch (error) {
//         toast.error(error.response?.data?.message || "Failed to update password.");
//       }
//     }

//     // If nothing is updated
//     if (!name && !email && !oldPassword && !newPassword) {
//       toast.error("Please fill out a field to update.");
//     }
//   };
const handleUpdate = async () => {
    // Construct payload object
    const payload = {};
  
    // Add name to the payload if it is being updated
    if (name) {
      payload.name = name;
    }
  
    // Add email to the payload if it is being updated
    if (email) {
      if (!validateEmail(email)) {
        toast.error("Invalid email format.");
        return;
      }
      payload.email = email;
    }
  
    // Add old and new passwords to the payload if they are being updated
    if (oldPassword || newPassword) {
      if (!oldPassword || !newPassword) {
        toast.error("Both old and new passwords are required to change your password.");
        return;
      }
      if (oldPassword === newPassword) {
        toast.error("New password cannot be the same as the old password.");
        return;
      }
      if (newPassword.length < 6) {
        toast.error("New password must be at least 6 characters long.");
        return;
      }
      payload.oldPassword = oldPassword;
      payload.newPassword = newPassword;
    }
  
    // If no fields are updated, show an error
    if (Object.keys(payload).length === 0) {
      toast.error("Please fill out a field to update.");
      return;
    }
  
    // Make the API call
    try {
      await updateUser(payload);
      toast.success("Update successful!");
  
      // Clear relevant fields
      setName(""); 
      setEmail("");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed.");
    }
  };
  
  return (
    <div className={styles.settings}>
      <header className={styles.header}>
        <span>Settings</span>
      </header>
      <div className={styles.inputDiv}>
        {/* Name Input */}
        <div className={styles.inputField}>
          <img src={profile} alt="profile" className={styles.image} />
          <input
            type="text"
            placeholder="Update Name"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email Input */}
        <div className={styles.inputField}>
          <img src={lock} alt="lock" className={styles.image} />
          <input
            type={showEmail ? "text" : "email"}
            placeholder="Update Email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <img
            src={visible}
            alt="toggle visibility"
            className={styles.image}
            onClick={() => setShowEmail(!showEmail)}
          />
        </div>

        {/* Old Password Input */}
        <div className={styles.inputField}>
          <img src={lock} alt="lock" className={styles.image} />
          <input
            type={showOldPassword ? "text" : "password"}
            placeholder="Old Password"
            className={styles.input}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <img
            src={visible}
            alt="toggle visibility"
            className={styles.image}
            onClick={() => setShowOldPassword(!showOldPassword)}
          />
        </div>

        {/* New Password Input */}
        <div className={styles.inputField}>
          <img src={lock} alt="lock" className={styles.image} />
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            className={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <img
            src={visible}
            alt="toggle visibility"
            className={styles.image}
            onClick={() => setShowNewPassword(!showNewPassword)}
          />
        </div>
      </div>

      {/* Update Button */}
      <div className={styles.buttonContainer}>
        <button className={styles.update} onClick={handleUpdate}>
          Update
        </button>
      </div>

      {/* Logout Button */}
      <div className={styles.footer} onClick={handleLogout}>
        <img src={Logout} alt="Logout" className={styles.footerImage} />
        <p className={styles.typography}>Log out</p>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick />
    </div>
  );
};

export default SettingWorkspace;

