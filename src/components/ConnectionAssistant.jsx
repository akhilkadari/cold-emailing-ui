import Header from "./Header";
import Footer from "./Footer";
import { useState } from "react";
import "./ConnectionAssistant.css";
import { useConnections } from "../hooks/useConnections";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import ProspectPreviewSection from "./ProspectPreviewSection";

export default function ChatAssistant() {
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const {
    connections,
    setConnections,
    prospects,
    deleteConnection,
    saveConnections,
    error,
    genLoading,
    genError,
    generateConnections: generateConnectionsFromHook,
    updateProspect,
    discardProspect,
  } = useConnections(auth.session);

  useEffect(() => {
    if (connections.length === 0) {
      setConnections([
        {
          numberOfEmployees: 5,
          companyName: "",
          school: "",
          jobTitle: "",
        },
      ]);
    }
  }, [connections, setConnections]);

  const handleChange = (idx, field, value) => {
    const updated = connections.map((connection, i) =>
      i === idx ? { ...connection, [field]: value } : connection
    );
    setConnections(updated);
  };

  const addRow = () => {
    const newConnection = {
      numberOfEmployees: 5,
      companyName: "",
      school: "",
      jobTitle: "",
    };
    setConnections([...connections, newConnection]);
  };

  const removeRow = async (idx) => {
    const connectionToRemove = connections[idx];

    if (connections.length === 1) {
      if (connectionToRemove.id) {
        await deleteConnection(connectionToRemove.id);
      }

      setConnections([
        {
          numberOfEmployees: 5,
          companyName: "",
          school: "",
          jobTitle: "",
        },
      ]);
    } else {
      if (connectionToRemove.id) {
        await deleteConnection(connectionToRemove.id);
      }
      const updatedConnections = connections.filter((_, i) => i !== idx);
      setConnections(updatedConnections);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveConnections();
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateConnections = async () => {
    await generateConnectionsFromHook(connections);
  };

  return (
    <div className="connection-assistant">
      <Header />

      <section className="connection-card">
        <div className="connection-card__header">
          <h2>Prospect Research Request</h2>
          <div className="connection-card__actions">
            <button className="btn" onClick={addRow} disabled={loading}>
              + Add Row
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <div className="table-wrapper">
          <table className="connection-table">
            <colgroup>
              <col style={{ width: "20%" }} />
              <col style={{ width: "30%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>Employees</th>
                <th>Company</th>
                <th>School</th>
                <th>Job Title</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {connections.map((connection, idx) => (
                <tr key={connection.id || `temp-${idx}`}>
                  <td>
                    <input
                      type="number"
                      name="numberOfEmployees"
                      min={1}
                      step={1}
                      placeholder="5"
                      value={connection.numberOfEmployees}
                      onChange={(e) =>
                        handleChange(
                          idx,
                          "numberOfEmployees",
                          Number(e.target.value) || 0
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="e.g., Meta, Amazon"
                      value={connection.companyName}
                      onChange={(e) =>
                        handleChange(idx, "companyName", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="e.g., Michigan State University"
                      value={connection.school}
                      onChange={(e) =>
                        handleChange(idx, "school", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="e.g., Senior Software Engineer"
                      value={connection.jobTitle}
                      onChange={(e) =>
                        handleChange(idx, "jobTitle", e.target.value)
                      }
                    />
                  </td>
                  <td className="actions-col">
                    <button
                      className="btn btn-danger"
                      onClick={() => removeRow(idx)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="generate-btn-wrapper">
            <button
              className="generate-btn"
              onClick={handleGenerateConnections}
              disabled={genLoading}
            >
              {genLoading ? "Generating..." : "Generate Prospects"}
            </button>
            {genError && <div className="error-msg">{genError}</div>}
          </div>
        </div>
      </section>

      {/* Prospect Preview Section */}
      {prospects.length > 0 && (
        <ProspectPreviewSection
          prospects={prospects}
          onUpdate={updateProspect}
          onDiscard={discardProspect}
        />
      )}

      <Footer />
    </div>
  );
}
