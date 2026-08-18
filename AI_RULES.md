# AI_RULES.md

## Purpose

These are the permanent development rules for AI coding agents working on the Crowdsourced Civic Issue Reporting & Resolution System frontend.

These rules exist to keep the project:

- Secure
- Private
- Maintainable
- Accessible
- Performant
- Consistent
- Easy to connect to a future backend
- Resistant to unnecessary AI-generated complexity

`PROJECT_CONTEXT.md` defines **what** the project is.

This file defines **how** the AI must work.

---

# 1. General Development Rules

1. Read `PROJECT_CONTEXT.md` before making significant changes.
2. Follow this file for every implementation.
3. Inspect the existing code before modifying it.
4. Do not assume that an existing implementation is wrong just because you would design it differently.
5. Prefer small, focused changes.
6. Do not rewrite working code unnecessarily.
7. Do not delete unrelated files or functionality.
8. Keep the project runnable after changes.
9. Do not introduce hidden behavior.
10. Clearly explain important implementation decisions.

---

# 2. Frontend Scope

This project is frontend-focused.

Do NOT implement backend functionality unless explicitly requested.

Do NOT pretend frontend code provides real security, authorization, AI verification, duplicate detection, image authenticity detection, or database functionality.

When backend functionality is required:

1. Define the expected frontend data contract.
2. Create a mock service if appropriate.
3. Keep the UI functional with mock data.
4. Clearly document what requires backend implementation.

---

# 3. Architecture Rules

1. Use the existing project architecture.
2. Do not change React/Vite/core framework choices without approval.
3. Keep pages, components, services, hooks, data, types and utilities logically separated.
4. Avoid giant components.
5. Keep components focused on one responsibility.
6. Prefer composition over duplication.
7. Centralize shared constants.
8. Centralize issue statuses and categories.
9. Centralize API/service calls.
10. Avoid putting business logic directly inside large UI components.

Preferred flow:

```text
Page
 ↓
Reusable Components
 ↓
Hooks / State
 ↓
Service Layer
 ↓
Mock API / Real API
```

---

# 4. Existing Code Protection

Before modifying a file:

- Read it.
- Understand its role.
- Check where it is used.
- Preserve existing behavior unless the requested change requires otherwise.

Never solve a small UI problem by rewriting the whole application.

Never replace an existing component with a new implementation without a reason.

Never remove functionality merely to make the code simpler.

---

# 5. Security Rules

## Absolute Rules

NEVER:

- Hardcode API keys.
- Hardcode passwords.
- Hardcode authentication tokens.
- Commit secrets.
- Put secrets in URLs.
- Expose database credentials.
- Use `eval()`.
- Execute arbitrary user input.
- Trust client-side authorization.
- Assume frontend validation is sufficient security.

Avoid `dangerouslySetInnerHTML`.

If raw HTML must be rendered, it must be safely sanitized using an appropriate trusted approach.

Treat all user-provided content as untrusted.

This includes:

- Descriptions
- Names
- Filenames
- URLs
- Images
- Social-media content
- Location text
- AI-generated text

---

# 6. Authentication and Authorization

Frontend authentication UI may include:

- Login
- Logout
- Session states
- Role-based navigation
- Protected UI routes

However:

> Frontend role checks are NOT a security boundary.

Never claim that hiding an admin page in React prevents unauthorized access.

Real authentication and authorization must eventually be enforced by the backend.

If backend authentication is unavailable, use a clearly labeled mock authentication layer.

---

# 7. Environment Variables

Use environment variables for configuration.

Example:

```text
.env
.env.example
```

Real secrets must never be committed.

`.env` should be ignored by Git.

`.env.example` should contain placeholders only.

Never expose server-only secrets through Vite client-side variables.

Remember that variables exposed to frontend builds are potentially public.

---

# 8. Privacy Rules

The platform handles potentially sensitive civic reports and location information.

1. Collect only information needed for the feature.
2. Request location only when necessary.
3. Explain why location is needed.
4. Handle location denial gracefully.
5. Do not continuously track users unless explicitly required.
6. Do not publicly expose a reporter's precise location unless explicitly required.
7. Avoid exposing unnecessary personal information.
8. Do not display private user information in public issue cards or maps.
9. Do not include personal information in URLs unnecessarily.
10. Do not store sensitive information in localStorage unless there is a clear, reviewed reason.

---

# 9. Location and Maps

For GPS/location features:

- Request permission intentionally.
- Show a clear permission explanation.
- Handle denied permission.
- Handle unavailable GPS.
- Allow manual location selection when possible.
- Avoid repeated location requests.
- Avoid unnecessary precision.
- Consider approximate public map locations where appropriate.

For large datasets:

- Use marker clustering.
- Avoid rendering thousands of individual markers at once.
- Use filtering/pagination or viewport-based loading where appropriate.

---

# 10. Image Upload Rules

The civic platform accepts images as evidence.

Frontend should:

- Restrict accepted file types.
- Enforce reasonable client-side size limits.
- Show previews.
- Allow replacing/removing files.
- Show upload progress when applicable.
- Show upload errors.
- Handle invalid files gracefully.
- Avoid trusting file extensions as a security mechanism.

The backend must perform final file validation.

Never execute uploaded content.

Never expose local filesystem paths.

---

# 11. User Input Validation

Validate user input at the UI level for good UX.

Examples:

- Required fields
- Character limits
- Valid formats
- File type
- File size
- Reasonable location values

However:

> Client-side validation is not security validation.

Never assume frontend validation protects the backend.

---

# 12. AI Safety Rules

AI results must be presented as assessments, not absolute facts.

Prefer:

```text
AI Confidence: 94%
AI Assessment: Pothole
```

instead of:

```text
This is definitely a pothole.
```

Clearly distinguish:

```text
AI Assessment
Human Verification
Official Status
```

Never fabricate AI results and present them as real.

Mock AI results must be clearly identifiable in development data.

If AI processing fails, provide a graceful UI state.

---

# 13. Civic Intelligence / Social-Media Rules

The project may display civic issues detected from permitted public/social sources.

The frontend must:

- Display source type
- Display timestamp
- Display issue classification
- Display location where appropriate
- Display confidence
- Display verification state

The frontend must NOT implement unauthorized scraping.

Do not design the system around assumptions that a platform provides unrestricted access.

Do not expose unnecessary personal information from public posts.

---

# 14. Component Rules

Create reusable components when UI patterns repeat.

Examples:

```text
Button
Input
Card
Modal
Dialog
Badge
IssueCard
StatusBadge
SeverityBadge
StatCard
DataTable
FilterPanel
Map
IssueTimeline
NotificationCard
LoadingSkeleton
EmptyState
ErrorState
```

Do not create a new component merely to avoid a few lines of JSX.

Do not duplicate large components when a reusable component would clearly improve maintainability.

---

# 15. State Management Rules

Use the simplest state solution that fits the feature.

Do not introduce a global state library unless there is a demonstrated need.

Keep temporary UI state local when possible.

Separate:

- UI state
- Server/API state
- Form state
- Persistent user state

Avoid unnecessary global state.

---

# 16. API and Service Rules

API calls belong in a service layer.

Avoid scattering raw `fetch()` calls throughout components.

Preferred:

```text
Component
 ↓
Hook
 ↓
Service
 ↓
API
```

Mock services should mimic expected real API behavior as closely as practical.

Do not hardcode API response data inside components.

---

# 17. Error Handling

Never expose technical stack traces to users.

Bad:

```text
TypeError: Cannot read properties of undefined
```

Good:

```text
Something went wrong while loading your reports.

[ Try Again ]
```

Handle:

- Network failure
- Timeout
- Invalid response
- Unauthorized state
- Missing data
- Not found
- AI failure
- Map failure
- Upload failure

Errors should be useful but should not expose secrets or internal implementation details.

---

# 18. Loading / Empty / Error / Success States

Do not build only the happy path.

Important components must support:

```text
Loading
Empty
Error
Success
Disabled
Validation Error
Not Found
Unauthorized
Offline / Network Failure
```

Use skeletons or appropriate loading indicators for significant content.

---

# 19. Accessibility Rules

Accessibility is mandatory.

Use:

- Semantic HTML
- Proper heading hierarchy
- Labels for form controls
- Keyboard navigation
- Visible focus states
- Accessible buttons
- Appropriate alt text
- Sufficient contrast
- Meaningful error messages
- Screen-reader-friendly structure

Do not rely only on color to communicate:

- Severity
- Status
- Errors
- Success

For example:

```text
🔴 Critical
🟠 High
🟡 Medium
🟢 Low
```

should also include readable text.

Use ARIA when appropriate, not as a replacement for semantic HTML.

---

# 20. Responsive Design Rules

Every page must be tested conceptually for:

- Mobile
- Tablet
- Desktop
- Large desktop

Citizen workflows are mobile-first.

Authority/admin dashboards are desktop-first but must remain responsive.

Do not simply shrink desktop layouts onto mobile.

Reconsider navigation, tables, forms and maps for small screens.

---

# 21. UI/UX Rules

The interface should feel:

- Professional
- Trustworthy
- Modern
- Civic
- Clear
- Efficient

Avoid:

- Excessive animations
- Excessive gradients
- Excessive glassmorphism
- Decorative elements that reduce usability
- Inconsistent spacing
- Random typography
- Random colors
- Unnecessary popups

Prioritize usability over visual effects.

---

# 22. Design System Rules

Use centralized design tokens/classes for:

- Colors
- Typography
- Spacing
- Border radius
- Shadows
- Buttons
- Inputs
- Status colors
- Severity colors

Do not invent a new color or spacing value for every component.

Keep visual language consistent across citizen, authority and admin interfaces.

---

# 23. Performance Rules

Avoid obvious performance problems.

1. Optimize images.
2. Lazy-load large pages/components where useful.
3. Avoid unnecessary re-renders.
4. Debounce search.
5. Paginate large datasets.
6. Cluster map markers.
7. Avoid loading unnecessary libraries.
8. Avoid repeated API requests.
9. Do not poll every few seconds unless explicitly required.
10. Prefer efficient rendering for long lists.

Do not prematurely optimize code that has no demonstrated problem.

---

# 24. Dependency Rules

Before installing a new package:

1. Check whether the existing stack already solves the problem.
2. Check whether a native browser/React solution is sufficient.
3. Check whether the package is genuinely necessary.

Do not add dependencies merely for convenience.

Do not replace existing libraries without a clear reason.

---

# 25. Code Quality Rules

Use:

- Meaningful variable names
- Meaningful component names
- Small functions
- Clear types/interfaces
- Reusable utilities
- Consistent formatting

Avoid:

- Magic numbers
- Duplicate logic
- Dead code
- Unused imports
- Unnecessary comments
- Giant files
- Giant components
- Temporary hacks left undocumented

Comments should explain why something is unusual, not restate obvious code.

---

# 26. Mock Data Rules

Mock data must:

- Be realistic
- Match the expected frontend data model
- Be separated from UI components
- Use stable IDs
- Include different statuses
- Include different severity levels
- Include edge cases

Include enough mock data to test:

- Empty lists
- Large lists
- Different statuses
- Different categories
- Different severity levels
- Missing optional fields

Never label fabricated data as real-world data.

---

# 27. Testing Rules

After implementing a feature, check:

### Functional

- Main flow works
- Navigation works
- Forms work
- Buttons work
- Filters work
- Modals work

### Responsive

- Mobile
- Tablet
- Desktop

### State handling

- Loading
- Empty
- Error
- Success
- Invalid input

### Project-specific

- GPS denied
- GPS unavailable
- Large image
- Invalid image
- Network failure
- AI unavailable
- Map unavailable
- No reports
- Many reports
- Unauthorized UI state

---

# 28. Major Change Approval Rule

Before making a major architectural change, explain:

1. What will change
2. Why it is needed
3. Which files will change
4. Potential risks
5. Alternatives

Wait for approval when the decision materially affects:

- Architecture
- Security
- Privacy
- Core dependencies
- Data contracts
- Authentication
- Routing
- Major UX patterns

Small bug fixes and isolated UI improvements do not require approval.

---

# 29. Ambiguity Rule

If a requirement is ambiguous but has a low-risk UI interpretation, make a reasonable choice and document it.

If ambiguity could materially affect:

- Security
- Privacy
- Architecture
- Data model
- API contract
- User permissions
- Major UX

ask for clarification rather than guessing.

---

# 30. Do Not Fake Functionality

Never create an implementation that appears production-ready but silently does nothing.

If a feature requires backend support, clearly label the frontend implementation.

Example:

```text
Frontend demo
Backend integration required
```

Do not pretend:

- Mock AI is real AI
- Mock authentication is secure authentication
- Local data is a real database
- Frontend role hiding is authorization
- Client-side validation is backend security

---

# 31. Git and File Safety

Never:

- Delete `.git`
- Delete unrelated project files
- Modify unrelated configuration
- Remove existing functionality without approval
- Commit secrets
- Modify `.gitignore` to expose secrets

Make changes in small logical increments.

---

# 32. Documentation Rules

Maintain:

```text
PROJECT_CONTEXT.md
AI_RULES.md
README.md
.env.example
```

When architecture or major behavior changes:

- Update relevant documentation.
- Keep the project context accurate.
- Update the current development status.

---

# 33. AI Development Workflow

For every meaningful implementation task, follow:

```text
1. Understand the request
        ↓
2. Read PROJECT_CONTEXT.md
        ↓
3. Read relevant AI_RULES.md sections
        ↓
4. Inspect existing code
        ↓
5. Identify dependencies
        ↓
6. Plan the change
        ↓
7. Check security/privacy implications
        ↓
8. Implement
        ↓
9. Test
        ↓
10. Review
        ↓
11. Report changes
```

---

# 34. Required Completion Report

After completing a meaningful task, report:

```text
Implemented:
- ...

Files changed:
- ...

Tests/checks performed:
- ...

Known limitations:
- ...

Backend integration required:
- ...
```

Keep the report concise but specific.

---

# 35. Final Priority Order

When trade-offs are necessary, prioritize:

```text
1. Security
2. Privacy
3. Correctness
4. Accessibility
5. Maintainability
6. Reliability
7. Performance
8. UX
9. Visual polish
```

Never sacrifice security or privacy merely to make a feature look impressive.

---

# 36. Golden Rule

> Build the simplest secure, maintainable and accessible solution that satisfies the requirement. Do not add complexity, dependencies, features or architecture unless there is a clear reason.
