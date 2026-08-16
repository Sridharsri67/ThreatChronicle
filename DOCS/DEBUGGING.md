# ThreatChronicle --- DEBUGGING.md

## 1. Purpose

This guide provides a structured debugging process for ThreatChronicle.

The most important debugging rule is:

> Never debug only the final decision. Trace the complete event → state
> → decision → audit → replay pipeline.

------------------------------------------------------------------------

## 2. System Debugging Model

``` text
Incoming Event
      ↓
Validation
      ↓
Normalization
      ↓
Fingerprint
      ↓
Duplicate Detection
      ↓
Persistence
      ↓
Deterministic Ordering
      ↓
Correlation
      ↓
State Reconstruction
      ↓
Decision
      ↓
Audit
      ↓
Materialized State
      ↓
Replay
      ↓
Verification
```

A failure can occur at any layer.

------------------------------------------------------------------------

## 3. Standard Debugging Order

When a result is incorrect:

1.  Confirm the input event.
2.  Confirm validation.
3.  Confirm normalized fields.
4.  Confirm event fingerprint.
5.  Confirm duplicate status.
6.  Confirm MongoDB persistence.
7.  Confirm events loaded for the threat.
8.  Confirm deterministic ordering.
9.  Confirm source ranking.
10. Confirm conflict-resolution output.
11. Confirm state transition.
12. Confirm decision.
13. Confirm audit record.
14. Confirm materialized state.
15. Run replay.
16. Compare replay output.

Do not change rules before determining which layer failed.

------------------------------------------------------------------------

## 4. Common Failure: Event Rejected

### Symptoms

`POST /api/events` returns an error.

### Check

-   source exists;
-   timestamp is valid ISO-8601;
-   event type is supported;
-   required threat indicator exists;
-   confidence is numeric and within the expected range;
-   payload is valid JSON.

### Debug evidence

Log structured validation errors, not sensitive payloads.

------------------------------------------------------------------------

## 5. Common Failure: Duplicate Not Detected

### Symptoms

The same event creates multiple effects.

### Check

1.  Are identical events producing the same canonical representation?
2.  Is the fingerprint generated before persistence?
3.  Is `fingerprint` unique in MongoDB?
4.  Is duplicate handling performed before state mutation?
5.  Does a duplicate generate an audit/state change?

Expected behavior:

``` text
Second submission
    ↓
same fingerprint
    ↓
duplicate=true
    ↓
no duplicate state effect
```

------------------------------------------------------------------------

## 6. Common Failure: Replay Produces Different Decision

This is a critical failure.

### First checks

-   Are events sorted identically?
-   Is there an explicit tie-breaker?
-   Is source reliability deterministic?
-   Is confidence comparison deterministic?
-   Is the rule version identical?
-   Is current time used anywhere?
-   Is random data used?
-   Does MongoDB query use explicit sorting?
-   Is object iteration order influencing the decision?
-   Is replay reading current state instead of rebuilding from events?

### Correct principle

``` text
Replay(events, ruleVersion)
```

must not depend on:

``` text
CurrentMaterializedState
```

for its final decision.

------------------------------------------------------------------------

## 7. Common Failure: Late Event Does Not Change State

### Check

-   event timestamp;
-   received timestamp;
-   threat ID;
-   whether the event was actually stored;
-   whether all threat events are loaded;
-   whether sorting uses event timestamp;
-   whether reconstruction is triggered;
-   whether a new state version is created;
-   whether the decision genuinely should change under the configured
    rules.

Not every late event must change the final decision.

------------------------------------------------------------------------

## 8. Common Failure: Out-of-Order Events

Example:

``` text
12:00
10:00
11:00
```

Expected deterministic processing:

``` text
10:00
11:00
12:00
```

If equal timestamps exist, apply the documented tie-breaker.

Never rely on insertion order.

------------------------------------------------------------------------

## 9. Common Failure: Conflict Resolution Wrong

### Check source ranking

``` text
alienvault = 3
virus_total = 2
ai_report = 1
```

Then verify the documented precedence order.

The challenge specifies source reliability before timestamp and
confidence.

Do not silently change this order.

------------------------------------------------------------------------

## 10. Common Failure: State Version Does Not Increment

Check:

-   previous state exists;
-   reconstructed state differs where a version change is expected;
-   state update logic runs;
-   version is incremented transactionally/consistently;
-   audit record uses the same version;
-   duplicate events are not incorrectly incrementing state.

------------------------------------------------------------------------

## 11. Common Failure: Audit Missing Evidence

The audit should contain:

-   threat ID;
-   state version;
-   events considered;
-   event IDs;
-   resolution logic;
-   winning evidence;
-   previous decision;
-   current decision;
-   rule version;
-   replay fingerprint where applicable;
-   decision timestamp.

Never store only:

``` text
decision = BLOCKED
```

That is not sufficient auditability.

------------------------------------------------------------------------

## 12. Common Failure: Replay Says MATCH but Logic Is Wrong

A matching fingerprint only proves consistency with the same
implementation inputs/rules.

It does not prove the business rule is correct.

Therefore verification has two layers:

``` text
Layer 1:
Replay consistency

Layer 2:
Expected behavior test
```

Example:

``` text
Fixture expectation:
AlienVault wins over AI report

Replay:
MATCH

Test:
PASS
```

Both matter.

------------------------------------------------------------------------

## 13. MongoDB Debugging

Check collections:

``` text
events
threat_states
audit_records
```

Check indexes.

Important indexes:

``` text
events.fingerprint UNIQUE
events.threatId
events.timestamp
events.source

threat_states.threatId UNIQUE

audit_records.threatId
audit_records.threatId + stateVersion
```

Do not remove unique indexes to hide duplicate problems.

------------------------------------------------------------------------

## 14. API Debugging

### POST `/api/events`

Verify:

``` text
HTTP status
accepted
duplicate
threatId
stateVersion
decision
```

### GET `/api/threats/:id`

Verify:

``` text
current state
evidence
audit
version
```

### GET `/api/events`

Verify:

``` text
stored normalized events
```

### POST `/api/threats/:id/replay`

Verify:

``` text
stored decision
replayed decision
stored fingerprint
replay fingerprint
match
```

------------------------------------------------------------------------

## 15. Frontend Debugging

Check in this order:

1.  backend is running;
2.  API endpoint is reachable;
3.  response JSON shape matches frontend expectation;
4.  React state updates;
5.  threat list renders;
6.  selected threat loads;
7.  audit data renders;
8.  replay request completes;
9.  replay result renders.

Do not debug CSS first when the API is failing.

------------------------------------------------------------------------

## 16. Performance Debugging

Target:

``` text
100+ events/sec locally
```

Measure actual throughput.

Do not optimize blindly.

Measure:

-   request processing time;
-   normalization time;
-   MongoDB write time;
-   threat-event query time;
-   reconstruction time;
-   decision time.

If performance is poor:

1.  inspect indexes;
2.  reduce unnecessary database reads;
3.  avoid repeated full scans where unnecessary;
4.  use efficient projections;
5.  batch test data;
6.  profile before rewriting architecture.

Do not introduce distributed infrastructure.

------------------------------------------------------------------------

## 17. Debug Logging

Use structured logs such as:

``` text
EVENT_RECEIVED
EVENT_NORMALIZED
DUPLICATE_DETECTED
EVENT_PERSISTED
THREAT_RECONSTRUCTION_STARTED
THREAT_RECONSTRUCTION_COMPLETED
DECISION_GENERATED
AUDIT_CREATED
REPLAY_STARTED
REPLAY_COMPLETED
REPLAY_MATCH
REPLAY_MISMATCH
```

Include:

-   event ID;
-   threat ID;
-   state version;
-   rule version;
-   processing duration.

Do not log secrets.

------------------------------------------------------------------------

## 18. Debugging Checklist

### Event

-   [ ] Valid JSON
-   [ ] Required fields
-   [ ] Correct source
-   [ ] Correct timestamp
-   [ ] Correct threat ID
-   [ ] Valid confidence

### Persistence

-   [ ] Event stored
-   [ ] Fingerprint stored
-   [ ] Duplicate index active
-   [ ] Correct indexes

### State

-   [ ] All events loaded
-   [ ] Deterministic ordering
-   [ ] Rules applied
-   [ ] Version correct

### Decision

-   [ ] Evidence correct
-   [ ] Conflict resolution correct
-   [ ] Decision correct
-   [ ] Confidence correct

### Audit

-   [ ] Inputs recorded
-   [ ] Rules recorded
-   [ ] Previous state recorded
-   [ ] New state recorded
-   [ ] Fingerprint recorded

### Replay

-   [ ] Same events
-   [ ] Same ordering
-   [ ] Same rule version
-   [ ] Same decision
-   [ ] Fingerprint match

------------------------------------------------------------------------

## 19. Regression Principle

Every important bug should become a test.

Examples:

``` text
Bug:
same-timestamp events produced different results.

Fix:
event ID tie-breaker.

Regression test:
same timestamp + same source + same confidence.
```

Do not rely on manually remembering bugs.

------------------------------------------------------------------------

## 20. Debugging Definition of Done

A bug is resolved only when:

-   root cause is identified;
-   implementation is corrected;
-   relevant automated test exists;
-   affected edge cases pass;
-   replay still works;
-   security implications are checked;
-   no unrelated behavior regressed.
