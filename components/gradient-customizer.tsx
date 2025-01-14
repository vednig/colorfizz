import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { GradientState } from '../types/gradients'

interface GradientCustomizerProps {
  gradient: GradientState;
  onChange: (gradient: GradientState) => void;
}

export function GradientCustomizer({ gradient, onChange }: GradientCustomizerProps) {
  const [activeStopIndex, setActiveStopIndex] = useState(0);

  const updateGradient = (updates: Partial<GradientState>) => {
    onChange({ ...gradient, ...updates });
  };

  const updateStop = (index: number, updates: Partial<GradientStop>) => {
    const newStops = [...gradient.stops];
    newStops[index] = { ...newStops[index], ...updates };
    updateGradient({ stops: newStops });
  };

  const addStop = () => {
    const newStops = [...gradient.stops, { color: '#ffffff', position: 100 }];
    updateGradient({ stops: newStops });
    setActiveStopIndex(newStops.length - 1);
  };

  const removeStop = (index: number) => {
    if (gradient.stops.length > 2) {
      const newStops = gradient.stops.filter((_, i) => i !== index);
      updateGradient({ stops: newStops });
      setActiveStopIndex(Math.max(0, index - 1));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Gradient Type</Label>
        <RadioGroup
          value={gradient.type}
          onValueChange={(value) => updateGradient({ type: value as 'linear' | 'radial' | 'conic' })}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="linear" id="linear" />
            <Label htmlFor="linear">Linear</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="radial" id="radial" />
            <Label htmlFor="radial">Radial</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="conic" id="conic" />
            <Label htmlFor="conic">Conic</Label>
          </div>
        </RadioGroup>
      </div>

      {gradient.type === 'linear' && (
        <div>
          <Label>Angle</Label>
          <Slider
            value={[gradient.angle || 0]}
            min={0}
            max={360}
            step={1}
            onValueChange={([value]) => updateGradient({ angle: value })}
          />
          <div className="text-sm text-gray-500 mt-1">{gradient.angle || 0}°</div>
        </div>
      )}

      {gradient.type === 'radial' && (
        <div>
          <Label>Shape</Label>
          <RadioGroup
            value={gradient.shape || 'circle'}
            onValueChange={(value) => updateGradient({ shape: value as 'circle' | 'ellipse' })}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="circle" id="circle" />
              <Label htmlFor="circle">Circle</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ellipse" id="ellipse" />
              <Label htmlFor="ellipse">Ellipse</Label>
            </div>
          </RadioGroup>
        </div>
      )}

      {(gradient.type === 'radial' || gradient.type === 'conic') && (
        <div className="space-y-2">
          <Label>Position</Label>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label>X</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={gradient.position?.x || 50}
                onChange={(e) => updateGradient({ position: { ...gradient.position, x: Number(e.target.value) } })}
              />
            </div>
            <div className="flex-1">
              <Label>Y</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={gradient.position?.y || 50}
                onChange={(e) => updateGradient({ position: { ...gradient.position, y: Number(e.target.value) } })}
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <Label>Color Stops</Label>
        <div className="flex space-x-2 mt-2">
          {gradient.stops.map((stop, index) => (
            <button
              key={index}
              className={`w-8 h-8 rounded-full border-2 ${
                index === activeStopIndex ? 'border-blue-500' : 'border-transparent'
              }`}
              style={{ backgroundColor: stop.color }}
              onClick={() => setActiveStopIndex(index)}
            />
          ))}
          <Button variant="outline" size="icon" onClick={addStop}>
            +
          </Button>
        </div>
      </div>

      {gradient.stops[activeStopIndex] && (
        <div className="space-y-4">
          <div>
            <Label>Color</Label>
            <Input
              type="color"
              value={gradient.stops[activeStopIndex].color}
              onChange={(e) => updateStop(activeStopIndex, { color: e.target.value })}
            />
          </div>
          <div>
            <Label>Position</Label>
            <Slider
              value={[gradient.stops[activeStopIndex].position]}
              min={0}
              max={100}
              step={1}
              onValueChange={([value]) => updateStop(activeStopIndex, { position: value })}
            />
            <div className="text-sm text-gray-500 mt-1">{gradient.stops[activeStopIndex].position}%</div>
          </div>
          {gradient.stops.length > 2 && (
            <Button variant="destructive" onClick={() => removeStop(activeStopIndex)}>
              Remove Stop
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

