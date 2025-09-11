import React, { useState } from "react";
import "./LeadInputTable.css";
import { useTemplates } from "../hooks/useTemplates";

// ============================================================================
// LEAD INPUT TABLE COMPONENT
// ============================================================================
const LeadInputTable = ({
  leads,
  setLeads,
  session,
  saveLeads,
  deleteLead,
  loading = false,
}) => {
  // ============================================================================
  // HOOKS AND STATE
  // ============================================================================
  const {
    templates,
    signatures,
    createTemplate,
    createSignature,
    deleteTemplate,
    deleteSignature,
    loading: templatesLoading,
    error: templatesError,
  } = useTemplates(session);

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
    item: null, // Store the full template/signature item
  });

  const [deleteConfirmState, setDeleteConfirmState] = useState({
    isOpen: false,
    type: null, // 'template' or 'signature'
    item: null,
    name: "",
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
      // Find the selected template/signature to get its ID
      const items = field === "template" ? templates : signatures;
      const selectedItem = items.find((item) => item.content === value);

      if (selectedItem && selectedItem.id) {
        // Store both ID and content for database-backed items
        handleChange(
          idx,
          field === "template" ? "template_id" : "signature_id",
          selectedItem.id
        );
        handleChange(idx, field, value);
      } else {
        // For non-database items, just store content
        handleChange(idx, field, value);
      }
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
   * Save custom template/signature to database
   */
  const saveCustomContent = async () => {
    const { type, leadIndex, name, content } = modalState;

    if (!name.trim()) {
      alert("Please enter a name before saving.");
      return;
    }

    if (!content.trim()) {
      alert("Please enter some content before saving.");
      return;
    }

    try {
      if (type === "template") {
        const newTemplate = await createTemplate({
          name: name.trim(),
          content,
        });
        // Update the lead to use the new template ID and content
        handleChange(leadIndex, "template_id", newTemplate.id);
        handleChange(leadIndex, "template", content);
      } else {
        const newSignature = await createSignature({
          name: name.trim(),
          content,
        });
        // Update the lead to use the new signature ID and content
        handleChange(leadIndex, "signature_id", newSignature.id);
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
    } catch (err) {
      console.error("Error saving custom content:", err);
      alert(`Failed to save custom ${type}. Please try again.`);
    }
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
      item: null,
    });
  };

  // ============================================================================
  // ROW OPERATIONS
  // ============================================================================
  const addRow = () => {
    const newLead = {
      email: "",
      firstname: "",
      lastname: "",
      linkedin: "",
      template: "", // stores content
      emailSignature: "", // stores content
      template_id: null, // stores database ID
      signature_id: null, // stores database ID
    };
    setLeads([...leads, newLead]);
  };

  const removeRow = async (idx) => {
    const leadToRemove = leads[idx];

    // If there's only one row, clear it instead of removing
    if (leads.length === 1) {
      // If lead has an ID, delete from database
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
          template_id: null,
          signature_id: null,
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
  // TEMPLATE/SIGNATURE HELPERS
  // ============================================================================
  const getAllTemplates = () => templates;
  const getAllSignatures = () => signatures;

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
        item: item,
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
        item: item,
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

  /**
   * Handle delete confirmation
   */
  const handleDeleteRequest = (item, type) => {
    // Only allow deletion of user-created templates/signatures (those with IDs)
    if (!item.id) {
      alert("Default templates and signatures cannot be deleted.");
      return;
    }

    setDeleteConfirmState({
      isOpen: true,
      type,
      item,
      name: item.name,
    });
  };

  const handleDeleteConfirm = async () => {
    const { type, item } = deleteConfirmState;

    try {
      if (type === "template") {
        await deleteTemplate(item.id);
        // Clear any leads that were using this template
        const updatedLeads = leads.map((lead) =>
          lead.template_id === item.id
            ? { ...lead, template: "", template_id: null }
            : lead
        );
        setLeads(updatedLeads);
      } else {
        await deleteSignature(item.id);
        // Clear any leads that were using this signature
        const updatedLeads = leads.map((lead) =>
          lead.signature_id === item.id
            ? { ...lead, emailSignature: "", signature_id: null }
            : lead
        );
        setLeads(updatedLeads);
      }

      // Close modals
      setDeleteConfirmState({
        isOpen: false,
        type: null,
        item: null,
        name: "",
      });
      closePreview();
    } catch (err) {
      console.error("Error deleting:", err);
      alert(`Failed to delete ${type}. Please try again.`);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmState({ isOpen: false, type: null, item: null, name: "" });
  };

  // ============================================================================
  // RENDER HELPERS
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

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="lead-input-table">
      {/* Error displays */}
      {templatesError && (
        <div
          className="error-message"
          style={{
            marginBottom: "1rem",
            padding: "0.5rem",
            backgroundColor: "#fee",
            color: "#c00",
            borderRadius: "4px",
          }}
        >
          Template Error: {templatesError}
        </div>
      )}

      {/* Table controls */}
      <div className="table-controls">
        <button onClick={addRow} disabled={loading || templatesLoading}>
          Add Row
        </button>
      </div>

      {/* Loading indicators */}
      {loading && <div className="loading-indicator">Loading leads...</div>}
      {templatesLoading && (
        <div className="loading-indicator">Loading templates...</div>
      )}

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
                  value={lead.email || ""}
                  onChange={(e) => handleChange(idx, "email", e.target.value)}
                  disabled={loading || templatesLoading}
                />
              </td>

              {/* First name field */}
              <td>
                <input
                  value={lead.firstname || ""}
                  onChange={(e) =>
                    handleChange(idx, "firstname", e.target.value)
                  }
                  disabled={loading || templatesLoading}
                />
              </td>

              {/* Last name field */}
              <td>
                <input
                  value={lead.lastname || ""}
                  onChange={(e) =>
                    handleChange(idx, "lastname", e.target.value)
                  }
                  disabled={loading || templatesLoading}
                />
              </td>

              {/* LinkedIn field */}
              <td>
                <input
                  value={lead.linkedin || ""}
                  onChange={(e) =>
                    handleChange(idx, "linkedin", e.target.value)
                  }
                  disabled={loading || templatesLoading}
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
                  disabled={loading || templatesLoading}
                >
                  <option value="" disabled>
                    Select a template...
                  </option>
                  {getAllTemplates().map((tpl, i) => (
                    <option key={tpl.id || i} value={tpl.content}>
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
                      disabled={loading || templatesLoading}
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
                  disabled={loading || templatesLoading}
                >
                  <option value="" disabled>
                    Select a signature...
                  </option>
                  {getAllSignatures().map((sig, i) => (
                    <option key={sig.id || i} value={sig.content}>
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
                      disabled={loading || templatesLoading}
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
                  disabled={loading || templatesLoading}
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
          disabled={loading || templatesLoading || !hasContent}
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
                style={{ marginBottom: 12, width: "100%" }}
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
                style={{ width: "100%" }}
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
              <button
                onClick={saveCustomContent}
                className="btn-primary"
                disabled={templatesLoading}
              >
                {templatesLoading
                  ? "Saving..."
                  : `Save ${
                      modalState.type === "template" ? "Template" : "Signature"
                    }`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
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
                  style={{ width: "100%" }}
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
              {!previewState.isEditing && previewState.item?.id && (
                <button
                  onClick={() =>
                    handleDeleteRequest(previewState.item, previewState.type)
                  }
                  className="btn-danger"
                  style={{
                    marginRight: "auto",
                    backgroundColor: "#dc3545",
                    color: "white",
                  }}
                >
                  Delete
                </button>
              )}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmState.isOpen && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                Delete{" "}
                {deleteConfirmState.type === "template"
                  ? "Template"
                  : "Signature"}
              </h3>
              <button className="modal-close" onClick={handleDeleteCancel}>
                ×
              </button>
            </div>
            <div
              className="modal-body"
              style={{ textAlign: "center", padding: "2rem" }}
            >
              <p>
                Are you sure you want to delete "{deleteConfirmState.name}"?
              </p>
              <p
                style={{ color: "#666", fontSize: "0.9rem", marginTop: "1rem" }}
              >
                This action cannot be undone. Any leads using this{" "}
                {deleteConfirmState.type} will have it cleared.
              </p>
            </div>
            <div className="modal-footer">
              <button onClick={handleDeleteCancel} className="btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="btn-danger"
                style={{ backgroundColor: "#dc3545", color: "white" }}
                disabled={templatesLoading}
              >
                {templatesLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadInputTable;
