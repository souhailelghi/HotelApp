import { CalendarX2 } from 'lucide-react';

export default function EmptyState({ title = "No Results Found", message = "We couldn't find what you were looking for." }) {
  return (
    <div className="flex flex-col items-center justify-center p-16 w-full bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="bg-gray-100 p-4 rounded-full mb-6">
        <CalendarX2 className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2 font-serif">{title}</h3>
      <p className="text-gray-500 text-center max-w-md">{message}</p>
    </div>
  );
}
