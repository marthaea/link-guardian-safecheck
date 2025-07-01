
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
    name: "Sarah Chen",
    rating: 5,
    comment: "Link Guardian has saved me from several phishing attempts. The heuristic analysis is incredibly accurate!",
    date: "2024-06-15"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    rating: 5,
    comment: "As a security professional, I'm impressed by the comprehensive threat detection. Great tool!",
    date: "2024-06-12"
  },
  {
    id: 3,
    name: "Emily Johnson",
    rating: 4,
    comment: "Easy to use and very reliable. The bulk check feature is particularly useful for my work.",
    date: "2024-06-10"
  },
  {
    id: 4,
    name: "David Kim",
    rating: 5,
    comment: "The PWA works perfectly offline. Love the detailed analysis reports!",
    date: "2024-06-08"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    rating: 5,
    comment: "Finally, a link checker that actually works! The real-time scanning is fantastic.",
    date: "2024-06-05"
  },
  {
    id: 6,
    name: "Alex Park",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              ref={(el) => (reviewRefs.current[index] = el)}
              data-index={index}
              className={`transform transition-all duration-700 ease-out ${
                visibleReviews.includes(index)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
              style={{
                transitionDelay: `${index * 150}ms`
              }}
            >
              <Card className="bg-gray-800 border-gray-700 hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20 animate-fade-in">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center">
                        <User size={20} className="text-gray-900" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{review.name}</h4>
                        <p className="text-sm text-gray-400">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    "{review.comment}"
                  </p>
                </CardContent>
              </Card>
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
