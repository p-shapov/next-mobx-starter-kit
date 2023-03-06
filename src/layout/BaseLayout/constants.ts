import telegram_svg from 'public/icons/telegram_logo.svg';
import instagram_svg from 'public/icons/instagram_logo.svg';
import linkedin_svg from 'public/icons/linkedin_logo.svg';
import facebook_svg from 'public/icons/facebook_logo.svg';

import { type LinkItem } from 'lib/types/common';

export const headerLinks: Array<LinkItem> = [
  { href: '/about-us', text: 'About us' },
  { href: '/roadmap', text: 'Roadmap' },
  { href: '/team', text: 'Team' },
  { href: '/community', text: 'Community' },
];

export const accountLinks: Array<LinkItem> = [{ href: './account/nfts', text: 'Observe my NFT' }];
export const socialLinks: Array<{ alt: string; href: string; src: string }> = [
  { alt: 'Instagram', href: 'https://instagram.com', src: instagram_svg },
  { alt: 'Telegram', href: 'https://telegram.com', src: telegram_svg },
  { alt: 'Linkedin', href: 'https://linkedin.com', src: linkedin_svg },
  { alt: 'Facebook', href: 'https://facebook.com', src: facebook_svg },
];
