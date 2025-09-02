interface InputFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export default function InputField({
  label,
  name,
  type,
  value,
  error,
  onChange,
  required = false
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}