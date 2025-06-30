import { testimonials } from '@/data/testimonials';

interface TestimonialsBannerProps {
  max?: number;
  className?: string;
}

export default function TestimonialsBanner({ max = 3, className = '' }: TestimonialsBannerProps) {
  const items = testimonials.slice(0, max);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {items.map((t, i) => (
        <div
          key={i}
          className="bg-white text-gray-800 rounded-xl px-6 py-4 shadow-lg max-w-xl mx-auto"
        >
          <p className="text-sm leading-relaxed mb-2">{t.quote}</p>
          <p className="text-xs text-gray-500 font-medium">{t.author}</p>
        </div>
      ))}
    </div>
  );
} 