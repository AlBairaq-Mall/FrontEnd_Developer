# Products API Documentation

## Base URL

```text
http://127.0.0.1:8000/api
```

All product APIs require authentication.

### Headers

```http
Accept: application/json
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

---

# 1. Add Product

## Endpoint

```http
POST /products
```

### Full URL

```text
http://127.0.0.1:8000/api/products
```

### Body

Use:

**Body → raw → JSON**

```json
{
    "category_id": 1,
    "name_en": "Pepsi Max",
    "name_ar": "بيبسي ماكس",
    "unique_number": "PRD0010",
    "description_en": "Pepsi Max Soft Drink",
    "description_ar": "مشروب بيبسي ماكس",
    "status": true,
    "units": [
        {
            "unit_id": 1,
            "quantity": 1,
            "barcode": "628100000101",
            "price": 3.50
        },
        {
            "unit_id": 3,
            "quantity": 24,
            "barcode": "628100000102",
            "price": 78.00
        }
    ]
}
```

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `category_id` | integer | Yes | Category ID |
| `name_en` | string | Yes | Product name in English |
| `name_ar` | string | Yes | Product name in Arabic |
| `unique_number` | string | Yes | Unique product number |
| `description_en` | string | No | English description |
| `description_ar` | string | No | Arabic description |
| `status` | boolean | No | Product status |
| `units` | array | Yes | Product units |
| `units.*.unit_id` | integer | Yes | Unit ID |
| `units.*.quantity` | integer | Yes | Number of products inside this unit |
| `units.*.barcode` | string | Yes | Barcode specific to this product unit |
| `units.*.price` | number | Yes | Price of this unit |

### Important

Each product unit has its **own barcode**.

Example:

```text
Piece
barcode: 628100000101
price: 3.50

Carton
barcode: 628100000102
price: 78.00
```

The product itself no longer uses the main `barcode` field. The barcode belongs to `product_unit`.

---

# Add Product Response

### Status

```http
201 Created
```

### Response

```json
{
    "message": "تم إنشاء المنتج بنجاح.",
    "data": {
        "id": 6,
        "name_en": "Pepsi Max",
        "name_ar": "بيبسي ماكس",
        "unique_number": "PRD0010",
        "description_en": "Pepsi Max Soft Drink",
        "description_ar": "مشروب بيبسي ماكس",
        "status": true,

        "category": {
            "id": 1,
            "name_en": "Beverages",
            "name_ar": "المشروبات",
            "slug": "beverages",
            "description_en": "All kinds of beverages.",
            "description_ar": "جميع أنواع المشروبات.",
            "image": null,
            "status": true,
            "created_at": "2026-08-30T07:38:29.000000Z"
        },

        "images": [],

        "units": [
            {
                "id": 1,
                "name_en": "Piece",
                "name_ar": "حبة",
                "quantity": 1,
                "barcode": "628100000101",
                "price": 3.5
            },
            {
                "id": 3,
                "name_en": "Carton",
                "name_ar": "كرتون",
                "quantity": 24,
                "barcode": "628100000102",
                "price": 78
            }
        ],

        "created_at": "2026-08-30 07:39:10",
        "updated_at": "2026-08-30 07:39:10"
    }
}
```

---

# 2. Update Product

## Endpoint

```http
PUT /products/{id}
```

### Example

```text
PUT http://127.0.0.1:8000/api/products/6
```

Here:

```text
6 = Product ID
```

### Headers

```http
Accept: application/json
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

---

## Body

**Body → raw → JSON**

```json
{
    "category_id": 2,
    "name_en": "Lays Classic Chips Updated",
    "name_ar": "شيبس ليز كلاسيك محدث",
    "unique_number": "PRD0011",
    "description_en": "Updated classic salted potato chips",
    "description_ar": "شيبس بطاطس كلاسيكي محدث",
    "status": true,
    "units": [
        {
            "unit_id": 1,
            "quantity": 1,
            "barcode": "628100001101",
            "price": 5.50
        },
        {
            "unit_id": 2,
            "quantity": 20,
            "barcode": "628100001102",
            "price": 95.00
        }
    ]
}
```

## Update Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `category_id` | integer | Yes | Category ID |
| `name_en` | string | Yes | Product name in English |
| `name_ar` | string | Yes | Product name in Arabic |
| `unique_number` | string | Yes | Unique product number |
| `description_en` | string | No | English description |
| `description_ar` | string | No | Arabic description |
| `status` | boolean | No | Product status |
| `units` | array | Yes | Product units |
| `units.*.unit_id` | integer | Yes | Unit ID |
| `units.*.quantity` | integer | Yes | Quantity |
| `units.*.barcode` | string | Yes | Unit barcode |
| `units.*.price` | number | Yes | Unit price |

---

# Update Product Response

### Status

```http
200 OK
```

### Response

```json
{
    "message": "تم تحديث المنتج بنجاح.",
    "data": {
        "id": 6,
        "name_en": "Lays Classic Chips Updated",
        "name_ar": "شيبس ليز كلاسيك محدث",
        "unique_number": "PRD0011",
        "description_en": "Updated classic salted potato chips",
        "description_ar": "شيبس بطاطس كلاسيكي محدث",
        "status": true,

        "category": {
            "id": 2,
            "name_en": "Snacks",
            "name_ar": "المقرمشات",
            "slug": "snacks",
            "description_en": "Various snacks.",
            "description_ar": "أنواع مختلفة من المقرمشات.",
            "image": null,
            "status": true,
            "created_at": "2026-08-30T07:38:29.000000Z"
        },

        "images": [],

        "units": [
            {
                "id": 1,
                "name_en": "Piece",
                "name_ar": "حبة",
                "quantity": 1,
                "barcode": "628100001101",
                "price": 5.5
            },
            {
                "id": 2,
                "name_en": "Box",
                "name_ar": "علبة",
                "quantity": 20,
                "barcode": "628100001102",
                "price": 95
            }
        ],

        "created_at": "2026-08-30 07:39:10",
        "updated_at": "2026-08-30 08:15:20"
    }
}
```

---

# 3. Validation Errors

If a required field is missing:

### Status

```http
422 Unprocessable Entity
```

### Example

```json
{
    "message": "The units.0.barcode field is required.",
    "errors": {
        "units.0.barcode": [
            "The unit barcode is required."
        ]
    }
}
```

---

# 4. Duplicate Unit Barcode

The barcode must be unique across `product_unit`.

For example, if this barcode already exists:

```text
628100000101
```

and you try to use it for another product/unit:

```json
{
    "unit_id": 1,
    "quantity": 1,
    "barcode": "628100000101",
    "price": 5
}
```

the API returns:

```http
422 Unprocessable Entity
```

Example:

```json
{
    "message": "The unit barcode has already been taken.",
    "errors": {
        "units.0.barcode": [
            "باركود الوحدة مستخدم بالفعل."
        ]
    }
}
```

---

# 5. Important Note About Update

The `units` array represents the units that should remain attached to the product.

For example, if the product currently has:

```text
Piece
Carton
Box
```

and the update request contains only:

```json
{
    "units": [
        {
            "unit_id": 1,
            "quantity": 1,
            "barcode": "628100000101",
            "price": 5
        },
        {
            "unit_id": 3,
            "quantity": 24,
            "barcode": "628100000102",
            "price": 78
        }
    ]
}
```

the `Box` unit will be removed because the backend uses:

```php
$product->units()->sync($units);
```

So when updating a product, send **all units that should remain**.