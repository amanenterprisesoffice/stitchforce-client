StitchForce

Garment Manufacturing Management System

StitchForce is a multi-tenant software platform designed for garment manufacturing companies to manage their production workflows, garment workers, styles, operations, bundles, production records, and worker earnings.

The primary goal is to help garment factory owners track how much work is completed, which workers perform each operation, how much each worker earns, and how much the company owes them over a given payment period.

1. Product Overview

Garment manufacturing involves multiple stages of work. A single garment style can have several manufacturing operations, and different workers may perform different operations on the same garment.

For example, manufacturing a shirt may involve:

Collar stitching
Sleeve stitching
Shoulder stitching
Side stitching
Button attachment
Final finishing

Each operation has its own per-piece rate.

Workers perform these operations on assigned quantities of garments. Their earnings are calculated based on the number of pieces they complete and the rate assigned to the operation.

StitchForce aims to digitize this workflow and provide factory owners with accurate production and earnings records.

2. Core Business Concepts
Organizations

An organization represents a garment manufacturing company using StitchForce.

The application is multi-tenant, meaning multiple garment companies can use the same platform while keeping their data isolated.

Each organization has its own:

Users
Garment workers
Styles
Style operations
Production records
Bundles
Payment records
Users

Users are people who have access to the StitchForce application.

Each user belongs to an organization.

Roles currently include:

org_admin: Organization administrator.
staff: Regular organization staff.

Users manage the company's records and access the application according to their permissions.

Garment Workers

Garment workers are the actual people performing manufacturing operations.

They are different from application users.

A garment worker does not necessarily need an application account.

Worker records contain information such as:

Name
Phone number
Gender
Organization association

Workers are associated with production entries to calculate their earnings.

Styles

A style represents a particular garment design or product model manufactured by the company.

Examples:

Men's Formal Shirt
Women's Kurti
Cotton T-Shirt
Denim Jeans

Each style contains:

Style name
Unique style number within the organization
Description
Manufacturing operations
Style Operations

A style consists of multiple manufacturing operations.

Each operation represents a specific task required to manufacture that garment.

For example:

Style: Men's Formal Shirt

Operation	Rate per piece
Collar Stitching	₹3
Sleeve Stitching	₹4
Shoulder Stitching	₹2
Button Attachment	₹2
Final Finishing	₹5

Each operation has:

Operation name
Per-piece rate
Associated style
Organization association

Operation rates determine how much a worker earns for completing that operation on a particular number of pieces.

Sizes

Garments are manufactured in different sizes.

Examples:

S
M
L
XL
XXL

Sizes will be managed as reusable records and associated with production quantities.

The exact relationship between sizes and bundles will be finalized according to the factory's actual workflow.

Bundles

Bundles represent groups of garment pieces prepared for production.

A bundle belongs to a particular style and contains a specific quantity of garment pieces.

Bundles will eventually support size-wise quantities, allowing a bundle to contain different sizes of the same style if required by the factory's workflow.

Bundles help track the movement of garment pieces through manufacturing operations.

Production Entries

Production entries are the core of the application.

They record the work performed by individual garment workers.

A production entry will contain information such as:

Organization
Worker
Style
Bundle
Operation
Number of completed pieces
Applicable per-piece rate
Total earnings
Production date

For example:

A worker completes collar stitching on 10 pieces.

Operation rate: ₹3 per piece.

Calculation:

10 × ₹3 = ₹30

The worker earns ₹30 for that production entry.

Production entries provide the foundation for calculating worker earnings and tracking completed work.

Worker Earnings

Worker earnings are calculated from production entries.

Formula:

Total Earnings = Sum of (Completed Pieces × Operation Rate)

The system should provide:

Total earnings per worker
Earnings by operation
Earnings by style
Earnings by production date
Earnings for a selected payment period
Outstanding unpaid earnings
Payments

Factories may pay workers at different intervals.

Examples:

Every 15 days
Every 30 days
At the end of each month

StitchForce will track payments made to workers separately from production earnings.

A payment record will contain:

Worker
Organization
Amount paid
Payment date
Payment period
Notes or reference

The application will calculate outstanding earnings by comparing production earnings with recorded payments.

Payments will be recorded by the organization; StitchForce will not initially process actual money transfers.

3. Application Scope

The application is planned around the following modules.

A. Organization Management
Organization registration
Organization profile
License status
License expiration
Organization data isolation
B. User Management
User registration and authentication
User listing
User profile management
Role-based access control
C. Worker Management
Create workers
List workers
View worker details
Update worker information
Delete workers
D. Style Management
Create styles
List styles
View style details
Update styles
Delete styles
E. Style Operation Management
Add operations to styles
Configure per-piece rates
Update operation rates
Remove operations
F. Size Management
Create reusable garment sizes
Update sizes
List sizes
Delete sizes
G. Bundle Management
Create bundles
Associate bundles with styles
Configure piece quantities
Track size-wise quantities
Track bundle production progress
H. Production Management
Record worker production
Assign workers to operations
Record completed piece quantities
Track production dates
Calculate production earnings
View production history
I. Earnings Management
Calculate worker earnings
View daily earnings
View earnings by payment period
View outstanding balances
Generate worker-wise reports
J. Payment Management
Record worker payments
Track payment history
Calculate outstanding balances
Support different payment intervals
Generate payment reports
K. Dashboard and Reports
Total workers
Total styles
Total bundles
Production overview
Worker earnings overview
Outstanding worker payments
Production and payment summaries
4. Technology Stack
Backend
Go
Gin HTTP framework
PostgreSQL
REST API
JWT-based authentication
Repository pattern
Usecase-based business logic
Request validation
Frontend
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
Custom API fetching hook
Sonner for notifications
Architecture

The backend follows a layered architecture:

Entity: Core domain and database models.
Request: HTTP request DTOs and validation rules.
Controller: HTTP handlers and request/response handling.
Usecase: Business logic and application rules.
Repository: Database access and persistence.

Request flow:

Client → HTTP Handler → Usecase → Repository → PostgreSQL

The frontend communicates with the backend through REST APIs using a configured proxy.

5. Important Business Rules
Every organization must have isolated data.
Every garment worker belongs to an organization.
Every style belongs to an organization.
Every style can have multiple operations.
Each style operation has its own per-piece rate.
Workers earn money based on completed production quantities.
Earnings should be calculated from production records rather than manually entered totals.
Payments are separate records from production earnings.
Outstanding earnings must account for payments already made.
Historical production earnings should preserve the rate applicable when the work was completed, even if operation rates change later.
6. Development Roadmap

The development will follow this order:

Authentication and organization management.
User management.
Garment worker CRUD.
Style CRUD.
Style operation CRUD.
Size management.
Bundle management.
Production entry management.
Worker earnings calculations.
Payment management.
Dashboard and reports.
7. Product Goal

StitchForce aims to give garment manufacturing companies a centralized system to understand:

What styles are being manufactured?
What operations are required for each style?
Which workers are performing each operation?
How many pieces has each worker completed?
How much work has each worker completed financially?
How much does the company owe each worker?
How much has already been paid?
What is the remaining outstanding balance?

The ultimate goal is to replace manual registers and spreadsheets with a reliable, organized, and transparent garment production management system.