// ❤U Festival — data + i18n

const stages = [
  { id: 'ponton', name: 'Ponton',   tone: '',         img: '/img/ponton.webp', desc: { nl: 'Main stage — hoofdacts', en: 'Main stage — headliners' } },
  { id: 'lake',   name: 'The Lake', tone: 's-lake',   img: '/img/lake.webp',   desc: { nl: 'Onbekend talent',        en: 'Emerging talent' } },
  { id: 'club',   name: 'The Club', tone: 's-club',   img: '/img/club.webp',   desc: { nl: 'Theater & stand-up',     en: 'Theatre & stand-up' } },
  { id: 'hangar', name: 'Hangar',   tone: 's-hangar', img: '/img/hangar.webp', desc: { nl: 'Non-stop house & techno', en: 'Non-stop house & techno' } },
];

// schedule: minutes since 10:00 (festival window 12:00–24:00 ≈ 120–840)
const sat = [
  // Ponton
  { stage: 'ponton', start: 120, end: 195, act: 'Armin van Buuren' },
  { stage: 'ponton', start: 240, end: 330, act: 'Kensington' },
  { stage: 'ponton', start: 375, end: 450, act: 'De Staat' },
  { stage: 'ponton', start: 495, end: 570, act: 'Navarone' },
  { stage: 'ponton', start: 615, end: 705, act: 'Dotan' },
  { stage: 'ponton', start: 765, end: 840, act: 'Froukje' },
  // The Lake
  { stage: 'lake', start: 120, end: 195, act: 'Talent set 1' },
  { stage: 'lake', start: 210, end: 285, act: 'Talent set 2' },
  { stage: 'lake', start: 315, end: 390, act: 'Talent set 3' },
  { stage: 'lake', start: 420, end: 495, act: 'Talent set 4' },
  { stage: 'lake', start: 525, end: 600, act: 'Talent set 5' },
  { stage: 'lake', start: 630, end: 705, act: 'Talent set 6' },
  { stage: 'lake', start: 735, end: 810, act: 'Talent set 7' },
  // The Club
  { stage: 'club', start: 165, end: 240, act: 'Comedy' },
  { stage: 'club', start: 285, end: 360, act: 'Lecture' },
  { stage: 'club', start: 405, end: 480, act: 'Theater' },
  { stage: 'club', start: 510, end: 600, act: 'Movie' },
  { stage: 'club', start: 630, end: 720, act: 'Performance' },
  { stage: 'club', start: 735, end: 810, act: 'Illusionist' },
  // Hangar
  { stage: 'hangar', start: 120, end: 210, act: 'DJ set 1' },
  { stage: 'hangar', start: 210, end: 300, act: 'DJ set 2' },
  { stage: 'hangar', start: 300, end: 390, act: 'DJ set 3' },
  { stage: 'hangar', start: 390, end: 480, act: 'DJ set 4' },
  { stage: 'hangar', start: 480, end: 570, act: 'DJ set 5' },
  { stage: 'hangar', start: 570, end: 660, act: 'DJ set 6' },
  { stage: 'hangar', start: 660, end: 750, act: 'DJ set 7' },
  { stage: 'hangar', start: 750, end: 840, act: 'DJ set 8' },
];

const sun = [
  { stage: 'ponton', start: 120, end: 210, act: 'Martin Garrix' },
  { stage: 'ponton', start: 240, end: 345, act: 'Within Temptation' },
  { stage: 'ponton', start: 390, end: 480, act: "Chef'Special" },
  { stage: 'ponton', start: 540, end: 645, act: 'Eefje de Visser' },
  { stage: 'ponton', start: 705, end: 810, act: 'Spinvis' },
  { stage: 'lake', start: 120, end: 195, act: 'Talent set 1' },
  { stage: 'lake', start: 210, end: 285, act: 'Talent set 2' },
  { stage: 'lake', start: 315, end: 390, act: 'Talent set 3' },
  { stage: 'lake', start: 420, end: 495, act: 'Talent set 4' },
  { stage: 'lake', start: 525, end: 600, act: 'Talent set 5' },
  { stage: 'lake', start: 630, end: 705, act: 'Talent set 6' },
  { stage: 'club', start: 165, end: 240, act: 'Comedy' },
  { stage: 'club', start: 285, end: 360, act: 'Lecture' },
  { stage: 'club', start: 405, end: 480, act: 'Theater' },
  { stage: 'club', start: 510, end: 600, act: 'Movie' },
  { stage: 'club', start: 630, end: 720, act: 'Magic Show' },
  { stage: 'hangar', start: 120, end: 210, act: 'DJ set 1' },
  { stage: 'hangar', start: 210, end: 300, act: 'DJ set 2' },
  { stage: 'hangar', start: 300, end: 390, act: 'DJ set 3' },
  { stage: 'hangar', start: 390, end: 480, act: 'DJ set 4' },
  { stage: 'hangar', start: 480, end: 570, act: 'DJ set 5' },
  { stage: 'hangar', start: 570, end: 660, act: 'DJ set 6' },
  { stage: 'hangar', start: 660, end: 750, act: 'DJ set 7' },
  { stage: 'hangar', start: 750, end: 840, act: 'DJ set 8' },
];

const acts = {
  'Armin van Buuren': {
    role: { nl: 'Trance icon', en: 'Trance icon' },
    desc: {
      nl: "Vijfvoudig 'World's No.1 DJ' Armin levert euforische, energieke sets die festivals van Tomorrowland tot Ultra hebben geheadlined.",
      en: "Five-time World's No.1 DJ Armin delivers euphoric, high-energy sets that have headlined festivals from Tomorrowland to Ultra.",
    },
    hue: 'linear-gradient(135deg,#1a1a40 0%,#5d2b8c 60%,#f03228 100%)',
  },
  'Martin Garrix': {
    role: { nl: 'EDM superster', en: 'EDM superstar' },
    desc: {
      nl: "Doorgebroken als tiener met 'Animals'. Martin Garrix groeide uit tot een van de grootste namen in EDM.",
      en: "Broke through as a teenager with 'Animals,' Martin Garrix has become one of the biggest names in EDM.",
    },
    hue: 'linear-gradient(135deg,#0a0a0a,#222,#f03228)',
  },
  'Kensington': {
    role: { nl: 'Indie rock anthems', en: 'Indie rock anthems' },
    desc: {
      nl: 'Rotterdams indie rock-kwartet, bekend om soaring refreinen en stuwende gitaarriffs.',
      en: 'Rotterdam-born indie rock quintet known for soaring choruses and driving guitar riffs.',
    },
    hue: 'linear-gradient(135deg,#143b5a,#2a7aa0,#f03228)',
  },
  'Within Temptation': {
    role: { nl: 'Symfonische metal-pioniers', en: 'Symphonic metal pioneers' },
    desc: {
      nl: 'Symfonische metal pioniers met frontvrouw Sharon den Adel.',
      en: 'Symphonic metal pioneers fronted by Sharon den Adel.',
    },
    hue: 'linear-gradient(135deg,#0a0a14,#3a1a4a,#7b2a5a)',
  },
  'De Staat': {
    role: { nl: 'Experimentele rock innovators', en: 'Experimental rock innovators' },
    desc: {
      nl: 'Experimentele rock-outfit uit Nijmegen, die funky grooves combineert met scherpe gitaarpartijen.',
      en: 'Experimental rock outfit from Nijmegen, blending funky grooves with angular guitar work.',
    },
    hue: 'linear-gradient(135deg,#1a1a1a,#3a3a3a,#f03228)',
  },
  "Chef'Special": {
    role: { nl: 'Genre-blendende funk-pop', en: 'Genre-blending funk-pop' },
    desc: {
      nl: 'Vierkoppige band uit Haarlem die funk, pop, rock en hip-hop mixt.',
      en: 'A four-piece from Haarlem mixing funk, pop, rock and hip-hop.',
    },
    hue: 'linear-gradient(135deg,#f6a623,#f03228,#5d2b8c)',
  },
  'Navarone': {
    role: { nl: 'Hard-hitting rock four-piece', en: 'Hard-hitting rock four-piece' },
    desc: {
      nl: 'Utrechts hard-hitting rock-kwartet dat riff-driven anthems en dynamische vocalen levert.',
      en: "Utrecht's hard-hitting rock four-piece, delivering riff-driven anthems and dynamic vocals.",
    },
    hue: 'linear-gradient(135deg,#0a0a0a,#3a2020,#c81e15)',
  },
  'Dotan': {
    role: { nl: 'Folk-pop singer-songwriter', en: 'Folk-pop singer-songwriter' },
    desc: {
      nl: 'Folk-pop singer-songwriter wiens intieme stem en akoestische arrangementen platina verkopen opleverden.',
      en: 'Folk-pop singer-songwriter whose intimate voice and acoustic arrangements have earned him platinum sales.',
    },
    hue: 'linear-gradient(135deg,#3a4a5a,#7a8a9a,#c8b890)',
  },
  'Eefje de Visser': {
    role: { nl: 'Atmospheric indie-pop', en: 'Atmospheric indie-pop' },
    desc: {
      nl: 'Indie-pop artiest die atmosferische, elektronisch-getinte songs maakt.',
      en: 'Indie-pop artist crafting atmospheric, electronic-tinged songs.',
    },
    hue: 'linear-gradient(135deg,#1a2a3a,#3a5a7a,#a070a0)',
  },
  'Froukje': {
    role: { nl: 'Candid pop songwriter', en: 'Candid pop songwriter' },
    desc: {
      nl: 'Breakthrough pop-zangeres Froukje Veenstra combineert eerlijke teksten met catchy, synth-driven hooks.',
      en: 'Breakthrough pop singer Froukje Veenstra combines candid lyrics with catchy, synth-driven hooks.',
    },
    hue: 'linear-gradient(135deg,#f03228,#f6a623,#e3b505)',
  },
  'Spinvis': {
    role: { nl: 'Poëtisch lo-fi surrealist', en: 'Poetic lo-fi surrealist' },
    desc: {
      nl: 'Erik de Jong, alias Spinvis, maakt poëtische, collage-achtige songs.',
      en: 'Erik de Jong performs under the moniker Spinvis, crafting poetic, collage-like songs.',
    },
    hue: 'linear-gradient(135deg,#2a2a4a,#5a4a7a,#e3b505)',
  },
};

const i18n = {
  nl: {
    appName: '❤U Festival',
    onb: {
      slides: [
        { eyebrow: 'Welkom op', title: '❤U Festival', body: 'Zaterdag 5 september 2026 — Strijkviertel, Utrecht. Jouw festivalgids in de palm van je hand.' },
        { eyebrow: 'Mis niks', title: 'Stel je favorieten in', body: 'Markeer acts en wij sturen een melding 15, 10 en 5 minuten voor aanvang. Geen meer rennen.' },
        { eyebrow: 'Installeer als app', title: 'Scan & ga', body: 'Geen download nodig. Scan de QR-code en voeg ❤U toe aan je startscherm.' },
      ],
      skip: 'Overslaan', next: 'Volgende', start: 'Start het festival', or: 'of', scan: 'Scan met je telefoon',
    },
    tabs: { home: 'Home', schedule: 'Schema', favs: 'Favs', map: 'Kaart', info: 'Info' },
    home: {
      countdownEyebrow: 'Het festival begint over',
      countdown: ['DAGEN', 'UREN', 'MIN', 'SEC'],
      nowEyebrow: 'Op dit moment',
      feed: 'Nieuws & meldingen',
      live: 'LIVE',
      stages: 'Stages',
      seeAll: 'Alles bekijken',
      items: [
        { type: 'red',   t: 'Festival begint om 12:00',  d: 'Poorten open vanaf 11:30. Vergeet je ticket niet!', ts: 'ZA 5 SEP · 09:00' },
        { type: 'red',   t: 'Armin van Buuren begint over 15 min', d: 'Ponton — main stage. Loop op tijd naar voren.', ts: 'OVER 15 MIN' },
        { type: 'blue',  t: 'Talent set 2 net begonnen', d: 'The Lake — kom de nieuwe acts ontdekken.', ts: 'NU' },
        { type: 'amber', t: 'Drinkwater bij entrance & bij The Club', d: 'Gratis kraanwater bij elk waterpunt. Blijf hydrateren!', ts: '10 MIN GELEDEN' },
        { type: 'blue',  t: 'Shuttlebus rijdt vanaf 12:00', d: 'Vanaf Utrecht Centraal, perron Mineurslaan, elke 15 min.', ts: '30 MIN GELEDEN' },
        { type: 'red',   t: 'Welkom op ❤U Festival 2026', d: 'We hebben er zin in. Veel plezier!', ts: 'GISTEREN' },
      ],
    },
    schedule: { sat: 'Zaterdag', sun: 'Zondag' },
    favs: {
      title: 'Favorieten',
      sub: 'Je shortlist voor het festival',
      count: (n) => `${n} ${n === 1 ? 'act' : 'acts'} gemarkeerd`,
      empty: 'Nog geen favorieten. Tik op een act in het schema om hem hier op te slaan.',
      cta: 'Open schema',
      day: { sat: 'Zaterdag 5 september', sun: 'Zondag 6 september' },
    },
    info: {
      title: 'Festival info',
      sub: 'Alles wat je moet weten',
      sections: { general: 'Algemeen & contact', access: 'Bereikbaarheid', lockers: 'Lockers', faq: 'FAQ', gold: 'Golden-GLU' },
      adres: 'Strijkviertel, Utrecht',
      navAdres: 'Strijkviertelweg, Utrecht',
      date: 'Zaterdag 5 september 2026, 12:00 – 23:00',
      access: [
        { icon: 'directions_bike', title: 'Fiets',  body: 'Er is een grote gratis fietsenstalling waar je je fiets de hele dag kunt stallen.' },
        { icon: 'directions_car',  title: 'Auto',   body: 'Parkeren op P+R Papendorp. Volg de borden "P online ticket". Geen ticket? Pinnen bij de parkeerwachter (PIN ONLY). Let op: VOL=VOL.' },
        { icon: 'train',           title: 'OV',     body: 'Met openbaar vervoer naar Lief? Plan je trip via 9292.nl.' },
        { icon: 'directions_bus',  title: 'Shuttlebus', body: 'Gratis shuttlebus vanaf Utrecht Centraal (perron Mineurslaan, 12:00 – 19:00 heen, vanaf 21:00 terug).' },
        { icon: 'local_taxi',      title: 'Taxi & Kiss + Ride', body: 'Navigeer naar Strijkviertel, De Meern. Volg de borden "Kiss & Ride ❤U Festival".' },
      ],
      lockerBody: 'Op het festivalterrein zijn kluisjes aanwezig waar je je spullen veilig kunt opbergen. 3 à 4 jassen passen erin. Je kunt het kluisje de hele dag openen en sluiten zo vaak je wilt.',
      faq: [
        { q: 'Ik gebruik medicatie. Wat nu?', a: 'Je mag medicijnen meenemen in een dosis voor maximaal één dag. Een doktersverklaring of medicatiepaspoort is noodzakelijk.' },
        { q: 'Mag ik het festivalterrein tussentijds verlaten?', a: 'Nee, helaas niet. Om de veiligheid van alle bezoekers te waarborgen kunnen we niet toestaan dat het terrein tussentijds verlaten wordt.' },
        { q: 'Zijn er lockers?', a: 'Ja! Op het terrein kun je medium en grote lockers huren — reserveren kan niet, op = op.' },
      ],
      gold: 'Studenten van het GLU hebben tijdens het festival speciale privileges en zijn herkenbaar aan een gouden armbandje.',
    },
    map: {
      title: 'Kaart',
      legend: 'Legenda',
      locations: [
        { n: 1, name: 'Ponton',   x: 28, y: 60 },
        { n: 2, name: 'The Lake', x: 52, y: 38 },
        { n: 3, name: 'The Club', x: 70, y: 56 },
        { n: 4, name: 'Hangar',   x: 84, y: 28 },
      ],
      services: [
        { n: 'wc',     icon: 'wc',               x: 40, y: 70, label: 'Toilet' },
        { n: 'food',   icon: 'restaurant',        x: 60, y: 70, label: 'Food' },
        { n: 'bar',    icon: 'local_bar',         x: 46, y: 50, label: 'Bar' },
        { n: 'merch',  icon: 'shopping_bag',      x: 36, y: 44, label: 'Merch' },
        { n: 'ice',    icon: 'icecream',          x: 64, y: 44, label: 'Ice cream' },
        { n: 'first',  icon: 'medical_services',  x: 78, y: 66, label: 'First aid' },
        { n: 'locker', icon: 'lock',              x: 22, y: 50, label: 'Lockers' },
        { n: 'in',     icon: 'login',             x: 12, y: 72, label: 'Entrance' },
      ],
    },
    sheet: { addFav: 'Voeg toe aan favorieten', removeFav: 'Uit favorieten' },
  },
  en: {
    appName: '❤U Festival',
    onb: {
      slides: [
        { eyebrow: 'Welcome to',        title: '❤U Festival',         body: 'Saturday September 5, 2026 — Strijkviertel, Utrecht. Your festival guide in the palm of your hand.' },
        { eyebrow: "Don't miss a beat", title: 'Pick your favourites', body: 'Mark acts and we will ping you 15, 10 and 5 minutes before they start. No more sprinting.' },
        { eyebrow: 'Install as app',    title: 'Scan & go',            body: 'No download needed. Scan the QR code and add ❤U to your home screen.' },
      ],
      skip: 'Skip', next: 'Next', start: 'Start the festival', or: 'or', scan: 'Scan with your phone',
    },
    tabs: { home: 'Home', schedule: 'Schedule', favs: 'Favs', map: 'Map', info: 'Info' },
    home: {
      countdownEyebrow: 'Festival starts in',
      countdown: ['DAYS', 'HRS', 'MIN', 'SEC'],
      nowEyebrow: 'Right now',
      feed: 'News & notifications',
      live: 'LIVE',
      stages: 'Stages',
      seeAll: 'See all',
      items: [
        { type: 'red',   t: 'Festival starts at 12:00',  d: "Gates open from 11:30. Don't forget your ticket!", ts: 'SAT 5 SEP · 09:00' },
        { type: 'red',   t: 'Armin van Buuren in 15 min', d: 'Ponton — main stage. Head over now.', ts: 'IN 15 MIN' },
        { type: 'blue',  t: 'Talent set 2 just started', d: 'The Lake — come discover the new acts.', ts: 'NOW' },
        { type: 'amber', t: 'Free drinking water at entrance & The Club', d: 'Tap water at every water point. Stay hydrated!', ts: '10 MIN AGO' },
        { type: 'blue',  t: 'Shuttle bus runs from 12:00', d: 'From Utrecht Centraal, Mineurslaan platform, every 15 min.', ts: '30 MIN AGO' },
        { type: 'red',   t: 'Welcome to ❤U Festival 2026', d: "We're excited. Have a great day!", ts: 'YESTERDAY' },
      ],
    },
    schedule: { sat: 'Saturday', sun: 'Sunday' },
    favs: {
      title: 'Favourites',
      sub: 'Your shortlist for the festival',
      count: (n) => `${n} ${n === 1 ? 'act' : 'acts'} starred`,
      empty: 'No favourites yet. Tap an act in the schedule to save it here.',
      cta: 'Open schedule',
      day: { sat: 'Saturday Sep 5', sun: 'Sunday Sep 6' },
    },
    info: {
      title: 'Festival info',
      sub: 'Everything you need to know',
      sections: { general: 'General & contact', access: 'Getting there', lockers: 'Lockers', faq: 'FAQ', gold: 'Golden-GLU' },
      adres: 'Strijkviertel, Utrecht',
      navAdres: 'Strijkviertelweg, Utrecht',
      date: 'Saturday September 5, 2026, 12:00 – 23:00',
      access: [
        { icon: 'directions_bike', title: 'Bike',    body: 'A large free bike parking is on site — leave your bike all day long.' },
        { icon: 'directions_car',  title: 'Car',     body: 'Park at P+R Papendorp. Follow signs "P online ticket". No ticket? Pay the parking attendant on site (PIN ONLY). Note: full = full.' },
        { icon: 'train',           title: 'Transit', body: 'Travelling by public transport? Plan your trip via 9292.nl.' },
        { icon: 'directions_bus',  title: 'Shuttle bus', body: 'Free shuttle from Utrecht Centraal (Mineurslaan platform). Out 12:00 – 19:00, back from 21:00.' },
        { icon: 'local_taxi',      title: 'Taxi & Kiss + Ride', body: 'Navigate to Strijkviertel, De Meern. Follow "Kiss & Ride ❤U Festival" signs.' },
      ],
      lockerBody: "On site you'll find lockers where you can store your belongings — 3 to 4 jackets fit inside. Open and close yours all day long.",
      faq: [
        { q: 'I take medication. What now?', a: "You may bring medication in a dose of max one day. A doctor's note or medication passport is required." },
        { q: 'Can I leave the festival site and come back?', a: "No, unfortunately not. To safeguard everyone we can't allow re-entry." },
        { q: 'Are there lockers?', a: 'Yes! On site you can rent medium and large lockers — no reservations, first come first served.' },
      ],
      gold: 'GLU students enjoy special privileges during the festival and are recognisable by a golden wristband.',
    },
    map: {
      title: 'Map',
      legend: 'Legend',
      locations: [
        { n: 1, name: 'Ponton',   x: 28, y: 60 },
        { n: 2, name: 'The Lake', x: 52, y: 38 },
        { n: 3, name: 'The Club', x: 70, y: 56 },
        { n: 4, name: 'Hangar',   x: 84, y: 28 },
      ],
      services: [
        { n: 'wc',     icon: 'wc',               x: 40, y: 70, label: 'Toilet' },
        { n: 'food',   icon: 'restaurant',        x: 60, y: 70, label: 'Food' },
        { n: 'bar',    icon: 'local_bar',         x: 46, y: 50, label: 'Bar' },
        { n: 'merch',  icon: 'shopping_bag',      x: 36, y: 44, label: 'Merch' },
        { n: 'ice',    icon: 'icecream',          x: 64, y: 44, label: 'Ice cream' },
        { n: 'first',  icon: 'medical_services',  x: 78, y: 66, label: 'First aid' },
        { n: 'locker', icon: 'lock',              x: 22, y: 50, label: 'Lockers' },
        { n: 'in',     icon: 'login',             x: 12, y: 72, label: 'Entrance' },
      ],
    },
    sheet: { addFav: 'Add to favourites', removeFav: 'Remove favourite' },
  },
};

export const D = { stages, sat, sun, acts, i18n };
