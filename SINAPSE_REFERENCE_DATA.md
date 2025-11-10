# Sinapse Project Reference Data

**Created**: 2025-01-27  
**Purpose**: Reference data collected before project deletion and migration to "Sinapse dashboard"

---

## Project Overview

Sinapse is a production-ready communication platform with real-time messaging, voice/video calls, file storage, AI integration, and autonomous operations management.

**Status**: Production-Ready  
**Version**: 1.0.0  
**Git Remote**: https://github.com/Ghostmonday/Synapse.git

---

## Technology Stack

### Backend
- **Runtime**: Node.js 18+ with Express.js 4.x
- **Language**: TypeScript (ES modules, strict mode)
- **Database**: Supabase (PostgreSQL 14+ via REST API)
- **Cache/Pub-Sub**: Redis 7.0+ (ElastiCache-compatible)
- **Object Storage**: AWS S3 (multipart uploads, signed URLs)
- **Voice/Video**: LiveKit (WebRTC SFU)
- **Observability**: Prometheus metrics + structured logging
- **Authentication**: JWT tokens + Apple Sign-In

### Frontend
- **iOS**: SwiftUI (iOS 17.0+)
- **Web**: Vue.js

---

## Key Features

1. **Real-Time Messaging**: WebSocket-based with Redis pub/sub
2. **File Storage**: AWS S3 integration
3. **AI Moderation**: Enterprise-only, warnings-first approach
4. **Subscription System**: Three-tier pricing (FREE/PRO/ENTERPRISE)
5. **Autonomous Operations**: LLM-powered optimizer
6. **Telemetry**: Comprehensive system and UX telemetry
7. **Voice/Video**: LiveKit integration
8. **Semantic Search**: pgvector for embeddings

---

## Pricing Tiers

### FREE Tier
- AI Messages: 10/month
- Max Rooms: 5
- Storage: 100MB
- Voice Calls: 30 min/month

### PRO Tier ($29/month)
- AI Messages: Unlimited
- Max Rooms: Unlimited
- Storage: 10GB
- Voice Calls: Unlimited
- Temp Rooms: 24h expiry

### ENTERPRISE Tier ($99/month)
- Everything in PRO
- Storage: 100GB
- AI Moderation: Enabled (opt-in)
- Permanent Rooms: No expiry
- Self-Hosting: Terraform support

---

## Database Schema

### Core Tables
- `users` - User accounts with subscription
- `rooms` - Chat rooms with tier and moderation flags
- `messages` - Message history with reactions, threads
- `threads` - Message threads
- `reactions` - Message reactions
- `files` - File metadata
- `usage_stats` - Usage tracking
- `moderation_flags` - Moderation audit log
- `message_violations` - User violation tracking
- `user_mutes` - Temporary mutes
- `assistants` - AI assistant configs
- `bots` - Bot endpoints
- `embeddings` - Vector embeddings for search

### Key Indexes
- `idx_message_violations_user_room` on `message_violations(user_id, room_id)`
- `idx_user_mutes_user_room` on `user_mutes(user_id, room_id)`
- `idx_messages_room_timestamp` on `messages(room_id, timestamp DESC)`
- Vector index on `embeddings.embedding` (pgvector)

---

## API Endpoints

### Authentication
- `POST /auth/apple` - Apple Sign-In verification
- `POST /auth/login` - Username/password login

### Messaging
- `POST /messaging/send` - Queue message
- `GET /messaging/:roomId` - Get recent messages

### Rooms
- `POST /rooms/create` - Create room (tier-validated)
- `GET /rooms/list` - List rooms
- `GET /rooms/:id/config` - Get room config
- `PUT /rooms/:id/config` - Update room config (Enterprise for moderation)

### Files
- `POST /files/upload` - Upload file
- `GET /files/:id` - Get file URL
- `DELETE /files/:id` - Delete file

### AI & Assistants
- `POST /api/assistants/invoke` - Invoke AI assistant (SSE streaming)
- `GET /api/bots/commands` - List bot commands

### Search
- `GET /api/search?query=...&roomId=...` - Hybrid semantic + keyword search

### Telemetry
- `POST /telemetry/log` - Log system telemetry
- `POST /api/ux-telemetry` - Batch UX telemetry ingestion
- `GET /api/ux-telemetry/export/:userId` - GDPR export
- `DELETE /api/ux-telemetry/user/:userId` - GDPR deletion

---

## Environment Variables

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Redis
REDIS_URL=redis://localhost:6379

# Application
PORT=3000
NODE_ENV=development|production
JWT_SECRET=your-secret-key-min-32-chars

# AWS S3
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=sinapse-files
AWS_REGION=us-east-1

# LiveKit
LIVEKIT_API_KEY=API...
LIVEKIT_API_SECRET=secret...
LIVEKIT_URL=wss://your-livekit-server.com

# Apple Sign-In
APPLE_APP_BUNDLE=com.sinapse.app

# DeepSeek (Optimizer + Moderation)
DEEPSEEK_API_KEY=sk-...
```

---

## Project Structure

```
Sinapse/
├── src/
│   ├── config/              # Database, Redis, env vars
│   ├── services/            # Business logic layer
│   ├── routes/              # Express route handlers
│   ├── middleware/          # Auth, rate limiting, security
│   ├── shared/              # Supabase helpers, logger
│   ├── ws/                  # WebSocket handlers
│   ├── autonomy/            # LLM-powered optimizer
│   ├── llm-observer/        # Watchdog for AI operations
│   └── telemetry/           # Prometheus metrics, UX telemetry
├── sql/
│   ├── migrations/          # Incremental schema updates
│   └── *.sql                # Core schema files
├── infra/aws/               # Terraform IaC
├── frontend/iOS/            # SwiftUI app
├── scripts/                 # Dev scripts, ops scripts
├── docs/                    # Technical documentation
└── specs/                   # OpenAPI specifications
```

---

## Key Implementation Details

### AI Moderation System
- **Architecture**: DeepSeek LLM-based toxicity analysis
- **Approach**: Warnings-first (no auto-bans)
- **Flow**: Warning → Mute (after 3 violations)
- **Enterprise-only**: Requires Enterprise subscription
- **Fail-safe**: Returns safe defaults on API failure

### Room Tiers
- **Free**: Standard rooms only
- **Pro**: Temp rooms (24h expiry)
- **Enterprise**: Permanent rooms + AI moderation

### Autonomous Operations
- **Starter**: Disabled
- **Professional**: Recommendations only
- **Enterprise**: Full auto with safeguards

### WebSocket Architecture
- Native WebSocket server (no Socket.io)
- Redis pub/sub for horizontal scaling
- Channel pattern: `room:${roomId}`

---

## iOS App Details

### Features
- SwiftUI-based interface
- StoreKit 2 for subscriptions
- Apple Speech Recognition (ASR)
- REST API integration
- Real-time messaging support
- iOS 17.0+ deployment target

### Product IDs
- `com.sinapse.starter.monthly` ($9)
- `com.sinapse.pro.monthly` ($29)
- `com.sinapse.enterprise.monthly` ($99)

---

## Infrastructure

### Terraform AWS Resources
- VPC with public/private subnets
- EC2 auto-scaling group
- RDS PostgreSQL (optional)
- ElastiCache Redis (optional)
- S3 bucket
- Application Load Balancer

### Docker Compose Services
- API server (port 3000)
- Redis (port 6379)
- Prometheus (port 9090)
- Optimizer microservice

---

## Recent Git Commits

1. `4da76d0` - Production deployment: iOS integration complete
2. `a3917c8` - docs: add comprehensive pre-launch checklist
3. `a693b19` - chore: remove backup file
4. `c2509bb` - refactor: move iOS assets and docs
5. `041d553` - feat(ios): add AppIcon.appiconset structure
6. `37558b2` - feat(ios): create Assets.xcassets structure
7. `fafbc76` - security: resolve merge conflicts
8. `09dd381` - security: merge comprehensive hardening
9. `c887fa4` - docs: add deployment guide

---

## Important Files Reference

### Documentation
- `README.md` - Main project README
- `DOCUMENTATION.md` - Consolidated master documentation
- `SINAPSE_TECHNICAL_SPEC.md` - Comprehensive technical spec
- `docs/DATABASE_SCHEMA.md` - Database schema documentation
- `docs/PRICING_TIERS.md` - Pricing tier details
- `docs/TELEMETRY_EVENTS.md` - Telemetry system guide

### Configuration
- `package.json` - Node.js dependencies
- `tsconfig.json` - TypeScript configuration
- `docker-compose.yml` - Docker services
- `infra/aws/main.tf` - Terraform infrastructure

### SQL Schema
- `sql/sinapse_complete.sql` - Complete schema (all-in-one)
- `sql/01_sinapse_schema.sql` - Core schema
- `sql/09_p0_features.sql` - P0 features
- `sql/migrations/` - Migration scripts

---

## Key Services

### Backend Services
- `user-authentication-service.ts` - Auth logic
- `message-service.ts` - Message handling
- `subscription-service.ts` - Tier management
- `usage-service.ts` - Usage tracking
- `moderation-service.ts` - AI moderation
- `room-service.ts` - Room management
- `telemetry-service.ts` - Telemetry logging

### iOS Services
- `RoomService.swift` - Room API client
- `MessageService.swift` - Message API client
- `AIService.swift` - LLM invocation
- `AuthService.swift` - Apple Sign-In, JWT
- `SubscriptionManager.swift` - StoreKit 2 IAP
- `WebSocketManager.swift` - Real-time messaging

---

## Security Features

- JWT token authentication
- Password hashing (bcrypt)
- File upload validation
- Rate limiting (Redis-based)
- PII redaction in telemetry
- Row-level security (Supabase RLS)
- Signed S3 URLs (1 hour expiry)

---

## Performance Targets

- Message Send: < 100ms
- Message Delivery: < 500ms
- AI Moderation: < 2s
- Search: < 1s
- File Upload: < 5s (10MB file)

---

## Future Roadmap

- Android App (Kotlin + Jetpack Compose)
- Hosting Partnerships (DigitalOcean, AWS Marketplace)
- Advanced Moderation (custom keywords, ML fine-tuning)
- Federation (Matrix protocol compatibility)
- End-to-End Encryption (Signal Protocol)

---

**End of Reference Data**

This document contains all critical information from the Sinapse project before migration to "Sinapse dashboard".

