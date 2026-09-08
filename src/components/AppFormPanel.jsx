import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AppFormPanel({ open, initial, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [validationUrl, setValidationUrl] = useState("");
  const [confirmationUrl, setConfirmationUrl] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initial?.name || "");
      setValidationUrl(initial?.validationUrl || "");
      setConfirmationUrl(initial?.confirmationUrl || "");
      setError("");
    }
  }, [open, initial]);

  if (!open) return null;

  const isEdit = !!initial;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit({ name, validationUrl, confirmationUrl });
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="panel-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <div>
            <div className="panel-prompt mono">
              {isEdit ? `$ edit ${initial.name}` : "$ register app"}
            </div>
            <h2 className="panel-title">{isEdit ? "Edit app" : "Register a new app"}</h2>
          </div>
          <button type="button" className="panel-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="panel-form">
          <div className="auth-field">
            <label className="field-label" htmlFor="app-name">
              App name
            </label>
            <input
              id="app-name"
              className="field-input"
              placeholder="e.g. My Shop"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label className="field-label" htmlFor="validation-url">
              Your validation URL
            </label>
            <input
              id="validation-url"
              className="field-input"
              placeholder="https://your-backend.com/validate"
              required
              value={validationUrl}
              onChange={(e) => setValidationUrl(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label className="field-label" htmlFor="confirmation-url">
              Your confirmation URL
            </label>
            <input
              id="confirmation-url"
              className="field-input"
              placeholder="https://your-backend.com/confirm"
              required
              value={confirmationUrl}
              onChange={(e) => setConfirmationUrl(e.target.value)}
            />
          </div>

          {error && <div className="field-error">{error}</div>}

          <div className="panel-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Save changes" : "Register app"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
