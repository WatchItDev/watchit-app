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
  { key: 'facebook', icon: 'mdi:facebook' },
  { key: 'instagram', icon: 'mdi:instagram' },
];
