import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any

from app.services.response.models import (
    CaseRecord,
    CaseStatus,
    ExtractedIncidentDetails,
    FinancialImpact,
    IncidentCategory,
    TimelineEvent,
)

STORE_FILE = Path("data/response_cases.json")

# In-memory cache
_CASES_CACHE: dict[str, CaseRecord] = {}


def _init_demo_cases():
    if _CASES_CACHE:
        return

    now_iso = datetime.now().isoformat()
    # Sample Case 1: Spliced ₹95,250 UPI Screenshot
    c1 = CaseRecord(
        case_id="VS-CASE-9525-DELHI",
        created_at=now_iso,
        updated_at=now_iso,
        title="Spliced ₹95,250 UPI Payment Receipt (Buyer Scam)",
        category=IncidentCategory.FAKE_PAYMENT_SCREENSHOT,
        status=CaseStatus.READY_TO_SUBMIT,
        financial_loss=0.0,
        authority_destination="NATIONAL_CYBER_CRIME_PORTAL",
        acknowledgement_number=None,
        submission_date=None,
        follow_up_date=None,
        notes="Buyer showed fake Google Pay receipt for iPhone sale. Bank balance confirmed zero payment. Goods retained.",
        details=ExtractedIncidentDetails(
            incident_category=IncidentCategory.FAKE_PAYMENT_SCREENSHOT,
            incident_category_label="Fake Payment Screenshot / Spliced Receipt Allegation",
            financial_impact=FinancialImpact.NO_MONEY_LOST,
            incident_date=datetime.now().strftime("%Y-%m-%d"),
            approximate_time="11:30 AM",
            financial_loss_amount=95250.0,
            currency="INR",
            payment_method="UPI / Google Pay",
            bank_or_upi_provider="Google Pay",
            transaction_reference="403218942311",
            suspected_person_or_entity="Rohan Sharma (Buyer)",
            suspected_phone="9876543210",
            suspected_vpa="rohansharma@okhdfcbank",
            complainant_name="Aarav Mehta",
            complainant_contact="+91 99887 76655",
            communication_channel="WhatsApp",
            narrative_description="Buyer claimed to transfer ₹95,250 via Google Pay and showed a screenshot. I verified my bank app and found no credit.",
            available_evidence=["Digital Payment Screenshot", "WhatsApp Chat History", "VeriSight Forensic Screenshot Analysis"],
            is_ongoing=False,
            account_at_risk=False,
            confidence_score=0.96,
            urgent_guidance="Do not hand over goods. Preserve chat logs.",
            recommended_pathway="NATIONAL_CYBER_CRIME_PORTAL"
        ),
        timeline=[
            TimelineEvent(
                timestamp=now_iso,
                title="Forensic Workbench Investigation Completed",
                description="VeriSight detected 94.6% tamper probability with baseline laser drop and wavelet noise void.",
                actor="SYSTEM"
            ),
            TimelineEvent(
                timestamp=now_iso,
                title="Formal Complaint Draft Prepared",
                description="Structured formal complaint draft generated with forensic evidence attached.",
                actor="USER"
            )
        ]
    )

    # Sample Case 2: Financial Cyber Fraud ₹18,000 (1930 Ack Recorded)
    c2 = CaseRecord(
        case_id="VS-CASE-1800-BLR",
        created_at=now_iso,
        updated_at=now_iso,
        title="Unauthorized UPI Debit ₹18,000 (Electricity Bill Phishing)",
        category=IncidentCategory.UNAUTHORIZED_BANK_TRANSACTION,
        status=CaseStatus.ACKNOWLEDGEMENT_RECEIVED,
        financial_loss=18000.0,
        authority_destination="NATIONAL_CYBER_CRIME_PORTAL",
        acknowledgement_number="20261112009843",
        submission_date=datetime.now().strftime("%Y-%m-%d"),
        follow_up_date="2026-11-18",
        notes="Reported on 1930 within 45 minutes of debit. Investigating officer from Cyber Police Station assigned.",
        details=ExtractedIncidentDetails(
            incident_category=IncidentCategory.UNAUTHORIZED_BANK_TRANSACTION,
            incident_category_label="Unauthorized Bank / Account Debit",
            financial_impact=FinancialImpact.MONEY_LOST,
            incident_date=datetime.now().strftime("%Y-%m-%d"),
            approximate_time="09:15 AM",
            financial_loss_amount=18000.0,
            currency="INR",
            payment_method="UPI",
            bank_or_upi_provider="State Bank of India (SBI)",
            transaction_reference="431109823412",
            suspected_person_or_entity="Electricity Dept Impersonator",
            suspected_phone="8765432109",
            suspected_vpa="bescom.bill@icici",
            complainant_name="Sunita Rao",
            complainant_contact="+91 98450 12345",
            communication_channel="Phone Call",
            narrative_description="Received call regarding overdue electricity disconnection. Clicked link sent via SMS and entered UPI PIN. ₹18,000 debited.",
            available_evidence=["Bank Account Debit Statement", "SMS Screenshot", "Call Log"],
            is_ongoing=False,
            account_at_risk=True,
            confidence_score=0.92,
            urgent_guidance="UPI PIN changed immediately. 1930 dialed.",
            recommended_pathway="NATIONAL_CYBER_CRIME_PORTAL"
        ),
        timeline=[
            TimelineEvent(
                timestamp=now_iso,
                title="Unauthorized Debit Occurred",
                description="₹18,000 debited from SBI account via UPI.",
                actor="USER"
            ),
            TimelineEvent(
                timestamp=now_iso,
                title="1930 Emergency Helpline Contacted",
                description="Complainant reported incident within golden hour; CFCFRMS freeze ticket raised.",
                actor="USER"
            ),
            TimelineEvent(
                timestamp=now_iso,
                title="NCRP Acknowledgment Number Recorded",
                description="Acknowledgment #20261112009843 recorded in VeriSight case tracker.",
                actor="USER"
            )
        ]
    )

    _CASES_CACHE[c1.case_id] = c1
    _CASES_CACHE[c2.case_id] = c2


def list_cases() -> list[CaseRecord]:
    _init_demo_cases()
    return sorted(_CASES_CACHE.values(), key=lambda c: c.updated_at, reverse=True)


def get_case(case_id: str) -> CaseRecord | None:
    _init_demo_cases()
    return _CASES_CACHE.get(case_id)


def save_case(case: CaseRecord) -> CaseRecord:
    _init_demo_cases()
    case.updated_at = datetime.now().isoformat()
    _CASES_CACHE[case.case_id] = case
    return case


def create_case_from_details(
    details: ExtractedIncidentDetails,
    title: str | None = None,
    forensic_attachment: dict[str, Any] | None = None
) -> CaseRecord:
    _init_demo_cases()
    now_iso = datetime.now().isoformat()
    case_num = uuid.uuid4().hex[:6].upper()
    cid = f"VS-CASE-{case_num}"

    t = title or f"{details.incident_category_label} ({details.incident_date or 'Recent'})"
    record = CaseRecord(
        case_id=cid,
        created_at=now_iso,
        updated_at=now_iso,
        title=t,
        category=details.incident_category,
        status=CaseStatus.DRAFTING,
        financial_loss=details.financial_loss_amount or 0.0,
        authority_destination=details.recommended_pathway,
        acknowledgement_number=None,
        submission_date=None,
        follow_up_date=None,
        notes=None,
        details=details,
        complaint_draft=None,
        forensic_attachment=forensic_attachment,
        timeline=[
            TimelineEvent(
                timestamp=now_iso,
                title="Incident Response Case Opened",
                description=f"Case initialized in VeriSight Response & Guidance with classification '{details.incident_category_label}'.",
                actor="SYSTEM"
            )
        ]
    )
    if forensic_attachment:
        record.timeline.append(
            TimelineEvent(
                timestamp=now_iso,
                title="Forensic Evidence Linked",
                description=f"Attached evidence hash SHA-256 {forensic_attachment.get('file_sha256', '')[:12]}... (Risk Score: {forensic_attachment.get('overall_tamper_score', 0):.1f}%)",
                actor="SYSTEM"
            )
        )

    _CASES_CACHE[cid] = record
    return record
