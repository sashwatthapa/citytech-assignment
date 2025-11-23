## **Part 1: Database & Query Optimization Challenge**

### **Solution**

The original query performed several expensive and unnecessary operations that increased execution time and resource usage. A breakdown of the issues observed:

### **Problems Identified**
- The query **JOINs with `transaction_detail`**, causing row multiplication.
    - Example: A single transaction with 10 details becomes **10 rows**, even though only 1 is needed.
- A **GROUP BY** is then applied immediately to collapse the duplicated rows back to one, creating extra processing load.
- A **subquery** is executed to fetch `transaction_detail` **again for each row**, causing redundant lookups.
- Overall workflow:  
  **Retrieve details → duplicate master rows → compress them again → retrieve details again for JSON**.

This results in unnecessary row expansion, sorting, grouping, and repeated detail retrieval.

---

### **Optimization Approach**
The query can be significantly improved through the following strategies:

#### **1. Remove Expensive JOIN**
Instead of joining `transaction_detail` first and causing row multiplication, the join is removed.  
The subquery is used **only once** to fetch the details in JSON format, avoiding duplication and redundant reads.

#### **2. Rely on a Targeted Subquery**
The subquery is executed **only once per transaction**, making the query more efficient and reducing memory pressure.

#### **3. Introduce Useful Indexes**
A set of strategic indexes can improve performance across common operations:

- **Date range index** → Speeds up filtering during time-based queries.
- **JSON-related index** → Improves performance of the subquery generating JSON arrays.
- **Member lookup index** → Helps when filtering or sorting by `member_id` or similar fields.

These indexes reduce scan time and help PostgreSQL choose efficient query plans.

---

