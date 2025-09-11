import { supabase } from "../supabaseClient";

export const templateService = {
  // Load templates for user

  loadTemplatesByUserId: async (userId) => {
    const { data, error } = await supabase
      .from("email_templates")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  createTemplate: async (template, userId) => {
    const { data, error } = await supabase
      .from("email_templates")
      .insert({
        user_id: userId,
        name: template.name,
        content: template.content,
        is_default: template.is_default || false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateTemplate: async (templateId, updates, userId) => {
    const { data, error } = await supabase
      .from("email_templates")
      .update({
        name: updates.name,
        content: updates.content,
        is_default: updates.is_default || false,
      })
      .eq("id", templateId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  deleteTemplate: async (templateId, userId) => {
    const { error } = await supabase
      .from("email_templates")
      .delete()
      .eq("id", templateId)
      .eq("user_id", userId);

    if (error) throw error;
  },

  loadDefaultTemplates: async () => {
    const { data, error } = await supabase
      .from("email_templates")
      .select("*")
      .eq("is_default", true)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  },
};
