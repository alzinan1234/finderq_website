// @ts-nocheck
'use client'
import { X } from "lucide-react";
const aboutLogo = '/assets/111aa222bb111-Photoroom-1.png';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-[9998] p-3 sm:p-4" onClick={onClose}>
      <div className="bg-[#1a1d29] rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-2 -ml-4">
            <img src={aboutLogo} alt="" className="w-32 h-16 object-contain" style={{marginTop: '-8px', marginBottom: '-8px'}} />
            <h2 className="text-white text-xl font-bold -ml-3">Privacy Policy</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-6 space-y-5 text-white/70 text-sm leading-relaxed">
          <p className="text-white/40 text-xs">Last Updated: 14.06.2026</p>

          <section>
            <h3 className="text-white font-semibold mb-2">1. Introduction</h3>
            <p>Welcome to FinderQ. We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains what information we collect, how we use it, and your rights regarding your data.</p>
            <p className="mt-2">By using our platform, you agree to the collection and use of information as described in this Privacy Policy.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">2. Information We Collect</h3>
            <p className="font-medium text-white/80 mb-1">Account Information</p>
            <ul className="list-disc pl-5 space-y-1"><li>Username</li><li>Email address</li><li>Password (encrypted and never stored in plain text)</li></ul>
            <p className="font-medium text-white/80 mt-3 mb-1">Profile Information</p>
            <ul className="list-disc pl-5 space-y-1"><li>Profile picture</li><li>Biography</li><li>Gaming preferences</li><li>Skill level, rank, roles, or other information you choose to make public</li></ul>
            <p className="font-medium text-white/80 mt-3 mb-1">Subscription Information</p>
            <p>If you purchase a subscription: subscription status, billing history, payment transaction identifiers. We do not store full credit card information. Payments are processed by third-party payment providers.</p>
            <p className="font-medium text-white/80 mt-3 mb-1">Technical Information</p>
            <ul className="list-disc pl-5 space-y-1"><li>IP address</li><li>Browser type</li><li>Device information</li><li>Cookies and analytics data</li></ul>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">3. Public Profiles</h3>
            <p>Our platform is designed to help players connect with other players and teams. Information you choose to include in your profile may be visible to other registered users, visitors of the platform, and search engines (if applicable). You are responsible for the information you choose to publish publicly.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">4. How We Use Your Information</h3>
            <ul className="list-disc pl-5 space-y-1"><li>Create and manage your account</li><li>Display your public profile</li><li>Process subscriptions and payments</li><li>Provide customer support</li><li>Improve platform functionality</li><li>Prevent abuse, fraud, and security threats</li><li>Enforce our Terms of Service</li></ul>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">5. Cookies</h3>
            <p>We may use cookies and similar technologies to keep you logged in, remember your preferences, analyze website performance, and improve user experience. You can disable cookies through your browser settings, although some features may not function properly.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">6. Sharing of Information</h3>
            <p>We do not sell your personal information. We may share information with service providers (hosting, analytics, payment processors, email delivery) and when required by law to protect the safety, rights, or property of our users.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">7. Data Security</h3>
            <p>We implement reasonable security measures to protect your information from unauthorized access, disclosure, or loss. However, no method of transmission or storage is completely secure.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">8. Data Retention</h3>
            <p>We retain your information only as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Deleted accounts may have certain information retained for legal, security, or fraud-prevention purposes.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">9. Your Rights</h3>
            <p>Depending on your location, you may have the right to access, correct, delete your personal data, object to certain processing activities, or request a copy of your data.</p>
            <p className="mt-2">To exercise these rights, contact us at: <span className="text-[#00d4ff]">FinderQ@yahoo.com</span></p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">10. Children's Privacy</h3>
            <p>Our services are not intended for children under the age required by applicable law. If we learn that we have collected personal information from a child without appropriate consent, we will take steps to remove that information.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">11. Third-Party Services</h3>
            <p>Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices or content of those third parties.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">12. Changes to This Privacy Policy</h3>
            <p>We may update this Privacy Policy from time to time. Updated versions will be posted on this page with a revised "Last Updated" date. Continued use of the platform after changes constitutes acceptance of the updated Privacy Policy.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">13. Contact Us</h3>
            <p>Email: <span className="text-[#00d4ff]">FinderQ@yahoo.com</span></p>
            <p>Website: <span className="text-[#00d4ff]">FinderQ.com</span></p>
          </section>
        </div>
      </div>
    </div>
  );
}
