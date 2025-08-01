import React from "react";
import "./EmailPreviewSection.css";
import EmailPreviewCard from "./EmailPreviewCard";

const EmailPreviewSection = ({ emails, onUpdate, onDiscard }) => {
  if (!emails.length) return null;

  const activeEmails = emails.filter((e) => !e.discarded);
  const discardedEmails = emails.filter((e) => e.discarded);

  const handleSelectAll = () => {
    emails.forEach((email, idx) => {
      if (email.discarded) {
        onDiscard(idx); // Toggle discarded emails back to active (selected)
      }
    });
  };

  const handleDeselectAll = () => {
    emails.forEach((email, idx) => {
      if (!email.discarded) {
        onDiscard(idx); // Toggle active emails to discarded (deselected)
      }
    });
  };

  return (
    <section className="email-preview-section">
      <div className="email-preview-header">
        <h2 className="email-preview-title">Email Previews</h2>
        <div className="email-count-badge">
          {activeEmails.length} of {emails.length} selected
        </div>
      </div>

      <div className="email-preview-list">
        {emails.map((email, idx) => (
          <EmailPreviewCard
            key={idx}
            email={email}
            onChange={(updated) => onUpdate(idx, updated)}
            onDiscard={() => onDiscard(idx)}
          />
        ))}
      </div>

      <div className="preview-actions">
        <button
          className="select-all-btn"
          onClick={handleSelectAll}
          disabled={discardedEmails.length === 0}
        >
          Select All
        </button>
        <button
          className="deselect-all-btn"
          onClick={handleDeselectAll}
          disabled={activeEmails.length === 0}
        >
          Deselect All
        </button>
      </div>
    </section>
  );
};

export default EmailPreviewSection;
