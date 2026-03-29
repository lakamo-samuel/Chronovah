import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function GoBackLink() {
  const navigate = useNavigate();
  return (
    <button
      className="flex items-center gap-2 text-sm font-ui-sm-bold text-muted hover:text-primary transition-colors"
      onClick={() => navigate(-1)}
    >
      <ArrowLeft size={16} />
      Back
    </button>
  );
}

export default GoBackLink;