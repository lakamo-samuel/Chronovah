
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
      className="bg-primary text-white py-3 px-3 rounded-lg hover:bg-primary-hover disabled:opacity-50 gap-1 disabled:cursor-not-allowed flex items-center justify-center font-semibold"
    >
      {icon}
      <span>{children}</span>
    
    </Link>
  );
}

export default SettingLinkBtn;
