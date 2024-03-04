import Link from 'next/link'
import styles from './Navigation.module.css'

export default function Navigation() {
  return (
    <nav className={styles.navigation}>
        <hr className={styles.horizontalDivider}></hr>
        <Link href="/" className={styles.navigationLink}>Home</Link>
        <p className={styles.verticalDivider}>|</p>
        <hr className={styles.horizontalDivider}></hr>
        <Link href="/blogs" className={styles.navigationLink}>Blogs</Link>
        <p className={styles.verticalDivider}>|</p>
        <hr className={styles.horizontalDivider}></hr>
        <Link href="/create-a-blog-post" className={styles.navigationLink}>Create a blog post</Link>
        <hr className={styles.horizontalDivider}></hr>
    </nav>
  )
}
