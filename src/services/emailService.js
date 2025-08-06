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
   * Send emails via n8n workflow
   */
  sendEmails: async (emails, userEmail) => {
    const response = await fetch(
      "https://akhilkadari.app.n8n.cloud/webhook-test/send-email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emails,
          userEmail,
        }),
      }
    );

    if (!response.ok) throw new Error("Failed to send emails");
    return response.json();
  },

  /**
   * Transform n8n response to UI format
   */
  transformEmailResponse: (data) => {
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
    return emailsArray.map((emailData) => {
      return {
        email: emailData.emailId || emailData.recipient_email || "",
        firstname:
          emailData.firstName ||
          emailData.firstname ||
          emailData.first_name ||
          "",
        lastname:
          emailData.lastName || emailData.lastname || emailData.last_name || "",
        subject: emailData.subject || "",
        body: emailData.body || emailData.content || "",
        signature: emailData.signature || "",
        discarded: false,
      };
    });
  },
};
