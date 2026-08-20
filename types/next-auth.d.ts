import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    group: string;
    title?: string | null;
    initials?: string | null;
    tone?: string | null;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      group: string;
      title?: string | null;
      initials?: string | null;
      tone?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    group: string;
    title?: string | null;
    initials?: string | null;
    tone?: string | null;
  }
}
