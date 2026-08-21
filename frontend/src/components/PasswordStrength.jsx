function PasswordStrength({ passwordStrength }) {
  if (!passwordStrength) return null;

  const filledCircles = Math.min(
    Math.ceil((passwordStrength.score + 1) * 1.6),
    8,
  );

  return (
    <div className="mt-2 flex items-center justify-between">
      <div className="flex gap-1.5" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full border ${
              index < filledCircles
                ? passwordStrength.score <= 1
                  ? "bg-red-500 border-red-500"
                  : passwordStrength.score === 2
                    ? "bg-yellow-500 border-yellow-500"
                    : "bg-green-500 border-green-500"
                : "bg-transparent border-text-muted/30"
            }`}
          />
        ))}
      </div>

      <span
        className={`text-xs font-medium ${
          passwordStrength.score <= 1
            ? "text-red-500"
            : passwordStrength.score === 2
              ? "text-yellow-500"
              : "text-green-500"
        }`}
      >
        {passwordStrength.score === 0 && "Very weak"}
        {passwordStrength.score === 1 && "Weak"}
        {passwordStrength.score === 2 && "Fair"}
        {passwordStrength.score === 3 && "Strong"}
        {passwordStrength.score === 4 && "Very strong"}
      </span>
    </div>
  );
}

export default PasswordStrength;