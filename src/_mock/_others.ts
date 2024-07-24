import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const _carouselsMembers = [...Array(6)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.fullName(index),
  role: _mock.role(index),
  avatarUrl: _mock.image.portrait(index),
}));

// ----------------------------------------------------------------------

export const _faqs = [...Array(8)].map((_, index) => ({
  id: _mock.id(index),
  value: `panel${index + 1}`,
  heading: `Questions ${index + 1}`,
  detail: _mock.description(index),
}));

// ----------------------------------------------------------------------

export const _addressBooks = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  primary: index === 0,
  name: _mock.fullName(index),
  email: _mock.email(index + 1),
  fullAddress: _mock.fullAddress(index),
  phoneNumber: _mock.phoneNumber(index),
  company: _mock.companyName(index + 1),
  addressType: index === 0 ? 'Home' : 'Office',
}));

// ----------------------------------------------------------------------

export const _contacts = [...Array(20)].map((_, index) => {
  const status =
    (index % 2 && 'online') || (index % 3 && 'offline') || (index % 4 && 'alway') || 'busy';

  return {
    id: _mock.id(index),
    status,
    role: _mock.role(index),
    email: _mock.email(index),
    name: _mock.fullName(index),
    phoneNumber: _mock.phoneNumber(index),
    lastActivity: _mock.time(index),
    avatarUrl: _mock.image.avatar(index),
    address: _mock.fullAddress(index),
  };
});

// ----------------------------------------------------------------------

export const _notifications = [...Array(12)].map((_, index) => ({
  id: _mock.id(index),
  avatarUrl: [
    _mock.image.avatar(1),
    _mock.image.avatar(2),
    _mock.image.avatar(3),
    _mock.image.avatar(4),
    _mock.image.avatar(5),
    _mock.image.avatar(6),
    _mock.image.avatar(7),
    _mock.image.avatar(8),
    _mock.image.avatar(9),
    _mock.image.avatar(10),
    _mock.image.avatar(11),
    null
  ][index],
  type: ['movie', 'update', 'rental', 'community', 'payment', 'order', 'chat', 'mail', 'event', 'reward', 'review', 'subscription'][index],
  category: [
    'Movies',
    'Update',
    'Rental',
    'Community',
    'Payment',
    'Order',
    'Chat',
    'Communication',
    'Event',
    'Reward',
    'Review',
    'Subscription',
  ][index],
  isUnRead: _mock.boolean(index),
  createdAt: _mock.time(index),
  title:
    (index === 0 && `<p><strong>New Movie:</strong> "Spirited Away" is now available on Watchit.</p>`) ||
    (index === 1 && `<p><strong>Update:</strong> Watchit UI has been improved.</p>`) ||
    (index === 2 && `<p><strong>Earnings Report:</strong> You've earned $150 in rentals this week.</p>`) ||
    (index === 3 && `<p><strong>Community Activity:</strong> María López commented on your review of "Inception".</p>`) ||
    (index === 4 && `<p><strong>Payment Received:</strong> You've received a payment of $200 for your movies.</p>`) ||
    (index === 5 && `<p><strong>Order Confirmed:</strong> Your merchandise order has been confirmed.</p>`) ||
    (index === 6 && `<p><strong>New Message:</strong> Jaxon Reed sent you a new chat message.</p>`) ||
    (index === 7 && `<p><strong>New Mail:</strong> You have 5 unread emails.</p>`) ||
    (index === 8 && `<p><strong>New Event:</strong> Join our movie premiere event this Friday.</p>`) ||
    (index === 9 && `<p><strong>Reward Earned:</strong> You've earned 50 WVC Coins for your activity.</p>`) ||
    (index === 10 && `<p><strong>New Review:</strong> Juan Pérez left a review on your movie.</p>`) ||
    (index === 11 && `<p><strong>Subscription Active:</strong> Your Watchit subscription has been renewed.</p>`) ||
    '',
}));



// ----------------------------------------------------------------------

export const _socials = [
  {
    value: 'facebook',
    name: 'FaceBook',
    icon: 'eva:facebook-fill',
    color: '#1877F2',
    path: 'https://www.facebook.com/caitlyn.kerluke',
  },
  {
    value: 'instagram',
    name: 'Instagram',
    icon: 'ant-design:instagram-filled',
    color: '#E02D69',
    path: 'https://www.instagram.com/caitlyn.kerluke',
  },
  {
    value: 'linkedin',
    name: 'Linkedin',
    icon: 'eva:linkedin-fill',
    color: '#007EBB',
    path: 'https://www.linkedin.com/caitlyn.kerluke',
  },
  {
    value: 'twitter',
    name: 'Twitter',
    icon: 'eva:twitter-fill',
    color: '#00AAEC',
    path: 'https://www.twitter.com/caitlyn.kerluke',
  },
];

// ----------------------------------------------------------------------

export const _pricingPlans = [
  {
    subscription: 'basic',
    price: 0,
    caption: 'Forever',
    lists: [
      'feature 1',
      'feature 2',
      'feature 3'
    ],
    labelAction: 'Current Plan',
  },
  {
    subscription: 'starter',
    price: 4.99,
    caption: 'Saving $24 a year',
    lists: [
      'feature 1',
      'feature 2',
      'feature 3',
      'feature 4',
      'feature 5',
    ],
    labelAction: 'Choose Starter',
  },
  {
    subscription: 'premium',
    price: 9.99,
    caption: 'Saving $124 a year',
    lists: [
      'feature 1',
      'feature 2',
      'feature 3',
      'feature 4',
      'feature 5',
      'feature 6',
      'feature 7',
    ],
    labelAction: 'Choose Premium',
  },
];
