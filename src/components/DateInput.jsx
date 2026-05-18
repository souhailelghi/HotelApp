export default function DateInput({ label, id, value, onChange, icon: Icon, required, min }) {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        {label}
      </label>
      <input
        type="date"
        id={id}
        value={value}
        onChange={onChange}
        min={min}
        required={required}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
      />
    </div>
  );
}
