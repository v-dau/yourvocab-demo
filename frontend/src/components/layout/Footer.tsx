import React from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { BookOpen } from 'lucide-react';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';

interface FooterProps {
  onFeedbackClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onFeedbackClick = () => {} }) => {
  const navigate = useNavigate();

  const handleFeedbackClick = () => {
    onFeedbackClick();
    navigate('/feedbacks');
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="px-6 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-bold text-foreground">Yourvocab</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Learn vocabulary effectively with spaced repetition and smart flashcards.
            </p>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground text-sm">Product</h3>
            <Link
              to="/cards"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cards
            </Link>
            <Link
              to="/review"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Spaced Repetition
            </Link>
            <Link
              to="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          </div>

          {/* Support Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground text-sm">Support</h3>
            <button
              onClick={handleFeedbackClick}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
            >
              Feedbacks
            </button>
            <Link
              to="/settings"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Settings
            </Link>
            <a
              href="mailto:support@yourvocab.com"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact Us
            </a>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground text-sm">Follow Us</h3>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="#" title="Twitter">
                  <FaTwitter className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="#" title="LinkedIn">
                  <FaLinkedin className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <a href="#" title="Github">
                  <FaGithub className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-6"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; 2026 Yourvocab. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="#" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="#" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <a
              href="mailto:support@yourvocab.com"
              className="hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
