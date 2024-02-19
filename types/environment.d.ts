namespace NodeJS {
    interface ProcessEnv extends NodeJS.ProcessEnv {
        MONGO_URI: string;
        NEXTAUTH_URL: string;
        NEXTAUTH_SECRET: string;
    }
}