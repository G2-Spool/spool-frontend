import React from 'react';

export const LearningPathSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-96 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-lg shadow-sm p-6 sticky top-8 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
              
              {/* Section Items */}
              {Array.from({ length: 4 }).map((_, sectionIndex) => (
                <div key={sectionIndex} className="mb-6">
                  <div className="h-5 bg-gray-200 rounded w-40 mb-3"></div>
                  {Array.from({ length: 3 }).map((_, conceptIndex) => (
                    <div key={conceptIndex} className="ml-4 mb-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                  ))}
                </div>
              ))}
              
              {/* Progress Bar */}
              <div className="mt-6 pt-4 border-t">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-300 h-2 rounded-full w-0"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-9">
            <div className="bg-card rounded-lg shadow-sm p-6 lg:p-8 animate-pulse">
              {/* Concept Header */}
              <div className="mb-6">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-48"></div>
              </div>

              {/* Content Sections */}
              <div className="space-y-8">
                {/* Hook Section */}
                <div>
                  <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>

                {/* Examples Section */}
                <div>
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="bg-gray-100 p-4 rounded-lg">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-6 border-t">
                  <div className="h-10 w-24 bg-gray-200 rounded"></div>
                  <div className="h-10 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ConceptSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Concept Header */}
      <div>
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-64"></div>
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        <div>
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>

        <div>
          <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-100 p-4 rounded">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};