import React, { useState, useEffect, forwardRef } from 'react';
import Image from 'next/image';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  gif?: string;
  onGifLoad?: () => void;
  buttons?: string[];
  onButtonClick?: (value: string) => void;
  inputType?: 'text' | 'number' | 'email' | 'tel' | 'checkbox' | 'select' | 'radio' | 'time' | 'date';
  onInputSubmit?: (value: string) => void;
  placeholder?: string;
  inputValidation?: (value: string) => boolean;
  isSection?: boolean;
  required?: boolean;
  isIntro?: boolean;
  shouldSlideOut?: boolean;
  autoFocus?: boolean;
  options?: string[];
  shouldAnimate?: boolean;
  title?: string;
  description?: string;
}

const ChatMessage = forwardRef<HTMLInputElement, ChatMessageProps>(({ 
  message, 
  isBot, 
  gif, 
  onGifLoad,
  buttons,
  onButtonClick,
  inputType,
  onInputSubmit,
  placeholder,
  inputValidation,
  isSection,
  required,
  isIntro = false,
  shouldSlideOut = false,
  autoFocus = false,
  options = [],
  shouldAnimate,
  title,
  description
}, ref) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [isSliding, setIsSliding] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedValue, setSubmittedValue] = useState('');

  useEffect(() => {
    if (shouldSlideOut) {
      setIsSliding(true);
    }
  }, [shouldSlideOut]);

  useEffect(() => {
    if (isSliding) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 500); // Match the animation duration
      return () => clearTimeout(timer);
    }
  }, [isSliding]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputType === 'checkbox') {
      if (selectedOptions.length > 0) {
        const value = selectedOptions.join(', ');
        setSubmittedValue(value);
        setIsSubmitted(true);
        onInputSubmit?.(value);
      }
    } else if (inputValue && (!inputValidation || inputValidation(inputValue))) {
      setSubmittedValue(inputValue);
      setIsSubmitted(true);
      onInputSubmit?.(inputValue);
      setInputValue('');
      setSelectedOptions([]);
    }
  };

  const handleCheckboxChange = (option: string) => {
    const newSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter(item => item !== option)
      : [...selectedOptions, option];
    
    setSelectedOptions(newSelectedOptions);
    
    // Auto-submit if at least one option is selected
    if (newSelectedOptions.length > 0) {
      onInputSubmit?.(newSelectedOptions.join(', '));
    }
  };

  const handleRadioChange = (option: string) => {
    setInputValue(option);
    // Auto-submit immediately for radio options
    onInputSubmit?.(option);
  };

  const handleButtonClick = (button: string) => {
    setSelectedButton(button);
    if (isIntro) {
      setIsSliding(true);
    }
    onButtonClick?.(button);
  };

  const getButtonStyle = (button: string) => {
    // Check if this is the goals question and if it's the analysis button
    const isGoalsQuestion = message.includes('מה **המטרה שלך**');
    const isAnalysisButton = button === 'ניתוח תיק פיננסי פנסיוני מלא';

    if (isGoalsQuestion && isAnalysisButton) {
      return 'bg-[#e0a711] hover:bg-[#c89610]';
    }
    return 'bg-[#e0a711] hover:bg-[#c89610]';
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    onGifLoad?.();
  };

  const isGif = gif?.startsWith('http');

  const renderMessage = (text: string) => {
    return text.split(/(\*\*.*?\*\*)|(_.*?_)/).map((part, index) => {
      if (part?.startsWith('**') && part?.endsWith('**')) {
        return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part?.startsWith('_') && part?.endsWith('_')) {
        return <span key={index} className="text-sm text-gray-600">{part.slice(1, -1)}</span>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (!isVisible) {
    return null;
  }

  if (isSection) {
    console.log('Rendering section:', message);
    // Find the first occurrence of \n\n to split title and description
    const splitIndex = message.indexOf('\n\n');
    const title = message.substring(0, splitIndex).replace(/\*\*/g, '');
    const description = message.substring(splitIndex + 2);
    
    console.log('Split title:', title);
    console.log('Split description:', description);
    
    return (
      <div className={`mb-6 ${shouldAnimate ? 'animate-slide-in' : ''}`}>
        <h2 className="text-2xl font-bold mb-3 text-[#e0a711]">
          {title}
        </h2>
        <p className="text-white text-lg">
          {description}
        </p>
      </div>
    );
  }

  return (
    <div className={`mb-4 ${isSliding ? 'animate-slide-out' : ''}`}>
      <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
        <div
          className={`max-w-[95%] rounded-2xl p-4 shadow-sm ${
            isBot && !isSection
              ? 'bg-[#ffebb9] text-gray-800 border border-blue-100/50 mr-0 ml-auto animate-slide-in'
              : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white mr-0 ml-auto'
          }`}
        >
          <div className="flex flex-row-reverse gap-4 items-start">
            {gif && (
              <div className={`${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 flex-shrink-0`}>
                {isGif ? (
                  <img
                    src={gif}
                    alt="Chat GIF"
                    className="rounded-lg w-[300px] h-auto shadow-md"
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
                    style={{ width: '300px', height: 'auto' }}
                  />
                )}
              </div>
            )}
            <div className="whitespace-pre-wrap text-right flex-1">
              {renderMessage(message)}
              {required && !isSubmitted && <span className="text-red-500 mr-1">*</span>}
              {isSubmitted && (
                <div className="mt-2 text-[#e0a711] font-medium">
                  {submittedValue}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {isBot && buttons && buttons.length > 0 && !isSubmitted && (
        <div dir="rtl" className="flex flex-wrap gap-2 mt-4 px-4">
          {buttons.map((button, index) => (
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
          ))}
        </div>
      )}

      {isBot && inputType && !isSubmitted && (
        <div className="mt-4">
          {(inputType === 'checkbox' || inputType === 'radio' || inputType === 'select') ? (
            <div dir="rtl" className="flex flex-wrap gap-2 px-4">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (inputType === 'checkbox') {
                      handleCheckboxChange(option);
                    } else if (inputType === 'radio' || inputType === 'select') {
                      setInputValue(option);
                      onInputSubmit?.(option);
                    }
                  }}
                  className={`bg-[#e0a711] text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 
                    ${(inputType === 'checkbox' && selectedOptions.includes(option)) || 
                      ((inputType === 'radio' || inputType === 'select') && inputValue === option) 
                        ? 'bg-[#ffebb9] text-gray-800' 
                        : 'hover:bg-[#ffebb9] hover:text-gray-800'
                    }
                    ${isSubmitted ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  disabled={isSubmitted}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={ref}
                type={inputType === 'time' ? 'time' : 
                      inputType === 'date' ? 'date' : 
                      inputType}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                className="flex-1 p-3 border border-blue-100 rounded-xl focus:outline-none focus:border-blue-300 
                         text-right bg-gradient-to-b from-white/90 to-blue-50/90 backdrop-blur-sm shadow-sm 
                         text-gray-800 placeholder-gray-500"
                dir="rtl"
                required={required}
                autoFocus={autoFocus}
              />
              <button
                type="submit"
                className="bg-[#e0a711] hover:bg-[#c89610] text-white px-8 py-3 rounded-xl transition-all duration-200 ease-in-out
                         shadow-sm hover:shadow-md active:scale-95"
              >
                שלח
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
});

export default ChatMessage; 