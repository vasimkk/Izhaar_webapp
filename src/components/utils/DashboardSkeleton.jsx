import React from 'react';
import Skeleton from './Skeleton';

const DashboardSkeleton = () => {
    return (
        <div className="w-full min-h-screen px-4 pb-24 pt-6" style={{ background: 'linear-gradient(135deg, #050505 0%, #1a103c 50%, #2e022d 100%)' }}>
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header Skeleton */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <Skeleton circle width="32px" height="32px" />
                        <Skeleton width="180px" height="24px" />
                    </div>
                    <Skeleton width="80px" height="20px" />
                </div>

                {/* All Services Skeleton */}
                <div className="space-y-6">
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex flex-col items-center gap-3 min-w-[70px]">
                                <Skeleton circle width="60px" height="60px" />
                                <Skeleton width="50px" height="12px" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Big Card Skeleton (SwipeCards) */}
                <div className="w-full aspect-[4/5] max-w-[320px] mx-auto">
                    <Skeleton width="100%" height="100%" borderRadius="2rem" />
                </div>

                {/* Grid Skeletons (Zodiac, Dates, etc) */}
                <div className="space-y-10">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton width="150px" height="20px" />
                            <div className="grid grid-cols-2 gap-4">
                                <Skeleton width="100%" height="120px" borderRadius="1.5rem" />
                                <Skeleton width="100%" height="120px" borderRadius="1.5rem" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Nav Skeleton */}
            <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/40 backdrop-blur-xl border-t border-white/5 flex justify-around items-center px-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} circle width="24px" height="24px" />
                ))}
            </div>
        </div>
    );
};

export default DashboardSkeleton;
