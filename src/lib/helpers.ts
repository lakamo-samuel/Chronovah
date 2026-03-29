import { v4 as uuidv4 } from 'uuid';

export const newId = (): string => uuidv4();

export const now = (): string => new Date().toISOString();