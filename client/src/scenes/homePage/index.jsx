import { useSelector } from "react-redux";
import UserHomePage from "./UserHomePage";
import WriterHomePage from "./WriterHomePage";

const HomePage = () => {
  const { role } = useSelector((state) => state.user);

  return role === "user" ? <UserHomePage /> : <WriterHomePage />;
};

export default HomePage;
