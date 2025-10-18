import { Metadata } from "next";
import LegalLayout from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy - OpenSource Tools",
  description: "Privacy policy for OpenSource Tools - Learn how we protect your data and privacy while using our free online file processing tools.",
  robots: "index, follow",
  alternates: {
    canonical: "https://opensource-tools.com/privacy",
  },
};

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy">
      <div className="space-y-8">
        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to OpenSource Tools (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
          <p>
            By using OpenSource Tools, you consent to the data practices described in this Privacy Policy.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Files You Upload</h3>
          <p>
            When you use our tools, you may upload files for processing. We process these files temporarily to provide our services. Files are:
          </p>
          <ul>
            <li>Processed entirely in your browser when possible</li>
            <li>Temporarily stored on our servers only when necessary for processing</li>
            <li>Automatically deleted from our servers after processing is complete</li>
            <li>Never shared with third parties</li>
          </ul>

          <h3>2.2 Technical Information</h3>
          <p>We automatically collect certain technical information, including:</p>
          <ul>
            <li>IP address and location data</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Device information</li>
            <li>Pages visited and time spent on our site</li>
            <li>Referring website information</li>
          </ul>

          <h3>2.3 Cookies and Tracking</h3>
          <p>
            We use essential cookies to maintain basic functionality and optional analytics cookies to improve our services. You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul>
            <li>Provide and maintain our file processing services</li>
            <li>Improve our tools and user experience</li>
            <li>Monitor and analyze usage patterns</li>
            <li>Ensure security and prevent abuse</li>
            <li>Comply with legal obligations</li>
            <li>Respond to user inquiries and support requests</li>
          </ul>
        </section>

        <section>
          <h2>4. Information Sharing and Disclosure</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:</p>
          <ul>
            <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our website and services</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            <li><strong>Consent:</strong> When you explicitly consent to sharing</li>
          </ul>
        </section>

        <section>
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
          </p>
          <p>
            Our security measures include:
          </p>
          <ul>
            <li>SSL/TLS encryption for data transmission</li>
            <li>Regular security audits and updates</li>
            <li>Access controls and authentication</li>
            <li>Automated file deletion after processing</li>
            <li>Secure server infrastructure</li>
          </ul>
        </section>

        <section>
          <h2>6. Data Retention</h2>
          <p>
            We retain your information only for as long as necessary to provide our services and comply with legal obligations:
          </p>
          <ul>
            <li><strong>Uploaded Files:</strong> Deleted immediately after processing</li>
            <li><strong>Technical Logs:</strong> Retained for up to 30 days for security purposes</li>
            <li><strong>Analytics Data:</strong> Aggregated and anonymized data may be retained longer</li>
          </ul>
        </section>

        <section>
          <h2>7. Your Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information:</p>
          <ul>
            <li><strong>Access:</strong> Request access to your personal information</li>
            <li><strong>Correction:</strong> Request correction of inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
            <li><strong>Objection:</strong> Object to processing of your personal information</li>
            <li><strong>Withdrawal of Consent:</strong> Withdraw consent where processing is based on consent</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information provided in the Contact section.
          </p>
        </section>

        <section>
          <h2>8. Third-Party Services</h2>
          <p>
            Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any personal information.
          </p>
        </section>

        <section>
          <h2>9. Children&apos;s Privacy</h2>
          <p>
            Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
          </p>
        </section>

        <section>
          <h2>10. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
          </p>
        </section>

        <section>
          <h2>11. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; date. We encourage you to review this Privacy Policy periodically for any changes.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
