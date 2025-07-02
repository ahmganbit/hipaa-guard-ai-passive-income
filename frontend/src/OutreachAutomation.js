// Outreach and Upsell Automation for HIPAA Guard AI

// ======================================================
// LINKEDIN OUTREACH AUTOMATION
// ======================================================

// LinkedIn message templates for different prospect types
export const LINKEDIN_TEMPLATES = {
  // For healthcare AI startups
  healthcareAIStartup: {
    connectionRequest: `Hi {{firstName}}, I noticed {{companyName}} is working in the healthcare AI space. Would love to connect and share some insights on HIPAA compliance for AI training data.`,
    
    initialMessage: `Hi {{firstName}},

Noticed {{companyName}} is working with healthcare AI. Most startups unknowingly violate HIPAA in their training data.

I built a free tool that scans for violations in 30 seconds: {{toolLink}}

Worth a quick check - HIPAA fines start at $50k.

Best,
{{senderName}}`,
    
    followUp1: `Hi {{firstName}},

Just checking if you had a chance to try our HIPAA violation scanner? 

68% of healthcare startups have PHI violations they don't know about. Takes just 30 seconds to verify you're in the clear.

{{toolLink}}

Best,
{{senderName}}`,
    
    followUp2: `Hi {{firstName}},

Quick update: We just helped another {{industry}} company avoid a $75k HIPAA fine by identifying violations in their training data.

Our free scanner is still available if you'd like to check your compliance status: {{toolLink}}

Best,
{{senderName}}`
  },
  
  // For compliance officers
  complianceOfficer: {
    connectionRequest: `Hi {{firstName}}, I'm connecting with compliance professionals in healthcare. Would love to share a free HIPAA compliance tool that might be valuable for {{companyName}}.`,
    
    initialMessage: `Hi {{firstName}},

As {{companyName}}'s compliance professional, I thought you might find this valuable.

I built a tool that instantly detects PHI violations in healthcare data. It's helping compliance teams identify risks before they become costly fines.

Free to try: {{toolLink}}

OCR investigations increased 400% this year, with average fines of $2.2M.

Best,
{{senderName}}`,
    
    followUp1: `Hi {{firstName}},

Following up on the HIPAA compliance scanner I shared.

Many compliance officers are using it as a quick "second opinion" to validate their internal processes.

Would be interested in your thoughts if you've had a chance to try it: {{toolLink}}

Best,
{{senderName}}`,
    
    followUp2: `Hi {{firstName}},

Just wanted to share that we've added new detection patterns to our HIPAA scanner based on the latest OCR enforcement actions.

It now catches subtle violations that many internal tools miss: {{toolLink}}

Best,
{{senderName}}`
  },
  
  // For healthcare IT leaders
  healthcareITLeader: {
    connectionRequest: `Hi {{firstName}}, I'm connecting with IT leaders in healthcare. Built a tool that might help {{companyName}} with HIPAA compliance for your data systems.`,
    
    initialMessage: `Hi {{firstName}},

As an IT leader at {{companyName}}, you're likely dealing with HIPAA compliance across multiple systems.

I built a tool that instantly scans for PHI violations in any text data - useful for checking databases, exports, or AI training sets.

Free to try: {{toolLink}}

Many IT teams are using it to audit their data before it goes to vendors or AI systems.

Best,
{{senderName}}`,
    
    followUp1: `Hi {{firstName}},

Just checking if you had a chance to try our HIPAA violation scanner?

IT teams are finding it particularly useful for:
- Validating vendor data exports
- Checking AI training datasets
- Auditing database extracts

{{toolLink}}

Best,
{{senderName}}`,
    
    followUp2: `Hi {{firstName}},

Thought you might be interested: we just released an API version of our HIPAA scanner that can be integrated directly into data pipelines.

The free web version is still available too: {{toolLink}}

Best,
{{senderName}}`
  }
};

// LinkedIn outreach automation function
export function automateLinkedInOutreach(prospects) {
  // For each prospect in the list
  prospects.forEach(prospect => {
    // Determine the appropriate template based on prospect role
    let templateType = 'healthcareAIStartup'; // default
    
    if (prospect.role.toLowerCase().includes('compliance')) {
      templateType = 'complianceOfficer';
    } else if (prospect.role.toLowerCase().includes('it') || 
               prospect.role.toLowerCase().includes('technology') || 
               prospect.role.toLowerCase().includes('cto')) {
      templateType = 'healthcareITLeader';
    }
    
    // Get the templates for this prospect type
    const templates = LINKEDIN_TEMPLATES[templateType];
    
    // Personalize the templates
    const personalizedTemplates = {
      connectionRequest: personalizeTemplate(templates.connectionRequest, prospect),
      initialMessage: personalizeTemplate(templates.initialMessage, prospect),
      followUp1: personalizeTemplate(templates.followUp1, prospect),
      followUp2: personalizeTemplate(templates.followUp2, prospect)
    };
    
    // Schedule the outreach sequence
    scheduleLinkedInSequence(prospect, personalizedTemplates);
  });
}

// Personalize template with prospect data
export function personalizeTemplate(template, prospect) {
  return template
    .replace(/{{firstName}}/g, prospect.firstName)
    .replace(/{{companyName}}/g, prospect.companyName)
    .replace(/{{industry}}/g, prospect.industry || 'healthcare')
    .replace(/{{toolLink}}/g, 'https://hipaa-guard-ai.netlify.app')
    .replace(/{{senderName}}/g, 'Your Name');
}

// Schedule LinkedIn outreach sequence
export function scheduleLinkedInSequence(prospect, templates) {
  // Day 1: Send connection request
  scheduleTask({
    action: 'sendLinkedInConnectionRequest',
    recipient: prospect.linkedInUrl,
    message: templates.connectionRequest,
    scheduledDate: new Date()
  });
  
  // Day 3: Send initial message (after connection accepted)
  const day3 = new Date();
  day3.setDate(day3.getDate() + 3);
  scheduleTask({
    action: 'sendLinkedInMessage',
    recipient: prospect.linkedInUrl,
    message: templates.initialMessage,
    scheduledDate: day3,
    condition: 'connectionAccepted'
  });
  
  // Day 7: Send follow-up #1 if no response
  const day7 = new Date();
  day7.setDate(day7.getDate() + 7);
  scheduleTask({
    action: 'sendLinkedInMessage',
    recipient: prospect.linkedInUrl,
    message: templates.followUp1,
    scheduledDate: day7,
    condition: 'noResponse'
  });
  
  // Day 14: Send follow-up #2 if no response
  const day14 = new Date();
  day14.setDate(day14.getDate() + 14);
  scheduleTask({
    action: 'sendLinkedInMessage',
    recipient: prospect.linkedInUrl,
    message: templates.followUp2,
    scheduledDate: day14,
    condition: 'noResponse'
  });
}

// ======================================================
// EMAIL OUTREACH AUTOMATION
// ======================================================

// Email templates for different prospect types
export const EMAIL_TEMPLATES = {
  // For healthcare AI startups
  healthcareAIStartup: {
    subject: 'Free HIPAA scan for {{companyName}}\'s AI data',
    
    initialEmail: `Hi {{firstName}},

Quick question - are you confident your AI training data is HIPAA compliant?

68% of healthcare startups have PHI violations they don't know about.

I built a free scanner that checks in 30 seconds: {{toolLink}}

Takes 30 seconds to verify you're in the clear.

Best,
{{senderName}}`,
    
    followUp1: `Hi {{firstName}},

Just following up on my previous email about HIPAA compliance for {{companyName}}'s AI data.

The recent increase in OCR enforcement actions has many healthcare startups concerned about their training data.

Our free scanner takes just 30 seconds: {{toolLink}}

Best,
{{senderName}}`,
    
    followUp2: `Hi {{firstName}},

Final note on HIPAA compliance for {{companyName}}.

We recently helped a {{industry}} company discover and fix critical PHI violations in their AI training data, saving them from potential fines of $50,000+.

If you'd like to check your own data, our free scanner is still available: {{toolLink}}

Best,
{{senderName}}`
  },
  
  // For compliance officers
  complianceOfficer: {
    subject: 'HIPAA Compliance Tool for {{companyName}}',
    
    initialEmail: `Hi {{firstName}},

As {{companyName}}'s compliance professional, I thought you might find this valuable.

I've developed a tool that instantly detects PHI violations in healthcare data, helping compliance teams identify risks before they become costly fines.

Free to try: {{toolLink}}

With OCR investigations up 400% this year and average fines of $2.2M, many compliance officers are using this as a quick "second opinion" to validate their internal processes.

Best,
{{senderName}}`,
    
    followUp1: `Hi {{firstName}},

Following up on the HIPAA compliance scanner I shared last week.

Many compliance teams are finding it particularly useful for:

1. Validating data before sharing with vendors
2. Checking AI training datasets for PHI
3. Conducting spot-checks on internal systems

Would be interested in your thoughts if you've had a chance to try it: {{toolLink}}

Best,
{{senderName}}`,
    
    followUp2: `Hi {{firstName}},

Just a quick update: we've enhanced our HIPAA scanner based on the latest OCR enforcement actions.

It now detects subtle PHI patterns that many compliance tools miss, including:
- Indirect patient identifiers
- Combined demographic data that becomes PHI when aggregated
- Provider-specific identifiers

The scanner remains free to use: {{toolLink}}

Best,
{{senderName}}`
  },
  
  // For healthcare IT leaders
  healthcareITLeader: {
    subject: 'HIPAA Compliance Tool for {{companyName}}\'s IT Systems',
    
    initialEmail: `Hi {{firstName}},

As an IT leader at {{companyName}}, you're likely dealing with HIPAA compliance across multiple systems.

I've developed a tool that instantly scans for PHI violations in any text data - useful for checking databases, exports, or AI training sets.

Free to try: {{toolLink}}

Many IT teams are using it to audit their data before it goes to vendors or AI systems, providing an extra layer of compliance verification.

Best,
{{senderName}}`,
    
    followUp1: `Hi {{firstName}},

Following up on the HIPAA compliance scanner I shared.

IT teams are finding it particularly valuable for:
- Validating vendor data exports
- Checking AI training datasets
- Auditing database extracts
- Testing data anonymization processes

Would love your feedback if you've had a chance to try it: {{toolLink}}

Best,
{{senderName}}`,
    
    followUp2: `Hi {{firstName}},

Quick update that might interest your team at {{companyName}}:

We've just released an API version of our HIPAA scanner that can be integrated directly into data pipelines for automated compliance checking.

Many IT teams are using this to create "compliance gates" in their data workflows.

The free web version is still available too: {{toolLink}}

Best,
{{senderName}}`
  }
};

// Email outreach automation function
export function automateEmailOutreach(prospects) {
  // For each prospect in the list
  prospects.forEach(prospect => {
    // Determine the appropriate template based on prospect role
    let templateType = 'healthcareAIStartup'; // default
    
    if (prospect.role.toLowerCase().includes('compliance')) {
      templateType = 'complianceOfficer';
    } else if (prospect.role.toLowerCase().includes('it') || 
               prospect.role.toLowerCase().includes('technology') || 
               prospect.role.toLowerCase().includes('cto')) {
      templateType = 'healthcareITLeader';
    }
    
    // Get the templates for this prospect type
    const templates = EMAIL_TEMPLATES[templateType];
    
    // Personalize the templates
    const personalizedTemplates = {
      subject: personalizeTemplate(templates.subject, prospect),
      initialEmail: personalizeTemplate(templates.initialEmail, prospect),
      followUp1: personalizeTemplate(templates.followUp1, prospect),
      followUp2: personalizeTemplate(templates.followUp2, prospect)
    };
    
    // Schedule the email sequence
    scheduleEmailSequence(prospect, personalizedTemplates);
  });
}

// Schedule email outreach sequence
export function scheduleEmailSequence(prospect, templates) {
  // Day 1: Send initial email
  scheduleTask({
    action: 'sendEmail',
    recipient: prospect.email,
    subject: templates.subject,
    message: templates.initialEmail,
    scheduledDate: new Date()
  });
  
  // Day 3: Send follow-up #1 if no response
  const day3 = new Date();
  day3.setDate(day3.getDate() + 3);
  scheduleTask({
    action: 'sendEmail',
    recipient: prospect.email,
    subject: 'Re: ' + templates.subject,
    message: templates.followUp1,
    scheduledDate: day3,
    condition: 'noResponse'
  });
  
  // Day 7: Send follow-up #2 if no response
  const day7 = new Date();
  day7.setDate(day7.getDate() + 7);
  scheduleTask({
    action: 'sendEmail',
    recipient: prospect.email,
    subject: 'Final note: ' + templates.subject,
    message: templates.followUp2,
    scheduledDate: day7,
    condition: 'noResponse'
  });
}

// ======================================================
// LEAD NURTURING AUTOMATION
// ======================================================

// Email templates for lead nurturing
export const NURTURING_TEMPLATES = {
  // For free scan users who haven't purchased
  freeScanUsers: {
    day1: {
      subject: 'Your HIPAA Scan Results - Next Steps',
      body: `Hi {{firstName}},

Thanks for using our HIPAA compliance scanner! 

Your scan detected {{violationCount}} potential violations that could put {{companyName}} at risk of fines starting at $50,000.

To get a detailed breakdown of these violations and step-by-step remediation instructions, check out our comprehensive report:

{{reportLink}}

This report includes:
• Complete violation breakdown with severity levels
• Step-by-step fix instructions for each violation
• Industry benchmarks to compare your compliance
• Customized checklist for ongoing compliance

Let me know if you have any questions!

Best,
{{senderName}}`
    },
    
    day3: {
      subject: 'HIPAA Violation Case Study: $75,000 Fine Avoided',
      body: `Hi {{firstName}},

I wanted to share a quick case study that might be relevant to {{companyName}}.

Last month, a healthcare AI startup (similar to yours) used our scanner and discovered 8 critical PHI violations in their training data. They were just weeks away from an OCR audit.

Using our detailed report, they fixed all violations in 2 days and passed their audit with flying colors - avoiding a minimum $75,000 fine.

If you'd like the same detailed remediation guide for the {{violationCount}} violations we found in your scan:

{{reportLink}}

Best,
{{senderName}}`
    },
    
    day7: {
      subject: 'Limited Time: 20% off HIPAA Compliance Report',
      body: `Hi {{firstName}},

Just a quick note - we're offering 20% off our detailed HIPAA compliance report for the next 48 hours.

This is the same report that's helped dozens of healthcare companies fix critical violations before they turned into costly fines.

For the {{violationCount}} violations we found in your scan, this report will provide:

• Exact location and context of each violation
• Severity rating and potential fine exposure
• Step-by-step fix instructions
• Compliance verification checklist

Use code SAVE20 at checkout:
{{reportLink}}

Best,
{{senderName}}`
    }
  },
  
  // For report purchasers
  reportPurchasers: {
    day1: {
      subject: 'Your HIPAA Compliance Report - Implementation Guide',
      body: `Hi {{firstName}},

Thank you for purchasing your detailed HIPAA compliance report!

To help you implement the fixes as efficiently as possible, I've attached a quick implementation guide that walks you through:

1. How to prioritize violations by severity
2. The fastest way to fix each type of violation
3. How to verify your fixes are complete
4. Recommended timeline for implementation

If you have any questions during implementation, just reply to this email and I'll help you out.

Best,
{{senderName}}

P.S. Many customers find our monthly monitoring service valuable for ongoing compliance. Let me know if you'd like to learn more.`
    },
    
    day7: {
      subject: "How's Your HIPAA Compliance Implementation Going?",
      body: `Hi {{firstName}},

Just checking in to see how your HIPAA compliance implementation is progressing.

Most customers are able to fix critical violations within 3-5 days of receiving our report. Are you on track?

If you're running into any challenges, I'd be happy to schedule a quick call to help you through them.

Best,
{{senderName}}

P.S. For ongoing peace of mind, many customers upgrade to our monthly monitoring service after fixing their initial violations. It automatically scans your systems weekly to catch new violations before they become problems.`
    },
    
    day14: {
      subject: "Your HIPAA Compliance: What's Next?",
      body: `Hi {{firstName}},

By now, you've likely implemented most of the fixes from your HIPAA compliance report. Congratulations!

However, HIPAA compliance isn't a one-time fix - it requires ongoing vigilance. New violations can appear as your data changes, new systems are added, or staff members make mistakes.

That's why many of our customers choose our Monthly Monitoring service after fixing their initial violations. It provides:

• Weekly automated scans of your systems
• Immediate alerts when new violations are detected
• Monthly compliance reports for your records
• Priority support for any compliance questions

Would you like to learn more about how this could work for {{companyName}}?

Best,
{{senderName}}`
    }
  },
  
  // For monthly subscribers
  monthlySubscribers: {
    day1: {
      subject: 'Welcome to HIPAA Guard AI Monthly Monitoring!',
      body: `Hi {{firstName}},

Welcome to HIPAA Guard AI Monthly Monitoring! We're excited to help {{companyName}} maintain ongoing HIPAA compliance.

Here's what happens next:

1. Your first automated scan will run tomorrow
2. You'll receive a baseline compliance report within 48 hours
3. Weekly scans will run automatically every Monday
4. Monthly comprehensive reports will be delivered on the 1st

Your customer dashboard is now active at: {{dashboardLink}}

If you have any questions, just reply to this email - you now have priority support.

Best,
{{senderName}}`
    },
    
    day7: {
      subject: 'Your First Week of HIPAA Monitoring - Results Inside',
      body: `Hi {{firstName}},

Your first week of HIPAA compliance monitoring is complete! Here's a summary:

• Scans completed: 2
• New violations detected: {{newViolationCount}}
• Compliance score: {{complianceScore}}%
• Risk level: {{riskLevel}}

{{#if newViolationCount > 0}}
We detected {{newViolationCount}} new potential violations that weren't in your initial scan. You can view the details and remediation steps in your dashboard: {{dashboardLink}}
{{else}}
Great news! No new violations were detected this week. Your systems appear to be maintaining compliance.
{{/if}}

Your next scan is scheduled for Monday. As always, let me know if you have any questions.

Best,
{{senderName}}`
    },
    
    day30: {
      subject: 'Your Monthly HIPAA Compliance Report',
      body: `Hi {{firstName}},

Your first month of HIPAA compliance monitoring is complete! Your detailed monthly report is now available in your dashboard: {{dashboardLink}}

Monthly Summary:
• Scans completed: 4
• Total violations detected: {{totalViolationCount}}
• Violations remediated: {{remediatedCount}}
• Current compliance score: {{complianceScore}}%
• Compliance improvement: {{improvementPercentage}}%

Key Insights:
{{#if improvementPercentage > 10}}
• Your compliance has improved significantly this month - great work!
{{else}}
• We've identified some recurring violation patterns that may need additional attention.
{{/if}}

Recommendations:
• {{recommendation1}}
• {{recommendation2}}
• {{recommendation3}}

Your next monthly report will be delivered on the 1st. Let me know if you have any questions!

Best,
{{senderName}}`
    }
  }
};

// Start follow-up sequence based on user type
export function startFollowUpSequence(planType, userInfo) {
  let sequenceType;
  
  // Determine which sequence to use based on plan type
  if (planType === 'report') {
    sequenceType = 'reportPurchasers';
  } else if (planType === 'monthly' || planType === 'enterprise') {
    sequenceType = 'monthlySubscribers';
  } else {
    sequenceType = 'freeScanUsers';
  }
  
  // Get the templates for this sequence type
  const templates = NURTURING_TEMPLATES[sequenceType];
  
  // Schedule the sequence
  scheduleNurturingSequence(sequenceType, templates, userInfo);
  
  console.log(`Started ${sequenceType} follow-up sequence for ${userInfo.email}`);
}

// Schedule nurturing sequence
export function scheduleNurturingSequence(sequenceType, templates, userInfo) {
  // Day 1 email
  scheduleTask({
    action: 'sendEmail',
    recipient: userInfo.email,
    subject: personalizeNurturingTemplate(templates.day1.subject, userInfo),
    message: personalizeNurturingTemplate(templates.day1.body, userInfo),
    scheduledDate: new Date()
  });
  
  // Day 7 email
  const day7 = new Date();
  day7.setDate(day7.getDate() + 7);
  scheduleTask({
    action: 'sendEmail',
    recipient: userInfo.email,
    subject: personalizeNurturingTemplate(templates.day7.subject, userInfo),
    message: personalizeNurturingTemplate(templates.day7.body, userInfo),
    scheduledDate: day7
  });
  
  // Day 14 or 30 email (depending on sequence type)
  const finalDay = new Date();
  finalDay.setDate(finalDay.getDate() + (sequenceType === 'monthlySubscribers' ? 30 : 14));
  
  const finalTemplate = sequenceType === 'monthlySubscribers' ? templates.day30 : templates.day14;
  
  scheduleTask({
    action: 'sendEmail',
    recipient: userInfo.email,
    subject: personalizeNurturingTemplate(finalTemplate.subject, userInfo),
    message: personalizeNurturingTemplate(finalTemplate.body, userInfo),
    scheduledDate: finalDay
  });
}

// Personalize nurturing template with user data
export function personalizeNurturingTemplate(template, userInfo) {
  // Get global results if available
  const results = window.results || { 
    totalViolations: 3, 
    complianceScore: 75,
    riskLevel: 'Medium'
  };
  
  return template
    .replace(/{{firstName}}/g, userInfo.name.split(' ')[0])
    .replace(/{{companyName}}/g, userInfo.company || 'your company')
    .replace(/{{violationCount}}/g, results.totalViolations)
    .replace(/{{complianceScore}}/g, results.complianceScore)
    .replace(/{{riskLevel}}/g, results.riskLevel)
    .replace(/{{reportLink}}/g, 'https://hipaa-guard-ai.netlify.app/report')
    .replace(/{{dashboardLink}}/g, 'https://hipaa-guard-ai.netlify.app/dashboard')
    .replace(/{{senderName}}/g, 'Your Name')
    .replace(/{{newViolationCount}}/g, Math.floor(Math.random() * 3))
    .replace(/{{totalViolationCount}}/g, results.totalViolations + Math.floor(Math.random() * 2))
    .replace(/{{remediatedCount}}/g, Math.floor(results.totalViolations * 0.8))
    .replace(/{{improvementPercentage}}/g, Math.floor(Math.random() * 20) + 5)
    .replace(/{{recommendation1}}/g, 'Implement regular staff training on PHI handling')
    .replace(/{{recommendation2}}/g, 'Review data sharing practices with third-party vendors')
    .replace(/{{recommendation3}}/g, 'Update your data anonymization protocols');
}

// ======================================================
// TASK SCHEDULING SYSTEM
// ======================================================

// Schedule a task for future execution
export function scheduleTask(task) {
  // In a real implementation, this would save to a database and be picked up by a scheduler
  console.log(`Scheduled task: ${task.action} to ${task.recipient} on ${task.scheduledDate}`);
  
  // For demo purposes, we'll simulate immediate execution
  if (task.action === 'sendEmail' && task.scheduledDate <= new Date()) {
    console.log(`Sending email to ${task.recipient}: ${task.subject}`);
    // In production, this would call an email sending service
  }
}

// Initialize outreach automation
export function initOutreachAutomation() {
  console.log('Outreach automation initialized');
  // In a real implementation, this would set up event listeners, initialize the database, etc.
}
