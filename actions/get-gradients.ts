'use server'

import { Gradient } from '../types/gradients'

export async function getGradients(): Promise<Gradient[]> {
  try {
    const response = await fetch('https://raw.githubusercontent.com/ghosh/uiGradients/refs/heads/master/gradients.json')
    
    if (!response.ok) {
      throw new Error('Failed to fetch gradients')
    }
    const gradients: Gradient[] = await response.json()
    gradients.map(gradient => ({
      ...gradient,
      type: 'linear',
      angle: 90,
      stops: gradient.colors.map((color, index) => ({
        color,
        position: index * 100 / (gradient.colors.length - 1)
      }))
    }))
    return gradients
  } catch (error) {
    console.error('Error fetching gradients:', error)
    return []
  }
}

