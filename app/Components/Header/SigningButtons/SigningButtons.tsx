'use client'
import React from 'react'
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import styles from './SigningButtons.module.css'

interface SigningButtonsProps {
  onSignOut: () => void;
}

export default function SigningButtons({ onSignOut }: SigningButtonsProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignInClick = () => {
    router.push('/auth')
  }

  const handleSignUpClick = () => {
    router.push('/register')
  }

  const handleSignOutClick = () => {
    signOut();
    onSignOut();
  };

  return (
    <div className={`${styles.buttonsWrapper} ${session ? styles.authenticatedWrapper : ''}`}>
      {session ? (
        <>
          <div className={styles.userGreeting}>Hi, {session.user?.name}!</div>
          <button type="button" className={styles.signButton} onClick={handleSignOutClick}>
            Sign out
          </button>
        </>
      ) : (
        <>
          <button type="button" className={styles.signButton} onClick={handleSignInClick}>
            Sign in
          </button>
          <button type="button" className={styles.signButton} onClick={handleSignUpClick}>
            Sign up
          </button>
        </>
      )}
    </div>
  )
}
