export interface GradientStop {
  color: string;
  position: number;
}

export interface Gradient {
  name: string;
  colors: string[];
  type: 'linear' | 'radial' | 'conic';
  angle?: number;
  shape?: 'circle' | 'ellipse';
  position?: { x: number; y: number };
  stops: GradientStop[];
}

export interface GradientState extends Gradient {
  id: string;
}

