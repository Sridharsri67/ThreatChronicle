# ThreatChronicle --- SECURITY.md

## 1. Security Scope

ThreatChronicle processes cybersecurity telemetry and therefore must
treat incoming events as untrusted data.

The system is designed for a local hackathon/MVP environment and is not
claimed to be completely secure or production-hardened.

The challenge prohibits external APIs and cloud services, so the
security model focuses on the local application, database, API,
fixtures, and deterministic processing engine.

------------------------------------------------------------------------

## 2. Security Objectives

The system should protect:

1.  Event integrity.
2.  State consistency.
3.  Audit integrity.
4.  Replay correctness.
5.  Database integrity.
6.  API availability.
7.  Confidential configuration.
8.  Rule transparency.
9.  AI-report trust boundaries.

------------------------------------------------------------------------

## 3. Trust Boundaries

``` text
Untrusted Event Source
        |
        v
Express REST API
        |
        | validation boundary
        v
Canonical Event Model
        |
        v
Correlation Engine
        |
        +--------+
        |        |
        v        v
MongoDB      Decision Engine
                |
                v
             Audit
```

Anything entering through the API must be treated as untrusted.

------------------------------------------------------------------------

## 4. Sensitive Data

Potentially sensitive data includes:

-   endpoint telemetry;
-   IP addresses;
-   domains;
-   hashes;
-   threat reports;
-   internal identifiers;
-   local configuration;
-   database credentials.

Use synthetic fixture data for the challenge.

Do not commit:

``` text
.env
database credentials
API keys
passwords
private certificates
```

------------------------------------------------------------------------

## 5. Input Validation

Validate:

-   JSON structure;
-   required fields;
-   source;
-   timestamp;
-   event type;
-   threat indicator;
-   confidence;
-   data types;
-   maximum payload size.

Reject malformed events.

Do not allow arbitrary fields to influence decision logic unless
explicitly supported.

------------------------------------------------------------------------

## 6. Source Validation

Only configured sources should be accepted.

Expected challenge sources include:

``` text
alienvault
virus_total
ai_report
```

Additional EDR-style fixtures may be used if explicitly supported by the
implementation.

Unknown sources should be rejected or handled according to an explicitly
documented policy.

Do not silently assign trusted reliability to unknown sources.

------------------------------------------------------------------------

## 7. Duplicate Protection

Every canonical event should receive a deterministic fingerprint.

Use a unique database constraint:

``` text
events.fingerprint = UNIQUE
```

Expected behavior:

``` text
First event:
accepted

Same event:
duplicate

Duplicate:
no duplicate state effect
```

Idempotency is a security and consistency requirement.

------------------------------------------------------------------------

## 8. Timestamp Security

Timestamps influence state reconstruction.

Validate:

-   valid format;
-   valid date;
-   reasonable data type.

Do not allow system processing time to replace event time for historical
ordering.

Store both:

``` text
event timestamp
received timestamp
```

This makes late-event behavior observable.

------------------------------------------------------------------------

## 9. Deterministic Ordering Security

Do not allow ambiguous ordering.

Recommended:

``` text
timestamp ASC
source reliability DESC
confidence DESC
event ID ASC
```

Every tie must have a deterministic resolution.

Avoid:

-   random ordering;
-   implicit database ordering;
-   asynchronous completion order;
-   current wall-clock time in historical decision logic.

------------------------------------------------------------------------

## 10. Conflict Resolution Security

The source reliability rule is explicitly defined by the challenge:

``` text
alienvault > virus_total > ai_report
```

Do not let an incoming event change the reliability hierarchy
dynamically unless the product specification explicitly introduces a
configuration mechanism.

Record the resolution logic in the audit.

------------------------------------------------------------------------

## 11. AI Report Security

AI reports are untrusted evidence.

In the MVP:

``` text
AI Report Fixture
       ↓
Validation
       ↓
Normalization
       ↓
Correlation
```

Do not allow an AI report to execute:

-   database queries;
-   shell commands;
-   arbitrary code;
-   API calls;
-   system actions.

The AI report should be data, not an instruction.

------------------------------------------------------------------------

## 12. Prompt Injection

Because the MVP does not perform LLM inference, runtime prompt injection
is not part of the core MVP execution path.

If an optional AI component is later added:

-   treat image/report content as untrusted;
-   separate data from instructions;
-   validate structured AI output;
-   restrict tools;
-   require schema validation;
-   do not allow direct privileged actions;
-   keep correlation decisions deterministic.

------------------------------------------------------------------------

## 13. Database Security

Use Mongoose schema validation.

Avoid unsafe construction of queries from arbitrary request input.

Use:

-   explicit query fields;
-   schema validation;
-   projection where appropriate;
-   indexes;
-   controlled update operations.

Historical events should not be overwritten as part of normal state
updates.

------------------------------------------------------------------------

## 14. Event Immutability

The event store is the foundation of replayability.

Normal application logic should:

``` text
INSERT event
```

rather than:

``` text
UPDATE historical event
```

If an event is invalid or needs correction, preserve the original record
and use a new explicitly defined event/correction mechanism if such a
feature is later introduced.

------------------------------------------------------------------------

## 15. Audit Integrity

Audit records should capture:

-   event IDs;
-   resolution steps;
-   rules;
-   rule version;
-   previous decision;
-   new decision;
-   state version;
-   timestamps;
-   replay fingerprint.

The audit should not be editable through ordinary user APIs.

------------------------------------------------------------------------

## 16. Rule Version Security

Store the rule version used for a decision.

Example:

``` text
ruleVersion = v1
```

This prevents confusion when future rule changes produce different
replay outcomes.

A historical decision should be interpreted in the context of the rule
version that produced it.

------------------------------------------------------------------------

## 17. API Security

At minimum:

-   validate request body;
-   limit request size;
-   reject unsupported content types;
-   validate route parameters;
-   avoid leaking stack traces in production-like responses;
-   return appropriate HTTP status codes;
-   avoid exposing database internals.

Authentication is not specified as a mandatory challenge requirement. Do
not build a large authentication system at the expense of the required
deterministic engine.

If authentication is added, keep it minimal and document it.

------------------------------------------------------------------------

## 18. Error Handling

Do not return:

-   MongoDB credentials;
-   stack traces containing secrets;
-   internal filesystem paths where avoidable;
-   environment variables;
-   sensitive event data unnecessarily.

Return useful but controlled errors.

------------------------------------------------------------------------

## 19. Dependency Security

Use only dependencies required by the implementation.

Before submission:

-   inspect `package.json`;
-   remove unused dependencies;
-   review known security warnings where tooling is available;
-   avoid abandoned packages where a maintained standard option exists.

Do not add a dependency merely because it is trendy.

------------------------------------------------------------------------

## 20. Secrets

Use environment variables for local configuration.

Example:

``` text
MONGO_URI
PORT
```

Use a `.env.example` containing placeholders:

``` text
MONGO_URI=mongodb://localhost:27017/threatchronicle
PORT=5000
```

Never commit the actual `.env`.

------------------------------------------------------------------------

## 21. Performance / Availability Security

The challenge requires 100+ events/sec locally.

Potential availability risks:

-   oversized payloads;
-   excessive duplicate requests;
-   expensive full-threat reconstruction;
-   unindexed MongoDB queries.

Mitigations:

-   payload limits;
-   indexes;
-   efficient event queries;
-   bounded fixture sizes;
-   deterministic processing;
-   benchmark before submission.

Do not introduce distributed infrastructure.

------------------------------------------------------------------------

## 22. Security Test Cases

### Invalid event

Expected:

``` text
HTTP 400
No event persisted
No state change
```

### Duplicate event

Expected:

``` text
duplicate=true
No duplicate state effect
```

### Unknown source

Expected:

``` text
Rejected or explicitly handled
```

### Malformed timestamp

Expected:

``` text
Rejected
```

### Invalid confidence

Expected:

``` text
Rejected
```

### Oversized payload

Expected:

``` text
Rejected
```

### Injection-like input

Expected:

``` text
Treated as data
No unintended query execution
```

------------------------------------------------------------------------

## 23. Security Verification Matrix

  ------------------------------------------------------------------------
  Threat            Impact            Mitigation         Verification
  ----------------- ----------------- ------------------ -----------------
  Malformed event   Engine failure    Schema validation  Invalid-event
                                                         test

  Duplicate event   State corruption  Fingerprint +      Duplicate test
                                      unique index       

  Timestamp abuse   Incorrect         Timestamp          Timestamp tests
                    reconstruction    validation         

  Unknown source    Incorrect trust   Source allowlist   Source test

  Payload           Availability      Request limits     Payload test
  exhaustion                                             

  Database          Data compromise   Controlled queries Injection test
  injection                                              

  Audit tampering   Loss of trust     Immutable audit    API test
                                      path               

  Replay mismatch   Incorrect         Deterministic      Replay tests
                    verification      replay             

  AI report         Incorrect         Untrusted-source   AI fixture test
  manipulation      evidence          model              

  Secret leakage    Credential        `.env` + gitignore Repository review
                    compromise                           
  ------------------------------------------------------------------------

------------------------------------------------------------------------

## 24. Security Submission Checklist

-   [ ] No secrets in Git history/current files.
-   [ ] `.env` ignored.
-   [ ] `.env.example` provided.
-   [ ] Input validation implemented.
-   [ ] Payload limits implemented.
-   [ ] Unknown sources handled.
-   [ ] Duplicate protection implemented.
-   [ ] Historical events preserved.
-   [ ] Audit records protected.
-   [ ] Replay is deterministic.
-   [ ] AI reports cannot execute instructions.
-   [ ] Error responses do not leak sensitive internals.
-   [ ] Security tests pass.
-   [ ] No claim of complete security.
