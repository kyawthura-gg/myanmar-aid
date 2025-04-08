import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  CheckCircle,
  Globe,
  Heart,
  Lightbulb,
  Shield,
  Users,
} from "lucide-react"
import Link from "next/link"

const teamMembers = [
  {
    name: "Kyaw Thura",
    role: "Team Lead",
    emoji: "🌟",
  },
  {
    name: "Sithu Tin",
    role: "Developer",
    emoji: "🛠️",
  },
  {
    name: "Hlyan Htet Aung",
    role: "Developer",
    emoji: "⚙️",
  },
]

export const runtime = "edge"

export default function AboutPage() {
  return (
    <main className="flex-1">
      {/* Hero Section - Simple and Icon-focused */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container-wrapper px-4 md:px-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary/10 p-6 rounded-full mb-6">
              <Heart className="h-12 w-12 text-primary" />
            </div>
            <Badge className="mb-4">About Us</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Connecting Hearts, Rebuilding Lives
            </h1>
            <p className="max-w-[600px] text-muted-foreground text-lg mb-8">
              We help donors send aid directly to earthquake victims in Myanmar.
              Every donation goes straight to those who need help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/">Support</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/register-need-campaign">
                  Start a need campaign
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section - Icon-focused */}
      <section className="py-16 md:py-20">
        <div className="container-wrapper px-4 md:px-6">
          <div className="text-center mb-10">
            <Badge className="mb-2">Our Values</Badge>
            <h2 className="text-3xl font-bold mb-4">How We Work</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              These are the basic ways we help people.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-muted/40 border-none">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Direct Impact</h3>
                <p className="text-muted-foreground">
                  All donations go directly to people in need
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/40 border-none">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Verification</h3>
                <p className="text-muted-foreground">
                  We check each request to make sure it's real
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/40 border-none">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Transparency</h3>
                <p className="text-muted-foreground">
                  Clear tracking of all donations and their impact.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/40 border-none">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Community</h3>
                <p className="text-muted-foreground">
                  Putting affected communities at the center of our work.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/40 border-none">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
                  <Lightbulb className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                <p className="text-muted-foreground">
                  Using technology to connect donors directly with recipients.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted/40 border-none">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Accessibility</h3>
                <p className="text-muted-foreground">
                  Making our platform accessible to everyone who needs help.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section - Icon-based instead of photos */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container-wrapper px-4 md:px-6">
          <div className="text-center mb-10">
            <Badge className="mb-2">Our Team</Badge>
            <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              A dedicated team working to connect donors with those in need.
            </p>
          </div>

          <div className="flex flex-col md:flex-auto md:grid md:grid-cols-3 gap-6 justify-center">
            {teamMembers.map((member, index) => (
              <Card key={index} className="w-full">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
                    <span
                      className="text-4xl"
                      role="img"
                      aria-label={member.role}
                    >
                      {member.emoji}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-muted-foreground mb-6">
              Our team is supported by volunteers across Myanmar who help with
              verification and community outreach.
            </p>
            <Button asChild variant="outline">
              <a href="mailto:support@mmaidconnect.com">Join Our Team</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Simple CTA Section */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="container-wrapper px-4 md:px-6 text-center">
          <div className="bg-white/10 p-6 rounded-full inline-block mb-6">
            <Heart className="h-12 w-12" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Help Us Help Others</h2>
          <p className="max-w-[600px] mx-auto text-primary-foreground/90 mb-8">
            Your help can make a real difference. Help rebuild lives in Myanmar
            today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link href="/">Donate</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white bg-transparent"
            >
              <Link href="/register-need-campaign">Start a need campaign</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
