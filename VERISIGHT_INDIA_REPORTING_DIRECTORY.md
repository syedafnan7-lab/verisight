# VERISIGHT VERIFIED INDIAN CYBERCRIME REPORTING DIRECTORY
**Statutory Directory, Submission Procedures & Escalation Timelines**  
**Module:** `app.services.response.reporting_directory` & `ReportingDirectoryView.tsx`  
**Current as of:** November 2026  

---

## 1. National Cyber Crime Reporting Portal (NCRP) & 1930 Helpline

- **Governing Body:** Ministry of Home Affairs (MHA), Indian Cyber Crime Coordination Centre (I4C).
- **Official Website:** [https://cybercrime.gov.in](https://cybercrime.gov.in)
- **Emergency Helpline:** **1930** (Toll-Free, 24x7 Across All Indian States & UTs).
- **Alternate Emergency:** **112** (National Emergency Support System).
- **Jurisdiction:** All India.
- **Applicable Offences:** Financial cyber fraud, unauthorized banking debits, digital impersonation, fake payment receipts, phishing, identity misuse.

### 1.1 The "Golden Hour" Protocol (CFCFRMS)
The **Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS)** enables instantaneous inter-bank lien marking:
1. When a victim dials **1930** within 2 to 4 hours of an unauthorized debit, an emergency dispatch ticket is created.
2. The system sends automated API alerts to the victim's issuing bank and the beneficiary bank (receiving entity).
3. If the funds have not yet been withdrawn from an ATM, the beneficiary account is put on debit freeze / lien.
4. After registering the 1930 call, the victim receives an SMS with an incident reference number and must log into `cybercrime.gov.in` within 24 hours to upload supporting evidence.

### 1.2 Required Evidence Checklist
- [x] 12-digit UPI Transaction ID (UTR) or Bank Reference Number (RRN).
- [x] Complainant's bank account number, IFSC code, and debit statement.
- [x] Screenshots of the fraudulent communication, fake receipts, or phishing links.
- [x] Suspect's phone number, UPI ID (VPA), or beneficiary bank details.
- [x] VeriSight Forensic Evidence Dossier (with SHA-256 integrity hash).

---

## 2. Bank Grievance Redressal & UPI Service Providers (PSP)

Under Reserve Bank of India (RBI) circular **DBR.No.Leg.BC.78/09.07.005/2017-18** (*"Customer Protection – Limiting Liability of Customers in Unauthorised Electronic Banking Transactions"*):

| Timeline of Reporting by Customer | Customer's Maximum Liability |
|---|---|
| Within **3 working days** (72 hours) | **Zero Liability** (Bank must reverse within 10 working days). |
| Within **4 to 7 working days** | Limited to transaction value or ₹5,000–₹25,000 (depending on account type). |
| Beyond **7 working days** | As per the individual bank's approved Board policy. |

### 2.1 Major Bank & PSP Verified Cyber Desks
- **Google Pay Customer Support:** `1800-419-0157`
- **PhonePe Fraud Helpline:** `080-68727374` / `022-68727374`
- **Paytm Cyber Fraud Desk:** `0120-3888388`
- **BHIM UPI Toll-Free:** `1800-120-1740`
- **State Bank of India (SBI) Cyber Helpline:** `1800-11-1109` / `1930`
- **HDFC Bank 24x7 Fraud Desk:** `1800-202-6161`
- **ICICI Bank Emergency Help:** `1800-1080`
- **Axis Bank Emergency Helpline:** `1800-419-5577`
- **NPCI Dispute Redressal Mechanism:** [https://www.npci.org.in/what-we-do/upi/dispute-redressal-mechanism](https://www.npci.org.in/what-we-do/upi/dispute-redressal-mechanism)

### 2.2 Escalation Sequence
1. **Level 1:** In-App Dispute / Branch Grievance Cell (Request Docket Number).
2. **Level 2:** Principal Nodal Officer (PNO) of the Bank.
3. **Level 3:** RBI Banking Ombudsman via CMS (after 30 days of no resolution).

---

## 3. RBI Complaint Management System (CMS) — Banking Ombudsman

- **Governing Scheme:** Reserve Bank - Integrated Ombudsman Scheme, 2021 (RB-IOS, 2021).
- **Official Portal:** [https://cms.rbi.org.in](https://cms.rbi.org.in)
- **Toll-Free Helpline:** **14448** (Centralised Receipt and Processing Centre - CRPC, 9:30 AM – 5:15 PM).
- **Email:** `crpc@rbi.org.in`
- **Physical Address:** Centralised Receipt and Processing Centre (CRPC), Reserve Bank of India, 4th Floor, Sector 17, Chandigarh - 160017.

### 3.1 Statutory Prerequisites
1. **Mandatory 30-Day Waiting Period:** A complaint can only be lodged with the RBI Ombudsman if the complainant first lodged a written complaint with the regulated bank/entity and:
   - 30 calendar days have elapsed without resolution, OR
   - The bank rejected the complaint, OR
   - The complainant is not satisfied with the bank's resolution.
2. **Sub-Judice Restriction:** The complaint must not be pending before any consumer forum, high court, or civil tribunal.
3. **Compensation Limit:** The Ombudsman may award compensation up to ₹30 Lakhs for actual financial loss and up to ₹1 Lakh for mental anguish and harassment.

---

## 4. State Cyber Crime Police Stations & Zero FIR Guidelines

- **Governing Law:** Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 & Bharatiya Nyaya Sanhita (BNS), 2023.
- **Key Statutory Provisions:**
  - **Section 173(1) BNSS (formerly Zero FIR under Section 154 CrPC):** Police officers are legally mandated to register an FIR irrespective of territorial jurisdiction if a cognizable cyber offence is disclosed.
  - **Section 94 BNSS / Section 91 CrPC:** Investigating officers have statutory power to issue summons to payment gateways, telecom operators, and messaging platforms to produce IP logs, CDRs, and KYC records.
  - **Section 106 BNSS / Section 102 CrPC:** Power of police officers to seize or freeze bank accounts involved in cyber offenses.

### 4.1 Procedure at Police Station
1. Carry two printed copies of the formal complaint generated via the **VeriSight Complaint Builder**.
2. Attach the **VeriSight Forensic Risk Dossier** as Annexure with the SHA-256 hash.
3. Hand over the physical copies to the Station House Officer (SHO) or Cyber Crime Inspector.
4. Obtain a stamped receiving acknowledgement with the **General Diary (GD) entry number** or FIR number.

---

## 5. Platform-Specific Abuse & Impersonation Reporting

Under the **Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021**, major social media intermediaries must appoint an India-based Resident Grievance Officer and acknowledge complaints within 24 hours.

- **WhatsApp Grievance Officer:** `grievance_officer_wa@support.whatsapp.com`
- **Telegram Anti-Scam Bot:** `@notoscam` / `abuse@telegram.org`
- **OLX Safety & Trust Desk:** `support@olx.in` / `1800-103-3333`
- **Meta (Instagram & Facebook) India Grievance:** `grievance-officer-india@support.facebook.com`
- **Grievance Appellate Committee (GAC):** [https://gac.gov.in](https://gac.gov.in) (Appeals against intermediary decisions).

---

## 6. Official Legal Disclaimer

> **IMPORTANT NOTICE:**  
> VeriSight is an independent scientific forensics and evidence-preparation platform. VeriSight is **not** an agency of the Government of India, the Reserve Bank of India, the National Payments Corporation of India (NPCI), or state police commissionerates. Information provided in this directory is compiled from verified public regulatory circulars and official portals for citizen guidance. VeriSight does not guarantee fund recovery or direct case disposition.
