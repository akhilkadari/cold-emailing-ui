import React from "react";
import "./ProspectPreviewSection.css";
import ProspectPreviewCard from "./ProspectPreviewCard";

const ProspectPreviewSection = ({ prospects, onUpdate, onDiscard }) => {
  if (!prospects.length) return null;

  const activeProspects = prospects.filter((p) => !p.discarded);
  const discardedProspects = prospects.filter((p) => p.discarded);

  const handleSelectAll = () => {
    prospects.forEach((prospect, idx) => {
      if (prospect.discarded) {
        onDiscard(idx); // Toggle discarded prospects back to active (selected)
      }
    });
  };

  const handleDeselectAll = () => {
    prospects.forEach((prospect, idx) => {
      if (!prospect.discarded) {
        onDiscard(idx); // Toggle active prospects to discarded (deselected)
      }
    });
  };

  return (
    <section className="prospect-preview-section">
      <div className="prospect-preview-header">
        <h2 className="prospect-preview-title">Generated Prospects</h2>
        <div className="prospect-count-badge">
          {activeProspects.length} of {prospects.length} selected
        </div>
      </div>

      <div className="prospect-preview-list">
        {prospects.map((prospect, idx) => (
          <ProspectPreviewCard
            key={idx}
            prospect={prospect}
            onChange={(updated) => onUpdate(idx, updated)}
            onDiscard={() => onDiscard(idx)}
          />
        ))}
      </div>

      <div className="preview-actions">
        <button
          className="select-all-btn"
          onClick={handleSelectAll}
          disabled={discardedProspects.length === 0}
        >
          Select All
        </button>
        <button
          className="deselect-all-btn"
          onClick={handleDeselectAll}
          disabled={activeProspects.length === 0}
        >
          Deselect All
        </button>
      </div>
    </section>
  );
};

export default ProspectPreviewSection;
