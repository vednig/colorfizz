'use server'

import { nanoid } from 'nanoid'
import { GradientState } from '../types/gradients'

interface ShareData {
  text: string;
  font: string;
  gradient: GradientState;
  textColor: string;
}

// In a real application, you would store this in a database
const shareLinks = new Map<string, ShareData>();

export async function generateShareLink(data: ShareData): Promise<string> {
  const id = nanoid();
  shareLinks.set(id, data);
  return id;
}

export async function getShareData(id: string): Promise<ShareData | null> {
  return shareLinks.get(id) || null;
}

