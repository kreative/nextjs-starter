import { NextApiRequest, NextApiResponse } from "next";
import analytics from "@/lib/analytics-node";

interface SurveyRequest extends NextApiRequest {
  body: {
    ksn: string | number;
    reasons: string[];
    feedback?: string;
  };
}

export default async function handler(req: SurveyRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const response = await fetch('https://api.airtable.com/v0/appwdX9Mo2aviKhk5/tblt6DnlA2wTRqVn6', {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      records: [{
        fields: {
          KSN: req.body.ksn.toString(),
          Reasons: req.body.reasons,
          Feedback: req.body.feedback,
        }
      }],
    }),
  })

  if (!response.ok) {
    return res.status(500).json({ message: "Failed to save survey" });
  }

  analytics.identify({
    userId: req.body.ksn.toString(),
  })
  
  analytics.track({
    userId: req.body.ksn.toString(),
    event: 'exit_survey_completed',
    properties: {
      reasons: req.body.reasons,
      feedback: req.body.feedback,
    },
  })

  return res.status(200).json({ message: "Success" });
}