import { useTheme } from "../../Context/themeContext";
import { SectionTitle } from "../../LIBS";

const Orders = () => {
  const { theme } = useTheme();
  return (
    <div
      className={`${
        theme === "dark" ? " text-white " : " text-gray-900"
      } transition-all duration-300`}
    >
      <SectionTitle title="Orders" />
    </div>
  );
};
export default Orders;
