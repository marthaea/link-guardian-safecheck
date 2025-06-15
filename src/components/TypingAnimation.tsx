
import React, { useState, useEffect } from 'react';

interface TypingAnimationProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(pauseTimer);
    }

    const timer = setTimeout(() => {
      if (isDeleting) {
        setCurrentText(currentWord.substring(0, currentText.length - 1));
        
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        setCurrentText(currentWord.substring(0, currentText.length + 1));
        
        if (currentText === currentWord) {
          setIsPaused(true);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, isPaused, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className="inline-block min-w-0">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

export default TypingAnimation;
