
import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold font-serif text-gray-800">{title}</h2>
      <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
    </div>
  );
};

export default SectionHeader;
