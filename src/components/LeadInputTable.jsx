import React from "react";
import "./LeadInputTable.css";

// ============================================================================
// CONSTANTS
// ============================================================================
const defaultTemplates = [
  "Hi {{firstname}}, I came across your profile at {{company}}...",

  "Hello {{firstname}}, I noticed your work at {{job_title}}...",

  `Hello {{firstName}}, 
  
I hope your week is going well! My name is Akhil Kadari, and I am a sophomore at Michigan State University interested in pursuing a career in Software Engineering/Data Science. I recently came across your profile on LinkedIn and found your work at {{company}} to be very interesting. More specifically, I am interested in your contributions as a {{role}} as I have a background in software development and as a data analyst. 
  
If you are available, I would appreciate the opportunity to talk about your experience in {{company}} and any general advice you may have. My schedule for this week and next is flexible, so I am happy to work around you when scheduling a 10‑15‑minute call. I have also attached my resume for your reference. Thank you in advance for your time. I look forward to speaking with you. 
  
Best regards, 
Akhil Kadari `,
];

// ============================================================================
// LEAD INPUT TABLE COMPONENT
// ============================================================================
const LeadInputTable = ({
  leads,
  setLeads,
  templates = defaultTemplates,
  saveLeads,
  deleteLead,
  loading = false,
}) => {
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  /**
   * Handle changes to lead input fields
   */
  const handleChange = (idx, field, value) => {
    const updated = leads.map((lead, i) =>
      i === idx ? { ...lead, [field]: value } : lead
    );
    setLeads(updated);
  };

  /**
   * Add a new empty lead row
   */
  const addRow = () => {
    const newLead = {
      email: "",
      firstname: "",
      lastname: "",
      linkedin: "",
      template: "", // Default to empty
    };
    setLeads([...leads, newLead]);
  };

  /**
   * Remove a lead row (delete from Supabase if it has an ID)
   * If only one row remains, clear it instead of removing it
   */
  const removeRow = async (idx) => {
    const leadToRemove = leads[idx];

    // If there's only one row, clear it instead of removing
    if (leads.length === 1) {
      // If lead has an ID, delete from Supabase
      if (leadToRemove.id) {
        await deleteLead(leadToRemove.id);
      }

      // Clear the row content but keep the row
      setLeads([
        {
          email: "",
          firstname: "",
          lastname: "",
          linkedin: "",
          template: "",
        },
      ]);
    } else {
      // Multiple rows exist, remove normally

      // If lead has an ID, delete from Supabase
      if (leadToRemove.id) {
        await deleteLead(leadToRemove.id);
      }

      // Remove the lead from local state
      const updatedLeads = leads.filter((_, i) => i !== idx);
      setLeads(updatedLeads);
    }
  };

  /**
   * Save all leads to Supabase
   */
  const handleSave = async () => {
    await saveLeads();
  };

  /**
   * Handle CSV file upload (placeholder)
   */
  const handleFileUpload = (e) => {
    alert("CSV import not implemented yet.");
  };

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================
  /**
   * Check if any lead has content (for save button state)
   */
  const hasContent = leads.some(
    (lead) =>
      lead.email ||
      lead.firstname ||
      lead.lastname ||
      lead.linkedin ||
      lead.template
  );

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="lead-input-table">
      {/* Table controls */}
      <div className="table-controls">
        <button onClick={addRow} disabled={loading}>
          Add Row
        </button>
        <div className="file-upload">
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={loading}
          />
          <label htmlFor="csv-upload" className="file-upload-label">
            Choose CSV File
          </label>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && <div className="loading-indicator">Loading leads...</div>}

      {/* Leads table */}
      <table>
        <thead>
          <tr>
            <th>Email *</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>LinkedIn</th>
            <th>Template</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, idx) => (
            <tr key={lead.id || `temp-${idx}`}>
              {/* Email field */}
              <td>
                <input
                  required
                  type="email"
                  value={lead.email}
                  onChange={(e) => handleChange(idx, "email", e.target.value)}
                  disabled={loading}
                />
              </td>

              {/* First name field */}
              <td>
                <input
                  value={lead.firstname || ""}
                  onChange={(e) =>
                    handleChange(idx, "firstname", e.target.value)
                  }
                  disabled={loading}
                />
              </td>

              {/* Last name field */}
              <td>
                <input
                  value={lead.lastname || ""}
                  onChange={(e) =>
                    handleChange(idx, "lastname", e.target.value)
                  }
                  disabled={loading}
                />
              </td>

              {/* LinkedIn field */}
              <td>
                <input
                  value={lead.linkedin || ""}
                  onChange={(e) =>
                    handleChange(idx, "linkedin", e.target.value)
                  }
                  disabled={loading}
                />
              </td>

              {/* Template selection */}
              <td>
                <select
                  value={lead.template || ""}
                  onChange={(e) =>
                    handleChange(idx, "template", e.target.value)
                  }
                  disabled={loading}
                >
                  <option value="">Select a template...</option>
                  {templates.map((tpl, i) => (
                    <option key={i} value={tpl}>
                      {tpl.slice(0, 30)}...
                    </option>
                  ))}
                </select>
              </td>

              {/* Remove button */}
              <td>
                <button
                  onClick={() => removeRow(idx)}
                  disabled={loading}
                  title={
                    leads.length === 1 ? "Clear this row" : "Remove this row"
                  }
                >
                  {leads.length === 1 ? "Clear" : "Remove"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Save button */}
      <div className="generate-btn-wrapper">
        <button
          className="generate-btn"
          onClick={handleSave}
          disabled={loading || !hasContent}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default LeadInputTable;
