

import { text, delete_icon } from '../data/useImportAssets';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateField, deleteField } from '../configureslice/workspaceSlice';
import styles from './Bubble.module.css';
import { useTheme } from '../context/ThemeContext';

const Bubble = ({ field }) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(field.content);
  const {isDarkMode}=useTheme();
  const handleChange = (e) => {
    const value = e.target.value;
    setValue(value);
    dispatch(updateField({ id: field.id, updates: { content: value } }));
  };

  const handleDelete = () => {
    dispatch(deleteField({ id: field.id }));
  };
  const renderUrlInput = (label) => (
    <div className={`${styles.bubble_text} ${isDarkMode?'':styles.lightbubble}`}>
      <div className={styles.delete_image}>
        <img src={delete_icon} alt="delete" className={styles.delete} onClick={handleDelete} />
      </div>
      <h3 className={styles.typography}>{label}</h3>
      <div className={styles.link}>
      <input
        type='url'
        accept="image/*,video/*"
        value={value}
        onChange={handleChange}
        className={styles.hidden_file_input}
        placeholder='Click to add link'
      />
      </div>
      
      {!value && <p className={styles.para}>Required Field</p>}
    </div>
  );

  switch (field.label) {
    case 'Text':
      return (
        <div className={`${styles.bubble_text}  ${isDarkMode?'':styles.lightbubble}`}>
          <div className={styles.delete_image}>
            <img src={delete_icon} alt="delete" className={styles.delete} onClick={handleDelete} />
          </div>
          <h3 className={styles.typography}>{field.label}</h3>
          <div className={styles.input}>
            <img src={text} alt="text" className={styles.image} />
            <input
              type="text"
              value={value}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Click here to edit"
            />
          </div>
          {!value && <p className={styles.para}>Required Field</p>}
        </div>
      );
    case 'Image':
    case 'Video':
    case 'GIF':
      return renderUrlInput(field.label);
    default:
      return null;
  }
};

export default Bubble;