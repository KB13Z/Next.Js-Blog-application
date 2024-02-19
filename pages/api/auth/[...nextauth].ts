import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from 'bcrypt';
import { connectToDatabase } from '@/lib/mongo/connect';
import UserModel from "@/lib/models/User";

connectToDatabase();

interface Credentials {
    email: string;
    password: string;
  }
  

const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials: Record<"email" | "password", string> | undefined) => {
                const { email, password } = credentials as Credentials;

                const user = await UserModel.findOne({ email });

                if (!user) {
                  throw new Error('Invalid credentials');
                }

                const isPasswordValid = await compare(password, user.password);

                if (!isPasswordValid) {
                    throw new Error('Invalid credentials');
                }

                return {
                    id: user._id,
                    email: user.email,
                    name: user.username
                }
            }
        })
    ],
    pages: {
        signIn: '/auth'
    }
}

export default NextAuth(authOptions);