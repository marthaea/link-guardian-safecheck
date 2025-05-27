
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-cyan-100">
      <Header />
      
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8 text-center">
            <FileText className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-4">Terms of Service</h1>
            <p className="text-cyan-100/80">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="bg-gray-800/60 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-cyan-800/30 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">1. Acceptance of Terms</h2>
              <p className="text-cyan-100/90">
                By accessing and using LinkGuardian, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">2. Description of Service</h2>
              <p className="text-cyan-100/90 mb-4">
                LinkGuardian is a web-based service that analyzes URLs for potential security threats. Our service is provided "as is" and is intended for educational and informational purposes.
              </p>
              <div className="bg-yellow-900/30 border border-yellow-600/50 p-4 rounded-lg">
                <p className="text-yellow-200 font-medium">
                  ⚠️ Important: Do not rely solely on this tool for security decisions. Always use multiple sources and your best judgment when evaluating link safety.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">3. Acceptable Use</h2>
              <p className="text-cyan-100/90 mb-4">You agree not to use the service to:</p>
              <ul className="list-disc list-inside text-cyan-100/80 space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Submit malicious content or URLs</li>
                <li>Attempt to bypass or overwhelm our security measures</li>
                <li>Use the service for any commercial purpose without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">4. Limitations of Liability</h2>
              <p className="text-cyan-100/90">
                LinkGuardian and its operators shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use of this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">5. Modifications</h2>
              <p className="text-cyan-100/90">
                We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">6. Contact Information</h2>
              <p className="text-cyan-100/90">
                For questions about these Terms of Service, please contact us through our Contact page.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfService;
