'use client'
import { NextPage } from "next"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const Protected: NextPage = (): JSX.Element => {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') router.replace('/auth');
    }, [status, router]);

        if (status === 'authenticated')
            return (
                <div>This page is for protected people</div>
            );
    
    return <div>Loading...</div>
}

export default Protected