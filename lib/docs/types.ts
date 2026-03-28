import type { ReactNode } from "react";

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface ExampleDoc {
  title: string;
  description?: string;
  code: string;
  preview: ReactNode;
}

export interface ComponentDoc {
  name: string;
  slug: string;
  category: string;
  description: string;
  usage: string;
  props: PropDoc[];
  examples: ExampleDoc[];
}

export interface NavItem {
  title: string;
  href: string;
  badge?: string;
  external?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface TocItem {
  id: string;
  title: string;
  level: 2 | 3;
}
