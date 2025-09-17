
import React, { useEffect, useRef, useState } from 'react';
import { Star, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Nakato Grace",
    rating: 5,
    comment: "Link Guardian has saved me from several phishing attempts. The heuristic analysis is incredibly accurate!",
    date: "2024-06-15"
  },
  {
    id: 2,
    name: "Okello Samuel",
    rating: 5,
    comment: "As a security professional, I'm impressed by the comprehensive threat detection. Great tool!",
    date: "2024-06-12"
  },
  {
    id: 3,
    name: "Namukasa Rebecca",
    rating: 4,
    comment: "Easy to use and very reliable. The bulk check feature is particularly useful for my work.",
    date: "2024-06-10"
  },
  {
    id: 4,
    name: "Wamala Daniel",
    rating: 5,
    comment: "The PWA works perfectly offline. Love the detailed analysis reports!",
    date: "2024-06-08"
  },
  {
    id: 5,
    name: "Namatovu Peace",
    rating: 5,
    comment: "Finally, a link checker that actually works! The real-time scanning is fantastic.",
    date: "2024-06-05"
  },
  {
    id: 6,
    name: "Kigozi Moses",
    rating: 4,
    comment: "Comprehensive security analysis with clear explanations. Highly recommended!",
    date: "2024-06-03"
  }
];

const ReviewsSection = () => {
  const [visibleReviews, setVisibleReviews] = useState<number[]>([]);
  const reviewRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleReviews(prev => {
              if (!prev.includes(index)) {
                return [...prev, index];
              }
              return prev;
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '50px'
      }
    );

    reviewRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      reviewRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <section ref={sectionRef} className="py-16 bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Security-Conscious Users
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            See what users are saying about Link Guardian's advanced threat detection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              ref={(el) => (reviewRefs.current[index] = el)}
              data-index={index}
              className={`review-card transform transition-all duration-700 ease-out ${
                visibleReviews.includes(index)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
              style={{
                transitionDelay: `${index * 150}ms`,
                overflow: 'visible',
                width: '280px',
                height: '320px',
                margin: '0 auto'
              }}
            >
              <div className="review-content w-full h-full relative hover:rotate-y-180" style={{
                transformStyle: 'preserve-3d',
                transition: 'transform 300ms',
                boxShadow: '0px 0px 15px 3px rgba(6, 182, 212, 0.3)',
                borderRadius: '8px'
              }}>
                {/* Front of card */}
                <div className="review-front absolute w-full h-full rounded-lg overflow-hidden" style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: 'linear-gradient(135deg, hsl(210 40% 8%) 0%, hsl(222 47% 11%) 100%)'
                }}>
                  <div className="front-content absolute w-full h-full p-4 flex flex-col justify-between text-white">
                    <div className="badge bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm w-fit">
                      <div className="flex space-x-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <div className="description bg-black/60 p-4 rounded-lg backdrop-blur-md shadow-lg">
                      <div className="title text-sm flex justify-between items-start mb-2">
                        <p className="font-semibold text-cyan-100">{review.name}</p>
                        <p className="text-xs text-cyan-300">{review.date}</p>
                      </div>
                      <p className="text-sm text-gray-200 leading-relaxed">"{review.comment}"</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-blue-900/20"></div>
                </div>

                {/* Back of card */}
                <div className="review-back absolute w-full h-full rounded-lg flex justify-center items-center overflow-hidden" style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  background: 'hsl(210 40% 8%)'
                }}>
                  <div className="absolute w-40 h-40 rounded-full animate-spin" style={{
                    background: 'linear-gradient(90deg, transparent, hsl(178 95% 45%), hsl(178 95% 45%), hsl(178 95% 45%), hsl(178 95% 45%), transparent)',
                    animationDuration: '5s'
                  }}></div>
                  <div className="back-content absolute w-[98%] h-[98%] rounded-lg flex flex-col justify-center items-center gap-6 text-white" style={{
                    background: 'hsl(210 40% 8%)'
                  }}>
                    <div className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center">
                      <User size={28} className="text-gray-900" />
                    </div>
                    <div className="text-center">
                      <h4 className="text-lg font-bold text-cyan-100 mb-1">{review.name}</h4>
                      <p className="text-sm text-cyan-300">Verified User</p>
                    </div>
                    <div className="floating-elements relative">
                      <div className="absolute w-20 h-20 rounded-full bg-cyan-400/30 blur-md animate-bounce" style={{
                        left: '-40px',
                        top: '-20px',
                        animationDelay: '0ms',
                        animationDuration: '2600ms'
                      }}></div>
                      <div className="absolute w-8 h-8 rounded-full bg-cyan-500/40 blur-sm animate-bounce" style={{
                        right: '-30px',
                        top: '10px',
                        animationDelay: '-800ms',
                        animationDuration: '2600ms'
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 text-cyan-400">
            <div className="flex space-x-1">
              {renderStars(5)}
            </div>
            <span className="text-lg font-semibold">4.8/5</span>
            <span className="text-gray-400">• 10,000+ scans performed</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
