import {
  generateSubjectFromTemplate,
  replaceTemplatePlaceholders,
} from "../utils/templateUtils";

/**
 * Email service - handles all n8n API operations
 */
export const emailService = {
  /**
   * Generate emails via n8n workflow
   */
  generateEmails: async (leads, userEmail, resumeUrl) => {
    const response = await fetch(
      "https://akhilkadari.app.n8n.cloud/webhook/generate-emails",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leads,
          userEmail,
          resumeUrl,
        }),
      }
    );

    if (!response.ok) throw new Error("Failed to trigger workflow");
    return response.json();
  },

  /**
   * Transform n8n response to UI format and add template-based subjects
   */
  transformEmailResponse: (data, leads) => {
    // Handle object response format
    let emailsArray;
    if (Array.isArray(data)) {
      // If data is already an array
      emailsArray = data;
    } else if (data && typeof data === "object") {
      // If data is a single object, wrap it in an array
      emailsArray = [data];
    } else {
      throw new Error("Unexpected response format from n8n");
    }

    // Map the n8n response format to your UI format
    return emailsArray.map((emailData, index) => {
      // Find the corresponding lead to get template information
      const lead = leads && leads[index] ? leads[index] : null;

      // Generate subject based on template if available
      let subject = emailData.subject || "";
      if (lead && lead.template && !subject) {
        subject = generateSubjectFromTemplate(lead.template);
      }

      // Use template content for email body if available, otherwise fall back to API response
      let body = emailData.body || emailData.content || "";
      if (lead && lead.template) {
        // Replace placeholders in the template with actual lead data
        body = replaceTemplatePlaceholders(lead.template, lead);
      }

      return {
        email: emailData.emailId || emailData.recipient_email || "",
        firstname:
          emailData.firstName ||
          emailData.firstname ||
          emailData.first_name ||
          "",
        lastname:
          emailData.lastName || emailData.lastname || emailData.last_name || "",
        subject: subject,
        body: body,
        signature: emailData.signature || "",
        discarded: false,
      };
    });
  },
};
