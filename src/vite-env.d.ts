/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ONEDRIVE_CLIENT_ID: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_DROPBOX_CLIENT_ID: string
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
