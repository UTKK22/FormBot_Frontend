import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAllFoldersApi } from '../api/folder';
import { getFormsApi } from '../api/formService';


const useForms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const folderId = useSelector((state) => state.workspace.folderId);
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        if (folderId) {
          // Fetch folders with forms
          const response = await getAllFoldersApi(folderId);

          // Find the folder with the matching folderId
          const folder = response.find(folder => folder.id === folderId);
          if (folder) {
            // Set forms from the selected folder
            setForms(folder.forms || []);
          } else {
            setForms([]);
          }
        } else {
          // Fetch all forms
          const response = await getFormsApi();
          setForms(response.data || []);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [folderId, currentUser]);

  return { forms, setForms, loading, error };
};

export default useForms;

