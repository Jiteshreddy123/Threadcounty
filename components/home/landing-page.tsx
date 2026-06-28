"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  Layers, ScanLine, FileText, Spool, Scale, ClipboardCheck,
  Upload, Brain, Download, Star, ChevronRight, CheckCircle2,
  Users, BarChart3, Zap, Shield, ExternalLink, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ThreadCursor } from "@/components/home/thread-cursor";
import { FabricWeaveBackground } from "@/components/home/fabric-weave-background";

// --- DATA ---

const features = [
  {
    icon: ScanLine,
    title: "Warp & Weft Detection",
    desc: "AI counts EPI/PPI thread density with textile engineering precision.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: ClipboardCheck,
    title: "Procurement Spec Sheet",
    desc: "GSM estimate, quality grade, industry standard match, and buy/no-buy verdict for every sample.",
    color: "text-chart-3",
    bg: "bg-chart-3/10",
  },
  {
    icon: Scale,
    title: "Supplier Compare",
    desc: "Compare two cloth samples side-by-side — pick the best fabric for bulk purchase.",
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  {
    icon: FileText,
    title: "Bulk Order Calculator",
    desc: "Estimate fabric weight in kg/lbs for freight, MOQ, and supplier negotiations.",
    color: "text-chart-4",
    bg: "bg-chart-4/10",
  },
];

const stats = [
  { label: "Thread Density", value: "120/in" },
  { label: "Warp Count", value: "70" },
  { label: "Weft Count", value: "50" },
  { label: "Confidence", value: "98.4%" },
];

const platformStats = [
  { icon: Users, value: "12,000+", label: "Active Users" },
  { icon: BarChart3, value: "240K+", label: "Analyses Run" },
  { icon: Zap, value: "< 4 sec", label: "Avg. Analysis Time" },
  { icon: Shield, value: "99.9%", label: "Uptime SLA" },
];

const workflowSteps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Your Fabric",
    desc: "Drag & drop or click to upload a JPG, PNG, or JPEG image. Our compressor handles the rest — no fuss with file sizes.",
  },
  {
    step: "02",
    icon: Brain,
    title: "AI Analyzes in Seconds",
    desc: "Our computer vision model scans warp and weft threads, estimates GSM, identifies weave type, and generates a full procurement spec sheet.",
  },
  {
    step: "03",
    icon: Download,
    title: "Download & Act",
    desc: "Get a beautifully formatted PDF report with thread counts, quality grade, and a buy/reject verdict ready for supplier negotiations.",
  },
];

const benefits = [
  {
    persona: "Manufacturers",
    icon: Layers,
    color: "text-primary",
    bg: "bg-primary/10",
    points: [
      "Reduce QC inspection time by 80%",
      "Catch fabric defects before bulk orders",
      "Standardize supplier evaluation process",
      "Generate audit-ready reports instantly",
    ],
  },
  {
    persona: "Researchers",
    icon: BarChart3,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
    points: [
      "Quantify thread density at scale",
      "Compare weave structures across samples",
      "Export raw data for further analysis",
      "Build datasets with structured metadata",
    ],
  },
  {
    persona: "Students",
    icon: Zap,
    color: "text-chart-3",
    bg: "bg-chart-3/10",
    points: [
      "Learn fabric structures interactively",
      "Validate manual thread counts instantly",
      "Access free tier with 5 analyses/month",
      "Perfect for textile engineering coursework",
    ],
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "QC Manager, Arvind Mills",
    rating: 5,
    quote: "ThreadCounty cut our fabric inspection time from 2 hours to under 5 minutes per sample. The procurement spec sheet alone saves us weeks of back-and-forth with suppliers.",
    initials: "PS",
  },
  {
    name: "James Okafor",
    role: "Textile Engineering, MIT",
    rating: 5,
    quote: "As a researcher, I needed a reliable way to quantify thread density at scale. ThreadCounty's API integration and export features made my data collection 10x faster.",
    initials: "JO",
  },
  {
    name: "Sofia Müller",
    role: "Founder, Eco Fabric Co.",
    rating: 5,
    quote: "The supplier comparison tool is a game-changer. I can now confidently evaluate fabric samples remotely before flying to inspect warehouses in person.",
    initials: "SM",
  },
];

const faqs = [
  { q: "How accurate is the AI analysis?", a: "Our AI achieves up to 98.4% confidence on high-quality, well-lit fabric images. Accuracy improves significantly with good lighting and macro-level photography." },
  { q: "What image formats are supported?", a: "We support JPG, JPEG, and PNG. Files up to 5MB are accepted, and our system auto-compresses larger files to maintain quality." },
  { q: "Is there a free plan?", a: "Yes! Our Free plan includes 5 analyses per month with no credit card required. Upgrade anytime for more capacity." },
  { q: "Can I download my reports?", a: "Absolutely. Every completed analysis generates a downloadable PDF report with all thread metrics, quality grade, and supplier recommendations." },
  { q: "How is my data protected?", a: "All data is stored with row-level security in Supabase. Your uploaded images and reports are private and only accessible by your account." },
  { q: "Do you offer enterprise pricing?", a: "Yes — contact us at support@threadcounty.com for custom enterprise plans with unlimited analyses, dedicated support, and API access." },
];

// --- COMPONENTS ---

function MagneticButton({
  children,
  href,
  variant = "default",
}: {
  children: React.ReactNode;
  href: string;
  variant?: "default" | "outline";
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      <Link href={href}>
        <Button size="lg" variant={variant} className="px-8 gap-2">
          {children}
        </Button>
      </Link>
    </motion.div>
  );
}

// --- MAIN ---

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col landing-page cursor-none md:cursor-none">
      <ThreadCursor />
      <FabricWeaveBackground />

      <main className="flex-1 flex flex-col items-center">

        {/* ── HERO ────────────────────────────────────────────── */}
        <section className="w-full max-w-4xl mx-auto flex flex-col items-center text-center px-6 space-y-8 mt-16 md:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary font-medium"
          >
            <Spool className="size-4" />
            AI-Powered Textile Analysis Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl font-extrabold tracking-tight sm:text-7xl leading-[1.1]"
          >
            Count every{" "}
            <span className="text-primary relative inline-block">
              thread
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 200 12" preserveAspectRatio="none">
                <path d="M0 6 Q50 0 100 6 T200 6" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span>
            <br />
            with precision
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl"
          >
            ThreadCounty uses computer vision to analyze fabric weave, thread density,
            warp/weft counts, and material composition — in seconds, not hours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 pt-2"
          >
            <MagneticButton href="/signup">
              Start Free Trial <ChevronRight className="size-4" />
            </MagneticButton>
            <MagneticButton href="/login" variant="outline">Log In to Upload</MagneticButton>
          </motion.div>

          {/* Live stats preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 w-full max-w-2xl"
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="p-4 rounded-xl border bg-card/60 backdrop-blur-sm interactive-card"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-primary mt-1">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── FABRIC SWATCH VISUAL ─────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-3xl mx-auto px-6 mt-20"
        >
          <div className="relative aspect-[16/7] rounded-2xl overflow-hidden border shadow-2xl shadow-primary/10 interactive-card">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(0deg, oklch(0.55 0.15 30 / 0.4) 0px, oklch(0.55 0.15 30 / 0.4) 2px, transparent 2px, transparent 8px),
                  repeating-linear-gradient(90deg, oklch(0.45 0.2 264 / 0.35) 0px, oklch(0.45 0.2 264 / 0.35) 2px, transparent 2px, transparent 8px),
                  linear-gradient(135deg, oklch(0.92 0.03 60), oklch(0.88 0.05 30))
                `,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[1px]">
              <p className="text-sm font-medium text-foreground/80 px-6 py-2 rounded-full bg-background/70 border">
                Cotton Woven · 120 threads/inch · 98.4% confidence
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── PLATFORM STATISTICS ──────────────────────────────── */}
        <section className="w-full max-w-5xl mx-auto px-6 mt-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {platformStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl border bg-card interactive-card space-y-2"
              >
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                  <stat.icon className="size-5 text-primary" />
                </div>
                <p className="text-3xl font-extrabold tracking-tight">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────── */}
        <section className="w-full max-w-5xl mx-auto px-6 mt-28 text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <Badge variant="outline" className="text-primary border-primary/30">How It Works</Badge>
            <h2 className="text-4xl font-extrabold tracking-tight">From photo to report in 3 steps</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">No expertise required. Upload, wait 4 seconds, download your report.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(16.6%+1rem)] right-[calc(16.6%+1rem)] h-px bg-border" />
            {workflowSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center space-y-4"
              >
                <div className="size-20 rounded-full border-2 border-primary/20 bg-primary/5 flex items-center justify-center mx-auto relative z-10">
                  <step.icon className="size-8 text-primary" />
                  <span className="absolute -top-1 -right-1 size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────── */}
        <section className="w-full max-w-6xl mx-auto px-6 mt-28 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-3"
          >
            <Badge variant="outline" className="text-primary border-primary/30">Features</Badge>
            <h2 className="text-4xl font-extrabold tracking-tight">Everything you need for fabric QC</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12, duration: 0.5 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <Card className="interactive-card h-full text-left group">
                  <CardHeader>
                    <div className={`size-10 rounded-lg ${feature.bg} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform ${feature.color}`}>
                      <feature.icon className="size-5" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.desc}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── BENEFITS ─────────────────────────────────────────── */}
        <section className="w-full max-w-6xl mx-auto px-6 mt-28 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-3"
          >
            <Badge variant="outline" className="text-primary border-primary/30">Benefits</Badge>
            <h2 className="text-4xl font-extrabold tracking-tight">Built for every textile professional</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.persona}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <Card className="interactive-card h-full">
                  <CardHeader>
                    <div className={`size-10 rounded-lg ${benefit.bg} flex items-center justify-center ${benefit.color}`}>
                      <benefit.icon className="size-5" />
                    </div>
                    <CardTitle className="mt-2">{benefit.persona}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2.5">
                      {benefit.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <CheckCircle2 className="size-4 text-primary mt-0.5 shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────── */}
        <section className="w-full max-w-6xl mx-auto px-6 mt-28 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-3"
          >
            <Badge variant="outline" className="text-primary border-primary/30">Testimonials</Badge>
            <h2 className="text-4xl font-extrabold tracking-tight">Trusted by textile professionals</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <Card className="interactive-card h-full">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="size-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">"{t.quote}"</p>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {t.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="w-full max-w-3xl mx-auto px-6 mt-28 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-3"
          >
            <Badge variant="outline" className="text-primary border-primary/30">FAQ</Badge>
            <h2 className="text-4xl font-extrabold tracking-tight">Common questions</h2>
          </motion.div>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border rounded-xl px-4 interactive-card"
              >
                <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="text-center">
            <Link href="/faq" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
              <HelpCircle className="size-4" /> View all FAQs
            </Link>
          </div>
        </section>

        {/* ── CTA BANNER ───────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-5xl mx-auto px-6 mt-24"
        >
          <div className="relative overflow-hidden rounded-3xl bg-primary p-12 text-center space-y-6">
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 6px), repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 6px)",
              }}
            />
            <div className="relative space-y-4">
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary-foreground tracking-tight">
                Start analyzing fabric today
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">
                Join 12,000+ textile professionals using ThreadCounty. Free plan includes 5 analyses per month.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <Link href="/signup">
                  <Button size="lg" variant="secondary" className="px-8 gap-2">
                    Get Started Free <ChevronRight className="size-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

      </main>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="mt-24 border-t bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1 space-y-4">
              <div className="flex items-center gap-2 font-bold text-lg">
                <Spool className="size-5 text-primary" />
                ThreadCounty
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Precision AI textile analysis for modern manufacturers, researchers, and quality teams.
              </p>
              <div className="flex gap-2">
                {[
                  { label: "Twitter/X", href: "https://twitter.com" },
                  { label: "LinkedIn", href: "https://linkedin.com" },
                  { label: "GitHub", href: "https://github.com" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-8 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors text-xs font-bold"
                    aria-label={social.label}
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                ))}
              </div>
            </div>
            {/* Product */}
            <div className="space-y-3">
              <p className="font-semibold text-sm">Product</p>
              {[
                { href: "/dashboard", label: "Dashboard" },
                { href: "/history", label: "History" },
                { href: "/compare", label: "Compare" },
                { href: "/pricing", label: "Pricing" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="block text-sm text-muted-foreground hover:text-primary transition-colors">{l.label}</Link>
              ))}
            </div>
            {/* Company */}
            <div className="space-y-3">
              <p className="font-semibold text-sm">Company</p>
              {[
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/faq", label: "FAQ" },
                { href: "/admin", label: "Admin" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="block text-sm text-muted-foreground hover:text-primary transition-colors">{l.label}</Link>
              ))}
            </div>
            {/* Legal */}
            <div className="space-y-3">
              <p className="font-semibold text-sm">Legal</p>
              {[
                { href: "#", label: "Privacy Policy" },
                { href: "#", label: "Terms of Service" },
                { href: "#", label: "Cookie Policy" },
                { href: "#", label: "GDPR" },
              ].map((l) => (
                <Link key={l.label} href={l.href} className="block text-sm text-muted-foreground hover:text-primary transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">© 2026 ThreadCounty. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Warp · Weft · Density · Composition</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
