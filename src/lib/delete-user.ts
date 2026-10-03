import { prisma } from "./prisma";


const email = "sehenarehena506@gmail.com";

async function main() {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      donor: true,
      refreshTokens: true,
      auditLogs: true,
      bloodRequests: true,
    },
  });

  if (!user) {
    console.log("User not found");
    return;
  }

  console.log("User found:");
  console.log({
    id: user.id,
    email: user.email,
    role: user.role,
    donor: !!user.donor,
    refreshTokens: user.refreshTokens.length,
    auditLogs: user.auditLogs.length,
    bloodRequests: user.bloodRequests.length,
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });