## **Part 5: Debugging Challenge**

This section highlights critical issues identified across the backend, frontend, and database layers, along with the underlying architectural themes that caused them.

---

## **1. Backend Analysis (Java / Micronaut)**
### **Core Theme: Concurrency & Atomicity Violations**

The backend exhibited serious flaws related to shared state and transactional consistency.

#### **Key Issues Identified**

- **Shared Mutable State in a `@Singleton` Bean**  
  The variable `totalProcessed` was declared as an instance field inside a singleton-scoped bean.  
  In a concurrent environment, this caused each incoming request to **read and write to the same memory location**, resulting in:
    - race conditions,
    - corrupted totals,
    - unpredictable system behavior.

  In a live platform, this type of concurrency bug would guarantee data corruption under load.

- **Lack of Transaction Boundaries (`@Transactional`)**  
  Batch operations were performed without transactional wrapping, leading to incomplete or inconsistent writes.  
  Without "all-or-nothing" semantics, failures mid-operation produced **zombie states** where:
    - some rows were updated,
    - others remained unchanged,
    - and the system required manual intervention to restore consistency.

---

## **2. Frontend Analysis (React)**
### **Core Theme: Lifecycle Management & Performance**

The frontend exhibited two major categories of bugs: memory leaks and unnecessary re-renders.

#### **Key Issues Identified**

- **Missing Cleanup in `useEffect`**  
  Timers created in `useEffect` were never cleared. When the user navigated away:
    - old intervals continued running in memory,
    - multiple timers stacked on each other,
    - leading to memory leaks and unexpected UI behavior.

  These "orphan timers" degraded performance and broke predictable component behavior.

- **Expensive Allocations Inside Render Loops**  
  Instantiating computationally heavy objects such as `Intl.NumberFormat` **inside the render loop** caused:
    - repeated object construction (`N` times per render),
    - increased garbage collection pressure,
    - noticeable UI "jank" or stuttering as list size grew.

  These should have been memoized or defined outside the render path.

---

## **3. Database Analysis (SQL)**
### **Core Theme: Logical Aggregation Errors**

The SQL query demonstrated fundamental issues in combining aggregated and non-aggregated data.

#### **Key Issues Identified**

- **Partial GROUP BY Violation**  
  The query attempted to compute aggregations such as `SUM` and `COUNT` while also selecting a granular field (`settlement_date`) that was **not included in the GROUP BY clause**.

  This forced the database to:
    - compute correct totals,
    - but arbitrarily choose a single settlement date since multiple values cannot fit into one aggregated record.

  The result was a misleading output where a full week's volume appeared under one date, rendering reporting and reconciliations unreliable.

---