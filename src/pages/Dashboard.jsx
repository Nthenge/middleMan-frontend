import { useState, useEffect, useCallback } from "react";
import { Plus, LogOut, Radio } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import AppRow from "../components/AppRow";
import AppFormPanel from "../components/AppFormPanel";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { email, logout } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  const fetchApps = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.listApps();
      setApps(data || []);
    } catch (err) {
      setError(err.message || "Could not load apps");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const openCreate = () => {
    setEditingApp(null);
    setPanelOpen(true);
  };

  const openEdit = (app) => {
    setEditingApp(app);
    setPanelOpen(true);
  };

  const closePanel = () => setPanelOpen(false);

  const handleSubmit = async (values) => {
    if (editingApp) {
      const updated = await api.updateApp(editingApp.id, values);
      setApps((prev) => prev.map((a) => (a.id === editingApp.id ? updated : a)));
    } else {
      const created = await api.createApp(values);
      setApps((prev) => [...prev, created]);
    }
    setPanelOpen(false);
  };

  const handleDelete = async (id) => {
    const prev = apps;
    setApps((cur) => cur.filter((a) => a.id !== id));
    try {
      await api.deleteApp(id);
    } catch (err) {
      setApps(prev);
      setError(err.message || "Delete failed");
    }
  };

  return (
    <div className="dash-screen">
      <header className="dash-header">
        <div className="dash-brand">
          <Radio size={16} className="dash-brand-icon" />
          <span>Middleman</span>
        </div>
        <div className="dash-account">
          <span className="dash-account-email mono">{email}</span>
          <button type="button" className="btn btn-ghost dash-logout" onClick={logout}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </header>

      <main className="dash-main">
        <div className="dash-titlebar">
          <div>
            <div className="dash-eyebrow mono">$ ls apps</div>
            <h1 className="dash-title">Your apps</h1>
            <p className="dash-subtitle">
              Each app gets its own validation and confirmation endpoints. Register those
              with Safaricom, and callbacks route straight to your backend.
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} /> Register app
          </button>
        </div>

        {loading && <div className="dash-note mono">Loading apps...</div>}

        {!loading && error && <div className="dash-note dash-note-error mono">{error}</div>}

        {!loading && !error && apps.length === 0 && (
          <div className="dash-empty">
            <div className="dash-empty-prompt mono">$ apps --list</div>
            <p className="dash-empty-text">
              No apps registered yet. Register one to get your validation and
              confirmation URLs.
            </p>
            <button type="button" className="btn btn-primary" onClick={openCreate}>
              <Plus size={16} /> Register your first app
            </button>
          </div>
        )}

        {!loading && !error && apps.length > 0 && (
          <div className="app-list">
            {apps.map((app) => (
              <AppRow key={app.id} app={app} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      <AppFormPanel
        open={panelOpen}
        initial={editingApp}
        onClose={closePanel}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
