export const metadata: Metadata = {
  title: {
    default: 'Door.ID – Shortlink & Link Bio Indonesia',
    template: '%s | Door.ID',
  },
  description:
    'Door.ID adalah platform shortlink dan link bio buatan Indonesia. Fitur lengkap: linktree, shortlink, custom WhatsApp link, dan paste text.',
  keywords: [
    'shortlink',
    'link bio',
    'linktree',
    'whatsapp link',
    'paste text',
    'pemendek url indonesia',
    'door.id',
  ],
  authors: [{ name: 'Door.ID Team', url: 'https://door.id' }],
  creator: 'Door.ID',
  publisher: 'Door.ID',
  generator: 'Next.js + Vercel',

  openGraph: {
    title: 'Door.ID – Shortlink & Link Bio Indonesia',
    description:
      'Platform shortlink & link bio modern. Bikin linktree, shortlink, custom WhatsApp link, dan paste text gratis di Door.ID.',
    url: 'https://door.id',
    siteName: 'Door.ID',
    images: [
      {
        url: 'https://door.id/og-image.jpg', // pasang banner OG
        width: 1200,
        height: 630,
        alt: 'Door.ID – Shortlink & Link Bio',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Door.ID – Shortlink & Link Bio Indonesia',
    description:
      'Door.ID: buat shortlink, linktree, custom WhatsApp link, dan paste text gratis. Cepat, mudah, dan tanpa ribet.',
    site: '@door_id', // kalau ada akun X
    images: ['https://door.id/og-image.jpg'],
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}
