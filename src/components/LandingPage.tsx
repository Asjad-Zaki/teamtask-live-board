"use client"
 
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Zap, Shield, Star, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ContactForm from "@/components/landing/ContactForm";
import NewsletterForm from "@/components/landing/NewsletterForm";
import DemoRequestForm from "@/components/landing/DemoRequestForm";

const LandingPage = () => {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  // Add custom CSS styles to document head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }
      
      @keyframes gradient-x {
        0%, 100% { background-size: 200% 200%; background-position: left center; }
        50% { background-size: 200% 200%; background-position: right center; }
      }
      
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      
      .animate-gradient-x {
        animation: gradient-x 15s ease infinite;
      }
      
      .animation-delay-2000 {
        animation-delay: 2s;
      }
      
      .animation-delay-4000 {
        animation-delay: 4s;
      }
      
      .shadow-3xl {
        box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
      }
    `;
    document.head.appendChild(style);

    // Cleanup function to remove style when component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const features = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Role-Based Access",
      description: "Admin, Project Manager, Developer, Tester, and Viewer roles with specific permissions",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-600" />,
      title: "Real-Time Updates",
      description: "Live task updates and notifications keep your team synchronized",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Secure & Reliable",
      description: "Built with enterprise-grade security and data protection",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Project Manager",
      content: "TeamTasker transformed how our team collaborates. The role-based permissions are perfect!",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Mike Chen",
      role: "Lead Developer",
      content: "Finally, a task management tool that developers actually want to use. Clean and efficient.",
      rating: 5,
      avatar: "MC",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-50 bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-12">
                <span className="text-white font-bold text-sm">TT</span>
              </div>
              <h1 className="text-xl font-bold text-white">TeamTasker</h1>
            </div>
            <div className="flex items-center gap-4">
              <DemoRequestForm />
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigate('/auth')}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 lg:py-32">
        <div className="text-center max-w-5xl mx-auto">
          <Badge className="mb-8 bg-white/20 text-white hover:bg-white/30 border border-white/30 backdrop-blur-sm shadow-lg transform hover:scale-105 transition-all duration-300">
            <Sparkles className="w-4 h-4 mr-2" />
            Now with Real-Time Collaboration
          </Badge>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
            Streamline Your Team's
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
              {" "}
              Workflow
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
            A powerful task management platform designed for modern teams. Role-based permissions, real-time updates,
            and intuitive design.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-lg px-10 py-8 rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 border-0"
              onClick={() => navigate('/auth')}
            >
              Start Free Trial
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <DemoRequestForm 
              trigger={
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-8 rounded-2xl border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-300"
                >
                  View Demo
                </Button>
              }
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 lg:py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Everything Your Team Needs</h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Powerful features designed to boost productivity and collaboration
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 text-center shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-4 transition-all duration-500 rounded-3xl overflow-hidden"
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              <CardHeader className="relative z-10 pt-12 pb-6">
                <div
                  className={`mx-auto mb-6 w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}
                >
                  {feature.icon}
                </div>
                <CardTitle className="text-2xl mb-4 text-white group-hover:text-white transition-colors duration-300">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 pb-12">
                <CardDescription className="text-lg text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </CardDescription>
              </CardContent>

              <div
                className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
                }}
              />
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Loved by Teams Worldwide</h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
              See what teams are saying about TeamTasker
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="group bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-4 transition-all duration-500 rounded-3xl overflow-hidden"
              >
                <CardContent className="p-8 lg:p-10 relative">
                  <div className="absolute top-4 left-4 text-6xl text-white/20 font-serif">"</div>

                  <div className="flex mb-6 relative z-10">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-6 w-6 text-yellow-400 fill-current transform group-hover:scale-110 transition-transform duration-300"
                        style={{ transitionDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>

                  <p className="text-lg lg:text-xl text-gray-200 mb-8 italic leading-relaxed relative z-10">
                    {testimonial.content}
                  </p>

                  <div className="flex items-center relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-lg">{testimonial.name}</p>
                      <p className="text-gray-300">{testimonial.role}</p>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Have questions or want to learn more about how TeamTasker can transform your team's workflow? 
              We'd love to hear from you.
            </p>
            <NewsletterForm />
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 lg:py-32">
        <Card className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 border-0 text-white shadow-3xl rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x"></div>

          <CardContent className="relative z-10 text-center p-12 lg:p-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to Transform Your Team?</h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of teams already using TeamTasker to stay organized and productive.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg lg:text-xl px-12 py-8 rounded-2xl bg-white text-purple-600 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 font-semibold"
              onClick={() => navigate('/auth')}
            >
              Get Started Today
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </CardContent>

          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-float animation-delay-2000"></div>
          <div className="absolute top-1/2 right-20 w-12 h-12 bg-white/10 rounded-full animate-float animation-delay-4000"></div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/50 backdrop-blur-md border-t border-white/20 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-12">
                <span className="text-white font-bold">TT</span>
              </div>
              <h3 className="text-2xl font-bold">TeamTasker</h3>
            </div>
            <p className="text-gray-400 text-lg">© 2025 TeamTasker. Built with modern technology for modern teams.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
