import React from 'react';
import { Mail, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommonThreatsSectionProps {
  onScrollToCheck: () => void;
}

const CommonThreatsSection: React.FC<CommonThreatsSectionProps> = ({ onScrollToCheck }) => {
  return (
    <section id="threats" className="py-16 bg-gray-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-cyan-300">Common Online Threats</h2>
        <p className="text-center text-cyan-100/80 max-w-2xl mx-auto mb-12 px-4">
          Stay informed about the most common online threats to protect yourself and your data.
        </p>
        
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-cyan-800/30">
            <h3 className="text-xl font-medium mb-2 flex items-center gap-2 text-cyan-200">
              <LinkIcon className="h-5 w-5 text-cyan-400" />
              Phishing Links
            </h3>
            <p className="text-cyan-100/80 mb-4">
              Deceptive links that impersonate legitimate websites to steal your personal information or credentials.
            </p>
            <div className="bg-gray-900/50 p-3 rounded-md text-xs text-cyan-200">
              <strong>Warning Signs:</strong> Misspelled URLs, suspicious domains, requests for personal information.
            </div>
          </div>
          
          <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-cyan-800/30">
            <h3 className="text-xl font-medium mb-2 flex items-center gap-2 text-cyan-200">
              <Mail className="h-5 w-5 text-cyan-400" />
              Malicious Emails
            </h3>
            <p className="text-cyan-100/80 mb-4">
              Emails containing harmful attachments or links that can install malware or compromise your accounts.
            </p>
            <div className="bg-gray-900/50 p-3 rounded-md text-xs text-cyan-200">
              <strong>Warning Signs:</strong> Unexpected attachments, urgent requests, poor grammar and spelling.
            </div>
          </div>
          
          <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-cyan-800/30">
            <h3 className="text-xl font-medium mb-2 flex items-center gap-2 text-cyan-200">
              <LinkIcon className="h-5 w-5 text-cyan-400" />
              Malware Distribution
            </h3>
            <p className="text-cyan-100/80 mb-4">
              Links or downloads that install harmful software to steal information or damage your device.
            </p>
            <div className="bg-gray-900/50 p-3 rounded-md text-xs text-cyan-200">
              <strong>Warning Signs:</strong> Unexpected download prompts, too-good-to-be-true offers, suspicious file extensions.
            </div>
          </div>
          
          <div className="bg-gray-800/60 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-cyan-800/30">
            <h3 className="text-xl font-medium mb-2 flex items-center gap-2 text-cyan-200">
              <LinkIcon className="h-5 w-5 text-cyan-400" />
              Scam Websites
            </h3>
            <p className="text-cyan-100/80 mb-4">
              Fraudulent websites designed to trick you into making payments or sharing sensitive information.
            </p>
            <div className="bg-gray-900/50 p-3 rounded-md text-xs text-cyan-200">
              <strong>Warning Signs:</strong> No secure connection (HTTPS), poor design, limited contact information, unrealistic offers.
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Button size="lg" onClick={onScrollToCheck} className="bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-500">
            <LinkIcon className="mr-2 h-4 w-4" />
            Check a Link Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CommonThreatsSection;
