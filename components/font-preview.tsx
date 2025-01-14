'use client'

import { useState, useEffect, useRef } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { GoogleFont } from '../types/fonts'
import { Gradient, GradientState } from '../types/gradients'
import { Color } from '../types/colors'
import { getFonts } from '../actions/get-fonts'
import { getGradients } from '../actions/get-gradients'
import { generateShareLink } from '../actions/generate-share-link'
import { colors } from '../utils/colors'
import { GradientCustomizer } from './gradient-customizer'
import html2canvas from 'html2canvas'
import { nanoid } from 'nanoid'

interface ShareData {
  text: string;
  font: string;
  gradient: GradientState;
  textColor: string;
}

export default function FontPreview({ initialData }: { initialData?: ShareData }) {
  const [text, setText] = useState(initialData?.text || 'Your Text Here')
  const [fonts, setFonts] = useState<GoogleFont[]>([])
  const [filteredFonts, setFilteredFonts] = useState<GoogleFont[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [gradients, setGradients] = useState<Gradient[]>([])
  const [selectedFont, setSelectedFont] = useState(initialData?.font || '')
  const [selectedGradient, setSelectedGradient] = useState<GradientState | null>(null)
  const [selectedColor, setSelectedColor] = useState<Color>(
    initialData ? { name: 'Custom', value: initialData.textColor } : colors[0]
  )
  const [loading, setLoading] = useState(true)
  const [shareLink, setShareLink] = useState<string | null>(null)
  const [previewFonts, setPreviewFonts] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadData() {
      const [fontsList, gradientsList] = await Promise.all([
        getFonts(),
        getGradients()
      ])
      
      setFonts(fontsList)
      setFilteredFonts(fontsList)
      
      if (fontsList.length > 0) {
        setSelectedFont(initialData?.font || fontsList[0].family)
      }
      if (gradientsList.length > 0) {
        const initialGradient = initialData?.gradient || {
          ...gradientsList[0],
          id: nanoid(),
          type: 'linear',
          angle: 90,
          stops: gradientsList[0].colors.map((color, index) => ({
            color,
            position: index * 100 / (gradientsList[0].colors.length - 1)
          }))
        };
        setSelectedGradient(initialGradient);
        setGradients(gradientsList)
      }
      
      setLoading(false)
    }
    loadData()
  }, [])

  useEffect(() => {
    const filtered = fonts.filter(font => 
      font.family.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredFonts(filtered)
  }, [searchTerm, fonts])

  useEffect(() => {
    if (selectedFont) {
      const link = document.createElement('link')
      link.href = `https://fonts.googleapis.com/css2?family=${selectedFont.replace(' ', '+')}&display=swap`
      link.rel = 'stylesheet'
      document.head.appendChild(link)
      return () => {
        document.head.removeChild(link)
      }
    }
  }, [selectedFont])

  useEffect(() => {
    if (previewFonts) {
      filteredFonts.forEach(font => {
        const link = document.createElement('link')
        link.href = `https://fonts.googleapis.com/css2?family=${font.family.replace(' ', '+')}&display=swap`
        link.rel = 'stylesheet'
        document.head.appendChild(link)
      })
    }
  }, [previewFonts, filteredFonts])

  const handleDownload = async () => {
    if (previewRef.current) {
      const canvas = await html2canvas(previewRef.current)
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = 'font-preview.png'
      link.click()
    }
  }

  const handleShare = async () => {
    if (selectedGradient) {
      const shareId = await generateShareLink({
        text,
        font: selectedFont,
        gradient: selectedGradient,
        textColor: selectedColor.value,
      })
      const fullShareLink = `${window.location.origin}/share/${shareId}`
      setShareLink(fullShareLink)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading resources...</div>
  }

  const gradientStyle = selectedGradient ? {
    backgroundImage: getGradientCSS(selectedGradient)
  } : undefined

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <Card className="p-6 space-y-6">
          {/* Preview Area */}
          <div 
            ref={previewRef}
            className="aspect-video rounded-lg flex items-center justify-center"
            style={gradientStyle}
          >
            <h2 
              className="text-4xl md:text-6xl text-center px-4"
              style={{ fontFamily: selectedFont, color: selectedColor.value }}
            >
              {text}
            </h2>
          </div>

          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Text</label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text"
              className="w-full"
            />
          </div>

          {/* Font Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Font</label>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Search fonts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex items-center space-x-2">
                <Switch
                  id="preview-fonts"
                  checked={previewFonts}
                  onCheckedChange={setPreviewFonts}
                />
                <Label htmlFor="preview-fonts">Preview fonts in their own style</Label>
              </div>
              <Select
                value={selectedFont}
                onValueChange={setSelectedFont}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent>
                  {filteredFonts.map((font) => (
                    <SelectItem 
                      key={font.family} 
                      value={font.family}
                      style={previewFonts ? { fontFamily: font.family } : {}}
                    >
                      {font.family}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Text Color</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-[200px] justify-start text-left font-normal"
                >
                  <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: selectedColor.value }} />
                  {selectedColor.name}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px]">
                <div className="grid grid-cols-3 gap-2">
                  {colors.map((color) => (
                    <Button
                      key={color.name}
                      variant="outline"
                      className="w-full p-0 aspect-square"
                      style={{ backgroundColor: color.value }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Download and Share Buttons */}
          <div className="flex space-x-4">
            <Button onClick={handleDownload}>Download Image</Button>
            <Button onClick={handleShare}>Generate Share Link</Button>
          </div>

          {/* Share Link Display */}
          {shareLink && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Share Link:</p>
              <Input value={shareLink} readOnly />
            </div>
          )}
        </Card>

        {/* Gradient Customization */}
        <Card className="p-6">
          <Tabs defaultValue="preset" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preset">Preset Gradients</TabsTrigger>
              <TabsTrigger value="custom">Custom Gradient</TabsTrigger>
            </TabsList>
            <TabsContent value="preset">
              <ScrollArea className="h-[600px] pr-4">
                <div className="grid grid-cols-2 gap-2">
                  {gradients.map((gradient) => {
                    // console.log(gradient)
                    return (
                    <button
                      key={gradient.name}
                      onClick={() => setSelectedGradient({
                        ...gradient,
                        id: nanoid(),
                        type: 'linear',
          angle: 90,
          stops: gradient.colors.map((color, index) => ({
            color,
            position: index * 100 / (gradient.colors.length - 1)
          }))
                      })}
                      className={`w-full h-16 rounded-md transition-all ${
                        selectedGradient?.name === gradient.name ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                      }`}
                      style={{
                        backgroundImage: `linear-gradient(to right, ${gradient.colors.join(', ')})`
                      }}
                      title={gradient.name}
                    />
                  )})}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="custom">
              {selectedGradient && (
                <GradientCustomizer
                  gradient={selectedGradient}
                  onChange={setSelectedGradient}
                />
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

function getGradientCSS(gradient: GradientState): string {
  const { type, stops, angle, shape, position } = gradient;
  
  const stopsCSS = stops.map(stop => `${stop.color} ${stop.position}%`).join(', ');
  
  switch (type) {
    case 'linear':
      return `linear-gradient(${angle || 90}deg, ${stopsCSS})`;
    case 'radial':
      const shapeCSS = shape || 'circle';
      const positionCSS = position ? `at ${position.x}% ${position.y}%` : 'at center';
      return `radial-gradient(${shapeCSS} ${positionCSS}, ${stopsCSS})`;
    case 'conic':
      const conicPositionCSS = position ? `from ${position.x}deg at ${position.y}%` : '';
      return `conic-gradient(${conicPositionCSS} ${stopsCSS})`;
    default:
      return `linear-gradient(90deg, ${stopsCSS})`;
  }
}

