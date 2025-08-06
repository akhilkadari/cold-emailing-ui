import { useState } from "react";
import { emailService } from "../services/emailService";

/**
 * Emails hook - manages email generation and sending state and operations
 */
export const useEmails = (session) => {
  const [emails, setEmails] = useState([]);
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState();
  const [sendLoading, setSendLoading] = useState(false);
  const [sendError, setSendError] = useState();
  const [sendSuccess, setSendSuccess] = useState(false);

  const generateEmails = async (leads, resumeUrl) => {
    setGenLoading(true);
    setGenError(undefined);
    setSendSuccess(false);

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

  const sendEmails = async () => {
    setSendLoading(true);
    setSendError(undefined);
    setSendSuccess(false);

    try {
      await emailService.sendEmails(emails, session?.user?.email);
      setSendSuccess(true);
    } catch (err) {
      setSendError(err.message || "Failed to send emails.");
    } finally {
      setSendLoading(false);
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
    setSendError(undefined);
    setSendSuccess(false);
  };

  return {
    emails,
    genLoading,
    genError,
    sendLoading,
    sendError,
    sendSuccess,
    generateEmails,
    sendEmails,
    updateEmail,
    discardEmail,
    resetEmails,
  };
};
