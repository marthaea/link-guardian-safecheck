
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Github, Building2, Users, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const ContactUs = () => {
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
              <Mail className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-4">Contact Us</h1>
              <p className="text-cyan-100/80">Get in touch with the Nexus team</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Company Info */}
              <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-cyan-800/30">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="h-8 w-8 text-cyan-400" />
                  <h2 
                    className="text-2xl font-semibold text-cyan-300 hover:text-cyan-200 cursor-pointer transition-colors"
                    onClick={() => window.open('https://nexushavenn.netlify.app', '_blank')}
                  >
                    Nexus
                  </h2>
                </div>
                
                <p className="text-cyan-100/90 mb-6">
                  We're dedicated to making the internet a safer place through innovative security solutions. 
                  LinkGuardian is our contribution to protecting users from online threats.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-cyan-100/80">
                    <Mail className="h-5 w-5 text-cyan-400" />
                    <span>Contact us through our co-founders on GitHub</span>
                  </div>
                  <div className="flex items-center gap-3 text-cyan-100/80">
                    <Phone className="h-5 w-5 text-cyan-400" />
                    <span>Call us directly</span>
                  </div>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-cyan-800/30">
                <div className="flex items-center gap-3 mb-6">
                  <Phone className="h-8 w-8 text-cyan-400" />
                  <h2 className="text-2xl font-semibold text-cyan-300">Phone Numbers</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-900/60 rounded-lg border border-cyan-800/20">
                    <a 
                      href="tel:+256740014177" 
                      className="text-cyan-100 hover:text-cyan-300 transition-colors flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      +256 740 014 177
                    </a>
                  </div>
                  
                  <div className="p-4 bg-gray-900/60 rounded-lg border border-cyan-800/20">
                    <a 
                      href="tel:+256705713086" 
                      className="text-cyan-100 hover:text-cyan-300 transition-colors flex items-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      +256 705 713 086
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Co-founders */}
            <div className="mt-8 bg-gray-800/70 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-cyan-800/30">
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-8 w-8 text-cyan-400" />
                <h2 className="text-2xl font-semibold text-cyan-300">Co-founders</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-900/60 rounded-lg border border-cyan-800/20">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/lovable-uploads/f5e0feaf-69f3-42a0-91b2-45ed6c8e5367.png" alt="Martha" />
                      <AvatarFallback className="bg-cyan-600 text-white">M</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-cyan-200">Martha</h3>
                      <p className="text-cyan-100/70 text-sm">Co-founder</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-cyan-600 text-cyan-100 bg-gray-800/60 hover:bg-cyan-600/20 hover:text-cyan-300"
                    onClick={() => window.open('https://github.com/marthaea', '_blank')}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    @marthaea
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-900/60 rounded-lg border border-cyan-800/20">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/lovable-uploads/8916d1cd-66ef-4752-86ae-f52586f0214f.png" alt="Jonathan" />
                      <AvatarFallback className="bg-cyan-600 text-white">J</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-cyan-200">Jonathan</h3>
                      <p className="text-cyan-100/70 text-sm">Co-founder</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-cyan-600 text-cyan-100 bg-gray-800/60 hover:bg-cyan-600/20 hover:text-cyan-300"
                    onClick={() => window.open('https://github.com/jonathansaint', '_blank')}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    @jonathansaint
                  </Button>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 bg-gray-800/70 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-cyan-800/30 text-center">
              <h3 className="text-xl font-semibold text-cyan-300 mb-4">Have Questions or Feedback?</h3>
              <p className="text-cyan-100/90 mb-6">
                We'd love to hear from you! Whether you have questions about LinkGuardian, 
                want to report a bug, or have suggestions for improvements, feel free to reach out to us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-cyan-600 text-cyan-100 bg-gray-800/60 hover:bg-cyan-600/20 hover:text-cyan-300"
                  onClick={() => window.open('tel:+256740014177')}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call Us
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-cyan-600 text-cyan-100 bg-gray-800/60 hover:bg-cyan-600/20 hover:text-cyan-300"
                  onClick={() => window.open('https://github.com/marthaea', '_blank')}
                >
                  <Github className="mr-2 h-5 w-5" />
                  Contact Martha
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-cyan-600 text-cyan-100 bg-gray-800/60 hover:bg-cyan-600/20 hover:text-cyan-300"
                  onClick={() => window.open('https://github.com/jonathansaint', '_blank')}
                >
                  <Github className="mr-2 h-5 w-5" />
                  Contact Jonathan
                </Button>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default ContactUs;
