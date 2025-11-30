import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function GoBackLink() {
    const navigate = useNavigate();
  return (
    <button
      className="flex items-center mb-4 gap-2 text-sm text-gray-700 dark:text-gray-300"
      onClick={() => navigate(-1)}
    >
      <ArrowLeft size={16} />
      Back
    </button>
  );
}

export default GoBackLink;