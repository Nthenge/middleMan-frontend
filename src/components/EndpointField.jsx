import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function EndpointField({ label, value }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable, ignore silently
    }
  };

  return (
    <div className="endpoint-field">
      <span className="endpoint-label">{label}</span>
      <span className="endpoint-value mono">{value}</span>
      <button
        type="button"
        className="endpoint-copy"
        onClick={onCopy}
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}
