import clsx from 'clsx';

export default function Button({ className, variant = 'primary', ...props }) {
  return <button className={clsx(variant === 'primary' && 'btn-primary', variant === 'secondary' && 'btn-secondary', variant === 'ghost' && 'btn-ghost', className)} {...props} />;
}