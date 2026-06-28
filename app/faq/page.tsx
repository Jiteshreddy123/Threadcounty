import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const faqCategories = [
  {
    category: "Platform",
    badge: "General",
    items: [
      { q: "What is ThreadCounty?", a: "ThreadCounty is an AI-powered textile analysis SaaS platform. It allows textile manufacturers, students, researchers, and quality control professionals to upload fabric images and receive automated analysis including thread density, warp/weft counts, fabric type identification, and AI-powered procurement insights." },
      { q: "Who is ThreadCounty designed for?", a: "ThreadCounty serves a wide range of users: textile manufacturers performing quality control, procurement teams evaluating supplier samples, fashion students learning about fabric structures, and independent researchers studying weave patterns. Our tiered pricing ensures there's a plan for everyone." },
      { q: "Is the platform available on mobile devices?", a: "Yes! ThreadCounty is fully responsive and works on all devices including smartphones and tablets. Our progressive web app support means you can even add it to your home screen for native-app-like access." },
      { q: "Do I need to install any software?", a: "No installation required. ThreadCounty is entirely web-based. All you need is a modern browser and an internet connection." },
    ],
  },
  {
    category: "AI Analysis",
    badge: "Technical",
    items: [
      { q: "How does the AI analysis work?", a: "Our computer vision model analyzes your uploaded fabric image at the pixel level. It detects thread patterns, counts warp (vertical) and weft (horizontal) threads, estimates thread density per inch, identifies fabric type (cotton, polyester, linen, etc.), and assigns a confidence score. When a Gemini API key is configured, analysis is powered by Google Gemini Vision." },
      { q: "How accurate is the analysis?", a: "Our AI achieves up to 98.4% confidence on high-quality, well-lit fabric images. Accuracy improves when images are taken under consistent lighting, close-up, and without motion blur. We recommend images at 1:1 macro scale for best results." },
      { q: "What image quality gives the best results?", a: "For optimal results: use even, diffuse lighting (avoid harsh shadows), photograph the fabric flat and wrinkle-free, capture at macro/close-up distance showing at least 1 cm² of fabric, and use a neutral background. JPG, JPEG, and PNG formats up to 5MB are accepted." },
      { q: "Can the AI identify fabric composition (e.g., 60% cotton / 40% polyester)?", a: "The AI can suggest likely composition based on visual weave patterns and thread appearance, but definitive fiber composition requires laboratory testing (e.g., burn test or spectrometry). Our results should be used as an informed starting point, not a laboratory-grade certificate." },
    ],
  },
  {
    category: "Pricing",
    badge: "Billing",
    items: [
      { q: "Is there a free plan?", a: "Yes! Our Free plan includes 5 analyses per month, basic thread density reports, and access to the fabric comparison tool. No credit card required to get started." },
      { q: "Can I upgrade or downgrade my plan at any time?", a: "Absolutely. You can change your plan at any time from your account settings. Upgrades take effect immediately and you're charged the prorated difference. Downgrades take effect at the end of your billing cycle." },
      { q: "Do you offer refunds?", a: "We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied within 14 days of your first payment, contact support@threadcounty.com and we'll issue a full refund." },
      { q: "Is there an annual pricing option?", a: "Yes! Annual billing gives you 2 months free compared to monthly billing. Switch to annual in your account settings at any time." },
    ],
  },
  {
    category: "Upload Limits",
    badge: "Storage",
    items: [
      { q: "What file formats are supported?", a: "We support JPG, JPEG, and PNG image formats. HEIC/HEIF (iPhone photos) are not currently supported — please convert to JPG before uploading. RAW camera formats are also not supported." },
      { q: "What is the maximum file size?", a: "The maximum file size is 5MB per image. Our system automatically compresses images before upload to stay within limits while preserving analysis quality. For very large files, please resize to under 5MB before uploading." },
      { q: "How many analyses can I run?", a: "Free users get 5 analyses/month. Student plan: 50/month. Professional plan: 500/month. Enterprise plan: unlimited. Analyses reset on the 1st of each month. Your upload history and previous reports are always retained." },
      { q: "How long are my reports stored?", a: "Reports are stored indefinitely for paid plans. Free plan reports are retained for 30 days. You can download reports as PDF at any time to keep a permanent copy." },
    ],
  },
  {
    category: "Account",
    badge: "Account",
    items: [
      { q: "How do I reset my password?", a: "Click 'Forgot password?' on the login page, enter your email, and we'll send a reset link within a few minutes. The link is valid for 1 hour. Check your spam folder if you don't see it in your inbox." },
      { q: "Can I use ThreadCounty without creating an account?", a: "Currently, an account is required to upload images and access analysis features. This ensures your reports are securely stored and accessible only by you. Sign-up is free and takes under a minute." },
      { q: "How do I delete my account?", a: "You can request account deletion from your Profile page → Danger Zone. Account deletion permanently removes all your data including uploaded images and analysis reports. This action is irreversible." },
      { q: "Is my data private and secure?", a: "Yes. Your uploaded images and reports are private by default and only accessible by your account. We use Supabase with row-level security policies ensuring data isolation between users. We do not sell or share your data with third parties." },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen py-16 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="outline" className="text-primary border-primary/30">Help Center</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about ThreadCounty. Can't find your answer?{" "}
            <Link href="/contact" className="text-primary hover:underline">Contact us</Link>.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-10">
          {faqCategories.map((category) => (
            <div key={category.category} className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">{category.category}</h2>
                <Badge variant="secondary">{category.badge}</Badge>
              </div>
              <Accordion type="single" collapsible className="space-y-2">
                {category.items.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`${category.category}-${i}`}
                    className="border rounded-xl px-4 interactive-card"
                  >
                    <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center p-10 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
          <h2 className="text-2xl font-bold">Still have questions?</h2>
          <p className="text-muted-foreground">Our team is ready to help you get the most out of ThreadCounty.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/contact"><Button>Contact Support</Button></Link>
            <Link href="/signup"><Button variant="outline">Start Free Trial</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
