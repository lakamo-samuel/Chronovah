
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Prop {
  to: string;
  children: ReactNode;
  icon?: ReactNode;
}

function SettingLinkBtn({ to, children, icon }: Prop) {
  return (
    <Link
      to={to}
      className="bg-blue-500 dark:text-gray-100 text-white py-3 px-3 rounded-lg hover:bg-blue-500 disabled:opacity-50 gap-1 disabled:cursor-not-allowed flex items-center justify-center font-semibold"
    >
      {icon}
      <span>{children}</span>
    
    </Link>
  );
}

export default SettingLinkBtn;
