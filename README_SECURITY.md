# 🛡️ ShopTrack Security System: Simple Guide

This project uses **Guards** and **JWT (JSON Web Tokens)** to keep the system secure. Think of your API as a high-security office building.

---

## 🏢 The Analogy: The "Secure Building"

### 1. The ID Badge (`JWT Token`)
When you login, the system gives you a digital "ID Badge" (the Token). This badge contains your Name, your ID, and your **Job Title** (Admin or Attendant). 

### 2. The Badge Reader (`JwtStrategy`)
The **`jwt.strategy.ts`** is like the electronic sensor on the wall. When you tap your badge (send a request with the token), this code:
*   Checks if the badge is real (validates the signature).
*   Checks if the badge has expired.
*   Reads the info on the badge so the system knows exactly who is trying to enter.

### 3. The Front Door Bouncer (`JwtAuthGuard`)
The **`jwt-auth.guard.ts`** is the first line of defense. 
*   **His Job:** "Do you even have a badge?"
*   If you don't have a badge, he kicks you out immediately (**401 Unauthorized**).
*   He doesn't care about your job title yet; he just wants to see a valid badge.

### 4. The VIP Manager (`RolesGuard`)
The **`roles.guard.ts`** is the second line of defense. 
*   **His Job:** "Are you allowed in *this* specific room?"
*   He looks at the "Job Title" on your badge (Role) and compares it to the label on the door.
*   If an **Attendant** tries to enter the **Admin** room, he stops them (**403 Forbidden**).

### 5. The Room Labels (`@Roles` Decorator)
The **`roles.decorator.ts`** is how we stick labels on the doors.
*   `@Roles('Admin')` means "Only Admins allowed here."
*   `@Roles('Admin', 'Attendant')` means "Everyone is allowed here."

---

## 🛠️ How to Secure a New Page (Controller)

If you create a new controller and want to protect it, follow these three steps:

### Step 1: Import the Security Team
```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
```

### Step 2: Put Bouncers at the Door
Add this above your class:
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('secrets')
export class SecretController { ... }
```

### Step 3: Label the Rooms
Add the role requirement above each function:
```typescript
@Post()
@Roles('Admin') // Only big bosses can delete!
deleteEverything() { ... }
```

---

## ⚠️ Common Trap!
**The Secret Key:** Your `auth.module.ts` and `jwt.strategy.ts` must use the exact same "Secret Key." If they don't match, the Badge Reader will think every badge is fake!
