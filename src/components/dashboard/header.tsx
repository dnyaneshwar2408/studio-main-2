'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function DashboardHeader() {
  const isMobile = useIsMobile();
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

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      {isMobile && <SidebarTrigger />}
      <h1 className="text-xl font-semibold tracking-tight font-headline">Dashboard</h1>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src="https://picsum.photos/seed/user/40/40" />
              <AvatarFallback>SF</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={showNotImplementedToast}>Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={showNotImplementedToast}>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
