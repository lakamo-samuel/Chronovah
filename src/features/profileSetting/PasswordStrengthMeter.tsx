/**
 * Render a password strength meter with a color-coded level label and progress bar.
 *
 * Displays the computed level ("Weak", "Medium", "Strong") with the numeric `value` and a horizontal bar filled to `value` percent. Strength thresholds: `<34` => "Weak", `34–67` => "Medium", `>=68` => "Strong"; colors update to match the level.
 *
 * @param value - Strength percentage (expected 0–100) used to determine the level and fill width.
 * @returns The JSX element containing the labeled strength status and progress bar.
 */
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