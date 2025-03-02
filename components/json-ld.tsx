export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Habits Tracker",
    description:
      "Track your daily habits, achieve your goals, and become the best version of yourself with our free habit tracking app.",
    applicationCategory: "Productivity",
    operatingSystem: "Any",
    author: {
      "@type": "Person",
      name: "Filshu",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Habit tracking",
      "Pomodoro timer",
      "Progress statistics",
      "Daily motivation quotes",
      "Monthly overview",
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

