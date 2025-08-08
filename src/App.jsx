import React from "react";
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

// Import custom hooks
import { useAuth } from "./hooks/useAuth";
import { useLeads } from "./hooks/useLeads";
import { useEmails } from "./hooks/useEmails";
import { useFileUpload } from "./hooks/useFileUpload";

function App() {
  // ============================================================================
  // CUSTOM HOOKS
  // ============================================================================
  const auth = useAuth();
  const leads = useLeads(auth.session);
  const emails = useEmails(auth.session);
  const fileUpload = useFileUpload(auth.session);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  const handleLogout = async () => {
    await auth.logout();
    leads.resetLeads();
    emails.resetEmails();
    fileUpload.clearResume();
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  // Show auth screen if not logged in
  if (!auth.session) {
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
          providers={["email", "google", "azure"]}
        />
      </div>
    );
  }

  // Main app interface
  return (
    <div className="App">
      <Header
        isLoggedIn={auth.isLoggedIn}
        user={auth.user}
        onLogout={handleLogout}
      />

      {/* Toast notifications */}
      {leads.showSaved && <div className="saved-toast">Saved</div>}
      {leads.error && <div className="error-toast">Error: {leads.error}</div>}

      <main
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "2rem 1rem 4rem 1rem",
        }}
      >
        {/* Lead input and management */}
        <LeadInputTable
          leads={leads.leads}
          setLeads={leads.setLeads}
          saveLeads={leads.saveLeads}
          deleteLead={leads.deleteLead}
          loading={leads.loading}
          resumeFile={fileUpload.resumeFile}
          setResumeFile={fileUpload.setResumeFile}
          resumeFileName={fileUpload.resumeFileName}
          setResumeFileName={fileUpload.setResumeFileName}
          resumeUrl={fileUpload.resumeUrl}
          setResumeUrl={fileUpload.setResumeUrl}
          session={auth.session}
          saveResumeToSettings={fileUpload.uploadResume}
          uploadLoading={fileUpload.uploadLoading}
          uploadError={fileUpload.uploadError}
        />

        {/* Email generation */}
        <GenerateButton
          onClick={() =>
            emails.generateEmails(leads.leads, fileUpload.resumeUrl)
          }
          loading={emails.genLoading}
          error={emails.genError}
        />

        {/* Email preview and sending */}
        {emails.emails.length > 0 && (
          <>
            <EmailPreviewSection
              emails={emails.emails}
              onUpdate={emails.updateEmail}
              onDiscard={emails.discardEmail}
            />
            <SendButton
              count={emails.emails.filter((e) => !e.discarded).length}
              onClick={emails.sendEmails}
              loading={emails.sendLoading}
              disabled={
                emails.emails.filter((e) => !e.discarded).length === 0 ||
                emails.sendSuccess
              }
              error={emails.sendError}
              success={emails.sendSuccess}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
