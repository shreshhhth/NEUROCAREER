"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

//Google generate AI instance 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
//Defining model for genAI
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
})

//If user does not have industry insights then AI will generate it by using below function
export const generateAiInsights = async (industry) => {
    const prompt = `Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "HIGH" | "MEDIUM" | "LOW",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.`;

    const result = await model.generateContent(prompt);
    const response = result.response;

    //After generating the response in the format mentioned in the promp, now we fetch the text from inside of it
    const text = response.text()

    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim()

    return JSON.parse(cleanedText); //Json formatted string to Javascript object
}


export async function getIndustryInsights() {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
        include: {
            industryInsight: true,
        }
    })

    if (!user) throw new Error("User not found")

    //If the user does not have industry insight, then we will generate insights using the function generateAiInsights()
    if (!user.industryInsight) {
        const insights = await generateAiInsights(user.industry)

        const industryInsight = await db.industryInsight.create({
            data: {
                industry: user.industry,
                ...insights,

                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 100),
            }
        })
        return industryInsight;
    }
    //If the user already have the industryInsight then simply return it
    return user.industryInsight;
}