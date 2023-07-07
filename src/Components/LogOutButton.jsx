import { TouchableOpacity } from "react-native";

import { useUser } from "../../userContext";

import LogOutIcon from "../images/log-out-icon.svg";

export default LogOutButton = ({ style }) => {
  const { setIsLogined } = useUser();

  const handleLogOutPress = () => {
    setIsLogined(false);
  };

  return (
    <TouchableOpacity
      style={style}
      activeOpacity={0.6}
      onPress={handleLogOutPress}
    >
      <LogOutIcon fill={"#BDBDBD"} />
    </TouchableOpacity>
  );
};
