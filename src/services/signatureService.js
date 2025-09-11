import { supabase } from "../supabaseClient";

export const signatureService = {
  /**
   * Load signatures for a user
   */
  loadSignaturesByUserId: async (userId) => {
    const { data, error } = await supabase
      .from("email_signatures")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Create a new signature
   */
  createSignature: async (signature, userId) => {
    const { data, error } = await supabase
      .from("email_signatures")
      .insert({
        user_id: userId,
        name: signature.name,
        content: signature.content,
        is_default: signature.is_default || false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update existing signature
   */
  updateSignature: async (signatureId, updates, userId) => {
    const { data, error } = await supabase
      .from("email_signatures")
      .update({
        name: updates.name,
        content: updates.content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", signatureId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete signature
   */
  deleteSignature: async (signatureId, userId) => {
    const { error } = await supabase
      .from("email_signatures")
      .delete()
      .eq("id", signatureId)
      .eq("user_id", userId);

    if (error) throw error;
  },

  /**
   * Load default signatures (system-wide signatures)
   */
  loadDefaultSignatures: async () => {
    const { data, error } = await supabase
      .from("email_signatures")
      .select("*")
      .eq("is_default", true)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  },
};
