import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MainDashboard from "@/components/dashboard/MainDashboard";

export const revalidate = 0; // Dynamic server rendering

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch live data
  const [catalog, requests, governanceQueue, auditLogs, notifications, demoUsers] =
    await Promise.all([
      prisma.accessItem.findMany({
        orderBy: { createdAt: "asc" },
      }),
      prisma.accessRequest.findMany({
        orderBy: { submittedAt: "desc" },
      }),
      prisma.accessIdQueueItem.findMany({
        include: {
          accessItem: {
            select: {
              tool: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.auditLog.findMany({
        orderBy: { timestamp: "desc" },
        take: 500,
      }),
      prisma.notification.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          group: true,
          title: true,
          initials: true,
          tone: true,
        },
        orderBy: { name: "asc" },
      }),
    ]);

  return (
    <MainDashboard
      currentUser={session.user as any}
      catalog={catalog as any}
      requests={requests as any}
      governanceQueue={governanceQueue as any}
      auditLogs={auditLogs as any}
      notifications={notifications as any}
      allDemoUsers={demoUsers as any}
    />
  );
}
