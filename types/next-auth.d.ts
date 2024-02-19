import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { IUser } from "@/lib/models/User";

/*declare module "next-auth" {
    interface Session {
        user: IUser & DefaultSession["user"]
    } 
}

declare module "next-auth/jwt" {
    interface JWT {
        user: IUser & DefaultSession["user"]
    }
}*/