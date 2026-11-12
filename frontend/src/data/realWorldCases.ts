import { IncidentCategory } from "../types/response";

export interface RealWorldFraudCase {
  id: string;
  headline: string;
  city: string;
  state: string;
  incidentMonthYear: string;
  scamCategory: string;
  categoryCode: IncidentCategory;
  reportedLoss: string;
  numericLoss?: number;
  summary: string;
  modusOperandi: string[];
  warningSigns: string[];
  preventionInsight: string;
  verisightRelevance: {
    forensicLayer: string;
    examination: string;
    userGuidance: string;
    responseFeature: string;
  };
  publisher: string;
  sourceUrl: string;
  sourceDate: string;
  mapCoordinates: { x: number; y: number }; // Percentage position on India map (0-100%)
  illustrationType: "digital-arrest" | "ipo-forgery" | "fake-gpay" | "reverse-qr" | "marketplace" | "soundbox" | "double-debit";
  accentColor: string;
}

export const REAL_WORLD_CASES: RealWorldFraudCase[] = [
  {
    id: "case-bengaluru-digital-arrest",
    headline: "Bengaluru Tech Executive Duped of ₹2.24 Crore in 8-Day 'Digital Arrest' via Forged Police & RBI Clearance Receipts",
    city: "Bengaluru",
    state: "Karnataka",
    incidentMonthYear: "October 2024",
    scamCategory: "Digital Impersonation & Forged Documents",
    categoryCode: "IMPERSONATION",
    reportedLoss: "₹2.24 crore",
    numericLoss: 22400000,
    summary:
      "A 44-year-old software executive was coerced into an 8-day Skype 'digital arrest' by cybercriminals posing as Mumbai Police and CBI officers. The fraudsters presented doctored Supreme Court arrest warrants and forged RBI financial clearance receipts to intimidate the victim into transferring his entire life savings across multiple mule accounts.",
    modusOperandi: [
      "Victim received an IVR call falsely alleging a courier parcel containing narcotics had been intercepted in his name.",
      "The call was transferred to video via Skype, featuring fraudsters in police uniforms against an official-looking police station backdrop.",
      "Fraudsters transmitted doctored documents bearing forged seals of the Supreme Court, CBI, and RBI Financial Intelligence Unit.",
      "Victim was coerced into liquidating mutual funds, FDs, and bank balances into 'government escrow accounts' for anti-money laundering verification."
    ],
    warningSigns: [
      "Demands to maintain unbroken video surveillance under threat of immediate physical arrest.",
      "Transmission of legal warrants or financial clearance certificates via WhatsApp, Telegram, or Skype.",
      "Instructions to transfer personal savings into third-party 'escrow' accounts for verification."
    ],
    preventionInsight:
      "No judicial authority, CBI officer, or police department in India conducts 'digital arrests' or requests money transfers for criminal verification over video calls. Hang up immediately and dial 1930.",
    verisightRelevance: {
      forensicLayer: "Layer 3: Typographic Laser Baseline & Stamp Compression Forensics",
      examination:
        "Multi-scale ELA and OCR baseline alignment reveal that the official seals, signatures, and case numbers were digitally spliced onto template documents at differing JPEG compression levels.",
      userGuidance:
        "Treat digital badges and clearance screenshots transmitted via messaging apps as unverified until independently confirmed with local law enforcement.",
      responseFeature:
        "Emergency 1930 CFCFRMS Golden-Hour freeze notification and Section 94 BNSS statutory documentation for beneficiary bank accounts."
    },
    publisher: "Deccan Herald & The Hindu",
    sourceUrl: "https://www.thehindu.com/news/cities/bangalore/bengaluru-techie-loses-224-crore-in-eight-day-digital-arrest/article68804245.ece",
    sourceDate: "October 24, 2024",
    mapCoordinates: { x: 44, y: 73 },
    illustrationType: "digital-arrest",
    accentColor: "#ef4444",
  },
  {
    id: "case-pune-ipo-forgery",
    headline: "Pune Senior Citizen Defrauded of ₹6.80 Crore in Fake Institutional IPO Allotment with Forged Banking Vouchers",
    city: "Pune",
    state: "Maharashtra",
    incidentMonthYear: "November 2024",
    scamCategory: "Forged Institutional Vouchers & Investment Fraud",
    categoryCode: "PAYMENT_FRAUD",
    reportedLoss: "₹6.80 crore",
    numericLoss: 68000000,
    summary:
      "A retired corporate engineer in Pune lost ₹6.80 crore over three months after being added to an exclusive WhatsApp trading group. Fraudsters provided manipulated bank deposit receipts, fake SEBI allotment vouchers, and fabricated trading dashboards displaying multi-crore returns, then demanded exorbitant 'statutory clearance fees' when he attempted withdrawal.",
    modusOperandi: [
      "Victim was added to an elite investment advisory group purportedly managed by a recognized institutional asset management firm.",
      "The syndicate shared doctored institutional allotment letters and manipulated banking transaction receipts showing large-scale equity purchases.",
      "Victim deposited funds into 14 distinct mule current accounts, with fraudsters sending back falsified bank acknowledgement vouchers.",
      "When the victim attempted to withdraw his balance, fraudsters demanded an additional 20% in 'capital gains tax' before freezing communication."
    ],
    warningSigns: [
      "Promises of guaranteed 500%+ returns and exclusive institutional pre-IPO share allocations via WhatsApp.",
      "Payment instructions requiring transfers into commercial mule accounts rather than official SEBI-registered ASBA facilities.",
      "Presentation of high-contrast bank vouchers with missing or non-standard 12-digit UTR sequences."
    ],
    preventionInsight:
      "All legitimate IPO and equity applications in India are strictly processed via SEBI-mandated ASBA (Application Supported by Blocked Amount) within your own bank. Never transfer funds to third-party accounts for stock allocations.",
    verisightRelevance: {
      forensicLayer: "Layer 1: Error Level Analysis & Layer 2: Wavelet Residual Discontinuities",
      examination:
        "Exposes cloned transaction digits, artificial Gaussian smoothing around institutional logos, and mismatched quantization matrices on the fake banking vouchers.",
      userGuidance:
        "Examine banking voucher PDF/image metadata: authentic institutional receipts carry cryptographic timestamp signatures and genuine bank header hashes.",
      responseFeature:
        "Automated RBI CMS & Cyber Police formal complaint builder with chronological financial ledger breakdown across all 14 beneficiary accounts."
    },
    publisher: "The Indian Express & Times of India",
    sourceUrl: "https://indianexpress.com/article/cities/pune/pune-cyber-crime-senior-citizen-cheated-of-over-rs-6-80-crore-in-online-share-trading-fraud-9669528/",
    sourceDate: "November 14, 2024",
    mapCoordinates: { x: 36, y: 58 },
    illustrationType: "ipo-forgery",
    accentColor: "#f59e0b",
  },
  {
    id: "case-delhi-fake-gpay",
    headline: "Delhi Electronics Retailer Duped of ₹95,250 Using Counterfeit Google Pay APK with Spliced Amount Font",
    city: "New Delhi",
    state: "Delhi NCR",
    incidentMonthYear: "January 2024",
    scamCategory: "Manipulated Payment Screenshot & Fake APK",
    categoryCode: "FAKE_PAYMENT_SCREENSHOT",
    reportedLoss: "₹95,250",
    numericLoss: 95250,
    summary:
      "A Karol Bagh electronics merchant handed over two premium smartphones after a customer displayed an animated payment confirmation screen on his device for ₹95,250 complete with official Google Pay branding and a 12-digit UTR. The merchant discovered the payment never arrived, and the buyer had utilized a counterfeit generator APK with spliced font parameters.",
    modusOperandi: [
      "Buyer selected two high-value phones and scanned the shopkeeper's merchant QR code.",
      "Instead of paying through official UPI apps, the fraudster opened a counterfeit generator APK ('Spoof Pay / Fake Pay').",
      "The app rendered a pixel-perfect payment success animation matching the merchant's exact VPA with simulated audio chime.",
      "The fraudster displayed the screen for 5 seconds and rushed out, claiming network latency was delaying the merchant's bank SMS."
    ],
    warningSigns: [
      "Customer insisting on immediate handover of goods based on their own smartphone display without waiting for the merchant soundbox.",
      "Inconsistent font baseline alignment and non-native kerning on the amount text (e.g. ₹95,250).",
      "Device clock in the screenshot header conflicting with the stated transaction timestamp."
    ],
    preventionInsight:
      "Never release goods based on a customer's phone display. Always verify receipt of funds via your own merchant soundbox, SMS credit alert, or direct merchant portal login.",
    verisightRelevance: {
      forensicLayer: "Layer 3: Sub-Pixel Laser Drift & Layer 4: Calibrated GBDT Risk Scoring",
      examination:
        "Detects a +3.8px vertical baseline drop on modified numbers and high-pass wavelet voids where synthetic text was rendered over clean background canvas.",
      userGuidance:
        "Instantly inspect suspicious screenshots: genuine receipts exhibit uniform camera/device sensor noise that synthetic APK generators cannot replicate.",
      responseFeature:
        "One-click Section 94 BNSS statutory summons notice ready to serve on the mobile network provider and IMEI tracking division."
    },
    publisher: "NDTV & Delhi Police Cyber Cell",
    sourceUrl: "https://www.ndtv.com/delhi-news/delhi-shopkeeper-duped-of-thousands-using-fake-payment-app-how-scam-works-4890212",
    sourceDate: "January 19, 2024",
    mapCoordinates: { x: 42, y: 28 },
    illustrationType: "fake-gpay",
    accentColor: "#38bdf8",
  },
  {
    id: "case-hyderabad-reverse-qr",
    headline: "Hyderabad Merchant Loses ₹42,000 After Scanning 'Payment Receive' QR Code Sent on WhatsApp",
    city: "Hyderabad",
    state: "Telangana",
    incidentMonthYear: "March 2024",
    scamCategory: "QR Code 'Scan to Receive' & Collect Request Trap",
    categoryCode: "QR_CODE_FRAUD",
    reportedLoss: "₹42,000",
    numericLoss: 42000,
    summary:
      "A boutique clothing designer in Jubilee Hills received a bulk order over WhatsApp. The buyer claimed corporate protocol required the merchant to scan a customized 'Instant Credit QR' to receive the ₹42,000 advance. Upon scanning the QR in her UPI app and inputting her PIN, ₹42,000 was debited from her account instead of credited.",
    modusOperandi: [
      "Fraudster initiated contact via WhatsApp professing to buy corporate gifting apparel in bulk.",
      "Sent a doctored payment authorization QR code claiming: 'Scan this code to receive advance payment of ₹42,000 into your linked account.'",
      "The QR was encoded as an outgoing UPI collect request rather than a payment address.",
      "When the victim scanned the code, the UPI app displayed an authorization prompt which the merchant approved with her UPI PIN."
    ],
    warningSigns: [
      "Any statement or instruction claiming that entering your UPI PIN is necessary to receive or accept funds.",
      "QR codes received via chat with labels like 'Scan to Credit' or 'Cashback Receive Authorization'.",
      "UPI authorization prompts stating 'Pay' or 'Deduct' when you expect to receive money."
    ],
    preventionInsight:
      "A UPI PIN is used EXCLUSIVELY to debit money from your account. Receiving money via UPI or QR code never requires entering a PIN under any circumstance.",
    verisightRelevance: {
      forensicLayer: "Layer 4: Protocol Semantic Consistency & Response Triage",
      examination:
        "Identifies malicious collect request payloads encoded inside innocent-looking promotional QR codes and highlights unauthorized debit protocols.",
      userGuidance:
        "Immediately distinguish between UPI Pay and Collect protocols. VeriSight Response provides clear, step-by-step visual guidance.",
      responseFeature:
        "Direct UPI reversal complaint generation for NPCI Dispute Resolution Mechanism (DRM) and bank grievance ombudsman escalation."
    },
    publisher: "The Hindu & Cyberabad Police",
    sourceUrl: "https://www.thehindu.com/news/cities/Hyderabad/cyber-fraudsters-dupe-city-resident-of-money-using-qr-code/article67954120.ece",
    sourceDate: "March 15, 2024",
    mapCoordinates: { x: 46, y: 56 },
    illustrationType: "reverse-qr",
    accentColor: "#a855f7",
  },
  {
    id: "case-mumbai-olx-military",
    headline: "Mumbai Resident Cheated of ₹1.15 Lakh by Impersonator Posing as Army Subedar with Forged ID & Transfer Slips",
    city: "Mumbai",
    state: "Maharashtra",
    incidentMonthYear: "July 2024",
    scamCategory: "Marketplace Fraud & Armed Forces Impersonation",
    categoryCode: "ONLINE_MARKETPLACE_FRAUD",
    reportedLoss: "₹1,15,000",
    numericLoss: 115000,
    summary:
      "A Mumbai resident selling home furniture on OLX was contacted by a fraudster claiming to be an Indian Army Subedar posted at the cantonment. The scammer sent forged military identity cards and fabricated NEFT bank transfer screenshots, tricking the seller into paying 'military cargo clearance' and 'gate pass verification' fees totaling ₹1.15 lakh.",
    modusOperandi: [
      "Scammer contacted seller immediately after the listing went live, agreeing to purchase items without price negotiation.",
      "Shared stolen and doctored photographs of an Army Canteen Card, Aadhaar, and military unit identification to foster credibility.",
      "Sent manipulated payment receipts showing funds had supposedly been sent via 'Army Welfare Fund Transfer'.",
      "Claimed that military transactions require the seller to send a matching deposit via UPI to verify civilian account compatibility."
    ],
    warningSigns: [
      "Buyers overly eager to prove their defense identity by immediately sending military cards without being asked.",
      "Refusal to meet in person or inspect goods physically prior to purchase.",
      "Demands for refundable 'registration fees' or 'verification charges' before payment can clear."
    ],
    preventionInsight:
      "Defense personnel utilize standard civilian retail banking accounts. There is no such requirement as an 'Army verification deposit' or 'defense transaction authorization fee'.",
    verisightRelevance: {
      forensicLayer: "Layer 1: Multi-Spectral ELA & Layer 2: Copy-Move Feature Clustering",
      examination:
        "Pinpoints pasted headshots on military ID credentials with boundary quantization anomalies and reveals cloned text blocks on bank transfer receipts.",
      userGuidance:
        "Check image compression boundaries before accepting identification documents sent over social media or marketplace chats.",
      responseFeature:
        "Comprehensive formal cybercrime complaint draft with attached forensic dossier and OLX platform grievance takedown escalation."
    },
    publisher: "Free Press Journal & Mumbai Cyber Crime",
    sourceUrl: "https://www.freepressjournal.in/mumbai/mumbai-cyber-crime-man-cheated-of-115-lakh-by-fake-army-officer-on-olx",
    sourceDate: "July 08, 2024",
    mapCoordinates: { x: 32, y: 54 },
    illustrationType: "marketplace",
    accentColor: "#10b981",
  },
  {
    id: "case-jaipur-fake-soundbox",
    headline: "Jaipur Wholesaler Defrauded of ₹3.50 Lakh via Muted Soundbox & Counterfeit Audio Confirmation",
    city: "Jaipur",
    state: "Rajasthan",
    incidentMonthYear: "February 2024",
    scamCategory: "Fabricated Merchant Audio Alert & Spliced Receipt",
    categoryCode: "PAYMENT_FRAUD",
    reportedLoss: "₹3,50,000",
    numericLoss: 350000,
    summary:
      "A fabric wholesaler in Jaipur was targeted during rush hours when repeat buyers displayed counterfeit payment screenshots for ₹3.50 lakh of high-end silk. The perpetrators discreetly synchronized a hidden Bluetooth speaker mimicking the voice chime of an official Paytm Soundbox, convincing the cashier the funds had settled before walking away with stock.",
    modusOperandi: [
      "Perpetrators operated during crowded evening trading hours when the store experienced high counter volume.",
      "One accomplice positioned a small portable Bluetooth speaker near the store's soundbox while another initiated a bogus transfer.",
      "Fraudster played an authentic-sounding audio file announcing: 'Paytm par teen lakh pachas hazar rupaye prapt hue.'",
      "Presented a doctored mobile receipt showing identical timestamp and retailer business name."
    ],
    warningSigns: [
      "Audio alert does not correlate with a new transaction logged in the official merchant application on the shopkeeper's phone.",
      "Transaction UTR number is either missing or contains fewer than 12 digits.",
      "Buyer creating intentional distractions during peak trading hours to bypass verification."
    ],
    preventionInsight:
      "Never rely exclusively on audio announcements in noisy environments. Reconcile high-value transactions against real-time banking settlement records or direct merchant console logs.",
    verisightRelevance: {
      forensicLayer: "Layer 3: Typographic Kerning & Viewport Aspect Ratio Inspection",
      examination:
        "Highlights cropped viewport coordinates (non-native screen dimensions) and irregular font kerning in the transaction confirmation banner.",
      userGuidance:
        "Examine the 12-digit UTR: genuine banking UTRs follow strict alphanumeric format and checksum standards.",
      responseFeature:
        "Section 94 BNSS statutory summons generation and cyber cell evidence preservation package."
    },
    publisher: "Dainik Bhaskar & Rajasthan Cyber Police",
    sourceUrl: "https://www.bhaskar.com/local/rajasthan/jaipur/news/fake-payment-app-sound-box-fraud-jaipur-police-investigation-132649021.html",
    sourceDate: "February 28, 2024",
    mapCoordinates: { x: 38, y: 34 },
    illustrationType: "soundbox",
    accentColor: "#f97316",
  },
  {
    id: "case-chennai-double-debit",
    headline: "Chennai Professional Siphoned of ₹18,500 in 'Failed Transaction Refund' Phishing with Altered Error Screen",
    city: "Chennai",
    state: "Tamil Nadu",
    incidentMonthYear: "August 2024",
    scamCategory: "Manipulated Payment Declined Screen & Phishing Trap",
    categoryCode: "PHISHING_SOCIAL_ENGINEERING",
    reportedLoss: "₹18,500",
    numericLoss: 18500,
    summary:
      "Following a failed food delivery payment of ₹450, a Chennai IT consultant sought assistance online and dialed a spoofed customer care number from Google Maps. The cybercriminal sent an altered 'Payment Declined' screenshot via WhatsApp with an embedded reverse-link, draining ₹18,500 through an unauthorized remote debit.",
    modusOperandi: [
      "Victim encountered a legitimate transaction error and searched online for customer support contact information.",
      "Called a fraudulently indexed mobile number appearing on search engine business listings.",
      "Fraudster sent an altered screenshot showing 'Transaction Failed — Tap to Claim Instant Refund' with a spoofed bank link.",
      "Victim tapped the link and entered net banking credentials, allowing fraudsters to execute unauthorized debits."
    ],
    warningSigns: [
      "Customer helpline phone numbers displayed as personal 10-digit mobile numbers (+91-9... or +91-7...).",
      "Customer support representatives asking users to download third-party APKs or tap external WhatsApp links for refunds.",
      "Screenshots of error messages sent from external phone numbers containing embedded URLs."
    ],
    preventionInsight:
      "Commercial banks and payment apps never maintain customer service over direct WhatsApp chats or personal mobile numbers. Dispute all failed transactions strictly through in-app resolution tabs.",
    verisightRelevance: {
      forensicLayer: "Voice Reporting Assistant & NLU Entity Extraction",
      examination:
        "Speech AI accurately parses the user's spoken narrative, extracts the UTR, bank name, and fake support phone number, and alerts the user to 1930 golden-hour freezing.",
      userGuidance:
        "Document the call logs, SMS headers, and fake screenshot. Preserve raw digital evidence without forwarding through compression channels.",
      responseFeature:
        "Formal Cybercrime 1930 incident report and RBI Integrated Ombudsman complaint PDF ready for immediate export."
    },
    publisher: "The New Indian Express",
    sourceUrl: "https://www.newindianexpress.com/cities/chennai/2024/Aug/14/chennai-techie-loses-money-after-calling-fake-customer-care-number-2735128.html",
    sourceDate: "August 14, 2024",
    mapCoordinates: { x: 48, y: 74 },
    illustrationType: "double-debit",
    accentColor: "#06b6d4",
  },
];
