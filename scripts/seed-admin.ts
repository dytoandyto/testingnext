import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth/password";

async function seedAdmin() {
  console.log("-----------------------------------------------------------------");
  console.log("SANCTUARY CMS: SECURE ONE-TIME ADMIN BOOTSTRAP PROVISIONING");
  console.log("-----------------------------------------------------------------");

  const email = process.env.ADMIN_EMAIL || "admin@indie-realm.io";
  const password = process.env.ADMIN_PASSWORD;

  if (!password || password.length < 8) {
    console.error(
      "ERROR: ADMIN_PASSWORD environment variable must be set with at least 8 characters."
    );
    console.error("Example: $env:ADMIN_PASSWORD='YourStrongPassword123!' ; npm run seed:admin");
    process.exit(1);
  }

  try {
    // 1. Check if any admin account already exists
    const existingAdminCount = await db.user.count({
      where: { role: "ADMIN" },
    });

    if (existingAdminCount > 0) {
      console.log(`[INFO] Sanctuary already provisioned (${existingAdminCount} admin user found).`);
      console.log("[INFO] Idempotent safety lock engaged. No accounts created or overwritten.");
      process.exit(0);
    }

    // 2. Hash password with bcryptjs (12 salt rounds)
    const passwordHash = await hashPassword(password);

    // 3. Create Root Administrator
    const admin = await db.user.create({
      data: {
        email,
        name: "Realm Architect",
        passwordHash,
        role: "ADMIN",
      },
    });

    console.log(
      `[SUCCESS] Root administrator provisioned successfully: ${admin.email} (ID: ${admin.id})`
    );

    // 4. Provision Initial Global Site Settings (if not existing)
    await db.siteSettings.upsert({
      where: { id: "global-settings" },
      update: {},
      create: {
        id: "global-settings",
        siteTitle: "Indie Realm | Interactive 3D Portfolio CMS",
        metaDescription: "A handcrafted interactive 3D indie game diorama portfolio.",
        defaultLocale: "en",
        contactEmail: email,
      },
    });
    console.log("[SUCCESS] Global site settings initialized.");

    // 5. Provision Default Theme Preset
    await db.themePreset.upsert({
      where: { name: "Slate Obsidian" },
      update: { active: true },
      create: {
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
    });
    console.log("[SUCCESS] Default theme preset 'Slate Obsidian' initialized.");

    // 6. Provision Default 3D World Scene & Portals
    const scene = await db.worldScene.upsert({
      where: { id: "default-scene" },
      update: {},
      create: {
        id: "default-scene",
        name: "Astral Archipelago",
        isDefault: true,
        fogColor: "#0d131a",
        fogDensity: 0.015,
        ambientLightColor: "#d99b38",
        ambientLightIntensity: 0.6,
        sunLightColor: "#ffffff",
        sunLightIntensity: 1.2,
        bloomIntensity: 0.4,
      },
    });

    const defaultPortals = [
      {
        targetRoute: "/projects",
        labelEn: "Workshop Creations",
        labelId: "Bengkel Karya",
        posX: -4.0,
        posY: 0.0,
        posZ: 2.0,
        order: 1,
      },
      {
        targetRoute: "/about",
        labelEn: "Chronicle Biography",
        labelId: "Riwayat Perjalanan",
        posX: 0.0,
        posY: 0.0,
        posZ: 4.5,
        order: 2,
      },
      {
        targetRoute: "/experience",
        labelEn: "Expeditions",
        labelId: "Ekspedisi Karier",
        posX: 4.0,
        posY: 0.0,
        posZ: 2.0,
        order: 3,
      },
      {
        targetRoute: "/skills",
        labelEn: "Arcane Mastery",
        labelId: "Penguasaan Keahlian",
        posX: -3.0,
        posY: 0.0,
        posZ: -3.0,
        order: 4,
      },
      {
        targetRoute: "/contact",
        labelEn: "Signal Beacon",
        labelId: "Suar Sinyal",
        posX: 3.0,
        posY: 0.0,
        posZ: -3.0,
        order: 5,
      },
    ];

    for (const portal of defaultPortals) {
      await db.worldPortal.create({
        data: {
          sceneId: scene.id,
          targetRoute: portal.targetRoute,
          labelEn: portal.labelEn,
          labelId: portal.labelId,
          posX: portal.posX,
          posY: portal.posY,
          posZ: portal.posZ,
          active: true,
          order: portal.order,
        },
      });
    }
    console.log(
      `[SUCCESS] 3D World Scene initialized with ${defaultPortals.length} default portal nodes.`
    );

    // 7. Write Audit Log
    await db.auditLog.create({
      data: {
        actorId: admin.id,
        action: "BOOTSTRAP_PROVISIONING",
        entityType: "System",
        entityId: "init",
        ipHash: "cli-system",
        detailsJson: {
          email: admin.email,
          timestamp: new Date().toISOString(),
        },
      },
    });
    console.log("[SUCCESS] Audit log recorded.");
    console.log("-----------------------------------------------------------------");
    console.log("SANCTUARY BOOTSTRAP COMPLETE. YOU MAY NOW LOG IN SECURELY.");
    console.log("-----------------------------------------------------------------");
  } catch (error) {
    console.error("[FATAL] Bootstrap provisioning failed:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

seedAdmin();
