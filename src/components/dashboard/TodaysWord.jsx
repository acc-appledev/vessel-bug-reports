import React from "react";

const BIBLICAL_PRINCIPLES = [
  {
    principle: "Discipline",
    verse: '"A man without self-control is like a city broken into and left without walls."',
    reference: "Proverbs 25:28",
    declaration: '"I am a fortified city. I walk in self-control."',
  },
  {
    principle: "Courage",
    verse: '"Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go."',
    reference: "Joshua 1:9",
    declaration: '"I am strong and fearless. God goes before me in every battle."',
  },
  {
    principle: "Faithfulness",
    verse: '"His master said to him, Well done, good and faithful servant. You have been faithful over a little; I will set you over much."',
    reference: "Matthew 25:23",
    declaration: '"I am faithful in the small things. Greater is coming."',
  },
  {
    principle: "Purity",
    verse: '"Blessed are the pure in heart, for they shall see God."',
    reference: "Matthew 5:8",
    declaration: '"I guard my heart. I walk in purity and see God\'s hand in my life."',
  },
  {
    principle: "Perseverance",
    verse: '"Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up."',
    reference: "Galatians 6:9",
    declaration: '"I do not quit. My harvest is coming. I press on."',
  },
  {
    principle: "Humility",
    verse: '"God opposes the proud but shows favor to the humble."',
    reference: "James 4:6",
    declaration: '"I walk humbly. I receive God\'s grace and favor."',
  },
  {
    principle: "Identity",
    verse: '"For we are God\'s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do."',
    reference: "Ephesians 2:10",
    declaration: '"I am God\'s masterpiece. I was made on purpose, for a purpose."',
  },
  {
    principle: "Strength",
    verse: '"I can do all this through him who gives me strength."',
    reference: "Philippians 4:13",
    declaration: '"I am not limited by my own strength. Christ empowers me."',
  },
  {
    principle: "Integrity",
    verse: '"The integrity of the upright guides them, but the unfaithful are destroyed by their duplicity."',
    reference: "Proverbs 11:3",
    declaration: '"I walk with integrity. My word is my bond."',
  },
  {
    principle: "Focus",
    verse: '"Let your eyes look straight ahead; fix your gaze directly before you."',
    reference: "Proverbs 4:25",
    declaration: '"I am focused. I fix my eyes on what matters most."',
  },
  {
    principle: "Renewal",
    verse: '"Do not conform to the pattern of this world, but be transformed by the renewing of your mind."',
    reference: "Romans 12:2",
    declaration: '"My mind is being renewed. I think the thoughts of God."',
  },
  {
    principle: "Purpose",
    verse: '"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future."',
    reference: "Jeremiah 29:11",
    declaration: '"I walk in my God-given purpose. My future is secure."',
  },
  {
    principle: "Generosity",
    verse: '"A generous person will prosper; whoever refreshes others will be refreshed."',
    reference: "Proverbs 11:25",
    declaration: '"I give freely. As I refresh others, I am refreshed."',
  },
  {
    principle: "Peace",
    verse: '"And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."',
    reference: "Philippians 4:7",
    declaration: '"I walk in supernatural peace. My heart and mind are guarded."',
  },
];

function getTodaysWord() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const dayOfYear = Math.floor(diff / 86400000);
  return BIBLICAL_PRINCIPLES[dayOfYear % BIBLICAL_PRINCIPLES.length];
}

export default function TodaysWord() {
  const wordData = getTodaysWord();

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{ background: "linear-gradient(160deg, #2c1f14 0%, #1e1208 60%, #2a1a0e 100%)" }}
    >
      {/* Bible watermark bottom-right */}
      <div
        className="absolute bottom-0 right-4 pointer-events-none select-none"
        style={{ opacity: 0.12 }}
      >
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 20 C50 20 20 18 12 24 L12 82 C20 76 50 78 50 78" stroke="#c9a96e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M50 20 C50 20 80 18 88 24 L88 82 C80 76 50 78 50 78" stroke="#c9a96e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <line x1="50" y1="20" x2="50" y2="78" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" />
          <line x1="22" y1="35" x2="46" y2="33" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="22" y1="44" x2="46" y2="42" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="22" y1="53" x2="46" y2="51" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="54" y1="33" x2="78" y2="35" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="54" y1="42" x2="78" y2="44" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="54" y1="51" x2="78" y2="53" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 space-y-4">
        {/* Label */}
        <p style={{ color: "#c9a96e", fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 600 }}>
          Today's Word · {wordData.principle}
        </p>

        {/* Verse */}
        <p className="font-serif text-2xl leading-snug" style={{ color: "#f5ede0" }}>
          {wordData.verse}
        </p>

        {/* Reference */}
        <p className="text-sm font-medium" style={{ color: "#a07850" }}>
          — {wordData.reference}
        </p>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #3d2a18" }} />

        {/* Declare */}
        <div>
          <p style={{ color: "#7a5c3a", fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 600, marginBottom: "6px" }}>
            Declare
          </p>
          <p className="font-serif italic text-base leading-relaxed" style={{ color: "#c9a96e" }}>
            {wordData.declaration}
          </p>
        </div>
      </div>
    </div>
  );
}