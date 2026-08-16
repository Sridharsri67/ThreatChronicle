# ThreatChronicle

## Real-Time AI-Driven Threat Correlation Engine with Replayable Audit and State Consistency

> **Every threat decision has a history. Every history can be
> replayed.**

ThreatChronicle is a local deterministic cybersecurity event-correlation
engine that ingests heterogeneous threat telemetry, normalizes it into a
canonical model, reconstructs evolving threat state, resolves
conflicting evidence using explicit rules, records an auditable decision
history, and replays historical events to verify that decisions are
reproducible.

------------------------------------------------------------------------

# 1. Problem

Real-world cybersecurity telemetry does not arrive as a clean
chronological stream.

A threat may receive:

-   multiple reports;
-   contradictory classifications;
-   duplicate events;
-   late-arriving historical events;
-   endpoint evidence;
-   threat-intelligence evidence;
-   AI-generated reports.

A basic dashboard can display those events, but it does not necessarily
answer:

-   Why was this threat blocked?
-   Which evidence mattered?
-   Which source won a conflict?
-   What happened when historical evidence arrived?
-   Can the original decision be reproduced?
-   Did the decision change because of new evidence or because of
    changed rules?

ThreatChronicle focuses on **decision integrity**.

------------------------------------------------------------------------

# 2. Solution

ThreatChronicle implements:

``` text
Event Ingestion
      ↓
Normalization
      ↓
Deduplication
      ↓
Deterministic Ordering
      ↓
State Reconstruction
      ↓
Correlation
      ↓
Conflict Resolution
      ↓
Decision
      ↓
Audit
      ↓
Replay
      ↓
Verification
```

The core design principle is:

> **Same events + same rule version = same decision and same replay
> result.**

------------------------------------------------------------------------

# 3. Challenge Alignment

The challenge requires a real-time threat correlation engine that:

-   accepts security event streams;
-   normalizes events;
-   reconstructs threat states;
-   handles late/out-of-order events;
-   handles duplicates;
-   handles conflicting reports;
-   creates deterministic decisions;
-   preserves audit history;
-   supports replay;
-   provides REST APIs;
-   supports React frontend;
-   works locally;
-   uses the specified technology stack;
-   includes automated tests;
-   includes sample edge cases;
-   is submitted through a public GitHub repository.

ThreatChronicle directly implements these requirements.

------------------------------------------------------------------------

# 4. Core Product

## Name

**ThreatChronicle**

## Category

Cybersecurity / Threat Intelligence / Event Correlation / Deterministic
Decisioning

## Primary user

SOC analyst / security analyst.

## One-line pitch

ThreatChronicle is a deterministic real-time threat correlation engine
that reconstructs evolving threat states from conflicting security
events and provides a replayable, auditable explanation for every
decision.

------------------------------------------------------------------------

# 5. Key Features

## Required MVP

-   REST event ingestion.
-   Canonical event normalization.
-   Invalid-event rejection.
-   Event fingerprinting.
-   Idempotent duplicate handling.
-   Time-ordered state reconstruction.
-   Late-event handling.
-   Out-of-order event handling.
-   Conflict resolution.
-   Deterministic decisioning.
-   Versioned threat state.
-   Immutable event history.
-   Audit trail.
-   Replay engine.
-   Replay verification.
-   Threat query API.
-   Event query API.
-   React investigation dashboard.
-   Automated tests.
-   Local fixtures.
-   Performance measurement.

## Optional

-   Multiple correlation strategies.
-   Threat-state visualization.
-   Advanced event graph.
-   What-if replay.
-   Image-based AI agent.

------------------------------------------------------------------------

# 6. Important Challenge Constraints

The MVP must use only:

-   React.js
-   Node.js
-   Express.js
-   MongoDB
-   Mongoose
-   REST APIs
-   JavaScript
-   Python

The challenge explicitly prohibits:

-   external APIs;
-   cloud services;
-   ML/LLM inference in MVP;
-   Kubernetes;
-   distributed systems.

Therefore:

### Security intelligence sources are simulated

Use local fixtures representing:

-   AlienVault;
-   VirusTotal;
-   AI-generated threat reports;
-   endpoint/EDR-style events where supported.

No external API dependency should be required to run or demonstrate the
project.

------------------------------------------------------------------------

# 7. AI Positioning

Despite the project title containing AI, the MVP explicitly prohibits
ML/LLM inference.

Therefore the MVP uses AI reports as an **input evidence type**, not as
an inference engine.

Example:

``` text
AI threat report fixture
        ↓
REST ingestion
        ↓
Validation
        ↓
Normalization
        ↓
Correlation
```

The core decision engine remains deterministic.

This makes the system demonstrable and compliant with the MVP
constraint.

------------------------------------------------------------------------

# 8. Architecture

``` text
                    ┌──────────────────┐
                    │ React Dashboard  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Express REST API │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        Event API       Threat API       Replay API
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                Threat Correlation Engine
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
      Validation        Normalization       Fingerprint
                             │
                             ▼
                    Immutable Event Store
                             │
                             ▼
                  Deterministic Ordering
                             │
                             ▼
                    State Reconstruction
                             │
                             ▼
                    Correlation Engine
                             │
                             ▼
                    Conflict Resolution
                             │
                             ▼
                     Decision Engine
                        /         \
                       /           \
                      ▼             ▼
              Threat State       Audit Record
                      |
                      ▼
                 Replay Engine
                      |
                      ▼
               Replay Verification
```

------------------------------------------------------------------------

# 9. Technology Stack

  Layer               Technology
  ------------------- ------------------------------------------------------
  Frontend            React.js
  Backend             Node.js
  API                 Express.js / REST
  Database            MongoDB
  ODM                 Mongoose
  Language            JavaScript
  Optional language   Python
  Testing             JavaScript test framework selected by implementation
  Source control      Git
  Submission          Public GitHub repository

No cloud deployment is required or recommended when it violates the
challenge's no-cloud constraint.

------------------------------------------------------------------------

# 10. Database Architecture

ThreatChronicle uses three primary MongoDB collections.

## 10.1 `events`

Immutable source events.

Example:

``` json
{
  "eventId": "evt_8f31",
  "fingerprint": "hash...",
  "source": "alienvault",
  "timestamp": "2024-06-01T12:00:00Z",
  "receivedAt": "2026-08-16T08:20:00Z",
  "type": "ioc",
  "threatId": "ip_192.168.1.100",
  "data": {
    "ip": "192.168.1.100",
    "threat_level": "high"
  },
  "normalizedData": {
    "indicatorType": "ip",
    "indicatorValue": "192.168.1.100"
  },
  "confidence": 0.8,
  "schemaVersion": 1
}
```

Indexes:

``` text
fingerprint UNIQUE
threatId
timestamp
source
```

------------------------------------------------------------------------

## 10.2 `threat_states`

Current materialized state.

Example:

``` json
{
  "threatId": "ip_192.168.1.100",
  "version": 7,
  "decision": "blocked",
  "confidence": 0.95,
  "evidence": [
    "evt_8f31"
  ],
  "firstSeen": "2024-06-01T10:00:00Z",
  "lastEventTime": "2024-06-01T12:10:00Z",
  "decisionFingerprint": "hash...",
  "ruleVersion": "v1"
}
```

Index:

``` text
threatId UNIQUE
```

------------------------------------------------------------------------

## 10.3 `audit_records`

Historical decision records.

Example:

``` json
{
  "threatId": "ip_192.168.1.100",
  "stateVersion": 7,
  "decision": "blocked",
  "confidence": 0.95,
  "eventIds": [
    "evt_1",
    "evt_2",
    "evt_3"
  ],
  "resolutionSteps": [
    "Conflict detected",
    "Source reliability applied",
    "AlienVault selected"
  ],
  "rulesApplied": [
    "sourceReliability",
    "timestamp",
    "confidence"
  ],
  "previousDecision": "monitor",
  "changed": true,
  "replayFingerprint": "hash...",
  "ruleVersion": "v1"
}
```

Indexes:

``` text
threatId
threatId + stateVersion
```

------------------------------------------------------------------------

# 11. Canonical Event Schema

Input example:

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

Normalized internal representation:

``` json
{
  "eventId": "evt_8f31",
  "source": "alienvault",
  "timestamp": "2024-06-01T12:00:00Z",
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

------------------------------------------------------------------------

# 12. Deterministic Ordering

Use:

``` text
1. Event timestamp ASC
2. Source reliability DESC
3. Confidence DESC
4. Event ID ASC
```

Source reliability:

``` text
alienvault > virus_total > ai_report
```

The event ID is the final deterministic tie-breaker.

This prevents two identical-time events from producing different
decisions.

------------------------------------------------------------------------

# 13. Correlation and Decision

For each threat:

``` text
Load events
  ↓
Normalize/canonicalize
  ↓
Sort
  ↓
Group evidence
  ↓
Detect conflicts
  ↓
Apply source reliability
  ↓
Apply timestamp
  ↓
Apply confidence
  ↓
Generate decision
```

Example conceptual output:

``` json
{
  "threat_id": "ip_192.168.1.100",
  "decision": "blocked",
  "confidence": 0.95,
  "evidence": [
    "alienvault_high",
    "ai_report_phishing"
  ]
}
```

The exact decision mapping must be implemented as explicit, documented
rules and covered by tests.

------------------------------------------------------------------------

# 14. State Reconstruction

A late event must be inserted according to its event timestamp rather
than simply appended.

Example:

``` text
Existing:
12:00
12:05
12:10

Late event:
10:00
```

The engine:

``` text
stores event
    ↓
loads threat history
    ↓
sorts all events
    ↓
replays them
    ↓
reconstructs state
    ↓
generates decision
    ↓
creates new state version
    ↓
creates audit
```

Previous state remains represented by its version/audit history.

------------------------------------------------------------------------

# 15. Idempotency

Each canonical event receives a deterministic fingerprint.

First submission:

``` text
accepted = true
duplicate = false
```

Same event submitted again:

``` text
accepted = true/handled
duplicate = true
```

No duplicate state effect should occur.

A unique MongoDB fingerprint index should reinforce application-level
duplicate handling.

------------------------------------------------------------------------

# 16. Replay

Replay must derive a decision from events.

It should not simply return the current state.

Conceptually:

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

Replay result:

``` text
Stored decision
      vs
Replayed decision
```

------------------------------------------------------------------------

# 17. Replay Verification

Recommended endpoint:

``` http
POST /api/threats/{id}/replay
```

Response:

``` json
{
  "match": true,
  "storedDecision": "blocked",
  "replayedDecision": "blocked",
  "storedFingerprint": "hash...",
  "replayFingerprint": "hash..."
}
```

Dashboard:

``` text
✓ REPLAY VERIFIED

Original:
BLOCKED

Replay:
BLOCKED

Fingerprint:
MATCH
```

------------------------------------------------------------------------

# 18. Rule Versioning

Store:

``` text
ruleVersion = v1
```

A historical replay using the same events and same rule version should
reproduce the same decision.

If rules change:

``` text
Events + v1 → BLOCKED
Events + v2 → MONITOR
```

This should be explained as a rule-version difference.

------------------------------------------------------------------------

# 19. REST API

## `POST /api/events`

Purpose: ingest a security event.

Example request:

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

Expected response should include:

``` json
{
  "accepted": true,
  "duplicate": false,
  "threatId": "ip_192.168.1.100",
  "stateVersion": 1,
  "decision": "blocked"
}
```

------------------------------------------------------------------------

## `GET /api/threats/{id}`

Returns:

-   current decision;
-   confidence;
-   state version;
-   evidence;
-   audit history.

------------------------------------------------------------------------

## `GET /api/events`

Returns ingested events.

Recommended filters:

``` text
?threatId=
?source=
?from=
?to=
```

------------------------------------------------------------------------

## `POST /api/threats/{id}/replay`

Returns:

-   stored decision;
-   replayed decision;
-   stored fingerprint;
-   replay fingerprint;
-   match status.

------------------------------------------------------------------------

# 20. Frontend

The React frontend is a security investigation console.

## Threat List

Display:

-   threat identifier;
-   decision;
-   confidence;
-   state version;
-   latest event.

## Threat Detail

Display:

-   decision;
-   evidence;
-   timeline;
-   audit;
-   conflict explanation;
-   replay.

## Replay

Display:

-   original decision;
-   replay decision;
-   fingerprint;
-   MATCH/MISMATCH.

------------------------------------------------------------------------

# 21. File Structure

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

# 22. Development Phases

## Phase 1 --- Foundation

-   initialize repository;
-   scaffold backend;
-   scaffold frontend;
-   configure MongoDB;
-   create models.

## Phase 2 --- Event Ingestion

-   validation;
-   normalization;
-   fingerprinting;
-   duplicate detection;
-   persistence.

## Phase 3 --- State Engine

-   deterministic sorting;
-   state reconstruction;
-   versioning;
-   source reliability.

## Phase 4 --- Decision Engine

-   correlation;
-   conflict detection;
-   conflict resolution;
-   decision generation.

## Phase 5 --- Audit

-   evidence;
-   rules;
-   previous decision;
-   current decision;
-   state version;
-   fingerprint.

## Phase 6 --- Replay

-   replay service;
-   replay endpoint;
-   fingerprint comparison;
-   verification.

## Phase 7 --- Dashboard

-   threat list;
-   threat details;
-   timeline;
-   audit;
-   replay.

## Phase 8 --- Verification

-   edge-case tests;
-   security tests;
-   performance benchmark;
-   demo rehearsal;
-   documentation.

------------------------------------------------------------------------

# 23. Four-Hour MVP Plan

### 0--20 min

Scaffold and MongoDB.

### 20--55 min

Event ingestion, validation, normalization, fingerprinting.

### 55--100 min

State reconstruction and deterministic ordering.

### 100--140 min

Correlation and conflict resolution.

### 140--175 min

Audit layer.

### 175--205 min

Replay and verification.

### 205--225 min

React dashboard.

### 225--240 min

Testing, debugging, security, benchmark, demo.

------------------------------------------------------------------------

# 24. MUST BUILD

-   event API;
-   validation;
-   normalization;
-   fingerprinting;
-   duplicate handling;
-   deterministic ordering;
-   state reconstruction;
-   conflict resolution;
-   decision engine;
-   versioning;
-   audit;
-   replay;
-   replay verification;
-   React dashboard;
-   automated tests;
-   five or more edge-case fixtures.

------------------------------------------------------------------------

# 25. SHOULD BUILD

-   timeline;
-   decision explanation;
-   source ranking visualization;
-   state-version display;
-   replay badge;
-   performance metric.

------------------------------------------------------------------------

# 26. IF TIME REMAINS

-   rule versioning UI;
-   what-if replay;
-   multiple correlation strategies;
-   advanced graph;
-   image-based AI report generation if permitted.

------------------------------------------------------------------------

# 27. DO NOT BUILD

-   real AlienVault integration;
-   real VirusTotal integration;
-   external AI API;
-   LLM inference;
-   ML model;
-   Kubernetes;
-   Kafka;
-   Redis;
-   microservices;
-   real EDR;
-   complex authentication;
-   cloud infrastructure.

------------------------------------------------------------------------

# 28. Test Strategy

## Unit

-   normalization;
-   validation;
-   fingerprint;
-   ordering;
-   source ranking;
-   conflict resolution;
-   state transitions;
-   decision logic.

## Integration

``` text
POST event
 -> database
 -> correlation
 -> state
 -> audit
```

## Replay

``` text
fixture
 -> process
 -> stored decision
 -> replay
 -> comparison
```

## E2E

``` text
React
 -> API
 -> threat
 -> audit
 -> replay
```

------------------------------------------------------------------------

# 29. Required Edge Cases

### 1. Duplicate

Same event submitted twice.

Expected:

``` text
duplicate detected
no duplicate state effect
```

### 2. Out-of-order

Events arrive:

``` text
12:00
10:00
11:00
```

Expected deterministic order:

``` text
10:00
11:00
12:00
```

### 3. Conflict

``` text
AlienVault → HIGH
VirusTotal → LOW
AI Report → PHISHING
```

Expected documented source reliability resolution.

### 4. Late event

Historical event arrives after newer events.

Expected state reconstruction.

### 5. State invalidation

Historical evidence changes the reconstructed decision.

Expected:

``` text
previous version preserved
new version generated
audit explains change
```

### 6. Same timestamp

Use deterministic tie-breaking.

### 7. AI report

AI report is accepted as evidence but does not perform runtime
inference.

### 8. Replay

Stored decision and replay decision match under the same rule version.

------------------------------------------------------------------------

# 30. Performance

> 100+ events/sec locally.

### Measured Empirical Throughput

The benchmark test (`npm run test:benchmark`) runs 150 events across multiple threats in batch mode against MongoDB:

```text
[Benchmark Performance] Processed 150 events in 32ms => 4,687.50 events/sec
```

This exceeds the 100+ events/sec local target by **>40x**.

------------------------------------------------------------------------

# 31. Security

ThreatChronicle treats incoming telemetry as untrusted.

Controls:

-   schema validation;
-   payload limits;
-   source validation;
-   timestamp validation;
-   confidence validation;
-   safe database operations;
-   immutable event records;
-   protected audit path;
-   deterministic replay;
-   `.env` exclusion;
-   no secrets in Git;
-   AI report treated as untrusted data.

See `SECURITY.md`.

------------------------------------------------------------------------

# 32. Debugging

The debugging pipeline is:

``` text
Input
 ↓
Validation
 ↓
Normalization
 ↓
Fingerprint
 ↓
Persistence
 ↓
Ordering
 ↓
Correlation
 ↓
Decision
 ↓
Audit
 ↓
Replay
```

See `DEBUGGING.md`.

------------------------------------------------------------------------

# 33. AI Development

AI may assist with:

-   architecture;
-   coding;
-   testing ideas;
-   debugging;
-   documentation.

Human engineers remain responsible for:

-   architecture;
-   rules;
-   security;
-   testing;
-   verification;
-   performance claims;
-   final submission.

See `AI_WORKFLOW.md`.

------------------------------------------------------------------------

# 34. Git Milestones

Recommended genuine milestones:

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

Do not create meaningless commits merely to increase commit count.

------------------------------------------------------------------------

# 35. Local Setup

## Prerequisites

- Node.js (v18+)
- npm
- MongoDB (running locally on `mongodb://127.0.0.1:27017`)

------------------------------------------------------------------------

## Installation

```bash
# Install root, backend, and frontend dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

------------------------------------------------------------------------

## Running the Application

### 1. Start Backend Engine (Port 5001)
```bash
npm run start:backend
# Engine will connect to MongoDB on mongodb://127.0.0.1:27017/threatchronicle
```

### 2. Start Frontend Console (Port 5173)
```bash
npm run dev:frontend
# Console accessible at http://localhost:5173
```

### 3. Load Fixtures via API (Optional)
```bash
curl -X POST -H "Content-Type: application/json" -d '{"name": "all"}' http://localhost:5001/api/fixtures/load
```

------------------------------------------------------------------------

# 36. Running Tests

Run the complete test suite (unit tests + integration tests + replay verification + benchmark):

```bash
npm test
```

Run the performance benchmark specifically:

```bash
npm run test:benchmark
```

Test coverage includes:
- `unit/ordering.test.js`: 4-tier deterministic event sorting.
- `unit/fingerprint.test.js`: SHA-256 event & decision checksum hashing.
- `unit/resolver.test.js`: Source hierarchy conflict resolution (`alienvault > virus_total > ai_report`).
- `integration/ingestion.test.js`: Ingestion schema validation and duplicate event rejection.
- `integration/replay.test.js`: Full threat state reconstruction & decision fingerprint verification.
- `integration/benchmark.test.js`: Throughput measurement (>4,600 events/sec).

------------------------------------------------------------------------

# 37. Fixture Data

Fixtures should be stored under:

``` text
fixtures/
```

Recommended:

``` text
duplicate.json
late-event.json
conflict.json
invalidation.json
replay.json
same-timestamp.json
ai-report.json
mixed-incident.json
```

Each fixture should have a documented expected result.

Do not fabricate observed results. Expected results are test
specifications; observed results must come from actual execution.

------------------------------------------------------------------------

# 38. Generated Audit Outputs

The repository should include representative generated audit outputs
where the challenge requires them.

They should be generated from the actual implementation.

Do not manually fabricate audit output that claims a test was executed
when it was not.

------------------------------------------------------------------------

# 39. Signature Demo

### Step 1

Show:

``` text
192.168.1.100
BLOCKED
v3
```

### Step 2

Show conflicting evidence.

### Step 3

Show source reliability resolution.

### Step 4

Submit duplicate.

Show:

``` text
DUPLICATE
No state change
```

### Step 5

Inject late event.

Show:

``` text
Late event
State reconstruction
v3 → v4
```

### Step 6

Open audit.

Show:

``` text
Events
Rules
Evidence
Previous decision
New decision
```

### Step 7

Click replay.

Show:

``` text
Original: MONITOR
Replay: MONITOR
Fingerprint: MATCH
✓ REPLAY VERIFIED
```

------------------------------------------------------------------------

# 40. Why the Project Is Different

Common competitors may build:

``` text
events → dashboard
```

or:

``` text
events → AI → threat
```

ThreatChronicle instead builds:

``` text
events
 ↓
deterministic state
 ↓
decision
 ↓
evidence lineage
 ↓
audit
 ↓
replay verification
```

The competitive moat is **deterministic evidence lineage**.

------------------------------------------------------------------------

# 41. Final Submission Checklist

## Functionality

-   [ ] REST ingestion works.
-   [ ] Normalization works.
-   [ ] Invalid events are rejected.
-   [ ] Duplicate events are idempotent.
-   [ ] Late events are supported.
-   [ ] Out-of-order events are supported.
-   [ ] Conflicts are resolved deterministically.
-   [ ] State versions are preserved.
-   [ ] Decisions are generated.
-   [ ] Audits are generated.
-   [ ] Replay works.
-   [ ] Replay verification works.

## Testing

-   [ ] Duplicate test.
-   [ ] Late-event test.
-   [ ] Out-of-order test.
-   [ ] Conflict test.
-   [ ] State invalidation test.
-   [ ] Replay test.
-   [ ] Same-timestamp test.
-   [ ] Validation test.
-   [ ] Security tests.
-   [ ] Performance benchmark.

## Security

-   [ ] `.env` excluded.
-   [ ] No secrets committed.
-   [ ] Input validation.
-   [ ] Payload limits.
-   [ ] Source validation.
-   [ ] Safe DB operations.
-   [ ] Immutable event behavior.
-   [ ] Protected audit behavior.
-   [ ] AI reports treated as untrusted data.

## Documentation

-   [ ] README.md
-   [ ] AGENT.md
-   [ ] AI_WORKFLOW.md
-   [ ] DEBUGGING.md
-   [ ] SECURITY.md
-   [ ] Architecture documentation.
-   [ ] Testing documentation.
-   [ ] Replay documentation.

## GitHub

-   [ ] Public repository.
-   [ ] Clean repository.
-   [ ] Meaningful Git history.
-   [ ] Fixtures included.
-   [ ] Tests included.
-   [ ] Setup instructions work.
-   [ ] Challenge constraints followed.

## Demo

-   [ ] Conflict demonstrated.
-   [ ] Duplicate demonstrated.
-   [ ] Late event demonstrated.
-   [ ] State version demonstrated.
-   [ ] Audit demonstrated.
-   [ ] Replay demonstrated.
-   [ ] Replay MATCH demonstrated.

------------------------------------------------------------------------

# 42. Limitations

The MVP intentionally does not provide:

-   live external threat-intelligence APIs;
-   cloud deployment;
-   ML/LLM inference;
-   distributed event processing;
-   Kubernetes;
-   real EDR integrations.

These limitations are consistent with the challenge constraints.

------------------------------------------------------------------------

# 43. Final Project Statement

ThreatChronicle is designed around one central property:

> **A security decision should not merely exist; it should be
> reproducible and explainable.**

The system therefore treats events as immutable evidence, threat state
as derived state, decisions as deterministic outputs, and audits as
evidence lineage.

The strongest demonstration is not an AI-generated classification.

It is:

``` text
Late historical evidence arrives
        ↓
Threat state is reconstructed
        ↓
Decision changes when the rules/evidence require it
        ↓
Previous decision remains auditable
        ↓
The system replays the complete event history
        ↓
The replay reproduces the decision
        ↓
✓ REPLAY VERIFIED
```

This directly demonstrates the core challenge requirements: real-time
ingestion, deterministic correlation, state consistency, conflict
handling, auditability, and replayability.
