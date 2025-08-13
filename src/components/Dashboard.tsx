import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Droplets, Lightbulb, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WaterFootprintData {
  name: string;
  keywords: string[];
  water_consumption: number;
  unit: string;
  fun_fact: string;
}

const Dashboard = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [detectedItem, setDetectedItem] = useState<WaterFootprintData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dataset, setDataset] = useState<{ items: WaterFootprintData[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load dataset
  const loadDataset = async () => {
    try {
      const response = await fetch("/water_footprint.json");
      const data = await response.json();
      setDataset(data);
    } catch (error) {
      console.error("Failed to load dataset:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load water footprint data"
      });
    }
  };

  // Simulate item detection
  const detectItem = (imageFile: File): WaterFootprintData | null => {
    if (!dataset) return null;
    
    // Simple keyword matching simulation
    const fileName = imageFile.name.toLowerCase();
    const randomItem = dataset.items[Math.floor(Math.random() * dataset.items.length)];
    
    // Try to match filename with keywords
    for (const item of dataset.items) {
      for (const keyword of item.keywords) {
        if (fileName.includes(keyword.toLowerCase())) {
          return item;
        }
      }
    }
    
    // Return random item if no match found
    return randomItem;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file",
        description: "Please upload a JPEG or PNG image"
      });
      return;
    }

    // Load dataset if not already loaded
    if (!dataset) {
      await loadDataset();
    }

    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Simulate analysis
    setIsAnalyzing(true);
    setTimeout(() => {
      const detected = detectItem(file);
      setDetectedItem(detected);
      setIsAnalyzing(false);
      
      if (detected) {
        toast({
          title: "Detection Complete!",
          description: `Found: ${detected.name}`
        });
      }
    }, 2000);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setDetectedItem(null);
    setIsAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <Droplets className="h-10 w-10 text-primary" />
            Water Footprint Detector
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload an image to discover the hidden water consumption of everyday items
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Image
            </CardTitle>
            <CardDescription>
              Upload a JPEG or PNG image of an item to analyze its water footprint
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="mb-4 bg-gradient-water hover:opacity-90"
                disabled={isAnalyzing}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                {isAnalyzing ? "Analyzing..." : "Choose Image"}
              </Button>
              
              {selectedImage && (
                <div className="mt-4 text-center">
                  <img
                    src={selectedImage}
                    alt="Uploaded item"
                    className="max-w-full max-h-64 rounded-lg shadow-lg mb-4"
                  />
                  <Button
                    variant="outline"
                    onClick={resetAnalysis}
                    disabled={isAnalyzing}
                  >
                    Upload New Image
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Status */}
        {isAnalyzing && (
          <Alert className="mb-8">
            <Droplets className="h-4 w-4 animate-spin" />
            <AlertDescription>
              Analyzing image and calculating water footprint...
            </AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {detectedItem && !isAnalyzing && (
          <Card className="border-primary/20 shadow-water">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Droplets className="h-6 w-6" />
                Water Footprint Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{detectedItem.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      {detectedItem.water_consumption.toLocaleString()} {detectedItem.unit}
                    </Badge>
                  </div>
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">Did you know?</h4>
                      <p className="text-muted-foreground">{detectedItem.fun_fact}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="mt-8 bg-gradient-to-r from-muted/50 to-accent/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Understanding Water Footprints</h3>
              <p className="text-muted-foreground">
                A water footprint measures the total amount of water used to produce goods and services.
                This includes water for growing, processing, packaging, and transporting items.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;