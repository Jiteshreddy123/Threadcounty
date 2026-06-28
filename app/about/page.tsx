import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">About ThreadCounty</h1>
          <p className="text-xl text-muted-foreground">
            Empowering textile manufacturers and researchers with cutting-edge Artificial Intelligence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 text-left">
            <Card className="interactive-card">
              <CardHeader><CardTitle>Our Mission</CardTitle></CardHeader>
              <CardContent className="text-muted-foreground">
                To simplify and accelerate textile inspection by providing accessible, highly accurate AI tools that calculate thread density and analyze fabric composites in seconds.
              </CardContent>
            </Card>
            <Card className="interactive-card">
              <CardHeader><CardTitle>Our Vision</CardTitle></CardHeader>
              <CardContent className="text-muted-foreground">
                To become the global standard for digital quality control in the textile industry, eliminating manual counting errors and saving thousands of hours of labor.
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            ThreadCounty was born out of a hackathon challenge when we realized that traditional textile quality control was painfully slow. Quality assurance professionals were spending hours manually counting warp and weft threads under microscopes. We knew Computer Vision and AI could automate this, turning a tedious manual task into a 3-second upload.
          </p>
          <div className="border-l-2 border-primary pl-6 space-y-6 mt-8">
            <div>
              <h3 className="font-bold">2026 - The Concept</h3>
              <p className="text-sm text-muted-foreground">ThreadCounty is conceptualized during a global SaaS hackathon.</p>
            </div>
            <div>
              <h3 className="font-bold">2026 - The MVP</h3>
              <p className="text-sm text-muted-foreground">Launched the beta platform featuring AI Vision analysis, PDF Generation, and Secure Authentication.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight">Technology Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {["Next.js", "React", "Supabase", "Tailwind CSS"].map((tech) => (
              <div key={tech} className="p-4 bg-card rounded-lg shadow-sm border font-medium interactive-card">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
