import React from "react";

const PrivacyPolicy = () => {
  const lastUpdated = "December 15, 2025"; // edit anytime

  return (
    <section className="relative min-h-screen pt-24 bg-black overflow-hidden">
      {/* Background (keeps your vibe + fonts) */}
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
              Privacy Policy
            </h1>
            <p className="mt-3 text-cyan-100/70 font-body">
              Last updated: <span className="text-cyan-100/90">{lastUpdated}</span>
            </p>
            <p className="mt-5 text-lg text-cyan-100/75 font-body leading-relaxed">
              This Privacy Policy explains how Corey G. Marsh (“we”, “us”, or “our”) collects,
              uses, and protects information when you visit this website or contact us.
            </p>
          </header>

          <div className="space-y-10 font-body text-cyan-100/75 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">Information we collect</h2>
              <ul className="space-y-3">
                <li className="pl-4 border-l-2 border-cyan-400/25">
                  <span className="font-semibold text-cyan-100/90">Contact details you provide:</span>{" "}
                  such as name, email address, company, and the contents of your message when you
                  reach out via a form or email.
                </li>
                <li className="pl-4 border-l-2 border-cyan-400/25">
                  <span className="font-semibold text-cyan-100/90">Usage data:</span>{" "}
                  basic technical information (e.g., browser type, pages visited, approximate location)
                  that may be collected through analytics tools.
                </li>
                <li className="pl-4 border-l-2 border-cyan-400/25">
                  <span className="font-semibold text-cyan-100/90">Cookies:</span>{" "}
                  small files used to remember preferences and understand site performance (where enabled).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">How we use your information</h2>
              <ul className="space-y-3">
                <li className="pl-4 border-l-2 border-emerald-400/20">
                  To respond to inquiries and provide requested services or information.
                </li>
                <li className="pl-4 border-l-2 border-emerald-400/20">
                  To maintain and improve website performance, design, and content.
                </li>
                <li className="pl-4 border-l-2 border-emerald-400/20">
                  To protect against abuse, spam, or security threats.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">Sharing your information</h2>
              <p>
                We do not sell your personal information. We may share information only in limited cases:
              </p>
              <ul className="mt-3 space-y-3">
                <li className="pl-4 border-l-2 border-cyan-400/25">
                  <span className="font-semibold text-cyan-100/90">Service providers:</span>{" "}
                  trusted vendors that help operate the site (e.g., hosting, analytics, email delivery),
                  only as needed to perform services for us.
                </li>
                <li className="pl-4 border-l-2 border-cyan-400/25">
                  <span className="font-semibold text-cyan-100/90">Legal requirements:</span>{" "}
                  if required to comply with a law, regulation, or valid legal process.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">Cookies & analytics</h2>
              <p>
                We may use cookies and similar technologies to measure traffic and improve the experience.
                You can control cookies through your browser settings. Disabling cookies may affect some features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">Data retention</h2>
              <p>
                We keep personal information only as long as necessary for the purposes described above,
                unless a longer retention period is required or permitted by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">Your choices</h2>
              <ul className="space-y-3">
                <li className="pl-4 border-l-2 border-emerald-400/20">
                  You can request access, correction, or deletion of information you’ve provided by contacting us.
                </li>
                <li className="pl-4 border-l-2 border-emerald-400/20">
                  You can opt out of marketing emails (if any) by using the unsubscribe link or contacting us.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">Security</h2>
              <p>
                We use reasonable administrative, technical, and physical safeguards to protect information.
                However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">Children’s privacy</h2>
              <p>
                This website is not directed to children under 13, and we do not knowingly collect personal
                information from children. If you believe a child has provided personal information, contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">Changes to this policy</h2>
              <p>
                We may update this Privacy Policy from time to time. The “Last updated” date will reflect the
                latest version.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">Contact</h2>
              <p>
                If you have questions about this Privacy Policy, contact:
              </p>
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

export default PrivacyPolicy;
