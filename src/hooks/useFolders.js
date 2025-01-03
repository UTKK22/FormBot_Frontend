import { useState, useEffect, useCallback } from 'react';
import { getFoldersApi } from '../api/folder';
import { useSelector } from 'react-redux';

const useFolders = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useSelector((state) => state.auth);
  

  const fetchFolders = useCallback(async () => {
    try {
      const response = await getFoldersApi();
      setFolders(response.folders);
    } catch (err) {
      setError('Failed to fetch folders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders, currentUser]);

  return { folders, loading, error, fetchFolders };
};

export default useFolders;

