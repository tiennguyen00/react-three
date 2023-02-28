"use client"

import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <div className="w-screen h-screen">{children}</div>
      </body>
    </html>
  )
}
