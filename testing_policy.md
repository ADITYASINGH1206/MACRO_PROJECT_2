# Testing & Verification Policy: Headless Mandate

## Core Principle
All system verification, feature validation, and regression testing must be performed entirely via the terminal in headless mode. 

## Rules
1. **No Browser Interaction**: Do not use graphical browser subagents or visual interaction tools to verify UI or API flows.
2. **Terminal-Driven Validation**: Use programmatic methods (e.g., `curl`, `wget`, `npm test`, or custom Node.js/Python scripts) to exercise endpoints and verify state.
3. **Headless Mode**: If browser-based testing frameworks (like Playwright or Puppeteer) are used, they must be executed in `headless: true` mode within the terminal environment.
4. **Log-Based Proof**: Validation of success must be derived from terminal output, status codes, and database state checks rather than visual screenshots.

## Recommended Workflows
- **API Unit Tests**: `curl -X POST http://localhost:3000/api/...`
- **Database Audits**: Use Supabase MCP `execute_sql` for state verification.
- **Frontend Build Checks**: `npm run build` or similar to ensure compilation integrity.
