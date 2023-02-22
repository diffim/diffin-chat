import { useEffect, useState } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";
import Users from "../components/Users";
import UseDarkMode from "../custom-hooks/UseDarkMode";
import { useAuthState } from "react-firebase-hooks/auth";
import { firebaseAuth } from "../firebase";
import useHandleShortcut from "../custom-hooks/useHandleShortcut";
import { useDispatch, useSelector } from "react-redux";
import { openSearchbar, selectSearchbar } from "../redux/searchbarSlice";

export async function loader({ request }: any) {
  const url = new URL(request.url);
  const search: string | null = url.searchParams.get("search");
  return search;
}

function App() {
  const [expandSidebar, setExpandSidebar] = useState(false);
  const [closeUsers, setCloseUsers] = useState(false);
  const showSearchbar = useSelector(selectSearchbar);
  const dispatch = useDispatch();
  const [] = useHandleShortcut({
    userAction: "'",
    actionFunction: handleShortcutFunction,
  });
  const [darkMode, setDarkMode] = UseDarkMode();
  const [user, loading] = useAuthState(firebaseAuth as any);
  const navigate = useNavigate();
  const search: any = useLoaderData();

  //todo: delete messages
  //todo: rules dropdown
  //todo: push to db doc by id
  //todo: profiles
  //todo right click on user to view profile or go to message

  function handleShortcutFunction() {
    const searchObj = document.getElementById("search") as HTMLInputElement;
    if (showSearchbar) {
      searchObj.focus();
    } else {
      dispatch(openSearchbar());
      searchObj.focus();
    }
  }

  useEffect(() => {
    const searchObj = document.getElementById("search") as HTMLInputElement;
    searchObj.value = search;
  }, [search]);

  useEffect(() => {
    if (!loading) {
      !user && navigate("/login");
    }
  }, [user, loading]);

  return (
    <div
      className={` dark:bg-zinc-800 dark:text-white guaranteed-transition bg-zinc-200/50 
       [&>*]:transition [&>*]:duration-500  app menu h-screen text-zinc-700
      ${expandSidebar ? "openSidebar" : "closedSidebar"}  `}
    >
      <Sidebar
        expandSidebar={expandSidebar}
        setDarkMode={setDarkMode}
        darkMode={darkMode}
        setExpandSidebar={setExpandSidebar}
        closeUsers={closeUsers}
        setCloseUsers={setCloseUsers}
      />
      <Outlet />
      <Users search={search} />
    </div>
  );
}

export default App;
