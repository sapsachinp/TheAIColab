# Database Schema Template

**Database Name:** [Database Name]  
**Database Type:** [PostgreSQL/MySQL/MongoDB/etc.]  
**Version:** [Version Number]  
**Date:** [Date]  
**Prepared By:** [Name]

---

## 1. Database Overview

### 1.1 Purpose
[Describe the purpose of the database and what data it stores.]

### 1.2 Database Technology
- **Database System:** [PostgreSQL 14, MySQL 8.0, MongoDB 5.0, etc.]
- **Character Set:** [UTF-8, etc.]
- **Collation:** [utf8mb4_unicode_ci, etc.]
- **Storage Engine:** [InnoDB, MyISAM, etc. - for MySQL]

### 1.3 Database Size Estimates
- **Initial Size:** [Estimated size]
- **Growth Rate:** [Expected growth per month/year]
- **Max Expected Size:** [3 years projection]

---

## 2. Entity Relationship Diagram (ERD)

[Insert ERD diagram here. You can use tools like dbdiagram.io, draw.io, or ASCII art]

```
┌─────────────────┐       ┌─────────────────┐
│     users       │       │     posts       │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │───┐   │ id (PK)         │
│ username        │   │   │ user_id (FK)    │───┐
│ email           │   └───│ title           │   │
│ password_hash   │       │ content         │   │
│ created_at      │       │ created_at      │   │
│ updated_at      │       │ updated_at      │   │
└─────────────────┘       └─────────────────┘   │
                                                 │
                          ┌─────────────────┐   │
                          │    comments     │   │
                          ├─────────────────┤   │
                          │ id (PK)         │   │
                          │ post_id (FK)    │───┘
                          │ user_id (FK)    │
                          │ content         │
                          │ created_at      │
                          │ updated_at      │
                          └─────────────────┘
```

---

## 3. Tables/Collections

### 3.1 Table: users

#### Purpose
[Describe what this table stores - e.g., "Stores user account information"]

#### Schema Definition

**SQL (PostgreSQL/MySQL):**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    is_active BOOLEAN NOT NULL DEFAULT true,
    email_verified BOOLEAN NOT NULL DEFAULT false,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT chk_role CHECK (role IN ('user', 'admin', 'moderator'))
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_role ON users(role);
```

**NoSQL (MongoDB):**
```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "passwordHash", "role", "isActive"],
      properties: {
        _id: {
          bsonType: "objectId"
        },
        username: {
          bsonType: "string",
          minLength: 3,
          maxLength: 50,
          description: "Username must be a string between 3-50 characters"
        },
        email: {
          bsonType: "string",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          description: "Must be a valid email address"
        },
        passwordHash: {
          bsonType: "string"
        },
        firstName: {
          bsonType: "string"
        },
        lastName: {
          bsonType: "string"
        },
        role: {
          enum: ["user", "admin", "moderator"],
          description: "User role"
        },
        isActive: {
          bsonType: "bool"
        },
        emailVerified: {
          bsonType: "bool"
        },
        lastLoginAt: {
          bsonType: "date"
        },
        createdAt: {
          bsonType: "date"
        },
        updatedAt: {
          bsonType: "date"
        },
        deletedAt: {
          bsonType: "date"
        }
      }
    }
  }
});

// Indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "createdAt": -1 });
db.users.createIndex({ "role": 1 });
```

#### Column/Field Definitions

| Column/Field | Type | Null | Default | Description | Constraints |
|-------------|------|------|---------|-------------|-------------|
| id | UUID/ObjectId | NO | auto | Primary key | PK |
| username | VARCHAR(50)/String | NO | - | Unique username | UNIQUE, 3-50 chars |
| email | VARCHAR(255)/String | NO | - | User email address | UNIQUE, valid email |
| password_hash | VARCHAR(255)/String | NO | - | Hashed password | - |
| first_name | VARCHAR(100)/String | YES | NULL | User's first name | Max 100 chars |
| last_name | VARCHAR(100)/String | YES | NULL | User's last name | Max 100 chars |
| role | VARCHAR(20)/Enum | NO | 'user' | User role | user/admin/moderator |
| is_active | BOOLEAN/Bool | NO | true | Account active status | - |
| email_verified | BOOLEAN/Bool | NO | false | Email verification status | - |
| last_login_at | TIMESTAMP/Date | YES | NULL | Last login timestamp | - |
| created_at | TIMESTAMP/Date | NO | NOW() | Record creation time | - |
| updated_at | TIMESTAMP/Date | NO | NOW() | Last update time | Auto-update |
| deleted_at | TIMESTAMP/Date | YES | NULL | Soft delete timestamp | - |

#### Indexes

| Index Name | Columns | Type | Purpose |
|------------|---------|------|---------|
| pk_users | id | PRIMARY KEY | Primary key |
| idx_users_email | email | UNIQUE | Fast email lookup |
| idx_users_username | username | UNIQUE | Fast username lookup |
| idx_users_created_at | created_at | INDEX | Sort by creation date |
| idx_users_role | role | INDEX | Filter by role |

#### Relationships

| Relationship | Target Table | Type | Foreign Key | Description |
|-------------|--------------|------|-------------|-------------|
| posts | posts | ONE-TO-MANY | users.id -> posts.user_id | User can create multiple posts |
| comments | comments | ONE-TO-MANY | users.id -> comments.user_id | User can create multiple comments |

#### Data Validation Rules

- Email must be valid format
- Username must be 3-50 characters, alphanumeric
- Password must be hashed (bcrypt/argon2)
- Role must be one of: user, admin, moderator
- Soft delete: Set deleted_at instead of hard delete

#### Sample Data

```sql
INSERT INTO users (username, email, password_hash, first_name, last_name, role)
VALUES 
  ('johndoe', 'john@example.com', '$2b$12$...', 'John', 'Doe', 'user'),
  ('janedoe', 'jane@example.com', '$2b$12$...', 'Jane', 'Doe', 'admin');
```

---

### 3.2 Table: posts

#### Purpose
[Describe what this table stores]

#### Schema Definition

```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    published_at TIMESTAMP,
    view_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_status CHECK (status IN ('draft', 'published', 'archived'))
);

-- Indexes
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at);
CREATE INDEX idx_posts_created_at ON posts(created_at);
```

[Continue with column definitions, relationships, etc. as in 3.1]

---

## 4. Relationships and Constraints

### 4.1 Foreign Key Relationships

| Child Table | Child Column | Parent Table | Parent Column | On Delete | On Update |
|------------|--------------|--------------|---------------|-----------|-----------|
| posts | user_id | users | id | CASCADE | CASCADE |
| comments | post_id | posts | id | CASCADE | CASCADE |
| comments | user_id | users | id | CASCADE | CASCADE |

### 4.2 Referential Integrity Rules

- **CASCADE:** When parent record is deleted, child records are also deleted
- **SET NULL:** When parent record is deleted, foreign key in child is set to NULL
- **RESTRICT:** Prevent deletion of parent if child records exist
- **NO ACTION:** Similar to RESTRICT but check is deferred

---

## 5. Indexes and Performance

### 5.1 Index Strategy

**Primary Indexes:**
- All tables have primary key index on `id`

**Foreign Key Indexes:**
- All foreign key columns are indexed

**Query Optimization Indexes:**
- Columns frequently used in WHERE clauses
- Columns used in JOIN operations
- Columns used in ORDER BY

### 5.2 Composite Indexes

```sql
-- Example: Composite index for common query pattern
CREATE INDEX idx_posts_user_status ON posts(user_id, status);
CREATE INDEX idx_posts_status_published ON posts(status, published_at);
```

### 5.3 Full-Text Search Indexes

```sql
-- PostgreSQL full-text search
CREATE INDEX idx_posts_content_fts ON posts 
USING gin(to_tsvector('english', content));

-- MySQL full-text search
CREATE FULLTEXT INDEX idx_posts_content_fulltext ON posts(title, content);
```

---

## 6. Data Types and Standards

### 6.1 Data Type Conventions

| Purpose | SQL Type | NoSQL Type | Notes |
|---------|----------|------------|-------|
| Primary Key | UUID | ObjectId | Auto-generated |
| Timestamps | TIMESTAMP | Date | UTC timezone |
| Booleans | BOOLEAN | Bool | true/false |
| Short Text | VARCHAR(n) | String | Fixed max length |
| Long Text | TEXT | String | No length limit |
| Integers | INTEGER/BIGINT | Int32/Int64 | Signed integers |
| Decimals | DECIMAL(p,s) | Double/Decimal128 | For currency |
| JSON Data | JSON/JSONB | Object | Semi-structured data |

### 6.2 Naming Conventions

- **Tables/Collections:** Plural, lowercase, snake_case (e.g., `users`, `blog_posts`)
- **Columns/Fields:** Lowercase, snake_case (e.g., `first_name`, `created_at`)
- **Primary Keys:** `id`
- **Foreign Keys:** `{table}_id` (e.g., `user_id`)
- **Indexes:** `idx_{table}_{columns}` (e.g., `idx_users_email`)
- **Constraints:** `chk_{table}_{description}` (e.g., `chk_users_role`)

### 6.3 Standard Columns

Every table should include:
- `id` - Primary key
- `created_at` - Timestamp of record creation
- `updated_at` - Timestamp of last update
- `deleted_at` - Timestamp of soft delete (optional)

---

## 7. Migration Strategy

### 7.1 Migration Tool
- **Tool:** [Flyway, Liquibase, Alembic, Sequelize, Prisma, etc.]
- **Migration Naming:** `V{version}__{description}.sql`
  - Example: `V001__create_users_table.sql`

### 7.2 Migration Process
1. Write migration script (both UP and DOWN)
2. Test in development environment
3. Review migration for performance impact
4. Apply to staging environment
5. Validate data integrity
6. Apply to production during maintenance window

### 7.3 Rollback Strategy
- Every migration must have a rollback script
- Test rollback in staging before production deployment
- Keep database backups before major migrations

---

## 8. Data Retention and Archival

### 8.1 Retention Policy

| Table | Retention Period | Archival Strategy |
|-------|------------------|-------------------|
| users | Indefinite | N/A |
| posts | 7 years | Move to archive table after 5 years |
| comments | 3 years | Delete after 3 years |
| logs | 90 days | Move to cold storage |

### 8.2 Soft Delete Strategy
- Use `deleted_at` column for soft deletes
- Include `WHERE deleted_at IS NULL` in queries
- Permanently delete after retention period

---

## 9. Backup and Recovery

### 9.1 Backup Strategy
- **Frequency:** Daily full backups, hourly incremental
- **Retention:** 30 days online, 1 year archived
- **Location:** [Backup location - S3, Azure Blob, etc.]

### 9.2 Recovery Procedures
- **RTO (Recovery Time Objective):** 1 hour
- **RPO (Recovery Point Objective):** 5 minutes
- **Testing:** Monthly backup restoration tests

---

## 10. Security Considerations

### 10.1 Data Encryption
- **At Rest:** [AES-256 encryption]
- **In Transit:** [TLS 1.2+]
- **Column-Level:** [Encrypt sensitive columns like SSN, credit card]

### 10.2 Access Control
- **Principle of Least Privilege:** Grant minimum required permissions
- **Application User:** Read/Write access to application tables only
- **Admin User:** Full access for maintenance
- **Read-Only User:** For reporting and analytics

### 10.3 Sensitive Data
- **PII (Personally Identifiable Information):**
  - email, phone_number, address fields
  - Comply with GDPR, CCPA regulations
- **Passwords:** Always hash with bcrypt/argon2
- **Audit Logs:** Track access to sensitive data

---

## 11. Monitoring and Maintenance

### 11.1 Database Monitoring
- **Metrics to Monitor:**
  - Query performance
  - Connection pool usage
  - Storage capacity
  - Replication lag
  - Lock waits and deadlocks

### 11.2 Regular Maintenance
- **Daily:** Monitor slow queries
- **Weekly:** Check index usage, update statistics
- **Monthly:** Review table growth, optimize queries
- **Quarterly:** Performance tuning, capacity planning

---

## 12. Scalability Strategy

### 12.1 Vertical Scaling
- **Current Specs:** [CPU, RAM, Storage]
- **Upgrade Path:** [Next tier specifications]

### 12.2 Horizontal Scaling
- **Read Replicas:** [Number of replicas, regions]
- **Sharding Strategy:** [How data is partitioned]
- **Connection Pooling:** [PgBouncer, ProxySQL, etc.]

### 12.3 Caching Strategy
- **Cache Layer:** [Redis, Memcached]
- **Cache Invalidation:** [Strategy for keeping cache fresh]

---

## 13. Appendices

### Appendix A: Complete SQL Schema
[Full SQL script to create entire database]

### Appendix B: Sample Queries
[Common query examples]

```sql
-- Get all posts by a user
SELECT p.* FROM posts p
JOIN users u ON p.user_id = u.id
WHERE u.username = 'johndoe'
AND p.deleted_at IS NULL
ORDER BY p.created_at DESC;

-- Get posts with comment count
SELECT p.*, COUNT(c.id) as comment_count
FROM posts p
LEFT JOIN comments c ON p.id = c.post_id
WHERE p.deleted_at IS NULL
GROUP BY p.id
ORDER BY p.published_at DESC;
```

### Appendix C: Data Dictionary
[Comprehensive list of all tables, columns, and their descriptions]
