import { DarkMode, LightMode, Logout } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import SlowMotionVideoIcon from "@mui/icons-material/SlowMotionVideo";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Dispatch, SetStateAction } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import DeblurIcon from "@mui/icons-material/Deblur";
import MessageIcon from "@mui/icons-material/Message";
import { useDispatch, useSelector } from "react-redux";

import SidebarOption from "./ui/SidebarOption";
import { Link, useSearchParams } from "react-router-dom";
import { firebaseAuth } from "../firebase";
import {
  closeSearchbar,
  openSearchbar,
  selectSearchbar,
} from "../redux/searchbarSlice";

function Sidebar(props: {
  expandSidebar: boolean;
  setExpandSidebar: Dispatch<SetStateAction<boolean>>;
  setDarkMode: any;
  darkMode: boolean | VoidFunction;
  setCloseUsers: Dispatch<SetStateAction<boolean>>;
  closeUsers: boolean;
}) {
  const showSearchbar = useSelector(selectSearchbar);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  function closeSearchbarFunc() {
    dispatch(closeSearchbar());
    setSearchParams("");
  }

  function showSearch() {
    showSearchbar ? closeSearchbarFunc() : dispatch(openSearchbar());
  }

  function signOut() {
    firebaseAuth.signOut().catch((error) => alert(error.message));
  }

  return (
    <div
      className={`dark:zincbg  flex border-r-2 border-r-zinc-300 py-10 transition-all dark:border-none 
       ${props.expandSidebar ? "pl-14 " : "items-center "} flex-col`}
    >
      <Link to="/" className={`${props.expandSidebar ? " scale-110" : ""}`}>
        <IconButton>
          {" "}
          <DeblurIcon />
        </IconButton>
      </Link>

      <div
        className={`mt-12 flex flex-col justify-center  last:mb-4  ${
          props.expandSidebar ? " mt-16" : " items-center "
        }`}
      >
        <SidebarOption
          text="Search "
          clickAction={showSearch}
          expandSidebar={props.expandSidebar}
          Icon={<SearchIcon />}
        />

        <SidebarOption
          text="Explore"
          expandSidebar={props.expandSidebar}
          Icon={<ExploreIcon />}
        />
        <SidebarOption
          text="Videos "
          expandSidebar={props.expandSidebar}
          Icon={<SlowMotionVideoIcon />}
        />
        <Link to="/">
          <SidebarOption
            text="Global Chat "
            expandSidebar={props.expandSidebar}
            Icon={<MessageIcon />}
          />
        </Link>
        <SidebarOption
          text="Create "
          expandSidebar={props.expandSidebar}
          Icon={<AddCircleOutlineIcon />}
        />

        <SidebarOption
          clickAction={signOut}
          text="Logout "
          expandSidebar={props.expandSidebar}
          Icon={<Logout />}
        />

        {props.darkMode ? (
          <SidebarOption
            clickAction={props.setDarkMode}
            text="Light Mode "
            expandSidebar={props.expandSidebar}
            Icon={<LightMode />}
          />
        ) : (
          <SidebarOption
            clickAction={props.setDarkMode}
            text="Dark Mode "
            expandSidebar={props.expandSidebar}
            Icon={<DarkMode />}
          />
        )}
      </div>

      <div className={` mt-auto  ${props.expandSidebar ? " scale-110" : ""}`}>
        {" "}
        <IconButton
          onClick={() =>
            props.setExpandSidebar((expandSidebar) =>
              window.innerWidth > 1200 ? !expandSidebar : false
            )
          }
        >
          <MenuIcon />{" "}
        </IconButton>
      </div>
    </div>
  );
}

export default Sidebar;
