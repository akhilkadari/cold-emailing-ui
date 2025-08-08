### Cold Emailing App

Generate, preview, and send personalized cold emails powered by Supabase and n8n.

- **Frontend**: React (Create React App)
- **Auth/DB/Storage**: Supabase
- **Automation**: n8n webhooks

![App Icon](cold-emailing-ui/public/appIcon.png)

### Features

- **Authentication**: Email, Google, and Azure via Supabase Auth
- **Leads management**: Create, update, and delete leads tied to the signed-in user
- **Resume upload**: Upload to Supabase Storage (`resumes` bucket) and persist in `user_settings`
- **Email generation**: Trigger n8n workflow to create tailored email drafts from leads and your resume
- **Review & edit**: Preview, edit, and discard email drafts before sending
- **Batch send**: Send approved emails via n8n workflow
- **Responsive UI**: Clean, simple interface

### Tech Stack

- React 19 + Create React App (CRA)
- Supabase JS v2 (`@supabase/supabase-js`)
- Supabase Auth, Database (Postgres), Storage
- n8n cloud/webhook workflows
- Plain CSS per component

### Project Structure

```
cold-emailing-app/
  cold-emailing-ui/
    public/
    src/
      components/        # UI building blocks
      hooks/             # app logic (auth, leads, emails, file upload)
      services/          # supabase + n8n integrations
      utils/             # constants/utilities
      supabaseClient.js  # supabase client setup
      App.jsx            # main app shell
```

### Quick Start

- **Prerequisites**: Node 18+ and npm
- **Install**:
  - `cd cold-emailing-ui`
  - `npm install`
- **Run**: `npm start`
- **Build**: `npm run build`
- **Test**: `npm test`

### Configuration

- **Supabase**
  - Update your project URL and anon key in `cold-emailing-ui/src/supabaseClient.js`.
  - Security note: Do not commit service-role keys; only the public anon key belongs in the frontend.
  - Consider moving credentials to environment variables (CRA supports `REACT_APP_*` vars) and importing them in `supabaseClient.js`.
- **n8n Webhooks**
  - Email generation endpoint: defined in `cold-emailing-ui/src/services/emailService.js` at `generateEmails`.
  - Email sending endpoint: defined in the same file at `sendEmails`.
  - Replace the sample endpoints with your own n8n webhook URLs.

### Database & Storage

- **Tables**
  - `leads`
    - Columns: `id (uuid)`, `user_id (uuid)`, `email (text)`, `firstname (text)`, `lastname (text)`, `linkedin (text)`, `template (text)`, `emailSignature (text)`, `created_at (timestamptz)`
  - `user_settings`
    - Columns: `id (uuid)`, `user_id (uuid)`, `resume_url (text)`, `resume_filename (text)`, `updated_at (timestamptz)`
- **Storage**
  - Bucket: `resumes` (public access for read; uploads happen via authenticated client)
- **Policies (RLS)**
  - Ensure RLS allows:
    - Users to read/write their own rows in `leads` and `user_settings`
    - Authenticated users to upload to `resumes`, and public read if you expect unauthenticated reads of resume files

### How It Works

1. **Sign in** with Supabase (Email, Google, or Azure).
2. **Add leads** in the table UI (can be saved per user).
3. **Upload resume**; the app stores the file in `resumes` and persists URL/filename in `user_settings`.
4. **Generate emails** via n8n webhook using your leads and resume URL.
5. **Review & edit** generated emails; discard any you don’t want to send.
6. **Send emails** in batch via n8n webhook.

### Key Files

- `cold-emailing-ui/src/App.jsx`: Composes the app, coordinates hooks, and renders UI
- `cold-emailing-ui/src/hooks/useAuth.js`: Session state and logout
- `cold-emailing-ui/src/hooks/useLeads.js`: Load/save/delete leads per user
- `cold-emailing-ui/src/hooks/useFileUpload.js`: Upload to Storage and persist in `user_settings`
- `cold-emailing-ui/src/hooks/useEmails.js`: Generate/transform/send emails via n8n
- `cold-emailing-ui/src/services/leadsService.js`: Supabase CRUD for `leads`
- `cold-emailing-ui/src/services/storageService.js`: Storage and `user_settings` helpers
- `cold-emailing-ui/src/services/emailService.js`: n8n webhook calls and response mapping
- `cold-emailing-ui/src/supabaseClient.js`: Supabase client initialization

### Troubleshooting

- **CORS / Webhooks**: Ensure your n8n webhook allows cross-origin requests from your local dev origin.
- **Supabase Storage access**: If resume URLs 404, confirm the file exists and bucket policies allow public read (or update the app to use signed URLs).
- **RLS errors**: Double-check RLS policies for `leads` and `user_settings` to permit the signed-in user to read/write their rows.

### Roadmap Ideas

- Per-user templates and variables
- Signed URLs for resume access
- Server proxy for n8n calls
- Rate limiting / retries for sending

---

MIT License
