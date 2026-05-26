/**
 * Customer-portal mock data. The shape mirrors the public-customer view of
 * the API (a subset of what agents see — no internal notes, no SLA timers,
 * no internal tags).
 */

export type CustomerTicketStatus =
  | 'submitted'
  | 'in_progress'
  | 'waiting_on_you'
  | 'resolved'
  | 'closed';

export interface PortalPerson {
  name: string;
  role: 'You' | 'Agent' | 'Automated';
  avatarHint: string;
}

export interface PortalMessage {
  id: string;
  author: PortalPerson;
  body: string;
  createdAt: string;
}

export interface PortalTicket {
  id: string;
  number: string;
  subject: string;
  description: string;
  status: CustomerTicketStatus;
  category: string;
  channel: 'email' | 'portal' | 'phone';
  createdAt: string;
  updatedAt: string;
  agentName?: string;
  expectedResolution?: string;
  resolvedAt?: string;
  attachments?: number;
  messages: PortalMessage[];
}

export interface KbArticle {
  slug: string;
  title: string;
  summary: string;
  category: string;
  body: string;
  views: number;
  updatedAt: string;
  helpfulPct: number;
}

export interface KbCategory {
  slug: string;
  label: string;
  description: string;
  icon: 'help' | 'shield' | 'mail' | 'monitor' | 'plug' | 'wallet';
  articleCount: number;
}

export interface PortalNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  type: 'ticket' | 'kb' | 'announcement';
  link?: string;
}

const ago = (mins: number) =>
  new Date(Date.now() - mins * 60 * 1000).toISOString();
const future = (mins: number) =>
  new Date(Date.now() + mins * 60 * 1000).toISOString();

export const CURRENT_CUSTOMER = {
  name: 'Sarah Okonkwo',
  email: 'sarah.o@acmebank.ng',
  phone: '+234 803 123 4567',
  jobTitle: 'Operations Manager',
  company: 'Acme Bank',
  joinedAt: '2024-08-12',
  preferredLanguage: 'English',
  timezone: 'Africa/Lagos',
};

export const TENANT = {
  name: 'ConsomoAfrica',
  shortName: 'Consomo',
  emoji: '🌍',
  supportEmail: 'support@consomoafrica.com',
  supportPhone: '+234 1 800 SUPPORT',
};

export const mockPortalTickets: PortalTicket[] = [
  {
    id: 't-1024',
    number: '#1024',
    subject: 'Cannot connect to office VPN from new laptop',
    description:
      'Hi team, my new MacBook cannot connect to the corporate VPN. I have tried reinstalling Cisco AnyConnect twice without success. The error reads "AnyConnect was unable to establish a connection to the specified secure gateway".',
    status: 'in_progress',
    category: 'Network / VPN',
    channel: 'email',
    createdAt: ago(42),
    updatedAt: ago(8),
    agentName: 'Tunde Bakare',
    expectedResolution: future(18),
    attachments: 1,
    messages: [
      {
        id: 'm1',
        author: { name: 'Sarah Okonkwo', role: 'You', avatarHint: 'SO' },
        body: 'Hi team, my new MacBook cannot connect to the VPN. Tried reinstalling Cisco AnyConnect twice.',
        createdAt: ago(42),
      },
      {
        id: 'm2',
        author: { name: 'Tunde Bakare', role: 'Agent', avatarHint: 'TB' },
        body: 'Hi Sarah, thanks for reporting this. I can see your laptop in our asset register. Could you share a screenshot of the exact error message you are seeing?',
        createdAt: ago(28),
      },
      {
        id: 'm3',
        author: { name: 'Sarah Okonkwo', role: 'You', avatarHint: 'SO' },
        body: 'Attached the screenshot. The error is "AnyConnect was unable to establish a connection to the specified secure gateway".',
        createdAt: ago(8),
      },
    ],
  },
  {
    id: 't-1019',
    number: '#1019',
    subject: 'Request: laptop for new joiner starting Monday',
    description: 'Please provision a MacBook Pro for John Adesanya, starting May 26.',
    status: 'submitted',
    category: 'Hardware Request',
    channel: 'portal',
    createdAt: ago(15),
    updatedAt: ago(15),
    expectedResolution: future(720),
    messages: [
      {
        id: 'm1',
        author: { name: 'Sarah Okonkwo', role: 'You', avatarHint: 'SO' },
        body: 'Please provision a MacBook Pro for John Adesanya, starting May 26.',
        createdAt: ago(15),
      },
    ],
  },
  {
    id: 't-1011',
    number: '#1011',
    subject: 'Phishing email reported by 14 staff this morning',
    description: 'Subject "URGENT — Payroll update". Blocked at gateway after first report.',
    status: 'in_progress',
    category: 'Security / Phishing',
    channel: 'email',
    createdAt: ago(150),
    updatedAt: ago(5),
    agentName: 'Fatima Suleiman',
    expectedResolution: future(30),
    messages: [
      {
        id: 'm1',
        author: { name: 'Sarah Okonkwo', role: 'You', avatarHint: 'SO' },
        body: 'Multiple staff reported a phishing email with subject "URGENT — Payroll update". Please investigate and block.',
        createdAt: ago(150),
      },
      {
        id: 'm2',
        author: { name: 'Automated', role: 'Automated', avatarHint: 'AI' },
        body: 'Ticket escalated to Security Ops based on category and keyword "phishing".',
        createdAt: ago(148),
      },
      {
        id: 'm3',
        author: { name: 'Fatima Suleiman', role: 'Agent', avatarHint: 'FS' },
        body: 'I have blocked the sender domain at the gateway and started a sweep for any internal recipients who clicked through. Will update within the hour.',
        createdAt: ago(5),
      },
    ],
  },
  {
    id: 't-987',
    number: '#987',
    subject: 'Need shared mailbox for accounts-payable team',
    description: 'Five users need send-as access on the accounts-payable shared mailbox.',
    status: 'waiting_on_you',
    category: 'Email',
    channel: 'portal',
    createdAt: ago(900),
    updatedAt: ago(400),
    agentName: 'Chinedu Okafor',
    expectedResolution: future(1200),
    messages: [
      {
        id: 'm1',
        author: { name: 'Sarah Okonkwo', role: 'You', avatarHint: 'SO' },
        body: 'Please grant 5 users send-as access on accounts-payable@.',
        createdAt: ago(900),
      },
      {
        id: 'm2',
        author: { name: 'Chinedu Okafor', role: 'Agent', avatarHint: 'CO' },
        body: 'Happy to set this up. Could you confirm the five email addresses, and which manager has approved this access?',
        createdAt: ago(400),
      },
    ],
  },
  {
    id: 't-902',
    number: '#902',
    subject: 'Slack notifications muted for #support channel',
    description: 'Could not un-mute. Tried web and desktop.',
    status: 'resolved',
    category: 'Software',
    channel: 'portal',
    createdAt: ago(2880),
    updatedAt: ago(2400),
    agentName: 'Chinedu Okafor',
    resolvedAt: ago(2400),
    messages: [
      {
        id: 'm1',
        author: { name: 'Sarah Okonkwo', role: 'You', avatarHint: 'SO' },
        body: 'Cannot un-mute the #support channel in Slack. Tried web and desktop.',
        createdAt: ago(2880),
      },
      {
        id: 'm2',
        author: { name: 'Chinedu Okafor', role: 'Agent', avatarHint: 'CO' },
        body: 'I reset your Slack notification preferences from the workspace admin. Please log out and back in.',
        createdAt: ago(2500),
      },
      {
        id: 'm3',
        author: { name: 'Sarah Okonkwo', role: 'You', avatarHint: 'SO' },
        body: 'That worked, thanks!',
        createdAt: ago(2400),
      },
    ],
  },
  {
    id: 't-815',
    number: '#815',
    subject: 'Door access card not working for floor 5',
    description: 'Card from lost-and-found rejected by reader.',
    status: 'closed',
    category: 'Security / Access',
    channel: 'phone',
    createdAt: ago(7200),
    updatedAt: ago(6500),
    agentName: 'Adaeze Nwosu',
    resolvedAt: ago(6800),
    messages: [
      {
        id: 'm1',
        author: { name: 'Sarah Okonkwo', role: 'You', avatarHint: 'SO' },
        body: 'My access card for floor 5 is being rejected.',
        createdAt: ago(7200),
      },
      {
        id: 'm2',
        author: { name: 'Adaeze Nwosu', role: 'Agent', avatarHint: 'AN' },
        body: 'I re-provisioned the card with floor 5 access. Please try again.',
        createdAt: ago(6800),
      },
    ],
  },
];

export const kbCategories: KbCategory[] = [
  {
    slug: 'getting-started',
    label: 'Getting started',
    description: 'Account setup, first login, basics',
    icon: 'help',
    articleCount: 12,
  },
  {
    slug: 'security',
    label: 'Security & MFA',
    description: 'Passwords, 2-factor, devices, phishing',
    icon: 'shield',
    articleCount: 18,
  },
  {
    slug: 'email',
    label: 'Email & calendars',
    description: 'Outlook, Gmail, shared mailboxes, signatures',
    icon: 'mail',
    articleCount: 24,
  },
  {
    slug: 'hardware',
    label: 'Laptops & devices',
    description: 'Provisioning, drivers, peripherals, returns',
    icon: 'monitor',
    articleCount: 31,
  },
  {
    slug: 'integrations',
    label: 'Apps & integrations',
    description: 'Slack, Zoom, Salesforce, single sign-on',
    icon: 'plug',
    articleCount: 22,
  },
  {
    slug: 'billing',
    label: 'Billing & expenses',
    description: 'Invoices, reimbursements, procurement',
    icon: 'wallet',
    articleCount: 9,
  },
];

export const kbArticles: KbArticle[] = [
  {
    slug: 'connect-to-the-corporate-vpn-on-macos',
    title: 'How to connect to the corporate VPN on macOS',
    summary:
      'Step-by-step setup for Cisco AnyConnect on a freshly imaged MacBook, including certificate provisioning and troubleshooting login failures.',
    category: 'security',
    body: `# Connect to the corporate VPN on macOS

Follow these steps to connect to the ConsomoAfrica corporate VPN from a
freshly imaged MacBook.

1. Install Cisco AnyConnect from the Self-Service portal.
2. Launch the app and enter \`vpn.consomoafrica.com\` as the gateway.
3. Sign in with your corporate email and password.
4. When prompted for the second factor, approve the push notification.

## Troubleshooting

If you see "AnyConnect was unable to establish a connection to the
specified secure gateway", your laptop's PKI certificate is most likely
missing. Open a ticket and our IT team will provision it.

## Related

- Reset your MFA device
- Switch your VPN region`,
    views: 4127,
    updatedAt: ago(60 * 24 * 3),
    helpfulPct: 92,
  },
  {
    slug: 'reset-your-multi-factor-authentication-device',
    title: 'Reset your multi-factor authentication device',
    summary:
      'What to do when you lose your MFA device or get a new phone. Includes backup codes and self-service reset flow.',
    category: 'security',
    body: 'Long-form article about MFA reset, with sections for "I lost my phone", "I got a new phone", and "I never set up MFA".',
    views: 3814,
    updatedAt: ago(60 * 24 * 6),
    helpfulPct: 88,
  },
  {
    slug: 'request-a-new-laptop',
    title: 'How to request a new laptop for a joiner',
    summary:
      'Pre-approved configurations, lead times, and what info to include when submitting a hardware request for a new starter.',
    category: 'hardware',
    body: 'Article body explaining the hardware request flow.',
    views: 2901,
    updatedAt: ago(60 * 24 * 9),
    helpfulPct: 95,
  },
  {
    slug: 'how-to-report-a-phishing-email',
    title: 'How to report a phishing email',
    summary:
      'Use the "Report Phishing" button in Outlook, or forward suspicious messages to phishing@consomoafrica.com.',
    category: 'security',
    body: 'Phishing reporting article.',
    views: 5210,
    updatedAt: ago(60 * 24 * 2),
    helpfulPct: 96,
  },
  {
    slug: 'set-up-a-shared-mailbox',
    title: 'Set up a shared mailbox for your team',
    summary:
      'Decide between a Microsoft 365 shared mailbox or a distribution list, and learn how to request send-as access.',
    category: 'email',
    body: 'Shared mailbox guide.',
    views: 1820,
    updatedAt: ago(60 * 24 * 14),
    helpfulPct: 84,
  },
  {
    slug: 'install-adobe-creative-cloud',
    title: 'Install Adobe Creative Cloud (licence required)',
    summary:
      'Adobe seats are managed centrally. Submit a request via the portal to be added to the licence pool before installing.',
    category: 'integrations',
    body: 'Adobe install guide.',
    views: 1402,
    updatedAt: ago(60 * 24 * 18),
    helpfulPct: 79,
  },
  {
    slug: 'request-reimbursement-for-tech-purchases',
    title: 'Request reimbursement for tech purchases',
    summary:
      'When and how to claim back personal spend on tech accessories, software, or co-working space.',
    category: 'billing',
    body: 'Reimbursement policy article.',
    views: 988,
    updatedAt: ago(60 * 24 * 21),
    helpfulPct: 81,
  },
  {
    slug: 'enable-single-sign-on-for-third-party-apps',
    title: 'Enable single sign-on for third-party apps',
    summary:
      'For app owners: how to connect a SaaS app to ConsomoAfrica SSO, including SAML and OIDC walkthroughs.',
    category: 'integrations',
    body: 'SSO article.',
    views: 743,
    updatedAt: ago(60 * 24 * 27),
    helpfulPct: 90,
  },
];

export const mockNotifications: PortalNotification[] = [
  {
    id: 'n1',
    title: 'Tunde replied to your ticket',
    body: '#1024 — Cannot connect to office VPN from new laptop',
    time: '14 min ago',
    unread: true,
    type: 'ticket',
    link: '/tickets/t-1024',
  },
  {
    id: 'n2',
    title: 'Ticket #987 is waiting on your reply',
    body: 'Chinedu needs the 5 email addresses to grant access.',
    time: '6 hours ago',
    unread: true,
    type: 'ticket',
    link: '/tickets/t-987',
  },
  {
    id: 'n3',
    title: 'Knowledge base updated',
    body: '"How to connect to the corporate VPN on macOS" was revised.',
    time: '2 days ago',
    unread: false,
    type: 'kb',
    link: '/kb/connect-to-the-corporate-vpn-on-macos',
  },
  {
    id: 'n4',
    title: 'Planned maintenance — Saturday 02:00 UTC',
    body: 'The customer portal will be unavailable for up to 30 minutes.',
    time: '3 days ago',
    unread: false,
    type: 'announcement',
  },
];
