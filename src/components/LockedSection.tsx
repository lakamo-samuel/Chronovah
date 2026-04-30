import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, BookOpen, Users, MapPin, ArrowRight } from 'lucide-react';
import { useSubscriptionStore } from '../store/subscriptionStore';

interface LockedSectionProps {
  section: 'journal' | 'people' | 'places';
}

const LockedSection: React.FC<LockedSectionProps> = ({ section }) => {
  const navigate = useNavigate();
  const { isProActive } = useSubscriptionStore();

  // If user is already pro, don't show lock screen
  if (isProActive) {
    return null;
  }

  const sectionConfig = {
    journal: {
      icon: BookOpen,
      title: 'Journal - Pro Feature',
      description: 'Create unlimited journal entries to capture your thoughts, memories, and daily reflections. Free plan limited to 20 entries.',
      features: [
        'Unlimited entries (20 free)',
        'Rich formatting',
        'Search & organize',
        'End-to-end encrypted',
      ],
      colorVar: 'var(--color-journal-400)',
      bgVar: 'var(--color-journal-100)',
      limit: 20,
    },
    people: {
      icon: Users,
      title: 'People - Pro Feature',
      description: 'Build and maintain a meaningful map of the people in your life with detailed profiles and connections. Free plan limited to 12 people.',
      features: [
        'Unlimited profiles (12 free)',
        'Track relationships',
        'Add details & photos',
        'End-to-end encrypted',
      ],
      colorVar: 'var(--color-people-400)',
      bgVar: 'var(--color-people-100)',
      limit: 12,
    },
    places: {
      icon: MapPin,
      title: 'Places - Pro Feature',
      description: 'Create a personal atlas of places that matter to you with photos, memories, and important details. Free plan limited to 15 places.',
      features: [
        'Unlimited locations (15 free)',
        'Attach photos',
        'Store memories',
        'End-to-end encrypted',
      ],
      colorVar: 'var(--color-places-400)',
      bgVar: 'var(--color-places-100)',
      limit: 15,
    },
  };

  const config = sectionConfig[section];
  const Icon = config.icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-2xl w-full">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ backgroundColor: config.bgVar }}
          >
            <Icon className="w-12 h-12" style={{ color: config.colorVar }} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lock className="w-5 h-5" style={{ color: config.colorVar }} />
            <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
              {config.title}
            </h1>
          </div>

          <p className="text-lg mb-8" style={{ color: 'var(--color-text-muted)' }}>
            {config.description}
          </p>

          {/* Feature List */}
          <div className="rounded-xl p-8 mb-8" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
            <h3 className="font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
              Pro features included
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {config.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: config.bgVar }}
                  >
                    <Lock className="w-3 h-3" style={{ color: config.colorVar }} />
                  </div>
                  <span className="text-left" style={{ color: 'var(--color-text-muted)' }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Card */}
          <div
            className="rounded-xl p-6 mb-8 border-2"
            style={{
              backgroundColor: 'var(--color-bg)',
              borderColor: config.colorVar,
            }}
          >
            <p className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
              Chronovah Pro - Unlimited
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <p className="text-3xl font-bold" style={{ color: config.colorVar }}>
                ₦2,500
              </p>
              <span style={{ color: 'var(--color-text-muted)' }}>/month</span>
            </div>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Unlock full access from {config.limit} to unlimited<br/>
              or save with yearly plan for ₦25,000/year
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/upgrade')}
              className="w-full py-4 px-6 text-white font-bold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
              style={{ background: 'var(--gradient-primary)' }}
            >
              Unlock {config.title.split(' ')[0]}
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => navigate('/pricing')}
              className="w-full py-4 px-6 font-bold rounded-lg transition-all"
              style={{
                backgroundColor: 'var(--color-card)',
                border: '2px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              See all plans
            </button>
          </div>
        </div>

        {/* Footer text */}
        <div className="text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <p>
            Notes are free forever. <span style={{ color: 'var(--color-primary)' }} className="font-semibold">Pro unlocks the full vault.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LockedSection;
