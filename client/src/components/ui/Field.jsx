export function Input(props) {
  return <input className="field" {...props} />;
}

export function Textarea(props) {
  return <textarea className="field min-h-[140px] resize-y" {...props} />;
}

export function Select(props) {
  return <select className="field" {...props} />;
}