import React, { useState } from "react";
import "./LeadInputTable.css";

// ============================================================================
// CONSTANTS
// ============================================================================
const defaultTemplates = [
  {
    name: "Short Greeting",
    content: "Hi {{firstname}}, I came across your profile at {{company}}...",
  },
  {
    name: "Warm Intro",
    content: "Hello {{firstname}}, I noticed your work at {{job_title}}...",
  },
  {
    name: "Professional Outreach",
    content: `Hello {{firstName}}, 
    
I hope your week is going well! My name is Akhil Kadari, and I am a sophomore at Michigan State University interested in pursuing a career in Software Engineering/Data Science. I recently came across your profile on LinkedIn and found your work at {{company}} to be very interesting. More specifically, I am interested in your contributions as a {{role}} as I have a background in software development and as a data analyst. 
    
If you are available, I would appreciate the opportunity to talk about your experience in {{company}} and any general advice you may have. My schedule for this week and next is flexible, so I am happy to work around you when scheduling a 10‑15‑minute call. I have also attached my resume for your reference. Thank you in advance for your time. I look forward to speaking with you. 
    
Best regards, 
Akhil Kadari`,
  },
];

const defaultEmailSignatures = [
  {
    name: "Full Signature",
    content:
      "Best regards,\nAkhil Kadari\nMichigan State University\nCollege of Engineering\nLinkedIn | +1 (248) 590-1059",
  },
  { name: "Short Signature", content: "Best, \n Akhil Kadari" },
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
    name: "",
    content: "",
  });

  const [previewState, setPreviewState] = useState({
    isOpen: false,
    type: null, // 'template' or 'signature'
    name: "",
    content: "",
    leadIndex: null,
    isEditing: false,
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
        name: "",
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
   * Handle modal name change
   */
  const handleModalNameChange = (name) => {
    setModalState((prev) => ({ ...prev, name }));
  };

  /**
   * Save custom template/signature
   */
  const saveCustomContent = () => {
    const { type, leadIndex, name, content } = modalState;

    if (!name.trim()) {
      alert("Please enter a name before saving.");
      return;
    }

    if (!content.trim()) {
      alert("Please enter some content before saving.");
      return;
    }

    if (type === "template") {
      const newCustomTemplates = [
        ...customTemplates,
        { name: name.trim(), content },
      ];
      setCustomTemplates(newCustomTemplates);
      handleChange(leadIndex, "template", content);
    } else {
      const newCustomSignatures = [
        ...customSignatures,
        { name: name.trim(), content },
      ];
      setCustomSignatures(newCustomSignatures);
      handleChange(leadIndex, "emailSignature", content);
    }

    // Close modal
    setModalState({
      isOpen: false,
      type: null,
      leadIndex: null,
      name: "",
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
      name: "",
      content: "",
    });
  };

  const closePreview = () => {
    setPreviewState({
      isOpen: false,
      type: null,
      name: "",
      content: "",
      leadIndex: null,
      isEditing: false,
    });
  };

  // ============================================================================
  // ROW OPS
  // ============================================================================
  const addRow = () => {
    const newLead = {
      email: "",
      firstname: "",
      lastname: "",
      linkedin: "",
      template: "", // stores content
      emailSignature: "", // stores content
    };
    setLeads([...leads, newLead]);
  };

  const removeRow = async (idx) => {
    const leadToRemove = leads[idx];

    // If there's only one row, clear it instead of removing
    if (leads.length === 1) {
      // If lead has an ID, delete
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
      if (leadToRemove.id) {
        await deleteLead(leadToRemove.id);
      }
      const updatedLeads = leads.filter((_, i) => i !== idx);
      setLeads(updatedLeads);
    }
  };

  const handleSave = async () => {
    await saveLeads();
  };

  // ============================================================================
  // SELECT OPTIONS
  // ============================================================================
  const hasContent = leads.some(
    (lead) =>
      lead.email ||
      lead.firstname ||
      lead.lastname ||
      lead.linkedin ||
      lead.template ||
      lead.emailSignature
  );

  const normalizeItems = (items, labelPrefix) =>
    items.map((item, idx) =>
      typeof item === "string"
        ? { name: `${labelPrefix} ${idx + 1}`, content: item }
        : item
    );

  const getAllTemplates = () => [
    ...normalizeItems(templates, "Template"),
    ...customTemplates,
  ];

  const getAllSignatures = () => [
    ...normalizeItems(emailSignatures, "Signature"),
    ...customSignatures,
  ];

  const openPreviewForTemplate = (content, rowIndex) => {
    if (!content) return;
    const item = getAllTemplates().find((t) => t.content === content);
    if (item) {
      setPreviewState({
        isOpen: true,
        type: "template",
        name: item.name,
        content: item.content,
        leadIndex: rowIndex,
        isEditing: false,
      });
    }
  };

  const openPreviewForSignature = (content, rowIndex) => {
    if (!content) return;
    const item = getAllSignatures().find((s) => s.content === content);
    if (item) {
      setPreviewState({
        isOpen: true,
        type: "signature",
        name: item.name,
        content: item.content,
        leadIndex: rowIndex,
        isEditing: false,
      });
    }
  };

  const startEditingPreview = () => {
    setPreviewState((prev) => ({ ...prev, isEditing: true }));
  };
  const cancelEditingPreview = () => {
    setPreviewState((prev) => ({ ...prev, isEditing: false }));
  };
  const applyPreviewEdits = () => {
    const field =
      previewState.type === "template" ? "template" : "emailSignature";
    if (previewState.leadIndex != null) {
      handleChange(previewState.leadIndex, field, previewState.content);
    }
    closePreview();
  };
  const handlePreviewContentChange = (value) => {
    setPreviewState((prev) => ({ ...prev, content: value }));
  };

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
                  <option value="" disabled>
                    Select a template...
                  </option>
                  {getAllTemplates().map((tpl, i) => (
                    <option key={i} value={tpl.content}>
                      {tpl.name}
                    </option>
                  ))}
                  <option value="CUSTOM">+ Create Custom Template</option>
                </select>
                {lead.template && (
                  <div>
                    <button
                      onClick={() => openPreviewForTemplate(lead.template, idx)}
                      style={{ marginTop: 6 }}
                    >
                      Preview
                    </button>
                  </div>
                )}
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
                  <option value="" disabled>
                    Select a signature...
                  </option>
                  {getAllSignatures().map((sig, i) => (
                    <option key={i} value={sig.content}>
                      {sig.name}
                    </option>
                  ))}
                  <option value="CUSTOM">+ Create Custom Signature</option>
                </select>
                {lead.emailSignature && (
                  <div>
                    <button
                      onClick={() =>
                        openPreviewForSignature(lead.emailSignature, idx)
                      }
                      style={{ marginTop: 6 }}
                    >
                      Preview
                    </button>
                  </div>
                )}
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
              <input
                value={modalState.name}
                onChange={(e) => handleModalNameChange(e.target.value)}
                placeholder="Enter a short name"
                style={{ marginBottom: 12 }}
              />
              <textarea
                value={modalState.content}
                onChange={(e) => handleModalContentChange(e.target.value)}
                placeholder={
                  modalState.type === "template"
                    ? "Enter your custom email template content here. You can use placeholders like {{firstname}}, {{lastname}}, {{company}}, etc."
                    : "Enter your custom email signature content here."
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

      {previewState.isOpen && (
        <div className="modal-overlay" onClick={closePreview}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {previewState.type === "template"
                  ? "Template Preview"
                  : "Signature Preview"}
                {previewState.name ? `: ${previewState.name}` : ""}
              </h3>
              <button className="modal-close" onClick={closePreview}>
                ×
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: "left" }}>
              {previewState.isEditing ? (
                <textarea
                  value={previewState.content}
                  onChange={(e) => handlePreviewContentChange(e.target.value)}
                  rows={12}
                />
              ) : (
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    textAlign: "left",
                    margin: 0,
                  }}
                >
                  {previewState.content}
                </pre>
              )}
            </div>
            <div className="modal-footer">
              {!previewState.isEditing && (
                <button onClick={startEditingPreview} className="btn-secondary">
                  Edit
                </button>
              )}
              {previewState.isEditing && (
                <>
                  <button
                    onClick={cancelEditingPreview}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button onClick={applyPreviewEdits} className="btn-primary">
                    Apply
                  </button>
                </>
              )}
              {!previewState.isEditing && (
                <button onClick={closePreview} className="btn-primary">
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadInputTable;
