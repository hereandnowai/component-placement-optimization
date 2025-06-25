
import React from 'react';
import { PRIMARY_COLOR, SECONDARY_COLOR } from '../constants';
import { LogoIcon } from './icons/LogoIcon';
import { Button } from './common/Button';
import { useLocalization } from '../contexts/LocalizationContext'; // Import useLocalization

interface HeaderProps {
  currentTheme: 'light' | 'dark';
  onToggleTheme: () => void;
}

// ... (SunIcon and MoonIcon remain the same)
const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21c3.089 0 5.897-1.256 7.928-3.262-.764-.81-1.428-1.748-1.926-2.736A9.707 9.707 0 0121.752 15.002z" />
  </svg>
);

const GlobeAltIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3.75h.008v.008h-.008v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.978 11.978 0 0112 13.5c-2.998 0-5.74-1.1-7.843-2.918m0 0A8.959 8.959 0 003 12c0 .778.099 1.533.284 2.253m0 0A11.978 11.978 0 0012 13.5c2.998 0 5.74-1.1 7.843-2.918" />
  </svg>
);


export const Header: React.FC<HeaderProps> = ({ currentTheme, onToggleTheme }) => {
  const { t, language, setLanguage, getLanguageName } = useLocalization();
  const orgDetailsSloganKey = "app.header.orgSlogan"; // Key from constants.ts after update
  const orgDetailsFullNameKey = "org.fullName"; // Key from constants.ts after update
  const orgDetailsShortNameKey = "org.shortName";


  return (
    <header 
      className="p-4 shadow-md text-secondary dark:text-primary"
      style={{ 
        backgroundColor: currentTheme === 'light' ? PRIMARY_COLOR : SECONDARY_COLOR 
      }}
    >
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
          <LogoIcon className="h-10 w-auto" /> {/* Allow auto width */}
          <div>
            <h1 className="text-2xl font-bold">{t('app.title')}</h1>
            <p className="text-sm">{t(orgDetailsShortNameKey)} - {t(orgDetailsSloganKey)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{t(orgDetailsFullNameKey)}</p>
          </div>
          
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'fr' | 'de' | 'es')}
              className={`p-2 rounded-md appearance-none text-sm ${currentTheme === 'light' ? 'bg-yellow-400 text-secondary focus:ring-yellow-500' : 'bg-teal-600 text-primary focus:ring-teal-500'} focus:outline-none focus:ring-2`}
              aria-label={t('app.header.language')}
            >
              {(['en', 'fr', 'de', 'es'] as const).map(langCode => (
                <option key={langCode} value={langCode}>
                  {getLanguageName(langCode)}
                </option>
              ))}
            </select>
             <GlobeAltIcon className={`w-5 h-5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${currentTheme === 'light' ? 'text-secondary' : 'text-primary'}`} />
          </div>

          <Button
            onClick={onToggleTheme}
            variant="icon"
            className={`p-2 rounded-full ${currentTheme === 'light' ? 'text-secondary hover:bg-yellow-400' : 'text-primary hover:bg-teal-600'}`}
            aria-label={t(currentTheme === 'light' ? "app.header.switchToDark" : "app.header.switchToLight")}
          >
            {currentTheme === 'light' ? (
              <MoonIcon className="w-6 h-6" />
            ) : (
              <SunIcon className="w-6 h-6" />
            )}
          </Button>
        </div>
      </div>
      <div className="text-center mt-2 sm:hidden">
         <p className="text-xs font-medium">{t(orgDetailsFullNameKey)}</p>
      </div>
    </header>
  );
};
