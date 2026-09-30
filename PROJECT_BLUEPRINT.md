# Mizan AI - Blueprint for the Accounting System

## 1. Project Objective
Mizan AI is a complete accounting and enterprise management system designed to support all core accounting operations, financial reporting, inventory, payroll, assets, banking, taxes, and user control with a safe AI layer.

## 2. Core Functional Modules

### 2.1 Basic Accounting
- Chart of accounts
- Debits and credits
- Daily journal entries
- Trial balance
- General ledger
- Profit and loss statement
- Balance sheet
- Financial period closure
- Reversal of entries instead of deletion

### 2.2 Sales and Purchases
- Customer and supplier accounts
- Sales invoices and purchase invoices
- Returns and allowances
- Payment tracking
- Tax handling
- Multi-currency support

### 2.3 Cash and Banking
- Cash boxes and bank accounts
- Deposits, withdrawals, and transfers
- Reconciliation
- Bank statement matching
- Actual versus accounting balances

### 2.4 Inventory Management
- Items and categories
- Warehouses and stock transfers
- Incoming and outgoing movements
- Inventory counts and stock adjustments
- Costing methods
- Reorder level alerts

### 2.5 Payroll and Human Resources
- Employee records
- Salary, allowances, and deductions
- Payroll processing
- Net salary calculation
- Payroll postings to accounting

### 2.6 Fixed Assets
- Asset registration
- Depreciation calculation
- Accumulated depreciation
- Disposal and sale of asset
- Related journal entries

### 2.7 Advances and Custody
- Advance payments
- Cash advances and settlement
- Custody tracking
- Remaining balances

### 2.8 Taxes and Legal Compliance
- Tax settings per company
- Tax on items and invoices
- Tax reports
- Return and tax adjustment handling

### 2.9 Audit and Security
- User activity log
- Who created, modified, posted, cancelled, or reversed entries
- Before and after values
- Access control and role restrictions
- AI action logging

## 3. Roles and Permissions
- System administrator
- Company manager
- Accountant
- Sales
- Purchases
- Warehouse manager
- HR
- Cashier
- Auditor
- Read-only user
- AI agent

Each action must be validated by:
- User authentication
- Role permissions
- Data validation
- Business rules
- Approval confirmation

## 4. Smart AI Layer
The AI assistant must be treated as a controlled execution layer, not as a superuser.

### AI Rules
- Read data from the database only when allowed
- Analyze reports and answer accounting questions
- Execute only permitted operations
- Never create an unbalanced journal entry
- Log all AI actions in detail
- Require user confirmation before any sensitive action
- Must validate user rights before execution

### AI Safety Flow
User Request
-> Understand request
-> Check permissions
-> Validate business data
-> Preview operation
-> Ask for confirmation
-> Create transaction
-> Post journal entry
-> Audit log

## 5. Accounting Validation Rules
- Journal must be balanced
- Edit is not allowed after closure unless authorized
- Closing period requires manager approval
- Automatic safe numbering for journal entries under concurrency
- Reversal entries must be used instead of deleting posted entries

## 6. Financial Consistency Checks
The system must automatically validate:
- General ledger balances
- Trial balance
- Profit and loss statement
- Balance sheet
- Assets = Liabilities + Equity
- Net profit impact on equity

## 7. Banking and Reconciliation
- Reconcile actual bank statements against accounting records
- Identify variances
- Allow manual matching and adjustments
- Track reconciliation status

## 8. Inventory Controls
- Multiple warehouses
- Stock transfer between warehouses
- Periodic and surprise stock counts
- Stock variance settlement
- FIFO / weighted average support
- Inventory movements tied to invoices

## 9. Reporting Requirements
- Daily reports
- General ledger
- Aging reports
- Customer and supplier reports
- Cash flow
- Expenses
- Sales and purchases
- Inventory
- Payroll
- Assets
- Printable and exportable reports

## 10. Backup and Recovery
- Automatic daily backups
- Retention of multiple backup versions
- Restore testing
- Ensure backups do not overwrite live production data

## 11. Production Security
- Rate limiting
- Session management
- Password reset and change flow
- Optional 2FA
- Security headers
- Encryption for sensitive data
- Environment secret management
- Attack logging and login monitoring

## 12. Performance and Scale
- Indexes on all major database fields
- Pagination
- Query optimization
- Caching for heavy reports
- Background jobs for long-running tasks
- Monitor database, API, and AI usage

## 13. Core Data Model
Main entities:
- Company
- User
- Role
- Permission
- ChartOfAccounts
- Account
- JournalEntry
- JournalLine
- Customer
- Supplier
- Invoice
- Payment
- InventoryItem
- Warehouse
- InventoryMovement
- Employee
- Payroll
- FixedAsset
- Depreciation
- CashBox
- BankAccount
- BankTransaction
- TaxSetting
- Period
- AuditLog
- BackupRecord

## 14. Initialization Flow for a New Company
1. Create company
2. Configure chart of accounts
3. Create warehouses
4. Create items
5. Create customers and suppliers
6. Create bank and cash accounts
7. Purchase inventory
8. Sell goods/services
9. Collect and pay
10. Record payroll
11. Manage fixed assets
12. Run inventory counts
13. Close monthly period
14. Generate reports
15. Verify balances

## 15. Acceptance Tests
The system must pass scenarios including:
- Sale on credit
- Purchase from supplier
- Payment collection
- Payment to supplier
- Payroll posting
- Fixed asset purchase and depreciation
- Inventory movement and cost impacts
- Bank reconciliation
- Closing period
- Financial report consistency

## 16. Target Technical Stack
Recommended stack for production:
- Frontend: React / Next.js / Vite
- Backend: Node.js / NestJS / Express
- Database: PostgreSQL
- Cache/Queue: Redis
- Authentication: JWT + bcrypt
- AI: LLM with strict validation layer
- Reporting: PDF/Excel export
- Deployment: Railway/Vercel/Docker

## 17. Initial Delivery Priorities
Phase 1
- Company setup
- Chart of accounts
- Users and roles
- Journal entries
- Trial balance
- General ledger
- Profit and loss
- Balance sheet

Phase 2
- Sales and purchases
- Cash and banking
- Inventory and stock movement
- Payroll

Phase 3
- Assets, banking reconciliation, advanced reports, AI assistant

Phase 4
- Security hardening, backup, performance tuning, multi-company support

## 18. Output Expectations
The final system must be:
- Finance-safe
- Audit-friendly
- Role-aware
- AI-controlled but permission-limited
- Production-ready
- Accurate in accounting logic
- Fully testable

## 19. Recommended Next Step
Start with the accounting core modules first:
- Company and user setup
- Chart of accounts
- Journal entries and validation
- Trial balance and ledger
- Financial reports

Then add modules progressively:
- Sales/Purchases
- Inventory
- Payroll
- Cash and bank
- Assets
- AI assistant
