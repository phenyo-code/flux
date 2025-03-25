"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PricingPage = () => {
  // Animation variants

  const heroVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-20 px-6">
        <motion.div
          className="container mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={heroVariants}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Flexible Pricing for Every Creator
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Choose a plan tailored to your needs—start free, scale as you grow.
          </p>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <main className="container mx-auto py-20 px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
          Pricing Plans
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-12">
          Whether you’re a solo creator, freelancer, or growing team, Flux has a plan to empower your vision.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingCard
            title="Free"
            price="R0"
            subPrice="/month"
            description="Perfect for exploring Flux and building your first projects."
            features={[
              "Drag & Drop Builder",
              "Basic Components",
              "Up to 3 Projects",
              "Community Support",
              "Export to HTML/CSS",
            ]}
            buttonLabel="Get Started"
            buttonLink="/signup"
            highlight={false}
          />
          <PricingCard
            title="Pro"
            price="R199"
            subPrice="/month"
            description="Ideal for freelancers and small businesses with growing needs."
            features={[
              "All Free Features",
              "Unlimited Projects",
              "Custom Components",
              "Priority Email Support",
              "Export to React/Next.js",
            ]}
            buttonLabel="Upgrade Now"
            buttonLink="/signup"
            highlight={true}
          />
          <PricingCard
            title="Business"
            price="R499"
            subPrice="/month"
            description="Designed for teams and enterprises scaling their workflows."
            features={[
              "All Pro Features",
              "Team Collaboration (5 Users)",
              "Advanced API Access",
              "Dedicated Phone Support",
              "White-Label Exports",
            ]}
            buttonLabel="Get Business"
            buttonLink="/signup"
            highlight={false}
          />
        </div>
      </main>

      {/* Comparison Table */}
      <section className="bg-white py-16 px-6">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Compare Plans
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-700 border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 font-semibold">Feature</th>
                  <th className="p-4 font-semibold text-center">Free</th>
                  <th className="p-4 font-semibold text-center">Pro</th>
                  <th className="p-4 font-semibold text-center">Business</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Projects", free: "3", pro: "Unlimited", business: "Unlimited" },
                  { feature: "Components", free: "Basic", pro: "Custom", business: "Custom" },
                  { feature: "Support", free: "Community", pro: "Priority Email", business: "Dedicated Phone" },
                  { feature: "Export Options", free: "HTML/CSS", pro: "React/Next.js", business: "White-Label" },
                  { feature: "Team Members", free: "1", pro: "1", business: "5" },
                  { feature: "API Access", free: "-", pro: "Basic", business: "Advanced" },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="p-4">{row.feature}</td>
                    <td className="p-4 text-center">{row.free}</td>
                    <td className="p-4 text-center">{row.pro}</td>
                    <td className="p-4 text-center">{row.business}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-100 py-16 px-6">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: "What happens if I exceed my project limit?",
                a: "With the Free plan, you’re limited to 3 projects. Upgrade to Pro or Business for unlimited projects.",
              },
              {
                q: "Can I cancel my subscription anytime?",
                a: "Yes, you can cancel anytime with no hidden fees. Your access continues until the end of the billing cycle.",
              },
              {
                q: "Is there a discount for annual billing?",
                a: "Yes, save 20% by choosing annual billing on Pro or Business plans.",
              },
              {
                q: "What kind of support do I get?",
                a: "Free plan includes community support, Pro offers priority email, and Business provides dedicated phone support.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="text-xl font-semibold text-gray-800 mb-2">{faq.q}</h4>
                <p className="text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-500 text-white py-12 px-6">
        <motion.div
          className="container mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Workflow?</h3>
          <p className="text-lg mb-6 max-w-xl mx-auto">
            Start with Flux today and see why creators trust us to bring their ideas to life.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-blue-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
          >
            Sign Up Now
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

/* Enhanced Pricing Card Component */
interface PricingCardProps {
  title: string;
  price: string;
  subPrice: string;
  description: string;
  features: string[];
  buttonLabel: string;
  buttonLink: string;
  highlight: boolean;
}

const PricingCard = ({
  title,
  price,
  subPrice,
  description,
  features,
  buttonLabel,
  buttonLink,
  highlight,
}: PricingCardProps) => {
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { scale: 1.05, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" },
  };

  return (
    <motion.div
      className={`p-8 rounded-lg shadow-lg border ${
        highlight ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
      } transition-all`}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      whileHover="hover"
    >
    <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
    <p className="text-gray-600 text-lg mt-2 mb-4">{description}</p>
    <div className="flex justify-center items-baseline mb-6">
      <p className="text-4xl font-extrabold text-gray-900">{price}</p>
      <span className="text-gray-600 ml-1">{subPrice}</span>
    </div>
    <ul className="mt-4 space-y-3 text-gray-700 text-left">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center">
          <span className="text-green-500 mr-2">✅</span> {feature}
        </li>
      ))}
    </ul>
    <Link
      href={buttonLink}
      className={`block mt-8 px-6 py-3 text-lg font-semibold rounded-lg ${
        highlight
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "border border-gray-500 text-gray-700 hover:bg-gray-100"
      } transition-all`}
    >
      {buttonLabel}
    </Link>
  </motion.div>
);
};

export default PricingPage;