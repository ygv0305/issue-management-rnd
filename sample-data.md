# Development Phase Sample Data

This document contains sample data for the AUT RnD Issue Management System. Use this data for testing, UI development, and database seeding.

---

## 1. Projects

| \_id (Mock) | Name                    |
| :---------- | :---------------------- |
| `p1`        | AI Ethics Framework     |
| `p2`        | Blockchain Supply Chain |
| `p3`        | Smart City Traffic IoT  |
| `p4`        | Mental Health Chatbot   |

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

| Subject                      | Description                                                                                                                                 | Type ID | Status       | Priority   |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ | :------ | :----------- | :--------- |
| Missing Team Member          | Our project team is missing one member for the developer role. This is causing delays in our frontend work.                                 | `it1`   | `InProgress` | `High`     |
| Unclear Project Requirements | The non-functional requirements for the AI Ethics project are too vague. Need more specific criteria.                                       | `it2`   | `New`        | `Medium`   |
| Funding for Cloud Hosting    | Requesting $200 for AWS/Azure credits to host the prototype for the final demonstration.                                                    | `it3`   | `New`        | `Medium`   |
| Client Approval Delay        | No response from the client whether we can proceed to the next phase with the current project proposal. We cannot start the analysis phase. | `it4`   | `InProgress` | `Critical` |
| Schedule Conflict            | The current lecture time is conflicting with other classes for two team members in our group.                                               | `it4`   | `Resolved`   | `Low`      |
| Handling Client Scope Creep  | Client is requesting three new features not in the initial brief. Need guidance on scope management.                                        | `it2`   | `New`        | `High`     |
| Team Conflict Resolution     | Recurring disagreement on architectural direction between team members. Requesting mediation from client.                                   | `it1`   | `InProgress` | `High`     |
| Ethical Approval Pending     | Research cannot proceed without formal ethics board approval. This is blocking our data collection phase.                                   | `it2`   | `New`        | `Critical` |
| GPU Resource Shortage        | The project requires higher GPU capacity for model training than currently available in the lab.                                            | `it3`   | `InProgress` | `High`     |
| Supervisor Feedback Delay    | We haven't received feedback on our week 6 progress report, which is stalling our current tasks.                                            | `it4`   | `New`        | `Medium`   |
| Database Schema Conflict     | Major conflict in the proposed database schema between frontend and backend requirements.                                                   | `it2`   | `InProgress` | `High`     |
| Final Poster Printing        | Need to confirm the process for printing the final project poster and the associated costs.                                                 | `it3`   | `New`        | `Low`      |
| Secure Data Storage          | Questions regarding the storage of sensitive patient data for the mental health chatbot.                                                    | `it4`   | `Resolved`   | `High`     |
| Git Merge Conflicts          | Frequent merge conflicts on the main branch are disrupting the team's development flow.                                                     | `it1`   | `InProgress` | `Medium`   |
| Meeting Room Availability    | Difficulty finding a suitable room for the weekly project meeting on Wednesday afternoons.                                                  | `it1`   | `Resolved`   | `Low`      |
| Unresponsive Sub-contractor  | The external API provider for traffic data has been unresponsive for three days.                                                            | `it2`   | `New`        | `Critical` |
| Budget for Survey Incentives | Requesting a small budget to provide $5 vouchers as incentives for survey participants.                                                     | `it3`   | `New`        | `Medium`   |

---
