import React, { useState } from "react";
import "./EmailPreviewCard.css";

const EmailPreviewCard = ({ email, onChange, onDiscard }) => {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(email);

  const handleSave = () => {
    onChange(local);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setLocal(email);
  };

  return (
    <div className={`email-preview-card${email.discarded ? " discarded" : ""}`}>
      <div className="email-header">
        <div className="recipient-info">
          <div className="recipient-email">{email.email}</div>
          {(email.firstname || email.lastname) && (
            <div className="recipient-name">
              {email.firstname} {email.lastname}
            </div>
          )}
        </div>
        <label className="discard-toggle">
          <input
            type="checkbox"
            checked={!!email.discarded}
            onChange={onDiscard}
          />
          <span className="discard-label">Discard</span>
        </label>
      </div>

      <div className="email-fields">
        <div className="field-group">
          <label className="field-label">Subject</label>
          <input
            type="text"
            value={editing ? local.subject : email.subject}
            onChange={(e) => setLocal({ ...local, subject: e.target.value })}
            disabled={!editing}
            placeholder="Email subject..."
          />
        </div>

        <div className="field-group">
          <label className="field-label">Email Body</label>
          <textarea
            rows={6}
            value={editing ? local.body : email.body}
            onChange={(e) => setLocal({ ...local, body: e.target.value })}
            disabled={!editing}
            placeholder="Email content..."
          />
        </div>

        {email.linkedinHighlights && (
          <div className="linkedin-highlights">
            <div className="linkedin-title">LinkedIn Profile Data</div>
            <div className="linkedin-info">
              <div>
                <strong>Company:</strong>{" "}
                {email.linkedinHighlights.company || "Not specified"}
              </div>
              <div>
                <strong>Job Title:</strong>{" "}
                {email.linkedinHighlights.job_title || "Not specified"}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="email-actions">
        {editing ? (
          <>
            <button onClick={handleSave}>Save Changes</button>
            <button onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setEditing(true)} disabled={!!email.discarded}>
            Edit Email
          </button>
        )}
      </div>
    </div>
  );
};

export default EmailPreviewCard;
