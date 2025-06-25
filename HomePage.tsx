
import React from 'react';
import { PRIMARY_COLOR, SECONDARY_COLOR, ACCENT_COLOR } from '../constants';
import { LogoIcon } from './icons/LogoIcon';
import { Button } from './common/Button';
import { Footer } from './Footer';
import { useLocalization } from '../contexts/LocalizationContext'; // Import useLocalization

interface HomePageProps {
  onStart: () => void;
}

const FeatureCard: React.FC<{ titleKey: string; descriptionKey: string; icon?: React.ReactNode }> = ({ titleKey, descriptionKey, icon }) => {
  const { t } = useLocalization();
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      {icon && <div className="text-primary mb-3">{icon}</div>}
      <h4 className="text-xl font-semibold mb-2 text-accent">{t(titleKey)}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">{t(descriptionKey)}</p>
    </div>
  );
};

export const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  const { t } = useLocalization();
  const orgFullNameKey = "org.fullName";
  const orgSloganKey = "app.header.orgSlogan";


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-darkBg text-gray-800 dark:text-lightText selection:bg-primary selection:text-secondary">
      <header 
        className="py-10 px-4 text-center shadow-md" 
        style={{ 
          background: `linear-gradient(135deg, ${SECONDARY_COLOR} 0%, ${ACCENT_COLOR} 100%)`,
          color: PRIMARY_COLOR 
        }}
      >
        <div className="container mx-auto flex flex-col items-center">
          <LogoIcon className="h-36 mb-5 w-auto" />
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">
            {t('homepage.title')}
          </h1>
          <p className="text-lg md:text-xl mb-1 font-medium text-yellow-300">
            {t(orgFullNameKey)}
          </p>
          <p className="text-md italic text-yellow-200 opacity-90">
            {t(orgSloganKey)}
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-6 py-12 md:py-16 text-center flex flex-col items-center justify-center">
        <section className="mb-12 md:mb-16 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-secondary dark:text-primary">
            {t('homepage.tagline')}
          </h2>
          <p className="text-lg mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('homepage.description')}
          </p>
          <p className="text-md text-gray-600 dark:text-gray-400">
            {t('homepage.subDescription')}
          </p>
        </section>

        <section className="mb-12 md:mb-16 w-full max-w-5xl">
          <h3 className="text-2xl md:text-3xl font-semibold mb-8 md:mb-10 text-secondary dark:text-primary">{t('homepage.coreCapabilities')}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              titleKey="homepage.feature.autoPlacement.title"
              descriptionKey="homepage.feature.autoPlacement.description"
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>}
            />
            <FeatureCard 
              titleKey="homepage.feature.thermalSim.title"
              descriptionKey="homepage.feature.thermalSim.description"
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.362-3.797A8.23 8.23 0 0112 2.25c1.131 0 2.203.255 3.148.718A8.251 8.251 0 0015.362 5.214zM12 12.75a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" /></svg>}
            />
            <FeatureCard 
              titleKey="homepage.feature.signalIntegrity.title"
              descriptionKey="homepage.feature.signalIntegrity.description"
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.136 12.001a8.25 8.25 0 0113.728 0M1.982 8.965a11.25 11.25 0 0119.036 0" /></svg>}
            />
          </div>
        </section>

        <Button
          onClick={onStart}
          variant="primary"
          className="text-lg md:text-xl py-3 md:py-4 px-8 md:px-10 transform hover:scale-105 focus:ring-offset-darkBg"
          aria-label={t('homepage.launchButton')}
        >
          {t('homepage.launchButton')}
        </Button>
      </main>

      <Footer />
    </div>
  );
};
