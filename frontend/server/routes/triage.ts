import { RequestHandler } from "express";
import { z } from "zod";
import { TriageResponse } from "@shared/api";

const TriageRequestSchema = z.object({
  symptoms: z.string().min(1, "Symptoms are required"),
});

// Call your trained Flask model API
async function predictWithModel(symptoms: string): Promise<TriageResponse> {
  try {
    const flaskApiUrl = process.env.FLASK_API_URL || "http://localhost:8081";

    console.log("Calling Flask model API for:", symptoms);

    const response = await fetch(`${flaskApiUrl}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms }),
    });

    if (!response.ok) {
      throw new Error(`Flask API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    // Map your Flask model response to our TriageResponse format
    return mapFlaskResponseToTriage(result);

  } catch (error) {
    console.error("Flask model API error:", error);

    // Fallback to rule-based system if Flask API fails
    console.log("Falling back to rule-based system");
    return predictTriageRuleBased(symptoms);
  }
}

// Map Flask model response to TriageResponse format
function mapFlaskResponseToTriage(flaskResult: any): TriageResponse {
  const { triage_code, triage_category } = flaskResult;

  // Map triage categories to emojis and descriptions
  const triageDetails: { [key: string]: { emoji: string; description: string } } = {
    "Red": {
      emoji: "🔴",
      description: "Immediate attention required - Life threatening"
    },
    "Orange": {
      emoji: "🟠",
      description: "Urgent - Should be seen within 30 minutes"
    },
    "Yellow": {
      emoji: "🟡",
      description: "Less urgent - Should be seen within 2 hours"
    },
    "Green": {
      emoji: "🟢",
      description: "Non-urgent - Can wait several hours"
    },
    "Black": {
      emoji: "⚫",
      description: "Assessment needed - Please provide more specific symptoms"
    }
  };

  const details = triageDetails[triage_category] || triageDetails["Black"];

  return {
    category: triage_category as "Red" | "Orange" | "Yellow" | "Green" | "Black",
    severity: triage_code,
    emoji: details.emoji,
    description: details.description
  };
}

// Simple rule-based triage system (fallback)
function predictTriageRuleBased(symptoms: string): TriageResponse {
  const symptomText = symptoms.toLowerCase();
  
  // Critical/Red (Level 4)
  if (
    symptomText.includes("chest pain") ||
    symptomText.includes("difficulty breathing") ||
    symptomText.includes("severe bleeding") ||
    symptomText.includes("unconscious") ||
    symptomText.includes("cardiac arrest") ||
    symptomText.includes("stroke") ||
    symptomText.includes("severe trauma")
  ) {
    return {
      category: "Red",
      severity: 4,
      emoji: "🔴",
      description: "Immediate attention required - Life threatening"
    };
  }
  
  // Urgent/Orange (Level 3)
  if (
    symptomText.includes("severe pain") ||
    symptomText.includes("high fever") ||
    symptomText.includes("vomiting blood") ||
    symptomText.includes("severe headache") ||
    symptomText.includes("broken bone") ||
    symptomText.includes("seizure")
  ) {
    return {
      category: "Orange",
      severity: 3,
      emoji: "🟠",
      description: "Urgent - Should be seen within 30 minutes"
    };
  }
  
  // Less urgent/Yellow (Level 2)
  if (
    symptomText.includes("moderate pain") ||
    symptomText.includes("fever") ||
    symptomText.includes("nausea") ||
    symptomText.includes("dizziness") ||
    symptomText.includes("rash") ||
    symptomText.includes("cough") ||
    symptomText.includes("abdominal pain")
  ) {
    return {
      category: "Yellow",
      severity: 2,
      emoji: "🟡",
      description: "Less urgent - Should be seen within 2 hours"
    };
  }
  
  // Non-urgent/Green (Level 1)
  if (
    symptomText.includes("minor") ||
    symptomText.includes("cold") ||
    symptomText.includes("runny nose") ||
    symptomText.includes("sore throat") ||
    symptomText.includes("minor cut") ||
    symptomText.includes("bruise")
  ) {
    return {
      category: "Green",
      severity: 1,
      emoji: "🟢",
      description: "Non-urgent - Can wait several hours"
    };
  }
  
  // Default to Black (Level 0) for unclear symptoms
  return {
    category: "Black",
    severity: 0,
    emoji: "⚫",
    description: "Assessment needed - Please provide more specific symptoms"
  };
}

export const handleTriagePrediction: RequestHandler = async (req, res) => {
  try {
    const { symptoms } = TriageRequestSchema.parse(req.body);
    
    // Simulate API processing time (remove this when using real model)
    await new Promise(resolve => setTimeout(resolve, 1500));

    const prediction = await predictWithModel(symptoms);
    
    res.json(prediction);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid input",
        details: error.errors
      });
    }
    
    console.error("Triage prediction error:", error);
    res.status(500).json({
      error: "Internal server error"
    });
  }
};
