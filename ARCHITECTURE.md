# Thindi App — Backend Architecture & Roadmap

This document is the detailed plan for rebooting the Thindi App backend as a Spring Boot microservices system. It's meant to be the reference for the maintainer and for anyone picking up a service to build.

## 1. Current state (as of this reboot)

- `thindi-backend/` — a single bare Spring Boot 4.1.0 project (Java 25 toolchain, `spring-boot-starter-webmvc` only). No business logic yet.
- `frontend/` — a Create React App scaffold, unchanged from the original MERN-era plan.
- Original plan (2 years ago) was Node.js/Express/MongoDB/Socket.io/Razorpay. That's being replaced on the backend; the product goals (QR-based multi-vendor ordering, UPI payment, real-time vendor dashboard, sales analytics) stay the same.

## 2. Target architecture

```
                         ┌───────────────────┐
                         │   React Frontend   │
                         └─────────┬──────────┘
                                   │  HTTPS (REST + WS)
                         ┌─────────▼──────────┐
                         │    api-gateway      │  (Spring Cloud Gateway)
                         └─────────┬──────────┘
                                   │ routes by path, registers/discovers via
                         ┌─────────▼──────────┐
                         │  service-registry   │  (Eureka)
                         └─────────┬──────────┘
        ┌──────────────┬──────────┼──────────────┬──────────────────┐
        ▼              ▼          ▼              ▼                  ▼
 auth-service   vendor-service  order-service  payment-service  notification-service
   (Postgres)     (Postgres)     (Postgres)      (Postgres)      (stateless, WS)
```

Each service is an independent Spring Boot application, with its own database/schema, registered with Eureka, and reachable only through `api-gateway`.

### Why Spring Cloud now, Kubernetes-native later
Eureka + Spring Cloud Gateway are easy to run with `./gradlew bootRun` on a laptop with no cluster required — good for a project that needs to stay approachable to new contributors. Once the service boundaries are proven out, discovery/routing can move to Kubernetes Services + an Ingress controller, and Eureka/Gateway get retired. Business logic in the services doesn't change either way — only how they're found and routed.

### Why Postgres for every service
One database technology keeps local setup (Docker Compose), migrations (Flyway), and testing (Testcontainers) uniform across the whole project — important when contributors will be at different experience levels. Each service still gets its own logical database/schema, so services remain independently deployable and never share tables. If a future service genuinely needs a different data model (e.g. a search index), that's a deliberate, documented exception — not the default.

### Why WebSocket/STOMP now, Kafka later
The real-time requirement is "push order updates to the vendor dashboard" — a single producer (order-service) with dashboard subscribers is exactly what STOMP over WebSocket is for, and it's one Spring Boot starter plus a handful of classes. A message broker (Kafka/RabbitMQ) earns its place when there are multiple independent consumers reacting to the same event (e.g. order placed → notify vendor, update analytics, trigger loyalty points). That's flagged as a Phase 3 upgrade, not a Phase 1 requirement — no point paying the operational cost of a broker before there's a second consumer.

## 3. Services

| Service | Responsibility | Data owned | Key endpoints (illustrative) |
|---|---|---|---|
| **service-registry** | Eureka server — service discovery | none | N/A |
| **api-gateway** | Single entry point, routing, CORS, auth token pass-through, rate limiting (later) | none | routes only |
| **auth-service** | Student & vendor accounts, login, JWT issuance/validation | users, vendors (credentials) | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| **vendor-service** | Vendor profile, menu CRUD, QR code generation | vendors (profile), menu items | `GET /vendors/{id}/menu`, `POST /vendors/{id}/menu`, `GET /vendors/{id}/qr` |
| **order-service** | Cart, order placement, order status, WebSocket push to vendor dashboard | orders, order items | `POST /orders`, `PATCH /orders/{id}/status`, `GET /orders?vendorId=` |
| **payment-service** | Razorpay UPI integration, payment verification, webhook handling | payments, transaction records | `POST /payments/initiate`, `POST /payments/webhook` |
| **notification-service** *(Phase 2)* | Central real-time fan-out if/when more than order-service needs to push events | none (stateless) | WS topics |
| **analytics-service** *(Phase 3)* | Daily sales aggregation, trends | read-model / aggregated data | `GET /analytics/vendor/{id}/daily` |

### Cross-service rules
- Services talk to each other **only** over REST through the gateway (or direct service-to-service calls via Eureka-resolved names for backend-internal calls) — never by touching another service's database.
- Each service publishes its own OpenAPI/Swagger docs.
- `order-service` is the source of truth for order status; other services (analytics, notifications) react to it, they don't own it.

## 4. Phased roadmap

**Phase 1 — Foundation**
1. `service-registry` (Eureka server) — get it running standalone.
2. `api-gateway` (Spring Cloud Gateway) — registers with Eureka, routes `/api/auth/**` etc.
3. `auth-service` — registration/login, JWT issuance, Postgres + Flyway, Testcontainers-based tests.
4. Docker Compose file bringing up Postgres + these three services.

**Phase 2 — Core ordering flow**
5. `vendor-service` — vendor profile + menu CRUD + QR code generation per vendor.
6. `order-service` — cart/order placement, order status transitions, WebSocket/STOMP endpoint for live vendor dashboard updates.
7. Frontend wired to the new backend for the student ordering flow and vendor live dashboard.

**Phase 3 — Payments & analytics**
8. `payment-service` — Razorpay UPI integration (sandbox first), payment status tied back into `order-service`.
9. `analytics-service` — daily sales aggregation for vendors.
10. Evaluate introducing Kafka if/when a second independent consumer of "order events" shows up (e.g. analytics + notifications both reacting to the same event).

**Phase 4 — Productionization**
11. CI (build + test every service on PR), containerize each service (Dockerfile per service).
12. Centralized config (Spring Cloud Config) if service count/config duplication justifies it.
13. Migration path: replace Eureka + Gateway with Kubernetes Services + Ingress; document the cutover so it's a config change, not a rewrite.

## 5. Open questions / decisions to revisit as the project grows
- Whether `notification-service` becomes its own service or stays folded into `order-service` — decide when Phase 2 is underway and it's clear whether more than one consumer needs push events.
- Whether a lightweight shared library (DTO contracts) is worth the coupling risk, versus each service defining its own DTOs and accepting some duplication. Default: **no shared library** until duplication becomes a real maintenance problem.
- API versioning strategy once the gateway has external consumers beyond the first-party frontend.

This document should be updated as decisions are made — treat it as living documentation, not a fixed spec.
