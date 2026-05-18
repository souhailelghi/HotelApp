import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 w-full">
      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
      <p className="text-gray-600 font-medium text-lg">{message}</p>
    </div>
  );
}
