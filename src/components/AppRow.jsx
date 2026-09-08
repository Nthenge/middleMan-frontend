import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import EndpointField from "./EndpointField";

export default function AppRow({ app, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false);

  const handleDeleteClick = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    onDelete(app.id);
  };

  return (
    <div className="app-row">
      <div className="app-row-rail" />

      <div className="app-row-main">
        <div className="app-row-head">
          <div>
            <div className="app-row-name">{app.name}</div>
            <div className="app-row-slug mono">registered app</div>
          </div>

          <div className="app-row-actions">
            <button
              type="button"
              className="btn btn-ghost app-row-btn"
              onClick={() => onEdit(app)}
            >
              <Pencil size={13} /> Edit
            </button>
            <button
              type="button"
              className={`btn app-row-btn ${
                confirming ? "btn-danger-active" : "btn-danger-ghost"
              }`}
              onClick={handleDeleteClick}
            >
              <Trash2 size={13} /> {confirming ? "Confirm delete" : "Delete"}
            </button>
          </div>
        </div>

        <div className="app-row-endpoints">
          <EndpointField label="Validation URL →" value={app.yourValidationUrl} />
          <EndpointField label="Confirmation URL →" value={app.yourConfirmationUrl} />
        </div>

        <div className="app-row-targets">
          <span>forwards to</span>
          <span className="mono">{app.validationUrl || "not set"}</span>
          <span>and</span>
          <span className="mono">{app.confirmationUrl || "not set"}</span>
        </div>
      </div>
    </div>
  );
}
