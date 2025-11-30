import { Quote, User } from "lucide-react";
import Button from "../../ui/Button";

import { useDetailsSettings } from "../../services/SettingApiCall";

function PersonalInfo() {
    const {name,setName,favQuote,setFavQuote,isLoading,handlePersonalInfoSubmit} = useDetailsSettings()


  return (
    <div className="p-6 bg-white dark:bg-[#0B1120] mb-4 rounded-2xl shadow space-y-4">
      <h2 className="font-semibold text-lg mb-4 dark:text-gray-100">
        Personal Information
      </h2>

      {/* Name */}
      <div>
        <label className="block mb-1 text-sm font-medium dark:text-gray-100">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-3 bg-gray-50 py-3  dark:text-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter full name"
          />
        </div>
      </div>

      {/* fav qoute */}
      <div>
        <label className="block mb-1 text-sm font-medium dark:text-gray-100">
          Favourite Quote
        </label>
        <div className="relative">
          <Quote className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            value={`"${favQuote}"`}
            onChange={(e) => setFavQuote(e.target.value)}
            className="w-full pl-10 pr-3 bg-gray-50 py-3  dark:text-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Favourite quote"
          />
        </div>
      </div>
      <Button onClick={handlePersonalInfoSubmit} loading={isLoading}>
        {isLoading ? (
          <>
            {/* <SpinnerIcon className="mr-2" /> */}
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </div>
  );
}

export default PersonalInfo;