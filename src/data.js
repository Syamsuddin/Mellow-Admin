import oliviaChen from "./photos/olivia-chen.webp";
import jamesMiller from "./photos/james-miller.webp";
import ameliaBrown from "./photos/amelia-brown.webp";
import lucasMartin from "./photos/lucas-martin.webp";
import sofiaWilson from "./photos/sofia-wilson.webp";
import arifHidayat from "./photos/arif-hidayat.webp";
import cutRahma from "./photos/cut-rahma.webp";
const stages = ["New", "Contacted", "Proposal", "Negotiation", "Won"];
const chances = [15, 35, 55, 75, 100];
const seed = {
  deals: [
    [1, "Brand refresh retainer", "Bloom Studio", 12e3, 0, "Low", "2026-11-19", "CR"],
    [2, "Media analytics pilot", "Starlight Media", 9e3, 0, "Low", "2026-11-24", "AB"],
    [3, "Fleet tracking module", "Orbit Logistics", 15e3, 0, "Medium", "2026-11-28", "JK"],
    [4, "Q1 campaign suite", "Pixel & Co", 18500, 1, "Medium", "2026-11-14", "JK"],
    [5, "Core banking dashboard", "Summit Bank", 6e4, 1, "High", "2026-12-01", "CR"],
    [6, "Support plan upgrade", "Aster Digital", 8e3, 1, "Low", "2026-11-25", "AB"],
    [7, "CRM onboarding", "Northwind", 32e3, 2, "Medium", "2026-11-11", "AB"],
    [8, "Data warehouse setup", "Cloudnine", 22e3, 2, "Medium", "2026-11-17", "JK"],
    [9, "Annual license renewal", "Acme Corp", 48e3, 3, "High", "2026-11-07", "CR"],
    [10, "Research seats (50)", "Lumen Labs", 34e3, 3, "High", "2026-11-09", "JK"],
    [11, "Enterprise expansion", "Globex", 75e3, 4, "High", "2026-11-02", "AB"],
    [12, "Store POS integration", "Greenleaf", 26e3, 4, "Medium", "2026-11-01", "CR"]
  ].map(([id, title, company, value, stage, priority, date, owner]) => ({ id, title, company, value, stage, priority, date, owner })),
  contacts: [{ id: 1, name: "Olivia Chen", company: "Bloom Studio", email: "olivia@example.com", role: "Creative Director" }, { id: 2, name: "James Miller", company: "Acme Corp", email: "james@example.com", role: "Product Lead" }, { id: 3, name: "Amelia Brown", company: "Northwind", email: "amelia@example.com", role: "Operations Manager" }, { id: 4, name: "Lucas Martin", company: "Globex", email: "lucas@example.com", role: "CEO" }, { id: 5, name: "Sofia Wilson", company: "Pixel & Co", email: "sofia@example.com", role: "Marketing Lead" }, { id: 6, name: "Arif Hidayat", company: "Summit Bank", email: "arif@example.com", role: "Head of Digital Banking" }],
  tasks: [{ id: 1, title: "Send proposal to Northwind", date: "2026-11-04", done: false }, { id: 2, title: "Prepare renewal presentation", date: "2026-11-06", done: false }, { id: 3, title: "Follow up with Bloom Studio", date: "2026-11-03", done: false }, { id: 4, title: "Review October performance", date: "2026-11-02", done: true }],
  invoices: [{ id: 1042, company: "Globex", amount: 75e3, date: "2026-11-02", status: "Paid" }, { id: 1041, company: "Greenleaf", amount: 26e3, date: "2026-11-01", status: "Paid" }, { id: 1040, company: "Acme Corp", amount: 24e3, date: "2026-11-07", status: "Pending" }, { id: 1039, company: "Bloom Studio", amount: 12e3, date: "2026-10-29", status: "Overdue" }],
  messages: [{ id: 1, name: "Olivia Chen", subject: "Let\u2019s bring the new brand to life", text: "Hi Rahma, thank you for the proposal. We love the direction! Could we arrange a short call this week to discuss the timeline?", time: "09:41", unread: true, replies: [] }, { id: 2, name: "James Miller", subject: "Annual renewal details", text: "Hello! Please send the updated license proposal for our next review. Our team is ready to discuss the renewal.", time: "Yesterday", unread: true, replies: [] }, { id: 3, name: "Amelia Brown", subject: "CRM onboarding schedule", text: "Thanks for sharing the onboarding plan. Tuesday morning works well for the team.", time: "Monday", unread: false, replies: [] }],
  events: [{ id: 1, title: "Acme renewal review", date: "2026-11-07", time: "10:00" }, { id: 2, title: "Northwind onboarding", date: "2026-11-11", time: "09:00" }, { id: 3, title: "Team pipeline review", date: "2026-11-19", time: "14:00" }],
  products: [{ id: 1, name: "Mellow CRM Starter", sku: "MC-001", category: "Software", price: 49, stock: 120, status: "Active" }, { id: 2, name: "Mellow CRM Pro", sku: "MC-002", category: "Software", price: 129, stock: 85, status: "Active" }, { id: 3, name: "Onboarding workshop", sku: "SV-010", category: "Service", price: 900, stock: 12, status: "Active" }, { id: 4, name: "Analytics add-on", sku: "AD-020", category: "Add-on", price: 39, stock: 0, status: "Out of stock" }, { id: 5, name: "Priority support plan", sku: "SV-011", category: "Service", price: 250, stock: 40, status: "Active" }, { id: 6, name: "Legacy connector", sku: "AD-021", category: "Add-on", price: 19, stock: 7, status: "Archived" }],
  orders: [{ id: 5021, customer: "Globex", items: 3, total: 1290, date: "2026-11-02", status: "Delivered", payment: "Card" }, { id: 5020, customer: "Greenleaf", items: 1, total: 900, date: "2026-11-01", status: "Shipped", payment: "Transfer" }, { id: 5019, customer: "Acme Corp", items: 2, total: 378, date: "2026-10-31", status: "Processing", payment: "Card" }, { id: 5018, customer: "Northwind", items: 4, total: 2150, date: "2026-10-30", status: "Pending", payment: "Invoice" }, { id: 5017, customer: "Bloom Studio", items: 1, total: 49, date: "2026-10-28", status: "Cancelled", payment: "Card" }, { id: 5016, customer: "Lumen Labs", items: 2, total: 1550, date: "2026-10-27", status: "Delivered", payment: "Transfer" }],
  team: [{ id: 1, name: "Cut Rahma", email: "cut.rahma@example.com", role: "Admin", status: "Active", joined: "2024-03-12" }, { id: 2, name: "Alex Brown", email: "alex@example.com", role: "Manager", status: "Active", joined: "2024-08-01" }, { id: 3, name: "Jamie Kim", email: "jamie@example.com", role: "Sales", status: "Active", joined: "2025-01-20" }, { id: 4, name: "Lena Weber", email: "lena@example.com", role: "Support", status: "Invited", joined: "2026-10-15" }, { id: 5, name: "Noah Davis", email: "noah@example.com", role: "Viewer", status: "Inactive", joined: "2025-06-03" }],
  projects: [{ id: 1, name: "Website relaunch", client: "Bloom Studio", progress: 72, due: "2026-12-05", status: "On track", members: ["CR", "AB"] }, { id: 2, name: "Mobile app MVP", client: "Pixel & Co", progress: 38, due: "2027-01-20", status: "At risk", members: ["JK", "CR"] }, { id: 3, name: "Data migration", client: "Summit Bank", progress: 91, due: "2026-11-28", status: "On track", members: ["AB"] }, { id: 4, name: "Brand guidelines", client: "Acme Corp", progress: 100, due: "2026-10-30", status: "Completed", members: ["JK"] }],
  files: [{ id: 1, name: "Proposal - Northwind.pdf", type: "PDF", size: "1.2 MB", owner: "CR", date: "2026-11-01", folder: "Proposals" }, { id: 2, name: "Q4 pipeline.xlsx", type: "Sheet", size: "310 KB", owner: "AB", date: "2026-10-30", folder: "Reports" }, { id: 3, name: "Brand kit.zip", type: "Archive", size: "24 MB", owner: "JK", date: "2026-10-22", folder: "Assets" }, { id: 4, name: "Contract template.docx", type: "Document", size: "88 KB", owner: "CR", date: "2026-10-18", folder: "Legal" }, { id: 5, name: "Kickoff notes.md", type: "Document", size: "6 KB", owner: "AB", date: "2026-10-12", folder: "Projects" }],
  activity: [{ id: 1, text: "Enterprise expansion moved to Won", who: "AB", time: "2026-11-02 09:12", kind: "deal" }, { id: 2, text: "Invoice INV-1042 marked as paid", who: "CR", time: "2026-11-02 08:40", kind: "invoice" }, { id: 3, text: "Lena Weber invited to the team", who: "CR", time: "2026-11-01 16:05", kind: "team" }, { id: 4, text: "New order #5020 from Greenleaf", who: "JK", time: "2026-11-01 11:30", kind: "order" }, { id: 5, text: "Proposal - Northwind.pdf uploaded", who: "CR", time: "2026-11-01 10:02", kind: "file" }],
  settings: { name: "Cut Rahma", email: "cut.rahma@example.com", workspace: "Mellow Studio", accent: "violet", dark: false, compact: false, plan: "Pro", navCollapsed: ["UI kit", "Forms"], digest: true, dealAlerts: true, taskReminders: true, mentions: false }
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
const wave = (i, s) => Math.abs(Math.sin(i * 12.9898 + s) * 43758.5453) % 1;
const sampleDays = (n, f) => Array.from({ length: n }, (_, i) => {
  const d = new Date(2026, 10, 4 - n + i);
  return { date: d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"), ...f(i, d.getDay() % 6 === 0) };
});
const sold = { 1: 520, 2: 240, 3: 14, 4: 310, 5: 38, 6: 22 };
const storeRaw = sampleDays(180, (i, weekend) => ({ sales: (0.8 + i / 400) * (weekend ? 0.8 : 1.05) * (0.85 + wave(i, 1.7) * 0.3) }));
const storeScale = seed.products.reduce((a, p) => a + p.price * (sold[p.id] || 0), 0) / storeRaw.slice(-30).reduce((a, d) => a + d.sales, 0);
const store = {
  sold,
  goal: 1e5,
  days: storeRaw.map((d, i) => {
    const sales = Math.round(d.sales * storeScale), orders = Math.max(1, Math.round(sales / (108 + wave(i, 3.1) * 24)));
    return { date: d.date, sales, orders, sessions: Math.round(orders / (0.027 + wave(i, 5.3) * 0.01)) };
  }),
  funnel: [["Viewed a product", 0.48], ["Added to cart", 0.141], ["Reached checkout", 0.054]],
  regions: [["United States", "US", 0.36, 0.33, 6], ["Indonesia", "ID", 0.18, 0.22, 14], ["Germany", "DE", 0.14, 0.13, -3], ["United Kingdom", "GB", 0.12, 0.12, 4], ["Australia", "AU", 0.08, 0.07, 9], ["Rest of world", "", 0.12, 0.13, 2]].map(([name, code, sales, orders, change]) => ({ name, code, sales, orders, change }))
};
const traffic = {
  days: sampleDays(180, (i, weekend) => {
    const visitors = Math.round((620 + i * 2.4) * (weekend ? 0.7 : 1.06) * (0.86 + wave(i, 2.3) * 0.28));
    return { visitors, views: Math.round(visitors * (2.3 + wave(i, 4.1) * 0.7)), signups: Math.round(visitors * (0.019 + wave(i, 6.2) * 0.011)), duration: Math.round(170 + i * 0.12 + wave(i, 7.7) * 60) };
  }),
  channels: [["Organic search", 0.41, 2.6], ["Direct", 0.24, 3.1], ["Social", 0.15, 1.2], ["Referral", 0.11, 2.4], ["Email & other", 0.09, 4.3]].map(([name, share, rate]) => ({ name, share, rate })),
  devices: [["Desktop", 0.56, 228, 36], ["Mobile", 0.37, 141, 51], ["Tablet", 0.07, 176, 44]].map(([name, share, time, bounce]) => ({ name, share, time, bounce })),
  hours: [0.18, 0.08, 0.1, 0.42, 0.88, 1, 0.94, 0.86, 0.7, 0.52, 0.4, 0.28],
  pages: [["/", "Home", 0.28, 41, 48], ["/pricing", "Pricing", 0.16, 28, 95], ["/features/pipeline", "Pipeline feature tour", 0.12, 33, 124], ["/blog/clay-and-glass-ui", "Blog: Designing clay and glass UI", 0.1, 62, 212], ["/sign-up", "Sign up", 0.08, 19, 71], ["/docs/getting-started", "Docs: Getting started", 0.07, 24, 256]].map(([path, title, share, bounce, time]) => ({ path, title, share, bounce, time })),
  countries: [["United States", "US", 0.34], ["Indonesia", "ID", 0.16], ["India", "IN", 0.11], ["Germany", "DE", 0.09], ["United Kingdom", "GB", 0.08]].map(([name, code, share]) => ({ name, code, share })),
  campaigns: [["Autumn launch", "Paid search", 4820, 162, 3900], ["Product Hunt feature", "Referral", 2980, 96, 0], ["LinkedIn retargeting", "Social", 3310, 74, 2650], ["Clay UI webinar", "Email", 2140, 118, 600], ["Partner newsletter", "Referral", 1260, 51, 0]].map(([name, channel, clicks, signups, spend]) => ({ name, channel, clicks, signups, spend })),
  live: [["/pricing", 0.3], ["/", 0.24], ["/features/pipeline", 0.16], ["/sign-up", 0.11]],
  returning: 0.38,
  frequency: [["1 visit", 62], ["2", 17], ["3–5", 13], ["6+", 8]],
  bounce: 42
};
const money = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const short = (n) => Math.abs(n) < 1e3 ? money(n) : "$" + (n / 1e3).toLocaleString("en-US", { maximumFractionDigits: 1 }) + "K";
const initials = (name) => name.split(/\s+/).map((s) => s[0]).slice(0, 2).join("").toUpperCase();
const fmtDate = (date) => (/* @__PURE__ */ new Date(date + "T12:00:00")).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const photos = { 1: oliviaChen, 2: jamesMiller, 3: ameliaBrown, 4: lucasMartin, 5: sofiaWilson, 6: arifHidayat };
const profilePhoto = cutRahma;
export {
  chances,
  engagement,
  faq,
  fmtDate,
  initials,
  money,
  photos,
  plans,
  profilePhoto,
  quarterTarget,
  receipts,
  revenue,
  seed,
  short,
  stages,
  store,
  traffic,
  trends
};
