# Development Phase Sample Data

This document contains sample data for the AUT RnD Issue Management System, based on the backend Mongoose schemas. Use this data for testing, UI development, and database seeding.

---

## 1. Projects

| \_id (Mock) | Name                    | Members (User IDs) |
| :---------- | :---------------------- | :----------------- |
| `p1`        | AI Ethics Framework     | `u1`, `u2`, `u3`   |
| `p2`        | Blockchain Supply Chain | `u4`, `u5`         |
| `p3`        | Smart City Traffic IoT  | `u6`, `u7`, `u8`   |
| `p4`        | Mental Health Chatbot   | `u9`, `u10`        |

---

## 2. Users

| \_id (Mock) | Full Name     | Email             | Role          | Project ID |
| :---------- | :------------ | :---------------- | :------------ | :--------- |
| `u1`        | Alice Johnson | alice@aut.ac.nz   | `Admin`       | -          |
| `u2`        | Bob Smith     | bob@aut.ac.nz     | `PaperLeader` | `p1`       |
| `u3`        | Charlie Brown | charlie@aut.ac.nz | `Student`     | `p1`       |
| `u4`        | David Wilson  | david@aut.ac.nz   | `Supervisor`  | `p2`       |
| `u5`        | Eve Davis     | eve@aut.ac.nz     | `Student`     | `p2`       |
| `u6`        | Frank Miller  | frank@aut.ac.nz   | `Client`      | `p3`       |
| `u7`        | Grace Lee     | grace@aut.ac.nz   | `Student`     | `p3`       |
| `u8`        | Henry Taylor  | henry@aut.ac.nz   | `Supervisor`  | `p3`       |
| `u9`        | Ivy Chen      | ivy@aut.ac.nz     | `Student`     | `p4`       |
| `u10`       | Jack White    | jack@aut.ac.nz    | `PaperLeader` | `p4`       |

---

## 3. Issue Types

| \_id (Mock) | Name                         |
| :---------- | :--------------------------- |
| `it1`       | Team Management              |
| `it2`       | Requirements & Documentation |
| `it3`       | Funding & Resources          |
| `it4`       | Supervision & Support        |
| `it5`       | Ethics & Compliance          |

---

## 4. Issues

| Subject                      | Description                                                                                                                                 | Type ID | Status       | Priority   | Author ID |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ | :------ | :----------- | :--------- | :-------- |
| Missing Team Member          | Our project team is missing one member for the developer role. This is causing delays in our frontend work.                                 | `it1`   | `InProgress` | `High`     | `u3`      |
| Unclear Project Requirements | The non-functional requirements for the AI Ethics project are too vague. Need more specific criteria.                                       | `it2`   | `New`        | `Medium`   | `u7`      |
| Funding for Cloud Hosting    | Requesting $200 for AWS/Azure credits to host the prototype for the final demonstration.                                                    | `it3`   | `New`        | `Medium`   | `u5`      |
| Client Approval Delay        | No response from the client whether we can proceed to the next phase with the current project proposal. We cannot start the analysis phase. | `it5`   | `InProgress` | `Critical` | `u9`      |
| Schedule Conflict            | The current lecture time is conflicting with other classes for two team members in our group.                                               | `it4`   | `Resolved`   | `Low`      | `u7`      |
| Handling Client Scope Creep  | Client is requesting three new features not in the initial brief. Need guidance on scope management.                                        | `it2`   | `New`        | `High`     | `u6`      |
| Team Conflict Resolution     | Recurring disagreement on architectural direction between team members. Requesting mediation from client.                                   | `it1`   | `InProgress` | `High`     | `u3`      |

---

## 5. Thread Example (for Issue "Missing Team Member")

| User ID | Message                                                                       | Timestamp              |
| :------ | :---------------------------------------------------------------------------- | :--------------------- |
| `u3`    | We've tried emailling and contacting him in Teams but no luck so far.         | `2024-04-05T09:00:00Z` |
| `u2`    | I will check the enrollment list and see if any late students are unassigned. | `2024-04-05T10:30:00Z` |
| `u3`    | Thank you. We will need someone before the sprint starts next Monday.         | `2024-04-05T11:15:00Z` |

---

## 6. History Example (for Issue "Missing Team Member")

| Status       | Timestamp              |
| :----------- | :--------------------- |
| `New`        | `2024-04-05T09:00:00Z` |
| `InProgress` | `2024-04-05T10:35:00Z` |

---

## 7. JSON format (For Seeding)

### Users.json

```json
[
  {
    "fullName": "Alice Johnson",
    "email": "alice@aut.ac.nz",
    "role": "Admin"
  },
  {
    "fullName": "Bob Smith",
    "email": "bob@aut.ac.nz",
    "role": "PaperLeader"
  },
  {
    "fullName": "Charlie Brown",
    "email": "charlie@aut.ac.nz",
    "role": "Student"
  }
]
```

### Projects.json

```json
[
  {
    "name": "AI Ethics Framework",
    "members": []
  },
  {
    "name": "Blockchain Supply Chain",
    "members": []
  }
]
```
