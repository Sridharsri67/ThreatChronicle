# ThreatChronicle --- AGENT.md

## 1. Project Identity

**Project:** ThreatChronicle\
**Full name:** Real-Time AI-Driven Threat Correlation Engine with
Replayable Audit and State Consistency\
**Category:** Cybersecurity / Threat Intelligence / Event Correlation /
Deterministic Decisioning\
**Primary goal:** Build a local real-time threat correlation engine that
ingests heterogeneous security events, reconstructs threat state
deterministically, resolves conflicts, maintains an auditable decision
history, and replays historical events to reproduce decisions.

### Core thesis

ThreatChronicle is not primarily an AI detector. The core engineering
problem is **decision integrity**:

> Given the same security events and the same rule version, the system
> must reconstruct the same threat state, produce the same decision, and
> explain exactly how that decision was reached.

------------------------------------------------------------------------

## 2. Challenge Facts

The challenge explicitly requires:

-   REST event ingestion through `POST /api/events`.
-   Canonical normalization of fields such as IP, domain, and hash.
-   Invalid-event rejection.
-   Versioned, time-ordered threat-state reconstruction.
-   Handling of late and out-of-order events.
-   Handling of duplicate events.
-   Handling of conflicting reports.
-   Deterministic resolution using:
    1.  source reliability,
    2.  timestamp,
    3.  confidence.
-   Source reliability order:
    -   `alienvault` \> `virus_total` \> `ai_report`.
-   One consistent decision per threat.
-   Replayable audit trail.
-   Audit records containing inputs, evidence, resolution logic,
    decision timestamp, and state version.
-   REST APIs for decisions and events.
-   Determinism.
-   Idempotency.
-   Replayability.
-   Auditability.
-   Local performance target of 100+ events/sec.
-   React.js, Node.js, Express.js, MongoDB, Mongoose, REST APIs,
    JavaScript, and Python as allowed technologies.
-   No external APIs or cloud services; use local fixtures.
-   No ML/LLM inference in MVP.
-   No Kubernetes or distributed systems.
-   Public GitHub repository.
-   Backend, frontend, fixtures, generated audit outputs, automated
    tests, and README.

### Explicit uncertainty

The challenge does not specify exact judging weights, exact demo
duration, exact authentication requirements, or a mandatory production
cloud deployment target. Do not invent those requirements.

------------------------------------------------------------------------

## 3. Product Definition

### Product name

**ThreatChronicle**

### Tagline

**Every threat decision has a history. Every history can be replayed.**

### One-line pitch

ThreatChronicle is a deterministic real-time threat correlation engine
that reconstructs evolving threat states from conflicting security
events and provides a replayable, auditable explanation for every
decision.

### Primary user

SOC analyst / security analyst.

### Primary questions answered

-   What happened?
-   When did it happen?
-   Which evidence was considered?
-   Which source won?
-   Why did the system make this decision?
-   What changed the decision?
-   Can the decision be reproduced?

------------------------------------------------------------------------

## 4. Engineering Priorities

Always prioritize:

1.  Correctness
2.  Security
3.  Verification
4.  User value
5.  Maintainability
6.  Performance
7.  Visual polish

Do not optimize for feature count.

The deterministic correlation/state/replay engine is more important than
advanced UI.

------------------------------------------------------------------------

## 5. Technology Stack

### Required/primary

-   JavaScript
-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   React.js
-   REST APIs
-   Git/GitHub

### Allowed but not required for MVP

-   Python

### Explicitly avoid

-   External security APIs
-   Cloud services
-   ML/LLM inference in MVP
-   Kubernetes
-   Distributed systems
-   Kafka
-   Redis
-   Microservices
-   Real EDR integrations
-   Real AlienVault integration
-   Real VirusTotal integration

Security sources should be simulated using local fixtures.

------------------------------------------------------------------------

## 6. Architecture

``` text
React Dashboard
      |
      v
Express REST API
      |
      +------------------+
      |                  |
      v                  v
Event API             Threat API
      |                  |
      +--------+---------+
               |
               v
     Threat Correlation Engine
               |
      +--------+---------+
      |        |         |
      v        v         v
Validation  Normalize  Fingerprint
               |
               v
      Immutable Event Store
               |
               v
     Deterministic Ordering
               |
               v
       State Reconstruction
               |
               v
       Correlation Engine
               |
               v
      Conflict Resolution
               |
               v
       Decision Generation
               |
        +------+------+
        |             |
        v             v
 Threat State      Audit Record
        |
        v
 Replay Engine
        |
        v
 Replay Verification
```

------------------------------------------------------------------------

## 7. Architectural Principles

### Immutable events

Never rewrite historical source events.

### Derived state

Threat state is derived from events.

### Immutable audit

Decision history must preserve previous decisions.

### Deterministic processing

Same events + same rule version = same result.

### Idempotency

Submitting the same event again must not produce duplicate effects.

### Replayability

The current decision must be reproducible from stored events rather than
from the current materialized state.

### Rule transparency

Conflict-resolution logic must be explicit and inspectable.

------------------------------------------------------------------------

## 8. Database Design

Use MongoDB with Mongoose.

### `events`

Purpose: immutable normalized source events.

Suggested fields:

``` javascript
{
  eventId,
  fingerprint,
  source,
  timestamp,
  receivedAt,
  type,
  threatId,
  data,
  normalizedData,
  confidence,
  schemaVersion,
  createdAt
}
```

Important indexes:

-   unique `fingerprint`
-   `threatId`
-   `timestamp`
-   `source`

### `threat_states`

Purpose: current materialized state for fast dashboard/API queries.

Suggested fields:

``` javascript
{
  threatId,
  version,
  decision,
  confidence,
  evidence,
  firstSeen,
  lastEventTime,
  updatedAt,
  decisionFingerprint,
  ruleVersion
}
```

Important index:

-   unique `threatId`

### `audit_records`

Purpose: immutable decision history.

Suggested fields:

``` javascript
{
  threatId,
  stateVersion,
  decision,
  confidence,
  eventIds,
  resolutionSteps,
  rulesApplied,
  previousDecision,
  changed,
  replayFingerprint,
  ruleVersion,
  createdAt
}
```

Important indexes:

-   `threatId`
-   compound `threatId + stateVersion`

------------------------------------------------------------------------

## 9. Canonical Event Model

All sources must be converted into a common representation.

Example:

``` json
{
  "eventId": "evt_8f31",
  "source": "alienvault",
  "timestamp": "2024-06-01T12:00:00Z",
  "receivedAt": "2026-08-16T08:20:00Z",
  "type": "ioc",
  "threatId": "ip_192.168.1.100",
  "indicator": {
    "type": "ip",
    "value": "192.168.1.100"
  },
  "threatLevel": "high",
  "confidence": 0.8,
  "schemaVersion": 1
}
```

Reject events missing mandatory information, such as an identifiable
threat indicator.

------------------------------------------------------------------------

## 10. Deterministic Ordering

Events must be sorted using stable rules.

Recommended order:

1.  Event timestamp ascending.
2.  Source reliability descending.
3.  Confidence descending.
4.  Event ID ascending.

The final event ID tie-breaker prevents ambiguous ordering when all
other fields are equal.

Do not use non-deterministic iteration order.

------------------------------------------------------------------------

## 11. Source Reliability

The challenge specifies:

``` text
alienvault > virus_total > ai_report
```

Represent the rule centrally:

``` javascript
const SOURCE_RELIABILITY = {
  alienvault: 3,
  virus_total: 2,
  ai_report: 1
};
```

Do not duplicate source ranking logic across controllers.

------------------------------------------------------------------------

## 12. Decision Engine

The decision engine must:

1.  Load all events for a threat.
2.  Normalize/canonicalize them.
3.  Sort them deterministically.
4.  Correlate evidence.
5.  Detect conflicts.
6.  Apply configured resolution rules.
7.  Produce a decision.
8.  Produce evidence references.
9.  Produce an audit explanation.
10. Produce a deterministic decision fingerprint.

The exact final policy for mapping evidence to `blocked`, `monitor`,
etc. must be explicitly documented and tested. Do not invent hidden
behavior.

------------------------------------------------------------------------

## 13. State Reconstruction

For a late event:

``` text
Existing:
12:00 event
12:05 event
12:10 event

Late event arrives:
10:00 event
```

Do not append it blindly.

Instead:

``` text
Load all threat events
        |
Insert late event
        |
Deterministically sort
        |
Replay
        |
Reconstruct state
        |
Generate decision
        |
Compare with previous state
        |
Create new state version
        |
Create audit record
```

Historical state must remain auditable.

------------------------------------------------------------------------

## 14. Replay

Replay must calculate the result from events.

It must not simply return the stored decision.

Recommended flow:

``` javascript
function replayThreat(events) {
  const orderedEvents = deterministicSort(events);
  let state = createInitialState();

  for (const event of orderedEvents) {
    state = applyEvent(state, event);
  }

  return generateDecision(state);
}
```

The replay result should be compared against the stored decision.

------------------------------------------------------------------------

## 15. Replay Fingerprint

Use a deterministic canonical representation of:

-   ordered events,
-   rule version,
-   resulting decision,
-   relevant decision metadata.

Then hash it with a deterministic hash implementation.

Example concept:

``` text
fingerprint =
hash(
  canonical(events)
  +
  canonical(ruleVersion)
  +
  canonical(decision)
)
```

Never claim a replay is verified unless the actual comparison has been
performed.

------------------------------------------------------------------------

## 16. Rule Versioning

Use a rule version such as:

``` text
v1
```

Store it with decisions/audits.

This allows the system to distinguish:

``` text
same events + same rules = expected replay match
```

from:

``` text
same events + changed rules = potentially different decision
```

Do not call a rule-version difference a replay failure without
explanation.

------------------------------------------------------------------------

## 17. REST API

### POST `/api/events`

Accept normalized or source-style event JSON and normalize it
internally.

Example:

``` json
{
  "source": "alienvault",
  "timestamp": "2024-06-01T12:00:00Z",
  "type": "ioc",
  "data": {
    "ip": "192.168.1.100",
    "threat_level": "high",
    "confidence": 0.8
  }
}
```

Expected response should communicate:

-   accepted/rejected
-   duplicate status
-   threat ID
-   state version
-   current decision

### GET `/api/threats/{id}`

Return:

-   threat ID
-   current decision
-   confidence
-   state version
-   evidence
-   audit history

### GET `/api/events`

Return ingested events.

Recommended optional filters:

``` text
?threatId=
?source=
?from=
?to=
```

### POST `/api/threats/{id}/replay`

Recommended signature endpoint.

Return:

-   stored decision
-   replayed decision
-   stored fingerprint
-   replay fingerprint
-   match status

------------------------------------------------------------------------

## 18. Frontend

Build a Security Decision Investigation Console, not a generic admin
panel.

Required views:

### Threat list

Show:

-   threat ID
-   current decision
-   confidence
-   state version
-   last update

### Threat detail

Show:

-   current decision
-   evidence
-   event timeline
-   audit history
-   replay status

### Replay

Show:

``` text
Original Decision
Replayed Decision
Fingerprint
MATCH / MISMATCH
```

------------------------------------------------------------------------

## 19. Signature Demo

The strongest demo:

1.  Start with an existing threat.
2.  Show conflicting evidence.
3.  Show why the source reliability rule selected the winning evidence.
4.  Submit the same event twice.
5.  Show duplicate detection.
6.  Inject a historical/late event.
7.  Show state reconstruction.
8.  Show state version changing.
9.  Open the audit record.
10. Replay the threat.
11. Show `REPLAY VERIFIED`.

Do not rely on fake animations or fake results.

------------------------------------------------------------------------

## 20. Required Edge Cases

At least five are required. Prefer eight:

1.  Duplicate event.
2.  Late event.
3.  Out-of-order events.
4.  Conflicting reports.
5.  Historical event invalidating a previous decision.
6.  Same timestamp.
7.  Low-confidence/high-severity conflict.
8.  Replay verification.

------------------------------------------------------------------------

## 21. Testing

### Unit tests

Test:

-   event normalization
-   validation
-   fingerprinting
-   deterministic ordering
-   source reliability
-   conflict resolution
-   state transitions
-   decision generation

### Integration tests

Test:

``` text
POST event
 -> MongoDB
 -> correlation
 -> state
 -> audit
```

### Replay tests

For every fixture:

``` text
events
 -> initial processing
 -> stored decision
 -> replay
 -> comparison
```

### E2E

Test:

``` text
React UI
 -> event ingestion
 -> threat view
 -> audit
 -> replay
```

### Performance

Generate at least 1,000 local events and measure actual throughput.

Do not claim `100+ events/sec` until measured.

------------------------------------------------------------------------

## 22. Security Rules

Never assume an incoming security event is trustworthy.

Apply:

-   schema validation
-   input size limits
-   controlled source values
-   timestamp validation
-   safe database operations
-   no secrets in repository
-   environment variables for local configuration
-   AI reports treated as untrusted evidence
-   immutable event records
-   rule/version metadata
-   error handling without sensitive leakage

Do not claim the system is completely secure.

------------------------------------------------------------------------

## 23. AI Boundary

The MVP explicitly prohibits ML/LLM inference.

Therefore:

### MVP

Treat AI reports as fixture events:

``` text
AI report fixture
 -> REST ingestion
 -> normalization
 -> correlation
```

### Bonus only if rules permit

An image-based AI agent may generate a threat report, which is then
validated and converted into an event.

The correlation engine must remain functional without AI inference.

------------------------------------------------------------------------

## 24. File Structure

``` text
threatchronicle/
├── backend/
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/
│   │   │   ├── event.routes.js
│   │   │   ├── threat.routes.js
│   │   │   └── replay.routes.js
│   │   ├── controllers/
│   │   │   ├── event.controller.js
│   │   │   ├── threat.controller.js
│   │   │   └── replay.controller.js
│   │   ├── models/
│   │   │   ├── Event.js
│   │   │   ├── ThreatState.js
│   │   │   └── AuditRecord.js
│   │   ├── services/
│   │   │   ├── ingestion.service.js
│   │   │   ├── normalization.service.js
│   │   │   ├── correlation.service.js
│   │   │   ├── state.service.js
│   │   │   ├── decision.service.js
│   │   │   └── replay.service.js
│   │   ├── engine/
│   │   │   ├── ordering.js
│   │   │   ├── rules.js
│   │   │   ├── resolver.js
│   │   │   └── stateMachine.js
│   │   ├── validators/
│   │   │   └── event.validator.js
│   │   └── utils/
│   │       ├── fingerprint.js
│   │       └── canonicalize.js
│   └── tests/
│       ├── unit/
│       ├── integration/
│       └── replay/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── hooks/
├── fixtures/
│   ├── duplicate.json
│   ├── late-event.json
│   ├── conflict.json
│   ├── invalidation.json
│   ├── replay.json
│   ├── same-timestamp.json
│   ├── ai-report.json
│   └── mixed-incident.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── TESTING.md
│   └── REPLAY.md
├── AGENT.md
├── AI_WORKFLOW.md
├── DEBUGGING.md
├── SECURITY.md
└── README.md
```

------------------------------------------------------------------------

## 25. Four-Hour Build Phases

### Phase 1 --- 0--20 minutes

-   repository
-   backend scaffold
-   frontend scaffold
-   MongoDB connection
-   base models

### Phase 2 --- 20--55 minutes

-   event API
-   validation
-   normalization
-   fingerprint
-   duplicate detection
-   persistence

### Phase 3 --- 55--100 minutes

-   deterministic sorting
-   state reconstruction
-   state versioning
-   source reliability

### Phase 4 --- 100--140 minutes

-   correlation
-   conflict resolution
-   decision engine

### Phase 5 --- 140--175 minutes

-   audit records
-   evidence lineage
-   decision fingerprints

### Phase 6 --- 175--205 minutes

-   replay endpoint
-   replay comparison
-   verification status

### Phase 7 --- 205--225 minutes

-   React threat list
-   threat detail
-   timeline
-   audit
-   replay

### Phase 8 --- 225--240 minutes

-   edge-case tests
-   security review
-   benchmark
-   demo rehearsal
-   README verification

------------------------------------------------------------------------

## 26. Git Milestones

Use genuine milestones:

``` text
feat: initialize threat correlation engine
feat: implement event ingestion and normalization
feat: add deterministic state reconstruction
feat: implement conflict resolution engine
feat: add decision audit trail
feat: implement replay verification
feat: add threat investigation dashboard
test: add edge case and replay test suite
security: harden event validation
docs: add architecture and verification documentation
```

Do not manufacture commits.

------------------------------------------------------------------------

## 27. Deployment / Submission

The challenge requires a **public GitHub repository URL**.

Because cloud services are prohibited, the challenge deployment model
should be local:

``` text
MongoDB
   |
Node/Express backend
   |
React frontend
```

The README must document:

1.  prerequisites
2.  clone
3.  dependency installation
4.  environment configuration
5.  MongoDB startup
6.  backend startup
7.  frontend startup
8.  fixture loading/execution
9.  tests
10. benchmark
11. demo sequence

Do not deploy the challenge system to a cloud service if that violates
the stated no-cloud constraint.

The GitHub repository is the required submission artifact.

------------------------------------------------------------------------

## 28. Non-Goals

Do not turn the project into:

-   a full SIEM
-   a full SOAR
-   a threat-intelligence marketplace
-   an LLM chatbot
-   a cloud security platform
-   a distributed event-processing platform
-   an EDR product
-   an ML classifier

ThreatChronicle is a deterministic threat decision/correlation engine.

------------------------------------------------------------------------

## 29. Definition of Done

The project is done only when:

-   valid events can be ingested;
-   invalid events are rejected;
-   events are normalized;
-   duplicates are idempotent;
-   events can arrive out of order;
-   late events trigger deterministic reconstruction;
-   conflicts resolve according to documented rules;
-   state versions are preserved;
-   audits explain decisions;
-   replay derives decisions from events;
-   replay can be verified;
-   automated tests pass;
-   fixtures cover edge cases;
-   actual performance is measured;
-   React exposes the investigation workflow;
-   README can reproduce the project;
-   no prohibited external dependency is required;
-   repository is ready for public submission.
