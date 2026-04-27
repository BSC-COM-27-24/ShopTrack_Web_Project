# 🧪 How to Test and Use the Security System

Now that the guards are active, you must follow these steps to access your endpoints.

---

## 1. Initial System Setup (Create your Admin)
If you haven't created an admin yet, you won't be able to log in.

**Step A: Check if Admin exists**
*   **Request**: `GET http://localhost:3000/api/v1/auth/status`
*   **Result**: If it says "No admin account found," proceed to Step B.

**Step B: Create the Admin Account**
*   **Request**: `POST http://localhost:3000/api/v1/auth/setup`
*   **Body (JSON)**:
    ```json
    {
      "name": "Super Admin",
      "username": "admin",
      "email": "admin@shoptrack.com",
      "password": "Password123"
    }
    ```

---

## 2. Generate a Security Token (Login)
Every time you want to use the API, you must log in to get a token.

*   **Request**: `POST http://localhost:3000/api/v1/auth/login`
*   **Body (JSON)**:
    ```json
    {
      "username": "admin",
      "password": "Password123"
    }
    ```
*   **Result**: Copy the `access_token` from the response.

---

## 3. Accessing Guarded Routes (The Badge)
Now you can visit routes like `/products` by providing the token in the Headers.

*   **Request**: `GET http://localhost:3000/api/v1/products`
*   **Header**: 
    *   `Authorization`: `Bearer YOUR_TOKEN_HERE`

---

## 🛠️ Typical Test Data Scenarios

### Scenario: The Attendant
To test "Forbidden" access, you can create an Attendant account (Note: Only an Admin can create new users in a real system, but for now you might use a signup endpoint if you have one, or a direct DB insert).

**If you log in as an Attendant:**
*   `GET /api/v1/products` -> **SHOULD WORK**
*   `POST /api/v1/products` -> **SHOULD FAIL (403 Forbidden)**

---

## 🧹 Resetting for a Fresh Start
If you want to clear all users and start over:
*   **Request**: `DELETE http://localhost:3000/api/v1/auth/clear`
*   **Result**: All users deleted. You can now run the **Setup** (Step 1) again.

> [!WARNING]
> Clearing data is permanent. Use it only during development!
