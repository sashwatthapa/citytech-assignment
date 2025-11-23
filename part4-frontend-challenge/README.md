## **Part 4: Frontend Development — Flexible Point-Based System**

### **Overview**
The frontend portion of the assessment focuses on building a clean, functional interface to interact with the Micronaut backend.  
The UI is kept simple but structured to support extensibility, data-driven rendering, and smooth integration with backend APIs.

---

## **Key Implementations**

### **1. Updated Transactions Page**
- Enhanced the existing transactions page to display **merchant-specific transactions**.
- Implemented **filtering** and **pagination** to improve data navigation.
- Connected the page to the backend merchant-transaction API for real data retrieval.

---

### **2. Merchant Management UI**
A new merchant section was created to support operational workflows.

#### **Merchant List**
- Displays a paginated list of merchants.
- Includes filtering options for easier lookup.
- Integrates directly with the backend `/api/v1/merchants` endpoint.

#### **Merchant Details**
- Shows expanded merchant information.
- Pulls data dynamically via backend APIs.
- Designed to later incorporate transaction summaries or analytics panels.

#### **Merchant Onboarding & Update**
- Includes a form to **create new merchants** with default onboarding logic.
- Supports updating merchant information and confirming merchant status.
- Form components are structured for clarity and easy extension.

---

## **Implementation Scope**
This is a **partial frontend implementation**, with core screens and interactions completed, including:

- Pagination controls  
- Filter components  
- Form handling  
- Backend integration

Several UI components are basic placeholders, intended for future enhancement as functionality evolves.

---