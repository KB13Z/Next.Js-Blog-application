import Image from 'next/image'
import styles from './Header.module.css'

//components
import Navigation from '../Navigation/Navigation'
import SigningButtons from '../SigningButtons/SigningButtons'

interface HeaderProps {
  isAuthenticated: boolean;
  onSignOut: () => void;
  username?: string;
}

export default function Header({ isAuthenticated, onSignOut, username }: HeaderProps) {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerWrapper}>
        <header className={styles.header}>
            <div className={styles.nameWrapper}>
                <Image
                    src="./kitty.svg"
                    width={40}
                    height={40}
                    className={styles.mirrorImage}
                    alt="Kitty"
                />
                <h1 className={styles.mainHeading}>Kitty Bean Blogs</h1>
                <Image
                    src="./kitty.svg"
                    width={40}
                    height={40}
                    className={styles.headerImage}
                    alt="Kitty"
                />
            </div>
        </header>
        <Navigation />
      </div>
      <SigningButtons onSignOut={onSignOut} />
    </div>
  )
}
