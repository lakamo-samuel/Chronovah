import type { BaseRecord } from "./BaseType";

export interface Person extends BaseRecord {
  name: string;
  nickname?: string;
  description: string;
  image?: string;
  images?: string[];
  relation: string;
  birthday?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  company?: string;
  jobTitle?: string;
  notes?: string;
  lastContacted?: string;
  socialMedia?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    facebook?: string;
  };
}

export interface PeopleStats {
  totalPeople: number;
  favoritePeople: number;
  uniqueRelations: number;
  recentAdded: number;
  contactMethods: {
    email: number;
    phone: number;
    social: number;
  };
}
