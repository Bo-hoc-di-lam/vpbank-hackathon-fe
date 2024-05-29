import React from 'react';

export const GroupShape = ({ data }) => {
  return (
    <div className="p-2.5 bg-yellow-50 border border-yellow-300 rounded-md h-full -z-50 relative">
      <span className="font-semibold text-gray-800 text-sm">
        {data.label}
      </span>
    </div>
  );
};
