interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const getStrength = (pass: string) => {
    if (!pass) return 0;
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength;
  };

  const strength = getStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  if (!password) return null;

  return (
    <div className="space-y-2">
      <div className="flex space-x-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${
              i <= strength ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Strength: {strengthLabels[strength]}
      </p>
    </div>
  );
}