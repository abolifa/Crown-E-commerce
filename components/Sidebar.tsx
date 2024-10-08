"use client";

import React from "react";
import {
  Globe,
  Layers,
  LayoutDashboard,
  Network,
  Palette,
  Scissors,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  {
    label: "Home",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    label: "Brands",
    icon: Tag,
    href: "/brands",
  },
  {
    label: "Categories",
    icon: Layers,
    href: "/categories",
  },
  {
    label: "Origins",
    icon: Globe,
    href: "/origins",
  },
  {
    label: "Colors",
    icon: Palette,
    href: "/colors",
  },
  {
    label: "Sizes",
    icon: Scissors,
    href: "/sizes",
  },
  {
    label: "SubCategory",
    icon: Network,
    href: "/subcategories",
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div
      className="w-auto h-[calc(100vh-3.5rem)] sticky top-0 text-muted-foreground left-0 p-5 border-r shadow 
    flex flex-col items-start justify-start gap-4"
    >
      {links.map((link) => {
        const isActive = link.href === pathname;
        return (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-2 w-full hover:text-primary transition-colors"
          >
            <div
              className={cn(
                "p-2 rounded-full bg-muted",
                isActive &&
                  "bg-primary text-primary-foreground hover:text-primary-foreground"
              )}
            >
              <link.icon className="w-5 h-5" />
            </div>
            <p
              className={cn(
                "text-sm",
                isActive && "hover:text-primary text-primary"
              )}
            >
              {link.label}
            </p>
          </Link>
        );
      })}
    </div>
  );
};

export default Sidebar;
