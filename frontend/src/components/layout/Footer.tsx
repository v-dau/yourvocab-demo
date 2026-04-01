import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { BookOpen, Mail, Heart, FileText, Shield, Lock } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

interface FooterProps {
  onFeedbackClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onFeedbackClick = () => {} }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleFeedbackClick = () => {
    onFeedbackClick();
    navigate('/feedbacks');
  };

  return (
    <footer className="relative bg-background text-sm font-medium text-gray-600 w-full shadow-[0px_-10px_15px_-3px_rgba(0,0,0,0.1)] dark:shadow-none dark:border-t dark:border-border dark:text-gray-400">
      <div className="flex flex-col lg:flex-row justify-between gap-4 px-6 py-6 md:px-6 transition-opacity">
        {/* Left Section */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1.5 font-bold">
            <BookOpen className="h-5 w-5" />
            <span>Yourvocab</span>
          </div>
          <span>-</span>
          <span>
            {t(
              'footer.description',
              'Learn vocabulary effectively with spaced repetition and smart flashcards.'
            )}
          </span>
        </div>

        {/* Right Section */}
        <div className="flex flex-wrap items-center gap-4">
          <a
            href="mailto:contact@yourvocab.com"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            title={t('footer.contactTitle', 'Contact Us')}
          >
            <Mail className="h-4 w-4" />
            <span>{t('footer.contact', 'contact')}</span>
          </a>
          <button
            onClick={handleFeedbackClick}
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            title={t('footer.supportTitle', 'Support')}
          >
            <Heart className="h-4 w-4" />
            <span>{t('footer.support', 'support')}</span>
          </button>
          <a
            href="https://github.com/HienB2306616"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            title={t('footer.githubTitle', 'GitHub')}
          >
            <FaGithub className="h-4 w-4" />
            <span>{t('footer.github', 'github')}</span>
          </a>
          <Link
            to="#"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            title={t('footer.termsTitle', 'Terms of Service')}
          >
            <FileText className="h-4 w-4" />
            <span>{t('footer.terms', 'terms')}</span>
          </Link>
          <Link
            to="#"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            title={t('footer.securityTitle', 'Security Policy')}
          >
            <Shield className="h-4 w-4" />
            <span>{t('footer.security', 'security')}</span>
          </Link>
          <Link
            to="#"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            title={t('footer.privacyTitle', 'Privacy Policy')}
          >
            <Lock className="h-4 w-4" />
            <span>{t('footer.privacy', 'privacy')}</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};
