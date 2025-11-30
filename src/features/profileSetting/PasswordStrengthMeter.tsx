function StrengthMeter({ value }: { value: number }) {
  // value: 0-100
  const level = value < 34 ? "Weak" : value < 68 ? "Medium" : "Strong";
  const color =
    value < 34 ? "bg-red-500" : value < 68 ? "bg-yellow-500" : "bg-green-500";

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-200 rounded-full">
        <div
          style={{ width: `${value}%` }}
          className={`h-2 rounded-full ${color}`}
        />
      </div>
      <div className="text-sm mt-1 text-gray-700 dark:text-gray-300">
        Strength: {level} ({value})
      </div>
    </div>
  );
}
export default StrengthMeter;