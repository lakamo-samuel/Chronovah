// types/PeopleType.ts
export interface Person {
  id?: number;
  name: string;
  nickname?: string;
  description: string;
  image?: string;
  images?: string[]; // Multiple images
  relation: string;
  birthday?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  company?: string;
  jobTitle?: string;
  notes?: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
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
