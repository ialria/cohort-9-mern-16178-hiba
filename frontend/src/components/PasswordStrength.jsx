function PasswordStrength({ passwordStrength }) {
  if (!passwordStrength) return null;

  const filledCircles = Math.min(
    Math.ceil((passwordStrength.score + 1) * 1.6),
    8,
  );

    let strengthTextClass = "text-green-500";

if (passwordStrength.score <= 1) {
  strengthTextClass = "text-red-500";
} else if (passwordStrength.score === 2) {
  strengthTextClass = "text-yellow-500";
}


  return (
    <div className="mt-2 flex items-center justify-between">
      <div className="flex gap-1.5" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
  let circleClass = "bg-transparent border-text-muted/30";

  if (index < filledCircles) {
    if (passwordStrength.score <= 1) {
      circleClass = "bg-red-500 border-red-500";
    } else if (passwordStrength.score === 2) {
      circleClass = "bg-yellow-500 border-yellow-500";
    } else {
      circleClass = "bg-green-500 border-green-500";
    }
  }

  return (
    <span
      key={index}
      className={`h-2 w-2 rounded-full border ${circleClass}`}
    />
  );
})}
      </div>

   <span className={`text-xs font-medium ${strengthTextClass}`}>
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