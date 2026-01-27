# Quick Reference Guide

A condensed reference for the structured GitHub development workflow.

## 🎯 The 5 Phases

| Phase | Duration | Key Output | Status Check |
|-------|----------|------------|--------------|
| **1. Decompose & Analyze** | 1-2 weeks | Gap Analysis Report | ✅ All gaps identified? |
| **2. Clarify** | 1 week | KPI Definition | ✅ All ambiguities resolved? |
| **3. Architect** | 2-3 weeks | ADRs + API/DB Specs | ✅ Clear technical direction? |
| **4. Execute** | 8-12 weeks | Working Application | ✅ All tests passing? |
| **5. Mitigate** | 1-2 weeks | Risk Register + Docs | ✅ Risks documented? |

---

## 🚦 Phase Checklists

### Phase 1: Decompose & Analyze
```
□ Read BRD thoroughly
□ Map business goals to components
□ Security gap analysis
□ Scalability gap analysis
□ Integration gap analysis
□ Create initial risk register
□ Deliverable: Gap Analysis Report
```

### Phase 2: Clarify
```
□ Define clear scope boundaries
□ Document all data requirements
□ Define technical KPIs
□ Define business KPIs
□ List and document assumptions
□ Schedule stakeholder clarifications
□ Deliverable: Clarified Requirements
```

### Phase 3: Architect
```
□ Select technology stack
□ Design API contracts (OpenAPI)
□ Design database schema (ERD)
□ Create architecture diagrams
□ Write Architecture Decision Records
□ Security architecture review
□ Deliverable: Architecture Documentation
```

### Phase 4: Execute
```
Infrastructure:
□ Version control setup
□ CI/CD pipeline
□ Cloud infrastructure (IaC)
□ Monitoring & logging

Development:
□ Backend implementation
□ Frontend implementation
□ Integration implementation
□ Security implementation
□ Performance optimization
□ Testing (unit, integration, e2e)

Quality:
□ Code review
□ Security testing
□ Performance testing
□ QA testing
□ Deliverable: Working Application
```

### Phase 5: Mitigate
```
□ Document all risks
□ Create mitigation strategies
□ Validate assumptions
□ Configure monitoring
□ Configure alerting
□ Complete documentation
□ Create incident response plan
□ Deliverable: Complete Documentation Set
```

---

## 📋 Essential Templates

| Template | Use When | Time to Complete |
|----------|----------|------------------|
| **Business Requirements** | Starting project | 2-5 days |
| **Gap Analysis** | After BRD review | 1-2 days |
| **API Contract** | Designing APIs | 2-4 days |
| **Database Schema** | Designing data model | 2-3 days |
| **ADR** | Making architectural decision | 30-60 min |
| **Risk Register** | Throughout project | Ongoing |

---

## 🎨 Common Patterns

### REST API Naming
```
GET    /api/v1/resources       # List all
POST   /api/v1/resources       # Create new
GET    /api/v1/resources/:id   # Get one
PUT    /api/v1/resources/:id   # Update (full)
PATCH  /api/v1/resources/:id   # Update (partial)
DELETE /api/v1/resources/:id   # Delete
```

### Database Naming
```
Tables:     users, blog_posts (plural, snake_case)
Columns:    first_name, created_at (snake_case)
PKs:        id
FKs:        user_id, post_id (table_id)
Indexes:    idx_users_email
```

### Standard Columns
```sql
id          UUID/BIGINT     PRIMARY KEY
created_at  TIMESTAMP       NOT NULL DEFAULT NOW()
updated_at  TIMESTAMP       NOT NULL DEFAULT NOW()
deleted_at  TIMESTAMP       NULL (for soft delete)
```

---

## 🔒 Security Checklist

```
□ HTTPS/TLS everywhere
□ Authentication (JWT/OAuth)
□ Authorization (RBAC)
□ Input validation
□ SQL injection prevention
□ XSS protection
□ CSRF protection
□ Rate limiting
□ Security headers (CSP, HSTS, etc.)
□ Password hashing (bcrypt/argon2)
□ Secrets management (not in code)
□ Dependency scanning
□ Security audit
□ Penetration testing
```

---

## 📊 Performance Targets

### Response Times
- **95th percentile:** < 200ms
- **99th percentile:** < 500ms
- **Page load:** < 2 seconds

### Availability
- **Uptime SLA:** 99.9% (43 minutes downtime/month)
- **Error rate:** < 0.1%

### Scalability
- **Concurrent users:** Plan for 2x expected peak
- **Database:** Read replicas for read-heavy workloads
- **Caching:** Redis/Memcached for frequently accessed data

---

## 🛠️ Essential Tools

### Documentation
- **Diagrams:** Draw.io, Mermaid, Lucidchart
- **API Docs:** Swagger/OpenAPI, Postman
- **Database:** dbdiagram.io

### Development
- **Version Control:** Git + GitHub
- **CI/CD:** GitHub Actions, Jenkins, CircleCI
- **Containers:** Docker, Kubernetes

### Monitoring
- **APM:** Datadog, New Relic
- **Errors:** Sentry, Rollbar
- **Logs:** CloudWatch, ELK Stack
- **Uptime:** Pingdom, UptimeRobot

---

## 💡 Quick Tips

### Do's ✅
- ✅ Start with planning (Phases 1-3)
- ✅ Document architectural decisions (ADRs)
- ✅ Write tests alongside code
- ✅ Review code before merging
- ✅ Monitor production from day 1
- ✅ Keep documentation updated
- ✅ Validate assumptions early

### Don'ts ❌
- ❌ Skip gap analysis
- ❌ Start coding without clear requirements
- ❌ Ignore non-functional requirements
- ❌ Defer security to the end
- ❌ Ignore performance until production
- ❌ Forget to document decisions
- ❌ Assume instead of validate

---

## 🆘 Common Issues & Solutions

### Issue: Unclear Requirements
**Solution:** Go back to Phase 2, schedule stakeholder meetings

### Issue: Performance Problems in Production
**Solution:** Should have done load testing in Phase 4 - implement caching, optimize queries

### Issue: Security Vulnerability Found
**Solution:** Should have done security audit in Phase 4 - patch immediately, review security checklist

### Issue: Integration Failure
**Solution:** Should have tested integrations in Phase 4 - implement circuit breaker, add error handling

### Issue: Database Scaling Issues
**Solution:** Should have planned for scale in Phase 3 - add read replicas, implement caching

---

## 📈 Success Metrics

Track these to measure workflow effectiveness:

### Process Metrics
- **Planning Time:** Phases 1-3 should be 25-30% of total project time
- **Rework Rate:** Should be < 10% with good planning
- **Defect Density:** Should be < 1 defect per 100 LOC

### Quality Metrics
- **Code Coverage:** > 80%
- **Security Issues:** 0 critical, < 5 high
- **Performance:** Meeting all SLAs

### Business Metrics
- **On-time Delivery:** Aim for 90%+
- **Budget Adherence:** Within 10% of estimate
- **Customer Satisfaction:** > 4.0/5.0

---

## 🔄 Workflow Iteration

After each project:

1. **Retrospective** - What went well? What didn't?
2. **Update Templates** - Improve based on learnings
3. **Refine Estimates** - Better estimates next time
4. **Share Learnings** - Update team knowledge

---

## 📞 When to Use Each Phase

### Phase 1: Always
Every project needs analysis

### Phase 2: Always
Every project needs clarity

### Phase 3: New Projects or Major Changes
Skip for minor features, use for new systems

### Phase 4: Always
Every change needs implementation

### Phase 5: Always
Every project needs risk management

---

## 🎓 Learning Resources

### Free Resources
- [12-Factor App](https://12factor.net/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [C4 Model](https://c4model.com/)
- [API Design Guide](https://cloud.google.com/apis/design)

### Books
- "Clean Architecture" by Robert Martin
- "Designing Data-Intensive Applications" by Martin Kleppmann
- "Site Reliability Engineering" by Google
- "The Phoenix Project" by Gene Kim

---

## 📅 Timeline Estimates

### Small Project (1-2 developers, 1-2 months)
- Phase 1: 2-3 days
- Phase 2: 1-2 days
- Phase 3: 3-5 days
- Phase 4: 4-6 weeks
- Phase 5: 2-3 days

### Medium Project (3-5 developers, 3-4 months)
- Phase 1: 1 week
- Phase 2: 3-4 days
- Phase 3: 2 weeks
- Phase 4: 8-12 weeks
- Phase 5: 1 week

### Large Project (6+ developers, 6+ months)
- Phase 1: 2 weeks
- Phase 2: 1 week
- Phase 3: 3 weeks
- Phase 4: 16-20 weeks
- Phase 5: 2 weeks

---

## 🎯 Remember

> **"The time spent in planning and architecture pays dividends in execution and maintenance."**

- Plan thoroughly (Phases 1-3)
- Execute systematically (Phase 4)
- Mitigate proactively (Phase 5)
- Document everything
- Test continuously
- Monitor always

---

For complete details, see [WORKFLOW.md](WORKFLOW.md)
