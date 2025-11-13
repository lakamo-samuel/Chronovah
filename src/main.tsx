import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DarkModeProvider } from './context/DarkModeContext.tsx'
import { SidebarProvider } from './context/SidebarToggleContext.tsx'

import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New content available. Reload?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("App ready to work offline 🚀");
  },
});
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DarkModeProvider>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </DarkModeProvider>
  </StrictMode>
);
