import { PrismaClient } from "@prisma/client";

export const db = globalThis.prisma || new PrismaClient()   //So that we dont have multiple clients on user reload


//storing it in a global variable
if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
}