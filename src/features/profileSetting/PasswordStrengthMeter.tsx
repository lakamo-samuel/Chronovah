function StrengthMeter({ value }: { value: number }) {
  const level = value < 34 ? 'Weak' : value < 68 ? 'Medium' : 'Strong';
  const color =
    value < 34 ? 'bg-red-500' : value < 68 ? 'bg-yellow-500' : 'bg-green-500';
  const textColor =
    value < 34 ? 'text-red-600' : value < 68 ? 'text-yellow-600' : 'text-green-600';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-ui-xs text-muted uppercase">
          Password Strength
        </label>
        <span className={`text-xs font-ui-sm-bold ${textColor}`}>
          {level} ({value})
        </span>
      </div>
      <div className="h-2 w-full bg-default rounded-full overflow-hidden">
        <div
          style={{ width: `${value}%` }}
          className={`h-2 rounded-full transition-all duration-300 ${color}`}
        />
      </div>
    </div>
  );
}

export default StrengthMeter;