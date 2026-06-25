// @ts-nocheck
'use client'
import { X } from "lucide-react";
const aboutLogo = '/assets/111aa222bb111-Photoroom-1.png';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-[9998] p-3 sm:p-4" onClick={onClose}>
      <div className="bg-[#1a1d29] rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-2 -ml-4">
            <img src={aboutLogo} alt="" className="w-32 h-16 object-contain" style={{marginTop: '-8px', marginBottom: '-8px'}} />
            <h2 className="text-white text-xl font-bold -ml-3">Terms of Service</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-6 space-y-5 text-white/70 text-sm leading-relaxed">
          <p className="text-white/40 text-xs">Last Updated: 14.06.2026</p>

          <section>
            <h3 className="text-white font-semibold mb-2">1. Acceptance of Terms</h3>
            <p>By accessing or using FinderQ.com, you agree to be bound by these Terms of Service. If you do not agree with these terms, you must not use the Platform.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">2. Age Requirement</h3>
            <p>You must be at least 13 years old to create an account and use the Platform. By creating an account, you represent and warrant that you meet this age requirement. If you are under the age of majority in your jurisdiction, you may only use the Platform with the consent and supervision of a parent or legal guardian. We reserve the right to suspend or terminate accounts that violate this requirement.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">3. Eligibility</h3>
            <p>By creating an account, you confirm that the information you provide is accurate and up to date, you are legally permitted to use the Platform, and you will comply with these Terms and all applicable laws.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">4. User Accounts</h3>
            <p>To access certain features, you may be required to create an account. You are responsible for maintaining the security of your account, keeping your login credentials confidential, and all activities that occur under your account. We reserve the right to suspend or terminate accounts that violate these Terms.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">5. Public Profiles</h3>
            <p>The Platform allows users to create public player profiles. Information you choose to publish — including usernames, profile pictures, biographies, gaming statistics, ranks, roles, social links, and posts — may be visible to other users and visitors. You are solely responsible for any information you choose to make public.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">6. User Content</h3>
            <p>You retain ownership of the content you submit to the Platform. By posting content, you grant FinderQ.com a non-exclusive, worldwide, royalty-free license to display, store, reproduce, and distribute your content solely for the purpose of operating and promoting the Platform.</p>
            <p className="mt-2">You agree not to post content that is illegal, contains hate speech or harassment, promotes violence, contains malware, violates intellectual property rights, contains spam or misleading information, or contains sexually explicit material. We may remove content at our sole discretion.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">7. Community Conduct</h3>
            <p>Users must behave respectfully toward other members. The following activities are prohibited: harassment, bullying, or discrimination; threats or abusive behavior; impersonating another person; fraudulent activity; posting false or misleading information; attempting to gain unauthorized access; using automated tools to abuse the Platform; circumventing bans or moderation actions.</p>
            <p className="mt-2">Violations may result in warnings, content removal, account suspension, or permanent bans.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">8. Subscriptions and Premium Features</h3>
            <p>Certain features may require a paid subscription. Subscription benefits, pricing, and availability may change over time. By purchasing a subscription, you agree to the pricing displayed at the time of purchase. Subscriptions remain active until they expire or are cancelled by the user. Premium benefits are available only while the subscription is active.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">9. Payments</h3>
            <p>Payments are processed through third-party payment providers. We do not store complete payment card information. You agree to provide accurate billing information and authorize the processing of payments associated with your account.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">10. Refund Policy</h3>
            <p>Unless required by applicable law, subscription payments are generally non-refundable. Refund requests may be reviewed on a case-by-case basis. Abuse of refund requests may result in account restrictions.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">11. Account Termination</h3>
            <p>You may delete your account at any time through your account settings or by contacting support. We may suspend or terminate accounts that violate these Terms, engage in abusive behavior, harm the Platform or its users, attempt to circumvent moderation or security measures, or provide false information during registration.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">12. Intellectual Property</h3>
            <p>All Platform branding, design, software, logos, trademarks, and original content are owned by FinderQ or its licensors. Users may not copy, distribute, modify, reverse engineer, or exploit any part of the Platform without permission.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">13. Availability of Service</h3>
            <p>We strive to keep the Platform available at all times. However, we do not guarantee continuous availability, error-free operation, uninterrupted access, or permanent storage of user content. The Platform may be modified, suspended, or discontinued at any time without prior notice.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">14. Disclaimer</h3>
            <p>The Platform is provided on an "as is" and "as available" basis. We make no warranties regarding accuracy of user-generated content, reliability of user information, availability of matches between players and teams, compatibility between users, or availability of premium features at all times. Users interact with one another at their own risk.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">15. Limitation of Liability</h3>
            <p>To the maximum extent permitted by law, FinderQ.com shall not be liable for indirect damages, loss of profits, loss of data, business interruption, damages arising from interactions between users, or unauthorized access to user accounts caused by user negligence. Our total liability shall not exceed the amount paid by the user for services during the previous twelve months.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">16. Changes to These Terms</h3>
            <p>We may update these Terms from time to time. Changes become effective when posted on the Platform. Continued use of the Platform after updates constitutes acceptance of the revised Terms.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">17. Governing Law</h3>
            <p>These Terms shall be governed and interpreted in accordance with the laws applicable in the jurisdiction where FinderQ operates, without regard to conflict of law principles.</p>
          </section>

          <section>
            <h3 className="text-white font-semibold mb-2">18. Contact Information</h3>
            <p>Email: <span className="text-[#00d4ff]">FinderQ@yahoo.com</span></p>
            <p>Website: <span className="text-[#00d4ff]">FinderQ.com</span></p>
          </section>
        </div>
      </div>
    </div>
  );
}
