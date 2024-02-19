import Link from 'next/link'
import styles from './Navigation.module.css'

export default function Navigation() {
  return (
    <nav className={styles.navigation}>
        <Link href="/" className={styles.navigationLink}>Home</Link>
        <p>|</p>
        <Link href="/blogs" className={styles.navigationLink}>Blogs</Link>
        <p>|</p>
        <Link href="/create-a-blog-post" className={styles.navigationLink}>Create a blog post</Link>
    </nav>
  )
}
