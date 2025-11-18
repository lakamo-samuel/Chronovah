import { CircleQuestionMark } from "lucide-react";

function FaqButton() {
  return (
    <div className="fixed bottom-5 right-5 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-colors">
      <button><CircleQuestionMark/></button>
    </div>
  );
}

export default FaqButton;