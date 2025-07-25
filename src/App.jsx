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

const defaultLead = {
  email: "",
  firstname: "",
  lastname: "",
  linkedin: "",
  template: "",
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState();
  const [leads, setLeads] = useState([{ ...defaultLead }]);
  const [emails, setEmails] = useState([]);
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState();
  const [sendLoading, setSendLoading] = useState(false);
  const [sendError, setSendError] = useState();
  const [sendSuccess, setSendSuccess] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [session, setSession] = useState(null);

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

  const handleLogin = () => {
    setIsLoggedIn(true);
    setUser({ name: "John Doe", email: "john@example.com" });
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsLoggedIn(false);
    setUser(undefined);
  };

  const handleGenerate = async () => {
    setGenLoading(true);
    setGenError(undefined);
    setSendSuccess(false);
    try {
      const response = await fetch(
        "https://akhilkadari.app.n8n.cloud/webhook-test/generate-emails",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leads,
            userEmail: session?.user?.email,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to trigger workflow");
      const data = await response.json();
      console.log("n8n response:", data);
      console.log(
        "n8n response length/type:",
        Array.isArray(data) ? data.length : typeof data
      );

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

      console.log("emailsArray:", emailsArray);
      console.log("emailsArray length:", emailsArray.length);

      // Map the n8n response format to your UI format
      const mappedEmails = emailsArray.map((emailData) => ({
        email: emailData.email,
        firstname: emailData.firstName,
        lastname: emailData.lastName,
        subject: emailData.subject,
        body: emailData.body,
        discarded: false,
      }));

      console.log("mappedEmails:", mappedEmails);
      console.log("mappedEmails length:", mappedEmails.length);

      setEmails(mappedEmails);
      setGenLoading(false);
    } catch (e) {
      setGenError(e.message || "Failed to generate emails.");
      setGenLoading(false);
    }
  };

  const handleUpdateEmail = (idx, updated) => {
    setEmails((emails) => emails.map((e, i) => (i === idx ? updated : e)));
  };
  const handleDiscardEmail = (idx) => {
    setEmails((emails) =>
      emails.map((e, i) => (i === idx ? { ...e, discarded: !e.discarded } : e))
    );
  };

  const handleSend = async () => {
    setSendLoading(true);
    setSendError(undefined);
    setSendSuccess(false);
    try {
      await new Promise((res) => setTimeout(res, 1200));
      setSendSuccess(true);
      setEmails([]);
    } catch (e) {
      setSendError(e.message || "Failed to send emails.");
    } finally {
      setSendLoading(false);
    }
  };
  const handleExport = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/export-leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leads),
      });
      if (response.ok) {
        setShowSaved(true);
        setTimeout(() => {
          setShowSaved(false);
        }, 2000);
      } else {
        throw new Error("Failed to export leads.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

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
  return (
    <div className="App">
      <Header
        isLoggedIn={!!session}
        user={session?.user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      {showSaved && <div className="saved-toast">Saved</div>}
      <main
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "2rem 1rem 4rem 1rem",
        }}
      >
        <LeadInputTable
          leads={leads}
          setLeads={setLeads}
          handleExport={handleExport}
        />

        <GenerateButton
          onClick={handleGenerate}
          loading={genLoading}
          error={genError}
        />
        {emails.length > 0 && (
          <>
            <EmailPreviewSection
              emails={emails}
              onUpdate={handleUpdateEmail}
              onDiscard={handleDiscardEmail}
            />
            <SendButton
              count={emails.filter((e) => !e.discarded).length}
              onClick={handleSend}
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
