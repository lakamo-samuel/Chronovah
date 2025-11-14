import React from "react";

interface ItemProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  isActive: boolean;
  onClick: () => void;
}

const GlobalSearchItem: React.FC<ItemProps> = ({ item, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-xl cursor-pointer border dark:border-white/10
      ${isActive ? "bg-white/20 dark:bg-white/10" : "hover:bg-white/10"}
      transition`}
    >
      <p className="text-xs text-gray-400 mb-1">{item.type}</p>

      <p
        className="text-sm font-medium"
        dangerouslySetInnerHTML={{ __html: item.highlighted }}
      />
    </div>
  );
};

export default GlobalSearchItem;
