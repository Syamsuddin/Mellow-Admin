const stages = ["New", "Contacted", "Proposal", "Negotiation", "Won"];
const chances = [15, 35, 55, 75, 100];
const seed = {
  deals: [
    [1, "Brand refresh retainer", "Bloom Studio", 12e3, 0, "Low", "2026-11-19", "MT"],
    [2, "Media analytics pilot", "Starlight Media", 9e3, 0, "Low", "2026-11-24", "AB"],
    [3, "Fleet tracking module", "Orbit Logistics", 15e3, 0, "Medium", "2026-11-28", "JK"],
    [4, "Q1 campaign suite", "Pixel & Co", 18500, 1, "Medium", "2026-11-14", "JK"],
    [5, "Core banking dashboard", "Summit Bank", 6e4, 1, "High", "2026-12-01", "MT"],
    [6, "Support plan upgrade", "Aster Digital", 8e3, 1, "Low", "2026-11-25", "AB"],
    [7, "CRM onboarding", "Northwind", 32e3, 2, "Medium", "2026-11-11", "AB"],
    [8, "Data warehouse setup", "Cloudnine", 22e3, 2, "Medium", "2026-11-17", "JK"],
    [9, "Annual license renewal", "Acme Corp", 48e3, 3, "High", "2026-11-07", "MT"],
    [10, "Research seats (50)", "Lumen Labs", 34e3, 3, "High", "2026-11-09", "JK"],
    [11, "Enterprise expansion", "Globex", 75e3, 4, "High", "2026-11-02", "AB"],
    [12, "Store POS integration", "Greenleaf", 26e3, 4, "Medium", "2026-11-01", "MT"]
  ].map(([id, title, company, value, stage, priority, date, owner]) => ({ id, title, company, value, stage, priority, date, owner })),
  contacts: [{ id: 1, name: "Olivia Chen", company: "Bloom Studio", email: "olivia@example.com", role: "Creative Director" }, { id: 2, name: "James Miller", company: "Acme Corp", email: "james@example.com", role: "Product Lead" }, { id: 3, name: "Amelia Brown", company: "Northwind", email: "amelia@example.com", role: "Operations Manager" }, { id: 4, name: "Lucas Martin", company: "Globex", email: "lucas@example.com", role: "CEO" }, { id: 5, name: "Sofia Wilson", company: "Pixel & Co", email: "sofia@example.com", role: "Marketing Lead" }],
  tasks: [{ id: 1, title: "Send proposal to Northwind", date: "2026-11-04", done: false }, { id: 2, title: "Prepare renewal presentation", date: "2026-11-06", done: false }, { id: 3, title: "Follow up with Bloom Studio", date: "2026-11-03", done: false }, { id: 4, title: "Review October performance", date: "2026-11-02", done: true }],
  invoices: [{ id: 1042, company: "Globex", amount: 75e3, date: "2026-11-02", status: "Paid" }, { id: 1041, company: "Greenleaf", amount: 26e3, date: "2026-11-01", status: "Paid" }, { id: 1040, company: "Acme Corp", amount: 24e3, date: "2026-11-07", status: "Pending" }, { id: 1039, company: "Bloom Studio", amount: 12e3, date: "2026-10-29", status: "Overdue" }],
  messages: [{ id: 1, name: "Olivia Chen", subject: "Let\u2019s bring the new brand to life", text: "Hi Mia, thank you for the proposal. We love the direction! Could we arrange a short call this week to discuss the timeline?", time: "09:41", unread: true, replies: [] }, { id: 2, name: "James Miller", subject: "Annual renewal details", text: "Hello! Please send the updated license proposal for our next review. Our team is ready to discuss the renewal.", time: "Yesterday", unread: true, replies: [] }, { id: 3, name: "Amelia Brown", subject: "CRM onboarding schedule", text: "Thanks for sharing the onboarding plan. Tuesday morning works well for the team.", time: "Monday", unread: false, replies: [] }],
  events: [{ id: 1, title: "Acme renewal review", date: "2026-11-07", time: "10:00" }, { id: 2, title: "Northwind onboarding", date: "2026-11-11", time: "09:00" }, { id: 3, title: "Team pipeline review", date: "2026-11-19", time: "14:00" }],
  products: [{ id: 1, name: "Mellow CRM Starter", sku: "MC-001", category: "Software", price: 49, stock: 120, status: "Active" }, { id: 2, name: "Mellow CRM Pro", sku: "MC-002", category: "Software", price: 129, stock: 85, status: "Active" }, { id: 3, name: "Onboarding workshop", sku: "SV-010", category: "Service", price: 900, stock: 12, status: "Active" }, { id: 4, name: "Analytics add-on", sku: "AD-020", category: "Add-on", price: 39, stock: 0, status: "Out of stock" }, { id: 5, name: "Priority support plan", sku: "SV-011", category: "Service", price: 250, stock: 40, status: "Active" }, { id: 6, name: "Legacy connector", sku: "AD-021", category: "Add-on", price: 19, stock: 7, status: "Archived" }],
  orders: [{ id: 5021, customer: "Globex", items: 3, total: 1290, date: "2026-11-02", status: "Delivered", payment: "Card" }, { id: 5020, customer: "Greenleaf", items: 1, total: 900, date: "2026-11-01", status: "Shipped", payment: "Transfer" }, { id: 5019, customer: "Acme Corp", items: 2, total: 378, date: "2026-10-31", status: "Processing", payment: "Card" }, { id: 5018, customer: "Northwind", items: 4, total: 2150, date: "2026-10-30", status: "Pending", payment: "Invoice" }, { id: 5017, customer: "Bloom Studio", items: 1, total: 49, date: "2026-10-28", status: "Cancelled", payment: "Card" }, { id: 5016, customer: "Lumen Labs", items: 2, total: 1550, date: "2026-10-27", status: "Delivered", payment: "Transfer" }],
  team: [{ id: 1, name: "Mia Taylor", email: "mia@example.com", role: "Admin", status: "Active", joined: "2024-03-12" }, { id: 2, name: "Alex Brown", email: "alex@example.com", role: "Manager", status: "Active", joined: "2024-08-01" }, { id: 3, name: "Jamie Kim", email: "jamie@example.com", role: "Sales", status: "Active", joined: "2025-01-20" }, { id: 4, name: "Lena Weber", email: "lena@example.com", role: "Support", status: "Invited", joined: "2026-10-15" }, { id: 5, name: "Noah Davis", email: "noah@example.com", role: "Viewer", status: "Inactive", joined: "2025-06-03" }],
  projects: [{ id: 1, name: "Website relaunch", client: "Bloom Studio", progress: 72, due: "2026-12-05", status: "On track", members: ["MT", "AB"] }, { id: 2, name: "Mobile app MVP", client: "Pixel & Co", progress: 38, due: "2027-01-20", status: "At risk", members: ["JK", "MT"] }, { id: 3, name: "Data migration", client: "Summit Bank", progress: 91, due: "2026-11-28", status: "On track", members: ["AB"] }, { id: 4, name: "Brand guidelines", client: "Acme Corp", progress: 100, due: "2026-10-30", status: "Completed", members: ["JK"] }],
  files: [{ id: 1, name: "Proposal - Northwind.pdf", type: "PDF", size: "1.2 MB", owner: "MT", date: "2026-11-01", folder: "Proposals" }, { id: 2, name: "Q4 pipeline.xlsx", type: "Sheet", size: "310 KB", owner: "AB", date: "2026-10-30", folder: "Reports" }, { id: 3, name: "Brand kit.zip", type: "Archive", size: "24 MB", owner: "JK", date: "2026-10-22", folder: "Assets" }, { id: 4, name: "Contract template.docx", type: "Document", size: "88 KB", owner: "MT", date: "2026-10-18", folder: "Legal" }, { id: 5, name: "Kickoff notes.md", type: "Document", size: "6 KB", owner: "AB", date: "2026-10-12", folder: "Projects" }],
  activity: [{ id: 1, text: "Enterprise expansion moved to Won", who: "AB", time: "2026-11-02 09:12", kind: "deal" }, { id: 2, text: "Invoice INV-1042 marked as paid", who: "MT", time: "2026-11-02 08:40", kind: "invoice" }, { id: 3, text: "Lena Weber invited to the team", who: "MT", time: "2026-11-01 16:05", kind: "team" }, { id: 4, text: "New order #5020 from Greenleaf", who: "JK", time: "2026-11-01 11:30", kind: "order" }, { id: 5, text: "Proposal - Northwind.pdf uploaded", who: "MT", time: "2026-11-01 10:02", kind: "file" }],
  settings: { name: "Mia Taylor", email: "mia@example.com", workspace: "Mellow Studio", accent: "violet", dark: false, compact: false, plan: "Pro", navCollapsed: ["UI kit"], digest: true, dealAlerts: true, taskReminders: true, mentions: false }
};
const plans = [{ name: "Starter", price: 0, note: "For solo users", features: ["1 workspace", "Up to 50 deals", "Email support"] }, { name: "Pro", price: 29, note: "For growing teams", features: ["Unlimited deals", "Team roles", "Reports & CSV export", "Priority support"] }, { name: "Business", price: 79, note: "For larger organizations", features: ["Everything in Pro", "Audit log", "SSO & 2FA", "Dedicated manager"] }];
const receipts = [{ id: "RCPT-2026-11", date: "2026-11-01", plan: "Pro", amount: 29, status: "Paid" }, { id: "RCPT-2026-10", date: "2026-10-01", plan: "Pro", amount: 29, status: "Paid" }, { id: "RCPT-2026-09", date: "2026-09-01", plan: "Starter", amount: 0, status: "Paid" }];
const faq = [["How is demo data stored?", "Every record is saved in this browser's localStorage under the key mellow-admin-v1. Nothing is sent to a server."], ["Can I connect a real backend?", "Yes. Replace the local state helpers (saveRecord, patch, move, remove) in App.jsx with API calls and keep the UI as it is."], ["How do I reset the demo?", "Open Settings and choose Reset demo data. The original sample records are restored."], ["Does drag-and-drop work on mobile?", "Dragging uses native HTML5 events, which touch devices do not support. Use the Move to select on each deal card instead."], ["How do I change the accent color or theme?", "Settings \u2192 Appearance offers violet, rose, sage, and navy accents, plus dark and compact modes."], ["Are the login and register pages functional?", "They are layout demos. Connect them to your authentication backend before use."]];
const revenue = { months: ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"], actual: [24, 27, 30, 35, 33, 38, 32, 48, 43, 58, 74, 101], target: [30, 32, 34, 36, 38, 40, 44, 48, 52, 58, 64, 72] };
const trends = [[0.72, 0.78, 0.74, 0.83, 0.8, 0.88, 0.9, 1], [0.8, 0.76, 0.84, 0.82, 0.9, 0.86, 0.95, 1], [0.35, 0.42, 0.42, 0.55, 0.6, 0.6, 0.78, 1], [1.08, 1.04, 1.1, 1.02, 0.98, 1.03, 1.05, 1]];
const quarterTarget = 25e4;
const engagement = Array.from({ length: 364 }, (_, i) => {
  const d = new Date(2025, 10, 10 + i), date = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const r = Math.abs(Math.sin(i * 12.9898 + 4.1) * 43758.5453) % 1;
  return { date, value: date > "2026-11-03" ? null : Math.round((i % 7 < 5 ? 3 + r * 12 : r * 4) * (0.75 + i / 728)) };
});
const money = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const short = (n) => Math.abs(n) < 1e3 ? money(n) : "$" + (n / 1e3).toLocaleString("en-US", { maximumFractionDigits: 1 }) + "K";
const initials = (name) => name.split(/\s+/).map((s) => s[0]).slice(0, 2).join("").toUpperCase();
const fmtDate = (date) => (/* @__PURE__ */ new Date(date + "T12:00:00")).toLocaleDateString("en-US", { month: "short", day: "numeric" });
export {
  chances,
  engagement,
  faq,
  fmtDate,
  initials,
  money,
  plans,
  quarterTarget,
  receipts,
  revenue,
  seed,
  short,
  stages,
  trends
};
