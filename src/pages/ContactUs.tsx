
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
              <p className="text-cyan-100/80">Get in touch with our team</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Company Info */}
              <div className="bg-gray-800/80 backdrop-blur-md border border-cyan-800/30 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="h-6 w-6 text-cyan-400" />
                  <h2 className="text-2xl font-bold text-cyan-100">Company Information</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-cyan-400" />
                    <div>
                      <p className="text-cyan-100">Primary: +256 788 607 860</p>
                      <p className="text-cyan-100">Secondary: +256 703 010 612</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-cyan-400" />
                    <p className="text-cyan-100">contact@linkguardian.com</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-cyan-400" />
                    <p className="text-cyan-100">Enterprise Security Solutions Team</p>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-gray-800/80 backdrop-blur-md border border-cyan-800/30 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Mail className="h-6 w-6 text-cyan-400" />
                  <h2 className="text-2xl font-bold text-cyan-100">Quick Contact</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-cyan-100/80">
                    Need immediate assistance with link verification or have questions about our security tools?
                  </p>
                  <div className="flex flex-col gap-3">
                    <Button 
                      className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium"
                      onClick={() => window.location.href = 'mailto:contact@linkguardian.com'}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-cyan-600 text-cyan-400 hover:bg-cyan-600 hover:text-white"
                      onClick={() => window.location.href = 'tel:+256788607860'}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Team Section */}
            <div className="bg-gray-800/80 backdrop-blur-md border border-cyan-800/30 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <Users className="h-6 w-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-cyan-100">Meet Our Team</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Team Member 1 */}
                <div className="flex items-center gap-4 p-6 bg-gray-700/50 rounded-xl border border-cyan-800/20">
                  <Avatar className="h-16 w-16">
                    <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                      M
                    </div>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-cyan-100">Mugenyi Olga Chantal</h3>
                    <p className="text-cyan-300 text-sm mb-2">Head of the Legal Team</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-cyan-600 text-cyan-400 hover:bg-cyan-600 hover:text-white px-3 py-1"
                        onClick={() => window.location.href = 'tel:+256788607860'}
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Team Member 2 */}
                <div className="flex items-center gap-4 p-6 bg-gray-700/50 rounded-xl border border-cyan-800/20">
                  <Avatar className="h-16 w-16">
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                      N
                    </div>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-cyan-100">Nabuuma Andrea Heartily</h3>
                    <p className="text-cyan-300 text-sm mb-2">Cybersecurity Threat Intelligence Analyst</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-cyan-600 text-cyan-400 hover:bg-cyan-600 hover:text-white px-3 py-1"
                        onClick={() => window.open('https://github.com/andreaheartily', '_blank')}
                      >
                        <Github className="h-3 w-3 mr-1" />
                        GitHub
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-cyan-600 text-cyan-400 hover:bg-cyan-600 hover:text-white px-3 py-1"
                        onClick={() => window.location.href = 'tel:+256703010612'}
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Team Member 3 */}
                <div className="flex items-center gap-4 p-6 bg-gray-700/50 rounded-xl border border-cyan-800/20">
                  <Avatar className="h-16 w-16">
                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                      M
                    </div>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-cyan-100">Martha Praise Katusiime</h3>
                    <p className="text-cyan-300 text-sm mb-2">Full-Stack Developer</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-cyan-600 text-cyan-400 hover:bg-cyan-600 hover:text-white px-3 py-1"
                        onClick={() => window.open('https://github.com/marthaea/', '_blank')}
                      >
                        <Github className="h-3 w-3 mr-1" />
                        GitHub
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-cyan-600 text-cyan-400 hover:bg-cyan-600 hover:text-white px-3 py-1"
                        onClick={() => window.location.href = 'tel:+256740014177'}
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Team Member 4 */}
                <div className="flex items-center gap-4 p-6 bg-gray-700/50 rounded-xl border border-cyan-800/20">
                  <Avatar className="h-16 w-16">
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-xl">
                      M
                    </div>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-cyan-100">Magezi Richard Elijah</h3>
                    <p className="text-cyan-300 text-sm mb-2">Product Marketing Manager & Full-Stack Developer</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-cyan-600 text-cyan-400 hover:bg-cyan-600 hover:text-white px-3 py-1"
                        onClick={() => window.open('https://github.com/Plastimytes', '_blank')}
                      >
                        <Github className="h-3 w-3 mr-1" />
                        GitHub
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-cyan-600 text-cyan-400 hover:bg-cyan-600 hover:text-white px-3 py-1"
                        onClick={() => window.location.href = 'tel:+256740014177'}
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>
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
