import React from "react";
import "./LeadInputTable.css";

const defaultTemplates = [
  "Hi {{firstname}}, I came across your profile at {{company}}...",

  "Hello {{firstname}}, I noticed your work at {{job_title}}...",

  `Hello {{firstName}}, 
  
  I hope your week is going well! My name is Akhil Kadari, and I am a sophomore at Michigan State University interested in pursuing a career in Software Engineering/Data Science. 
  I recently came across your profile on LinkedIn and found your work at {{company}} to be very interesting. More specifically, I am interested in your contributions as a {{role}} as I have a background in software development and as a data analyst. 
  
  If you are available, I would appreciate the opportunity to talk about your experience in {{company}} and any general advice you may have. My schedule for this week and next is flexible, so I am happy to work around you when scheduling a 10‑15‑minute call. 
  I have also attached my resume for your reference. Thank you in advance for your time. I look forward to speaking with you. 
  
  Best regards, Akhil Kadari `,
];

const LeadInputTable = ({
  leads,
  setLeads,
  templates = defaultTemplates,
  handleExport,
}) => {
  const handleChange = (idx, field, value, e) => {
    const updated = leads.map((lead, i) =>
      i === idx ? { ...lead, [field]: value } : lead
    );
    setLeads(updated);
  };

  const addRow = () =>
    setLeads([
      ...leads,
      {
        email: "",
        firstname: "",
        lastname: "",
        linkedin: "",
        template: "", // Default to empty
      },
    ]);
  const removeRow = (idx) => setLeads(leads.filter((_, i) => i !== idx));

  const handleFileUpload = (e) => {
    alert("CSV import not implemented yet.");
  };

  return (
    <div className="lead-input-table">
      <div className="table-controls">
        <button onClick={addRow}>Add Row</button>
        <div className="file-upload">
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
          />
          <label htmlFor="csv-upload" className="file-upload-label">
            Choose CSV File
          </label>
        </div>
      </div>
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
            <tr key={idx}>
              <td>
                <input
                  required
                  type="email"
                  value={lead.email}
                  onChange={(e) => handleChange(idx, "email", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={lead.firstname || ""}
                  onChange={(e) =>
                    handleChange(idx, "firstname", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  value={lead.lastname || ""}
                  onChange={(e) =>
                    handleChange(idx, "lastname", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  value={lead.linkedin || ""}
                  onChange={(e) =>
                    handleChange(idx, "linkedin", e.target.value)
                  }
                />
              </td>
              <td>
                <select
                  value={lead.template || ""}
                  onChange={(e) =>
                    handleChange(idx, "template", e.target.value)
                  }
                >
                  <option value="">Select a template...</option>
                  {templates.map((tpl, i) => (
                    <option key={i} value={tpl}>
                      {tpl.slice(0, 30)}...
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  onClick={() => removeRow(idx)}
                  disabled={leads.length === 1}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="generate-btn-wrapper">
        <button className="generate-btn" onClick={handleExport}>
          Save
        </button>
      </div>
    </div>
  );
};

export default LeadInputTable;
