import { LogoutButton } from "./auth/logout-button";

export const SideBar = () => {
  return (
    <nav className="w-60 maxlg:hidden bg-blue-600 p-3">
      <div className="flex flex-col h-full justify-end">
        <LogoutButton />
      </div>
    </nav>
  );
};
