import { supabase } from "../supabaseClient";

/**
 * Leads service - handles all Supabase leads CRUD operations
 */
export const leadsService = {
  /**
   * Load leads for a user
   */
  loadLeadsByUserId: async (userId) => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    if (data && data.length > 0) {
      // Map Supabase data to frontend format
      return data.map((lead) => ({
        id: lead.id,
        email: lead.email || "",
        firstname: lead.firstname || "",
        lastname: lead.lastname || "",
        linkedin: lead.linkedin || "",
        template: lead.template || "",
        emailSignature: lead.emailSignature || "",
      }));
    }

    return [];
  },

  /**
   * Insert new leads
   */
  insertLeads: async (newLeads, userId) => {
    const { error } = await supabase.from("leads").insert(
      newLeads.map((lead) => ({
        user_id: userId,
        email: lead.email || null,
        firstname: lead.firstname || null,
        lastname: lead.lastname || null,
        linkedin: lead.linkedin || null,
        template: lead.template || null,
        emailSignature: lead.emailSignature || null,
      }))
    );

    if (error) throw error;
  },

  /**
   * Update existing lead
   */
  updateLead: async (lead, userId) => {
    const { error } = await supabase
      .from("leads")
      .update({
        email: lead.email || null,
        firstname: lead.firstname || null,
        lastname: lead.lastname || null,
        linkedin: lead.linkedin || null,
        template: lead.template || null,
        emailSignature: lead.emailSignature || null,
      })
      .eq("id", lead.id)
      .eq("user_id", userId);

    if (error) throw error;
  },

  /**
   * Delete lead
   */
  deleteLead: async (leadId, userId) => {
    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", leadId)
      .eq("user_id", userId);

    if (error) throw error;
  },
};
