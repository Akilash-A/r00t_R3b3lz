import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { Terminal, Home, FileText, Users, LogOut } from "lucide-react";
import Link from "next/link";
import { logout } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Link href="/admin-page" className="flex items-center gap-2">
              <Terminal className="h-7 w-7 text-primary" />
              <span className="text-lg font-bold font-code text-foreground">Admin Panel</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin-page">
                    <Home />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin-page/writeups">
                    <FileText />
                    Write-ups
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/admin-page/members">
                    <Users />
                    Members
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <form action={logout}>
              <Button type="submit" variant="ghost" className="w-full justify-start gap-2">
                <LogOut />
                Logout
              </Button>
            </form>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
