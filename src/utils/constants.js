/**
 * Application constants
 */
export const defaultLead = {
  email: "",
  firstname: "",
  lastname: "",
  linkedin: "",
  template: "",
  emailSignature: "",
};

/**
 * Helper function to check if a lead has any data
 */
export const hasLeadData = (lead) => {
  return (
    lead.email ||
    lead.firstname ||
    lead.lastname ||
    lead.linkedin ||
    lead.template ||
    lead.emailSignature
  );
};

export const hasConnectionData = (connection) => {
  return (
    connection.numberOfEmployees ||
    connection.companyName ||
    connection.school ||
    connection.jobTitle
  );
};
