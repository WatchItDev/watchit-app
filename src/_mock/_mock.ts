import { sub } from 'date-fns';
// config
import { ASSETS_API } from 'src/config-global';
//
import {
  _id,
  _ages,
  _roles,
  _prices,
  _emails,
  _ratings,
  _nativeS,
  _nativeM,
  _nativeL,
  _percents,
  _booleans,
  _sentences,
  _lastNames,
  _fullNames,
  _tourNames,
  _jobTitles,
  _taskNames,
  _postTitles,
  _firstNames,
  _fullAddress,
  _companyNames,
  _productNames,
  _descriptions,
  _phoneNumbers,
} from './assets';
import { Poster } from '../components/poster/types';

// ----------------------------------------------------------------------

export const _mock = {
  id: (index: number) => _id[index],
  time: (index: number) => sub(new Date(), { days: index, hours: index }),
  boolean: (index: number) => _booleans[index],
  role: (index: number) => _roles[index],
  // Text
  taskNames: (index: number) => _taskNames[index],
  postTitle: (index: number) => _postTitles[index],
  jobTitle: (index: number) => _jobTitles[index],
  tourName: (index: number) => _tourNames[index],
  productName: (index: number) => _productNames[index],
  sentence: (index: number) => _sentences[index],
  description: (index: number) => _descriptions[index],
  // Contact
  email: (index: number) => _emails[index],
  phoneNumber: (index: number) => _phoneNumbers[index],
  fullAddress: (index: number) => _fullAddress[index],
  // Name
  firstName: (index: number) => _firstNames[index],
  lastName: (index: number) => _lastNames[index],
  fullName: (index: number) => _fullNames[index],
  companyName: (index: number) => _companyNames[index],
  // Number
  number: {
    percent: (index: number) => _percents[index],
    rating: (index: number) => _ratings[index],
    age: (index: number) => _ages[index],
    price: (index: number) => _prices[index],
    nativeS: (index: number) => _nativeS[index],
    nativeM: (index: number) => _nativeM[index],
    nativeL: (index: number) => _nativeL[index],
  },
  // Image
  image: {
    cover: (index: number) => `${ASSETS_API}/assets/images/cover/cover_${index + 1}.jpg`,
    avatar: (index: number) => `${ASSETS_API}/assets/images/avatar/avatar_${index + 1}.jpg`,
    travel: (index: number) => `${ASSETS_API}/assets/images/travel/travel_${index + 1}.jpg`,
    company: (index: number) => `${ASSETS_API}/assets/images/company/company_${index + 1}.png`,
    product: (index: number) => `${ASSETS_API}/assets/images/m_product/product_${index + 1}.jpg`,
    portrait: (index: number) => `${ASSETS_API}/assets/images/portrait/portrait_${index + 1}.jpg`,
  },
};

export const moviesMock: Poster[] = [
  {
    id: '1',
    title: 'Mad Max: Fury Road',
    synopsis: 'In a post-apocalyptic wasteland, Max teams up with a mysterious woman, Furiosa, to flee from a warlord and his army. Along the way, they must face impossible odds, dangerous desert terrain, and the constant pursuit of ruthless enemies. Every mile brings more threats as Max and Furiosa try to escape the clutches of their powerful enemies and secure a future in the wasteland. This is a high-octane action film that delves into the heart of survival, loyalty, and rebellion.',
    images: {
      vertical: _mock.image.cover(1),
      horizontal: _mock.image.cover(1),
      wallpaper: _mock.image.portrait(1),
    },
    rating: 3.8,
    year: 2024,
    likes: 8600,
    price: {
      wvc: 1560,
      usd: 4.3,
    },
    genre: ['Action', 'Adventure'],
    trailerUrl: 'https://www.youtube.com/watch?v=hEJnMQG9ev8',
  },
  {
    id: '2',
    title: 'Aquaman and the Lost Kingdom',
    synopsis: 'Aquaman must forge an uneasy alliance with an unlikely ally to save Atlantis and the world from devastation. The threat looms larger as the tides turn against the kingdom, with powerful forces working in the shadows. Aquaman, alongside his allies, must dive deep into the mysteries of the ocean and confront enemies from all corners of the sea. This is a thrilling continuation of the Aquaman saga, where legends are tested, and new heroes emerge.',
    images: {
      vertical: _mock.image.cover(2),
      horizontal: _mock.image.cover(2),
      wallpaper: _mock.image.portrait(2),
    },
    rating: 4.1,
    year: 2024,
    likes: 10600,
    price: {
      wvc: 2060,
      usd: 5.2,
    },
    genre: ['Action', 'Fantasy'],
    trailerUrl: 'https://www.youtube.com/watch?v=2wcj6SrX4zw',
  },
  {
    id: '3',
    title: 'Mortal Kombat',
    synopsis: 'MMA fighter Cole Young seeks out Earth’s greatest champions to stand against the enemies of Outworld in a high-stakes battle for the universe. He must unlock his true power as he fights in brutal tournaments to save humanity. Mortal Kombat is a legendary series known for its intense action, unforgettable characters, and epic battles. Every fight is a test of skill, strategy, and strength, and the stakes have never been higher.',
    images: {
      vertical: _mock.image.cover(3),
      horizontal: _mock.image.cover(3),
      wallpaper: _mock.image.portrait(3),
    },
    rating: 3.5,
    year: 2024,
    likes: 4200,
    price: {
      wvc: 1560,
      usd: 4.3,
    },
    genre: ['Action', 'Fantasy'],
    trailerUrl: 'https://www.youtube.com/watch?v=jBa_aHwCbC4',
  },
  {
    id: '4',
    title: 'Guardians of the Galaxy Vol. 2',
    synopsis: 'The Guardians struggle to keep together as a team while dealing with their personal issues and discovering the mystery of Peter Quill’s parentage. As they traverse the galaxy, they encounter new enemies, forge new alliances, and uncover shocking secrets about their past. The journey is filled with humor, heart, and action as the Guardians learn that family is more than just blood—it’s about the bonds you make along the way.',
    images: {
      vertical: _mock.image.cover(4),
      horizontal: _mock.image.cover(4),
      wallpaper: _mock.image.portrait(4),
    },
    rating: 4.3,
    year: 2023,
    likes: 3100,
    price: {
      wvc: 1560,
      usd: 4.3,
    },
    genre: ['Action', 'Sci-Fi'],
    trailerUrl: 'https://www.youtube.com/watch?v=dW1BIid8Osg',
  },
  {
    id: '5',
    title: 'The Hobbit: The Desolation of Smaug',
    synopsis: 'Bilbo Baggins embarks on an epic quest to reclaim the lost Dwarf Kingdom of Erebor from the fearsome dragon Smaug. Along the way, he must navigate treacherous landscapes, confront dangerous creatures, and unlock the courage within himself to face the ultimate foe. This chapter in the Hobbit saga is filled with thrilling action, deep lore, and unforgettable characters, as Bilbo discovers what it truly means to be a hero.',
    images: {
      vertical: _mock.image.cover(5),
      horizontal: _mock.image.cover(5),
      wallpaper: _mock.image.portrait(5),
    },
    rating: 3.9,
    year: 2023,
    likes: 3200,
    price: {
      wvc: 1560,
      usd: 4.3,
    },
    genre: ['Fantasy', 'Adventure'],
    trailerUrl: 'https://www.youtube.com/watch?v=fnaojlfdUbs',
  },
  {
    id: '6',
    title: 'Spider-Man: No Way Home',
    synopsis: 'Peter Parker’s life is turned upside down when his identity is revealed, and he seeks Doctor Strange’s help to make everyone forget who he is. However, the spell goes wrong, leading to multiverse chaos and bringing villains from other dimensions into his world. Peter must fight to protect those he loves while coming to terms with his own identity. The film is a thrilling ride through alternate realities, with high-stakes action and emotional depth.',
    images: {
      vertical: _mock.image.cover(6),
      horizontal: _mock.image.cover(6),
      wallpaper: _mock.image.portrait(6),
    },
    rating: 4.7,
    year: 2022,
    likes: 7500,
    price: {
      wvc: 1820,
      usd: 5.0,
    },
    genre: ['Action', 'Adventure'],
    trailerUrl: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
  },
  {
    id: '7',
    title: 'Dune',
    synopsis: 'Paul Atreides, a brilliant and gifted young man, must travel to the most dangerous planet in the universe to ensure the future of his family and people. On the desert planet Arrakis, he must navigate treacherous political alliances, deadly sandworms, and his own emerging powers. The film is a sweeping epic that explores the themes of destiny, survival, and power, set against a visually stunning backdrop of a distant future.',
    images: {
      vertical: _mock.image.cover(7),
      horizontal: _mock.image.cover(7),
      wallpaper: _mock.image.portrait(7),
    },
    rating: 4.5,
    year: 2021,
    likes: 6300,
    price: {
      wvc: 2100,
      usd: 6.1,
    },
    genre: ['Sci-Fi', 'Adventure'],
    trailerUrl: 'https://www.youtube.com/watch?v=n9xhJrPXop4',
  },
  {
    id: '8',
    title: 'Black Panther: Wakanda Forever',
    synopsis: 'The Wakandans fight to protect their nation from intervening world powers in the wake of King T’Challa’s death. As tensions rise between the world’s superpowers, the people of Wakanda must rely on their advanced technology and warrior spirit to defend their way of life. This film delves into themes of loss, legacy, and the burdens of leadership as Wakanda faces its most dangerous threat yet.',
    images: {
      vertical: _mock.image.cover(8),
      horizontal: _mock.image.cover(8),
      wallpaper: _mock.image.portrait(8),
    },
    rating: 4.3,
    year: 2023,
    likes: 5400,
    price: {
      wvc: 1750,
      usd: 5.0,
    },
    genre: ['Action', 'Adventure'],
    trailerUrl: 'https://www.youtube.com/watch?v=_Z3QKkl1WyM',
  },
  {
    id: '9',
    title: 'The Matrix Resurrections',
    synopsis: 'Neo must return to the Matrix and fight to free humanity once again from the machines and their control. As the war between humans and machines intensifies, Neo faces new enemies and allies, all while questioning the very nature of reality. This latest chapter in the Matrix saga pushes the boundaries of what’s possible, exploring themes of freedom, control, and the fight for humanity’s future.',
    images: {
      vertical: _mock.image.cover(9),
      horizontal: _mock.image.cover(9),
      wallpaper: _mock.image.portrait(9),
    },
    rating: 3.7,
    year: 2022,
    likes: 4800,
    price: {
      wvc: 1540,
      usd: 4.1,
    },
    genre: ['Sci-Fi', 'Action'],
    trailerUrl: 'https://www.youtube.com/watch?v=9ix7TUGVYIo',
  },
  {
    id: '10',
    title: 'Doctor Strange in the Multiverse of Madness',
    synopsis: 'Doctor Strange must traverse the multiverse to stop a dark force from wreaking havoc on reality. With the fabric of space-time unraveling, Strange teams up with unlikely allies from alternate dimensions to battle forces beyond comprehension. This action-packed film is a mind-bending journey through the multiverse, filled with magic, mystery, and shocking revelations.',
    images: {
      vertical: _mock.image.cover(10),
      horizontal: _mock.image.cover(10),
      wallpaper: _mock.image.portrait(10),
    },
    rating: 4.2,
    year: 2022,
    likes: 6900,
    price: {
      wvc: 1780,
      usd: 5.1,
    },
    genre: ['Action', 'Fantasy'],
    trailerUrl: 'https://www.youtube.com/watch?v=aWzlQ2N6qqg',
  },
  {
    id: '11',
    title: 'Avatar: The Way of Water',
    synopsis: 'Jake Sully and Neytiri must protect their family from a new threat on Pandora, the mysterious Way of Water. As they dive deeper into Pandora’s oceans, they discover new species and new dangers lurking in the depths. This highly anticipated sequel expands the world of Avatar with stunning visuals, a compelling story, and emotional depth, exploring themes of family, survival, and the power of nature.',
    images: {
      vertical: _mock.image.cover(11),
      horizontal: _mock.image.cover(11),
      wallpaper: _mock.image.portrait(11),
    },
    rating: 4.6,
    year: 2023,
    likes: 9000,
    price: {
      wvc: 2400,
      usd: 6.5,
    },
    genre: ['Action', 'Fantasy'],
    trailerUrl: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
  },
  {
    id: '12',
    title: 'Shang-Chi and the Legend of the Ten Rings',
    synopsis: 'Shang-Chi confronts the past he thought he left behind when he’s drawn into the web of the mysterious Ten Rings organization. As the true power of the rings is revealed, Shang-Chi must embrace his destiny and master the skills he never wanted to acknowledge. This film blends martial arts action with heart and humor, as Shang-Chi battles both physical and emotional demons.',
    images: {
      vertical: _mock.image.cover(12),
      horizontal: _mock.image.cover(12),
      wallpaper: _mock.image.portrait(12),
    },
    rating: 4.4,
    year: 2021,
    likes: 5200,
    price: {
      wvc: 1620,
      usd: 4.8,
    },
    genre: ['Action', 'Fantasy'],
    trailerUrl: 'https://www.youtube.com/watch?v=8YjFbMbfXaQ',
  },
  {
    id: '13',
    title: 'The Batman',
    synopsis: 'Batman ventures into Gotham City’s underworld when a sadistic killer leaves behind a trail of cryptic clues. As Bruce Wayne delves deeper into his dual identity as the caped crusader, he uncovers shocking truths about his family and Gotham’s past. The Batman is a dark, gritty film that explores the psychological toll of being a vigilante in a city consumed by crime.',
    images: {
      vertical: _mock.image.cover(13),
      horizontal: _mock.image.cover(13),
      wallpaper: _mock.image.portrait(13),
    },
    rating: 4.5,
    year: 2022,
    likes: 7300,
    price: {
      wvc: 1900,
      usd: 5.4,
    },
    genre: ['Action', 'Crime'],
    trailerUrl: 'https://www.youtube.com/watch?v=mqqft2x_Aa4',
  },
  {
    id: '14',
    title: 'The Suicide Squad',
    synopsis: 'A group of imprisoned supervillains are sent on a deadly mission to stop a mysterious threat to the world. As they navigate a war-torn country filled with enemy forces and dangerous creatures, the squad must learn to work together if they hope to survive. With a blend of dark humor and explosive action, this film redefines what it means to be an anti-hero.',
    images: {
      vertical: _mock.image.cover(14),
      horizontal: _mock.image.cover(14),
      wallpaper: _mock.image.portrait(14),
    },
    rating: 4.0,
    year: 2021,
    likes: 5800,
    price: {
      wvc: 1700,
      usd: 4.9,
    },
    genre: ['Action', 'Comedy'],
    trailerUrl: 'https://www.youtube.com/watch?v=JuDLepNa7hw',
  },
  {
    id: '15',
    title: 'Thor: Love and Thunder',
    synopsis: 'Thor embarks on a quest for inner peace, but his retirement is interrupted by Gorr the God Butcher, who seeks the extinction of the gods. As Thor teams up with old friends and new allies, he must confront his past mistakes and face the consequences of his actions. This action-packed film is a blend of humor, heart, and high-stakes battles as Thor faces his greatest challenge yet.',
    images: {
      vertical: _mock.image.cover(15),
      horizontal: _mock.image.cover(15),
      wallpaper: _mock.image.portrait(15),
    },
    rating: 4.1,
    year: 2023,
    likes: 6400,
    price: {
      wvc: 1850,
      usd: 5.0,
    },
    genre: ['Action', 'Fantasy'],
    trailerUrl: 'https://www.youtube.com/watch?v=tgB1wUcmbbw',
  },
  {
    id: '16',
    title: 'Jurassic World: Dominion',
    synopsis: 'The future of mankind hangs in the balance as humans and dinosaurs coexist following the destruction of Isla Nublar. As new dinosaur species emerge and old ones become more dangerous, humanity must adapt or face extinction. This thrilling conclusion to the Jurassic World trilogy pushes the boundaries of science and ethics, as characters old and new unite to save the world from total collapse.',
    images: {
      vertical: _mock.image.cover(16),
      horizontal: _mock.image.cover(16),
      wallpaper: _mock.image.portrait(16),
    },
    rating: 3.7,
    year: 2022,
    likes: 5100,
    price: {
      wvc: 1520,
      usd: 4.0,
    },
    genre: ['Action', 'Adventure'],
    trailerUrl: 'https://www.youtube.com/watch?v=fb5ELWi-ekk',
  },
  {
    id: '17',
    title: 'Eternals',
    synopsis: 'The Eternals, an immortal alien race, emerge from hiding after thousands of years to protect Earth from their evil counterparts, the Deviants. As they grapple with their purpose and the consequences of their existence, they must unite to stop a catastrophic event that threatens all life on Earth. This visually stunning film explores the complexities of immortality, legacy, and sacrifice, with action-packed scenes and deep philosophical undertones.',
    images: {
      vertical: _mock.image.cover(17),
      horizontal: _mock.image.cover(17),
      wallpaper: _mock.image.portrait(17),
    },
    rating: 4.0,
    year: 2022,
    likes: 4900,
    price: {
      wvc: 1600,
      usd: 4.2,
    },
    genre: ['Action', 'Fantasy'],
    trailerUrl: 'https://www.youtube.com/watch?v=x_me3xsvDgk',
  },
  {
    id: '18',
    title: 'No Time to Die',
    synopsis: 'James Bond has left active service. His peace is short-lived when an old friend from the CIA turns up asking for help. Bond soon finds himself on a mission to rescue a kidnapped scientist, which turns out to be far more treacherous than expected. In this final chapter of Bond’s story, he faces his deadliest adversary yet while coming to terms with the legacy he leaves behind.',
    images: {
      vertical: _mock.image.cover(18),
      horizontal: _mock.image.cover(18),
      wallpaper: _mock.image.portrait(18),
    },
    rating: 4.2,
    year: 2021,
    likes: 6200,
    price: {
      wvc: 1720,
      usd: 4.9,
    },
    genre: ['Action', 'Thriller'],
    trailerUrl: 'https://www.youtube.com/watch?v=BIhNsAtPbPI',
  },
  {
    id: '19',
    title: 'Venom: Let There Be Carnage',
    synopsis: 'Eddie Brock must face the chaos unleashed by a dangerous symbiote called Carnage. As the conflict between Venom and Carnage escalates, Eddie is pushed to the limits of his physical and mental abilities. This film delivers intense action, humor, and horror as Venom battles to protect humanity while struggling with his own darker impulses.',
    images: {
      vertical: _mock.image.cover(19),
      horizontal: _mock.image.cover(19),
      wallpaper: _mock.image.portrait(19),
    },
    rating: 3.6,
    year: 2021,
    likes: 5600,
    price: {
      wvc: 1580,
      usd: 4.3,
    },
    genre: ['Action', 'Sci-Fi'],
    trailerUrl: 'https://www.youtube.com/watch?v=-ezfi6FQ8Ds',
  },
  {
    id: '20',
    title: 'Top Gun: Maverick',
    synopsis: 'After thirty years of service, Pete "Maverick" Mitchell continues to push the envelope as a top naval aviator, confronting his past while training a new squad of pilots. As Maverick faces the ghosts of his past, he must also prepare the next generation for a high-stakes mission that demands the ultimate sacrifice. This film blends heart-pounding aerial action with emotional depth, as Maverick takes to the skies one last time.',
    images: {
      vertical: _mock.image.cover(20),
      horizontal: _mock.image.cover(20),
      wallpaper: _mock.image.portrait(20),
    },
    rating: 4.9,
    year: 2022,
    likes: 9300,
    price: {
      wvc: 2550,
      usd: 6.9,
    },
    genre: ['Action', 'Drama'],
    trailerUrl: 'https://www.youtube.com/watch?v=g4U4BQW9OEk',
  }
];
