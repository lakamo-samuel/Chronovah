

const Spinner = () => {
  return (
    <div className="flex dark:bg-gray-900 fixed justify-center items-center h-full w-full">
      <div className="w-5 h-5 md:w-10 md:h-10 border-4 border-t-blue-500 border-b-blue-500 border-l-blue-500 dark:border-r-gray-800 border-r-gray-300 rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
