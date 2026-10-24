import { db } from "../src/lib/db";

async function seedCuratedThemes() {
  console.log("-----------------------------------------------------------------");
  console.log("SANCTUARY CMS: SEEDING CURATED THEME PRESETS");
  console.log("-----------------------------------------------------------------");

  const presets = [
    {
      name: "Slate Obsidian",
      isDefault: true,
      bgPrimary: "#0d131a",
      bgSurface: "#141d27",
      bgCard: "#182330",
      border: "#2c3c4f",
      amber: "#d99b38",
      moss: "#3d634f",
      clay: "#c45a3c",
      parchment: "#e4dbc9",
      active: true,
    },
    {
      name: "Forest Moss",
      isDefault: false,
      bgPrimary: "#0f1712",
      bgSurface: "#16221b",
      bgCard: "#1d2c23",
      border: "#2d4738",
      amber: "#e0ab4a",
      moss: "#528a6d",
      clay: "#bf6547",
      parchment: "#e8dfce",
      active: false,
    },
    {
      name: "Parchment Dusk",
      isDefault: false,
      bgPrimary: "#161412",
      bgSurface: "#201c18",
      bgCard: "#2b2520",
      border: "#423830",
      amber: "#e5a93c",
      moss: "#486950",
      clay: "#cb583e",
      parchment: "#f0e8d8",
      active: false,
    },
    {
      name: "Celestial Starlight",
      isDefault: false,
      bgPrimary: "#0a0e17",
      bgSurface: "#111827",
      bgCard: "#182236",
      border: "#24334f",
      amber: "#4da8da",
      moss: "#48bb78",
      clay: "#f56565",
      parchment: "#e2e8f0",
      active: false,
    },
  ];

  for (const preset of presets) {
    const existing = await db.themePreset.findUnique({
      where: { name: preset.name },
    });

    if (existing) {
      console.log(`[INFO] Preset '${preset.name}' already exists.`);
    } else {
      await db.themePreset.create({
        data: preset,
      });
      console.log(`[CREATED] Preset '${preset.name}' successfully forged.`);
    }
  }

  const all = await db.themePreset.findMany({ select: { name: true, active: true, isDefault: true } });
  console.log("[STATUS] Available theme presets in DB:", all);
  console.log("-----------------------------------------------------------------");
}

seedCuratedThemes()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed to seed curated themes:", err);
    process.exit(1);
  });
