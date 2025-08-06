import { useState, useEffect } from "react";
import { storageService } from "../services/storageService";

/**
 * File upload hook - manages file upload state and operations
 */
export const useFileUpload = (session) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Load existing resume info when user logs in
  useEffect(() => {
    if (session?.user?.id) {
      loadUserSettings();
    }
  }, [session]);

  const loadUserSettings = async () => {
    try {
      const settings = await storageService.loadUserSettings(session.user.id);
      if (settings) {
        setResumeUrl(settings.resume_url || "");
        setResumeFileName(settings.resume_filename || "");
      }
    } catch (err) {
      console.error("Error loading user settings:", err);
      // Don't set error state for this, it's not critical
    }
  };

  const uploadResume = async (file) => {
    if (!session?.user?.id || !file) return;

    setUploadLoading(true);
    setUploadError(null);

    try {
      // Upload file to storage
      const uploadData = await storageService.uploadFile(file, session.user.id);

      // Get public URL
      const { data: urlData } = storageService.getPublicUrl(
        "resumes",
        uploadData.path
      );

      // Save to user settings
      await storageService.saveResumeToSettings(
        session.user.id,
        urlData.publicUrl,
        file.name
      );

      setResumeUrl(urlData.publicUrl);
      setResumeFileName(file.name);
      setResumeFile(file);
    } catch (err) {
      console.error("Error uploading resume:", err);
      setUploadError(err.message);
    } finally {
      setUploadLoading(false);
    }
  };

  const clearResume = () => {
    setResumeFile(null);
    setResumeFileName("");
    setResumeUrl("");
    setUploadError(null);
  };

  return {
    resumeFile,
    resumeFileName,
    resumeUrl,
    uploadLoading,
    uploadError,
    uploadResume,
    clearResume,
    setResumeFile,
    setResumeFileName,
    setResumeUrl,
  };
};
