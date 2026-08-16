const { listThreatStates, getThreatState } = require('../services/state.service');
const PDFDocument = require('pdfkit');

async function handleListThreats(req, res, next) {
  try {
    const { decision, search, page, limit } = req.query;
    const result = await listThreatStates({ decision, search }, { page, limit });
    return res.json({
      success: true,
      ...result
    });
  } catch (err) {
    next(err);
  }
}

async function handleGetThreat(req, res, next) {
  try {
    const { id } = req.params;
    const threatState = await getThreatState(id);
    if (!threatState) {
      return res.status(404).json({
        success: false,
        error: `Threat '${id}' not found`
      });
    }
    return res.json({
      success: true,
      threat: threatState
    });
  } catch (err) {
    next(err);
  }
}

async function handleDownloadReport(req, res, next) {
  try {
    const { id } = req.params;
    const { format = 'json' } = req.query;
    const threatState = await getThreatState(id);
    if (!threatState) {
      return res.status(404).json({
        success: false,
        error: `Threat '${id}' not found`
      });
    }

    const report = {
      reportTitle: 'ThreatChronicle Security Investigation Report',
      generatedAt: new Date().toISOString(),
      engineVersion: 'v1.0',
      threatSummary: {
        threatId: threatState.threatId,
        decision: threatState.decision,
        stateVersion: threatState.version,
        confidenceScore: `${Math.round(threatState.confidence * 100)}%`,
        totalEvidenceSources: threatState.totalEvents,
        decisionFingerprint: threatState.decisionFingerprint,
        firstSeen: threatState.firstSeen,
        lastEventTime: threatState.lastEventTime
      },
      conflictResolutionRationale: threatState.audits && threatState.audits.length > 0 
        ? threatState.audits[threatState.audits.length - 1].resolutionSteps 
        : [],
      versionAuditHistory: threatState.audits || [],
      rawTelemetryEvents: threatState.rawEvents || []
    };

    // PDF Format Export
    if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="ThreatChronicle_Report_${id}.pdf"`);

      doc.pipe(res);

      // Dark Theme Background Header Banner
      doc.rect(0, 0, doc.page.width, 90).fill('#080808');

      // Title & Branding
      doc.fillColor('#FFFFFF').fontSize(18).font('Helvetica-Bold').text('THREATCHRONICLE', 40, 25);
      doc.fillColor('#A3A3A3').fontSize(9).font('Helvetica').text('DETERMINISTIC THREAT CORRELATION ENGINE v1.0', 40, 48);
      doc.fillColor('#737373').fontSize(8).font('Helvetica').text(`GENERATED: ${report.generatedAt}`, 40, 62);

      // Status Badge Color Mapping
      let statusColor = '#10B981';
      if (report.threatSummary.decision === 'BLOCKED') statusColor = '#EF4444';
      else if (report.threatSummary.decision === 'SUSPICIOUS') statusColor = '#F59E0B';
      else if (report.threatSummary.decision === 'MONITOR') statusColor = '#EAB308';

      // Badge Box
      doc.rect(doc.page.width - 160, 25, 120, 32).fill(statusColor);
      doc.fillColor('#FFFFFF').fontSize(12).font('Helvetica-Bold').text(report.threatSummary.decision, doc.page.width - 150, 34, { width: 100, align: 'center' });

      doc.y = 110;

      // Executive Summary Box
      doc.rect(40, 105, doc.page.width - 80, 115).fillAndStroke('#0D0D0D', '#262626');
      
      doc.fillColor('#A3A3A3').fontSize(8).font('Helvetica-Bold').text('ACTIVE THREAT INVESTIGATION SUMMARY', 55, 115);
      doc.fillColor('#FFFFFF').fontSize(16).font('Helvetica-Bold').text(report.threatSummary.threatId, 55, 128);

      // Metrics Grid
      doc.fillColor('#737373').fontSize(8).font('Helvetica').text('CONFIDENCE', 55, 155);
      doc.fillColor('#FFFFFF').fontSize(13).font('Helvetica-Bold').text(report.threatSummary.confidenceScore, 55, 167);

      doc.fillColor('#737373').fontSize(8).font('Helvetica').text('EVIDENCE SOURCES', 185, 155);
      doc.fillColor('#FFFFFF').fontSize(13).font('Helvetica-Bold').text(String(report.threatSummary.totalEvidenceSources), 185, 167);

      doc.fillColor('#737373').fontSize(8).font('Helvetica').text('STATE VERSION', 335, 155);
      doc.fillColor('#FFFFFF').fontSize(13).font('Helvetica-Bold').text(`v${report.threatSummary.stateVersion}`, 335, 167);

      // Checksum Fingerprint
      doc.fillColor('#737373').fontSize(7).font('Helvetica').text(`SHA256 CHECKSUM: ${report.threatSummary.decisionFingerprint}`, 55, 195);

      // Section 1: Conflict Resolution Rationale
      doc.y = 240;
      doc.fillColor('#111111').fontSize(11).font('Helvetica-Bold').text('1. MULTI-SOURCE CONFLICT RESOLUTION RATIONALE', 40, doc.y);
      doc.moveDown(0.5);

      report.conflictResolutionRationale.forEach(step => {
        doc.fillColor('#222222').fontSize(9).font('Helvetica-Bold').text(`Step ${step.step}: ${step.description}`, { indent: 10 });
        if (step.reason) {
          doc.fillColor('#555555').fontSize(8).font('Helvetica').text(`Reason: ${step.reason}`, { indent: 20 });
        }
        doc.moveDown(0.3);
      });

      doc.moveDown(1);

      // Section 2: Chronological Telemetry Stream
      doc.fillColor('#111111').fontSize(11).font('Helvetica-Bold').text(`2. CHRONOLOGICAL TELEMETRY STREAM (${report.rawTelemetryEvents.length} events)`, 40, doc.y);
      doc.moveDown(0.5);

      report.rawTelemetryEvents.forEach(evt => {
        doc.fillColor('#222222').fontSize(8.5).font('Helvetica-Bold').text(`[${new Date(evt.timestamp).toISOString()}] ${evt.source.toUpperCase()} — Level: ${evt.threatLevel.toUpperCase()} (Confidence: ${Math.round(evt.confidence * 100)}%)`, { indent: 10 });
        doc.moveDown(0.2);
      });

      doc.end();
      return;
    }

    if (format === 'txt') {
      let txtContent = `====================================================\n`;
      txtContent += `THREATCHRONICLE INVESTIGATION REPORT\n`;
      txtContent += `Generated: ${report.generatedAt}\n`;
      txtContent += `Engine Version: ${report.engineVersion}\n`;
      txtContent += `====================================================\n\n`;
      txtContent += `THREAT IDENTIFIER: ${report.threatSummary.threatId}\n`;
      txtContent += `DECISION VERDICT:  ${report.threatSummary.decision}\n`;
      txtContent += `STATE VERSION:     v${report.threatSummary.stateVersion}\n`;
      txtContent += `CONFIDENCE:        ${report.threatSummary.confidenceScore}\n`;
      txtContent += `EVIDENCE SOURCES:  ${report.threatSummary.totalEvidenceSources}\n`;
      txtContent += `SHA256 CHECKSUM:   ${report.threatSummary.decisionFingerprint}\n\n`;
      txtContent += `----------------------------------------------------\n`;
      txtContent += `CONFLICT RESOLUTION RATIONALE:\n`;
      txtContent += `----------------------------------------------------\n`;
      report.conflictResolutionRationale.forEach(step => {
        txtContent += `Step ${step.step}: ${step.description}\n`;
        if (step.reason) txtContent += `  Reason: ${step.reason}\n`;
      });
      txtContent += `\n----------------------------------------------------\n`;
      txtContent += `TELEMETRY STREAM (${report.rawTelemetryEvents.length} events):\n`;
      txtContent += `----------------------------------------------------\n`;
      report.rawTelemetryEvents.forEach(evt => {
        txtContent += `[${evt.timestamp}] ${evt.source.toUpperCase()} (${evt.threatLevel.toUpperCase()} - ${Math.round(evt.confidence * 100)}%)\n`;
      });

      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename="ThreatChronicle_Report_${id}.txt"`);
      return res.send(txtContent);
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="ThreatChronicle_Report_${id}.json"`);
    return res.json(report);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleListThreats,
  handleGetThreat,
  handleDownloadReport
};
