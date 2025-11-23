## **Part 3: Backend Development — REST API with Micronaut**

### **Overview**
The backend application is developed primarily using **Reactive Java** and follows Micronaut’s modular structure.  
All functionalities are cleanly separated into:

- **Controllers** — Expose REST endpoints
- **Services** — Contain business logic
- **DTOs** — Request/response models
- **Repositories** — Database interaction layer

This approach ensures high maintainability, scalability, and adherence to clean architecture principles.

---

## **Merchant & Merchant Transaction Implementations**

The backend provides complete APIs for managing merchants and performing merchant-based transaction operations.

---

## **Merchant Transaction APIs**

**Base Path:** `/api/v1/merchant-transaction`

| Method | Endpoint                          | Description |
|--------|-----------------------------------|-------------|
| **GET** | `/{merchantId}/transactions`       | Returns a paginated list of transactions for the specified merchant. |
| **POST** | `/{merchantId}/transactions`      | Creates a new transaction for the merchant. |

These endpoints are fully reactive and return responses using the standardized Citytech **RestResponse** wrapper.

---

## **Merchant APIs**

**Base Path:** `/api/v1/merchants`

| Method | Endpoint       | Description |
|--------|----------------|-------------|
| **GET** | `/`            | Retrieves a list of all merchants. |
| **GET** | `/{id}`        | Returns detailed information for a specific merchant. |
| **POST** | `/`           | Creates a new merchant for onboarding. Newly created merchants have a default status of **pending**. |
| **PUT** | `/{id}`        | Updates the merchant with additional information and transitions them into **active** status. |
| **DELETE** | `/{id}`     | Soft-deactivates the merchant by setting their status to **inactive**. |

---