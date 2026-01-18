import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.video.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Admin123!", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin Sigma",
      email: "admin@sigmaembedded.ma",
      passwordHash,
      role: "ADMIN",
    },
  });

  const editor1 = await prisma.user.create({
    data: {
      name: "Nadia Firmware",
      email: "nadia@sigmaembedded.ma",
      passwordHash: await bcrypt.hash("Editor123!", 10),
      role: "EDITOR",
    },
  });

  const editor2 = await prisma.user.create({
    data: {
      name: "Omar RTOS",
      email: "omar@sigmaembedded.ma",
      passwordHash: await bcrypt.hash("Editor123!", 10),
      role: "EDITOR",
    },
  });

  const posts = [
    {
      title: "Maîtriser FreeRTOS sur STM32",
      slug: "maitriser-freertos-sur-stm32",
      excerpt: "Planification temps réel, task notifications et instrumentation.",
      contentMarkdown:
        "## Setup\nConfigurez FreeRTOS et le scheduler.\n\n## Debug\nTracez vos tâches avec SEGGER.\n\n## Optimisation\nAnalysez la latence et la consommation.",
      tags: ["RTOS", "STM32", "FreeRTOS"],
      status: "PUBLISHED" as const,
      authorId: editor1.id,
      publishedAt: new Date(),
    },
    {
      title: "Driver UART ultra fiable",
      slug: "driver-uart-ultra-fiable",
      excerpt: "DMA, ring buffer et gestion d'erreurs en environnement noisy.",
      contentMarkdown:
        "## Buffering\nRing buffer lock-free.\n\n## DMA\nGestion double buffering.\n\n## Validation\nTestez avec stress tests.",
      tags: ["UART", "C/C++"],
      status: "PUBLISHED" as const,
      authorId: editor2.id,
      publishedAt: new Date(),
    },
    {
      title: "CAN FD: diagnostics embarqués",
      slug: "can-fd-diagnostics",
      excerpt: "Optimisez vos frames CAN FD pour l'automobile et l'industrie.",
      contentMarkdown:
        "## Frames\nStructure avancée CAN FD.\n\n## Sécurité\nFocalisez sur la robustesse.\n\n## Logs\nJournalisation efficace.",
      tags: ["CAN", "RTOS"],
      status: "PUBLISHED" as const,
      authorId: editor1.id,
      publishedAt: new Date(),
    },
    {
      title: "Pipeline Yocto pour SoC",
      slug: "pipeline-yocto-pour-soc",
      excerpt: "Yocto, BSP custom et CI firmware.",
      contentMarkdown:
        "## Layers\nOrganisez vos layers.\n\n## CI\nAutomatisez vos builds.\n\n## Deployment\nFlash sécurisé.",
      tags: ["Yocto", "Linux"],
      status: "PUBLISHED" as const,
      authorId: admin.id,
      publishedAt: new Date(),
    },
    {
      title: "SPI vs I2C : choix d'architecture",
      slug: "spi-vs-i2c-choix-architecture",
      excerpt: "Comprendre les compromis bus pour capteurs critiques.",
      contentMarkdown:
        "## Latence\nComparatif bus.\n\n## EMI\nRobustesse face au bruit.",
      tags: ["I2C", "Hardware"],
      status: "DRAFT" as const,
      authorId: editor2.id,
    },
    {
      title: "Gestion power sur MCU",
      slug: "gestion-power-sur-mcu",
      excerpt: "Modes sleep, tickless et réduction de consommation.",
      contentMarkdown:
        "## Modes\nAnalyse des modes low power.\n\n## Mesures\nProfilage avancé.",
      tags: ["STM32", "C/C++"],
      status: "DRAFT" as const,
      authorId: editor1.id,
    },
    {
      title: "Bootloaders robustes",
      slug: "bootloaders-robustes",
      excerpt: "Mise à jour OTA et rollback sécurisé.",
      contentMarkdown:
        "## OTA\nStratégies fiables.\n\n## Sécurité\nSignature et rollback.",
      tags: ["Firmware", "Security"],
      status: "DRAFT" as const,
      authorId: admin.id,
    },
    {
      title: "Scheduler custom RTOS",
      slug: "scheduler-custom-rtos",
      excerpt: "Construisez un scheduler adapté aux contraintes temps réel.",
      contentMarkdown:
        "## Algo\nPriority scheduling.\n\n## Metrics\nMesurez la jitter.",
      tags: ["RTOS", "C/C++"],
      status: "DRAFT" as const,
      authorId: admin.id,
    },
  ];

  await prisma.post.createMany({ data: posts });

  const teamMembers = [
    {
      name: "Sara Benali",
      roleTitle: "Firmware Lead",
      bio: "Spécialiste STM32, drivers temps réel et optimisation low power.",
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&w=600&q=80",
      links: { linkedin: "https://linkedin.com" },
      order: 1,
    },
    {
      name: "Kamal Idrissi",
      roleTitle: "RTOS Architect",
      bio: "Expert FreeRTOS et Zephyr, focus sur la latence et la résilience.",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=600&q=80",
      links: { linkedin: "https://linkedin.com" },
      order: 2,
    },
    {
      name: "Lina El Moutaouakil",
      roleTitle: "Hardware/Software",
      bio: "Co-design et validation hardware, intégration capteurs.",
      photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&w=600&q=80",
      links: { linkedin: "https://linkedin.com" },
      order: 3,
    },
    {
      name: "Youssef Benjelloun",
      roleTitle: "Embedded Security",
      bio: "Bootloaders sécurisés, crypto et firmware signing.",
      photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&w=600&q=80",
      links: { linkedin: "https://linkedin.com" },
      order: 4,
    },
    {
      name: "Imane Ait",
      roleTitle: "Content Producer",
      bio: "Vulgarisation avancée, scripts et live labs.",
      photoUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=facearea&w=600&q=80",
      links: { linkedin: "https://linkedin.com" },
      order: 5,
    },
    {
      name: "Hakim Boussaid",
      roleTitle: "DevOps Embedded",
      bio: "CI/CD firmware, Yocto pipelines et observabilité.",
      photoUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=facearea&w=600&q=80",
      links: { linkedin: "https://linkedin.com" },
      order: 6,
    },
  ];

  await prisma.teamMember.createMany({ data: teamMembers });

  const videoIds = [
    "dQw4w9WgXcQ",
    "oHg5SJYRHA0",
    "3GwjfUFyY6M",
    "tVj0ZTS4WF4",
    "kJQP7kiw5Fk",
    "fRh_vgS2dFE",
    "CevxZvSJLk8",
    "OPf0YbXqDm0",
    "YQHsXMglC9A",
    "9bZkp7q19f0",
    "hT_nvWreIhg",
    "l482T0yNkeo",
  ];

  await prisma.video.createMany({
    data: videoIds.map((id, index) => ({
      title: `Lab Sigma Embedded #${index + 1}`,
      youtubeId: id,
      description: "Démo embedded, test instrumentation et tuning RTOS.",
      thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      publishedAt: new Date(Date.now() - index * 86400000),
      featured: index < 3,
      order: index + 1,
    })),
  });

  await prisma.newsletterSubscriber.createMany({
    data: Array.from({ length: 10 }).map((_, index) => ({
      email: `subscriber${index + 1}@sigmaembedded.ma`,
    })),
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
