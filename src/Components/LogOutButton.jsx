import { TouchableOpacity } from "react-native";

import LogOutIcon from "../images/log-out-icon.svg";
import { authSingOutUser } from "../redux/auth/authOperations";
import { useDispatch } from "react-redux";

export default LogOutButton = ({ style }) => {
  const dispatch = useDispatch();

  const handleLogOutPress = () => {
    dispatch(authSingOutUser());
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
