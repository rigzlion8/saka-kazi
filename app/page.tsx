import Link from 'next/link';
import { ArrowRight, CheckCircle, Star, Users, Shield, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow-lg">
              Find Professional Services
              <span className="block text-yellow-300">Made Simple</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Connect with verified service providers for all your professional needs. 
              From electrical work to repairs, find the right expert for your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/register" 
                className="btn btn-lg bg-white text-primary-700 hover:bg-gray-100 font-semibold"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/providers" 
                className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary-700"
              >
                Browse Providers
              </Link>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="relative bg-white bg-opacity-10 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-300">500+</div>
                <div className="text-primary-100">Verified Providers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">10,000+</div>
                <div className="text-primary-100">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">50+</div>
                <div className="text-primary-100">Service Categories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">98%</div>
                <div className="text-primary-100">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Saka-Kazi?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make finding and hiring professional service providers simple, secure, and reliable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Verified Providers</h3>
              <p className="text-gray-600">
                All our service providers are thoroughly vetted and verified to ensure quality and reliability.
              </p>
            </div>
            
            <div className="card text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Quality Guaranteed</h3>
              <p className="text-gray-600">
                We stand behind every service with our quality guarantee and customer satisfaction promise.
              </p>
            </div>
            
            <div className="card text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-warning-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Fast & Efficient</h3>
              <p className="text-gray-600">
                Get connected with providers quickly and efficiently, saving you time and hassle.
              </p>
            </div>
            
            <div className="card text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Community Driven</h3>
              <p className="text-gray-600">
                Join our growing community of customers and service providers across Kenya.
              </p>
            </div>
            
            <div className="card text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-danger-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Top Rated</h3>
              <p className="text-gray-600">
                Access to the highest-rated service providers based on real customer reviews.
              </p>
            </div>
            
            <div className="card text-center p-8 hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure Payments</h3>
              <p className="text-gray-600">
                Safe and secure payment processing with Paystack integration for your peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started with Saka-Kazi is simple and straightforward.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Search & Choose</h3>
              <p className="text-gray-600">
                Browse our verified service providers by location, service type, and ratings.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Book & Pay</h3>
              <p className="text-gray-600">
                Book your service and pay securely through our integrated payment system.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Service & Rate</h3>
              <p className="text-gray-600">
                Receive your service and rate your experience to help other customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of customers who trust Saka-Kazi for their professional service needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/register" 
              className="btn btn-lg bg-white text-primary-700 hover:bg-gray-100 font-semibold"
            >
              Sign Up Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/about" 
              className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary-700"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Saka-Kazi</h3>
              <p className="text-gray-400">
                Connecting customers with verified professional service providers across Kenya.
              </p>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Electrical Work</li>
                <li>Plumbing</li>
                <li>Repairs</li>
                <li>Cleaning</li>
                <li>And More...</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Contact</li>
                <li>Careers</li>
                <li>Blog</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-md font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>FAQ</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Saka-Kazi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
