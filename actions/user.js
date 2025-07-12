"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { generateAiInsights } from "./dashboard";

export async function updateUser(data) {
    const { userId } = await auth();
    // console.log(userId);
    const authResult = await auth();
    console.log("userId", userId);
    console.log("typeof userId", typeof userId.userId);


    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        }
    })

    if (!user) throw new Error("User not found");

    try {

        const result = await db.$transaction(
            async (tx) => {
                //find is the industry exists
                let industryInsight = await tx.industryInsight.findUnique({
                    where: {
                        industry: data.industry,
                    }
                })

                //if industry does not exists, create it with default values - will replace it with ai later
                if (!industryInsight) {
                    const insights = await generateAiInsights(data.industry)

                    industryInsight = await db.industryInsight.create({
                        data: {
                            industry: data.industry,
                            ...insights,

                            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 100),
                        }
                    })
                }


                //update the user
                const updatedUser = await tx.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        industryInsight: {
                            connect: {
                                industry: data.industry,
                            },
                        },
                        experience: data.experience,
                        bio: data.bio,
                        skills: data.skills,
                    },
                })

                return { updatedUser, industryInsight }

            }, { timeout: 10000, }
        )

        return { success: true, ...result };
    } catch (error) {
        console.error("Error updating the user and industry:", error.message)
        throw new Error("Failed to update profile" + error.message)
    }

}


//Function for Fetching the onboarding status

export async function getUserOnboardingStatus() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    try {
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId,
            },
            select: {
                industry: true,
            },
        });

        if (!user) throw new Error("User not found");

        return { isOnboarded: !!user.industry };
    } catch (error) {
        console.error("Error checking the onboarding status:", error.message);
        throw new Error("Failed to check onboarding status");
    }
}
