# Bookings API Test Commands

## Prerequisites

1. Backend server running on http://localhost:3000
2. Valid JWT token from login
3. Valid package ID

## 1. Login to get JWT token

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "demo123"
  }'
```

## 2. Create a new booking

```bash
curl -X POST http://localhost:3000/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "packageId": "PACKAGE_ID",
    "startDate": "2024-02-15T00:00:00.000Z",
    "guests": 2,
    "guestNames": ["John Doe", "Jane Doe"],
    "contactInfo": {
      "phone": "+1234567890",
      "email": "john.doe@example.com",
      "specialRequests": "Vegetarian meals"
    },
    "notes": "Celebrating anniversary"
  }'
```

## 3. Get user's bookings

```bash
curl -X GET "http://localhost:3000/bookings/my-bookings?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 4. Get specific booking details

```bash
curl -X GET http://localhost:3000/bookings/BOOKING_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 5. Update booking (user can only update basic details)

```bash
curl -X PATCH http://localhost:3000/bookings/BOOKING_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "guests": 3,
    "guestNames": ["John Doe", "Jane Doe", "Bob Smith"],
    "notes": "Updated guest count"
  }'
```

## 6. Cancel booking

```bash
curl -X PATCH http://localhost:3000/bookings/BOOKING_ID/cancel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Admin-only endpoints (require ADMIN role):

## 7. Get all bookings (admin)

```bash
curl -X GET "http://localhost:3000/bookings?page=1&limit=10&status=PENDING" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## 8. Get booking statistics (admin)

```bash
curl -X GET http://localhost:3000/bookings/stats \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## 9. Confirm booking (admin)

```bash
curl -X PATCH http://localhost:3000/bookings/BOOKING_ID/confirm \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## 10. Complete booking (admin)

```bash
curl -X PATCH http://localhost:3000/bookings/BOOKING_ID/complete \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## 11. Update payment status (admin)

```bash
curl -X PATCH http://localhost:3000/bookings/BOOKING_ID/payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{
    "paymentStatus": "PAID",
    "paymentId": "payment_123456"
  }'
```

## Expected Response Format:

```json
{
  "id": "booking_id",
  "userId": "user_id",
  "packageId": "package_id",
  "status": "PENDING",
  "startDate": "2024-02-15T00:00:00.000Z",
  "endDate": "2024-02-17T00:00:00.000Z",
  "guests": 2,
  "totalPrice": 500.00,
  "currency": "USD",
  "guestNames": ["John Doe", "Jane Doe"],
  "contactInfo": {...},
  "paymentStatus": "PENDING",
  "notes": "Celebrating anniversary",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "user": {
    "id": "user_id",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "package": {
    "id": "package_id",
    "title": "Amazing Tour",
    "locationName": "Paris, France",
    "duration": 3,
    "coverImage": "https://example.com/image.jpg"
  }
}
```

## Booking Status Flow:

- PENDING → CONFIRMED (admin confirms)
- CONFIRMED → COMPLETED (admin marks complete)
- Any status → CANCELLED (user/admin cancels)

## Payment Status Flow:

- PENDING → PAID (payment successful)
- PENDING → FAILED (payment failed)
- PAID → REFUNDED (refund processed)
