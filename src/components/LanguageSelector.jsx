import React from 'react';
import { useLocalization } from '../context/LocalizationContext';

const LanguageSelector = () => {
  const { language, changeLanguage } = useLocalization();

  return (
    <div className="flex items-center space-x-2">
      <button
        className={`px-2 py-1 rounded ${language === 'en' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        onClick={() => changeLanguage('en')}
      >
        EN
      </button>
      <button
        className={`px-2 py-1 rounded ${language === 'nl' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        onClick={() => changeLanguage('nl')}
      >
        NL
      </button>
      <button
        className={`px-2 py-1 rounded ${language === 'fr' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        onClick={() => changeLanguage('fr')}
      >
        FR
      </button>
    </div>
  );
};

export default LanguageSelector; 