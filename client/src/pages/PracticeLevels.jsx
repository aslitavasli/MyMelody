import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PracticeLevels() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setNewCategoryName(category.name);
  };

  const handleBackToMenu = () => {
    setSelectedCategory(null);
  };

  const handleLevelClick = (level) => {
    navigate('/practice', { state: { spellings: level.spellings, pronounciations: level.pronounciations, pitches: level.pitches, phrase: level.phrase}});
  };

  const handleGoBack = () => {
    navigate('/menu');
  };

  const handleDeleteCategory = async() => {
    try {
      const res = await axios.delete('/api/deleteCategory', { data: { delete: selectedCategory } });
      if (!res.error) {
        setSelectedCategory(null);
        setCategories((prev) => prev.filter((category) => category !== selectedCategory));
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleEditCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await axios.post('/api/changeCategoryName', {
        oldCategory: selectedCategory,
        newName: newCategoryName
      });
      if (!res.error) {
        setCategories((prev) =>
          prev.map((category) =>
            category.name === selectedCategory.name
              ? { ...category, name: newCategoryName }
              : category
          )
        );
        setSelectedCategory((prev) => ({ ...prev, name: newCategoryName }));
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const confirmDeleteCategory = () => {
    handleDeleteCategory();
    closeDeleteModal();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      {!selectedCategory && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handleGoBack} style={{ backgroundColor: '#f0f0f0', padding: '10px', border: '1px solid #ccc' }}>
            Go Back
          </button>
        </div>
      )}

      {selectedCategory ? (
        <div style={{ textAlign: 'center' }}>
          <h2>{selectedCategory.name}</h2>
          <button onClick={() => setIsModalOpen(true)}>Edit Category</button>
          <button onClick={openDeleteModal}>Delete Category</button>
          <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {selectedCategory.levels.map((level, index) => (
              <div
                key={index}
                style={{
                  width: '100%',
                  textAlign: 'center',
                  padding: '15px',
                  border: '1px solid #ccc',
                  backgroundColor: index % 2 === 0 ? '#f7bdff' : '#b6b65b',
                }}
                onClick={() => handleLevelClick(level)}
              >
                <h4>"{level.phrase}"</h4>
              </div>
            ))}
          </div>
          <button
            onClick={handleBackToMenu}
            style={{ padding: '10px 20px', marginTop: '20px', cursor: 'pointer' }}
          >
            Back to Menu
          </button>
        </div>
      ) : (
        categories.map((category, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(category)}
            style={{
              width: '100%',
              textAlign: 'center',
              padding: '20px',
              border: '1px solid #ccc',
              backgroundColor: index % 2 === 0 ? '#f7bdff' : '#b6b65b',
              cursor: 'pointer',
            }}
          >
            <h3>{category.name}</h3>
          </div>
        ))
      )}

      {/* Modal for Editing Category */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '1000'
        }}>
          <div style={{
            backgroundColor: 'rgb(0,0,0)', padding: '20px', borderRadius: '8px', textAlign: 'center', width: '300px'
          }}>
            <h3>Edit Category Name</h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              style={{ padding: '5px', width: '100%', marginBottom: '10px' }}
            />
            <div>
              <button onClick={handleEditCategory} style={{ padding: '8px 15px', marginRight: '10px' }}>Save</button>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '8px 15px' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Deleting Category */}
      {isDeleteModalOpen && (
        <div style={{
          position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '1000'
        }}>
          <div style={{
            backgroundColor: 'rgb(0,0,0)', padding: '20px', borderRadius: '8px', textAlign: 'center', width: '300px'
          }}>
            <h3>Are you sure you want to delete this category?</h3>
            <div>
              <button onClick={confirmDeleteCategory} style={{ padding: '8px 15px', marginRight: '10px' }}>Yes, Delete</button>
              <button onClick={closeDeleteModal} style={{ padding: '8px 15px' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PracticeLevels;
