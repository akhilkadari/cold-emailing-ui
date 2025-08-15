import React, { useState } from "react";
import "./ProspectPreviewCard.css";

const ProspectPreviewCard = ({ prospect, onChange, onDiscard }) => {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState(prospect);

  const handleSave = () => {
    onChange(local);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setLocal(prospect);
  };

  return (
    <div
      className={`prospect-preview-card${
        prospect.discarded ? " discarded" : ""
      }`}
    >
      <div className="prospect-header">
        <div className="prospect-info">
          <div className="prospect-name">
            {prospect.firstName} {prospect.lastName}
          </div>
          {prospect.profileUrl && (
            <a
              href={prospect.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="prospect-profile-link"
            >
              View Profile
            </a>
          )}
        </div>
        <label className="discard-toggle">
          <input
            type="checkbox"
            checked={!!prospect.discarded}
            onChange={onDiscard}
          />
          <span className="discard-label">Discard</span>
        </label>
      </div>

      <div className="prospect-fields">
        <div className="field-group">
          <label className="field-label">First Name</label>
          <input
            type="text"
            value={editing ? local.firstName : prospect.firstName}
            onChange={(e) => setLocal({ ...local, firstName: e.target.value })}
            disabled={!editing}
            placeholder="First name..."
          />
        </div>

        <div className="field-group">
          <label className="field-label">Last Name</label>
          <input
            type="text"
            value={editing ? local.lastName : prospect.lastName}
            onChange={(e) => setLocal({ ...local, lastName: e.target.value })}
            disabled={!editing}
            placeholder="Last name..."
          />
        </div>

        <div className="field-group">
          <label className="field-label">Profile URL</label>
          <input
            type="url"
            value={editing ? local.profileUrl : prospect.profileUrl}
            onChange={(e) => setLocal({ ...local, profileUrl: e.target.value })}
            disabled={!editing}
            placeholder="https://linkedin.com/in/..."
          />
        </div>
      </div>

      <div className="prospect-actions">
        {editing ? (
          <>
            <button onClick={handleSave}>Save Changes</button>
            <button onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            disabled={!!prospect.discarded}
          >
            Edit Prospect
          </button>
        )}
      </div>
    </div>
  );
};

export default ProspectPreviewCard;
