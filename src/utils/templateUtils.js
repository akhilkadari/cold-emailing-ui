/**
 * Template utilities for generating email subjects
 */

// Simple template-to-subject mapping
const templateSubjects = {
  "Hi {{firstname}}, I came across your profile at {{company}}...": "Quick hello from a fellow professional",
  "Hello {{firstname}}, I noticed your work at {{job_title}}...": "Connecting with a fellow professional",
  "Hello {{firstName}}, \n\nI hope your week is going well! My name is Akhil Kadari, and I am a sophomore at Michigan State University interested in pursuing a career in Software Engineering/Data Science. I recently came across your profile on LinkedIn and found your work at {{company}} to be very interesting. More specifically, I am interested in your contributions as a {{role}} as I have a background in software development and as a data analyst. \n\nIf you are available, I would appreciate the opportunity to talk about your experience in {{company}} and any general advice you may have. My schedule for this week and next is flexible, so I am happy to work around you when scheduling a 10‑15‑minute call. I have also attached my resume for your reference. Thank you in advance for your time. I look forward to speaking with you. \n\nBest regards, \nAkhil Kadari": "Interested in learning about your experience",
};

/**
 * Generate a subject line based on the selected template
 * @param {string} templateContent - The template content
 * @returns {string} - The generated subject line
 */
export const generateSubjectFromTemplate = (templateContent) => {
  // Find matching subject for the template content
  const subject = templateSubjects[templateContent];
  
  if (subject) {
    return subject;
  }

  // Fallback subject if no template match found
  return "Connecting with you";
};

/**
 * Replace template placeholders with actual lead data
 * @param {string} templateContent - The template content with placeholders
 * @param {Object} lead - The lead data
 * @returns {string} - The template with placeholders replaced
 */
export const replaceTemplatePlaceholders = (templateContent, lead) => {
  if (!templateContent || !lead) {
    return templateContent;
  }

  let processedContent = templateContent;

  // Replace common placeholders
  if (lead.firstname) {
    processedContent = processedContent.replace(/\{\{firstname\}\}/gi, lead.firstname);
  }
  if (lead.firstName) {
    processedContent = processedContent.replace(/\{\{firstName\}\}/gi, lead.firstName);
  }
  if (lead.lastname) {
    processedContent = processedContent.replace(/\{\{lastname\}\}/gi, lead.lastname);
  }
  if (lead.lastName) {
    processedContent = processedContent.replace(/\{\{lastName\}\}/gi, lead.lastName);
  }
  if (lead.company) {
    processedContent = processedContent.replace(/\{\{company\}\}/gi, lead.company);
  }
  if (lead.job_title) {
    processedContent = processedContent.replace(/\{\{job_title\}\}/gi, lead.job_title);
  }
  if (lead.role) {
    processedContent = processedContent.replace(/\{\{role\}\}/gi, lead.role);
  }

  return processedContent;
};
