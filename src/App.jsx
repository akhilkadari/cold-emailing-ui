import React, { useState, useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "./supabaseClient";
import "./App.css";
import Header from "./components/Header";
import LeadInputTable from "./components/LeadInputTable";
import GenerateButton from "./components/GenerateButton";
import EmailPreviewSection from "./components/EmailPreviewSection";
import SendButton from "./components/SendButton";
import Footer from "./components/Footer";

// ============================================================================
// CONSTANTS
// ============================================================================
const defaultLead = {
  email: "",
  firstname: "",
  lastname: "",
  linkedin: "",
  template: "",
  emailSignature: "",
};

function App() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  // Authentication state
  const [session, setSession] = useState(null);

  // Leads management state
  const [leads, setLeads] = useState([{ ...defaultLead }]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState(null);

  // Email generation and sending state
  const [emails, setEmails] = useState([]);
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState();
  const [sendLoading, setSendLoading] = useState(false);
  const [sendError, setSendError] = useState();
  const [sendSuccess, setSendSuccess] = useState(false);

  // UI state
  const [showSaved, setShowSaved] = useState(false);

  // Resume file upload state
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");

  // ============================================================================
  // AUTHENTICATION EFFECTS & HANDLERS
  // ============================================================================
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener?.subscription.unsubscribe();
  }, []);

  // Load leads from Supabase when user logs in
  useEffect(() => {
    if (session?.user?.id) {
      loadLeads();
    }
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setLeads([{ ...defaultLead }]); // Reset to default lead
  };

  // ============================================================================
  // SUPABASE DATABASE OPERATIONS
  // ============================================================================
  /**
   * Load leads from Supabase for the current user
   */
  const loadLeads = async () => {
    setLeadsLoading(true);
    setLeadsError(null);

    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Map Supabase data to frontend format
        const mappedLeads = data.map((lead) => ({
          id: lead.id,
          email: lead.email || "",
          firstname: lead.firstname || "",
          lastname: lead.lastname || "",
          linkedin: lead.linkedin || "",
          template: lead.template || "",
          emailSignature: lead.emailSignature || "",
        }));
        setLeads(mappedLeads);
      } else {
        // If no leads exist, start with default empty lead
        setLeads([{ ...defaultLead }]);
      }
    } catch (error) {
      console.error("Error loading leads:", error);
      setLeadsError(error.message);
      setLeads([{ ...defaultLead }]);
    } finally {
      setLeadsLoading(false);
    }
  };

  /**
   * Save leads to Supabase (insert new, update existing)
   */
  const saveLeads = async (updatedLeads = leads) => {
    if (!session?.user?.id) return;

    try {
      // Separate new leads (without id) from existing leads
      const newLeads = updatedLeads.filter(
        (lead) =>
          !lead.id &&
          (lead.email ||
            lead.firstname ||
            lead.lastname ||
            lead.linkedin ||
            lead.template ||
            lead.emailSignature)
      );
      const existingLeads = updatedLeads.filter((lead) => lead.id);

      // Insert new leads
      if (newLeads.length > 0) {
        const { error: insertError } = await supabase.from("leads").insert(
          newLeads.map((lead) => ({
            user_id: session.user.id,
            email: lead.email || null,
            firstname: lead.firstname || null,
            lastname: lead.lastname || null,
            linkedin: lead.linkedin || null,
            template: lead.template || null,
            emailSignature: lead.emailSignature || null,
          }))
        );

        if (insertError) throw insertError;
      }

      // Update existing leads
      for (const lead of existingLeads) {
        if (lead.id) {
          const { error: updateError } = await supabase
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
            .eq("user_id", session.user.id);

          if (updateError) throw updateError;
        }
      }

      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    } catch (error) {
      console.error("Error saving leads:", error);
      setLeadsError(error.message);
    }
  };

  /**
   * Delete a lead from Supabase
   */
  const deleteLead = async (leadId) => {
    if (!leadId || !session?.user?.id) return;

    try {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", leadId)
        .eq("user_id", session.user.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting lead:", error);
      setLeadsError(error.message);
    }
  };

  // ============================================================================
  // USER SETTINGS OPERATIONS
  // ============================================================================
  /**
   * Save resume URL to user settings
   */
  const saveResumeToSettings = async (resumeUrl, resumeFileName) => {
    if (!session?.user?.id) return;

    try {
      // First check if record exists
      const { data: existingData } = await supabase
        .from("user_settings")
        .select("id")
        .eq("user_id", session.user.id)
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
          .eq("user_id", session.user.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase.from("user_settings").insert({
          user_id: session.user.id,
          resume_url: resumeUrl,
          resume_filename: resumeFileName,
        });

        if (error) throw error;
      }
    } catch (error) {
      console.error("Error saving resume settings:", error);
      throw error;
    }
  };

  // ============================================================================
  // EMAIL GENERATION & SENDING
  // ============================================================================
  /**
   * Generate emails using n8n workflow
   */

  const handleGenerate = async () => {
    setGenLoading(true);
    setGenError(undefined);
    setSendSuccess(false);

    try {
      const response = await fetch(
        "https://akhilkadari.app.n8n.cloud/webhook/generate-emails",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leads,
            userEmail: session?.user?.email,
            resumeUrl, // Add this line
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to trigger workflow");
      const data = await response.json();

      // Handle object response format
      let emailsArray;
      if (Array.isArray(data)) {
        // If data is already an array
        emailsArray = data;
      } else if (data && typeof data === "object") {
        // If data is a single object, wrap it in an array
        emailsArray = [data];
      } else {
        throw new Error("Unexpected response format from n8n");
      }

      // Map the n8n response format to your UI format
      const mappedEmails = emailsArray.map((emailData) => {
        return {
          email: emailData.emailId || emailData.recipient_email || "",
          firstname:
            emailData.firstName ||
            emailData.firstname ||
            emailData.first_name ||
            "",
          lastname:
            emailData.lastName ||
            emailData.lastname ||
            emailData.last_name ||
            "",
          subject: emailData.subject || "",
          body: emailData.body || emailData.content || "",
          signature: emailData.signature || "",
          discarded: false,
        };
      });

      setEmails(mappedEmails);
      setGenLoading(false);
    } catch (e) {
      setGenError(e.message || "Failed to generate emails.");
      setGenLoading(false);
    }
  };

  /**
   * Send emails using n8n workflow
   */
  const handleSendEmail = async () => {
    setSendLoading(true);
    setSendError(undefined);
    setSendSuccess(false);

    try {
      const response = await fetch(
        "https://akhilkadari.app.n8n.cloud/webhook-test/send-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emails,
            userEmail: session?.user?.email,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to send emails");

      const result = await response.json();
      setSendSuccess(true);
    } catch (e) {
      setSendError(e.message || "Failed to send emails.");
    } finally {
      setSendLoading(false);
    }
  };

  // ============================================================================
  // UI EVENT HANDLERS
  // ============================================================================
  /**
   * Update a specific email in the preview
   */
  const handleUpdateEmail = (idx, updated) => {
    setEmails((emails) => emails.map((e, i) => (i === idx ? updated : e)));
  };

  /**
   * Toggle discard status of an email
   */
  const handleDiscardEmail = (idx) => {
    setEmails((emails) =>
      emails.map((e, i) => (i === idx ? { ...e, discarded: !e.discarded } : e))
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  // Show auth screen if not logged in
  if (!session) {
    return (
      <div style={{ maxWidth: 420, margin: "4rem auto" }}>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  inputText: "#fff",
                  inputLabelText: "#fff",
                  inputPlaceholder: "#cbd5e1",
                  inputBackground: "#232b3b",
                  inputBorder: "#334155",
                },
              },
            },
          }}
          providers={["email"]}
        />
      </div>
    );
  }

  // Main app interface
  return (
    <div className="App">
      <Header
        isLoggedIn={!!session}
        user={session?.user}
        onLogout={handleLogout}
      />

      {/* Toast notifications */}
      {showSaved && <div className="saved-toast">Saved</div>}
      {leadsError && <div className="error-toast">Error: {leadsError}</div>}

      <main
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "2rem 1rem 4rem 1rem",
        }}
      >
        {/* Lead input and management */}
        <LeadInputTable
          leads={leads}
          setLeads={setLeads}
          saveLeads={saveLeads}
          deleteLead={deleteLead}
          loading={leadsLoading}
          resumeFile={resumeFile}
          setResumeFile={setResumeFile}
          resumeFileName={resumeFileName}
          setResumeFileName={setResumeFileName}
          resumeUrl={resumeUrl}
          setResumeUrl={setResumeUrl}
          session={session}
          saveResumeToSettings={saveResumeToSettings} // Add this line
        />

        {/* Email generation */}
        <GenerateButton
          onClick={handleGenerate}
          loading={genLoading}
          error={genError}
        />

        {/* Email preview and sending */}
        {emails.length > 0 && (
          <>
            <EmailPreviewSection
              emails={emails}
              onUpdate={handleUpdateEmail}
              onDiscard={handleDiscardEmail}
            />
            <SendButton
              count={emails.filter((e) => !e.discarded).length}
              onClick={handleSendEmail}
              loading={sendLoading}
              disabled={
                emails.filter((e) => !e.discarded).length === 0 || sendSuccess
              }
              error={sendError}
              success={sendSuccess}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
