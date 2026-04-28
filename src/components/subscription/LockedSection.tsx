import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, MapPin, ArrowLeft } from 'lucide-react';

interface LockedSectionProps {
  section: 'journal' | 'people' | 'places';
}

interface SectionConfig {
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  iconColorClass: string;
  iconBgClass: string;
}

const sectionConfigs: Record<string, SectionConfig> = {
  journal: {
    title: 'Journal is a Pro feature',
    description: 'Capture your daily mood, thoughts and life moments. Your journal is private, encrypted and synced across all your devices.',
    features: [
      'End-to-end encrypted',
      'Mood and weather tracking',
      'Synced across devices',
    ],
    icon: <BookOpen className="w-12 h-12" />,
    iconColorClass: 'text-journal',
    iconBgClass: 'bg-journal-bg dark:bg-journal-bg-dark',
  },
  people: {
    title: 'People is a Pro feature',
    description: 'Keep track of the important people in your life — friends, family, colleagues. Never forget a birthday or how you met.',
    features: [
      'Contact details',
      'Birthday reminders',
      'Relationship tracking',
    ],
    icon: <Users className="w-12 h-12" />,
    iconColorClass: 'text-people',
    iconBgClass: 'bg-people-bg dark:bg-people-bg-dark',
  },
  places: {
    title: 'Places is a Pro feature',
    description: 'Remember every place you have visited — restaurants, cities, landmarks. Build your personal travel and discovery journal.',
    features: [
      'GPS coordinates',
      'Ratings and costs',
      'Visit dates and photos',
    ],
    icon: <MapPin className="w-12 h-12" />,
    iconColorClass: 'text-places',
    iconBgClass: 'bg-places-bg dark:bg-places-bg-dark',
  },
};

const LockedSection: React.FC<LockedSectionProps> = ({ section }) => {
  const navigate = useNavigate();
  const config = sectionConfigs[section];

  if (!config) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-card dark:bg-default relative">
      {/* Blurred background preview effect */}
      <div className="absolute inset-0 blur-2xl opacity-5 bg-gradient-primary"></div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-default dark:bg-card rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div
              className={`${config.iconBgClass} p-4 rounded-full ${
                config.iconColorClass
              }`}
            >
              {config.icon}
            </div>
          </div>

          {/* Pro Badge */}
          <div className="flex justify-center">
            <div className="bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
              Pro
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-primary dark:text-primary-200">
            {config.title}
          </h1>

          {/* Description */}
          <p className="text-center text-muted dark:text-muted leading-relaxed">
            {config.description}
          </p>

          {/* Features */}
          <div className="space-y-2">
            {config.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-primary dark:text-primary-200 text-sm">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Price Callout */}
          <div className="bg-gradient-primary/5 dark:bg-gradient-primary/10 rounded-xl p-4 border border-primary-200 dark:border-primary-800">
            <p className="font-semibold text-primary dark:text-primary-200 mb-1">
              Chronovah Pro
            </p>
            <p className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              ₦2,500/month or ₦25,000/year
            </p>
            <p className="text-xs text-muted dark:text-muted">
              Cancel anytime · Notes stay free forever
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <button
              onClick={() => navigate('/upgrade')}
              className="w-full py-3 px-4 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
              style={{ background: 'var(--gradient-primary)' }}
            >
              Unlock {section.charAt(0).toUpperCase() + section.slice(1)} with Pro →
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full py-3 px-4 font-semibold rounded-lg hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
              style={{
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LockedSection;
