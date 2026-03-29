// lib/helpers.ts
import { v4 as uuidv4 } from "uuid";

export const newId = () => uuidv4();

export const now = () => new Date().toISOString();
