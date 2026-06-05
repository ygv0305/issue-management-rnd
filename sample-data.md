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

## 2. Issue Types

| \_id (Mock) | Name                         |
| :---------- | :--------------------------- |
| `it1`       | Team Management              |
| `it2`       | Requirements & Documentation |
| `it3`       | Funding & Resources          |
| `it4`       | Supervision & Support        |

---

## 3. Issues

| Subject                      | Description                                                                                                                                 | Type ID | Status       | Priority   | Author ID |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ | :------ | :----------- | :--------- | :-------- |
| Missing Team Member          | Our project team is missing one member for the developer role. This is causing delays in our frontend work.                                 | `it1`   | `InProgress` | `High`     | `u3`      |
| Unclear Project Requirements | The non-functional requirements for the AI Ethics project are too vague. Need more specific criteria.                                       | `it2`   | `New`        | `Medium`   | `u7`      |
| Funding for Cloud Hosting    | Requesting $200 for AWS/Azure credits to host the prototype for the final demonstration.                                                    | `it3`   | `New`        | `Medium`   | `u5`      |
| Client Approval Delay        | No response from the client whether we can proceed to the next phase with the current project proposal. We cannot start the analysis phase. | `it5`   | `InProgress` | `Critical` | `u9`      |
| Schedule Conflict            | The current lecture time is conflicting with other classes for two team members in our group.                                               | `it4`   | `Resolved`   | `Low`      | `u7`      |
| Handling Client Scope Creep  | Client is requesting three new features not in the initial brief. Need guidance on scope management.                                        | `it2`   | `New`        | `High`     | `u6`      |
| Team Conflict Resolution     | Recurring disagreement on architectural direction between team members. Requesting mediation from client.                                   | `it1`   | `InProgress` | `High`     | `u3`      |
| Ethical Approval Pending     | Research cannot proceed without formal ethics board approval. This is blocking our data collection phase.                                   | `it5`   | `New`        | `Critical` | `u3`      |
| GPU Resource Shortage        | The project requires higher GPU capacity for model training than currently available in the lab.                                            | `it3`   | `InProgress` | `High`     | `u5`      |
| Supervisor Feedback Delay    | We haven't received feedback on our week 6 progress report, which is stalling our current tasks.                                            | `it4`   | `New`        | `Medium`   | `u9`      |
| Database Schema Conflict     | Major conflict in the proposed database schema between frontend and backend requirements.                                                   | `it2`   | `InProgress` | `High`     | `u7`      |
| Final Poster Printing        | Need to confirm the process for printing the final project poster and the associated costs.                                                 | `it3`   | `New`        | `Low`      | `u3`      |
| Secure Data Storage          | Questions regarding the storage of sensitive patient data for the mental health chatbot.                                                    | `it5`   | `Resolved`   | `High`     | `u9`      |
| Git Merge Conflicts          | Frequent merge conflicts on the main branch are disrupting the team's development flow.                                                     | `it1`   | `InProgress` | `Medium`   | `u7`      |
| Meeting Room Availability    | Difficulty finding a suitable room for the weekly project meeting on Wednesday afternoons.                                                  | `it1`   | `Resolved`   | `Low`      | `u5`      |
| Unresponsive Sub-contractor  | The external API provider for traffic data has been unresponsive for three days.                                                            | `it2`   | `New`        | `Critical` | `u7`      |
| Budget for Survey Incentives | Requesting a small budget to provide $5 vouchers as incentives for survey participants.                                                     | `it3`   | `New`        | `Medium`   | `u5`      |

---
