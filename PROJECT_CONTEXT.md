# PROJECT_CONTEXT.md

## 1. Project Identity

**Project Name:** Crowdsourced Civic Issue Reporting & Resolution System

**One-line Description:**  
A modern civic platform where citizens can report public issues, track their resolution, and where authorities can review, prioritize, assign, and resolve those issues.

**Primary Goal:**  
Build a production-quality frontend for a civic issue reporting platform that is easy for citizens to use and provides authorities with a powerful issue-management interface.

**Target Users:**
- Citizens
- Municipal/government authorities
- System administrators

---

## 2. Project Scope

### Frontend Responsibilities

The frontend is responsible for:

- Citizen-facing website and dashboard
- Issue reporting interface
- Image/video upload UI
- Location selection UI
- Issue tracking
- Issue map
- Nearby issues
- Notifications
- Authority dashboard
- Issue management
- AI-analysis result visualization
- Civic intelligence/social-media detection UI
- Analytics dashboards
- Admin interface
- Responsive design
- Accessibility
- Loading, empty, error and success states
- Mock data and frontend service contracts for future backend integration

### Out of Scope

The frontend must NOT implement:

- Backend servers
- Database implementation
- AI model training
- Real AI inference unless explicitly requested
- Social-media scraping
- Unauthorized social-media access
- Server-side authentication
- Server-side authorization
- Server-side image verification
- Server-side duplicate detection
- Actual government/department integrations

When a feature requires backend functionality, create the appropriate frontend interface/service contract and mock implementation instead of pretending the frontend can securely perform the backend task.

---

## 3. User Roles

### 3.1 Citizen

Citizens can:

- Register and log in
- Report civic issues
- Upload evidence
- Select issue categories
- Provide descriptions
- Select/confirm a location
- Review a report before submission
- View submitted reports
- Track issue status
- View nearby issues
- View issues on a map
- Receive notifications
- View issue details
- View AI-analysis results when available

### 3.2 Authority

Authorities can:

- Log in
- View an authority dashboard
- View issue statistics
- Search/filter issues
- View issue details
- Review reports
- View AI-analysis results
- Assign departments/workers
- Update issue status
- Manage resolution workflow
- View issues on a map
- Review civic-intelligence detections
- View analytics

### 3.3 Admin

Admins can:

- View system dashboard
- View/manage users
- View/manage issues
- View authorities
- View departments
- View analytics
- Manage system-level settings through appropriate UI

Frontend role checks are for UI/UX only. They are NOT a security boundary.

---

## 4. Core Issue Categories

Initial categories:

- Pothole
- Road damage
- Garbage accumulation
- Broken streetlight
- Water leakage
- Drainage blockage
- Flooding/waterlogging
- Fallen tree
- Traffic signal malfunction
- Illegal dumping
- Other

The category list should be centralized so it can be changed without modifying many components.

---

## 5. Core Citizen User Journey

```text
Landing Page
    ↓
Login / Register
    ↓
Citizen Dashboard
    ↓
Report Issue
    ↓
Select Issue Category
    ↓
Upload Evidence
    ↓
Enter Description
    ↓
Select / Confirm Location
    ↓
Review Report
    ↓
Submit
    ↓
Submission Confirmation
    ↓
Issue Tracking
    ↓
Resolution
```

---

## 6. Core Authority User Journey

```text
Authority Login
    ↓
Authority Dashboard
    ↓
Issue Queue
    ↓
Issue Details
    ↓
AI Analysis / Verification Results
    ↓
Human Review
    ↓
Department / Worker Assignment
    ↓
Status Updates
    ↓
Resolution
```

---

## 7. Page Inventory

### Citizen Pages

- Landing Page
- Login
- Register
- Forgot Password UI
- Citizen Dashboard
- Report Issue
- Report Review
- Submission Success
- My Reports
- Issue Details
- Issue Tracking
- Nearby Issues
- Map
- Notifications
- Profile

### Authority Pages

- Authority Login
- Authority Dashboard
- Issue Management
- Issue Details
- AI Verification / Analysis
- Assignment Management
- Map
- Civic Intelligence
- Analytics
- Notifications/Profile

### Admin Pages

- Admin Dashboard
- Users
- Issues
- Authorities
- Departments
- Analytics
- Settings

---

## 8. Major Feature Specifications

### 8.1 Report Issue

Inputs:

- Issue category
- Description
- Image/video evidence
- Location

Required UI states:

- Empty
- Input validation error
- Uploading
- Upload success
- Upload failure
- Ready to submit
- Submitting
- Success
- Failure

The frontend should validate obvious input problems but must not assume frontend validation replaces backend validation.

---

### 8.2 Image Upload

Requirements:

- Accept common image formats
- Display preview
- Display file size where useful
- Allow removal/replacement
- Show upload progress where applicable
- Show clear errors
- Provide accessible labels

Initial UI limit can be presented as 10 MB, but final server-side limits will be determined by the backend.

---

### 8.3 Location

The frontend should support:

- Current-location request
- Permission handling
- Manual map pin adjustment
- Display of approximate address/area where available
- Location unavailable state
- Permission denied state

Privacy requirement:

Do not publicly expose a reporter's exact location unless explicitly required by the product design.

---

### 8.4 Issue Tracking

Show a clear status timeline:

```text
Report Submitted
      ↓
AI / Initial Review
      ↓
Verified
      ↓
Assigned
      ↓
In Progress
      ↓
Resolved
```

The actual status values should be centralized.

---

### 8.5 AI Analysis UI

The frontend may display backend-provided AI results such as:

- Detected category
- Confidence
- Severity
- Image authenticity assessment
- Duplicate probability
- Explanation/reason
- AI processing status

Example:

```text
AI Assessment
Category: Pothole
Confidence: 94%
Severity: High
Authenticity Assessment: Likely Authentic
Duplicate Probability: 12%
```

AI output must never be presented as guaranteed truth.

Clearly distinguish:

- AI assessment
- Human verification
- Final official status

---

### 8.6 Civic Intelligence

The system may eventually receive civic issue detections from permitted public/social-media sources.

Frontend responsibilities:

- Display detected issue
- Display source type
- Display timestamp
- Display location
- Display issue category
- Display confidence
- Display verification status
- Provide review/reject actions

The frontend must not implement unauthorized scraping.

---

### 8.7 Maps

Map UI should support:

- Issue markers
- Severity indicators
- Issue filters
- Status filters
- Category filters
- Search where appropriate
- Marker clustering for large datasets
- Issue detail popups/cards
- List alternative where appropriate

Do not expose private reporter information through public map views.

---

### 8.8 Analytics

Authority/admin analytics may include:

- Total reports
- Pending reports
- In-progress reports
- Resolved reports
- Resolution rate
- Average resolution time
- Issues by category
- Issues by severity
- Geographic hotspots
- Reports over time

Use realistic mock data until backend APIs are available.

---

## 9. Frontend Data Models

These are frontend representations, not database schemas.

### Issue

```text
id
category
description
imageUrl
latitude
longitude
area
severity
status
aiConfidence
authenticityAssessment
duplicateProbability
department
assignedTo
createdAt
updatedAt
```

### User

```text
id
name
email
role
avatar
createdAt
```

### Notification

```text
id
title
message
type
read
createdAt
```

### AI Analysis

```text
category
confidence
severity
authenticityAssessment
duplicateProbability
reason
status
processedAt
```

---

## 10. Frontend/API Boundary

The frontend should be designed so mock services can later be replaced by real APIs without rewriting UI components.

Recommended structure:

```text
Component
    ↓
Hook / State Layer
    ↓
Service Layer
    ↓
Mock API or Real API
```

Example service areas:

```text
services/
    authService
    issueService
    notificationService
    analyticsService
    aiService
```

Do not place API calls throughout random UI components.

---

## 11. Mock Data Strategy

During frontend development:

- Use realistic mock data
- Keep mock data separate from components
- Keep mock services separate from UI
- Use stable IDs
- Simulate loading states where useful
- Simulate errors where useful
- Make mock data structurally similar to expected API responses

Mock data should be easy to remove or replace later.

---

## 12. Design System

### Design Direction

The interface should feel:

- Modern
- Professional
- Trustworthy
- Civic/government oriented
- Clean
- Data-focused
- Accessible
- Reliable

Avoid:

- Excessive gradients
- Excessive glassmorphism
- Gaming-style visuals
- Unnecessary animations
- Overly decorative layouts
- Inconsistent component styles

### Responsive Strategy

- Citizen experience: mobile-first
- Authority dashboard: desktop-first but responsive
- Admin dashboard: desktop-first but responsive

---

## 13. Reusable Components

Build reusable components such as:

```text
Navbar
Sidebar
Button
Input
Select
Modal
Dialog
Toast
Card
StatCard
IssueCard
StatusBadge
SeverityBadge
IssueTimeline
ImageUploader
Map
MapMarker
FilterPanel
SearchBar
DataTable
Pagination
NotificationCard
EmptyState
ErrorState
LoadingSkeleton
```

Do not create duplicate versions of the same component unless there is a clear design reason.

---

## 14. Recommended Project Structure

```text
src/
├── components/
├── pages/
├── layouts/
├── hooks/
├── services/
├── data/
├── types/
├── utils/
├── assets/
└── styles/
```

The structure may evolve if there is a strong reason, but major architectural changes require approval.

---

## 15. Technology Stack

Preferred stack:

- React
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Recharts
- React Leaflet

Do not change the core framework or introduce major alternatives without explicit approval.

---

## 16. Non-Functional Requirements

The frontend must prioritize:

- Security
- Privacy
- Accessibility
- Responsiveness
- Maintainability
- Performance
- Clear UX
- Consistent design
- Reusable architecture
- Easy backend integration
- Clear error handling

---

## 17. Required UI States

Important features must support:

- Loading
- Empty
- Error
- Success
- Disabled
- Validation error
- Offline/network failure where relevant
- Permission denied where relevant
- Not found
- Unauthorized UI state

Never design only the happy path.

---

## 18. Current Development Status

Update this section as development progresses.

```text
Current Phase:
Frontend Development

Completed:
- Project specification

In Progress:
- Not started

Next:
- Design system
- Application shell
- Citizen experience
- Authority experience
- Admin experience
- Mock API/service layer
```

---

## 19. Definition of Done

A frontend feature is considered complete only when:

- The primary flow works
- Responsive layouts work
- Loading state exists where needed
- Empty state exists where needed
- Error handling exists
- Input validation exists where appropriate
- Accessibility has been considered
- Security/privacy implications have been considered
- Existing functionality has not been unnecessarily broken
- Code is reusable and maintainable
- Mock/backend boundary is clear
