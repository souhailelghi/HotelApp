import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ChevronDown, 
  Send, 
  CheckCircle,
  Globe,
  Camera,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/Navbar';

const faqs = [
  {
    question: "How can I make a reservation?",
    answer: "You can easily make a reservation through our website by navigating to the Rooms page, selecting your desired dates, and choosing from our available luxury rooms. Alternatively, you can call our reception 24/7."
  },
  {
    question: "Can I cancel my booking?",
    answer: "Yes, you can cancel your booking through the 'My Reservations' page. Cancellations are free of charge if made before your check-in date. Once the check-in date has passed, the cancellation period expires."
  },
  {
    question: "Do you offer airport transfers?",
    answer: "Yes, we offer premium airport transfer services for our guests. Please contact us at least 48 hours prior to your arrival with your flight details to arrange a pickup."
  },
  {
    question: "What time is check-in and check-out?",
    answer: "Standard check-in time is from 2:00 PM, and check-out is until 12:00 PM (noon). Early check-in or late check-out can be requested and is subject to availability."
  },
  {
    question: "Is breakfast included?",
    answer: "Yes, a complimentary traditional Moroccan breakfast is included with all our room bookings. It is served daily from 7:00 AM to 10:30 AM in our main dining area."
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
        
        // Reset success message after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      }, 1500);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1542314831-c6a4d14d8373?q=80&w=2070&auto=format&fit=crop')`,
            backgroundPosition: 'center 30%'
          }}
        >
          <div className="absolute inset-0 bg-primary/70 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
        </div>

        <motion.div 
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.2 } }
          }}
        >
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 tracking-wide">
            Contact Us
          </h1>
          <div className="w-24 h-1 bg-accent mx-auto mb-6 rounded-full"></div>
          <p className="text-xl md:text-2xl text-gray-200 font-light drop-shadow-md">
            We are here to help you plan your perfect stay in Rabat.
          </p>
        </motion.div>
      </section>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 -mt-16 relative z-20">
        
        {/* 2. Contact Information Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {[
            { icon: MapPin, title: "Address", content: "Dar Diafa Rabat\nRabat, Morocco" },
            { icon: Phone, title: "Phone", content: "+212 537 123 456\n+212 600 123 456" },
            { icon: Mail, title: "Email", content: "contact@dardiafa.ma\nreservations@dardiafa.ma" },
            { icon: Clock, title: "Opening Hours", content: "Monday - Sunday\n24/7 Reception" }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              variants={fadeIn}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center flex flex-col items-center hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-6 shadow-sm">
                <item.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">{item.title}</h3>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">{item.content}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {/* 3. Contact Form */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10"
          >
            <h2 className="text-3xl font-serif font-bold text-primary mb-2">Send us a Message</h2>
            <p className="text-gray-500 mb-8">Fill out the form below and we will get back to you shortly.</p>
            
            <AnimatePresence>
              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 flex items-center gap-3 overflow-hidden"
                >
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <p className="font-medium">Thank you for your message! We will reply soon.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'} focus:outline-none focus:ring-2 transition-shadow bg-gray-50 focus:bg-white`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'} focus:outline-none focus:ring-2 transition-shadow bg-gray-50 focus:bg-white`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary outline-none transition-shadow bg-gray-50 focus:bg-white"
                    placeholder="+212 ..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.subject ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'} focus:outline-none focus:ring-2 transition-shadow bg-gray-50 focus:bg-white`}
                    placeholder="How can we help?"
                  />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message <span className="text-red-500">*</span></label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'} focus:outline-none focus:ring-2 transition-shadow bg-gray-50 focus:bg-white resize-none`}
                  placeholder="Your message here..."
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-lg font-bold text-white text-lg flex justify-center items-center gap-2 transition-all shadow-md
                  ${isSubmitting ? 'bg-primary/70 cursor-wait' : 'bg-primary hover:bg-blue-900 hover:shadow-lg'}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* 4. Google Map Section */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex flex-col h-full"
          >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 h-full min-h-[400px] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gray-200 z-0">
                {/* Placeholder Image for Map to look beautiful */}
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" 
                  alt="Map Location Placeholder" 
                  className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent z-10 flex flex-col justify-end p-8 text-white">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-serif font-bold mb-2">Find Us in Rabat</h3>
                  <p className="text-blue-50 mb-4 opacity-90">Located in the heart of the capital, offering easy access to historical landmarks and the city center.</p>
                  <button className="bg-accent hover:bg-yellow-600 text-white px-6 py-2.5 rounded-lg font-bold transition-colors inline-flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Get Directions
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 5. FAQ Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="max-w-3xl mx-auto mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">Frequently Asked Questions</h2>
            <div className="w-16 h-1 bg-accent mx-auto rounded-full"></div>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                initial={false}
              >
                <button
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none hover:bg-gray-50 transition-colors"
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-bold text-gray-900 pr-8">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-primary bg-blue-50 p-1.5 rounded-full"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaqIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </main>

      {/* 6. Call To Action Section */}
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Ready for Your Stay in Rabat?</h2>
            <p className="text-xl text-blue-100 mb-10 font-light">Experience luxury and comfort like never before.</p>
            <Link 
              to="/rooms" 
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-yellow-500 text-white font-bold text-lg px-8 py-4 rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
            >
              Check Room Availability
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 7. Footer Contact Block */}
      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-serif tracking-wider text-accent">Dar Diafa</span>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span>Rabat, Morocco</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-500" />
                <span>+212 537 123 456</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <span>contact@dardiafa.ma</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                <Camera className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
            
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Dar Diafa Rabat. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
