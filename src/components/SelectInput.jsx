export default function SelectInput({ label, id, value, onChange, options, icon: Icon, required, placeholder }) {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white transition-all"
      >
        <option value="" disabled>{placeholder || 'Select an option'}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
