// app/layout.tsx
import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Door.id',                // Ganti sesuai kebutuhan
  description: 'Short link platform sederhana'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <head />
      <body>
        {children}
      </body>
    </html>
  )
}
