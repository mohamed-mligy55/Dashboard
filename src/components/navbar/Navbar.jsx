import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import MenuIcon from "@mui/icons-material/Menu";

import { useThemeContext } from "../../pages/context/ThemeContext";
import { useSidebarDrawer } from "../../pages/context/SidebarDrawerContext";

const Navbar = () => {
  const { mode, toggleTheme } = useThemeContext();
  const { toggleMobileSidebar } = useSidebarDrawer();

  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="navbar-left">
          <button
            type="button"
            className="navbar-menu-btn"
            aria-label="Open navigation menu"
            onClick={toggleMobileSidebar}
          >
            <MenuIcon />
          </button>
          <div className="search">
            <input
              type="search"
              placeholder="Search…"
              aria-label="Search"
              autoComplete="off"
            />
            <SearchOutlinedIcon />
          </div>
        </div>
        <div className="items">
          <div className="item navbar-hide-sm">
            <LanguageOutlinedIcon className="icon" />
            English
          </div>
          <div className="iteme">
             <button type="button" onClick={toggleTheme}>
        {mode === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
            
          </div>
          <div className="item navbar-hide-sm">
            <FullscreenExitOutlinedIcon className="icon" />
          </div>
          <div className="item navbar-hide-xs">
            <NotificationsNoneOutlinedIcon className="icon" />
            <div className="counter">1</div>
          </div>
          <div className="item navbar-hide-xs">
            <ChatBubbleOutlineOutlinedIcon className="icon" />
            <div className="counter">2</div>
          </div>
          <div className="item navbar-hide-sm">
            <ListOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <img
              src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&w=80"
              alt="Signed-in user profile"
              className="avatar"
              width={40}
              height={40}
              decoding="async"
              fetchPriority="low"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;