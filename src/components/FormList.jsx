import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './FormList.module.css';
import { delete_icon, add_symbol } from '../data/useImportAssets';
import ModalPage from './ModalPage';
import { deleteFormApi, getForm } from '../api/formService';
import useForms from '../hooks/useForms';
import { useTheme } from '../context/ThemeContext';

const FormList = ({ onClearFolder }) => {
  const { forms, setForms, loading, error } = useForms();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const navigate = useNavigate();
  const {isDarkMode} =useTheme();
  const handleDeleteClick = (formId) => {
    console.log(formId)
    setSelectedFormId(formId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteFormApi(selectedFormId);
      toast.success('Form deleted successfully');
      setForms((prevForms) => prevForms.filter((form) => form._id !== selectedFormId));
      setIsModalOpen(false);
      onClearFolder();
    } catch (error) {
      toast.error('Failed to delete form');
      console.error('Error deleting form:', error);
    }
  };

  const handleFormClick = async (form) => {
    try {
      if (form.shareableLink) {
        // If shareableLink exists directly, use it
        navigate(`/form/${form.shareableLink}`);
      } else {
        // Otherwise, fetch form details to get the shareableLink
        const fetchedForm = await getForm(form.id);
        if (fetchedForm && fetchedForm.shareableLink) {
          navigate(`/form/${fetchedForm.shareableLink}`);
        } else {
          toast.error('Form not found or shareable link is missing');
        }
      }
    } catch (error) {
      toast.error('Failed to fetch form details');
      console.error('Error fetching form details:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching forms: {error.message}</div>;
  }

  return (
    <div>
      <div className={styles.form_div}>
        <div className={styles.form_container} onClick={() => navigate('/form')}>
          <img src={add_symbol} alt="add_symbol" className={styles.add_symbol_image} />
          <p className={styles.typography} >Create a typebot</p>
        </div>
        {isModalOpen ? (
          <div className={styles.modal}>
            <ModalPage
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              handleConfirm={handleConfirmDelete}
              message="Are you sure you want to delete this form?"
              confirmButtonText="Confirm"
              showInput={false}
            />
          </div>
        ) : (
          forms.length > 0 && forms.map((form) => (
            <div className={`${styles.formList} ${isDarkMode?styles.formcolor1:styles.formcolor2}`} onClick={() => handleFormClick(form)} key={form.id}>
              {form._id ? (
                 <div  onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(form._id);
                }}>
                  <div className={styles.image}>
                  <img src={delete_icon} alt="Delete" />
                  </div>
                </div>
              ):(
                <div  onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(form.id);
                }}>
                  <div className={styles.image}>
                  <img src={delete_icon} alt="Delete" />
                  </div>
                </div>
              )}
             
              <div className={styles.formItem}>
                <h2 className={styles.typography}>{form.title}</h2>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FormList;









