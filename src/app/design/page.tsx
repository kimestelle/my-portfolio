import Design from "../components/Design";
import NavBar from "../components/NavBar";
import BottomBar from "../components/BottomBar";

export default function Portfolio() {
  return (
    <div className="flex flex-col overflow-hidden padding-responsive">
      <NavBar/>
      <Design />
      <BottomBar/>
    </div>
  );
}