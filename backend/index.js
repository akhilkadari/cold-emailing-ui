const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const auth = new google.auth.GoogleAuth({
  keyFile: "./hopeful-market-466714-f3-99f0e44f6781.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const SPREADSHEET_ID = "1vLQx00OUggSLhamdNPyxdu6byJII6Q8heF48qePZ9Mw";

app.post("/api/export-leads", async (req, res) => {
  try {
    const leads = req.body;
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const values = leads.map((lead) => [
      lead.email,
      lead.firstname,
      lead.lastname,
      lead.linkedin,
      lead.template,
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "sheet1!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error exporting leads:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
