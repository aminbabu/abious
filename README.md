# Abious Monorepo

Enterprise portfolio and API monorepo managed with **pnpm**, **DDEV**, **NestJS**, and **SolidStart v2**.

## Structure

```
.
├── apps/
│   ├── api/    # NestJS backend with Better Auth, PostgreSQL, & content modules
│   └── web/    # SolidStart v2 modern responsive frontend
├── packages/   # Shared packages & configurations
└── .ddev/      # Local containerized development environment
```

## Getting Started

### Local Development with DDEV

1. Start DDEV:
   ```bash
   ddev start
   ```

2. Run both apps:
   ```bash
   ddev pnpm run dev
   ```

- Frontend: [https://abious.ddev.site](https://abious.ddev.site)
- Backend API: [https://api.abious.ddev.site](https://api.abious.ddev.site)
