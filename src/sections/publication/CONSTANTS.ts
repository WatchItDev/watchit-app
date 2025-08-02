export const MAX_LINES = 5;

export const PUBLICATION_NEW_WIZARD_STEPS = ['Movie Information', 'Media Assets & Technical Details', 'Distribution & Rights'];

export const PUBLICATION_DESCRIPTION_MAX_LINES = 4;

export const urlToShare = 'https://app.watchit.movie/publicationId';

export const shareLinks = [
  {
    icon: 'mingcute:social-x-line',
    label: 'X',
    url: `https://x.com/share/?url=${encodeURIComponent(
      urlToShare,
    )}&text=Watch%20this%20movie%20on%20Watchit&hashtags=Watchit,Movie,Streaming`,
  },
  {
    icon: 'mdi:facebook',
    label: 'Facebook',
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}`,
  },
  {
    icon: 'mdi:telegram',
    label: 'Telegram',
    url: `https://telegram.me/share/?url=${encodeURIComponent(
      urlToShare,
    )}&text=Watch%20this%20movie%20on%20Watchit`,
  },
];

export const socialMedia = [
  { key: 'twitter', icon: 'mingcute:social-x-line' },
  { key: 'instagram', icon: 'mdi:instagram' },
  { key: 'orb', icon: 'mdi:instagram' },
  { key: 'farcaster', icon: 'mdi:instagram' },
];
