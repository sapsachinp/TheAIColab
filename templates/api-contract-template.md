# API Contract Template

**API Name:** [API Name]  
**Version:** [Version Number]  
**Date:** [Date]  
**Prepared By:** [Name]

---

## 1. API Overview

### 1.1 Purpose
[Describe the purpose and main functionality of the API.]

### 1.2 Base URL
- **Production:** `https://api.example.com/v1`
- **Staging:** `https://api-staging.example.com/v1`
- **Development:** `https://api-dev.example.com/v1`

### 1.3 Protocol
- **Protocol:** HTTP/HTTPS
- **Preferred Method:** HTTPS only
- **Supported Versions:** HTTP/1.1, HTTP/2

---

## 2. Authentication

### 2.1 Authentication Method
[Specify the authentication method used.]

- [ ] API Key
- [ ] OAuth 2.0
- [ ] JWT (JSON Web Token)
- [ ] Basic Authentication
- [ ] No Authentication

### 2.2 Authentication Details

**For API Key:**
```
Header: X-API-Key: your-api-key-here
```

**For OAuth 2.0:**
- **Authorization Endpoint:** `https://auth.example.com/oauth/authorize`
- **Token Endpoint:** `https://auth.example.com/oauth/token`
- **Scopes:** [List available scopes]

**For JWT:**
```
Header: Authorization: Bearer your-jwt-token-here
```

### 2.3 Obtaining Credentials
[Explain how to obtain API credentials.]

---

## 3. Common Headers

### 3.1 Request Headers

| Header | Required | Description | Example |
|--------|----------|-------------|---------|
| Content-Type | Yes | Request content type | application/json |
| Authorization | Yes | Authentication token | Bearer {token} |
| X-API-Key | Conditional | API key (if using API key auth) | abc123xyz |
| Accept | No | Acceptable response format | application/json |
| X-Request-ID | No | Unique request identifier for tracking | uuid-v4 |

### 3.2 Response Headers

| Header | Description | Example |
|--------|-------------|---------|
| Content-Type | Response content type | application/json |
| X-Rate-Limit-Limit | Total requests allowed per window | 1000 |
| X-Rate-Limit-Remaining | Remaining requests in current window | 999 |
| X-Rate-Limit-Reset | Timestamp when rate limit resets | 1609459200 |
| X-Request-ID | Echo of request ID or server-generated ID | uuid-v4 |

---

## 4. API Endpoints

### 4.1 Endpoint: [Endpoint Name]

#### Basic Information
- **Method:** `GET` / `POST` / `PUT` / `PATCH` / `DELETE`
- **Path:** `/api/v1/resource`
- **Description:** [Brief description of what this endpoint does]
- **Authentication Required:** Yes / No

#### Request

**Path Parameters:**
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| id | string | Yes | Resource identifier | 12345 |

**Query Parameters:**
| Parameter | Type | Required | Description | Default | Example |
|-----------|------|----------|-------------|---------|---------|
| page | integer | No | Page number for pagination | 1 | 2 |
| limit | integer | No | Number of items per page | 20 | 50 |
| sort | string | No | Sort field and direction | created_at:desc | name:asc |
| filter | string | No | Filter criteria | null | status:active |

**Request Body:**
```json
{
  "field1": "string",
  "field2": 123,
  "field3": {
    "nestedField1": "value",
    "nestedField2": true
  },
  "field4": ["item1", "item2"]
}
```

**Request Schema:**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "field1": {
      "type": "string",
      "description": "Description of field1",
      "minLength": 1,
      "maxLength": 255
    },
    "field2": {
      "type": "integer",
      "description": "Description of field2",
      "minimum": 0
    },
    "field3": {
      "type": "object",
      "properties": {
        "nestedField1": {
          "type": "string"
        },
        "nestedField2": {
          "type": "boolean"
        }
      },
      "required": ["nestedField1"]
    },
    "field4": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": ["field1", "field2"]
}
```

#### Response

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": "12345",
    "field1": "value",
    "field2": 123,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-02T00:00:00Z"
  },
  "meta": {
    "requestId": "uuid-v4"
  }
}
```

**Response Schema:**
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "enum": ["success", "error"]
    },
    "data": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "field1": { "type": "string" },
        "field2": { "type": "integer" },
        "createdAt": { "type": "string", "format": "date-time" },
        "updatedAt": { "type": "string", "format": "date-time" }
      }
    },
    "meta": {
      "type": "object",
      "properties": {
        "requestId": { "type": "string" }
      }
    }
  }
}
```

#### Error Responses

**400 Bad Request:**
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "field1",
        "message": "field1 is required"
      }
    ]
  },
  "meta": {
    "requestId": "uuid-v4"
  }
}
```

**401 Unauthorized:**
```json
{
  "status": "error",
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication credentials are missing or invalid"
  },
  "meta": {
    "requestId": "uuid-v4"
  }
}
```

**403 Forbidden:**
```json
{
  "status": "error",
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to access this resource"
  },
  "meta": {
    "requestId": "uuid-v4"
  }
}
```

**404 Not Found:**
```json
{
  "status": "error",
  "error": {
    "code": "NOT_FOUND",
    "message": "The requested resource was not found"
  },
  "meta": {
    "requestId": "uuid-v4"
  }
}
```

**429 Too Many Requests:**
```json
{
  "status": "error",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later."
  },
  "meta": {
    "requestId": "uuid-v4",
    "retryAfter": 60
  }
}
```

**500 Internal Server Error:**
```json
{
  "status": "error",
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred. Please try again later."
  },
  "meta": {
    "requestId": "uuid-v4"
  }
}
```

#### Example Request
```bash
curl -X GET \
  'https://api.example.com/v1/resource?page=1&limit=20' \
  -H 'Authorization: Bearer your-token-here' \
  -H 'Content-Type: application/json'
```

#### Example Response
```json
{
  "status": "success",
  "data": {
    "id": "12345",
    "field1": "example value",
    "field2": 42
  }
}
```

---

## 5. Standard Response Format

All API responses follow this standard structure:

```json
{
  "status": "success|error",
  "data": { /* response data */ },
  "error": { /* error details (only if status is error) */ },
  "meta": {
    "requestId": "uuid",
    "timestamp": "ISO-8601 timestamp",
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

---

## 6. Error Codes

| Error Code | HTTP Status | Description | Resolution |
|------------|-------------|-------------|------------|
| INVALID_REQUEST | 400 | Request validation failed | Check request parameters |
| UNAUTHORIZED | 401 | Authentication failed | Provide valid credentials |
| FORBIDDEN | 403 | Insufficient permissions | Contact admin for access |
| NOT_FOUND | 404 | Resource not found | Verify resource ID |
| METHOD_NOT_ALLOWED | 405 | HTTP method not supported | Use correct HTTP method |
| CONFLICT | 409 | Resource conflict | Resolve the conflict |
| UNPROCESSABLE_ENTITY | 422 | Semantic errors in request | Fix data semantics |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests | Wait and retry |
| INTERNAL_SERVER_ERROR | 500 | Server error | Contact support |
| SERVICE_UNAVAILABLE | 503 | Service temporarily unavailable | Retry later |

---

## 7. Rate Limiting

### 7.1 Rate Limit Policy
- **Limit:** 1000 requests per hour per API key
- **Window:** 1 hour rolling window
- **Burst:** Up to 100 requests per minute

### 7.2 Rate Limit Headers
```
X-Rate-Limit-Limit: 1000
X-Rate-Limit-Remaining: 999
X-Rate-Limit-Reset: 1609459200
```

### 7.3 Exceeding Rate Limits
When rate limit is exceeded, the API returns:
- **Status Code:** 429 Too Many Requests
- **Header:** `Retry-After: 60` (seconds)

---

## 8. Pagination

### 8.1 Pagination Strategy
- **Type:** Offset-based pagination
- **Default Page Size:** 20 items
- **Max Page Size:** 100 items

### 8.2 Pagination Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number (1-indexed) |
| limit | integer | 20 | Items per page (max 100) |

### 8.3 Pagination Response
```json
{
  "status": "success",
  "data": [
    { /* item 1 */ },
    { /* item 2 */ }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

## 9. Filtering and Sorting

### 9.1 Filtering
**Syntax:** `?filter=field:value`

**Examples:**
- Single filter: `?filter=status:active`
- Multiple filters: `?filter=status:active,category:tech`
- Operators: `?filter=price:gt:100` (greater than)

**Supported Operators:**
- `eq` - equals (default)
- `ne` - not equals
- `gt` - greater than
- `gte` - greater than or equal
- `lt` - less than
- `lte` - less than or equal
- `in` - in list
- `contains` - contains substring

### 9.2 Sorting
**Syntax:** `?sort=field:direction`

**Examples:**
- Ascending: `?sort=name:asc`
- Descending: `?sort=createdAt:desc`
- Multiple: `?sort=status:asc,createdAt:desc`

---

## 10. Versioning

### 10.1 Versioning Strategy
- **Type:** URI versioning
- **Format:** `/v{version}/`
- **Current Version:** v1

### 10.2 Version Support
- **v1:** Current and supported
- **Deprecation Policy:** 6 months notice before deprecating a version

### 10.3 Breaking Changes
Breaking changes will result in a new API version. Examples include:
- Removing or renaming fields
- Changing response structure
- Changing authentication method
- Removing endpoints

---

## 11. Webhooks (Optional)

### 11.1 Webhook Configuration
[If your API supports webhooks, document them here.]

**Webhook URL:** Provided by subscriber  
**Method:** POST  
**Authentication:** HMAC signature in header

### 11.2 Webhook Events
| Event | Description | Payload |
|-------|-------------|---------|
| resource.created | New resource created | { "event": "resource.created", "data": {...} } |
| resource.updated | Resource updated | { "event": "resource.updated", "data": {...} } |
| resource.deleted | Resource deleted | { "event": "resource.deleted", "data": {...} } |

---

## 12. Testing

### 12.1 Sandbox Environment
- **URL:** `https://api-sandbox.example.com/v1`
- **Purpose:** Testing without affecting production data

### 12.2 Test Credentials
[Provide test API keys or OAuth credentials]

### 12.3 Postman Collection
[Link to Postman collection for easy testing]

---

## 13. SDKs and Libraries

### 13.1 Official SDKs
- **JavaScript/Node.js:** [Link to SDK]
- **Python:** [Link to SDK]
- **Ruby:** [Link to SDK]
- **Java:** [Link to SDK]
- **PHP:** [Link to SDK]

### 13.2 Community SDKs
[List community-contributed SDKs]

---

## 14. Support and Resources

### 14.1 Documentation
- **API Reference:** [Link]
- **User Guides:** [Link]
- **Tutorials:** [Link]

### 14.2 Support Channels
- **Email:** api-support@example.com
- **Slack:** [Link to Slack channel]
- **Forum:** [Link to developer forum]

### 14.3 Status Page
- **URL:** https://status.example.com

---

## 15. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-01 | Initial API release |
| 1.1.0 | 2024-02-01 | Added new endpoint for [feature] |

---

## Appendix A: Complete Endpoint List

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/resource` | GET | List resources |
| `/api/v1/resource` | POST | Create resource |
| `/api/v1/resource/{id}` | GET | Get resource by ID |
| `/api/v1/resource/{id}` | PUT | Update resource |
| `/api/v1/resource/{id}` | DELETE | Delete resource |

---

## Appendix B: Data Models

### Resource Model
```json
{
  "id": "string (UUID)",
  "name": "string",
  "description": "string",
  "status": "enum (active, inactive, pending)",
  "createdAt": "string (ISO-8601)",
  "updatedAt": "string (ISO-8601)",
  "createdBy": "string (user ID)",
  "metadata": "object"
}
```
