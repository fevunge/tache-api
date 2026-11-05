```mermaid
erDiagram
 direction TB
 USER {
  int userID PK ""
  string email UK ""
  string username UK ""
  string firstName  ""
  string lastName  ""
  string phone  ""
  datetime createdAt  ""
  datetime updatedAt  ""
  string passwordHash  ""
  datetime lastPasswordChange  ""
  string otpHash  ""
  datetime lastLogin  ""
  string companyName  ""
  string jobTitle  ""
  string role  ""
  string department  ""
  string linuxUsername  ""
  string githubUsername  ""
  string developmentEnv  ""
 }

 PROJECT {
  int projectID PK ""
  string name UK ""
  string description  ""
  int userID FK ""
  string status  ""
  datetime startDate  ""
  datetime endDate  ""
  string localRepository  ""
  string remoteRepository  ""
  datetime createdAt  ""
  datetime updatedAt  ""
 }

TASK {
  int taskID PK ""
  string title  ""
  string description  ""
  int projectID FK ""
  string status  ""
  datetime dueDate  ""
  datetime createdAt  ""
  datetime updatedAt  ""
 }

USER ||--o{ PROJECT : "creates"
PROJECT ||--o{ TASK : "contains"
```
