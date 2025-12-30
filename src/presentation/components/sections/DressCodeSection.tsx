import type { DressCodeSection as DressCodeSectionData } from '../../../domain/event/Event';

interface DressCodeSectionProps {
  data: DressCodeSectionData;
}

export function DressCodeSection({ data }: DressCodeSectionProps) {
  const {
    title = 'Dress Code',
    code,
    description,
    icon = '👔',
    pinterest_url,
  } = data;

  return (
    <div className="animate-fade-in-up w-full max-w-sm mx-auto py-6 text-center">
      {/* Title */}
      <h3 className="font-event-display text-xl sm:text-2xl text-event-primary mb-4">
        {title}
      </h3>

      {/* Card */}
      <div className="bg-event-primary/5 border border-event-primary/20 rounded-2xl p-6">
        {/* Icon */}
        <div className="text-4xl mb-3">
          {icon}
        </div>

        {/* Code */}
        <p className="font-event-display text-lg text-event-text font-medium">
          {code}
        </p>

        {/* Description */}
        {description && (
          <p className="font-event-body text-event-text/60 text-sm mt-2">
            {description}
          </p>
        )}

        {/* Pinterest Link */}
        {pinterest_url && (
          <a
            href={pinterest_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-event-primary/10 border border-event-primary/30 text-event-primary font-event-body text-sm rounded-full hover:bg-event-primary hover:text-white transition-colors duration-300"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 19c-.721 0-1.418-.109-2.076-.312a4.5 4.5 0 01-2.603-2.603C7.109 15.418 7 14.721 7 14s.109-1.418.312-2.076a4.5 4.5 0 012.603-2.603C10.582 9.109 11.279 9 12 9s1.418.109 2.076.312a4.5 4.5 0 012.603 2.603C16.891 12.582 17 13.279 17 14s-.109 1.418-.312 2.076a4.5 4.5 0 01-2.603 2.603C13.418 18.891 12.721 19 12 19z" />
            </svg>
            Ver inspiración en Pinterest
          </a>
        )}
      </div>
    </div>
  );
}

