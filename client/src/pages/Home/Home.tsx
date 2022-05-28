import Header from "../../components/Header/Header";
import Leftside from "../../components/Leftside/Leftside";
import Middleside from "../../components/Middleside/Middleside";
import Rightside from "../../components/Rightside/Rightside";


export default function Home() {
  return (
    <div className="">
      <Header />
      <div className="flex bg-white h-[calc(100vh-90px)]" >
          <Leftside />
          <Middleside />
          <Rightside />
      </div>
    </div>
  );
}
