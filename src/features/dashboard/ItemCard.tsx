function ItemCard({ title, date }: { title: string; date: string }) {
  return (
   <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 p-4 rounded-xl shadow-sm w-full ">
      <p className="font-medium text-gray-900 dark:text-white">{title}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {new Date(date).toLocaleDateString()}
      </p>
    </div>
  );
}

export default ItemCard;
