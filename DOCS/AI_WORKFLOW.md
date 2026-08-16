# ThreatChronicle --- AI_WORKFLOW.md

## 1. Purpose

This document defines how AI assistance is used during development of
ThreatChronicle while preserving human engineering judgment, rule
compliance, security, testing, and verifiability.

The challenge explicitly prohibits ML/LLM inference in the MVP.
Therefore, AI may assist the development process, but the MVP's runtime
threat-correlation engine must not depend on LLM/ML inference.

Core principle:

> AI SPEED + HUMAN JUDGMENT + ENGINEERING VERIFICATION

------------------------------------------------------------------------

## 2. AI Usage Boundaries

### Allowed development assistance

AI may be used for:

-   architecture brainstorming;
-   code scaffolding;
-   explaining APIs;
-   generating test-case ideas;
-   identifying edge cases;
-   debugging suggestions;
-   documentation drafts;
-   reviewing implementation logic;
-   suggesting MongoDB indexes;
-   suggesting deterministic algorithms;
-   generating fixture structures;
-   improving README clarity.

### Runtime MVP restrictions

The runtime MVP must NOT use:

-   LLM inference;
-   ML inference;
-   external AI APIs;
-   cloud AI services;
-   external threat-intelligence APIs.

AI-generated threat reports may exist as **local fixture events**.

------------------------------------------------------------------------

## 3. Human-Owned Decisions

The human engineering team must independently decide and verify:

-   architecture;
-   database schema;
-   event schema;
-   source reliability rules;
-   conflict-resolution precedence;
-   state reconstruction behavior;
-   rule versioning;
-   security boundaries;
-   API contracts;
-   test expectations;
-   performance claims;
-   deployment/submission compliance.

AI suggestions are not automatically authoritative.

------------------------------------------------------------------------

## 4. AI-Assisted Development Workflow

``` text
Problem
  ↓
Human understanding
  ↓
AI-assisted exploration
  ↓
Candidate implementation
  ↓
Human review
  ↓
Code implementation
  ↓
Automated tests
  ↓
Manual verification
  ↓
Security review
  ↓
Accepted implementation
```

Never:

``` text
AI output
  ↓
blindly commit
```

------------------------------------------------------------------------

## 5. Architecture Prompting Workflow

When asking AI for architecture help, provide:

-   exact challenge requirements;
-   allowed technologies;
-   prohibited technologies;
-   required API behavior;
-   determinism requirements;
-   replay requirements;
-   edge cases;
-   performance target.

Ask AI to distinguish:

-   FACT
-   INFERENCE
-   ASSUMPTION
-   RECOMMENDATION

Do not let AI invent challenge requirements.

------------------------------------------------------------------------

## 6. Code Generation Workflow

For generated code:

1.  Ask for a small component.
2.  Review the generated code.
3.  Compare it against challenge requirements.
4.  Run lint/tests.
5.  Test edge cases.
6.  Inspect security implications.
7.  Modify code where required.
8.  Commit only after verification.

Important components requiring manual review:

-   deterministic sorting;
-   fingerprints;
-   database unique indexes;
-   replay logic;
-   conflict resolution;
-   state transitions;
-   API validation.

------------------------------------------------------------------------

## 7. AI and Determinism

AI-generated code must not introduce non-deterministic behavior.

Avoid relying on:

-   random values in decision logic;
-   current time for historical decisions;
-   unordered object iteration where ordering affects decisions;
-   database result order without explicit sorting;
-   unstable asynchronous ordering;
-   hidden mutable global state.

Every decision should be a function of deterministic inputs.

Conceptually:

``` text
Decision =
f(
  canonicalEvents,
  deterministicOrdering,
  ruleVersion,
  deterministicRules
)
```

------------------------------------------------------------------------

## 8. AI Report Handling

The challenge mentions AI-generated threat reports but prohibits ML/LLM
inference in the MVP.

Therefore use:

``` text
Local AI report fixture
        ↓
REST event ingestion
        ↓
Validation
        ↓
Canonical normalization
        ↓
Correlation
```

Example:

``` json
{
  "source": "ai_report",
  "type": "ai_threat_report",
  "data": {
    "indicator": "192.168.1.100",
    "classification": "phishing",
    "confidence": 0.91
  }
}
```

The engine must treat this as evidence from a lower-reliability source
according to the challenge's explicit ranking.

------------------------------------------------------------------------

## 9. AI Output Validation

When AI proposes code or architecture, validate it against:

### Requirement

What does the challenge actually require?

### Implementation

What did we build?

### Test

How do we test it?

### Expected result

What should happen?

### Observed result

What actually happened?

### Evidence

What output proves it?

Do not treat AI-generated explanations as proof.

------------------------------------------------------------------------

## 10. AI Error Handling

AI may generate incorrect:

-   MongoDB schemas;
-   Express patterns;
-   sorting logic;
-   replay logic;
-   security assumptions;
-   dependency choices.

When AI output is wrong:

1.  identify the error;
2.  correct it;
3.  add a regression test where appropriate;
4.  document the verified implementation;
5.  do not preserve the incorrect suggestion merely because it came from
    AI.

------------------------------------------------------------------------

## 11. AI Development Record

Where practical, record meaningful AI assistance:

``` text
Task
AI assistance
Human decision
Modification
Verification
```

Example:

``` text
Task:
Design deterministic event ordering.

AI assistance:
Suggested timestamp + source + confidence + event ID ordering.

Human decision:
Accepted after checking challenge precedence.

Modification:
Used source reliability ranking explicitly.

Verification:
Added same-timestamp and repeated-replay tests.
```

Do not fabricate transcripts.

------------------------------------------------------------------------

## 12. What AI Helped Create

Potential categories:

-   project structure;
-   initial architecture alternatives;
-   test-case ideas;
-   documentation;
-   code scaffolding;
-   debugging hypotheses.

Only claim items that actually occurred.

------------------------------------------------------------------------

## 13. What AI Recommended

Document meaningful recommendations such as:

-   event-sourcing-style architecture;
-   immutable event storage;
-   deterministic sorting;
-   replay endpoint;
-   decision fingerprints;
-   state versioning.

Do not claim a recommendation was implemented unless it was actually
accepted.

------------------------------------------------------------------------

## 14. What Was Accepted

Example categories:

-   immutable events;
-   derived state;
-   deterministic ordering;
-   explicit conflict rules;
-   replay verification.

The actual project history should determine the final list.

------------------------------------------------------------------------

## 15. What Was Rejected

Possible rejected approaches include:

-   unnecessary multi-agent architecture;
-   LLM inference in MVP;
-   external APIs;
-   microservices;
-   Kafka;
-   Kubernetes;
-   Redis;
-   cloud deployment.

Reasons:

-   violates challenge constraints;
-   increases complexity;
-   reduces reliability;
-   does not improve core scoring.

------------------------------------------------------------------------

## 16. Human Verification

Every major AI-assisted implementation must pass:

-   unit tests;
-   integration tests where relevant;
-   replay tests;
-   manual edge-case checks;
-   security review.

The team must not claim:

> "AI generated it, therefore it works."

Instead:

> "AI assisted implementation; tests and manual verification established
> the observed behavior."

------------------------------------------------------------------------

## 17. AI Security

Never paste into an external AI system:

-   secrets;
-   API keys;
-   passwords;
-   private credentials;
-   sensitive production telemetry;
-   personal information;
-   confidential company information.

Use synthetic fixtures.

------------------------------------------------------------------------

## 18. AI Runtime Decision

### MVP

``` text
AI runtime inference = OFF
```

### Architecture support

``` text
AI report = accepted as an input source
```

### Optional future architecture

``` text
Image
 ↓
AI Agent
 ↓
Threat Report
 ↓
Validation
 ↓
Human/rule validation
 ↓
Event
 ↓
ThreatChronicle
```

Only implement this if challenge rules permit it and sufficient time
remains.

------------------------------------------------------------------------

## 19. Final AI Compliance Checklist

-   [ ] No LLM/ML inference in MVP.
-   [ ] No external AI API.
-   [ ] AI reports are local fixtures.
-   [ ] AI-assisted development is documented truthfully.
-   [ ] Human decisions are distinguishable from AI suggestions.
-   [ ] AI-generated code was tested.
-   [ ] Security implications were reviewed.
-   [ ] No fabricated transcripts.
-   [ ] No fabricated benchmarks.
-   [ ] No fabricated testing evidence.
-   [ ] No fabricated user data.
