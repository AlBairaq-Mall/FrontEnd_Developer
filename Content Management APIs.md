# Content Management APIs

Base URL:

`http://127.0.0.1:8000/api`

> جميع الـ APIs التالية تعمل باستخدام JSON، ولا تحتاج إلى `form-data` لأن هذه البيانات لا تحتوي على صور.

---

# 1. About Us API

## Get About Us

### GET

`/about-us`

### Query Parameters

| Parameter | Type | Default | Description |
|---|---|---:|---|
| `search` | string | — | البحث في العنوان أو المحتوى |
| `status` | boolean | — | فلترة حسب الحالة إذا كان موجودًا |
| `paginate` | boolean | `true` | `true` للتصفح بالصفحات، `false` لجلب الكل |
| `per_page` | integer | `10` | عدد النتائج في الصفحة |

### Example

`GET /api/about-us?search=company&paginate=true&per_page=10`

### Get All

`GET /api/about-us?paginate=false`

---

## Create About Us

### POST

`/about-us`

### Body

```json
{
    "title_en": "About Our Company",
    "title_ar": "من نحن",
    "description_en": "We are a company specialized in providing quality products.",
    "description_ar": "نحن شركة متخصصة في تقديم منتجات عالية الجودة.",
}
```

### Headers

```text
Content-Type: application/json
Accept: application/json
Authorization: Bearer TOKEN
```

---

## Update About Us

### PUT

`/about-us/{id}`

### Body

```json
{
    "title_en": "About Our Company",
    "title_ar": "من نحن",
    "description_en": "Updated description.",
    "description_ar": "الوصف المحدث.",
}
```

---

## Delete About Us

### DELETE

`/about-us/{id}`

---

# 2. Contact Info API

Contact Info is used to store communication information such as phone, WhatsApp, email, website, location, and other contact methods.

## Get Contact Infos

### GET

`/contact-infos`

### Query Parameters

| Parameter | Type | Default | Description |
|---|---|---:|---|
| `search` | string | — | Search by title or value |
| `type` | string | — | Filter by contact type |
| `status` | boolean | — | Filter by active/inactive |
| `paginate` | boolean | `true` | Enable/disable pagination |
| `per_page` | integer | `10` | Number of results |

### Example

```text
GET /api/contact-infos?type=phone&status=true&paginate=true&per_page=10
```

### Get All

```text
GET /api/contact-infos?paginate=false
```

---

## Create Contact Info

### POST

`/contact-infos`

### Body

```json
{
    "type": "phone",
    "title_en": "Phone",
    "title_ar": "الهاتف",
    "value_en": "+967777777777",
    "value_ar": "+967777777777",
    "is_active": true
}
```

### WhatsApp

```json
{
    "type": "whatsapp",
    "title_en": "WhatsApp",
    "title_ar": "واتساب",
    "value_en": "+967777777777",
    "value_ar": "+967777777777",
    "is_active": true
}
```

### Email

```json
{
    "type": "email",
    "title_en": "Email",
    "title_ar": "البريد الإلكتروني",
    "value_en": "info@example.com",
    "value_ar": "info@example.com",
    "is_active": true
}
```

### Website

```json
{
    "type": "website",
    "title_en": "Website",
    "title_ar": "الموقع الإلكتروني",
    "value_en": "https://example.com",
    "value_ar": "https://example.com",
    "is_active": true
}
```

### Location

```json
{
    "type": "location",
    "title_en": "Our Location",
    "title_ar": "موقعنا",
    "value_en": "25 43435",
    "value_ar": "25 43435",
    "is_active": true
}
```

### Other

```json
{
    "type": "other",
    "title_en": "Other",
    "title_ar": "أخرى",
    "value_en": "777",
    "value_ar": "777",
    "is_active": true
}
```

### Allowed Types

```text
phone
telephone
whatsapp
email
website
location
other
```

---

## Update Contact Info

### PUT

`/contact-infos/{id}`

### Body

```json
{
    "type": "whatsapp",
    "title_en": "WhatsApp",
    "title_ar": "واتساب",
    "value_en": "+967777777777",
    "value_ar": "+967777777777",
    "is_active": true
}
```

---

## Delete Contact Info

### DELETE

`/contact-infos/{id}`

---

# 3. FAQ API

FAQ contains a question and its answer.

## Get FAQs

### GET

`/faqs`

### Query Parameters

| Parameter | Type | Default | Description |
|---|---|---:|---|
| `search` | string | — | Search in question/answer |
| `status` | boolean | — | Filter by status |
| `paginate` | boolean | `true` | Enable/disable pagination |
| `per_page` | integer | `10` | Number of results |

### Example

```text
GET /api/faqs?search=delivery&paginate=true&per_page=10
```

### Get All

```text
GET /api/faqs?paginate=false
```

---

## Create FAQ

### POST

`/faqs`

### Body

```json
{
    "question_en": "How can I place an order?",
    "question_ar": "كيف يمكنني إجراء طلب؟",
    "answer_en": "You can place an order from the products page.",
    "answer_ar": "يمكنك إجراء الطلب من صفحة المنتجات.",
    "is_active": true
}
```

---

## Update FAQ

### PUT

`/faqs/{id}`

### Body

```json
{
    "question_en": "How can I place an order?",
    "question_ar": "كيف يمكنني إجراء طلب؟",
    "answer_en": "Updated answer.",
    "answer_ar": "الإجابة المحدثة.",
    "is_active": true
}
```

---

## Delete FAQ

### DELETE

`/faqs/{id}`

---

# 4. Privacy Policy API

Privacy Policy consists of multiple sections/paragraphs.

## Get Privacy Policy

### GET

`/privacy-policies`

### Query Parameters

| Parameter | Type | Default | Description |
|---|---|---:|---|
| `search` | string | — | Search in title/content |
| `status` | boolean | — | Filter by status |
| `paginate` | boolean | `true` | Enable/disable pagination |
| `per_page` | integer | `10` | Number of results |

### Example

```text
GET /api/privacy-policies?search=data&paginate=true&per_page=10
```

### Get All

```text
GET /api/privacy-policies?paginate=false
```

---

## Create Privacy Policy Section

### POST

`/privacy-policies`

### Body

```json
{
    "title_en": "Data Collection",
    "title_ar": "جمع البيانات",
    "content_en": "We collect the necessary information to provide our services.",
    "content_ar": "نقوم بجمع المعلومات اللازمة لتقديم خدماتنا.",
    "sort_order": 1,
    "is_active": true
}
```

---

## Update Privacy Policy

### PUT

`/privacy-policies/{id}`

### Body

```json
{
    "title_en": "Data Collection",
    "title_ar": "جمع البيانات",
    "content_en": "Updated privacy policy content.",
    "content_ar": "محتوى سياسة الخصوصية المحدث.",
    "sort_order": 2,
    "is_active": true
}
```

---

## Delete Privacy Policy

### DELETE

`/privacy-policies/{id}`

---

# Pagination Response

When:

```text
paginate=true
```

the API returns Laravel pagination information.

Example:

```json
{
    "data": [],
    "links": {
        "first": "...",
        "last": "...",
        "prev": null,
        "next": "..."
    },
    "meta": {
        "current_page": 1,
        "from": 1,
        "last_page": 3,
        "per_page": 10,
        "to": 10,
        "total": 25
    }
}
```

When:

```text
paginate=false
```

the API returns all records:

```json
{
    "data": []
}
```

---

# Common Query Examples

## Search

```text
GET /api/about-us?search=company
```

```text
GET /api/faqs?search=order
```

```text
GET /api/contact-infos?search=phone
```

```text
GET /api/privacy-policies?search=data
```

## Filter by Status

```text
GET /api/about-us?status=true
```

```text
GET /api/faqs?status=false
```

```text
GET /api/contact-infos?status=true
```

```text
GET /api/privacy-policies?status=true
```

## Pagination

```text
GET /api/faqs?paginate=true&per_page=10
```

## Without Pagination

```text
GET /api/faqs?paginate=false
```

## Combined Filters

```text
GET /api/contact-infos?type=whatsapp&status=true&paginate=true&per_page=20
```

---

# HTTP Methods Summary

| API | GET | POST | PUT | DELETE |
|---|:---:|:---:|:---:|:---:|
| `/about-us` | ✅ | ✅ | — | — |
| `/about-us/{id}` | — | — | ✅ | ✅ |
| `/contact-infos` | ✅ | ✅ | — | — |
| `/contact-infos/{id}` | — | — | ✅ | ✅ |
| `/faqs` | ✅ | ✅ | — | — |
| `/faqs/{id}` | — | — | ✅ | ✅ |
| `/privacy-policies` | ✅ | ✅ | — | — |
| `/privacy-policies/{id}` | — | — | ✅ | ✅ |

---

# Authentication

For protected admin endpoints, send:

```text
Authorization: Bearer YOUR_ACCESS_TOKEN
```

and:

```text
Accept: application/json
Content-Type: application/json
```

The frontend should **not** send `form-data` for these APIs. Use **raw JSON** in Postman or JavaScript/Axios.
