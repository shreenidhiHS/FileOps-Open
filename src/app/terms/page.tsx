import { Metadata } from "next";
import LegalLayout from "@/components/layout/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service - OpenSource Tools",
  description: "Terms of service for OpenSource Tools - Learn about the terms and conditions for using our free online file processing tools.",
  robots: "index, follow",
  alternates: {
    canonical: "https://opensource-tools.com/terms",
  },
};

export default function TermsOfService() {
  return (
    <LegalLayout title="Terms of Service">
      <div className="space-y-8">
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using OpenSource Tools ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            OpenSource Tools provides free online file processing services including but not limited to:
          </p>
          <ul>
            <li>PDF manipulation tools (compress, merge, split, convert)</li>
            <li>Image processing tools (resize, crop, convert, compress)</li>
            <li>Audio and video processing tools</li>
            <li>File format conversion services</li>
          </ul>
          <p>
            These services are provided free of charge for personal and commercial use, subject to the terms and conditions outlined in this agreement.
          </p>
        </section>

        <section>
          <h2>3. User Responsibilities</h2>
          
          <h3>3.1 Acceptable Use</h3>
          <p>You agree to use our services only for lawful purposes and in accordance with these terms. You agree not to:</p>
          <ul>
            <li>Upload files that contain malicious code, viruses, or harmful content</li>
            <li>Attempt to gain unauthorized access to our systems or networks</li>
            <li>Use our services for any illegal or unauthorized purpose</li>
            <li>Interfere with or disrupt our services or servers</li>
            <li>Upload copyrighted material without proper authorization</li>
            <li>Upload files that violate any applicable laws or regulations</li>
            <li>Use automated systems to abuse or overload our services</li>
          </ul>

          <h3>3.2 File Content</h3>
          <p>
            You are solely responsible for the content of files you upload and process. We do not monitor, review, or control the content of user files. You represent and warrant that you have all necessary rights to upload and process any files you submit.
          </p>
        </section>

        <section>
          <h2>4. Intellectual Property Rights</h2>
          <p>
            The service and its original content, features, and functionality are and will remain the exclusive property of OpenSource Tools and its licensors. The service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
          </p>
          <p>
            You retain all rights to the files you upload. We do not claim ownership of your content.
          </p>
        </section>

        <section>
          <h2>5. Privacy and Data Protection</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices. By using our service, you agree to the collection and use of information in accordance with our Privacy Policy.
          </p>
        </section>

        <section>
          <h2>6. Service Availability</h2>
          <p>
            We strive to maintain high service availability but cannot guarantee uninterrupted access. Our services may be temporarily unavailable due to:
          </p>
          <ul>
            <li>Maintenance and updates</li>
            <li>Technical difficulties</li>
            <li>Server overload</li>
            <li>Force majeure events</li>
          </ul>
          <p>
            We reserve the right to modify, suspend, or discontinue any part of our services at any time without prior notice.
          </p>
        </section>

        <section>
          <h2>7. File Size and Processing Limits</h2>
          <p>
            We may impose reasonable limits on file sizes and processing operations to ensure service stability and fair usage. These limits may include:
          </p>
          <ul>
            <li>Maximum file size per upload</li>
            <li>Maximum number of files per batch operation</li>
            <li>Processing time limits</li>
            <li>Daily usage quotas</li>
          </ul>
          <p>
            Current limits are displayed on relevant tool pages and may be updated from time to time.
          </p>
        </section>

        <section>
          <h2>8. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE EXPRESSLY DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p>
            We make no warranty that:
          </p>
          <ul>
            <li>The service will meet your requirements</li>
            <li>The service will be uninterrupted, timely, secure, or error-free</li>
            <li>The results obtained from the service will be accurate or reliable</li>
            <li>Any errors in the service will be corrected</li>
          </ul>
        </section>

        <section>
          <h2>9. Limitation of Liability</h2>
          <p>
            IN NO EVENT SHALL OPENSOURCE TOOLS, NOR ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SERVICE.
          </p>
          <p>
            Our total liability to you for any damages arising from or related to these terms or the service shall not exceed the amount you paid us for the service in the 12 months preceding the claim, or $100, whichever is greater.
          </p>
        </section>

        <section>
          <h2>10. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless OpenSource Tools and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees).
          </p>
        </section>

        <section>
          <h2>11. Termination</h2>
          <p>
            We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will cease immediately.
          </p>
          <p>
            We may also terminate or suspend your access for:
          </p>
          <ul>
            <li>Violation of these terms</li>
            <li>Abuse of our services</li>
            <li>Technical or security reasons</li>
            <li>Legal requirements</li>
          </ul>
        </section>

        <section>
          <h2>12. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
          </p>
          <p>
            By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
          </p>
        </section>

        <section>
          <h2>13. Governing Law</h2>
          <p>
            These Terms shall be interpreted and governed by the laws of [Your Jurisdiction], without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
          </p>
        </section>

        <section>
          <h2>14. Severability</h2>
          <p>
            If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
