import React, { useState } from "react";
import "./EmailPreviewCard.css";

const EmailPreviewCard = ({ email, onChange, onDiscard }) => {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(email);

  const handleSave = () => {
    onChange(local);
    setEditing(false);
  };

  return (
    <div className={`email-preview-card${email.discarded ? " discarded" : ""}`}>
      <div className="email-header">
        <span className="recipient">
          To: {email.email}{" "}
          {email.firstname && `(${email.firstname} ${email.lastname || ""})`}
        </span>
        <label>
          <input
            type="checkbox"
            checked={!!email.discarded}
            onChange={onDiscard}
          />{" "}
          Discard
        </label>
      </div>
      <div className="email-fields">
        <label>
          Subject:
          <input
            type="text"
            value={editing ? local.subject : email.subject}
            onChange={(e) => setLocal({ ...local, subject: e.target.value })}
            disabled={!editing}
          />
        </label>
        <label>
          Body:
          <textarea
            rows={6}
            value={editing ? local.body : email.body}
            onChange={(e) => setLocal({ ...local, body: e.target.value })}
            disabled={!editing}
          />
        </label>
        {email.linkedinHighlights && (
          <div className="linkedin-highlights">
            <strong>LinkedIn:</strong>
            <div>Company: {email.linkedinHighlights.company || "-"}</div>
            <div>Job Title: {email.linkedinHighlights.job_title || "-"}</div>
          </div>
        )}
      </div>
      <div className="email-actions">
        {editing ? (
          <>
            <button onClick={handleSave}>Save</button>
            <button
              onClick={() => {
                setEditing(false);
                setLocal(email);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setEditing(true)} disabled={!!email.discarded}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default EmailPreviewCard;
