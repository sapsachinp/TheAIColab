import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@mui/material';
import { Language } from '@mui/icons-material';

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      onClick={toggleLanguage}
      variant="outlined"
      startIcon={<Language />}
      sx={{
        px: 3,
        py: 1,
        fontWeight: 600,
        fontSize: '0.95rem',
        borderRadius: 3,
        borderColor: '#10b981',
        color: '#0f172a',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        '&:hover': {
          borderColor: '#059669',
          backgroundColor: '#f0fdf4',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
        },
      }}
      aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      {language === 'en' ? 'العربية' : 'English'}
    </Button>
  );
};

export default LanguageSwitcher;
