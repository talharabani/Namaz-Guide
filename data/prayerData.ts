// Enhanced Prayer Steps Data with Images, Videos, Hadith, and Quranic Ayahs
// TODO: Replace placeholder image URLs with actual images provided by user

export interface Hadith {
  text: string;
  reference: string;
}

export interface QuranAyah {
  text: string;
  reference: string;
}

export interface PrayerStep {
  id: string;
  title: string;
  description: string;
  arabic: string;
  translation: string;
  transliteration: string;
  icon: string;
  color: string;
  // New enhanced properties
  image: string; // URL to image for this step
  videoUrl?: string; // Optional YouTube or mp4 link
  details: string; // Step-by-step description text
  hadith?: Hadith; // Optional hadith related to this step
  quranAyah?: QuranAyah; // Optional Quranic ayah related to this step
}

export const prayerSteps: PrayerStep[] = [
  {
    id: '1',
    title: 'Niyyah (Intention)',
    description: 'Make the intention to perform the prayer',
    arabic: 'نِيَّة',
    translation: 'Intention',
    transliteration: 'Niyyah',
    icon: 'heart-outline',
    color: '#10b981',
    // TODO: Replace with actual image URL - Use the provided images for each prayer step
    // For Niyyah: Use the image of the man in prayer posture with hands raised
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=example1', // TODO: Replace with actual video URL
    details: 'Before starting the prayer, make a clear intention in your heart to perform the specific prayer (Fajr, Dhuhr, Asr, Maghrib, or Isha). The intention should be made silently and does not need to be spoken aloud.',
    hadith: {
      text: 'Actions are according to intentions, and every person will have what he intended.',
      reference: 'Sahih Bukhari 1:1'
    },
    quranAyah: {
      text: 'And they were not commanded except to worship Allah, [being] sincere to Him in religion.',
      reference: 'Quran 98:5'
    }
  },
  {
    id: '2',
    title: 'Takbir',
    description: 'Raise hands and say Allahu Akbar',
    arabic: 'اللهُ أَكْبَر',
    translation: 'Allah is the Greatest',
    transliteration: 'Allahu Akbar',
    icon: 'hand-right-outline',
    color: '#3b82f6',
    // TODO: Replace with actual image URL - Use the provided images for each prayer step
    // For Niyyah: Use the image of the man in prayer posture with hands raised
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=example2', // TODO: Replace with actual video URL
    details: 'Raise both hands up to the level of your ears or shoulders while saying "Allahu Akbar" (Allah is the Greatest). This marks the beginning of the prayer and should be done with reverence and focus.',
    hadith: {
      text: 'The Prophet (peace be upon him) used to raise his hands to the level of his shoulders when he started the prayer.',
      reference: 'Sahih Bukhari 735'
    },
    quranAyah: {
      text: 'And Allah is the Greatest, the Most High.',
      reference: 'Quran 2:255'
    }
  },
  {
    id: '3',
    title: 'Qiyam (Standing)',
    description: 'Stand and recite Al-Fatiha',
    arabic: 'بِسْمِ اللهِ الرّحمن الرّحيم',
    translation: 'In the name of Allah, the Most Gracious, the Most Merciful',
    transliteration: 'Bismillah ir-Rahman ir-Raheem',
    icon: 'person-outline',
    color: '#8b5cf6',
    // TODO: Replace with actual image URL - Use the provided images for each prayer step
    // For Niyyah: Use the image of the man in prayer posture with hands raised
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=example3', // TODO: Replace with actual video URL
    details: 'Stand upright with your feet shoulder-width apart, hands placed over your chest (right hand over left), and recite Surah Al-Fatiha followed by another Surah or verses from the Quran.',
    hadith: {
      text: 'There is no prayer for the one who does not recite Al-Fatiha.',
      reference: 'Sahih Bukhari 756'
    },
    quranAyah: {
      text: 'Recite what has been revealed to you of the Book and establish prayer.',
      reference: 'Quran 29:45'
    }
  },
  {
    id: '4',
    title: 'Ruku (Bowing)',
    description: 'Bow down and say Subhana Rabbi al-Azeem',
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيم',
    translation: 'Glory to my Lord, the Great',
    transliteration: 'Subhana Rabbi al-Azeem',
    icon: 'arrow-down-outline',
    color: '#f59e0b',
    // TODO: Replace with actual image URL - Use the provided images for each prayer step
    // For Niyyah: Use the image of the man in prayer posture with hands raised
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=example4', // TODO: Replace with actual video URL
    details: 'Bend forward from the waist, keeping your back straight, and place your hands on your knees. Your back should be parallel to the ground. Say "Subhana Rabbi al-Azeem" (Glory to my Lord, the Great) three times.',
    hadith: {
      text: 'The Prophet (peace be upon him) used to say in Ruku: "Subhana Rabbi al-Azeem" (Glory to my Lord, the Great).',
      reference: 'Sahih Muslim 772'
    },
    quranAyah: {
      text: 'And bow with those who bow.',
      reference: 'Quran 2:43'
    }
  },
  {
    id: '5',
    title: 'Sujood (Prostration)',
    description: 'Prostrate and say Subhana Rabbi al-A\'la',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى',
    translation: 'Glory to my Lord, the Most High',
    transliteration: 'Subhana Rabbi al-A\'la',
    icon: 'arrow-down-circle-outline',
    color: '#ef4444',
    // TODO: Replace with actual image URL - Use the provided images for each prayer step
    // For Niyyah: Use the image of the man in prayer posture with hands raised
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=example5', // TODO: Replace with actual video URL
    details: 'Go down to the ground with your forehead, nose, both palms, both knees, and toes touching the ground. Say "Subhana Rabbi al-A\'la" (Glory to my Lord, the Most High) three times. This is the most humble position in prayer.',
    hadith: {
      text: 'The closest a servant is to his Lord is when he is in prostration.',
      reference: 'Sahih Muslim 482'
    },
    quranAyah: {
      text: 'And prostrate and draw near [to Allah].',
      reference: 'Quran 96:19'
    }
  },
  {
    id: '6',
    title: 'Tashahhud',
    description: 'Sit and recite the testimony of faith',
    arabic: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا الله',
    translation: 'I bear witness that there is no god but Allah',
    transliteration: 'Ashhadu an la ilaha illa Allah',
    icon: 'book-outline',
    color: '#06b6d4',
    // TODO: Replace with actual image URL - Use the provided images for each prayer step
    // For Niyyah: Use the image of the man in prayer posture with hands raised
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=example6', // TODO: Replace with actual video URL
    details: 'Sit with your right foot upright and left foot flat on the ground. Place your hands on your thighs and recite the Tashahhud, bearing witness to the oneness of Allah and the prophethood of Muhammad (peace be upon him).',
    hadith: {
      text: 'The Prophet (peace be upon him) taught us the Tashahhud in the same way he taught us a Surah from the Quran.',
      reference: 'Sahih Bukhari 6265'
    },
    quranAyah: {
      text: 'And [mention] when your Lord took from the children of Adam their descendants and made them testify of themselves, [saying to them], "Am I not your Lord?" They said, "Yes, we have testified."',
      reference: 'Quran 7:172'
    }
  },
  {
    id: '7',
    title: 'Salam',
    description: 'Turn head right and left saying peace',
    arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ الله',
    translation: 'Peace be upon you and the mercy of Allah',
    transliteration: 'As-salamu alaykum wa rahmatullah',
    icon: 'hand-left-outline',
    color: '#84cc16',
    // TODO: Replace with actual image URL - Use the provided images for each prayer step
    // For Niyyah: Use the image of the man in prayer posture with hands raised
    image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop',
    videoUrl: 'https://www.youtube.com/watch?v=example7', // TODO: Replace with actual video URL
    details: 'Turn your head to the right and say "As-salamu alaykum wa rahmatullah" (Peace be upon you and the mercy of Allah), then turn to the left and repeat the same. This concludes the prayer.',
    hadith: {
      text: 'The Prophet (peace be upon him) used to turn his face to the right and left when giving Salam.',
      reference: 'Sahih Bukhari 828'
    },
    quranAyah: {
      text: 'And when you are greeted with a greeting, greet [in return] with one better than it or [at least] return it [in a like manner].',
      reference: 'Quran 4:86'
    }
  }
];
