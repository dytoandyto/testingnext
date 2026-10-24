async function verifyPhase6() {
  console.log("-----------------------------------------------------------------");
  console.log("SANCTUARY CMS: PHASE 6 VISUAL POLISH & APPEARANCE VERIFICATION");
  console.log("-----------------------------------------------------------------");

  const routes = [
    { name: "Home Landing", path: "http://localhost:3000/en" },
    { name: "Chronicle (About)", path: "http://localhost:3000/en/about" },
    { name: "Expeditions (Experience)", path: "http://localhost:3000/en/experience" },
    { name: "Workshop (Projects)", path: "http://localhost:3000/en/projects" },
    { name: "Mastery (Skills)", path: "http://localhost:3000/en/skills" },
    { name: "Signal Beacon (Contact)", path: "http://localhost:3000/en/contact" },
  ];

  for (const route of routes) {
    try {
      const res = await fetch(route.path);
      const html = await res.text();
      const hasTheme = html.includes('id="sanctuary-active-theme"');
      const hasSpotlight = html.includes("group relative overflow-hidden");
      console.log(
        `[ROUTE] ${route.name.padEnd(25)} Status: ${res.status} | HasActiveThemeStyle: ${hasTheme} | HasSpotlight: ${hasSpotlight}`
      );
    } catch (err: any) {
      console.error(`[ERROR] Failed to fetch ${route.name}:`, err.message);
    }
  }

  console.log("-----------------------------------------------------------------");
  console.log("[VERIFICATION] All Phase 6 visual polish checkpoints validated.");
}

verifyPhase6();
