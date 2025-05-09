import { useTheme } from "../../Context/themeContext";

const Setting = () => {
  const { theme } = useTheme();
  return (
    <div
      className={`${
        theme === "dark" ? " text-white " : " text-gray-900"
      } transition-all duration-300`}
    >
      <SectionTitle title="Setting" />
    </div>
  );
};
export default Setting;
