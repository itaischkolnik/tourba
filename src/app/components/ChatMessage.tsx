import React, { useState } from 'react';
import Image from 'next/image';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  gif?: string;
  onGifLoad?: () => void;
  buttons?: string[];
  onButtonClick?: (value: string) => void;
  inputType?: 'text' | 'number' | 'email' | 'tel';
  onInputSubmit?: (value: string) => void;
  placeholder?: string;
  inputValidation?: (value: string) => boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isBot, 
  gif, 
  onGifLoad,
  buttons,
  onButtonClick,
  inputType,
  onInputSubmit,
  placeholder,
  inputValidation
}) => {
  const [inputValue, setInputValue] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue && (!inputValidation || inputValidation(inputValue))) {
      onInputSubmit?.(inputValue);
      setInputValue('');
    }
  };

  const handleButtonClick = (button: string) => {
    setSelectedButton(button);
    onButtonClick?.(button);
  };

  const getButtonStyle = (button: string) => {
    // Check if this is the goals question and if it's the analysis button
    const isGoalsQuestion = message.includes('מה **המטרה שלך**');
    const isAnalysisButton = button === 'ניתוח תיק פיננסי פנסיוני מלא';

    if (isGoalsQuestion && isAnalysisButton) {
      return 'bg-red-500 hover:bg-red-600';
    }
    return 'bg-blue-500 hover:bg-blue-600';
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    onGifLoad?.();
  };

  const isGif = gif?.startsWith('http');

  const renderMessage = (text: string) => {
    return text.split(/(\*\*.*?\*\*)/).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="mb-4">
      <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
        <div
          className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
            isBot
              ? 'bg-gradient-to-br from-slate-50/90 to-blue-50/90 text-gray-800 border border-blue-100/50'
              : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ml-auto'
          }`}
        >
          <div className="whitespace-pre-wrap text-right">{renderMessage(message)}</div>
          {gif && (
            <div className="mt-4 flex justify-center">
              <div className={`relative ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
                {isGif ? (
                  <img
                    src={gif}
                    alt="Chat GIF"
                    className="rounded-lg max-w-[300px] w-full h-auto shadow-md"
                    onLoad={handleImageLoad}
                  />
                ) : (
                  <Image
                    src={gif}
                    alt="Chat Image"
                    width={300}
                    height={225}
                    className="rounded-lg shadow-md"
                    onLoad={handleImageLoad}
                    style={{ width: '100%', height: 'auto', maxWidth: '300px' }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {isBot && buttons && buttons.length > 0 && (
        <div dir="rtl" className="flex flex-wrap gap-2 mt-4 px-4">
          {buttons.map((button, index) => {
            const isSelected = selectedButton === button;
            return (
              <button
                key={index}
                onClick={() => handleButtonClick(button)}
                className={`${getButtonStyle(button)} text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 ${
                  selectedButton === button ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={selectedButton !== null}
              >
                {button}
              </button>
            );
          })}
        </div>
      )}

      {isBot && inputType && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex gap-2">
            <input
              type={inputType}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              className="flex-1 p-3 border border-blue-100 rounded-xl focus:outline-none focus:border-blue-300 
                       text-right bg-gradient-to-b from-white/90 to-blue-50/90 backdrop-blur-sm shadow-sm 
                       text-gray-800 placeholder-gray-500"
              dir="rtl"
            />
            <button
              type="submit"
              className="bg-gradient-to-br from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8]
                       text-white px-8 py-3 rounded-xl transition-all duration-200 ease-in-out
                       shadow-sm hover:shadow-md active:scale-95"
            >
              שלח
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ChatMessage; 