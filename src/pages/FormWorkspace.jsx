import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Workspace from '../components/Workspace';
import { resetForm, setFormDetails, updateWorkspaceFields } from '../configureslice/workspaceSlice';
import styles from './FormWorkspace.module.css';
import { getFormData } from '../api/formService';
import { handleSave } from '../utils/FormSaveHandler';
import { handleShare } from '../utils/FormShareHandler';
import { check,close } from '../data/useImportAssets';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../context/ThemeContext';

const FormWorkspace = () => {
  const { id } = useParams(); // Get shareable link from URL
  const [formId, setFormId] = useState(id);
  const [linkCopied, setLinkCopied] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const dispatch = useDispatch();
  const fields = useSelector((state) => state.workspace.fields);
  const formDetails = useSelector((state) => state.workspace.formDetails);
  const navigate = useNavigate();
  const folderId = useSelector((state) => state.workspace.folderId);
  const { isDarkMode, toggleTheme } = useTheme();

  console.log({formDetails}, 'formDetails')
  useEffect(() => {
    const fetchFormData = async () => {
      setLoading(true);
      try {
        // Fetch detailed form data using shareableLink
        const data = await getFormData(formId);

        // Dispatch form details to the store
        dispatch(setFormDetails({
          title: data.title,
          background:data.background,
        }));
        dispatch(updateWorkspaceFields(data.fields));
      } catch (error) {
        console.error('Error fetching form data:', error);
        setError('Form not found or not public');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFormData();
    } else {
      // If no ID, reset form for a new form creation
      dispatch(resetForm());
    }
  }, [id, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Go Back</button> 
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <header className={`${styles.header} ${isDarkMode?'':styles.headerlight}`}>
        <div className={styles.form_name}>
          <input 
            type="text" 
            placeholder="Enter form name" 
            className={styles.formname_input}
            value={formDetails.title || ''} // Ensure value is controlled
            onChange={(e) => dispatch(setFormDetails({ ...formDetails, title: e.target.value }))}
          />
        </div>
        <div className={styles.button_container}>
          <button  style={{cursor:"pointer",color:isDarkMode?"":"black"}}className={`${styles.button} ${styles.active}`} onClick={() => navigate('/form')}>Flow</button>
          <button style={{cursor:"pointer",color:isDarkMode?"":"black"}} className={styles.button} onClick={()=>navigate(`/analytics/${id}`)}>Response</button>
        </div>
        <div className={styles.button} style={{color:isDarkMode?"":"black"}}>
        <div 
            style={{
              display: "flex",
              alignItems: "center",
              alignContent: "center",
              padding: "8px 9px",
              
            }}
          >
            Light
            <div
              onClick={toggleTheme}
              style={{
                borderRadius: "20px",
                width: "50px",
                height: "20px",
                backgroundColor: isDarkMode
                  ? "rgba(26, 95, 255, 1)"
                  : "rgba(177, 177, 177, 1)",
                display: "flex",
                alignItems: "center",
                justifyContent: isDarkMode ? "flex-end" : "flex-start",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  borderRadius: "50px",
                  backgroundColor: "white",
                  height: "15px",
                  width: "15px",
                }}
              ></div>
            </div>
            Dark
          </div>
          <button className={styles.share} onClick={() => handleShare(formId, setLinkCopied)}>Share</button>
          <button className={styles.save} onClick={() => handleSave(formDetails, fields, folderId, setFormId, dispatch)}>Save</button>
          <img src={close} alt="close image" onClick={() => navigate('/workspace')}/>
        </div>
      </header>
      {linkCopied && <div className={styles.linkCopied}>
            <img src={check} />
            <p className={styles.link_para}> Link copied!</p>
            </div>}
      <div className={styles.container} style={{background:isDarkMode?"":"white"}}>
        <Sidebar />
        <Workspace />
      </div>
      <ToastContainer/>
    </div>
  );
};

export default FormWorkspace;
