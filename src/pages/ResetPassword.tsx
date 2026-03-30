import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResetPasswordConfirm from '../features/Authentication/ResetPasswordConfirm';

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-default p-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link to="/forgot-password" className="flex items-center gap-2 text-primary hover:text-primary-600 mb-6 transition-colors">
          <ArrowLeft size={18} />
          <span className="text-sm">Back</span>
        </Link>

        {/* Component */}
        <ResetPasswordConfirm />
      </div>
    </div>
  );
}
