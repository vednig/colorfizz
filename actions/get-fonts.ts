'use server'

import { GoogleFontsResponse } from '../types/fonts'

export async function getFonts() {
  try {
    const response = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.GOOGLE_FONTS_API_KEY}&sort=popularity`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch fonts')
    }

    const data: GoogleFontsResponse = await response.json()
    return data.items
  } catch (error) {
    console.error('Error fetching fonts:', error)
    return []
  }
}

