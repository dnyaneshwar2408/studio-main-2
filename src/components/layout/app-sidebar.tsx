
"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  Fish,
  AreaChart,
  Beaker,
  Settings,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const FishIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <path d="M20.3 6.7C18.2 5.5 15.6 5 12 5s-6.2.5-8.3 1.7c-2.5 1.4-2.5 5.2 0 6.6C5.8 14.5 8.4 15 12 15s6.2-.5 8.3-1.7c2.5-1.4 2.5-5.2 0-6.6z" />
    <path d="M18 10v4" />
    <path d="M15 10v4" />
    <path d="M12 10v4" />
    <path d="m22 7-4.5 3L22 13" />
  </svg>
);

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  const showNotImplementedToast = () => {
    toast({
      title: 'Feature Coming Soon',
      description: 'This feature is not yet implemented.',
    });
  };

  const menuItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/species', label: 'Species Details', icon: Fish },
    { href: '/trends', label: 'Trend Analysis', icon: AreaChart },
    { href: '/otolith', label: 'Otolith View', icon: Beaker },
  ];

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="items-center">
        <Link href="/" className="flex items-center gap-2 p-2 [&_span]:text-lg [&_span]:font-headline [&_span]:font-semibold [&_span]:text-sidebar-foreground group-data-[collapsible=icon]:hidden">
          <FishIcon />
          <span>SmartFishers</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="items-stretch">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={showNotImplementedToast} tooltip={{ children: 'Settings' }}>
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <SidebarMenuButton tooltip={{ children: 'User Profile', size: 'lg' }}>
              <Avatar className="size-8">
                <AvatarImage src="https://picsum.photos/seed/user/40/40" />
                <AvatarFallback>SF</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span>User</span>
                <span className="text-xs text-sidebar-foreground/70">
                  Researcher
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
