'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import styles from './page.module.css'

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession()

  const handleSignInClick = () => {
    router.push('auth')
  }

  const handleSignUpClick = () => {
    router.push('/register')
  }


  return (
    <main className={styles.homepage}>
      <section className={styles.introduction}>
        <Image
          src="/cat-reaching.svg"
          width={160}
          height={200}
          alt="Cat on back paws"
        />
        <div className={styles.introductionText}>
          <h2>Welcome to Kitty Bean Blogs!</h2>
          <h3>🐾 Hello, fellow cat enthusiasts and blogging aficionados! 🐾</h3>
          <p>
            At Kitty Bean Blogs, we have created a purr-fect space for you to unleash your creativity, 
            share your thoughts, and connect with a community of like-minded individuals. Whether you 
            are a seasoned writer or a feline fanatic with a story to tell, our platform is your canvas.
          </p>
        </div>
        <Image
          src="/cat-reaching.svg"
          width={160}
          height={200}
          className={styles.mirroredCat}
          alt="Cat on back paws"
        />
      </section>
      <section className={styles.sectionGreen}>
        <div className={styles.sectionText}>
          <h3>📚 Dive into a World of Topics</h3>
          <p>
            Our blogs cover a wide range of subjects—from heartwarming tales of whiskered wonders to 
            insightful discussions on the latest trends. Whether you are into pet care, lifestyle, or 
            just love a good cat meme, we have got something for everyone.
          </p>
        </div>
        <Image
          src="/cats-library.jpg"
          width={400}
          height={300}
          className={styles.catsImage}
          alt="Cats in library"
        />
      </section>
      <section className={styles.sectionBlue}>
        <Image
          src="/cat-meowing.jpg"
          width={400}
          height={300}
          className={styles.catsImage}
          alt="Meowing cat"
        />
        <div className={styles.sectionText}>
          <h3>🖋️ Your Voice Matters</h3>
          <p>
            Kitty Bean Blogs is not just a platform; it is a community where your voice matters. 
            Sign in to unlock the ability to create your own blogs, share your experiences, and 
            join the conversation. We believe in the power of storytelling, and your unique 
            perspective can make a difference.
          </p>
          {!session && (
            <button type='button' className={styles.signButton} onClick={handleSignInClick}>
              Sign in
            </button>
          )}
        </div>
      </section>
      <section className={styles.sectionGreen}>
        <div className={styles.sectionText}>
          <h3>💬 Engage and Connect</h3>
          <p>
            The magic happens in the comments! Share your thoughts, exchange ideas, and build 
            connections with fellow Kitty Bean enthusiasts. Our vibrant community is waiting to 
            welcome you with open paws.
          </p>
        </div>
        <Image
          src="/affectionate-cats.jpg"
          width={400}
          height={300}
          className={styles.catsImage}
          alt="Affectionate cats"
        />
      </section>
      <section className={styles.sectionBlue}>
        <Image
          src="/gangster-cats.jpg"
          width={400}
          height={300}
          className={styles.catsImage}
          alt="Cool cats"
        />
      <div className={styles.sectionText}>
        <h3>🔒 Exclusive Access</h3>
        <p>
          To ensure a safe and engaging environment, signing in is a breeze. Become a part of our 
          community by creating an account, and enjoy exclusive features like creating your blogs, 
          interacting with other users, and personalizing your Kitty Bean experience.
        </p>
        {!session && (
          <button type='button' className={styles.signButton} onClick={handleSignUpClick}>
            Sign up
          </button>
        )}
      </div>
      </section>
      <footer className={styles.footer}>
        <p>
          So, what are you waiting for? Unleash your inner wordsmith, share your love for all things 
          feline, and embark on a blogging adventure with Kitty Bean Blogs. Join us in celebrating the 
          joy, quirks, and infinite charm of our feline companions!
        </p>
        <h3>🐱✨ Meow-velous adventures await! ✨🐱</h3>
      </footer>
    </main>
  )
}
