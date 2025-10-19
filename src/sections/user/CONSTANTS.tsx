export const TABS = [
  { value: 'publications', label: 'Publications' },
  { value: 'followers', label: 'Followers' },
  { value: 'following', label: 'Following' },
  { value: 'referrals', label: 'Referrals' },
];

export const urlToShare = 'https://app.watchit.movie/profileId';

export const shareLinks = [
  {
    icon: 'mingcute:social-x-line',
    label: 'X',
    url: `https://x.com/share/?url=${encodeURIComponent(urlToShare)}&text=Visit%20my%20profile%20on%20Watchit&hashtags=Watchit,Blockchain,Crypto`,
  },
  {
    icon: 'mdi:facebook',
    label: 'Facebook',
    url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(urlToShare)}`,
  },
  {
    icon: 'mdi:telegram',
    label: 'Telegram',
    url: `https://telegram.me/share/?url=${encodeURIComponent(urlToShare)}&title=Watchit`,
  },
];

export const socialMedia = [
  { key: 'twitter', icon: 'mingcute:social-x-line' },
  { key: 'instagram', icon: 'mdi:instagram' },
  { key: 'orb', icon: 'mdi:instagram' },
  { key: 'farcaster', icon: 'mdi:instagram' },
];

export const randomColors = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
  '#795548',
  '#9e9e9e',
  '#607d8b',
  '#000000',
];
