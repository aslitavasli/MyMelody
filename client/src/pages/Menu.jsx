import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Menu() {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleButtonClick = (button) => {
    if (button === "levels") {
      navigate("/levels");
    } else if (button === "create") {
      navigate("/createlevel");
    }
  };

  const handleMouseEnter = (button) => {
    setHoveredButton(button);
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  const handleGoBack = () => {
    navigate('/')
};
  return (
    <div className="menu-container">
      <button
        className={`levels ${
          hoveredButton && hoveredButton !== "levels" ? "faded" : ""
        }`}
        onClick={() => handleButtonClick("levels")}
        onMouseEnter={() => handleMouseEnter("levels")}
        onMouseLeave={handleMouseLeave}
      >
        View Practice Levels
      </button>
      <button
        className={`create ${
          hoveredButton && hoveredButton !== "create" ? "faded" : ""
        }`}
        onClick={() => handleButtonClick("create")}
        onMouseEnter={() => handleMouseEnter("create")}
        onMouseLeave={handleMouseLeave}
      >
        Create Your Level
      </button>

      <div className="backtostart-button-container">
                <button onClick={handleGoBack}>
                    Go Back
                </button>
            </div>
    </div>
  );
}

export default Menu;
