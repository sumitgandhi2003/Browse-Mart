import { useTheme } from "../../Context/themeContext";
import { SectionTitle } from "../../LIBS";

const Customers = () => {
  const { theme } = useTheme();
  return (
    <div
      className={`${
        theme === "dark" ? " text-white " : " text-gray-900"
      } transition-all duration-300`}
    >
      <SectionTitle title="Customers" />
    </div>
  );
};
export default Customers;
