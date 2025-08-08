import { supabase } from "../supabaseClient";

/**
 * Storage service - handles file uploads and user settings operations
 */
export const storageService = {
  /**
   * Upload file to Supabase storage
   */
  uploadFile: async (file, userId, bucket = "resumes") => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;
    return data;
  },

  /**
   * Get public URL for uploaded file
   */
  getPublicUrl: (bucket, path) => {
    return supabase.storage.from(bucket).getPublicUrl(path);
  },

  /**
   * Save resume URL to user settings
   */
  saveResumeToSettings: async (userId, resumeUrl, resumeFileName) => {
    // First check if record exists
    const { data: existingData } = await supabase
      .from("user_settings")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (existingData) {
      // Update existing record
      const { error } = await supabase
        .from("user_settings")
        .update({
          resume_url: resumeUrl,
          resume_filename: resumeFileName,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (error) throw error;
    } else {
      // Insert new record
      const { error } = await supabase.from("user_settings").insert({
        user_id: userId,
        resume_url: resumeUrl,
        resume_filename: resumeFileName,
      });

      if (error) throw error;
    }
  },

  /**
   * Load user settings including resume info
   */
  loadUserSettings: async (userId) => {
    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found"
      throw error;
    }

    return data;
  },

  /**
   * Check if a file exists in storage by trying to access it
   */
  checkFileExists: async (fileUrl) => {
    try {
      if (!fileUrl) return false;

      // Try to fetch the file to see if it exists
      const response = await fetch(fileUrl, { method: "HEAD" });
      return response.ok;
    } catch (error) {
      console.log("File check failed:", error);
      return false;
    }
  },

  /**
   * Clear resume from user settings
   */
  clearResumeFromSettings: async (userId) => {
    const { error } = await supabase
      .from("user_settings")
      .update({
        resume_url: null,
        resume_filename: null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) throw error;
  },
};
