import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { conversationSteps, ConversationStep } from '@/app/data/conversation';

interface ChatHistory {
  message: string;
  isBot: boolean;
  gif?: string;
  buttons?: string[];
  inputType?: 'text' | 'number' | 'email' | 'tel' | 'radio' | 'select' | 'time' | 'date' | 'checkbox';
  required?: boolean;
  inputValidation?: (value: string) => boolean;
  options?: string[];
  placeholder?: string;
  shouldSlideOut?: boolean;
  isSection?: boolean;
  shouldAnimate?: boolean;
  isIntro?: boolean;
}

interface UserAnswers {
  [key: string]: string;
}

const WEBHOOK_URL = 'https://hook.eu2.make.com/u3bylg7fkjl6x4gx9t6jpntol3h9ry7u';

const Chat: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentStep, setCurrentStep] = useState<ConversationStep>(conversationSteps[0]);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [currentSectionQuestion, setCurrentSectionQuestion] = useState<number>(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const latestInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const scrollToTop = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  useEffect(() => {
    if (chatHistory.length > 0) {
      const lastMessage = chatHistory[chatHistory.length - 1];
      if (lastMessage.isSection) {
        scrollToTop();
      } else {
        scrollToBottom();
      }
    }
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
          inputValidation: currentStep.validation,
          isSection: currentStep.isSection,
          options: currentStep.options
        }
      ]);
      setCurrentStep({
        ...currentStep,
        isTransitioning: false
      });
    }
  }, []);

  useEffect(() => {
    // Show first section question after section header appears
    const questions = currentStep.sectionQuestions;
    console.log('Current step:', currentStep);
    console.log('Current section question index:', currentSectionQuestion);
    console.log('Has questions:', !!questions);
    console.log('Is transitioning:', currentStep.isTransitioning);
    
    if (questions && currentSectionQuestion === 0 && questions.length > 0 && !currentStep.isTransitioning) {
      console.log('Showing first section question:', questions[0]);
      setTimeout(() => {
        const firstQuestion = questions[0];
        setChatHistory(prev => {
          console.log('Previous chat history:', prev);
          return [...prev, {
            message: firstQuestion.message,
            isBot: true,
            inputType: firstQuestion.inputType,
            required: firstQuestion.required,
            inputValidation: firstQuestion.validation,
            options: firstQuestion.options,
            placeholder: firstQuestion.placeholder
          }];
        });
      }, 800); // Wait for section header animation
    }
  }, [currentStep, currentSectionQuestion]);

  const sendAnswersToWebhook = async () => {
    try {
      setIsSubmitting(true);
      console.log('Sending all answers to webhook:', userAnswers);
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userAnswers),
      });

      if (!response.ok) {
        console.error('Failed to send answers to webhook:', response.statusText);
      } else {
        console.log('Successfully sent answers to webhook');
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
    console.log('Current section question:', currentSectionQuestion);
    
    // Handle section questions
    if (currentStep.sectionQuestions && currentSectionQuestion < currentStep.sectionQuestions.length) {
      const question = currentStep.sectionQuestions[currentSectionQuestion];
      console.log('Handling section question:', question);
      
      // Add user's answer
      setChatHistory(prev => [...prev, { message: input, isBot: false }]);
      
      // Save the answer with section and question IDs
      const field = `${currentStep.id}_${question.id}`;
      const newAnswers = { ...userAnswers, [field]: input };
      setUserAnswers(newAnswers);
      console.log('Updated answers:', newAnswers);

      // Send webhook after contact details section (step 2)
      if (currentStep.id === 2 && question.id === 6) {
        console.log('Contact details section completed, sending first webhook');
        sendAnswersToWebhook();
      }

      // Check if this is the last question (Q49) and send webhook if it is
      if (currentStep.id === 8 && question.id === 49) {
        console.log('Final question answered, sending final webhook');
        sendAnswersToWebhook();
        
        // Clear previous messages with animation
        setChatHistory(prev => prev.map(msg => ({
          ...msg,
          shouldSlideOut: true
        })));

        // Show thank you message after animation
        setTimeout(() => {
          const finalStep = conversationSteps[8]; // The thank you message step
          setCurrentStep(finalStep);
          setChatHistory([{
            message: finalStep.message,
            isBot: true,
            gif: finalStep.gif,
            buttons: finalStep.buttons,
            shouldAnimate: true,
            isIntro: true
          }]);
        }, 500);
        return;
      }

      // Find next valid question
      let nextQuestionIndex = currentSectionQuestion + 1;
      let nextQuestion = null;

      while (nextQuestionIndex < currentStep.sectionQuestions.length) {
        const candidateQuestion = currentStep.sectionQuestions[nextQuestionIndex];
        console.log('Checking candidate question:', candidateQuestion);

        // Check if this question should be shown based on conditions
        if (candidateQuestion.condition) {
          const { field: conditionField, value } = candidateQuestion.condition;
          const answer = typeof conditionField === 'string' ? newAnswers[conditionField] : '';
          console.log('Checking condition:', { conditionField, value, answer });

          const shouldShow = Array.isArray(value)
            ? value.includes(answer)
            : answer === value;

          if (shouldShow) {
            nextQuestion = candidateQuestion;
            break;
          }
        } else {
          // No condition, show this question
          nextQuestion = candidateQuestion;
          break;
        }
        nextQuestionIndex++;
      }

      if (nextQuestion) {
        console.log('Moving to next question:', nextQuestion);
        setCurrentSectionQuestion(nextQuestionIndex);
        setChatHistory(prev => [...prev, {
          message: nextQuestion.message,
          isBot: true,
          inputType: nextQuestion.inputType,
          required: nextQuestion.required,
          inputValidation: nextQuestion.validation,
          options: nextQuestion.options,
          placeholder: nextQuestion.placeholder
        }]);
      } else {
        console.log('No more questions in section, moving to next step');
        // Slide out all current messages
        setChatHistory(prev => prev.map(msg => ({
          ...msg,
          shouldSlideOut: true
        })));

        // Move to next conversation step after animation
        setTimeout(() => {
          // Clear previous messages
          setChatHistory([]);
          
          // Find next step
          const nextStep = findNextStepWithAnswers(currentStep.id, input, newAnswers);
          console.log('Next step after section:', nextStep);
          
          if (nextStep) {
            if (nextStep.isSection) {
              console.log('Transitioning to new section:', nextStep);
              
              // Set the next step first with isTransitioning true
              setCurrentStep({
                ...nextStep,
                isTransitioning: true
              });
              setCurrentSectionQuestion(0);

              // Create section message
              const sectionMessage = {
                message: nextStep.message,
                isBot: true,
                isSection: true,
                shouldAnimate: true
              };
              
              // Clear and set new section
              setTimeout(() => {
                setChatHistory([sectionMessage]);
                
                // After the section header animation, set isTransitioning to false
                setTimeout(() => {
                  setCurrentStep(prev => ({
                    ...prev,
                    isTransitioning: false
                  }));
                }, 800);
              }, 100);
            } else {
              // Handle final thank you message with animation
              setCurrentStep({
                ...nextStep,
                isTransitioning: false
              });
              setChatHistory([{
                message: nextStep.message,
                isBot: true,
                gif: nextStep.gif,
                buttons: nextStep.buttons,
                shouldAnimate: true,
                isIntro: true // Use the same styling as the intro message
              }]);
            }
          }
        }, 500);
      }
      return;
    }

    // Handle regular conversation steps
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
        inputValidation: nextStep.validation,
        isSection: nextStep.isSection
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

  const getAnswerForField = (answers: UserAnswers, field: string | string[]): string => {
    if (Array.isArray(field)) {
      // If field is an array, return the first matching answer
      for (const f of field) {
        if (answers[f]) return answers[f];
      }
      return '';
    }
    return answers[field] || '';
  };

  const findNextStepWithAnswers = (currentId: number, input: string, answers: UserAnswers): ConversationStep | null => {
    console.log('Finding next step with answers:', { 
      currentId, 
      input, 
      answers,
      currentStep,
      currentSectionQuestion,
      totalSectionQuestions: currentStep.sectionQuestions?.length
    });
    
    // If we're in a section and haven't completed all questions, don't move to next step
    if (currentStep.sectionQuestions) {
      console.log('Section questions status:', {
        currentQuestion: currentSectionQuestion,
        totalQuestions: currentStep.sectionQuestions.length,
        remainingQuestions: currentStep.sectionQuestions.length - currentSectionQuestion - 1
      });

      // Check if there are any remaining required questions that should be shown
      let hasRemainingRequiredQuestions = false;
      for (let i = currentSectionQuestion + 1; i < currentStep.sectionQuestions.length; i++) {
        const question = currentStep.sectionQuestions[i];
        if (question.condition) {
          const { field, value } = question.condition;
          const answer = getAnswerForField(answers, field);
          const shouldShow = Array.isArray(value) ? value.includes(answer) : answer === value;
          if (shouldShow && question.required) {
            hasRemainingRequiredQuestions = true;
            break;
          }
        } else if (question.required) {
          hasRemainingRequiredQuestions = true;
          break;
        }
      }

      console.log('Section completion check:', {
        hasRemainingRequiredQuestions,
        currentSectionId: currentStep.id
      });

      if (hasRemainingRequiredQuestions) {
        console.log('Still have required questions in section, staying in current step');
        return currentStep;
      }
    }

    // Find the next step in sequence
    const nextStep = conversationSteps.find(step => {
      console.log('Checking step:', { 
        stepId: step.id,
        currentId: currentId,
        nextExpectedId: currentId + 1,
        isSection: step.isSection,
        hasCondition: !!step.condition
      });
      
      // For sections or unconditional steps, just check if it's the next one
      if (step.isSection || !step.condition) {
        const isNext = step.id === currentId + 1;
        console.log(`Step ${step.id} ${isNext ? 'is' : 'is not'} next`);
        return isNext;
      }
      
      // For conditional steps, check both the sequence and condition
      if (step.id !== currentId + 1) {
        console.log('Skipping step', step.id, 'as not next in sequence');
        return false;
      }
      
      const { field, value } = step.condition;
      const answer = getAnswerForField(answers, field);
      
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
      console.log('Found next step:', {
        id: nextStep.id,
        isSection: nextStep.isSection,
        message: nextStep.message?.substring(0, 50) + '...'
      });
      return nextStep;
    }

    console.log('No immediate next step found, looking for skip steps');
    // If no immediate next step matches conditions, look for the next valid step
    for (let i = currentId + 2; i <= conversationSteps.length; i++) {
      const skipStep = conversationSteps.find(step => step.id === i);
      if (!skipStep) continue;
      
      console.log('Checking skip step:', {
        stepId: skipStep.id,
        isSection: skipStep.isSection,
        hasCondition: !!skipStep.condition
      });
      
      // For sections or unconditional steps, just return them
      if (skipStep.isSection || !skipStep.condition) {
        console.log('Found unconditional skip step:', skipStep.id);
        return skipStep;
      }
      
      const { field, value } = skipStep.condition;
      const answer = getAnswerForField(answers, field);
      
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
    const answer = typeof field === 'string' ? answers[field] : '';
    
    if (Array.isArray(value)) {
      return value.includes(answer);
    }
    return answer === value;
  };

  const getFieldName = (step: ConversationStep): string => {
    // For section questions, use a different naming scheme
    if (step.isSection && step.sectionQuestions) {
      return `section${step.id}`;
    }

    // For regular questions
    switch (step.id) {
      case 1: return 'intro';
      case 2: return 'contact';
      case 3: return 'group';
      case 4: return 'activity';
      case 5: return 'characteristics';
      case 6: return 'services';
      case 7: return 'final';
      default: return `step${step.id}`;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: '#342e1e' }} dir="rtl">
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4" ref={chatContainerRef}>
        <div className="max-w-4xl mx-auto">
          {chatHistory.map((chat, index) => (
            <ChatMessage
              key={index}
              {...chat}
              isIntro={index === 0}
              onButtonClick={handleUserInput}
              onInputSubmit={handleUserInput}
              onGifLoad={scrollToBottom}
              ref={index === chatHistory.length - 1 && chat.inputType ? latestInputRef : undefined}
              autoFocus={index === chatHistory.length - 1 && chat.inputType ? true : false}
            />
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>
      <div className="bg-[#e0a711] text-center py-1.5">
        <a 
          href="https://www.clevermind.co.il" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-white hover:text-blue-200 transition-colors text-sm font-medium"
        >
          בוט זה נבנה על ידי CleverMind
        </a>
      </div>
    </div>
  );
};

export default Chat; 