import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

//components
import Header from './Components/Header/Heading/Header'
import Provider from './Provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Blog application',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
  isAuthenticated,
  username,
  handleSignOut,
}: {
  children: React.ReactNode;
  isAuthenticated: boolean;
  username: string;
  handleSignOut: () => Promise<void>;
}) {  
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <Header isAuthenticated={isAuthenticated} onSignOut={handleSignOut} username={username} />
          {children}
        </Provider>
      </body>
    </html>
  )
}
