import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://rygnhzbwbzrnrpisohxo.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5Z25oemJ3YnpybnJwaXNvaHhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzODc1MjIsImV4cCI6MjA3MDk2MzUyMn0.VU6DkGpRTp-lNSegpRu6vEQGu3Lq6HO9xQ1lK8W5ytk"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
