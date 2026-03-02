import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WavyBackground from "@/components/ui/blue-meshy-background";
import { MapPin, Mail, Phone, Clock, MessageSquare, Send } from "lucide-react";
import { FlowButton } from "@/components/ui/flow-button";

const contactInfo = [
  {
    icon: Mail,
    label: "EMAIL",
    value: "hello@primustech.africa",
  },
  {
    icon: Phone,
    label: "PHONE",
    value: "+263 2305712",
  },
  {
    icon: MapPin,
    label: "OFFICE",
    value: "Harare, Zimbabwe",
  },
  {
    icon: Clock,
    label: "BUSINESS HOURS",
    value: "Mon – Fri, 8AM – 5PM CAT",
  },
];

export default function ContactPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#111111]">
      <Header />

      {/* Hero Section with Blue Meshy Background */}
      <section className="relative min-h-[500px] flex flex-col border-b border-[#333333]">
        <WavyBackground className="flex flex-col justify-end h-[500px]">
          <div className="relative z-10 flex flex-col gap-5 p-6 md:p-[80px_60px]">
            <span className="font-mono text-[11px] font-medium tracking-[3px] text-[var(--accent-gold)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              CONTACT FORM
            </span>
            <h1 className="font-display text-[48px] md:text-[80px] leading-[1.05] text-white max-w-[1000px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              Let&apos;s Build Together
            </h1>
            <p className="font-body text-[16px] leading-[1.5] text-[#A3A3A3] max-w-[500px]">
              Ready to transform your digital infrastructure? Reach out to our technical team and we will respond within 24 hours.
            </p>
          </div>
        </WavyBackground>
      </section>

      {/* Contact Form + Info (Responsive Grid/Flex) */}
      <section id="contact" className="flex flex-col-reverse lg:flex-row items-stretch border-b border-[#333333]">

        {/* Contact Form Left Side */}
        <div className="flex flex-col gap-10 w-full lg:w-[60%] p-6 py-12 md:p-[80px_60px] bg-[#111111]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-[var(--accent-blue)]" />
              <span className="font-mono text-[12px] uppercase tracking-[3px] text-white">
                DIRECT MESSAGE
              </span>
            </div>
            <h2 className="font-display text-[32px] md:text-[40px] leading-[1.1] text-white">
              Tell Us About Your Project
            </h2>
          </div>

          <form className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col gap-2 flex-1">
                <label htmlFor="fullName" className="font-mono text-[11px] tracking-[2px] text-[#A3A3A3]">
                  FULL NAME *
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Your name"
                  required
                  className="w-full px-5 py-4 bg-[#1A1A1A] border border-[#333333] font-body text-[15px] text-white placeholder:text-[#666666] outline-none focus:border-[var(--accent-blue)] transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label htmlFor="emailAddress" className="font-mono text-[11px] tracking-[2px] text-[#A3A3A3]">
                  EMAIL ADDRESS *
                </label>
                <input
                  id="emailAddress"
                  type="email"
                  placeholder="you@company.com"
                  required
                  className="w-full px-5 py-4 bg-[#1A1A1A] border border-[#333333] font-body text-[15px] text-white placeholder:text-[#666666] outline-none focus:border-[var(--accent-blue)] transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col gap-2 flex-1">
                <label htmlFor="phoneNum" className="font-mono text-[11px] tracking-[2px] text-[#A3A3A3]">
                  PHONE NUMBER
                </label>
                <input
                  id="phoneNum"
                  type="tel"
                  placeholder="+263 ..."
                  className="w-full px-5 py-4 bg-[#1A1A1A] border border-[#333333] font-body text-[15px] text-white placeholder:text-[#666666] outline-none focus:border-[var(--accent-blue)] transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label htmlFor="interest" className="font-mono text-[11px] tracking-[2px] text-[#A3A3A3]">
                  SERVICE INTEREST
                </label>
                <select
                  id="interest"
                  defaultValue=""
                  className="w-full px-5 py-4 bg-[#1A1A1A] border border-[#333333] font-body text-[15px] text-white placeholder-[#666666] outline-none focus:border-[var(--accent-blue)] transition-colors appearance-none"
                >
                  <option value="" disabled>Select a service...</option>
                  <option value="cybersecurity">Enterprise Cybersecurity</option>
                  <option value="cloud">Cloud & Infrastructure</option>
                  <option value="managed">Managed IT Services</option>
                  <option value="remote">Remote Technology Services</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="details" className="font-mono text-[11px] tracking-[2px] text-[#A3A3A3]">
                PROJECT DETAILS
              </label>
              <textarea
                id="details"
                rows={5}
                placeholder="Tell us about your project requirements, timeline, and goals..."
                className="w-full px-5 py-4 bg-[#1A1A1A] border border-[#333333] font-body text-[15px] text-white placeholder:text-[#666666] outline-none focus:border-[var(--accent-blue)] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="group flex justify-between items-center bg-white border border-white text-black hover:bg-transparent hover:text-white rounded-[100px] px-8 py-4 mt-4 transition-all duration-300 w-full md:w-fit min-w-[200px]"
            >
              <span className="font-mono text-[13px] font-bold tracking-[1px] uppercase">Submit Inquiry</span>
              <Send className="w-4 h-4 ml-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* Contact Info Sidebar Right Side */}
        <div className="flex flex-col justify-center gap-10 w-full lg:w-[40%] p-6 py-12 md:p-[80px_60px] bg-[#161616] border-b lg:border-l border-[#333333]">
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[12px] uppercase tracking-[3px] text-[var(--accent-gold)]">
              REACH US DIRECTLY
            </span>
            <h2 className="font-display text-[32px] md:text-[40px] leading-[1.1] text-white">
              Contact Information
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {contactInfo.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-6 bg-[#111111] border border-[#333333] hover:border-[#555555] transition-colors cursor-pointer group">
                <div className="mt-1">
                  <item.icon className="w-5 h-5 text-[var(--accent-blue)] group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] uppercase tracking-[2px] text-[#666666]">
                    {item.label}
                  </span>
                  <span className="font-body text-[16px] text-white font-medium">
                    {item.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="font-body text-[14px] leading-[1.6] text-[#A3A3A3] max-w-[320px]">
            We typically respond within 24 hours. For urgent technical support inquiries, please call our local office directly during standard CAT business hours.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
