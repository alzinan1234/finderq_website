// @ts-nocheck
'use client'
import React from 'react';
import { useState } from 'react';
import { Star, Award, TrendingUp, Shield } from 'lucide-react';

interface ReputationSystemProps {
  username: string;
  totalMatches?: number;
  winRate?: number;
  rank?: string;
  riotVerified?: boolean;
}

export function ReputationSystem({ username, totalMatches = 284, winRate = 67, rank = "Diamond III", riotVerified = false }: ReputationSystemProps) {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // All reviews data - now in state so we can add new reviews
  const [allReviews, setAllReviews] = useState([
    {
      id: 1,
      author: 'JungleLord',
      initials: 'JK',
      gradient: 'from-cyan-500 to-blue-600',
      rating: 5,
      text: 'Amazing player! Great communication and positive attitude. Carried the game and was very patient with our mistakes. Would definitely play again! 🎮',
      date: '2 days ago'
    },
    {
      id: 2,
      author: 'SupportMain99',
      initials: 'SM',
      gradient: 'from-purple-500 to-pink-600',
      rating: 4,
      text: 'Good player with solid mechanics. Knows the game well. Sometimes tilts a bit but overall a positive experience.',
      date: '5 days ago'
    },
    {
      id: 3,
      author: 'TopGamer',
      initials: 'TG',
      gradient: 'from-green-500 to-emerald-600',
      rating: 5,
      text: 'Excellent teammate! Always makes the right calls and keeps team morale high even when behind. True leader! ⭐',
      date: '1 week ago'
    },
    {
      id: 4,
      author: 'MidLaneCarry',
      initials: 'MC',
      gradient: 'from-orange-500 to-red-600',
      rating: 5,
      text: 'One of the best teammates I\'ve ever had! Always on time, great shotcalling, and amazing mechanics. Highly recommend! 🔥',
      date: '1 week ago'
    },
    {
      id: 5,
      author: 'ADCMain2024',
      initials: 'AD',
      gradient: 'from-indigo-500 to-purple-600',
      rating: 4,
      text: 'Solid player with good game knowledge. Could improve on communication but overall very reliable.',
      date: '2 weeks ago'
    },
    {
      id: 6,
      author: 'ClutchSupport',
      initials: 'CS',
      gradient: 'from-pink-500 to-rose-600',
      rating: 5,
      text: 'Insane player! Won 8 games in a row together. Super friendly and knows when to engage. Will duo again for sure! 💪',
      date: '2 weeks ago'
    },
    {
      id: 7,
      author: 'ProJungler',
      initials: 'PJ',
      gradient: 'from-teal-500 to-cyan-600',
      rating: 5,
      text: 'Great synergy in-game! Knows their role perfectly and adapts to team needs. A+ player!',
      date: '3 weeks ago'
    },
    {
      id: 8,
      author: 'RankedGrinder',
      initials: 'RG',
      gradient: 'from-yellow-500 to-orange-600',
      rating: 4,
      text: 'Good teammate, knows the meta well. Sometimes makes risky plays but it usually pays off.',
      date: '3 weeks ago'
    },
    {
      id: 9,
      author: 'FlexPlayer',
      initials: 'FP',
      gradient: 'from-blue-500 to-indigo-600',
      rating: 5,
      text: 'Very flexible player, can adapt to any role needed. Great map awareness and team coordination!',
      date: '1 month ago'
    },
    {
      id: 10,
      author: 'SoloQMaster',
      initials: 'SQ',
      gradient: 'from-red-500 to-pink-600',
      rating: 4,
      text: 'Strong player overall. Good decision-making and rarely makes the same mistake twice.',
      date: '1 month ago'
    }
  ]);

  const displayedReviews = showAllReviews ? allReviews.slice(0, 10) : allReviews.slice(0, 3);
  
  // Calculate reputation level
  const averageRating = 4.8;
  const getReputationLevel = (rating: number) => {
    if (rating >= 4.8) return { level: 'Legendary', color: 'from-yellow-400 via-orange-500 to-red-500', icon: Award };
    if (rating >= 4.5) return { level: 'Trusted Elite', color: 'from-purple-400 to-pink-500', icon: Shield };
    if (rating >= 4.0) return { level: 'Reliable', color: 'from-blue-400 to-cyan-500', icon: TrendingUp };
    return { level: 'New Player', color: 'from-gray-400 to-gray-500', icon: Star };
  };

  const reputationLevel = getReputationLevel(averageRating);
  const ReputationIcon = reputationLevel.icon;
  
  // Function to handle review submission
  const handleSubmitReview = () => {
    if (reviewRating > 0) {
      // Get current user's name from localStorage or use "You" as default
      const currentUser = localStorage.getItem('username') || 'You';
      
      // Create initials from username
      const getInitials = (name: string) => {
        const words = name.split(' ');
        if (words.length >= 2) {
          return words[0][0] + words[1][0];
        }
        return name.substring(0, 2).toUpperCase();
      };
      
      // Random gradient for the new review
      const gradients = [
        'from-cyan-500 to-blue-600',
        'from-purple-500 to-pink-600',
        'from-green-500 to-emerald-600',
        'from-orange-500 to-red-600',
        'from-indigo-500 to-purple-600',
        'from-pink-500 to-rose-600',
        'from-teal-500 to-cyan-600',
        'from-yellow-500 to-orange-600',
        'from-blue-500 to-indigo-600',
        'from-red-500 to-pink-600'
      ];
      const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
      
      // Create the new review object
      const newReview = {
        id: allReviews.length + 1,
        author: currentUser,
        initials: getInitials(currentUser),
        gradient: randomGradient,
        rating: reviewRating,
        text: reviewText || `Rated ${reviewRating} star${reviewRating !== 1 ? 's' : ''}`,
        date: 'Just now'
      };
      
      // Add new review at the beginning of the array
      setAllReviews([newReview, ...allReviews]);
      
      // Reset form and close modal
      setIsReviewModalOpen(false);
      setReviewRating(0);
      setReviewText('');
      
      // Show success message
      alert('Review submitted successfully! 🎉');
    }
  };
  
  return (
    <div className="mb-6 space-y-4">
      {/* Section Header with Reputation Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <Star className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <h3 className="text-white text-xl font-semibold">Player Reputation</h3>
            <p className="text-white/50 text-xs">Community verified ratings</p>
          </div>
        </div>
        
        {/* Reputation Badge */}
        <div className={`px-4 py-2 bg-gradient-to-r ${reputationLevel.color} rounded-xl flex items-center gap-2 shadow-lg`}>
          <ReputationIcon className="w-4 h-4 text-white" />
          <span className="text-white text-sm font-bold">{reputationLevel.level}</span>
        </div>
      </div>

      {/* Enhanced Reputation Overview Card */}
      <div className="bg-gradient-to-br from-[#1a1d29] via-[#1e2230] to-[#1a1d29] rounded-2xl p-6 border border-white/10 relative overflow-hidden shadow-2xl">
        {/* Animated Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-transparent rounded-full -translate-y-32 translate-x-32 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full translate-y-24 -translate-x-24 blur-3xl"></div>
        
        <div className="relative grid grid-cols-3 gap-6">
          {/* Overall Rating - Enhanced */}
          <div className="col-span-1 flex flex-col items-center justify-center py-3 relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-xl blur-xl"></div>
            
            <div className="relative">
              <div className="text-lg sm:text-xl md:text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 bg-gradient-to-br from-yellow-400 via-orange-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-lg">
                4.8
              </div>
              <div className="flex gap-1 mb-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400/40 fill-yellow-400/40'}`}
                  />
                ))}
              </div>
              <p className="text-white/60 text-xs text-center mb-3">Based on 127 reviews</p>
              
              {/* Progress to next level */}
              <div className="w-full mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/40 text-[10px]">Progress</span>
                  <span className="text-white/60 text-[10px] font-semibold">95%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" style={{ width: '95%' }}></div>
                </div>
                <p className="text-white/40 text-[9px] text-center mt-1">5 reviews to Legendary+</p>
              </div>
              
              <button 
                onClick={() => setIsReviewModalOpen(true)}
                className="w-full px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg text-sm font-semibold hover:shadow-xl hover:shadow-yellow-500/30 transition-all transform hover:scale-105"
              >
                Leave Review
              </button>
            </div>
          </div>

          {/* Rating Distribution - Enhanced */}
          <div className="col-span-2 space-y-2">
            <h4 className="text-white/80 text-sm font-semibold mb-3">Rating Distribution</h4>
            {[
              { stars: 5, count: 89, percentage: 70 },
              { stars: 4, count: 28, percentage: 22 },
              { stars: 3, count: 7, percentage: 5.5 },
              { stars: 2, count: 2, percentage: 1.5 },
              { stars: 1, count: 1, percentage: 1 }
            ].map((rating) => (
              <div key={rating.stars} className="flex items-center gap-3 group">
                <div className="flex items-center gap-1.5 w-20">
                  <span className="text-white/70 text-sm font-medium">{rating.stars}</span>
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                </div>
                <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-500 rounded-full transition-all duration-700 group-hover:shadow-lg group-hover:shadow-yellow-500/50"
                    style={{ width: `${rating.percentage}%` }}
                  ></div>
                </div>
                <span className="text-white/50 text-sm w-12 text-right font-medium">{rating.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="relative grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10">
          {riotVerified ? (
            <div className="flex items-center gap-2 bg-[#00d4ff]/10 rounded-lg px-3 py-2 border border-[#00d4ff]/20">
              <Shield className="w-4 h-4 text-[#00d4ff]" />
              <div>
                <p className="text-[#00d4ff] text-xs font-semibold">Verified</p>
                <p className="text-white/40 text-[10px]">Riot Account</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
              <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <div>
                <p className="text-white/40 text-xs font-semibold">Not Verified</p>
                <p className="text-white/30 text-[10px]">Riot Account</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 bg-blue-500/10 rounded-lg px-3 py-2 border border-blue-500/20">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <div>
              <p className="text-blue-400 text-xs font-semibold">+12%</p>
              <p className="text-white/40 text-[10px]">This Month</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-purple-500/10 rounded-lg px-3 py-2 border border-purple-500/20">
            <Award className="w-4 h-4 text-purple-400" />
            <div>
              <p className="text-purple-400 text-xs font-semibold">Top 5%</p>
              <p className="text-white/40 text-[10px]">Community</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reviews - Enhanced */}
      <div className="bg-gradient-to-br from-[#1a1d29] to-[#1a1d29]/50 rounded-xl p-5 border border-white/10 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white text-base font-semibold">Recent Player Reviews</h4>
          <button 
            className="px-3 py-1.5 bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 text-[#00d4ff] rounded-lg text-xs font-medium transition-all border border-[#00d4ff]/20" 
            onClick={() => setShowAllReviews(!showAllReviews)}
          >
            {showAllReviews ? 'Show Less' : 'View All (127)'}
          </button>
        </div>
        
        <div className="space-y-3">
          {displayedReviews.map((review) => (
            <div key={review.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all border border-white/5 hover:border-white/10 group">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${review.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-white text-sm font-bold">{review.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-white text-sm font-semibold">{review.author}</h5>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20 fill-white/20'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-white/70 text-xs mb-2 leading-relaxed">
                    {review.text}
                  </p>
                  <span className="text-white/40 text-[10px]">{review.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leave Review Modal */}
      {isReviewModalOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-50 p-3 sm:p-4"
          onClick={() => setIsReviewModalOpen(false)}
        >
          <div 
            className="bg-[#242836] rounded-2xl max-w-md w-full p-6 relative border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
                  <Star className="w-5 h-5 text-white fill-white" />
                </div>
                <div>
                  <h3 className="text-white text-xl">Leave a Review</h3>
                  <p className="text-white/60 text-sm">Rate your experience with {username}</p>
                </div>
              </div>
            </div>

            {/* Rating Selector */}
            <div className="mb-6">
              <label className="text-white text-sm mb-3 block">Your Rating</label>
              <div className="flex items-center justify-center gap-2 py-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-all duration-200 transform hover:scale-110"
                  >
                    <Star 
                      className={`w-10 h-10 transition-colors ${
                        star <= (hoverRating || reviewRating) 
                          ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' 
                          : 'text-white/20 fill-white/20'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {reviewRating > 0 && (
                <p className="text-center text-white/60 text-sm">
                  {reviewRating === 5 && '⭐ Excellent!'}
                  {reviewRating === 4 && '👍 Great!'}
                  {reviewRating === 3 && '👌 Good'}
                  {reviewRating === 2 && '😐 Fair'}
                  {reviewRating === 1 && '👎 Poor'}
                </p>
              )}
            </div>

            {/* Review Text */}
            <div className="mb-6">
              <label className="text-white text-sm mb-2 block">Your Review (optional)</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience playing with this player..."
                className="w-full px-4 py-3 bg-[#0a0e27] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder:text-white/40 text-sm resize-none"
                rows={4}
                maxLength={500}
              />
              <p className="text-white/40 text-xs mt-2 text-right">{reviewText.length}/500</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsReviewModalOpen(false);
                  setReviewRating(0);
                  setReviewText('');
                }}
                className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={reviewRating === 0}
                className={`flex-1 px-4 py-2.5 rounded-lg transition-all ${
                  reviewRating > 0
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg hover:shadow-yellow-500/30'
                    : 'bg-white/5 text-white/40 cursor-not-allowed'
                }`}
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}