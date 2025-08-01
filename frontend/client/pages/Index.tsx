import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TriageResponse, TriageRequest } from "@shared/api";
import { Loader2, Heart, AlertTriangle, Clock, Info } from "lucide-react";

export default function Index() {
  const [symptoms, setSymptoms] = useState("");
  const [prediction, setPrediction] = useState<TriageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!symptoms.trim()) {
      setError("Please enter your symptoms");
      return;
    }

    setIsLoading(true);
    setError("");
    setPrediction(null);

    try {
      const request: TriageRequest = { symptoms: symptoms.trim() };
      const response = await fetch("/api/triage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error("Failed to get triage prediction");
      }

      const data: TriageResponse = await response.json();
      setPrediction(data);
    } catch (err) {
      setError("Failed to predict triage level. Please try again.");
      console.error("Triage prediction error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTriageColor = (category: string) => {
    switch (category) {
      case "Red": return "bg-triage-red text-triage-red-foreground border-triage-red";
      case "Orange": return "bg-triage-orange text-triage-orange-foreground border-triage-orange";
      case "Yellow": return "bg-triage-yellow text-triage-yellow-foreground border-triage-yellow";
      case "Green": return "bg-triage-green text-triage-green-foreground border-triage-green";
      case "Black": return "bg-triage-black text-triage-black-foreground border-triage-black";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getSeverityIcon = (severity: number) => {
    if (severity >= 4) return <AlertTriangle className="h-5 w-5" />;
    if (severity >= 3) return <Heart className="h-5 w-5" />;
    if (severity >= 2) return <Clock className="h-5 w-5" />;
    return <Info className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Floating medical background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-blue-100 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}>
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8z"/>
            </svg>
          </div>
        </div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-green-100 rounded-full opacity-20 animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}>
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        </div>
        <div className="absolute bottom-32 left-20 w-14 h-14 bg-red-100 rounded-full opacity-20 animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}}>
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-7 h-7 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>
        <div className="absolute bottom-20 right-10 w-10 h-10 bg-yellow-100 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3.5s'}}>
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
        </div>
        <div className="absolute top-60 left-1/3 w-8 h-8 bg-purple-100 rounded-full opacity-20 animate-bounce" style={{animationDelay: '1.5s', animationDuration: '4.5s'}}>
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header with Medical Images */}
        <div className="text-center mb-8 relative">
          {/* Decorative medical icons */}
          <div className="absolute top-0 left-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center opacity-60">
            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 6h5v2h2V6h1V4H4v2zm0 4h8v2H4v-2zm0 4h8v2H4v-2z"/>
            </svg>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center opacity-60">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>

          {/* Main header with medical imagery */}
          <div className="mb-6">
            <div className="flex justify-center items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                🏥 Triage Predictor
              </h1>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
            </div>
          </div>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI-powered medical triage assessment to help prioritize emergency care based on symptoms
          </p>

          {/* Medical professionals illustration */}
          <div className="mt-6 flex justify-center space-x-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-10 h-10 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <span className="text-sm text-gray-500">Doctor</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <span className="text-sm text-gray-500">Nurse</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <span className="text-sm text-gray-500">Medic</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Input Form */}
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm relative overflow-hidden">
            {/* Medical background pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <svg className="w-full h-full text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>

            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 6V4h-4v2h4zM4 8v11h16V8H4zm16-2c0-1.11-.89-2-2-2h-4.18C13.4 2.84 12.3 2 11 2S8.6 2.84 8.18 4H4c-1.11 0-2 .89-2 2v11c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z"/>
                  </svg>
                </div>
                Enter Your Symptoms
              </CardTitle>
              <CardDescription>
                Describe your symptoms separated by commas (e.g., "chest pain, difficulty breathing, dizziness")
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Enter symptoms separated by commas..."
                    className="text-base h-12 bg-white border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                    disabled={isLoading}
                  />
                  {error && (
                    <p className="text-sm text-destructive mt-2">{error}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ⏳ Predicting...
                    </>
                  ) : (
                    "Predict Triage Level"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Prediction Result */}
          {prediction && (
            <Card className={`shadow-lg border-2 ${getTriageColor(prediction.category)}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="text-3xl">{prediction.emoji}</span>
                  <div>
                    <div className="text-xl font-bold">
                      {prediction.category} Priority
                    </div>
                    <div className="text-sm opacity-90 flex items-center gap-2">
                      {getSeverityIcon(prediction.severity)}
                      Severity Level: {prediction.severity}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base font-medium">
                  {prediction.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Information Section */}
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm relative overflow-hidden">
            {/* Medical background illustrations */}
            <div className="absolute top-0 left-0 w-24 h-24 opacity-5">
              <svg className="w-full h-full text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div className="absolute bottom-0 right-0 w-20 h-20 opacity-5">
              <svg className="w-full h-full text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>

            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Info className="h-4 w-4 text-blue-600" />
                </div>
                Triage Level Guide
                <div className="ml-auto flex space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🔴</span>
                  <div>
                    <strong>Red (Critical):</strong> Life-threatening conditions requiring immediate attention
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🟠</span>
                  <div>
                    <strong>Orange (Urgent):</strong> Serious conditions requiring attention within 30 minutes
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🟡</span>
                  <div>
                    <strong>Yellow (Less Urgent):</strong> Conditions that should be seen within 2 hours
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🟢</span>
                  <div>
                    <strong>Green (Non-urgent):</strong> Minor conditions that can wait several hours
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">⚫</span>
                  <div>
                    <strong>Black (Assessment):</strong> Requires further assessment or unclear symptoms
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
