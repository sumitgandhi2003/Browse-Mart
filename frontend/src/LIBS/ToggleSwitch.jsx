import { useState } from "react";

const ToggleSwitch = ({ visibiltyState = true, onToggle }) => {
  const [isOn, setIsOn] = useState(visibiltyState);

  const handleToggle = () => {
    // setIsOn((prev) => !prev);
    onToggle && onToggle(!isOn);
    setTimeout(() => setIsOn((prev) => !prev), 500);
  };
  return (
    <div className="flex items-center">
      <div
        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
          isOn ? "bg-blue-500" : "bg-gray-300"
        }`}
        onClick={handleToggle}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
            isOn ? "translate-x-6" : "translate-x-0"
          }`}
        ></div>
      </div>
    </div>
  );
};
export default ToggleSwitch;
