# Fastify API REST

RF (what user can or cannot do)

- [x] User must be able to create a new transaction;
- [x] User must be able to get a summary of their account;
- [x] User must be able to list all transactions that have occurred;
- [x] User must be able to view a single transaction;

RN (Business Rules)

- [x] Transaction can be of type credit which will add to the total value or debit which will subtract;
- [ ] It must be possible to identify users between requests;
- [ ] User can only view transactions that they created;

RNF (Non-functional Requirements) // what we will use (tech) to achieve RN

Uses:
Node with Fastify
Sqlite
Typescript
Zod for data validation
