/* Doctor Orison configuration. Leave values empty to run fully local (no accounts, no uploads).
   The Supabase anon key is designed to be public: security comes from the row-level security rules in supabase-schema.sql.
   NEVER put a service_role key in this file. */
window.ORISON_CONFIG = {
  supabaseUrl: '',        // e.g. 'https://abcdxyz.supabase.co'
  supabaseAnonKey: '',    // the project's public "anon" key
  audio: {
    // Optional recorded narration. If set, the Bible reader streams this file instead of using synthetic speech.
    // Placeholders: {book} (e.g. 'john'), {chapter} (e.g. 3), {bookName} (e.g. 'John').
    // Only use audio you have the rights to publish. Example: 'https://your-cdn.example/audio/{book}/{chapter}.mp3'
    chapterUrlTemplate: ''
  }
};
