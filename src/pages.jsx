import React, { useState, useRef } from "react";
import { money, short, fmtDate, initials, plans, receipts, faq } from "./data";
import { Icon, Button, Avatar, Badge, Empty, StatCard, Menu } from "./components";
const today = () => new Date().toISOString().slice(0, 10);
const statusTone = { Active: "success", Delivered: "success", "On track": "success", Completed: "success", Paid: "success", Shipped: "low", Processing: "low", Invited: "low", Pending: "medium", "At risk": "high", "Out of stock": "high", Cancelled: "high", Inactive: "", Archived: "", Viewer: "" };
const Segmented = ({ options, value, onChange, label = "Filter" }) => <div className="segmented" role="group" aria-label={label}>{options.map((o) => <button key={o} className={value === o ? "selected" : ""} aria-pressed={value === o} onClick={() => onChange(o)}>{o}</button>)}</div>;
const confirmRemove = (ctx, key, row, label) => ctx.remove(key, row, label);
function Products(ctx) {
  const { data, match, pageHead, setModal, exportCSV } = ctx;
  const [cat, setCat] = useState("All");
  const rows = data.products.filter(match).filter((p) => cat === "All" || p.category === cat);
  const active = data.products.filter((p) => p.status === "Active");
  return <>{pageHead("Manage your catalog, prices, and stock levels.", <><Button icon="download" onClick={() => exportCSV(rows, "products")}>Export</Button><Button kind="primary" icon="plus" onClick={() => setModal({ type: "product" })}>Add product</Button></>)}<div className="stats"><StatCard tone="lavender" icon="box" value={data.products.length} label="Products" /><StatCard tone="blue" icon="check" value={active.length} label="Active listings" /><StatCard tone="coral" icon="alert" value={data.products.filter((p) => p.stock < 10).length} label="Low or out of stock" /><StatCard tone="peach" icon="chart" value={short(active.reduce((a, p) => a + p.price * p.stock, 0))} label="Stock value" /></div><div className="filter-bar"><Segmented label="Category" options={["All", "Software", "Service", "Add-on"]} value={cat} onChange={setCat} /><span>{rows.length} items</span></div><section className="panel table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Action</th></tr></thead><tbody>{rows.map((p) => <tr key={p.id}><td><div className="cell-main"><span className={"company-icon tone-" + p.id % 4}>{p.name[0]}</span><span><button className="text-btn" onClick={() => setModal({ type: "product", record: p })}>{p.name}</button><small>{p.sku}</small></span></div></td><td>{p.category}</td><td><strong>{money(p.price)}</strong></td><td>{p.stock}</td><td><Badge tone={statusTone[p.status]}>{p.status}</Badge></td><td><Button onClick={() => setModal({ type: "product", record: p })}>Edit</Button></td></tr>)}</tbody></table>{!rows.length && <Empty />}</section></>;
}
function Orders(ctx) {
  const { data, match, pageHead, patch, setToast, exportCSV, log } = ctx;
  const [status, setStatus] = useState("All");
  const rows = data.orders.filter((o) => match(o, "#" + o.id)).filter((o) => status === "All" || o.status === status);
  const count = (s) => data.orders.filter((o) => o.status === s).length;
  return <>{pageHead("Track fulfilment and update order status.", <Button icon="download" onClick={() => exportCSV(rows, "orders")}>Export orders</Button>)}<div className="stats"><StatCard tone="lavender" icon="cart" value={data.orders.length} label="Total orders" /><StatCard tone="peach" icon="clock" value={count("Pending") + count("Processing")} label="Awaiting fulfilment" /><StatCard tone="blue" icon="box" value={count("Shipped")} label="In transit" /><StatCard tone="coral" icon="chart" value={short(data.orders.filter((o) => o.status !== "Cancelled").reduce((a, o) => a + o.total, 0))} label="Order revenue" /></div><div className="filter-bar"><Segmented label="Order status" options={["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"]} value={status} onChange={setStatus} /></div><section className="panel table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead><tbody>{rows.map((o) => <tr key={o.id}><td><strong>#{o.id}</strong></td><td>{o.customer}</td><td>{fmtDate(o.date)}</td><td>{o.items}</td><td><strong>{money(o.total)}</strong></td><td>{o.payment}</td><td><select className={"status-select " + (statusTone[o.status] || "")} aria-label={"Status for order " + o.id} value={o.status} onChange={(e) => {
    patch("orders", o.id, { status: e.target.value });
    log("Order #" + o.id + " set to " + e.target.value, "order");
    setToast("Order #" + o.id + " updated");
  }}>{["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => <option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table>{!rows.length && <Empty />}</section></>;
}
function Projects(ctx) {
  const { data, match, pageHead, setModal } = ctx;
  const [status, setStatus] = useState("All");
  const rows = data.projects.filter(match).filter((p) => status === "All" || p.status === status);
  return <>{pageHead("Follow progress, deadlines, and owners across projects.", <Button kind="primary" icon="plus" onClick={() => setModal({ type: "project" })}>New project</Button>)}<div className="filter-bar"><Segmented label="Project status" options={["All", "On track", "At risk", "Completed"]} value={status} onChange={setStatus} /><span>{data.projects.filter((p) => p.status === "Completed").length} of {data.projects.length} completed</span></div><div className="card-grid">{rows.map((p, i) => <article className="panel project-card" key={p.id}><div className="project-top"><span className={"company-icon tone-" + i % 4}>{p.name[0]}</span><Badge tone={statusTone[p.status]}>{p.status}</Badge><Menu label={"Actions for " + p.name} items={[["Edit project", "edit", () => setModal({ type: "project", record: p })], ["Delete", "trash", () => ctx.remove("projects", p, "project"), true]]} /></div><h3><button className="text-btn" onClick={() => setModal({ type: "project", record: p })}>{p.name}</button></h3><p>{p.client}</p><div className="progress-label"><span>Progress</span><b>{p.progress}%</b></div><div className="progress"><span style={{ width: p.progress + "%" }} /></div><div className="project-foot"><span><Icon name="calendar" size={13} /> {fmtDate(p.due)}</span><span className="avatar-stack">{p.members.map((m, n) => <Avatar key={m} text={m} tone={n % 4} small />)}</span></div></article>)}</div>{!rows.length && <Empty />}</>;
}
const parseSize = (s) => {
  const [n, u] = String(s).split(" ");
  return Number(n) * ({ KB: 1e3, MB: 1e6, GB: 1e9 }[u] || 1);
};
const fmtSize = (b) => b >= 1e6 ? (b / 1e6).toFixed(1) + " MB" : b >= 1e3 ? Math.round(b / 1e3) + " KB" : b + " B";
const fileType = (name) => {
  const ext = name.split(".").pop().toLowerCase();
  return ext === "pdf" ? "PDF" : ["xls", "xlsx", "csv"].includes(ext) ? "Sheet" : ["zip", "rar", "7z"].includes(ext) ? "Archive" : ["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext) ? "Image" : "Document";
};
function Files(ctx) {
  const { data, match, pageHead, update, setToast, log } = ctx;
  const [folder, setFolder] = useState("All files");
  const input = useRef();
  const folders = [...new Set(data.files.map((f) => f.folder))];
  const rows = data.files.filter(match).filter((f) => folder === "All files" || f.folder === folder);
  const used = data.files.reduce((a, f) => a + parseSize(f.size), 0);
  return <>{pageHead("Demo file manager. Only file names and sizes are stored, never the file contents.", <><input ref={input} type="file" multiple hidden onChange={(e) => {
    const added = [...e.target.files].map((f, i) => ({ id: Date.now() + i, name: f.name, type: fileType(f.name), size: fmtSize(f.size), owner: initials(data.settings.name), date: today(), folder: "Uploads" }));
    if (!added.length) return;
    update("files", [...added, ...data.files]);
    log("Uploaded " + added.length + " file" + (added.length > 1 ? "s" : ""), "file");
    setToast(added.length + " file record" + (added.length > 1 ? "s" : "") + " added");
    e.target.value = "";
  }} /><Button kind="primary" icon="upload" onClick={() => input.current.click()}>Upload files</Button></>)}<div className="folder-grid"><button className={"panel folder-card " + (folder === "All files" ? "selected" : "")} onClick={() => setFolder("All files")}><Icon name="layers" size={22} /><b>All files</b><small>{data.files.length} files</small></button>{folders.map((f) => <button key={f} className={"panel folder-card " + (folder === f ? "selected" : "")} onClick={() => setFolder(f)}><Icon name="folder" size={22} /><b>{f}</b><small>{data.files.filter((x) => x.folder === f).length} files</small></button>)}</div><div className="grid-2 files-layout"><section className="panel table-wrap"><div className="panel-head"><div><h3>{folder}</h3><p>{rows.length} items</p></div></div><table><thead><tr><th>Name</th><th>Size</th><th>Owner</th><th>Modified</th><th></th></tr></thead><tbody>{rows.map((f) => <tr key={f.id}><td><div className="cell-main"><span className="file-icon">{f.type.slice(0, 3).toUpperCase()}</span><span><b>{f.name}</b><small>{f.folder}</small></span></div></td><td>{f.size}</td><td><Avatar text={f.owner} small /></td><td>{fmtDate(f.date)}</td><td><button className="icon-btn" aria-label={"Delete " + f.name} onClick={() => confirmRemove(ctx, "files", f, "file")}><Icon name="trash" size={15} /></button></td></tr>)}</tbody></table>{!rows.length && <Empty text="This folder is empty" />}</section><section className="panel"><h3>Storage</h3><p>{fmtSize(used)} of 2 GB used</p><div className="progress big"><span style={{ width: Math.max(used / 2e9 * 100, 1.5) + "%" }} /></div>{["PDF", "Sheet", "Document", "Archive", "Image"].map((t) => {
    const n = data.files.filter((f) => f.type === t);
    return n.length ? <div className="storage-row" key={t}><span className="file-icon">{t.slice(0, 3).toUpperCase()}</span><span>{t}<small>{n.length} files</small></span><b>{fmtSize(n.reduce((a, f) => a + parseSize(f.size), 0))}</b></div> : null;
  })}</section></div></>;
}
const permissions = [["View records", [1, 1, 1, 1, 1]], ["Create & edit records", [1, 1, 1, 1, 0]], ["Delete records", [1, 1, 0, 0, 0]], ["Manage invoices & billing", [1, 1, 0, 0, 0]], ["Invite team members", [1, 1, 0, 0, 0]], ["Workspace settings", [1, 0, 0, 0, 0]]];
const roles = ["Admin", "Manager", "Sales", "Support", "Viewer"];
function Team(ctx) {
  const { data, match, pageHead, setModal, patch, setToast, exportCSV } = ctx;
  const rows = data.team.filter(match);
  return <>{pageHead("Invite teammates and decide what each role can do.", <><Button icon="download" onClick={() => exportCSV(rows, "team")}>Export</Button><Button kind="primary" icon="plus" onClick={() => setModal({ type: "member" })}>Invite member</Button></>)}<section className="panel table-wrap"><table><thead><tr><th>Member</th><th>Role</th><th>Status</th><th>Joined</th><th>Action</th></tr></thead><tbody>{rows.map((m, i) => <tr key={m.id}><td><div className="cell-main"><Avatar text={initials(m.name)} tone={i % 4} small /><span><b>{m.name}</b><small>{m.email}</small></span></div></td><td><select className="status-select" aria-label={"Role for " + m.name} value={m.role} onChange={(e) => {
    patch("team", m.id, { role: e.target.value });
    setToast(m.name + " is now " + e.target.value);
  }}>{roles.map((r) => <option key={r}>{r}</option>)}</select></td><td><Badge tone={statusTone[m.status]}>{m.status}</Badge></td><td>{fmtDate(m.joined)}</td><td><Button onClick={() => setModal({ type: "member", record: m })}>Edit</Button></td></tr>)}</tbody></table>{!rows.length && <Empty />}</section><section className="panel table-wrap"><div className="panel-head"><div><h3>Roles & permissions</h3><p>Reference matrix for this demo. Enforce permissions on your server.</p></div></div><table className="matrix"><thead><tr><th>Permission</th>{roles.map((r) => <th key={r}>{r}</th>)}</tr></thead><tbody>{permissions.map(([p, v]) => <tr key={p}><td>{p}</td>{v.map((x, n) => <td key={n}>{x ? <span className="tick" aria-label="Allowed">✓</span> : <span className="cross" aria-label="Not allowed">–</span>}</td>)}</tr>)}</tbody></table></section></>;
}
const kindIcon = { deal: "briefcase", invoice: "file", team: "people", order: "cart", file: "folder", record: "edit", task: "check" };
function Activity(ctx) {
  const { data, match, pageHead, setModal, update, setToast } = ctx;
  const [kind, setKind] = useState("All");
  const rows = data.activity.filter(match).filter((a) => kind === "All" || a.kind === kind.toLowerCase());
  const days = [...new Set(rows.map((a) => a.time.slice(0, 10)))];
  return <>{pageHead("A timeline of actions taken in this demo workspace.", <Button kind="danger" icon="trash" onClick={() => setModal({ type: "confirm", confirmLabel: "Clear log", title: "Clear activity log?", description: "The timeline is emptied. Your records stay unchanged.", action: () => {
    update("activity", []);
    setToast("Activity log cleared");
  } })}>Clear log</Button>)}<div className="filter-bar"><Segmented label="Activity type" options={["All", "Deal", "Order", "Invoice", "Team", "File", "Record"]} value={kind} onChange={setKind} /><span>{rows.length} events</span></div><section className="panel">{days.map((d) => <div className="timeline-day" key={d}><span className="eyebrow">{new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}</span><ol className="timeline">{rows.filter((a) => a.time.startsWith(d)).map((a) => <li key={a.id}><span className="timeline-icon"><Icon name={kindIcon[a.kind] || "activity"} size={15} /></span><span><b>{a.text}</b><small>{a.time.slice(11)} · by {a.who}</small></span></li>)}</ol></div>)}{!rows.length && <Empty text="No activity yet" />}</section></>;
}
function Profile(ctx) {
  const { data, pageHead, go } = ctx;
  const s = data.settings, me = initials(s.name);
  const mine = data.deals.filter((d) => d.owner === "MT");
  return <>{pageHead("How you appear to your team.", <Button kind="primary" icon="edit" onClick={() => go("Settings")}>Edit profile</Button>)}<section className="panel profile-hero"><div className="profile-cover" /><div className="profile-main"><Avatar text={me} /><div><h2>{s.name}</h2><p>Admin · {s.workspace}</p></div><div className="actions"><Badge tone="success">Online</Badge><Badge>{s.plan || "Pro"} plan</Badge></div></div></section><div className="stats"><StatCard tone="lavender" icon="briefcase" value={mine.length} label="Deals owned" onClick={() => go("Deals")} /><StatCard tone="peach" icon="trophy" value={mine.filter((d) => d.stage === 4).length} label="Deals won" onClick={() => go("Deals")} /><StatCard tone="blue" icon="check" value={data.tasks.filter((t) => t.done).length + "/" + data.tasks.length} label="Tasks completed" onClick={() => go("Tasks")} /><StatCard tone="coral" icon="layers" value={data.projects.filter((p) => p.members.includes("MT")).length} label="Projects" onClick={() => go("Projects")} /></div><div className="grid-2"><section className="panel"><h3>About</h3><p>Leads sales operations and keeps the pipeline healthy. Loves clear dashboards and calm, focused workdays.</p><ul className="info-list"><li><Icon name="mail" size={16} /><span>Email</span><a href={"mailto:" + s.email}>{s.email}</a></li><li><Icon name="user" size={16} /><span>Role</span><b>Admin</b></li><li><Icon name="grid" size={16} /><span>Workspace</span><b>{s.workspace}</b></li><li><Icon name="calendar" size={16} /><span>Member since</span><b>{new Date((data.team[0]?.joined || "2024-03-12") + "T12:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" })}</b></li></ul></section><section className="panel"><div className="panel-head"><div><h3>Recent activity</h3><p>Your latest actions</p></div><Button kind="subtle" onClick={() => go("Activity")}>View all →</Button></div><ol className="timeline">{data.activity.slice(0, 5).map((a) => <li key={a.id}><span className="timeline-icon"><Icon name={kindIcon[a.kind] || "activity"} size={15} /></span><span><b>{a.text}</b><small>{a.time}</small></span></li>)}</ol>{!data.activity.length && <Empty text="No activity yet" />}</section></div></>;
}
function Billing(ctx) {
  const { data, pageHead, update, setModal, setToast, log } = ctx;
  const current = data.settings.plan || "Pro";
  const plan = plans.find((p) => p.name === current) || plans[1];
  const usage = [["Deals", data.deals.length, current === "Starter" ? 50 : 500], ["Team seats", data.team.length, current === "Business" ? 50 : 10], ["Projects", data.projects.length, 25]];
  return <>{pageHead("Demo billing screen. No payment is processed.")}<div className="grid-2"><section className="panel"><div className="panel-head"><div><span className="eyebrow">CURRENT PLAN</span><h2>{plan.name}</h2><p>{plan.price ? money(plan.price) + " per month · renews Dec 1, 2026" : "Free forever"}</p></div><Badge tone="success">Active</Badge></div>{usage.map(([label, n, max]) => <div className="usage-row" key={label}><div><span>{label}</span><b>{n} / {max}</b></div><div className="progress"><span style={{ width: Math.min(n / max * 100, 100) + "%" }} /></div></div>)}</section><section className="panel"><h3>Payment method</h3><p>Shown for layout only. Card details are never stored by this template.</p><div className="pay-card"><span>Mellow Card</span><b>•••• •••• •••• 0000</b><small>Expires 12/28 · {data.settings.name}</small></div><Button onClick={() => setToast("Connect a payment provider to update payment methods", { tone: "info" })}>Update payment method</Button></section></div><div className="plan-grid">{plans.map((p) => <article className={"panel plan-card " + (p.name === current ? "current" : "")} key={p.name}><h3>{p.name}</h3><p>{p.note}</p><div className="plan-price"><strong>{p.price ? "$" + p.price : "Free"}</strong>{p.price ? <small>/month</small> : null}</div><ul>{p.features.map((f) => <li key={f}><Icon name="check" size={15} />{f}</li>)}</ul>{p.name === current ? <Button disabled>Current plan</Button> : <Button kind="primary" onClick={() => setModal({ type: "confirm", confirmLabel: "Switch to " + p.name, danger: false, title: "Switch to " + p.name + "?", description: "This demo only changes the plan label. No payment is made.", action: () => {
    update("settings", { ...data.settings, plan: p.name });
    log("Plan changed to " + p.name, "invoice");
    setToast("Plan switched to " + p.name);
  } })}>Choose {p.name}</Button>}</article>)}</div><section className="panel table-wrap"><div className="panel-head"><div><h3>Billing history</h3><p>Sample receipts</p></div></div><table><thead><tr><th>Receipt</th><th>Date</th><th>Plan</th><th>Amount</th><th>Status</th></tr></thead><tbody>{receipts.map((r) => <tr key={r.id}><td><strong>{r.id}</strong></td><td>{fmtDate(r.date)}</td><td>{r.plan}</td><td>{money(r.amount)}</td><td><Badge tone="success">{r.status}</Badge></td></tr>)}</tbody></table></section></>;
}
function Help(ctx) {
  const { pageHead, query, go, setToast } = ctx;
  const q = query.toLowerCase();
  const items = faq.filter(([a, b]) => (a + b).toLowerCase().includes(q));
  return <>{pageHead("Answers to common questions, plus a way to reach support.")}<div className="card-grid three">{[["grid", "Components", "Browse the UI kit", "Components"], ["settings", "Settings", "Theme, accent, and profile", "Settings"], ["layers", "Pages", "Sign in, errors, and more", "Pages"]].map(([icon, title, sub, to]) => <button className="panel quick-link" key={title} onClick={() => go(to)}><span className="stat-icon"><Icon name={icon} size={22} /></span><span><b>{title}</b><small>{sub}</small></span></button>)}</div><div className="grid-2"><section className="panel"><h3>Frequently asked questions</h3><p>{items.length} of {faq.length} answers{q ? " match your search" : ""}</p><div className="faq">{items.map(([a, b], i) => <details key={a} open={i === 0}><summary>{a}</summary><p>{b}</p></details>)}</div>{!items.length && <Empty text="No matching answers" />}</section><form className="panel" onSubmit={(e) => {
    e.preventDefault();
    e.currentTarget.reset();
    setToast("Demo only: connect a helpdesk to send messages", { tone: "info" });
  }}><h3>Contact support</h3><p>This form does not send anything. Wire it to your helpdesk.</p><label className="field"><span>Subject</span><input required maxLength="100" placeholder="What do you need help with?" /></label><label className="field"><span>Topic</span><select defaultValue="General"><option>General</option><option>Billing</option><option>Technical issue</option><option>Feature request</option></select></label><label className="field"><span>Message</span><textarea required rows="4" placeholder="Tell us a little more…" /></label><Button kind="primary" type="submit" icon="message">Send message</Button></form></div></>;
}
const screens = [["Sign in", "lock", "Login form with remember me and social-style options"], ["Sign up", "user", "Registration form with terms checkbox"], ["Forgot password", "mail", "Request a password reset link"], ["Lock screen", "lock", "Re-enter password after inactivity"], ["Error 404", "search", "Page not found"], ["Error 500", "alert", "Server error"], ["Maintenance", "settings", "Scheduled downtime notice"]];
function Pages(ctx) {
  const { pageHead, go } = ctx;
  return <>{pageHead("Full-page layouts for authentication, errors, and maintenance. They open outside the dashboard shell.")}<div className="card-grid three">{screens.map(([name, icon, sub]) => <article className="panel screen-card" key={name}><div className="screen-thumb"><span className="stat-icon"><Icon name={icon} size={24} /></span></div><h3>{name}</h3><p>{sub}</p><Button onClick={() => go(name)}>Open page <Icon name="arrow" size={13} /></Button></article>)}</div></>;
}
function Screen({ name, settings, go, setToast }) {
  const [sent, setSent] = useState(false);
  const enter = (msg) => (e) => {
    e.preventDefault();
    go("Dashboard");
    setToast(msg, { tone: "info" });
  };
  const brand = <a href="#dashboard" className="brand auth-brand" onClick={() => go("Dashboard")}><span className="brand-mark">m</span> mellow<span className="brand-dot">.</span></a>;
  const note = <p className="auth-note">Demo screen. No credentials are checked or stored.</p>;
  const errors = { "Error 404": ["404", "This page wandered off.", "The page you are looking for doesn’t exist or has been moved."], "Error 500": ["500", "Something went wrong on our side.", "We’re looking into it. Please try again in a few minutes."], Maintenance: ["", "We’re making things better.", "Mellow is getting a little upgrade. We’ll be back shortly."] };
  let body;
  if (name === "Sign in") body = <form onSubmit={enter("Demo sign-in: no credentials were checked")}><h2>Welcome back</h2><p>Sign in to continue to your workspace.</p><label className="field"><span>Email address</span><input type="email" required autoComplete="username" placeholder="you@example.com" /></label><label className="field"><span>Password</span><input type="password" required autoComplete="current-password" placeholder="••••••••" /></label><div className="auth-row"><label className="check"><input type="checkbox" /> Remember me</label><button type="button" className="text-btn link" onClick={() => go("Forgot password")}>Forgot password?</button></div><Button kind="primary" type="submit">Sign in</Button><p className="auth-switch">New here? <button type="button" className="text-btn link" onClick={() => go("Sign up")}>Create an account</button></p>{note}</form>;
  else if (name === "Sign up") body = <form onSubmit={enter("Demo sign-up: no account was created")}><h2>Create your account</h2><p>Start organizing your pipeline in minutes.</p><label className="field"><span>Full name</span><input required maxLength="60" autoComplete="name" placeholder="Your name" /></label><label className="field"><span>Email address</span><input type="email" required autoComplete="email" placeholder="you@example.com" /></label><label className="field"><span>Password</span><input type="password" required minLength="8" autoComplete="new-password" placeholder="At least 8 characters" /></label><label className="check"><input type="checkbox" required /> I agree to the terms and privacy policy</label><Button kind="primary" type="submit">Create account</Button><p className="auth-switch">Already have an account? <button type="button" className="text-btn link" onClick={() => go("Sign in")}>Sign in</button></p>{note}</form>;
  else if (name === "Forgot password") body = sent ? <div><span className="stat-icon auth-icon"><Icon name="mail" size={24} /></span><h2>Check your inbox</h2><p>If an account exists for that address, a reset link is on its way. (Demo: nothing was sent.)</p><Button kind="primary" onClick={() => go("Sign in")}>Back to sign in</Button></div> : <form onSubmit={(e) => {
    e.preventDefault();
    setSent(true);
  }}><h2>Forgot your password?</h2><p>Enter your email and we’ll send you a reset link.</p><label className="field"><span>Email address</span><input type="email" required autoComplete="email" placeholder="you@example.com" /></label><Button kind="primary" type="submit">Send reset link</Button><p className="auth-switch"><button type="button" className="text-btn link" onClick={() => go("Sign in")}>← Back to sign in</button></p></form>;
  else if (name === "Lock screen") body = <form className="center" onSubmit={enter("Demo unlock: no password was checked")}><Avatar text={initials(settings.name)} /><h2>{settings.name}</h2><p>Your session is locked. Enter your password to continue.</p><label className="field"><span>Password</span><input type="password" required autoComplete="current-password" placeholder="••••••••" /></label><Button kind="primary" type="submit" icon="lock">Unlock</Button><p className="auth-switch">Not you? <button type="button" className="text-btn link" onClick={() => go("Sign in")}>Sign in as someone else</button></p></form>;
  else {
    const [code, title, sub] = errors[name] || errors["Error 404"];
    body = <div className="center">{code ? <strong className="error-code">{code}</strong> : <span className="stat-icon auth-icon"><Icon name="settings" size={26} /></span>}<h2>{title}</h2><p>{sub}</p>{name === "Maintenance" && <div className="progress big"><span style={{ width: "68%" }} /></div>}<div className="actions center-actions"><Button kind="primary" onClick={() => go("Dashboard")}>Back to dashboard</Button><Button onClick={() => go("Help")}>Visit help center</Button></div></div>;
  }
  return <div className="auth-shell"><section className="auth-card">{brand}{body}</section><p className="auth-foot">© 2026 {settings.workspace} · <button className="text-btn link" onClick={() => go("Pages")}>All pages</button></p></div>;
}
export {
  Activity,
  Billing,
  Files,
  Help,
  Orders,
  Pages,
  Products,
  Profile,
  Projects,
  Screen,
  Team,
  screens
};
