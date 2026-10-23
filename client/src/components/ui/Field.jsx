import clsx from 'clsx';

export function Input({ className, ...props }) {
  return <input className={clsx('field', className)} {...props} />;
}

export function Textarea({ className, ...props }) {
  return <textarea className={clsx('field resize-y', className)} {...props} />;
}

export function Select({ className, ...props }) {
  return <select className={clsx('field', className)} {...props} />;
}
