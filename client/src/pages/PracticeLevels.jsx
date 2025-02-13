import { useEffect, useState } from 'react';
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
    <div>
      {!selectedCategory && (
        <div className='back-button-container-top-categories'>
          <button onClick={handleGoBack}>
            Go Back
          </button>
        </div>
      )}

      {selectedCategory ? (
        <div className='category-name-explanation'>
          
          <h1>{selectedCategory.name}</h1>

          <div className='single-category-buttons'>
            <button onClick={() => setIsModalOpen(true)}>Edit Category</button>
            <button onClick={openDeleteModal}>Delete Category</button>
          </div>

          <div className='levels-container'>
            {selectedCategory.levels.map((level, index) => (
              <div
                key={index}
                className='tile-levels'
                onClick={() => handleLevelClick(level)}
              >
                <h4> `{level.phrase}`</h4>
              </div>
            ))}
            </div>
        
          <div className='back-button-container-top-categories'>
          <button onClick={handleBackToMenu}> Go Back </button>
          </div>
        </div>
      ) : (
        <div>
          <h1 className='categories-title'> Categories </h1>
          <div className="categories-container">
        {categories.map((category, index) => (
          <div
            className="tile"
            key={index}
            onClick={() => handleCategoryClick(category)}
          >
            <h3>{category.name}</h3>
          </div>
        ))}
      </div>
      </div>
      
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
              style={{
                padding: "0.8em 3em",
                width: "50%",
                marginBottom: "10px",
                borderRadius: "2em",
                border: "none",
                fontSize: "1rem", 
                outline: "none",
                backgroundColor: "#fff", 
                color: "#000", 
                boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.5)", 
                transition: "all 0.3s ease", 
                cursor: "pointer", 
               }}
            />
            <div>
              <button onClick={handleEditCategory} style={{ padding: '8px 15px', marginRight: '10px', backgroundColor: 'white'}}>Save</button>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '8px 15px', backgroundColor: 'white' }}>Cancel</button>
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
            <h3>Are you sure you want to delete this category? This will also delete all the levels. </h3>
            <div>
              <button className="save-saveLevelbutton" onClick={confirmDeleteCategory} style={{ padding: '8px 15px', marginRight: '10px' }}>Yes, Delete</button>
              <button className="save-cancelLevelbutton" onClick={closeDeleteModal} style={{ padding: '8px 15px' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PracticeLevels;
