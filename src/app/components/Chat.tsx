import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { conversationSteps, ConversationStep } from '@/app/data/conversation';

interface ChatHistory {
  message: string;
  isBot: boolean;
  gif?: string;
  buttons?: string[];
  inputType?: 'text' | 'number' | 'email' | 'tel';
  placeholder?: string;
  inputValidation?: (value: string) => boolean;
}

interface UserAnswers {
  [key: string]: string;
}

const WEBHOOK_URL = 'https://hook.eu2.make.com/u3bylg7fkjl6x4gx9t6jpntol3h9ry7u';

const Chat: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentStep, setCurrentStep] = useState<ConversationStep>(conversationSteps[0]);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    // Add initial bot message
    if (chatHistory.length === 0) {
      console.log('Initializing chat with first step:', currentStep);
      setChatHistory([
        {
          message: currentStep.message,
          isBot: true,
          gif: currentStep.gif,
          buttons: currentStep.buttons,
          inputType: currentStep.inputType,
          placeholder: currentStep.placeholder || getPlaceholder(currentStep.inputType),
          inputValidation: currentStep.validation
        }
      ]);
    }
  }, []);

  const sendAnswersToWebhook = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userAnswers),
      });

      if (!response.ok) {
        console.error('Failed to send answers to webhook:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending answers to webhook:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserInput = (input: string) => {
    console.log('Handling user input:', input);
    console.log('Current step:', currentStep);
    
    // Only add user message for text inputs, not button clicks
    if (currentStep.inputType) {
      setChatHistory((prev) => [
        ...prev,
        { message: input, isBot: false }
      ]);
    }

    // Save user answer and find next step
    const field = getFieldName(currentStep);
    console.log('Saving answer for field:', field, 'value:', input);
    
    // Update answers first
    const newAnswers = { ...userAnswers, [field]: input };
    setUserAnswers(newAnswers);
    console.log('Updated user answers:', newAnswers);

    // Find next step using updated answers
    const nextStep = findNextStepWithAnswers(currentStep.id, input, newAnswers);
    console.log('Next step found:', nextStep);
    
    if (nextStep) {
      console.log('Moving to next step:', { 
        id: nextStep.id, 
        message: nextStep.message,
        condition: nextStep.condition
      });

      // If this is the last step (step 21), send answers to webhook
      if (nextStep.id === 21) {
        sendAnswersToWebhook();
      }

      setCurrentStep(nextStep);
      setChatHistory(prev => [...prev, {
        message: nextStep.message,
        isBot: true,
        gif: nextStep.gif,
        buttons: nextStep.buttons,
        inputType: nextStep.inputType,
        placeholder: nextStep.placeholder,
        inputValidation: nextStep.validation
      }]);
    } else {
      console.log('No next step found after current step:', currentStep.id);
    }
  };

  const getPlaceholder = (inputType?: string) => {
    switch (inputType) {
      case 'number':
        return 'נא לרשום בספרות את גובה השכר שלך';
      case 'tel':
        return 'מספר טלפון נייד';
      case 'email':
        return 'כתובת אימייל';
      default:
        return '';
    }
  };

  const findNextStepWithAnswers = (currentId: number, input: string, answers: UserAnswers): ConversationStep | null => {
    console.log('Finding next step with answers:', { currentId, input, answers });
    
    // First try to find the immediate next step
    const nextStep = conversationSteps.find((step) => {
      console.log('Checking step:', { 
        stepId: step.id,
        hasCondition: !!step.condition,
        condition: step.condition
      });
      
      if (step.id !== currentId + 1) {
        console.log('Skipping step', step.id, 'as not next in sequence');
        return false;
      }
      
      if (!step.condition) {
        console.log('Step', step.id, 'has no conditions, including it');
        return true;
      }
      
      const { field, value } = step.condition;
      const answer = answers[field];
      
      // Special handling for age-based goals
      if (field === 'age') {
        console.log('Checking age condition:', { value, answer });
        if (value === 'מעל 60' && answer === 'מעל 60') {
          return true;
        }
        if (Array.isArray(value) && value.includes(answer)) {
          return true;
        }
        return false;
      }
      
      // Regular condition checking
      const matches = Array.isArray(value) 
        ? value.includes(answer)
        : answer === value;
      
      console.log('Checking condition:', { 
        stepId: step.id, 
        field, 
        value, 
        answer,
        matches 
      });
      
      return matches;
    });

    if (nextStep) {
      console.log('Found immediate next step:', nextStep);
      return nextStep;
    }

    // If no immediate next step matches conditions, look for the next valid step
    console.log('No immediate next step found, looking for skip steps');
    for (let i = currentId + 2; i <= conversationSteps.length; i++) {
      const skipStep = conversationSteps.find(step => step.id === i);
      if (!skipStep) continue;
      
      console.log('Checking skip step:', {
        stepId: skipStep.id,
        hasCondition: !!skipStep.condition,
        condition: skipStep.condition
      });
      
      if (!skipStep.condition) {
        console.log('Skip step has no conditions, including it:', skipStep.id);
        return skipStep;
      }
      
      const { field, value } = skipStep.condition;
      const answer = answers[field];
      
      // Special handling for age-based goals in skip steps
      if (field === 'age') {
        if (value === 'מעל 60' && answer === 'מעל 60') {
          console.log('Found matching age skip step for over 60:', skipStep.id);
          return skipStep;
        }
        if (Array.isArray(value) && value.includes(answer)) {
          console.log('Found matching age skip step for age range:', skipStep.id);
          return skipStep;
        }
        continue;
      }
      
      // Regular condition checking for skip steps
      const matches = Array.isArray(value) 
        ? value.includes(answer)
        : answer === value;
      
      if (matches) {
        console.log('Found matching skip step:', skipStep.id);
        return skipStep;
      }
    }

    console.log('No next step found');
    return null;
  };

  const isStepValid = (step: ConversationStep, answers: UserAnswers): boolean => {
    if (!step.condition) return true;
    const { field, value } = step.condition;
    if (Array.isArray(value)) {
      return value.includes(answers[field]);
    }
    return answers[field] === value;
  };

  const getFieldName = (step: ConversationStep): string => {
    switch (step.id) {
      case 2: return 'age';
      case 3:
      case 4: return 'goal';
      case 5: return 'status';
      case 6: return 'employment';
      case 7:
      case 8: return 'pension';
      case 9: return 'salary';
      case 10: return 'pensionAmount';
      case 11: return 'savings';
      case 12: return 'investments';
      case 13: return 'knowsReturn';
      case 14: return 'return';
      case 15: return 'investmentType';
      case 16: return 'mortgage';
      case 17: return 'name';
      case 18: return 'phone';
      case 20: return 'email';
      default: return `step${step.id}`;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#1a2b4b]" dir="rtl">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {chatHistory.map((msg, idx) => (
            <ChatMessage
              key={idx}
              message={msg.message}
              isBot={msg.isBot}
              gif={msg.gif}
              onGifLoad={scrollToBottom}
              buttons={msg.buttons}
              onButtonClick={handleUserInput}
              inputType={msg.inputType}
              onInputSubmit={handleUserInput}
              placeholder={msg.placeholder}
              inputValidation={msg.inputValidation}
            />
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-center py-1.5">
        <a 
          href="https://www.baz-d.co.il" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-white hover:text-blue-200 transition-colors text-sm font-medium"
        >
          בוט זה נבנה על ידי Baz-Dynamics
        </a>
      </div>
    </div>
  );
};

export default Chat; 