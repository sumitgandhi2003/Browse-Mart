import { useTheme } from "../../Context/themeContext";
import { SectionTitle } from "../../LIBS";
import ComingSoon from "../ComingSoon/ComingSoon";

const Orders = () => {
  const { theme } = useTheme();
  return <ComingSoon theme={theme} />;
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
