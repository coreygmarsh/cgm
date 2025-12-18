import React from "react";

const CookiePolicy = () => {
  const lastUpdated = "December 15, 2025"; // update anytime

  return (
    <section className="relative min-h-screen pt-24 bg-black overflow-hidden">
      {/* Subtle background texture (matches your aesthetic, no palette change) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(0,255,255,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgba(16,185,129,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_85%,rgba(0,255,255,0.06),transparent_60%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <div
          className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-teal-950/35 to-black/60 backdrop-blur-xl p-8 md:p-12"
          style={{
            boxShadow:
              "0 0 40px rgba(0,255,255,0.12), inset 0 0 25px rgba(0,255,255,0.06)",
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
              Cookie Policy
            </h1>
            <p className="mt-3 text-cyan-100/70 font-body">
              Last updated:{" "}
              <span className="text-cyan-100/90">{lastUpdated}</span>
            </p>
            <p className="mt-5 text-lg text-cyan-100/75 font-body leading-relaxed">
              This Cookie Policy explains how cookies and similar technologies
              are used on this website operated by Corey G. Marsh (“we”, “us”,
              “our”).
            </p>
          </header>

          <div className="space-y-10 font-body text-cyan-100/75 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">
                What are cookies?
              </h2>
              <p>
                Cookies are small text files placed on your device when you
                visit a website. They help websites function properly, improve
                performance, and provide insights into how the site is used.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">
                How we use cookies
              </h2>
              <ul className="space-y-3">
                <li className="pl-4 border-l-2 border-cyan-400/25">
                  To ensure the site functions correctly and securely
                </li>
                <li className="pl-4 border-l-2 border-cyan-400/25">
                  To understand how visitors interact with the site (analytics)
                </li>
                <li className="pl-4 border-l-2 border-cyan-400/25">
                  To improve performance, usability, and overall experience
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">
                Types of cookies we use
              </h2>
              <ul className="space-y-4">
                <li className="pl-4 border-l-2 border-emerald-400/20">
                  <strong>Essential cookies:</strong> Required for core site
                  functionality (navigation, security, basic features).
                </li>
                <li className="pl-4 border-l-2 border-emerald-400/20">
                  <strong>Analytics cookies:</strong> Help us understand traffic
                  patterns and usage so we can improve the site.
                </li>
                <li className="pl-4 border-l-2 border-emerald-400/20">
                  <strong>Preference cookies:</strong> Remember limited
                  user-facing preferences (if applicable).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">
                Third-party cookies
              </h2>
              <p>
                Some cookies may be set by third-party services integrated into
                the site (such as video hosting or social platforms). These
                third parties have their own privacy and cookie policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">
                Managing cookies
              </h2>
              <p>
                You can control or disable cookies through your browser
                settings. Please note that disabling certain cookies may impact
                the functionality or experience of the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">
                Changes to this policy
              </h2>
              <p>
                We may update this Cookie Policy from time to time. The “Last
                updated” date reflects the most recent revision. Continued use
                of the site after changes means you accept the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-200 mb-3">
                Contact
              </h2>
              <p>If you have questions about this Cookie Policy:</p>
              <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-black/30 p-5">
                <p className="text-cyan-100/80">
                  <span className="font-semibold text-cyan-100/90">
                    Corey G. Marsh
                  </span>
                </p>
                <p className="text-cyan-100/70">
                  Email:{" "}
                  <span className="text-cyan-200">
                    coreymarshpm@gmail.com
                  </span>
                </p>
              </div>
            </section>
          </div>

          <div className="mt-10 pt-8 border-t border-cyan-400/15 text-sm text-cyan-100/55 font-body">
            This Cookie Policy is provided for informational purposes and does
            not constitute legal advice.
          </div>
        </div>
      </div>
    </section>
  );
};

export default CookiePolicy;
