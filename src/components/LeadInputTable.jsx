import React, { useState } from "react";
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
Akhil Kadari`,
];

const defaultEmailSignatures = [
  "Best regards,\nAkhil Kadari\nMichigan State University\nCollege of Engineering\nLinkedIn | +1 (248) 590-1059",
  "Best, \n Akhil Kadari",
];

// ============================================================================
// LEAD INPUT TABLE COMPONENT
// ============================================================================
const LeadInputTable = ({
  leads,
  setLeads,
  templates = defaultTemplates,
  emailSignatures = defaultEmailSignatures,
  saveLeads,
  deleteLead,
  loading = false,
}) => {
  // ============================================================================
  // STATE
  // ============================================================================
  const [customTemplates, setCustomTemplates] = useState([]);
  const [customSignatures, setCustomSignatures] = useState([]);
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null, // 'template' or 'signature'
    leadIndex: null,
    content: "",
  });

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
   * Handle template/signature selection
   */
  const handleTemplateOrSignatureChange = (idx, field, value) => {
    if (value === "CUSTOM") {
      // Open modal for custom input
      setModalState({
        isOpen: true,
        type: field === "template" ? "template" : "signature",
        leadIndex: idx,
        content: "",
      });
    } else {
      handleChange(idx, field, value);
    }
  };

  /**
   * Handle modal content change
   */
  const handleModalContentChange = (content) => {
    setModalState((prev) => ({ ...prev, content }));
  };

  /**
   * Save custom template/signature
   */
  const saveCustomContent = () => {
    const { type, leadIndex, content } = modalState;

    if (!content.trim()) {
      alert("Please enter some content before saving.");
      return;
    }

    if (type === "template") {
      const newCustomTemplates = [...customTemplates, content];
      setCustomTemplates(newCustomTemplates);
      handleChange(leadIndex, "template", content);
    } else {
      const newCustomSignatures = [...customSignatures, content];
      setCustomSignatures(newCustomSignatures);
      handleChange(leadIndex, "emailSignature", content);
    }

    // Close modal
    setModalState({
      isOpen: false,
      type: null,
      leadIndex: null,
      content: "",
    });
  };

  /**
   * Close modal without saving
   */
  const closeModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      leadIndex: null,
      content: "",
    });
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
      emailSignature: "",
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
          emailSignature: "",
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
   * Handle Resume file upload (placeholder)
   */
  const handleFileUpload = (e) => {
    alert("Resume import not implemented yet.");
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
      lead.template ||
      lead.emailSignature
  );

  /**
   * Get all available templates (default + custom)
   */
  const getAllTemplates = () => [...templates, ...customTemplates];

  /**
   * Get all available signatures (default + custom)
   */
  const getAllSignatures = () => [...emailSignatures, ...customSignatures];

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
            id="resume-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={loading}
          />
          <label htmlFor="resume-upload" className="file-upload-label">
            Add Resume File
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
            <th>Template *</th>
            <th>Signature *</th>
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
                  required
                  value={lead.template || ""}
                  onChange={(e) =>
                    handleTemplateOrSignatureChange(
                      idx,
                      "template",
                      e.target.value
                    )
                  }
                  disabled={loading}
                >
                  <option value="">Select a template...</option>
                  {getAllTemplates().map((tpl, i) => (
                    <option key={i} value={tpl}>
                      {tpl.slice(0, 50)}...
                    </option>
                  ))}
                  <option value="CUSTOM">+ Create Custom Template</option>
                </select>
              </td>

              {/* Email signature selection */}
              <td className="signature-column">
                <select
                  required
                  value={lead.emailSignature || ""}
                  onChange={(e) =>
                    handleTemplateOrSignatureChange(
                      idx,
                      "emailSignature",
                      e.target.value
                    )
                  }
                  disabled={loading}
                >
                  <option value="">Select a signature...</option>
                  {getAllSignatures().map((sig, i) => (
                    <option key={i} value={sig}>
                      {sig.slice(0, 50)}...
                    </option>
                  ))}
                  <option value="CUSTOM">+ Create Custom Signature</option>
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

      {/* Custom Content Modal */}
      {modalState.isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                Create Custom{" "}
                {modalState.type === "template"
                  ? "Email Template"
                  : "Email Signature"}
              </h3>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <textarea
                value={modalState.content}
                onChange={(e) => handleModalContentChange(e.target.value)}
                placeholder={
                  modalState.type === "template"
                    ? "Enter your custom email template here. You can use placeholders like {{firstname}}, {{lastname}}, {{company}}, etc."
                    : "Enter your custom email signature here."
                }
                rows={10}
                autoFocus
              />
              {modalState.type === "template" && (
                <div className="template-help">
                  <p>
                    <strong>Available placeholders:</strong>
                  </p>
                  <p>
                    {
                      "{{firstname}}, {{lastname}}, {{company}}, {{role}}, {{job_title}}"
                    }
                  </p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={closeModal} className="btn-secondary">
                Cancel
              </button>
              <button onClick={saveCustomContent} className="btn-primary">
                Save {modalState.type === "template" ? "Template" : "Signature"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadInputTable;
