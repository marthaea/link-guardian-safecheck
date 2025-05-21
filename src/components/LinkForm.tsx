
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "lucide-react";

interface LinkFormProps {
  onSubmit: (link: string) => void;
  isLoading: boolean;
}

const LinkForm: React.FC<LinkFormProps> = ({ onSubmit, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue.trim());
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputValue(text);
    } catch (err) {
      console.error('Failed to read from clipboard', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Paste a suspicious link or email address here"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pr-24 h-12"
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={handlePaste}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs"
            >
              Paste
            </Button>
          </div>
          <Button 
            type="submit" 
            className="h-12 px-8" 
            disabled={!inputValue.trim() || isLoading}
          >
            <Link className="mr-2 h-4 w-4" />
            {isLoading ? 'Checking...' : 'Check Now'}
          </Button>
        </div>
        <div className="text-xs text-muted-foreground text-center">
          We don't store the links or emails you check. Your privacy is our priority.
        </div>
      </div>
    </form>
  );
};

export default LinkForm;
