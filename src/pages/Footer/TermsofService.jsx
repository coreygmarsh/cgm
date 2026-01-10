import React from "react";

const TermsOfService = () => {
  const lastUpdated = "December 15, 2025"; // edit anytime

  return (
    <section className="relative min-h-screen pt-24 bg-black overflow-hidden">
      {/* Background (matches your site vibe + fonts; no palette change required) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,255,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(16,185,129,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_85%,rgba(0,255,255,0.06),transparent_60%)]" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(0,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,255,0.06)_1px,transparent_1px)] [background-size:90px_90px] [mask-image:radial-gradient(circle_at_50%_40%,rgba(0,0,0,0.95),transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <div
          className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-teal-950/35 to-black/60 backdrop-blur-xl p-8 md:p-12"
          style={{
            boxShadow: "0 0 40px rgba(0,255,255,0.12), inset 0 0 25px rgba(0,255,255,0.06)",
          }}
        >
          <header className="mb-10">
            <h1
              className="text-5xl md:text-6xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400"
              style={{
                textShadow: "0 0 18px rgba(0,255,255,0.35)",
                filter: "drop-shadow(0 0 10px rgba(0,255,255,0.35))",
              }}
            >
              Terms of Service
            </h1>
            <p className="mt-3 text-cyan-100/70 font-body">
              Last updated: <span className="text-cyan-100/90">{lastUpdated}</span>
            </p>
            <p className="mt-5 text-lg text-cyan-100/75 font-body leading-relaxed">
              These Terms of Service (“Terms”) govern your access to and use of this website and any related
              services provided by Corey G. Marsh (“we”, “us”, “our”). By using the site, you agree to these Terms.
            </p>
          </header>

          <div className="space-y-10 font-body text-cyan-100/75 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">Use of the site</h2>
              <ul className="space-y-3">
                <li className="pl-4 border-l-2 border-cyan-400/25">
                  You may use the site for lawful purposes only.
                </li>
                <li className="pl-4 border-l-2 border-cyan-400/25">
                  You agree not to interfere with the site’s operation, security, or access (including scraping,
                  probing, or attempting unauthorized access).
                </li>
                <li className="pl-4 border-l-2 border-cyan-400/25">
                  We may suspend or restrict access if we reasonably believe the site is being misused.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">Portfolio content & intellectual property</h2>
              <p>
                Unless otherwise noted, all content on this site—including videos, edits, images, designs, text,
                branding, and code snippets—is owned by us or used with permission, and is protected by applicable
                intellectual property laws.
              </p>
              <ul className="mt-3 space-y-3">
                <li className="pl-4 border-l-2 border-emerald-400/20">
                  You may view and share links to the site for personal or professional reference.
                </li>
                <li className="pl-4 border-l-2 border-emerald-400/20">
                  You may not copy, reproduce, re-upload, redistribute, or create derivative works from site content
                  without prior written permission (except where permitted by law).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">Client inquiries & project requests</h2>
              <p>
                Any information provided through contact forms or email is used to respond to inquiries and discuss
                potential projects. Submitting an inquiry does not create a client relationship or guarantee
                availability.
              </p>
              <ul className="mt-3 space-y-3">
                <li className="pl-4 border-l-2 border-cyan-400/25">
                  Quotes, timelines, and deliverables (if any) are confirmed only in writing (e.g., email, contract,
                  or invoice).
                </li>
                <li className="pl-4 border-l-2 border-cyan-400/25">
                  If you send assets (footage, audio, images), you represent that you have the rights to share them
                  for review and collaboration.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">Third-party links</h2>
              <p>
                This site may link to third-party platforms (e.g., YouTube, Instagram, LinkedIn). We are not
                responsible for the content, policies, or practices of third-party sites. Your use of them is at
                your own risk and subject to their terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">Disclaimer</h2>
              <p>
                The site and its content are provided “as is” and “as available.” We make no warranties of any kind,
                express or implied, including fitness for a particular purpose, accuracy, or non-infringement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">Limitation of liability</h2>
              <p>
                To the maximum extent permitted by law, we will not be liable for any indirect, incidental, special,
                consequential, or punitive damages, or any loss of profits or revenues, arising from your use of the
                site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">Privacy</h2>
              <p>
                Your use of the site is also subject to our Privacy Policy. If you have a Privacy Policy page, link
                it here (recommended).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">Changes to these terms</h2>
              <p>
                We may update these Terms from time to time. The “Last updated” date will reflect the latest version.
                Continued use of the site after updates means you accept the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">Governing law</h2>
              <p>
                These Terms are governed by the laws of your applicable jurisdiction. (Optional: specify a state,
                e.g., Massachusetts, if you want it explicit.)
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">Contact</h2>
              <p>If you have questions about these Terms, contact:</p>
              <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-black/30 p-5">
                <p className="text-cyan-100/80">
                  <span className="font-semibold text-cyan-100/90">Corey G. Marsh</span>
                </p>
                <p className="text-cyan-100/70">
                  Email: <span className="text-cyan-200">corey@cgmcreativesolutions.com</span>
                </p>
              </div>
            </section>
          </div>

          <div className="mt-10 pt-8 border-t border-cyan-400/15 text-sm text-cyan-100/55 font-body">
            This template is provided for general informational purposes and is not legal advice.
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsOfService;
