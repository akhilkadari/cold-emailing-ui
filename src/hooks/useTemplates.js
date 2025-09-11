import { useState, useEffect } from "react";
import { templateService } from "../services/templateService";
import { signatureService } from "../services/signatureService";

export const useTemplates = (session) => {
  const [templates, setTemplates] = useState([]);
  const [signatures, setSignatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============================================================================
  // CONSTANTS
  // ============================================================================
  const defaultTemplates = [];
  const defaultSignatures = [];

  useEffect(() => {
    if (session?.user?.id) {
      loadTemplatesAndSignatures();
    } else {
      setTemplates(defaultTemplates);
      setSignatures(defaultSignatures);
    }
  }, [session]);

  const loadTemplatesAndSignatures = async () => {
    setLoading(true);
    setError(null);

    try {
      const [userTemplates, userSignatures] = await Promise.all([
        templateService.loadTemplatesByUserId(session.user.id),
        signatureService.loadSignaturesByUserId(session.user.id),
      ]);

      setTemplates([...defaultTemplates, ...userTemplates]);
      setSignatures([...defaultSignatures, ...userSignatures]);
    } catch (err) {
      console.error("Error loading templates/signatures:", err);
      setError(err.message);

      setTemplates(defaultTemplates);
      setSignatures(defaultSignatures);
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (templateData) => {
    if (!session?.user?.id) return null;

    try {
      const newTemplate = await templateService.createTemplate(
        templateData,
        session.user.id
      );
      setTemplates((prev) => [...prev, newTemplate]);
      return newTemplate;
    } catch (err) {
      console.error("Error creating template:", err);
      setError(err.message);
      throw err;
    }
  };

  const updateTemplate = async (templateId, updates) => {
    if (!session?.user?.id) return null;

    try {
      const updatedTemplate = await templateService.updateTemplate(
        templateId,
        updates,
        session.user.id
      );
      return updatedTemplate;
    } catch (err) {
      console.error("Error updating template:", err);
      setError(err.message);
      throw err;
    }
  };

  const deleteTemplate = async (templateId) => {
    if (!session?.user?.id) return null;

    try {
      await templateService.deleteTemplate(templateId, session.user.id);
      setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    } catch (err) {
      console.error("Error deleting template:", err);
      setError(err.message);
      throw err;
    }
  };

  const createSignature = async (signatureData) => {
    if (!session?.user?.id) return null;

    try {
      const newSignature = await signatureService.createSignature(
        signatureData,
        session.user.id
      );
      setSignatures((prev) => [...prev, newSignature]);
      return newSignature;
    } catch (err) {
      console.error("Error creating signature:", err);
      setError(err.message);
      throw err;
    }
  };

  const updateSignature = async (signatureId, updates) => {
    if (!session?.user?.id) return null;

    try {
      const updatedSignature = await signatureService.updateSignature(
        signatureId,
        updates,
        session.user.id
      );
      setSignatures((prev) =>
        prev.map((s) => (s.id === signatureId ? updatedSignature : s))
      );
      return updatedSignature;
    } catch (err) {
      console.error("Error updating signature:", err);
      setError(err.message);
      throw err;
    }
  };

  const deleteSignature = async (signatureId) => {
    if (!session?.user?.id) return null;

    try {
      await signatureService.deleteSignature(signatureId, session.user.id);
      setSignatures((prev) => prev.filter((s) => s.id !== signatureId));
    } catch (err) {
      console.error("Error deleting signature:", err);
      setError(err.message);
      throw err;
    }
  };

  const getTemplateById = (id) => {
    return templates.find((t) => t.id === id);
  };

  const getSignatureById = (id) => {
    return signatures.find((s) => s.id === id);
  };

  return {
    templates,
    signatures,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    createSignature,
    updateSignature,
    deleteSignature,
    getTemplateById,
    getSignatureById,
    loadTemplatesAndSignatures,
  };
};
