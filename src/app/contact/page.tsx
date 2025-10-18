import Link from "next/link";
import { ArrowLeft, Github, Mail, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const teamMembers = [
  {
    name: "Shreenidhi H S",
    github: "https://github.com/shreenidhiHS",
    email: "shreenidhibhat2002@gmail.com",
    githubUsername: "shreenidhiHS"
  },
  {
    name: "Akhil S R", 
    github: "https://github.com/AkLuffy07",
    email: "akhilsringeri123@gmail.com",
    githubUsername: "AkLuffy07"
  },
  {
    name: "Gagan V C",
    github: "https://github.com/gvc19", 
    email: "gaganvc19@gmail.com",
    githubUsername: "gvc19"
  }
];

export default function ContactPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity duration-200"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            Contact Us
          </h1>
          <p 
            className="text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Get in touch with our development team. We&apos;re here to help and would love to hear from you!
          </p>
        </div>

        {/* Team Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {teamMembers.map((member, index) => (
            <Card 
              key={index}
              className="hover:shadow-lg transition-shadow duration-300"
              style={{ 
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)'
              }}
            >
              <CardContent className="p-6 text-center">
                {/* Avatar */}
                <div 
                  className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: 'var(--muted)' }}
                >
                  <User className="w-10 h-10" style={{ color: 'var(--muted-foreground)' }} />
                </div>

                {/* Name */}
                <h3 
                  className="text-xl font-semibold mb-3"
                  style={{ color: 'var(--foreground)' }}
                >
                  {member.name}
                </h3>

                {/* Links */}
                <div className="space-y-3">
                  {/* GitHub Link */}
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md hover:opacity-80 transition-opacity duration-200"
                    style={{ 
                      backgroundColor: 'var(--muted)',
                      color: 'var(--foreground)'
                    }}
                  >
                    <Github className="w-4 h-4" />
                    <span className="text-sm">@{member.githubUsername}</span>
                  </a>

                  {/* Email Link */}
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md hover:opacity-80 transition-opacity duration-200 block"
                    style={{ 
                      backgroundColor: 'var(--muted)',
                      color: 'var(--foreground)'
                    }}
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">Email</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Contact Info */}
        <div className="text-center">
          <Card 
            className="max-w-2xl mx-auto"
            style={{ 
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)'
            }}
          >
            <CardContent className="p-6">
              <h2 
                className="text-2xl font-semibold mb-4"
                style={{ color: 'var(--foreground)' }}
              >
                General Inquiries
              </h2>
              <p 
                className="mb-4"
                style={{ color: 'var(--muted-foreground)' }}
              >
                For general questions, feature requests, or bug reports, feel free to reach out to any of our team members above.
              </p>
              <p 
                className="text-sm"
                style={{ color: 'var(--muted-foreground)' }}
              >
                We typically respond within 24-48 hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
