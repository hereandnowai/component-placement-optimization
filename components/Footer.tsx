import React from 'react';
import { ORGANIZATION_DETAILS, SOCIAL_LINKS, SECONDARY_COLOR } from '../constants';
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon, YoutubeIcon, GlobeIcon } from './icons/SocialIcons';
import { useLocalization } from '../contexts/LocalizationContext';

export const Footer: React.FC = () => {
  const { t } = useLocalization();
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: SECONDARY_COLOR }} className="text-primary p-6 text-center">
      <div className="container mx-auto">
        <div className="flex justify-center space-x-6 mb-4">
          <a href={SOCIAL_LINKS.blog} target="_blank" rel="noopener noreferrer" aria-label={t('footer.social.blog')} className="hover:opacity-75"><GlobeIcon className="w-6 h-6" /></a>
          <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label={t('footer.social.linkedin')} className="hover:opacity-75"><LinkedinIcon className="w-6 h-6" /></a>
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label={t('footer.social.instagram')} className="hover:opacity-75"><InstagramIcon className="w-6 h-6" /></a>
          <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" aria-label={t('footer.social.github')} className="hover:opacity-75"><GithubIcon className="w-6 h-6" /></a>
          <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" aria-label={t('footer.social.twitter')} className="hover:opacity-75"><TwitterIcon className="w-6 h-6" /></a>
          <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" aria-label={t('footer.social.youtube')} className="hover:opacity-75"><YoutubeIcon className="w-6 h-6" /></a>
        </div>
        <p className="text-sm mb-1">
          {t(ORGANIZATION_DETAILS.fullNameKey)}
        </p>
        <p className="text-sm mb-1">
          {t('footer.contact')}: <a href={`mailto:${ORGANIZATION_DETAILS.email}`} className="hover:underline">{ORGANIZATION_DETAILS.email}</a> | {ORGANIZATION_DETAILS.mobile}
        </p>
        <p className="text-xs">
          &copy; {currentYear} {t(ORGANIZATION_DETAILS.shortNameKey)}. {t('footer.rightsReserved')}. {t('footer.website')}: <a href={ORGANIZATION_DETAILS.website} target="_blank" rel="noopener noreferrer" className="hover:underline">{ORGANIZATION_DETAILS.website}</a>
        </p>
        <p className="text-xs mt-1">
          {t('footer.developedBy')}
        </p>
      </div>
    </footer>
  );
};