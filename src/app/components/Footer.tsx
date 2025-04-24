import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-blue-600/10 to-blue-500/10 backdrop-blur-sm border-t border-blue-100/20">
      <div className="container mx-auto h-full flex items-center justify-center text-sm text-white">
        <a 
          href="https://www.baz-d.co.il" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-blue-200 transition-colors duration-200"
        >
          בוט זה נבנה על ידי <span className="underline underline-offset-2">Baz Dynamics</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer; 