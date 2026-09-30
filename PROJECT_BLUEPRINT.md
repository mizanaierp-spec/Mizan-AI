# 🏗️ Mizan AI - Project Blueprint

## 1. Project Objective
Mizan AI is a complete accounting and enterprise management system designed to support all core accounting operations, financial reporting, inventory, payroll, assets, banking, taxes, and user control with a safe AI layer.

## 2. Core Functional Modules

### 2.1 Basic Accounting
- Chart of accounts
- Debits and credits
- Daily journal entries with automatic balance validation
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
- Payment tracking (paid vs. remaining)
- Tax handling (with exemptions)
- Multi-currency support with exchange rates

### 2.3 Cash and Banking
- Cash boxes management
- Bank accounts
- Deposits, withdrawals, and transfers
- Reconciliation (actual vs. accounting balances)
- Bank statement matching

### 2.4 Inventory Management
- Items and categories
- Warehouses and stock transfers
- Incoming and outgoing movements
- Inventory counts (periodic and surprise)
- Stock adjustments
- Costing methods (weighted average, FIFO)
- Reorder level alerts
- Movement tracking tied to invoices

### 2.5 Payroll and Human Resources
- Employee records with full details
- Salary calculation
- Allowances and deductions
- Payroll processing
- Net salary calculation
- Payroll postings to accounting
- Tax on payroll

### 2.6 Fixed Assets
- Asset registration and register
- Depreciation calculation
- Accumulated depreciation
- Disposal and sale of assets
- Related journal entries
- Asset reports

### 2.7 Advances and Custody
- Advance payments issued
- Settlement of advances
- Cash custody tracking
- Remaining balances
- Return of custody

### 2.8 Taxes and Legal Compliance
- Tax settings per company
- Tax exemptions
- Tax on items and invoices
- Tax reports
- Return and tax adjustment handling
- Tax ID

### 2.9 Audit and Security
- Complete user activity log
- Who created, modified, posted, cancelled, or reversed entries
- Before and after values
- Access control and role restrictions
- AI action logging
- Operation timestamps

## 3. Roles and Permissions

11 distinct roles:
- System administrator
- Company manager
- Accountant
- Sales
- Purchases
- Warehouse manager
- HR
- Cashier
- Auditor/Monitor
- Read-only user
- AI agent

Each action must be validated by:
- User authentication (JWT)
- Role permissions
- Data validation
- Business rules
- Approval confirmation (for sensitive actions)

## 4. Smart AI Layer

The AI assistant must be treated as a controlled execution layer, NOT as a superuser.

### AI Safety Requirements
- Read data from the database only when allowed
- Analyze reports and answer accounting questions
- Execute only permitted operations for the user's role
- Never create an unbalanced journal entry
- Log all AI actions in detail (what, who, when, why)
- Require user confirmation before any sensitive action
- Must validate user rights before execution
- Strictly respect user permissions

### AI Execution Flow
```
User Request
  ↓
Natural Language Processing
  ↓
Intent Recognition
  ↓
Permission Check (user rights vs. operation)
  ↓
Business Data Validation
  ↓
Accounting Rule Validation
  ↓
Preview Operation (show what will happen)
  ↓
Ask for User Confirmation
  ↓
Create Transaction
  ↓
Post Journal Entry (balanced)
  ↓
Audit Log Entry
  ↓
Response to User
```

## 5. Accounting Validation Rules

- Journal must always be balanced (Debit = Credit)
- Cannot edit a posted entry after period closure unless authorized
- Closing period requires manager approval only
- Automatic safe numbering for journal entries (handle concurrency)
- Reversal entries must be used instead of deleting posted entries
- Cannot delete an invoice once posted
- Cannot delete an inventory movement once posted

## 6. Financial Consistency Checks

The system must automatically validate and ensure:
- General ledger balances equal account balances
- Trial balance sums = general ledger totals
- Profit and loss statement = income - expenses
- Balance sheet: Assets = Liabilities + Equity
- Net profit from P&L = change in equity
- All journal entries are balanced
- Inventory COGS tied to cost of goods sold

## 7. Banking and Reconciliation

- Reconcile actual bank statements against accounting records
- Identify variances and discrepancies
- Manual matching and variance adjustments
- Track reconciliation status (pending, matched, cleared)
- Report reconciliation differences
- Aging of outstanding items

## 8. Inventory Controls

- Support multiple warehouses
- Stock transfer between warehouses
- Periodic and surprise stock counts
- Stock variance settlement and adjustments
- Support FIFO and weighted average costing
- Inventory movements tied to source documents (invoices)
- Reorder point and reorder quantity

## 9. Reporting Requirements

### Daily/Monthly Reports
- Daily operations report
- General ledger (detail by account)
- Trial balance
- Aging reports (customers and suppliers)
- Customer and supplier statements
- Cash flow statement
- Expense report
- Sales and purchase report
- Inventory status report
- Payroll report
- Asset register and depreciation

### Financial Statements
- Profit and loss statement
- Balance sheet
- Cash flow statement
- Trial balance

### Export Formats
- PDF (printable, Arabic/English)
- Excel with formatting
- CSV for import

## 10. Backup and Recovery

- Automatic daily backups
- Retention of multiple backup versions (at least 30 days)
- Restore testing procedure
- Ensure backups do not overwrite live production data
- Backup encryption
- Backup verification

## 11. Production Security

- Rate limiting on API endpoints
- Session management (timeout, logout)
- Password reset and change flow
- Optional 2FA (TOTP)
- Security headers (HSTS, CSP, X-Frame-Options, etc.)
- Encryption for sensitive data (passwords, API keys)
- Environment secret management
- Attack logging (failed login attempts, suspicious activity)
- Login monitoring and alerts
- API key rotation
- HTTPS/SSL enforcement

## 12. Performance and Scale

- Database indexes on all major fields
- Query optimization (avoid N+1 queries)
- Pagination on large datasets
- Caching for heavy reports (Redis)
- Background jobs for long-running tasks (batch payroll, EOD reports)
- Database connection pooling
- Monitor database performance, API latency, AI usage
- Load testing capability

## 13. Core Data Model

Main entities:
- Company (multi-company support)
- User
- Role
- Permission
- ChartOfAccounts
- Account (with parent-child hierarchy)
- JournalEntry (master)
- JournalLine (detail)
- Customer
- Supplier
- Invoice (sales and purchase)
- InvoiceLine
- Payment
- InventoryItem
- Warehouse
- InventoryMovement
- Employee
- Payroll
- PayrollLine
- FixedAsset
- Depreciation
- CashBox
- BankAccount
- BankTransaction
- TaxSetting
- Period
- AuditLog
- BackupRecord

## 14. Initialization Flow for New Company

```
1. Create company
2. Configure chart of accounts
3. Create warehouses
4. Create items
5. Create customers and suppliers
6. Create bank and cash accounts
7. Record opening balances
8. Purchase inventory
9. Sell goods/services
10. Collect payments
11. Pay suppliers
12. Record payroll
13. Manage fixed assets
14. Run inventory counts
15. Close monthly period
16. Generate financial reports
17. Verify all balances match
```

## 15. Acceptance Tests

The system must pass comprehensive scenarios:

### Scenario 1: Sale on Credit
- Create sales invoice → customer becomes debtor
- Revenue recognized
- Inventory decreased
- COGS increased
- Tax calculated correctly
- All journal entries balanced
- P&L and balance sheet updated
- Trial balance still balanced

### Scenario 2: Purchase and Payment
- Create purchase invoice → supplier becomes creditor
- Inventory increased
- Tax calculated
- Payment issued → supplier account settled
- All journal entries balanced

### Scenario 3: Inventory and Costing
- Purchases at different prices
- Sales with correct costing method
- Inventory valued correctly
- COGS accurate
- Balance sheet reflects correct inventory value

### Scenario 4: Bank Reconciliation
- Record deposits and withdrawals
- Reconcile with actual bank statement
- Identify and resolve discrepancies
- Aging of outstanding items

### Scenario 5: Payroll
- Create employee with salary structure
- Calculate payroll (salary + allowances - deductions)
- Generate payroll posting
- Create journal entry for expenses
- Payroll liability tracked
- Tax implications recorded

### Scenario 6: Fixed Assets
- Purchase asset
- Calculate monthly depreciation
- Accumulated depreciation tracked
- Sale of asset → gain/loss recognized
- Journal entries created automatically

### Scenario 7: Period Closure
- Close month after all transactions
- Verify trial balance
- Lock period (no more edits)
- Verify P&L ties to balance sheet
- Verify Assets = Liabilities + Equity

### Scenario 8: AI Operations
- User asks AI to record a sale
- AI checks permissions
- AI previews the operation
- AI asks for confirmation
- AI executes and logs everything
- User can see audit trail

## 16. Target Technical Stack

Recommended for production:
- **Frontend**: React 18 / Next.js 14 / Vite
- **Backend**: Node.js 18+ / Express / NestJS
- **Database**: PostgreSQL 14+
- **Cache/Queue**: Redis 7+
- **Authentication**: JWT + bcrypt
- **AI**: LLM API (OpenAI/Local) with validation layer
- **Reporting**: PDF (pdfkit), Excel (xlsx)
- **Deployment**: Railway / Docker / Kubernetes
- **Monitoring**: Prometheus / Grafana / ELK Stack
- **Testing**: Jest / Mocha / Chai

## 17. Implementation Phases

### Phase 1: Core Accounting (Weeks 1-4)
- Company setup
- User and role management
- Chart of accounts
- Journal entries with balance validation
- Trial balance and general ledger
- Profit and loss statement
- Balance sheet
- Basic audit logging

### Phase 2: Sales/Purchases & Inventory (Weeks 5-8)
- Sales and purchase invoices
- Inventory management
- Warehouse operations
- Stock movements and costing
- Returns handling
- Tax integration

### Phase 3: Banking & Cash (Weeks 9-11)
- Cash box management
- Bank accounts
- Reconciliation
- Payments and collections
- Bank statement matching

### Phase 4: Payroll & Assets (Weeks 12-14)
- Employee management
- Payroll processing
- Fixed assets
- Depreciation calculation
- Asset register

### Phase 5: AI & Security (Weeks 15-16)
- AI chatbot with safety layer
- Advanced reporting
- Security hardening
- Performance optimization
- Comprehensive testing

## 18. Definition of Done

Before marking the system "Production Ready":
- ✅ All core modules tested
- ✅ Comprehensive integration tests pass
- ✅ Full end-to-end scenario works
- ✅ Security audit complete
- ✅ Performance tested at scale
- ✅ Backup and restore tested
- ✅ Documentation complete
- ✅ Training materials prepared
- ✅ Support procedures established

## 19. Success Criteria

- 100% journal entries are balanced
- All reports reconcile and are accurate
- No data loss during operations
- Response time < 500ms for most queries
- Audit trail captures all changes
- Permissions are enforced strictly
- AI never violates permissions
- System passes all acceptance tests
