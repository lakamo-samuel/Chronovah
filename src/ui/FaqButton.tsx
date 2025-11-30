import { CircleQuestionMark } from "lucide-react";

function FaqButton() {
  return (
    <div className="fixed bottom-5 w-15 h-15 text-center rounded-full right-5 z-50 bg-blue-600 hover:bg-blue-700 text-white  flex items-center justify-center shadow-lg transition-colors">
      <button><CircleQuestionMark/></button>
    </div>
  );
}

export default FaqButton;