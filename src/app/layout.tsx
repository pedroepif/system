import "./globals.css";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body>
        <main className="flex flex-col h-screen w-screen">{children}</main>
      </body>
    </html>
  );
}
