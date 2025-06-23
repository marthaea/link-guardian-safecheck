
import React from 'react';
import { Shield, Brain, AlertTriangle, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Heuristics = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-cyan-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-cyan-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              How Our <span className="text-cyan-400">Heuristics</span> Work
            </h1>
          </div>
          
          <p className="text-lg text-cyan-100/80 max-w-3xl">
            Understanding the intelligent algorithms that help protect you from online threats
          </p>
        </div>

        <div className="grid gap-6 md:gap-8">
          {/* Overview Section */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-300">
                <Shield className="h-5 w-5" />
                What Are Heuristics?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-cyan-100/90 mb-4">
                Heuristics are intelligent pattern-recognition algorithms that analyze URLs and emails 
                to detect potential security threats. Unlike simple blacklists, our heuristic system 
                can identify suspicious patterns even in previously unknown threats.
              </p>
              <p className="text-cyan-100/90">
                Our system combines multiple analysis techniques to provide you with comprehensive 
                security assessments, working both online and offline to keep you protected.
              </p>
            </CardContent>
          </Card>

          {/* Scoring System */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-cyan-300">Risk Scoring System</CardTitle>
              <CardDescription>How we calculate threat levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-900/20 rounded-lg border border-green-700/30">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="font-medium text-green-300">Low Risk (0-30 points)</p>
                    <p className="text-sm text-green-200/80">Generally safe to proceed</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-700/30">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <div>
                    <p className="font-medium text-yellow-300">Medium Risk (31-70 points)</p>
                    <p className="text-sm text-yellow-200/80">Proceed with caution, verify source</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-red-900/20 rounded-lg border border-red-700/30">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <div>
                    <p className="font-medium text-red-300">High Risk (71-100 points)</p>
                    <p className="text-sm text-red-200/80">Potentially dangerous, avoid clicking</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Factors */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-cyan-300">What We Analyze</CardTitle>
              <CardDescription>Key factors in our threat detection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-cyan-200">URL Structure</h4>
                  <ul className="space-y-1 text-sm text-cyan-100/80">
                    <li>• Suspicious domain patterns</li>
                    <li>• URL shortening services</li>
                    <li>• Misleading subdomains</li>
                    <li>• Unusual character usage</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-cyan-200">Domain Analysis</h4>
                  <ul className="space-y-1 text-sm text-cyan-100/80">
                    <li>• Domain age and reputation</li>
                    <li>• SSL certificate validity</li>
                    <li>• Geographic location</li>
                    <li>• Known malicious indicators</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-cyan-200">Content Patterns</h4>
                  <ul className="space-y-1 text-sm text-cyan-100/80">
                    <li>• Phishing keywords</li>
                    <li>• Urgent language detection</li>
                    <li>• Brand impersonation</li>
                    <li>• Social engineering tactics</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-cyan-200">Technical Indicators</h4>
                  <ul className="space-y-1 text-sm text-cyan-100/80">
                    <li>• Redirect chains</li>
                    <li>• Port scanning attempts</li>
                    <li>• Malformed protocols</li>
                    <li>• Encoding anomalies</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dual Analysis */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-cyan-300">Dual Analysis Approach</CardTitle>
              <CardDescription>Combining internal and external intelligence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/30">
                  <h4 className="font-semibold text-blue-300 mb-2">🧠 Internal Heuristics</h4>
                  <p className="text-sm text-blue-200/80">
                    Our proprietary algorithms analyze patterns and structures in real-time, 
                    working even when you're offline. This ensures basic protection is always available.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-700/30">
                  <h4 className="font-semibold text-purple-300 mb-2">🌐 External APIs</h4>
                  <p className="text-sm text-purple-200/80">
                    When online, we enhance our analysis with real-time threat intelligence from 
                    trusted security databases, providing comprehensive protection against the latest threats.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limitations */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-cyan-300">Important Limitations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-cyan-100/90">
                <p>• <strong>Educational Purpose:</strong> This tool is designed for educational use and should not be your only security measure.</p>
                <p>• <strong>Evolving Threats:</strong> New attack methods may not be immediately detected by heuristic analysis.</p>
                <p>• <strong>False Positives:</strong> Legitimate sites may occasionally be flagged as suspicious.</p>
                <p>• <strong>Best Practices:</strong> Always verify sources independently and keep your security software updated.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Heuristics;
