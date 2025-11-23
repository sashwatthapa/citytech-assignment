# Citytech Assessment
This is a multi-module evaluation covering database optimization, backend development, and partial frontend implementation. This document outlines the completed tasks, architectural decisions, and the scope of implemented features.

---

## **Part 1 — Database Challenge**

### **Query Optimization**
The assessment included a problematic SQL query that required review and optimization.

Key improvements delivered:

- Refactored inefficient joins and reduced full-table scans.
- Added indexing recommendations supporting frequent filter/sort patterns.
- Improved query structure for clarity and maintainability.
- Ensured adherence to Citytech database conventions and performance best practices.

---

## **Part 3 — Backend Challenge**

### **Merchant Transaction List Implementation**
A complete reactive backend implementation was delivered for retrieving a merchant’s transaction list.

Highlights:

- Implemented transaction listing with pagination and filter support.
- All responses returned using Citytech’s standard **RestResponse** wrapper.
- Revised endpoint structure to a more coherent and meaningful path (`/api/v1/merchant-transactions`).

### **Merchant API Enhancements**

A new set of merchant-related endpoints were implemented to support operational workflows.

#### **Implemented Endpoints**
- **Merchant List** – Returns a paginated merchant list with optional filters.
- **Merchant Detail** – Fetches detailed information for a merchant.
- **Merchant Update** – Updates merchant profile information.
- **Merchant Deactivate** – Soft-deactivation using a clean, readable API path.

### **Technologies & Patterns**
- Reactive Java using **Project Reactor**.
- Built following **Citytech’s backend standards** and response models.
- Clear separation of service, controller, and DTO layers.

---

## **Part 4 — Frontend Challenge (Partial Implementation)**

### **Merchant Transaction List (Partial)**
- Basic UI components for viewing merchant transactions.
- Pagination and filter bar implemented.
- Prepared for future sorting and advanced filtering.

### **Merchant List & Merchant Detail (Partial)**
- Initial screens for listing merchants with pagination.
- Detail page layout created for merchant profile and key information.

### **Merchant Creation & Editing**
- Forms to create and edit merchants implemented.
- Basic validation and UI state management in place.

### **Merchant Detail Dashboard (Partial)**
Includes early versions of:

- Transaction statistics widgets
- Recent transactions snippet
- Activity timeline
- **Export button (placeholder)** for future CSV/PDF export functionality

Data is partially wired and ready for integration with backend responses.

---
