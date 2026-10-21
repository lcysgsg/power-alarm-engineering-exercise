# Repository guidance

Read `CANDIDATE.md` and `docs/DOMAIN.md` before task changes.

- Backend: Java 17, Spring Boot 4.1, MyBatis-Plus, H2.
- Frontend: Vue 3, TypeScript, Vite, Axios.
- API: http://localhost:8080; frontend: http://localhost:5173; Vite proxies /api.
- Preserve current endpoint paths and response fields unless a task explicitly requires a change.
- Prefer focused changes; do not introduce Redis, MQ, new frameworks, or unnecessary abstractions.
- Keep event ingestion, alarm state and acknowledgment separate.
- Data integrity constraints must be enforced on the backend / database, not only in UI.
- Do not weaken baseline tests or change evaluation documents to make a solution pass.
- Validate with `cd backend && mvn test` and `cd frontend && npm run build`.
- The data is synthetic. Do not add real facility credentials, IP addresses or production information.
