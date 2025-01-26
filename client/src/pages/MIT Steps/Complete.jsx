import { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from 'axios';

Modal.setAppElement("#root");

const Completed = ({ phrase, pronounciations, spellings, pitches }) => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLevelSaved, setIsLevelSaved] = useState(false);
  const [levelExists, setlevelExists] = useState(false);
  const [levelExistsUnder, setlevelExistsUnder] = useState("")
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categoryNames");
        if (response.error) {
          throw new Error("Failed to fetch categories");
        }
        
        setCategories(response.data.categories || []);
      
      } catch (error) {
       console.log(error)
      }
    };
    fetchCategories();
    
    const doesThisLevelExist = async () => {
     
      const res = await axios.get("/api/checkLevel", {params: {phrase}});

      console.log('the server responded', res)
      if (res.data.category != false){
        setlevelExists(true)
        console.log('this is res.category')
        console.log(res.data.category)
        setlevelExistsUnder(res.data.category)
      }

      else{

        setlevelExists(false)

      }
    }
    doesThisLevelExist();
    setLoading(false);
  }, [categories]);



  const openSaveModal = () => setIsSaveModalOpen(true);
  const openEditModal = () => setIsEditModalOpen(true);
  
  const closeSaveModal = () => {
    setIsSaveModalOpen(false);
    setNewCategory("");
    setSelectedCategory("");
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setNewCategory("");
    setSelectedCategory("");
 
  };


  const saveLevel = async () => {
    try {
      if (newCategory) {
        const res = await axios.post('/api/saveLevelAndCategory', {
          newCategory,
          phrase,
          pronounciations,
          spellings,
          pitches,
        });
        console.log('this is the response', res)
        if (!res.error){
          setIsLevelSaved(true)
        setCategories((prev) => [...prev, res.data.category.name]);
        console.log('im tryna save', res.data.category.name)
        console.log('now categories are', categories)
        setlevelExistsUnder(newCategory);
        }

      } else if (selectedCategory) {
        const res = await axios.post('/api/saveLevel', {
          selectedCategory,
          phrase,
          pronounciations,
          spellings,
          pitches,
        });
        if (!res.error){
          setIsLevelSaved(true)
          setlevelExistsUnder(selectedCategory);
        }
      }
      closeSaveModal();
      
    } catch (error) {
      console.error("Error saving level:", error);
    }
  };


  const editLevel = async () =>{
    var finalCategory;
    if (newCategory) {
    
      finalCategory = newCategory
      
      const res = await axios.post('/api/changeLevelCategory', {
        phrase,
        finalCategory,
      });
      console.log('this is the response', res)
      if (!res.error){
        setIsLevelSaved(true)
        setCategories((prev) => [...prev, res.data.category]);
        console.log('now categories are', categories)
        setlevelExistsUnder(finalCategory);
      }

    } else if (selectedCategory) {
      finalCategory = selectedCategory;
      
      const res = await axios.post('/api/changeLevelCategory', {
        phrase,
        finalCategory
      });
      console.log('this is the response', res)
      if (!res.error){
        setIsLevelSaved(true)
        setlevelExistsUnder(finalCategory);
      }
    }
    // setlevelExistsUnder(finalCategory)
    closeEditModal();
    
  };


  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setNewCategory(""); // Clear new category input if selecting an existing category
  };

  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
    setSelectedCategory(""); // Clear selected category if entering a new category
  };

  if (loading){
   
    return <div>loading...</div>
  }

  return (
    <div className="complete-carousel">
      <h2>Congratulations! You can now say the phrase: </h2>
      <p>{phrase}</p>
      <button onClick={(isLevelSaved || levelExists) ? openEditModal : openSaveModal}> {(levelExists ||isLevelSaved) ? "Edit this Level" : "Save this Level"}</button>

      <Modal
  isOpen={isSaveModalOpen}
  onRequestClose={closeSaveModal}
  contentLabel="Save Level Modal"
  className="modal-content popup-style"
  overlayClassName="modal-overlay"
>
  <h2>Save Level</h2>
  <div className="modal-body">
    <label>Select an existing category:</label>
    <select
      value={selectedCategory}
      onChange={handleCategoryChange}
      disabled={newCategory.trim() !== ""}
    >
      <option value="">-- Choose a category --</option>
      {categories.map((category, index) => (
        <option key={index} value={category || "Unnamed Category"}>
          {category || "Unnamed Category"}
        </option>
      ))}
    </select>

    <div className="divider">or</div>

    <label>Create a new category:</label>
    <input
      type="text"
      value={newCategory}
      onChange={handleNewCategoryChange}
      placeholder="Enter new category name"
      disabled={selectedCategory.trim() !== ""}
    />
  </div>

  <div className="modal-footer">
    <button onClick={saveLevel}>Save</button>
    <button onClick={closeSaveModal}>Cancel</button>
  </div>
</Modal>

<Modal
  isOpen={isEditModalOpen}
  onRequestClose={closeEditModal}
  contentLabel="Edit Level Modal"
  className="modal-content popup-style"
  overlayClassName="modal-overlay"
>
  <h2>Edit Level</h2>
  <div className="modal-body">
    <h3>Your level is saved in `{levelExistsUnder}`:</h3>
    <label>Change to:</label>
    <select
      value={selectedCategory}
      onChange={handleCategoryChange}
      disabled={newCategory.trim() !== ""}
    >
      <option value="">-- Choose a category --</option>
      {categories
        .filter((category) => category !== levelExistsUnder)
        .map((category, index) => (
          <option key={index} value={category || "Unnamed Category"}>
            {category || "Unnamed Category"}
          </option>
        ))}
    </select>

    <div className="divider">or</div>

    <label>Create a new category to save in:</label>
    <input
      className="modal-input"
      type="text"
      value={newCategory}
      onChange={handleNewCategoryChange}
      placeholder="Enter new category name"
      disabled={selectedCategory.trim() !== ""}
    />
  </div>

  <div className="modal-footer">
    <button className="save" onClick={editLevel}>Save</button>
    <button onClick={closeEditModal}>Cancel</button>
  </div>
</Modal>


    </div>
  );
};

export default Completed;
