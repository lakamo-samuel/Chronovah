export default function ProgressInput({
  min = 0,
  max = 100,
  value,
  onChange,
}: {
  min?: number;
  max?: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-3 rounded-2xl w-full appearance-none bg-gray-200 dark:bg-gray-700 accent-blue-500 cursor-pointer"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      role="meter"
    />
  );
}
