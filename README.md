# ShopTrack API Testing Guide

This guide walks you through the entire lifecycle of testing the application from a clean slate. It follows chronological business operations: from creating the initial Admin account, to setting up inventory, recording sales, and testing automated email features.

> **Note**: For any endpoints requiring authorization (anything after Login), include the JWT Token in your request headers:
> `Authorization: Bearer <YOUR_JWT_TOKEN>`

---

## 1. Authentication Module

### 1A. Bootstrap Admin Account 
The very first step is to initialize the system by creating the master Admin account.

- **Endpoint**: `POST /auth/setup`
- **Auth Required**: No
- **Payload**:
```json
{
  "name": "Super Admin",
  "username": "adminMaster",
  "email": "admin@example.com",
  "password": "SecurePassword123!"
}
```

### 1B. Login
Authenticate as the Admin to receive your JWT Token. Save this token for all subsequent requests.

- **Endpoint**: `POST /auth/login`
- **Auth Required**: No
- **Payload**:
```json
{
  "username": "adminMaster",
  "password": "SecurePassword123!"
}
```

---

## 2. Users Module (Creating Staff)

Once logged in as Admin, you can create standard user accounts (Attendants) that will operate the system.

- **Endpoint**: `POST /users`
- **Auth Required**: Yes (Admin only)
- **Payload**:
```json
{
  "name": "Jane Doe",
  "username": "janedoe",
  "email": "jane.attendant@example.com",
  "password": "Password123!",
  "role": "Attendant"
}
```

---

## 3. Products Module (Inventory Setup)

Add items to the shop's database. We'll start with a low quantity to easily test the Low Stock Alert right away.

- **Endpoint**: `POST /products`
- **Auth Required**: Yes (Admin only)
- **Payload**:
```json
{
  "name": "Premium Keyboard",
  "description": "Mechanical wireless keyboard",
  "price": 35000,
  "quantity": 6
}
```

> **Memory Check:** Pay attention to the ID returned in the response (e.g., `"id": 1`). You will need it for the next modules.

---

## 4. Sales Module (Recording a Transaction & Emails)

Let's act as an Attendant (or Admin) to record a sale. This will test the system's email automation.

- **Endpoint**: `POST /sales`
- **Auth Required**: Yes (Admin or Attendant)
- **Payload**:
```json
{
  "productId": 1,
  "quantity": 2
}
```

### Expected Automated Actions:
1. **Receipt Generation**: A PDF receipt will be instantly generated in-memory and emailed as an attachment to the address configured in `EMAIL_USER`.
2. **Low Stock Alert**: Since our initial stock was `6`, selling `2` brings the stock down to `4`. Because `4 <= 5`, the system will automatically trigger a Low Stock Email Alert notifying you that the `Premium Keyboard` needs restocking.

### View All Sales
- **Endpoint**: `GET /sales`
- **Auth Required**: Yes (Admin sees all; Attendant sees their own)

### Sales Summary (Admin Only)
- **Endpoint**: `GET /sales/summary`
- **Auth Required**: Yes 

---

## 5. Restocks Module 

After being alerted of the low stock from Step 4, we need to add more inventory to the product.

- **Endpoint**: `POST /restocks`
- **Auth Required**: Yes (Admin or Attendant)
- **Payload**:
```json
{
  "productId": 1,
  "quantity": 50
}
```

---

## 6. Environment Considerations

To ensure the automated email step (Step 4) succeeds, please verify that your `.env` file at the root of your project contains valid SMTP settings. For example, if using Gmail:

```env
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your-16-character-app-password
```
*(If you are testing locally without internet access, these email calls will likely throw a timeout or connection error).*
