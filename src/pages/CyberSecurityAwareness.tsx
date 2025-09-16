import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CyberSecurityAwareness = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-cyan-100 relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(/lovable-uploads/64cd60c1-72f0-40f4-8152-3d3d3edab305.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(8px) brightness(0.3)',
        }}
      />
      
      {/* Dark overlay */}
      <div className="fixed inset-0 z-1 bg-gray-900/80" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />
        
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <Link to="/">
              <Button variant="ghost" className="mb-8 text-cyan-100 hover:text-cyan-400">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            <div className="bg-gray-800/80 backdrop-blur-md border border-cyan-800/30 rounded-2xl p-8 space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-cyan-100 mb-4">
                Stay Safe Online: Your Complete Guide to Link Security
              </h1>
            </div>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">
                What Are Suspicious Links and Why Should You Care?
              </h2>
              <p className="text-cyan-100/90 mb-4">
                Every day, millions of people receive messages with links through email, text messages, social media, and messaging apps. While most links are harmless, some are designed to trick you into:
              </p>
              <ul className="text-cyan-100/80 space-y-2 ml-6">
                <li>• <strong className="text-cyan-300">Stealing your personal information</strong> (passwords, credit card numbers, social security numbers)</li>
                <li>• <strong className="text-cyan-300">Installing harmful software</strong> on your device that can spy on you or damage your files</li>
                <li>• <strong className="text-cyan-300">Taking your money</strong> through fake shopping sites or investment scams</li>
                <li>• <strong className="text-cyan-300">Accessing your accounts</strong> on social media, banking, or email</li>
              </ul>
              <p className="text-cyan-100/90 mt-4">
                Think of suspicious links like strangers offering you candy - they might look appealing, but you never know what their real intentions are.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">
                Common Signs of Dangerous Links
              </h2>
              
              <h3 className="text-xl font-medium text-cyan-400 mb-3">Red Flags to Watch For:</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-cyan-300 mb-2">📧 Email and Message Warning Signs:</h4>
                  <ul className="text-cyan-100/80 space-y-1 ml-6">
                    <li>• Messages claiming "Urgent action required!" or "Your account will be closed!"</li>
                    <li>• Emails from banks, government agencies, or companies you don't do business with</li>
                    <li>• Messages with poor spelling and grammar</li>
                    <li>• Threats like "Act now or lose your money!"</li>
                    <li>• Offers that seem too good to be true (like winning money you never entered to win)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-cyan-300 mb-2">🔗 Suspicious Link Characteristics:</h4>
                  <ul className="text-cyan-100/80 space-y-1 ml-6">
                    <li>• Links that don't match the sender (email from "Amazon" but link goes to a random website)</li>
                    <li>• Very long, confusing web addresses with random letters and numbers</li>
                    <li>• Links shortened with services like bit.ly, tinyurl.com when you weren't expecting them</li>
                    <li>• URLs with strange spellings of familiar websites (like "amaz0n.com" instead of "amazon.com")</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">
                Real-Life Examples That Put You at Risk
              </h2>
              
              <div className="space-y-6">
                <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-red-300 mb-2">The Fake Bank Email</h3>
                  <p className="text-cyan-100/90 mb-2">
                    You receive an email saying: "Your Bank Account Has Been Compromised - Click Here to Verify Your Information Immediately!"
                  </p>
                  <p className="text-red-200"><strong>The Danger:</strong> This leads to a fake website that looks like your bank but steals your login information</p>
                  <p className="text-red-200"><strong>What Really Happens:</strong> Criminals use your stolen login to access your real bank account</p>
                </div>

                <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-red-300 mb-2">The "You've Won!" Scam</h3>
                  <p className="text-cyan-100/90 mb-2">
                    A text message says: "Congratulations! You've won $1,000! Click here to claim your prize!"
                  </p>
                  <p className="text-red-200"><strong>The Danger:</strong> The link asks for your personal information to "verify" you for the prize</p>
                  <p className="text-red-200"><strong>What Really Happens:</strong> They use your information for identity theft or sell it to other criminals</p>
                </div>

                <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-red-300 mb-2">The Fake Shopping Deal</h3>
                  <p className="text-cyan-100/90 mb-2">
                    An ad on social media shows designer shoes for 90% off with a link to buy now.
                  </p>
                  <p className="text-red-200"><strong>The Danger:</strong> The website takes your credit card information but never sends products</p>
                  <p className="text-red-200"><strong>What Really Happens:</strong> They make unauthorized purchases with your card information</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">
                How Guardian SafeCheck Protects You
              </h2>
              
              <h3 className="text-xl font-medium text-cyan-400 mb-3">What Our Tool Does (In Simple Terms):</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-cyan-300 mb-2">🔍 Link Detective Work:</h4>
                  <p className="text-cyan-100/80">
                    Our system examines every link like a digital detective, checking it against databases of known dangerous websites and analyzing suspicious patterns that criminals commonly use.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-cyan-300 mb-2">⚡ Instant Results:</h4>
                  <p className="text-cyan-100/80">
                    Instead of wondering "Is this safe?" for hours, you get an answer in seconds. No waiting, no complicated process.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-cyan-300 mb-2">🛡️ Multiple Safety Checks:</h4>
                  <p className="text-cyan-100/80 mb-2">We don't just check one thing - we examine:</p>
                  <ul className="text-cyan-100/70 space-y-1 ml-6">
                    <li>• Whether the website has been reported as dangerous by other users</li>
                    <li>• If the link leads where it claims to go</li>
                    <li>• Whether the website tries to download unwanted software</li>
                    <li>• If the site asks for personal information in suspicious ways</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-medium text-cyan-400 mb-3 mt-6">How to Use Guardian SafeCheck:</h3>
              <ol className="text-cyan-100/80 space-y-2">
                <li>1. <strong className="text-cyan-300">Copy the suspicious link</strong> from your email, text, or social media</li>
                <li>2. <strong className="text-cyan-300">Paste it into our checker</strong> on the homepage</li>
                <li>3. <strong className="text-cyan-300">Click "Check Link"</strong> and wait a few seconds</li>
                <li>4. <strong className="text-cyan-300">Read the results</strong> - we'll tell you in plain English if it's safe or dangerous</li>
                <li>5. <strong className="text-cyan-300">Make your decision</strong> - proceed with confidence or avoid the danger</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">
                Simple Daily Habits to Stay Safe
              </h2>
              
              <h3 className="text-xl font-medium text-cyan-400 mb-3">Before Clicking Any Link:</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-cyan-300 mb-2">✋ Stop and Think:</h4>
                  <ul className="text-cyan-100/80 space-y-1 ml-6">
                    <li>• Do I know who sent this?</li>
                    <li>• Was I expecting this message?</li>
                    <li>• Does this seem too urgent or too good to be true?</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-cyan-300 mb-2">🔍 Quick Check:</h4>
                  <ul className="text-cyan-100/80 space-y-1 ml-6">
                    <li>• Hover over links (don't click) to see where they really go</li>
                    <li>• If unsure, use Guardian SafeCheck to verify</li>
                    <li>• When in doubt, go directly to the company's official website instead</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-cyan-300 mb-2">📱 Be Extra Careful With:</h4>
                  <ul className="text-cyan-100/80 space-y-1 ml-6">
                    <li>• Links in text messages from unknown numbers</li>
                    <li>• Social media messages from people you don't know well</li>
                    <li>• Email attachments or links from unfamiliar senders</li>
                    <li>• Pop-up ads promising prizes or urgent warnings</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">
                What to Do If You Think You've Been Tricked
              </h2>
              
              <div className="space-y-6">
                <div className="bg-orange-900/20 border border-orange-800/30 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-orange-300 mb-3">If You Clicked a Suspicious Link:</h3>
                  <h4 className="text-md font-medium text-orange-400 mb-2">Immediate Actions:</h4>
                  <ol className="text-cyan-100/80 space-y-1">
                    <li>1. <strong>Don't enter any personal information</strong> on the website</li>
                    <li>2. <strong>Close the browser tab immediately</strong></li>
                    <li>3. <strong>Run a virus scan</strong> on your device</li>
                    <li>4. <strong>Change passwords</strong> for important accounts (email, banking, social media)</li>
                  </ol>
                </div>

                <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-red-300 mb-3">If You Shared Personal Information:</h3>
                  <ol className="text-cyan-100/80 space-y-1">
                    <li>1. <strong>Contact your bank</strong> if you entered financial information</li>
                    <li>2. <strong>Monitor your accounts</strong> closely for unusual activity</li>
                    <li>3. <strong>Consider placing a fraud alert</strong> on your credit reports</li>
                    <li>4. <strong>Report the scam</strong> to authorities (FTC, FBI's IC3, or local police)</li>
                  </ol>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">
                Teaching Others to Stay Safe
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-cyan-400 mb-3">Help Your Family and Friends:</h3>
                  
                  <h4 className="text-lg font-medium text-cyan-300 mb-2">Share This Knowledge:</h4>
                  <ul className="text-cyan-100/80 space-y-1 ml-6">
                    <li>• Show elderly relatives how to spot scams targeting them</li>
                    <li>• Teach teenagers about social media link safety</li>
                    <li>• Create a family rule: "When in doubt, check it out" using tools like Guardian SafeCheck</li>
                  </ul>

                  <h4 className="text-lg font-medium text-cyan-300 mb-2 mt-4">Create Safe Habits:</h4>
                  <ul className="text-cyan-100/80 space-y-1 ml-6">
                    <li>• Always verify unexpected messages by calling the company directly</li>
                    <li>• Use Guardian SafeCheck as your first line of defense</li>
                    <li>• Trust your instincts - if something feels wrong, it probably is</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">
                Why Guardian SafeCheck Is Your Best Defense
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-cyan-400 mb-3">Built for Everyone:</h3>
                  <ul className="text-cyan-100/80 space-y-1 ml-6">
                    <li>• <strong>No technical knowledge required</strong> - just copy, paste, and check</li>
                    <li>• <strong>Clear, simple results</strong> - no confusing technical jargon</li>
                    <li>• <strong>Fast and reliable</strong> - get answers when you need them</li>
                    <li>• <strong>Always updated</strong> - our database learns about new threats constantly</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-cyan-400 mb-3">Peace of Mind:</h3>
                  <p className="text-cyan-100/80">
                    Instead of worrying about every link you encounter, you can browse confidently knowing you have a trusted tool to verify suspicious content. Think of us as your personal bodyguard for the internet.
                  </p>
                </div>
              </div>
            </section>

            <section className="text-center bg-cyan-900/30 border border-cyan-700/50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">
                Remember: You're Not Alone
              </h2>
              <p className="text-cyan-100/90 mb-4">
                Millions of people face these same concerns every day. Cybercriminals are constantly creating new ways to trick people, but by staying informed and using tools like Guardian SafeCheck, you're taking control of your online safety.
              </p>
              <p className="text-lg font-medium text-cyan-200">
                Your safety is our priority. When in doubt, check it out with Guardian SafeCheck.
              </p>
              <Link to="/">
                <Button className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white">
                  Start Checking Links Now
                </Button>
              </Link>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
      </div>
    </div>
  );
};

export default CyberSecurityAwareness;