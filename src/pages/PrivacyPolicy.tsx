
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-cyan-100">
      <Header />
      
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8 text-center">
            <Shield className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-4">Privacy Policy</h1>
            <p className="text-cyan-100/80">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="bg-gray-800/60 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-cyan-800/30 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">1. Information We Collect</h2>
              <p className="text-cyan-100/90 mb-4">
                We collect information you provide directly to us, such as when you use our link checking service, contact us, or interact with our website.
              </p>
              <ul className="list-disc list-inside text-cyan-100/80 space-y-2 ml-4">
                <li>URLs you submit for security analysis</li>
                <li>Usage data and analytics</li>
                <li>Device and browser information</li>
                <li>Contact information when you reach out to us</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">2. How We Use Your Information</h2>
              <p className="text-cyan-100/90 mb-4">
                We use the information we collect to provide, maintain, and improve our services:
              </p>
              <ul className="list-disc list-inside text-cyan-100/80 space-y-2 ml-4">
                <li>To analyze URLs for security threats</li>
                <li>To improve our threat detection algorithms</li>
                <li>To provide customer support</li>
                <li>To communicate with you about our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">3. Information Sharing</h2>
              <p className="text-cyan-100/90">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy or as required by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">4. Data Security</h2>
              <p className="text-cyan-100/90">
                We implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4">5. Contact Us</h2>
              <p className="text-cyan-100/90">
                If you have any questions about this Privacy Policy, please contact us through our Contact page or reach out to us on GitHub.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
