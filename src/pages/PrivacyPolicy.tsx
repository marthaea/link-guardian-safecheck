import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield } from 'lucide-react';

const PrivacyPolicy = () => {
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
        
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="mb-8 text-center">
              <Shield className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-4">Privacy Policy</h1>
              <p className="text-cyan-100/80">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-cyan-800/30 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-cyan-300 mb-4">1. Information We Collect</h2>
                <p className="text-cyan-100/90 mb-4">
                  LinkGuardian collects minimal information to provide our service:
                </p>
                <ul className="list-disc list-inside text-cyan-100/80 space-y-2 ml-4">
                  <li>URLs you submit for analysis</li>
                  <li>Basic usage analytics (anonymized)</li>
                  <li>Technical information about your browser and device</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-cyan-300 mb-4">2. How We Use Your Information</h2>
                <p className="text-cyan-100/90 mb-4">We use the collected information to:</p>
                <ul className="list-disc list-inside text-cyan-100/80 space-y-2 ml-4">
                  <li>Analyze URLs for security threats</li>
                  <li>Improve our service and detection algorithms</li>
                  <li>Provide technical support</li>
                  <li>Monitor for abuse and ensure service reliability</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-cyan-300 mb-4">3. Data Storage and Security</h2>
                <p className="text-cyan-100/90">
                  We implement appropriate technical and organizational measures to protect your data. URLs submitted for analysis may be temporarily stored for processing but are not permanently retained unless necessary for security research.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-cyan-300 mb-4">4. Third-Party Services</h2>
                <p className="text-cyan-100/90">
                  LinkGuardian may use third-party security databases and APIs to enhance our threat detection capabilities. These services have their own privacy policies that govern their use of data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-cyan-300 mb-4">5. Your Rights</h2>
                <p className="text-cyan-100/90 mb-4">You have the right to:</p>
                <ul className="list-disc list-inside text-cyan-100/80 space-y-2 ml-4">
                  <li>Request information about data we have collected</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of analytics collection</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-cyan-300 mb-4">6. Changes to This Policy</h2>
                <p className="text-cyan-100/90">
                  We may update this privacy policy from time to time. We will notify users of any material changes by posting the new policy on this page.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-cyan-300 mb-4">7. Contact Us</h2>
                <p className="text-cyan-100/90">
                  If you have any questions about this Privacy Policy, please contact us through our Contact page.
                </p>
              </section>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
