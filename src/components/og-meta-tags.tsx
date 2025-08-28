import { Helmet } from 'react-helmet-async';
import { PropsWithChildren } from 'react';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

interface OgMetaTagsProps {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: string; // e.g. "website", "article", "profile", ...
  twitterCard?: string; // default usually "summary_large_image"
  siteName?: string; // optional: e.g. "Watchit App"
}

export function OgMetaTags({
  title,
  description,
  image = GLOBAL_CONSTANTS.LOGO_URL,
  url,
  type = 'website',
  twitterCard = 'summary_large_image',
  siteName,
  children,
}: PropsWithChildren<OgMetaTagsProps>) {
  return (
    <>
      <Helmet>
        {/* HTML Title (Also used in browser tab) */}
        <title>{title}</title>

        {/* Open Graph / Facebook */}
        <meta property="og:title" content={title} />
        {siteName && <meta property="og:site_name" content={siteName} />}
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content={type} />

        {/* Twitter */}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:card" content={twitterCard} />
      </Helmet>
      {children}
    </>
  );
}
