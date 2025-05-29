// frontend/src/components/layout/SidebarNavigation.tsx
import * as React from 'react';
import { Button } from '@/components/ui/button';

interface NavItem {
  id: string;
  label: string;
  icon?: React.ElementType;
}

interface SidebarNavigationProps {
  navItems: NavItem[];
  activeSection: string;
  onNavClick: (sectionId: string) => void;
  className?: string; // Tornando opcional, pois já temos um bom default
}

export function SidebarNavigation({
  navItems,
  activeSection,
  onNavClick,
  className = "w-64 p-6 space-y-3 bg-card text-card-foreground border-r border-border",
}: SidebarNavigationProps) {
  return (
    <aside className={className}>
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          className={`w-full justify-start text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${
              activeSection === item.id
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-white hover:bg-gray-200 text-black'  
            }`}
          onClick={() => onNavClick(item.id)}
        >
          {item.icon && <item.icon className="mr-2 h-4 w-4" />}
          {item.label}
        </Button>
      ))}
    </aside>
  );
}