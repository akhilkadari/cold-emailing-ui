import React from "react";
import "./EmailPreviewSection.css";
import EmailPreviewCard from "./EmailPreviewCard";

const EmailPreviewSection = ({ emails, onUpdate, onDiscard }) => {
  if (!emails.length) return null;
  return (
    <section className="email-preview-section">
      <h2>Email Previews</h2>
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
    </section>
  );
};

export default EmailPreviewSection;
