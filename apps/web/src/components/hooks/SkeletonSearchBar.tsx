import React from 'react';

export function SkeletonSearchBar() {
  return (
    <div className="mb-1 mt-4 w-full sm:mt-6">
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 ">
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-gray-800 dark:text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          tabIndex={1}
          type="text"
          name="search"
          id="search"
          placeholder="Search your medical records"
          className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border-gray-300 pl-10 pr-12 shadow-md sm:text-sm"
        />
      </div>
    </div>
  );
}
