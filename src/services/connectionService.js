import { supabase } from "../supabaseClient";

/**
 * Connection service - handles all Supabase EmployeeRequestTable CRUD operations
 */
export const connectionService = {
  /**
   * Generate connections via n8n webhook
   */
  generateConnections: async (connections) => {
    const response = await fetch(
      "https://akhilkadari.app.n8n.cloud/webhook-test/generate-connections",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connections }),
      }
    );

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(text || "Failed to generate connections");
    }

    const data = await response.json();
    console.log("Generate connections response:", data);
    return data;
  },

  /**
   * Load connection requests for a user
   */
  loadConnectionsByUserId: async (userId) => {
    const { data, error } = await supabase
      .from("EmployeeRequestTable")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    if (data && data.length > 0) {
      // Map Supabase data to frontend format
      return data.map((connectionLead) => ({
        id: connectionLead.id,
        numberOfEmployees: connectionLead.number_of_employees ?? 0,
        companyName: connectionLead.company_name || "",
        school: connectionLead.school || "",
        jobTitle: connectionLead.job_title || "",
      }));
    }

    return [];
  },

  /**
   * Insert new connection requests
   */
  insertConnections: async (newConnections, userId) => {
    const rows = newConnections.map((c) => ({
      user_id: userId,
      number_of_employees: c.numberOfEmployees ?? null,
      company_name: c.companyName || null,
      school: c.school || null,
      job_title: c.jobTitle || null,
    }));

    const { error } = await supabase.from("EmployeeRequestTable").insert(rows);

    if (error) throw error;
  },

  /**
   * Update existing connection request
   */
  updateConnection: async (connection, userId) => {
    const { error } = await supabase
      .from("EmployeeRequestTable")
      .update({
        number_of_employees: connection.numberOfEmployees ?? null,
        company_name: connection.companyName || null,
        school: connection.school || null,
        job_title: connection.jobTitle || null,
      })
      .eq("id", connection.id)
      .eq("user_id", userId);

    if (error) throw error;
  },

  /**
   * Delete connection request
   */
  deleteConnection: async (connectionId, userId) => {
    const { error } = await supabase
      .from("EmployeeRequestTable")
      .delete()
      .eq("id", connectionId)
      .eq("user_id", userId);

    if (error) throw error;
  },
};
