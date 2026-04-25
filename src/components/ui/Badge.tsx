interface BadgeProps {
  label: string;
  variant?: 'default' | 'red' | 'blue' | 'purple' | 'green';
}

const variantClasses = {
  default: 'bg-gray-700 text-gray-200',
  red: 'bg-red-900 text-red-200',
  blue: 'bg-blue-900 text-blue-200',
  purple: 'bg-purple-900 text-purple-200',
  green: 'bg-green-900 text-green-200',
};

export function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}`}>
      {label}
    </span>
  );
}
