"""
VeriSight Syndicate Intelligence & Law Enforcement Requisition Module
Inspired by ScamShield AI (Public Safety Intelligence & Section 91 Subpoena Generation)

Extracts payment entities (VPA, Payee, UTR, Amount), evaluates syndicate risk clusters,
and automatically drafts official Section 91 CrPC (Section 94 BNSS) cyber-cell requisitions.
"""
from __future__ import annotations

import re
from typing import Any


def _token_str(t: Any) -> str:
    if hasattr(t, "text"):
        return str(t.text or "")
    if isinstance(t, dict):
        return str(t.get("text", "") or "")
    return ""


def extract_financial_entities(
    tokens: list[Any],
    qr_details: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """
    Extracts financial transaction entities:
    - Beneficiary VPA (UPI handle)
    - Payee Name
    - UPI Reference ID / UTR
    - Transacted Amount (INR)
    - Timestamp
    """
    all_text = " ".join(_token_str(t) for t in tokens)
    
    # 1. UPI VPA Extraction
    vpa_pattern = r"([a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64})"
    vpa_matches = re.findall(vpa_pattern, all_text)
    
    # Also check QR decoded payload for VPA if present
    qr_vpa = None
    qr_payee = None
    qr_amount = None
    if qr_details and "results" in qr_details:
        for item in qr_details.get("results", []):
            if item.get("kind") == "UPI_PAYMENT_INTENT":
                qr_vpa = item.get("payee_vpa")
                qr_payee = item.get("payee_name")
                qr_amount = item.get("amount")
                break

    primary_vpa = qr_vpa or (vpa_matches[0] if vpa_matches else None)

    # 2. UTR / Reference Number Extraction (typically 12 digits for authentic UPI)
    utr_pattern = r"(?:UPI Ref|Ref No|UTR|Txn ID|Transaction ID)[:\s]*([0-9]{8,16})"
    utr_match = re.search(utr_pattern, all_text, re.IGNORECASE)
    utr_value = utr_match.group(1) if utr_match else None

    # Fallback search for isolated 10-12 digit numbers if not found
    if not utr_value:
        digit_runs = re.findall(r"\b([0-9]{10,12})\b", all_text)
        if digit_runs:
            utr_value = digit_runs[0]

    # 3. Transacted Amount Extraction (e.g. ₹95,250.00 or Rs. 1,250)
    amount_pattern = r"(?:[₹RrsRs\.]\s*)([0-9]{1,3}(?:,[0-9]{2,3})*(?:\.[0-9]{2})?)"
    amount_match = re.search(amount_pattern, all_text)
    amount_str = amount_match.group(1) if amount_match else qr_amount

    # 4. Payee Name Extraction (heuristics)
    payee_name = qr_payee
    if not payee_name:
        to_pattern = r"(?:Paid to|To|Transfer to)\s+([A-Za-z\s]{3,30})"
        name_match = re.search(to_pattern, all_text, re.IGNORECASE)
        if name_match:
            payee_name = name_match.group(1).strip()

    return {
        "payee_vpa": primary_vpa,
        "payee_name": payee_name or "Not Specified / Extracted",
        "utr_number": utr_value,
        "amount": amount_str or "Unknown",
        "qr_linked": bool(qr_vpa),
        "qr_intent": {
            "vpa": qr_vpa,
            "payee": qr_payee,
            "amount": qr_amount,
        } if qr_vpa else None,
    }


def evaluate_syndicate_threat(
    entities: dict[str, Any],
    tamper_score: float,
    verdict: str,
    clock_paradox: bool = False,
    is_whatsapp_laundered: bool = False,
) -> dict[str, Any]:
    """
    Evaluates whether the artifact exhibits patterns of organized cybercrime syndicates
    (e.g., automated fake APK generator templates, spoof banking receipts, laundering vectors).
    """
    threat_indicators: list[str] = []
    syndicate_risk_level = "LOW"

    # Known fake generator patterns
    utr = entities.get("utr_number")
    if utr and len(utr) != 12:
        threat_indicators.append(
            f"Non-compliant {len(utr)}-digit UPI Reference sequence (indicative of standard Android Spoof-APK generators)"
        )

    if clock_paradox:
        threat_indicators.append(
            "Temporal state drift: status-bar clock conflicts with receipt completion timestamp (template splicing pattern)"
        )

    if is_whatsapp_laundered:
        threat_indicators.append(
            "WhatsApp channel scrubbing: EXIF and compression headers systematically stripped before transmission"
        )

    if tamper_score >= 70.0 or verdict == "CORROBORATED_ANOMALIES":
        threat_indicators.append(
            "Multi-layer corroborated manipulation: localized subpixel drift and pixel-level residual anomalies"
        )

    # Risk Level Determination
    if len(threat_indicators) >= 2 or tamper_score >= 80.0:
        syndicate_risk_level = "CRITICAL_SYNDICATE_THREAT"
    elif len(threat_indicators) == 1 or tamper_score >= 40.0:
        syndicate_risk_level = "MODERATE_REVIEW_REQUIRED"

    return {
        "syndicate_risk_level": syndicate_risk_level,
        "threat_indicators": threat_indicators,
        "entity_summary": entities,
        "recommended_action": (
            "Escalate to Cyber Crime Portal (1930) and issue Section 91 statutory account freeze notice."
            if syndicate_risk_level == "CRITICAL_SYNDICATE_THREAT"
            else "Standard operational review."
        ),
    }


def generate_section91_subpoena(
    report_sha256: str,
    filename: str,
    timestamp: str,
    entities: dict[str, Any],
    tamper_score: float,
    verdict: str,
    findings: list[dict[str, Any]],
) -> str:
    """
    Drafts an official Statutory Requisition Notice under Section 91 Cr.P.C.
    (Section 94 of Bharatiya Nagarik Suraksha Sanhita - BNSS) ready for
    Law Enforcement Officers / Cyber Cells / Bank Nodal Officers.
    """
    vpa = entities.get("payee_vpa") or "N/A (Identified from Pixel Geometry)"
    utr = entities.get("utr_number") or "N/A (Spoofed / Spliced)"
    amt = entities.get("amount") or "N/A"
    payee = entities.get("payee_name") or "Unknown Subject"

    findings_summary = "\n".join(
        f"  - [{f.get('severity', 'WARN')}] Layer {f.get('layer', '?')}: {f.get('title', '')} ({f.get('description', '')})"
        for f in findings[:6]
    )

    notice = f"""================================================================================
REQUISITION UNDER SECTION 91 Cr.P.C. / SECTION 94 BNSS (2023)
CENTRAL CYBER CRIME INVESTIGATION & EVIDENCE PRESERVATION NOTICE
================================================================================

TO:
    The Nodal Cyber Officer / Authorized Grievance Officer,
    Payment Aggregator / Issuing Bank / Unified Payments Interface (NPCI),
    Sub: Emergency Digital Evidence Preservation & Transaction Verification

CASE IDENTIFIERS:
    Forensic Case Ref     : VERISIGHT-{report_sha256[:12].upper()}
    Evidence File         : {filename}
    Cryptographic SHA-256 : {report_sha256}
    Incident Timestamp    : {timestamp}

TARGET ENTITY IDENTIFIERS EXTRACTED FROM DIGITAL EVIDENCE:
    Beneficiary VPA / UPI : {vpa}
    Reported Payee Name   : {payee}
    Extracted UTR / Txn   : {utr}
    Claimed Amount        : INR {amt}

FORENSIC EXAMINATION SUMMARY (VERISIGHT PLATFORM):
    Overall Tamper Score  : {tamper_score}/100
    Primary Verdict       : {verdict}
    Key Forensic Findings :
{findings_summary}

STATUTORY PRESERVATION DIRECTIVES:
    1. Immediately freeze and preserve all server-side transaction logs, session IP addresses,
       and device identifiers (IMEI, MAC, User-Agent) linked to UTR: {utr} and VPA: {vpa}.
    2. Ascertain whether any legitimate interbank credit occurred under the stated UTR or if
       the image constitutes an altered/fictitious credit presentation.
    3. Furnish beneficiary KYC documentation (Aadhaar/PAN/Bank A/c details) within 24 hours
       pursuant to statutory cybercrime intelligence protocols (National Cyber Crime Portal 1930).

ISSUING AUTHORITY / COMPLIANCE OFFICER:
    VeriSight Automated Cyber-Forensics & Digital Public Safety Intelligence Unit
    Verified Evidence Hash: sha256:{report_sha256}
================================================================================
"""
    return notice
