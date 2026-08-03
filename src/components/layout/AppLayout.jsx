import React from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import { Home, Dumbbell, Apple, Brain, TrendingUp, Users, ShoppingBag, MessageCircle, Mic, Radio, Calendar, UserPlus, LayoutDashboard, ScanLine, Shield } from 'lucide-react';
import HFLogo from '@/components/HFLogo';
import { useAuth } from '@/lib/AuthContext';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/dashboard', label: 'My Membership', icon: LayoutDashboard },
  { to: '/join', label: 'Join', icon: UserPlus },
  { to: '/programs', label: 'Programs', icon: Dumbbell },
  { to: '/nutrition', label: 'Nutrition', icon: Apple },
  { to: '/mindset', label: 'Mindset', icon: Brain },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/community', label: 'Community', icon: MessageCircle },
  { to: '/podcast', label: 'Podcast', icon: Mic },
  { to: '/live', label: 'Live', icon: Radio },
  { to: '/events', label: 'Events', icon: Calendar },
  { to: '/coaches', label: 'Coaches', icon: Users },
  { to: '/store', label: 'Store', icon: ShoppingBag },
];

const adminItems = [
  { to: '/staff-checkin', label: 'Check-In', icon: ScanLine },
  { to: '/admin', label: 'Admin', icon: Shield },
];

export default function AppLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const isHome = location.pathname === '/';
  const isAdmin = user?.role === 'admin';
  const allItems = [...navItems, ...(isAdmin ? adminItems : [])];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border flex-col z-40">
        <div className="p-6 border-b border-border">
          <NavLink to="/">
            <HFLogo />
          </NavLink>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {allItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary border-l-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-lg p-4">
            <p className="text-[10px] tracking-widest uppercase text-primary font-bold mb-1">High Frequency</p>
            <p className="text-xs text-muted-foreground mb-3">Unlock all programs, nutrition, and coaching.</p>
            <Link to="/join" className="w-full block text-center bg-primary text-primary-foreground text-xs font-bold tracking-wider uppercase py-2.5 rounded-md hover:bg-primary/90 transition-colors">
              Go Premium
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`md:ml-64 ${isHome ? '' : 'pb-24 md:pb-8'}`}>
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-40">
        <div className="flex overflow-x-auto no-scrollbar items-center gap-1 px-2">
          {allItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 py-2.5 px-2 min-w-[52px] flex-shrink-0 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-medium tracking-wide">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}