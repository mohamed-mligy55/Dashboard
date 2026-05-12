import { createContext, useCallback, useContext, useState } from "react";

const SidebarDrawerContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components -- hook paired with Provider
export const useSidebarDrawer = () => {
  const ctx = useContext(SidebarDrawerContext);
  if (!ctx) {
    throw new Error("useSidebarDrawer must be used within SidebarDrawerProvider");
  }
  return ctx;
};

export const SidebarDrawerProvider = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const openMobileSidebar = useCallback(() => setMobileOpen(true), []);
  const closeMobileSidebar = useCallback(() => setMobileOpen(false), []);
  const toggleMobileSidebar = useCallback(
    () => setMobileOpen((o) => !o),
    [],
  );

  return (
    <SidebarDrawerContext.Provider
      value={{
        mobileOpen,
        openMobileSidebar,
        closeMobileSidebar,
        toggleMobileSidebar,
      }}
    >
      {children}
    </SidebarDrawerContext.Provider>
  );
};
