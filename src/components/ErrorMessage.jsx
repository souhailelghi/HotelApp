import { AlertCircle } from 'lucide-react';

export default function ErrorMessage({ message = "An error occurred. Please try again." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 w-full bg-red-50 rounded-xl border border-red-100">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <p className="text-red-700 font-medium text-lg text-center max-w-md">{message}</p>
    </div>
  );
}
