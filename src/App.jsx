import React from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "./supabaseClient";
import "./App.css";
import Header from "./components/Header";
import LeadInputTable from "./components/LeadInputTable";
import GenerateButton from "./components/GenerateButton";
import EmailPreviewSection from "./components/EmailPreviewSection";
import Footer from "./components/Footer";

// Import custom hooks
import { useAuth } from "./hooks/useAuth";
import { useLeads } from "./hooks/useLeads";
import { useEmails } from "./hooks/useEmails";

function App() {
  // ============================================================================
  // CUSTOM HOOKS
  // ============================================================================
  const auth = useAuth();
  const leads = useLeads(auth.session);
  const emails = useEmails(auth.session);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  const handleLogout = async () => {
    await auth.logout();
    leads.resetLeads();
    emails.resetEmails();
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
        />

        {/* Email generation */}
        <GenerateButton
          onClick={() => emails.generateEmails(leads.leads)}
          loading={emails.genLoading}
          error={emails.genError}
        />

        {/* Email preview */}
        {emails.emails.length > 0 && (
          <EmailPreviewSection
            emails={emails.emails}
            onUpdate={emails.updateEmail}
            onDiscard={emails.discardEmail}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
