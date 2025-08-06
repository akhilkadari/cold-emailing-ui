import { useState, useEffect } from "react";
import { leadsService } from "../services/leadsService";
import { defaultLead, hasLeadData } from "../utils/constants";

/**
 * Leads hook - manages leads state and operations
 */
export const useLeads = (session) => {
  const [leads, setLeads] = useState([{ ...defaultLead }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSaved, setShowSaved] = useState(false);

  // Load leads when user logs in
  useEffect(() => {
    if (session?.user?.id) {
      loadLeads();
    }
  }, [session]);

  const loadLeads = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await leadsService.loadLeadsByUserId(session.user.id);
      if (data && data.length > 0) {
        setLeads(data);
      } else {
        setLeads([{ ...defaultLead }]);
      }
    } catch (err) {
      console.error("Error loading leads:", err);
      setError(err.message);
      setLeads([{ ...defaultLead }]);
    } finally {
      setLoading(false);
    }
  };

  const saveLeads = async (updatedLeads = leads) => {
    if (!session?.user?.id) return;

    try {
      // Separate new leads (without id) from existing leads
      const newLeads = updatedLeads.filter(
        (lead) => !lead.id && hasLeadData(lead)
      );
      const existingLeads = updatedLeads.filter((lead) => lead.id);

      // Insert new leads
      if (newLeads.length > 0) {
        await leadsService.insertLeads(newLeads, session.user.id);
      }

      // Update existing leads
      for (const lead of existingLeads) {
        if (lead.id) {
          await leadsService.updateLead(lead, session.user.id);
        }
      }

      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    } catch (err) {
      console.error("Error saving leads:", err);
      setError(err.message);
    }
  };

  const deleteLead = async (leadId) => {
    if (!leadId || !session?.user?.id) return;

    try {
      await leadsService.deleteLead(leadId, session.user.id);
    } catch (err) {
      console.error("Error deleting lead:", err);
      setError(err.message);
    }
  };

  const resetLeads = () => {
    setLeads([{ ...defaultLead }]);
    setError(null);
    setShowSaved(false);
  };

  return {
    leads,
    setLeads,
    loading,
    error,
    showSaved,
    saveLeads,
    deleteLead,
    loadLeads,
    resetLeads,
  };
};
