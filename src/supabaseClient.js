import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ufsgbaplxdutvclyixke.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmc2diYXBseGR1dHZjbHlpeGtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxOTc2NTksImV4cCI6MjA2ODc3MzY1OX0.ArJ9Hl6iusHT67inGzleF4DWhn3ndLOrJcMdL9AWK-4";

export const supabase = createClient(supabaseUrl, supabaseKey);
