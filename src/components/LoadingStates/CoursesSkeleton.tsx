import React from 'react';

const CourseCardSkeleton: React.FC = () => (
  <div className="bg-gray-50 p-6 rounded-lg shadow-sm animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div>
        <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="h-6 w-6 bg-gray-200 rounded"></div>
    </div>
    
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-16"></div>
    </div>
    
    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
      <div className="bg-gray-300 h-2 rounded-full w-0"></div>
    </div>
    
    <div className="flex justify-between text-sm">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </div>
  </div>
);

interface CoursesSkeletonProps {
  count?: number;
}

export const CoursesSkeleton: React.FC<CoursesSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <CourseCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const CoursesPageSkeleton: React.FC = () => {
  return (
    <div className="p-6">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
      </div>
      
      {/* Search and Filters Skeleton */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      {/* Category Tabs Skeleton */}
      <div className="mb-6 flex gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
      
      {/* Course Cards */}
      <CoursesSkeleton />
    </div>
  );
};