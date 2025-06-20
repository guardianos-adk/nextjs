"use client";

import { useCallback } from "react";
import jsPDF from "jspdf";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExecutiveSummaryPDF() {
  const generatePDF = useCallback(() => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Set document properties
    pdf.setProperties({
      title: "GuardianOS Executive Summary",
      subject: "Institutional Blockchain Compliance Platform",
      author: "GuardianOS",
      keywords: "blockchain, compliance, privacy pools, guardian networks",
      creator: "GuardianOS Platform",
    });

    // Define colors
    const primaryBlue = "#2563eb"; // blue-600
    const darkGray = "#1f2937"; // gray-800
    const lightGray = "#6b7280"; // gray-500
    const accentGreen = "#10b981"; // emerald-500

    // Page margins
    const leftMargin = 20;
    const rightMargin = 20;
    const topMargin = 25;
    const pageWidth = 210;
    const contentWidth = pageWidth - leftMargin - rightMargin;

    // Add header with logo placeholder and title
    let yPosition = topMargin;

    // Logo area (assuming logo is 30x30mm)
    pdf.setFillColor(245, 247, 250); // gray-50
    pdf.rect(leftMargin, yPosition, 30, 30, "F");
    pdf.setTextColor(darkGray);
    pdf.setFontSize(10);
    pdf.text("GuardianOS", leftMargin + 15, yPosition + 17, { align: "center" });

    // Title
    pdf.setFontSize(24);
    pdf.setTextColor(darkGray);
    pdf.text("EXECUTIVE SUMMARY", leftMargin + 40, yPosition + 10);
    
    pdf.setFontSize(14);
    pdf.setTextColor(primaryBlue);
    pdf.text("Institutional Blockchain Compliance Platform", leftMargin + 40, yPosition + 20);

    pdf.setFontSize(10);
    pdf.setTextColor(lightGray);
    pdf.text("Implementing Privacy Pools with Guardian Consensus", leftMargin + 40, yPosition + 27);

    yPosition += 40;

    // Executive Overview Section
    pdf.setDrawColor(primaryBlue);
    pdf.setLineWidth(0.5);
    pdf.line(leftMargin, yPosition, pageWidth - rightMargin, yPosition);
    yPosition += 10;

    pdf.setFontSize(16);
    pdf.setTextColor(darkGray);
    pdf.text("Executive Overview", leftMargin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setTextColor(darkGray);
    const overviewText = `GuardianOS is an enterprise-grade compliance orchestration platform that enables institutions to leverage blockchain technology while maintaining full regulatory compliance. Built on Vitalik Buterin's Privacy Pools concept, the platform combines zero-knowledge cryptography with multi-party consensus to enable selective transaction disclosure only when legally required.`;
    
    const overviewLines = pdf.splitTextToSize(overviewText, contentWidth);
    pdf.text(overviewLines, leftMargin, yPosition);
    yPosition += overviewLines.length * 5 + 10;

    // Key Metrics Box
    pdf.setFillColor(245, 247, 250);
    pdf.roundedRect(leftMargin, yPosition, contentWidth, 40, 3, 3, "F");
    
    pdf.setFontSize(12);
    pdf.setTextColor(darkGray);
    pdf.text("KEY METRICS", leftMargin + 10, yPosition + 8);
    
    pdf.setFontSize(10);
    const metrics = [
      "3/5 Guardian Consensus Threshold",
      "5 Regulatory Jurisdictions (ECB, DNB, BaFin, FINMA, FCA)",
      "Google ADK Multi-Agent AI System",
      "Sepolia Testnet Deployment",
    ];
    
    let metricY = yPosition + 15;
    metrics.forEach((metric) => {
      pdf.setTextColor(accentGreen);
      pdf.text("■", leftMargin + 10, metricY);
      pdf.setTextColor(darkGray);
      pdf.text(metric, leftMargin + 15, metricY);
      metricY += 6;
    });
    
    yPosition += 50;

    // Technical Architecture
    pdf.setFontSize(16);
    pdf.setTextColor(darkGray);
    pdf.text("Technical Architecture", leftMargin, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setTextColor(primaryBlue);
    pdf.text("1. Smart Contract Layer (Sepolia Testnet)", leftMargin, yPosition);
    yPosition += 7;

    pdf.setFontSize(10);
    pdf.setTextColor(darkGray);
    const contractsText = `Deployed contracts implement threshold cryptography for guardian consensus:
• SeDeFramework: Guardian voting, threshold consensus, and reputation tracking
• PrivacyPool: Zero-knowledge proof-based deposits and withdrawals
• FraudSentinel: Transaction flagging and risk scoring
• EIP7702Delegate: Enhanced account abstraction for delegated execution
All contracts deployed and verified on Sepolia testnet`;
    
    const contractLines = pdf.splitTextToSize(contractsText, contentWidth);
    pdf.text(contractLines, leftMargin, yPosition);
    yPosition += contractLines.length * 5 + 10;

    pdf.setFontSize(12);
    pdf.setTextColor(primaryBlue);
    pdf.text("2. AI Agent Layer (Google ADK v1.0.0)", leftMargin, yPosition);
    yPosition += 7;

    pdf.setFontSize(10);
    pdf.setTextColor(darkGray);
    const agentsText = `Multi-agent system coordinates compliance decisions:
• ADKComplianceCoordinator: Sequential orchestration with risk-based routing
• ADKTransactionMonitor: Real-time blockchain surveillance
• ADKRiskAssessment: ML-powered risk scoring with AML detection
• ADKGuardianCouncil: Distributed consensus management (3-of-5 threshold)
• ADKPrivacyRevoker: Selective de-anonymization execution`;
    
    const agentLines = pdf.splitTextToSize(agentsText, contentWidth);
    pdf.text(agentLines, leftMargin, yPosition);
    yPosition += agentLines.length * 5 + 10;

    pdf.setFontSize(12);
    pdf.setTextColor(primaryBlue);
    pdf.text("3. Guardian Network", leftMargin, yPosition);
    yPosition += 7;

    pdf.setFontSize(10);
    pdf.setTextColor(darkGray);
    const guardianText = `Distributed consensus network with cryptographic threshold scheme (3-of-5):
• Each guardian holds a unique key share
• Minimum 3 guardians required for de-anonymization
• Regulatory representatives from major jurisdictions
• Immutable on-chain audit trail for all decisions`;
    
    const guardianLines = pdf.splitTextToSize(guardianText, contentWidth);
    pdf.text(guardianLines, leftMargin, yPosition);
    yPosition += guardianLines.length * 5 + 15;

    // Check if we need a new page
    if (yPosition > 250) {
      pdf.addPage();
      yPosition = topMargin;
    }

    // Compliance Framework
    pdf.setFontSize(16);
    pdf.setTextColor(darkGray);
    pdf.text("Compliance Framework", leftMargin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setTextColor(darkGray);
    const complianceText = `The platform implements Privacy Pools architecture with selective disclosure:

• Zero-Knowledge Deposits: Users maintain complete privacy by default
• Risk-Based Monitoring: AI agents detect suspicious patterns without accessing private data
• Threshold Consensus: De-anonymization requires 3-of-5 guardian approval
• Selective Disclosure: Only relevant transaction details revealed to authorized parties
• Audit Trail: All compliance actions recorded on-chain for regulatory review

Transaction Flow:
1. User deposits funds into privacy pool with ZK proof
2. AI agents monitor for risk indicators (patterns, amounts, velocity)
3. High-risk transactions (score ≥ 0.4) trigger guardian review
4. Guardian consensus (3/5) required for de-anonymization
5. Selective disclosure reveals only necessary information`;

    const complianceLines = pdf.splitTextToSize(complianceText, contentWidth);
    pdf.text(complianceLines, leftMargin, yPosition);
    yPosition += complianceLines.length * 5 + 15;

    // Performance Metrics
    pdf.setFontSize(16);
    pdf.setTextColor(darkGray);
    pdf.text("Performance & Security", leftMargin, yPosition);
    yPosition += 10;

    pdf.setFillColor(245, 247, 250);
    pdf.roundedRect(leftMargin, yPosition, contentWidth, 35, 3, 3, "F");
    
    pdf.setFontSize(10);
    pdf.setTextColor(darkGray);
    const performanceMetrics = [
      "Risk assessment processing: <5 seconds",
      "Low-risk auto-approval: <2 seconds",
      "Guardian consensus: 3-of-5 threshold scheme",
      "All agent tests passing (100% success rate)",
      "Real-time monitoring with WebSocket updates",
    ];
    
    let perfY = yPosition + 7;
    performanceMetrics.forEach((metric) => {
      pdf.text("• " + metric, leftMargin + 10, perfY);
      perfY += 6;
    });
    
    yPosition += 45;

    // Implementation Status
    pdf.setFontSize(16);
    pdf.setTextColor(darkGray);
    pdf.text("Implementation Status", leftMargin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setTextColor(darkGray);
    const statusText = `Current deployment on Sepolia testnet with full functionality:
• Smart contracts deployed and verified
• AI agent system operational (Google ADK integration)
• Guardian nodes active for 5 jurisdictions
• Dashboard monitoring real-time metrics
• WebSocket integration for live updates`;
    
    const statusLines = pdf.splitTextToSize(statusText, contentWidth);
    pdf.text(statusLines, leftMargin, yPosition);
    yPosition += statusLines.length * 5 + 15;

    // Footer
    pdf.setDrawColor(primaryBlue);
    pdf.setLineWidth(0.5);
    pdf.line(leftMargin, 270, pageWidth - rightMargin, 270);
    
    pdf.setFontSize(8);
    pdf.setTextColor(lightGray);
    pdf.text("© 2024 GuardianOS - Institutional Blockchain Compliance Platform", pageWidth / 2, 280, { align: "center" });
    pdf.text("Generated: " + new Date().toLocaleDateString(), pageWidth / 2, 285, { align: "center" });

    // Save the PDF
    pdf.save("GuardianOS-Executive-Summary.pdf");
  }, []);

  return (
    <Button
      onClick={generatePDF}
      className="guardian-button-primary group"
      size="lg"
    >
      <Download className="mr-2 h-5 w-5 transition-transform group-hover:translate-y-1" />
      Download Executive Summary
    </Button>
  );
}