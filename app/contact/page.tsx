"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Mail, ExternalLink, MapPin, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { submitContactAction } from "@/actions/contact";

const contactInfo = [
  { icon: Mail, label: "Email", value: "support@threadcounty.com", href: "mailto:support@threadcounty.com" },
  { icon: Phone, label: "Phone", value: "+91 40 4567 8900", href: "tel:+914045678900" },
  { icon: MapPin, label: "Location", value: "Hyderabad, Telangana, India", href: null },
];

const socialLinks = [
  { label: "Twitter/X", href: "https://twitter.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await submitContactAction(
        form.firstName, form.lastName, form.email, form.subject, form.message
      );
      if (result.success) {
        setSubmitted(true);
      } else {
        toast.error("Failed to send message", { description: result.error });
      }
    });
  };

  return (
    <div className="min-h-screen py-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about our API, enterprise plans, or AI models? Our team is here to help within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-8"
          >
            <div className="space-y-5">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-4">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <info.icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Follow Us</p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="px-3 py-1.5 rounded-lg bg-muted flex items-center gap-1.5 hover:bg-primary/10 hover:text-primary transition-colors text-xs font-medium"
                  >
                    <ExternalLink className="size-3" />
                    {social.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Response Time Badge */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm space-y-1">
              <p className="font-semibold text-primary">⚡ Fast Response</p>
              <p className="text-muted-foreground">We typically respond within 24 business hours.</p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="md:col-span-3"
          >
            <Card className="interactive-card">
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
                <CardDescription>We read every message personally.</CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="flex flex-col items-center gap-4 py-10 text-center">
                    <CheckCircle2 className="size-14 text-primary" />
                    <h3 className="text-xl font-semibold">Message sent!</h3>
                    <p className="text-muted-foreground text-sm max-w-xs">
                      Thank you for reaching out. We'll get back to you at <strong>{form.email}</strong> within 24 hours.
                    </p>
                    <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ firstName: "", lastName: "", email: "", subject: "", message: "" }); }}>
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" placeholder="Arjun" required value={form.firstName} onChange={(e) => setForm(f => ({ ...f, firstName: e.target.value }))} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Sharma" value={form.lastName} onChange={(e) => setForm(f => ({ ...f, lastName: e.target.value }))} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Email *</Label>
                      <Input id="contactEmail" type="email" placeholder="arjun@company.com" required value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="Enterprise plan inquiry" value={form.subject} onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <textarea
                        id="message"
                        className="flex min-h-[140px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        placeholder="How can we help you?"
                        required
                        value={form.message}
                        onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                      />
                    </div>
                    <Button className="w-full" type="submit" disabled={isPending}>
                      {isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
