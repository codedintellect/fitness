import './globals.css'
import { Caveat, Marck_Script } from 'next/font/google'

const caveat = Caveat({ subsets: ['latin', 'cyrillic'], variable: "--caveat-font" })
const marck = Marck_Script({ subsets: ['latin', 'cyrillic'], weight: "400", variable: "--marck-font" })

export const metadata = {
  title: 'Fitness',
  description: 'Quick app for booking appointments',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${caveat.variable} ${marck.variable}`}>
      <body>{children}</body>
    </html>
  )
}
