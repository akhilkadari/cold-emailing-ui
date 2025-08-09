import { useState } from "react";
import { emailService } from "../services/emailService";

/**
 * Emails hook - manages email generation state and operations
 */
export const useEmails = (session) => {
  const [emails, setEmails] = useState([]);
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState();

  const generateEmails = async (leads, resumeUrl) => {
    setGenLoading(true);
    setGenError(undefined);

    try {
      const data = await emailService.generateEmails(
        leads,
        session?.user?.email,
        resumeUrl
      );

      const mappedEmails = emailService.transformEmailResponse(data);
      setEmails(mappedEmails);
    } catch (err) {
      setGenError(err.message || "Failed to generate emails.");
    } finally {
      setGenLoading(false);
    }
  };

  const updateEmail = (idx, updated) => {
    setEmails((emails) => emails.map((e, i) => (i === idx ? updated : e)));
  };

  const discardEmail = (idx) => {
    setEmails((emails) =>
      emails.map((e, i) => (i === idx ? { ...e, discarded: !e.discarded } : e))
    );
  };

  const resetEmails = () => {
    setEmails([]);
    setGenError(undefined);
  };

  return {
    emails,
    genLoading,
    genError,
    generateEmails,
    updateEmail,
    discardEmail,
    resetEmails,
  };
};
