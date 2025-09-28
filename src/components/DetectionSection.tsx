import React, { useState, useRef } from "react";
import { Camera, Upload, Scan, CheckCircle, AlertTriangle, Lightbulb, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DetectionSectionProps {
  translations: any;
  user?: { name: string; authenticated: boolean }; // Optional auth
}

interface DetectionResult {
  disease: string;
  confidence: number;
  severity: "Low" | "Moderate" | "High";
  treatment: string;
  prevention: string;
  crop: string;
}

const DetectionSection: React.FC<DetectionSectionProps> = ({ translations, user }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError(translations.errors.invalidFile);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setDetectionResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetection = async () => {
    if (!selectedImage) {
      setError(translations.errors.noImage);
      return;
    }

    setIsDetecting(true);
    setError(null);

    try {
      // TODO: Replace with actual AI detection API
      const mockResult: DetectionResult = {
        disease: "Late Blight",
        confidence: 94,
        severity: "Moderate",
        treatment:
          "Apply copper-based fungicide immediately. Remove affected leaves and improve air circulation around plants.",
        prevention:
          "Ensure proper spacing between plants, avoid overhead watering, and apply preventive fungicide during humid conditions.",
        crop: "Tomato",
      };

      // Simulate network delay
      setTimeout(() => {
        setDetectionResult(mockResult);
        setIsDetecting(false);
      }, 2000);
    } catch (err) {
      setError(translations.errors.detectionFailed);
      setIsDetecting(false);
    }
  };

  const openCamera = () => {
    alert(translations.messages.cameraPlaceholder);
  };

  const clearImage = () => {
    setSelectedImage(null);
    setDetectionResult(null);
    setError(null);
  };

  return (
    <section id="detect" className="py-20 bg-gradient-earth">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {translations.detection.title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {translations.detection.subtitle}
            </p>
            {user && !user.authenticated && (
              <p className="text-warning mt-2">{translations.messages.loginRequired}</p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5 text-primary" />
                  {translations.detection.uploadTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image Preview */}
                {selectedImage ? (
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Selected crop"
                      className="w-full h-64 object-cover rounded-lg border-2 border-border"
                    />
                    <button
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-error text-error-foreground rounded-full w-8 h-8 flex items-center justify-center hover:bg-error/90 transition-fast"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                    <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      {translations.detection.noImage}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    variant="farmer"
                    size="lg"
                    onClick={openCamera}
                    className="w-full"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    {translations.detection.buttons.camera}
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    {translations.detection.buttons.upload}
                  </Button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Detect Button */}
                {selectedImage && (
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={handleDetection}
                    disabled={isDetecting || (user && !user.authenticated)}
                    className="w-full"
                  >
                    {isDetecting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        <span>{translations.detection.analyzing}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Scan className="h-5 w-5" />
                        <span>{translations.detection.buttons.detect}</span>
                      </div>
                    )}
                  </Button>
                )}

                {/* Error Message */}
                {error && <p className="text-error text-sm mt-2">{error}</p>}
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  {translations.detection.results.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {detectionResult ? (
                  <div className="space-y-6">
                    {/* Disease Info */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold text-foreground">
                          {detectionResult.disease}
                        </h3>
                        <Badge
                          variant={detectionResult.confidence > 90 ? "default" : "secondary"}
                          className="text-sm"
                        >
                          {detectionResult.confidence}% {translations.detection.results.confidence}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{translations.detection.results.crop}:</span>
                        <span className="font-medium">{detectionResult.crop}</span>
                        <span className="text-sm text-muted-foreground">{translations.detection.results.severity}:</span>
                        <Badge
                          variant={
                            detectionResult.severity === "High"
                              ? "destructive"
                              : detectionResult.severity === "Moderate"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {detectionResult.severity}
                        </Badge>
                      </div>
                    </div>

                    {/* Treatment */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        {translations.detection.results.treatment}
                      </h4>
                      <p className="text-sm text-muted-foreground bg-warning/10 p-3 rounded-lg">
                        {detectionResult.treatment}
                      </p>
                    </div>

                    {/* Prevention */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-accent" />
                        {translations.detection.results.prevention}
                      </h4>
                      <p className="text-sm text-muted-foreground bg-accent/10 p-3 rounded-lg">
                        {detectionResult.prevention}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Scan className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">
                      {translations.detection.results.placeholder}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetectionSection;
