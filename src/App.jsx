import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { seed, stages, chances, money, short, initials, fmtDate } from "./data";
import { Icon, Button, Avatar, Badge, Empty, StatCard, Menu, Modal, Field, RevenueChart } from "./components";
import { Products, Orders, Projects, Files, Team, Activity, Profile, Billing, Help, Pages, Screen, screens } from "./pages";
import "./styles.css";
const nav = [["Dashboard", "home", "Overview"], ["Reports", "chart", "Overview"], ["Activity", "activity", "Overview"], ["Contacts", "contact", "CRM"], ["Deals", "briefcase", "CRM"], ["Inbox", "message", "CRM"], ["Calendar", "calendar", "CRM"], ["Tasks", "check", "CRM"], ["Products", "box", "Commerce"], ["Orders", "cart", "Commerce"], ["Invoices", "file", "Commerce"], ["Projects", "layers", "Workspace"], ["Files", "folder", "Workspace"], ["Team", "people", "Workspace"], ["Profile", "user", "Account"], ["Billing", "card", "Account"], ["Settings", "settings", "Account"], ["Help", "help", "Account"], ["Components", "grid", "UI kit"], ["Pages", "lock", "UI kit"]];
const slug = (n) => n.toLowerCase().replace(/\s+/g, "-");
const routes = [...nav.map(([n]) => n), ...screens.map(([n]) => n)];
const resolve = (hash) => routes.find((n) => slug(n) === hash) || (hash ? "Error 404" : "Dashboard");
const groups = [...new Set(nav.map((n) => n[2]))].map((s) => [s, nav.filter((n) => n[2] === s)]);
const creates = { Dashboard: "deal", Deals: "deal", Reports: "deal", Contacts: "contact", Tasks: "task", Calendar: "event", Products: "product", Projects: "project", Team: "member" };
function useMedia(query) {
  const [hit, setHit] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const list = matchMedia(query), fn = () => setHit(list.matches);
    list.addEventListener("change", fn);
    return () => list.removeEventListener("change", fn);
  }, [query]);
  return hit;
}
const isScreen = (p) => screens.some(([n]) => n === p);
const KEY = "mellow-admin-v1";
const recordKeys = { deal: "deals", contact: "contacts", task: "tasks", event: "events", product: "products", member: "team", project: "projects" };
const clone = () => JSON.parse(JSON.stringify(seed));
function App() {
  const [data, setData] = useState(() => {
    try {
      const d = JSON.parse(localStorage.getItem(KEY));
      return d && d.schema === 1 ? { ...clone(), ...d, settings: { ...seed.settings, ...d.settings } } : clone();
    } catch {
      return clone();
    }
  });
  const [page, setPage] = useState(() => resolve(location.hash.slice(1)));
  const [query, setQuery] = useState(""), [mine, setMine] = useState(false), [modal, setModal] = useState(null), [note, setNote] = useState(null), [menu, setMenu] = useState(false), [notifications, setNotifications] = useState(false), [activeMessage, setActiveMessage] = useState(1), [reply, setReply] = useState(""), [month, setMonth] = useState(new Date(2026, 10, 1)), [period, setPeriod] = useState("6 months"), [taskFilter, setTaskFilter] = useState("All"), [invoiceFilter, setInvoiceFilter] = useState("All"), [celebrate, setCelebrate] = useState(false);
  const search = useRef(), bell = useRef(), bellWrap = useRef();
  const setToast = (text, opts) => setNote(text ? { text, tone: "success", ...opts, id: Date.now() } : null);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...data, schema: 1 }));
    } catch {
      setToast("Browser storage is unavailable. Changes last for this session.", { tone: "error" });
    }
  }, [data]);
  useEffect(() => {
    if (note) {
      const timer = setTimeout(() => setNote(null), note.undo ? 7e3 : 4500);
      return () => clearTimeout(timer);
    }
  }, [note]);
  useEffect(() => {
    const fn = (e) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey || !search.current || document.querySelector("dialog[open]") || e.target.closest?.("input, textarea, select, [contenteditable]")) return;
      e.preventDefault();
      search.current.focus();
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);
  useEffect(() => {
    if (!notifications) return;
    const down = (e) => {
      if (!bellWrap.current?.contains(e.target)) setNotifications(false);
    };
    const key = (e) => {
      if (e.key !== "Escape") return;
      setNotifications(false);
      bell.current?.focus();
    };
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("keydown", key);
    };
  }, [notifications]);
  useEffect(() => {
    const fn = () => {
      setPage(resolve(location.hash.slice(1)));
      setQuery("");
    };
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);
  const rail = useMedia("(min-width: 761px) and (max-width: 1000px)");
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const section = nav.find((n) => n[0] === page)?.[2];
    if (section && (data.settings.navCollapsed || []).includes(section)) toggleGroup(section);
  }, [page]);
  useEffect(() => {
    document.documentElement.dataset.theme = data.settings.dark ? "dark" : "light";
    document.documentElement.dataset.accent = data.settings.accent;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", getComputedStyle(document.documentElement).getPropertyValue("--sidebar-a").trim());
    document.title = page + " | Mellow Admin";
  }, [page, data.settings]);
  function go(p) {
    if (p !== "Deals") setMine(false);
    setPage(p);
    location.hash = slug(p);
    setQuery("");
    setMenu(false);
    setNotifications(false);
  }
  function toggleGroup(section) {
    setData((d) => {
      const list = d.settings.navCollapsed || [];
      return { ...d, settings: { ...d.settings, navCollapsed: list.includes(section) ? list.filter((x) => x !== section) : [...list, section] } };
    });
  }
  function update(key, list) {
    setData((d) => ({ ...d, [key]: list }));
  }
  function log(text, kind = "record") {
    const n = /* @__PURE__ */ new Date(), pad = (x) => String(x).padStart(2, "0");
    const time = n.getFullYear() + "-" + pad(n.getMonth() + 1) + "-" + pad(n.getDate()) + " " + pad(n.getHours()) + ":" + pad(n.getMinutes());
    setData((d) => ({ ...d, activity: [{ id: Date.now() + Math.random(), text, who: initials(d.settings.name), time, kind }, ...d.activity].slice(0, 60) }));
  }
  function patch(key, id, values) {
    setData((d) => ({ ...d, [key]: d[key].map((x) => x.id === id ? { ...x, ...values } : x) }));
  }
  function move(id, stage) {
    const old = data.deals.find((d) => d.id === id);
    patch("deals", id, { stage });
    if (stage === 4 && old.stage !== 4) {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 2200);
      setToast("Deal won! A little celebration is in order.");
    } else setToast("Deal moved to " + stages[stage]);
    log(old.title + " moved to " + stages[stage], "deal");
  }
  function saveRecord(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    const type = modal.type;
    const key = recordKeys[type];
    const row = { ...modal.record, ...f, id: modal.record?.id || Date.now() };
    if (type === "product") {
      row.price = Number(row.price);
      row.stock = Number(row.stock);
    }
    if (type === "project") {
      row.progress = Number(row.progress);
      row.members = modal.record?.members || [initials(data.settings.name)];
    }
    if (type === "member") row.joined = modal.record?.joined || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    if (type === "deal") {
      row.value = Number(row.value);
      row.stage = Number(row.stage);
    }
    if (type === "task") row.done = modal.record?.done || false;
    update(key, modal.record ? data[key].map((r) => r.id === row.id ? row : r) : [...data[key], row]);
    setModal(null);
    setToast(modal.record ? "Changes saved" : "New " + type + " added");
    log((modal.record ? "Updated " : "Added ") + type + " " + (row.title || row.name), type === "member" ? "team" : type === "deal" ? "deal" : "record");
  }
  function remove(key, row, label) {
    const index = data[key].findIndex((x) => x.id === row.id), name = row.title || row.name || "#" + row.id;
    update(key, data[key].filter((x) => x.id !== row.id));
    log("Deleted " + label + " " + name, "record");
    setToast(label[0].toUpperCase() + label.slice(1) + " deleted", { undo: () => {
      setData((d) => d[key].some((x) => x.id === row.id) ? d : { ...d, [key]: [...d[key].slice(0, index), row, ...d[key].slice(index)] });
      log("Restored " + label + " " + name, "record");
    } });
  }
  function removeRecord() {
    remove(recordKeys[modal.type], modal.record, modal.type);
    setModal(null);
  }
  function exportCSV(rows, name) {
    if (!rows.length) {
      setToast("There are no records to export", { tone: "info" });
      return;
    }
    const keys = Object.keys(rows[0]);
    const cell = (v) => '"' + String(v ?? "").replace(/^[=+@\-]/, "'$&").replaceAll('"', '""') + '"';
    const text = "\uFEFF" + [keys.map(cell).join(","), ...rows.map((r) => keys.map((k) => cell(r[k])).join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name + ".csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
    setToast("CSV exported");
  }
  const q = query.trim().toLowerCase();
  const match = (r, extra) => !q || [...Object.values(r).filter((v) => typeof v === "string").map((v) => /^\d{4}-\d{2}-\d{2}$/.test(v) ? fmtDate(v) : v), typeof extra === "string" ? extra : ""].some((v) => v.toLowerCase().includes(q));
  const deals = data.deals.filter((d) => match(d) && (!mine || d.owner === "MT"));
  const open = deals.filter((d) => d.stage !== 4), won = deals.filter((d) => d.stage === 4);
  const sum = (xs) => xs.reduce((a, d) => a + d.value, 0);
  const unread = data.messages.filter((m) => m.unread).length;
  const stats = <div className="stats"><StatCard tone="s1" icon="briefcase" value={short(sum(open))} label="Open pipeline" note={open.length + " open deal" + (open.length === 1 ? "" : "s")} onClick={() => go("Deals")} /><StatCard tone="s2" icon="target" value={short(open.reduce((a, d) => a + d.value * chances[d.stage] / 100, 0))} label="Weighted forecast" note="By stage probability" onClick={() => go("Reports")} /><StatCard tone="s3" icon="trophy" value={short(sum(won))} label="Won deals" note={won.length + " closed"} onClick={() => go("Reports")} /><StatCard tone="s4" icon="chart" value={short(deals.length ? sum(deals) / deals.length : 0)} label="Average deal size" note={"Across " + deals.length + " deal" + (deals.length === 1 ? "" : "s")} onClick={() => go("Reports")} /></div>;
  const newBtn = (type, label) => <Button kind="primary" icon="plus" onClick={() => setModal({ type })}>{label}</Button>;
  const pageHead = (sub, actions) => <div className="page-head"><p>{sub}</p>{actions && <div className="actions">{actions}</div>}</div>;
  const board = <div className="board">{stages.map((s, i) => {
    const list = deals.filter((d) => d.stage === i);
    return <section className={"column stage-" + i} key={s} aria-label={s + " deals"} onDragOver={(e) => {
      e.preventDefault();
      e.currentTarget.classList.add("drag-over");
    }} onDragLeave={(e) => e.currentTarget.classList.remove("drag-over")} onDrop={(e) => {
      e.preventDefault();
      e.currentTarget.classList.remove("drag-over");
      const id = Number(e.dataTransfer.getData("text/plain"));
      if (data.deals.some((d) => d.id === id)) move(id, i);
    }}><div className="column-head"><span className="dot" /><h3>{s}</h3><span className="count">{list.length}</span><small>{short(sum(list))}</small></div><div className="column-cards">{list.map((d) => <article className={"deal-card " + (i === 4 ? "won" : "")} draggable key={d.id} onDragStart={(e) => e.dataTransfer.setData("text/plain", String(d.id))}><div className="deal-title"><button className="text-btn" onClick={() => setModal({ type: "deal", record: d })}>{d.title}</button><Menu label={"Actions for " + d.title} items={[["Edit deal", "edit", () => setModal({ type: "deal", record: d })], i < 4 && ["Move to " + stages[i + 1], "arrow", () => move(d.id, i + 1)], ["Delete", "trash", () => remove("deals", d, "deal"), true]]} /></div><div className="company"><span className={"company-icon tone-" + d.id % 4}>{d.company[0]}</span><span>{d.company}</span></div><div className="deal-value"><strong>{short(d.value)}</strong><Badge tone={d.priority.toLowerCase()}>{d.priority}</Badge></div><div className="progress" aria-label={chances[i] + " percent probability"}><span style={{ width: chances[i] + "%" }} /></div><div className="deal-footer"><span><Icon name="calendar" size={12} />{i === 4 ? "Closed" : fmtDate(d.date)}</span><b>{chances[i]}%</b><Avatar text={d.owner} tone={d.owner === "MT" ? 0 : d.owner === "AB" ? 3 : 2} small /></div><label className="stage-control"><span>Move to</span><select aria-label={"Stage for " + d.title} value={d.stage} onChange={(e) => move(d.id, Number(e.target.value))}>{stages.map((v, n) => <option value={n} key={v}>{v}</option>)}</select></label></article>)}</div><button className="add-card" onClick={() => setModal({ type: "deal", defaultStage: i })}><Icon name="plus" size={15} /> Add deal</button></section>;
  })}</div>;
  const recordModal = modal && modal.type in recordKeys;
  const ctx = { data, update, patch, setModal, setToast, go, match, pageHead, exportCSV, query, log, remove };
  const toastEl = <div className="toast-region" aria-live="polite" aria-atomic="true">{note && <div className={"toast " + note.tone} key={note.id}><Icon name={note.tone === "error" ? "alert" : note.tone === "info" ? "info" : "check"} size={19} /><span>{note.text}</span>{note.undo && <button className="toast-action" onClick={() => {
    note.undo();
    setNote(null);
  }}>Undo</button>}<button aria-label="Dismiss notification" onClick={() => setNote(null)}><Icon name="close" size={15} /></button></div>}</div>;
  if (isScreen(page)) return <>{<Screen key={page} name={page} settings={data.settings} go={go} setToast={setToast} />}{toastEl}</>;
  const selected = data.messages.find((m) => m.id === activeMessage);
  const now = new Date(), todayKey = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
  const monthKey = month.getFullYear() + "-" + String(month.getMonth() + 1).padStart(2, "0");
  const agenda = data.events.filter((ev) => ev.date.startsWith(monthKey) && match(ev)).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  return <div className={"shell " + (data.settings.compact ? "compact" : "")}>
 {menu && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMenu(false)} />}
 <aside className={"sidebar " + (menu ? "open" : "")}><a href="#dashboard" className="brand" onClick={() => go("Dashboard")}><span className="brand-mark">m</span> mellow<span className="brand-dot">.</span></a><div className="profile"><div className="profile-ring"><Avatar text={initials(data.settings.name)} /><i /></div><div><strong>Hi, {data.settings.name.split(" ")[0]}! <span aria-hidden="true">✋</span></strong><p>Let’s make things happen.</p></div></div><nav aria-label="Main navigation">{groups.map(([section, items]) => {
    const closed = (data.settings.navCollapsed || []).includes(section);
    return <div className={"nav-group " + (closed ? "collapsed" : "")} key={section}><button className="nav-section" aria-expanded={!closed} onClick={() => toggleGroup(section)}>{section}<Icon name="chevron" size={14} /></button><div className="nav-items">{items.map(([label, icon]) => {
      const count = label === "Inbox" ? unread : label === "Tasks" ? data.tasks.filter((t) => !t.done).length : label === "Orders" ? data.orders.filter((o) => o.status === "Pending").length : 0;
      return <button key={label} className={"nav-item " + (page === label ? "active" : "")} aria-current={page === label ? "page" : void 0} aria-label={count ? label + ", " + count + " " + (label === "Inbox" ? "unread" : label === "Tasks" ? "open" : "pending") : label} title={rail ? label : void 0} onClick={() => go(label)}><Icon name={icon} /><span>{label}</span>{count > 0 && <b aria-hidden="true">{count}</b>}</button>;
    })}</div></div>;
  })}</nav><div className="sidebar-bottom"><span className="status-dot" /> {data.settings.workspace}<small>CLAY & GLASS EDITION • V1.1</small></div></aside>
 <main><header className="topbar"><div className="top-title"><button className="icon-btn menu-toggle" aria-label="Open navigation" onClick={() => setMenu(!menu)}><Icon name="menu" /></button><h1>{page}</h1></div>{["Settings", "Components", "Profile", "Billing", "Pages"].includes(page) ? <div className="workspace-label">{data.settings.workspace}</div> : <label className="search"><Icon name="search" size={18} /><input ref={search} placeholder={"Filter " + page.toLowerCase() + "\u2026"} aria-label={"Filter " + page.toLowerCase()} aria-keyshortcuts="/" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Escape" && setQuery("")} />{query ? <button aria-label="Clear filter" onClick={() => setQuery("")}><Icon name="close" size={14} /></button> : <kbd title="Press / to filter">/</kbd>}</label>}<div className="top-actions"><div className="notification-wrap" ref={bellWrap}><button ref={bell} className="round-btn" aria-label={unread ? "Notifications, " + unread + " unread" : "Notifications"} aria-expanded={notifications} onClick={() => setNotifications(!notifications)}><Icon name="bell" />{unread > 0 && <b>{unread}</b>}</button>{notifications && <div className="notifications"><h3>Your notifications</h3>{data.messages.filter((m) => m.unread).map((m) => <button key={m.id} onClick={() => {
    setActiveMessage(m.id);
    patch("messages", m.id, { unread: false });
    go("Inbox");
  }}><strong>{m.name}</strong><span>{m.subject}</span></button>)}{!unread && <p>You’re all caught up.</p>}<button onClick={() => {
    update("messages", data.messages.map((m) => ({ ...m, unread: false })));
    setToast("All notifications marked as read");
  }}>Mark all as read</button></div>}</div><button className="round-btn profile-btn" aria-label="Your profile" onClick={() => go("Profile")}>{initials(data.settings.name)}</button></div></header>
 <div className="content">
 {page === "Deals" && <>{pageHead("Track every opportunity from first contact to won.", <><div className="segmented" role="group" aria-label="Deal owner"><button className={!mine ? "selected" : ""} aria-pressed={!mine} onClick={() => setMine(false)}>All deals</button><button className={mine ? "selected" : ""} aria-pressed={mine} onClick={() => setMine(true)}>My deals</button></div>{newBtn("deal", "New deal")}</>)}{stats}<div className="board-caption"><span><span className="live-dot" /> {deals.length} deals in your pipeline</span><span>Drag cards between stages <span className="desktop-only">· Win a deal to celebrate</span></span></div>{board}</>}
 {page === "Dashboard" && <>{pageHead("Pipeline, revenue, and your next steps at a glance.", <Button icon="calendar" onClick={() => go("Calendar")}>November 2026</Button>)}{stats}<div className="grid-2"><section className="panel"><div className="panel-head"><div><h3>Revenue overview</h3><p>Sample historical revenue · USD</p></div><select aria-label="Revenue period" value={period} onChange={(e) => setPeriod(e.target.value)}><option>6 months</option><option>3 months</option></select></div><RevenueChart period={period} /></section><section className="panel"><div className="panel-head"><div><h3>Your next steps</h3><p>Small steps. Meaningful progress.</p></div><Badge>{data.tasks.filter((t) => !t.done).length} open</Badge></div>{data.tasks.filter(match).slice(0, 4).map((t) => <label className={"task-row " + (t.done ? "done" : "")} key={t.id}><input type="checkbox" checked={t.done} onChange={() => patch("tasks", t.id, { done: !t.done })} /><span>{t.title}<small>{fmtDate(t.date)}</small></span></label>)}<Button kind="subtle" onClick={() => go("Tasks")}>View all tasks →</Button></section></div><section className="panel"><div className="panel-head"><div><h3>Deals in motion</h3><p>Your most valuable open opportunities</p></div><Button kind="subtle" onClick={() => go("Deals")}>View pipeline →</Button></div><div className="table-wrap"><table><thead><tr><th>Opportunity</th><th>Company</th><th>Value</th><th>Stage</th><th>Owner</th></tr></thead><tbody>{[...deals].filter((d) => d.stage < 4).sort((a, b) => b.value - a.value).slice(0, 4).map((d) => <tr key={d.id}><td><button className="text-btn" onClick={() => setModal({ type: "deal", record: d })}>{d.title}</button></td><td>{d.company}</td><td>{money(d.value)}</td><td><Badge>{stages[d.stage]}</Badge></td><td><Avatar text={d.owner} small /></td></tr>)}</tbody></table></div></section></>}
 {page === "Contacts" && <>{pageHead("Everyone you work with, with their company and role.", <><Button icon="download" onClick={() => exportCSV(data.contacts.filter(match), "contacts")}>Export</Button>{newBtn("contact", "Add contact")}</>)}<div className="contact-grid">{data.contacts.filter(match).map((c, i) => <article className="panel contact-card" key={c.id}><div className="contact-edit"><Menu label={"Actions for " + c.name} items={[["Edit contact", "edit", () => setModal({ type: "contact", record: c })], ["Send email", "mail", () => location.href = "mailto:" + c.email], ["Delete", "trash", () => remove("contacts", c, "contact"), true]]} /></div><Avatar text={initials(c.name)} tone={i % 4} /><h3>{c.name}</h3><p>{c.role}</p><Badge>{c.company}</Badge><a href={"mailto:" + c.email}>{c.email}</a><Button onClick={() => setModal({ type: "contact", record: c })}>View contact</Button></article>)}</div>{!data.contacts.filter(match).length && <Empty />}</>}
 {page === "Inbox" && <>{pageHead("Demo inbox. Replies are saved locally in this browser.", <Button onClick={() => {
    update("messages", data.messages.map((m) => ({ ...m, unread: false })));
    setToast("All messages marked as read");
  }}>Mark all as read</Button>)}<div className="inbox panel"><div className="message-list">{data.messages.filter(match).map((m) => <button className={"message-preview " + (m.id === activeMessage ? "selected " : "") + (m.unread ? "unread" : "")} key={m.id} onClick={() => {
    setActiveMessage(m.id);
    patch("messages", m.id, { unread: false });
  }}><Avatar text={initials(m.name)} small /><span><strong>{m.name}{m.unread && <><i className="dot" aria-hidden="true" /><b className="sr-only">Unread</b></>}</strong><span>{m.subject}</span><small>{m.time}</small></span></button>)}{!data.messages.filter(match).length && <Empty />}</div>{selected && <section className="message-detail"><Badge>DEMO CONVERSATION</Badge><h2>{selected.subject}</h2><div className="sender"><Avatar text={initials(selected.name)} small /><b>{selected.name}</b><small>to {data.settings.name}</small></div><p>{selected.text}</p>{selected.replies.map((r, i) => <div className="reply-bubble" key={i}><b>You · saved reply</b><p>{r}</p></div>)}<form className="reply-form" onSubmit={(e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    patch("messages", selected.id, { replies: [...selected.replies, reply.trim()], unread: false });
    setReply("");
    setToast("Demo reply saved locally");
  }}><label className="field"><span>Your reply</span><textarea required rows="4" placeholder="Write a thoughtful reply…" value={reply} onChange={(e) => setReply(e.target.value)} /></label><Button kind="primary" type="submit" icon="message">Save demo reply</Button></form></section>}</div></>}
 {page === "Invoices" && <>{pageHead("Track sample invoices and payment status.", <Button icon="download" onClick={() => exportCSV(data.invoices.filter((i) => match(i, "INV-" + i.id)), "invoices")}>Export invoices</Button>)}<div className="filter-bar"><div className="segmented" role="group" aria-label="Invoice status">{["All", "Paid", "Pending", "Overdue"].map((s) => <button className={invoiceFilter === s ? "selected" : ""} aria-pressed={invoiceFilter === s} key={s} onClick={() => setInvoiceFilter(s)}>{s}</button>)}</div></div><section className="panel table-wrap"><table><thead><tr><th>Invoice</th><th>Company</th><th>Due date</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>{data.invoices.filter((i) => match(i, "INV-" + i.id)).filter((i) => invoiceFilter === "All" || i.status === invoiceFilter).map((i) => <tr key={i.id}><td><button className="text-btn" onClick={() => setModal({ type: "invoice", record: i })}>INV-{i.id}</button></td><td>{i.company}</td><td>{fmtDate(i.date)}</td><td><strong>{money(i.amount)}</strong></td><td><Badge tone={i.status === "Paid" ? "success" : i.status === "Overdue" ? "high" : "medium"}>{i.status}</Badge></td><td><Button onClick={() => setModal({ type: "invoice", record: i })}>View</Button></td></tr>)}</tbody></table>{!data.invoices.filter((i) => match(i, "INV-" + i.id)).filter((i) => invoiceFilter === "All" || i.status === invoiceFilter).length && <Empty />}</section></>}
 {page === "Tasks" && <>{pageHead("Plan your follow-ups and mark them done.", newBtn("task", "Add task"))}<div className="filter-bar"><div className="segmented" role="group" aria-label="Task status">{["All", "Open", "Completed"].map((f) => <button key={f} className={taskFilter === f ? "selected" : ""} aria-pressed={taskFilter === f} onClick={() => setTaskFilter(f)}>{f}</button>)}</div><span>{data.tasks.filter((t) => t.done).length} of {data.tasks.length} completed</span></div><section className="panel">{data.tasks.filter(match).filter((t) => taskFilter === "All" || (taskFilter === "Completed" ? t.done : !t.done)).map((t) => <div className={"task-row " + (t.done ? "done" : "")} key={t.id}><input aria-label={"Complete " + t.title} type="checkbox" checked={t.done} onChange={() => patch("tasks", t.id, { done: !t.done })} /><span><button className="text-btn" onClick={() => setModal({ type: "task", record: t })}>{t.title}</button><small>Due {fmtDate(t.date)}</small></span><Badge tone={t.done ? "success" : ""}>{t.done ? "Completed" : "To do"}</Badge><Menu label={"Actions for " + t.title} items={[["Edit task", "edit", () => setModal({ type: "task", record: t })], [t.done ? "Reopen task" : "Mark as done", "check", () => patch("tasks", t.id, { done: !t.done })], ["Delete", "trash", () => remove("tasks", t, "task"), true]]} /></div>)}{!data.tasks.filter(match).filter((t) => taskFilter === "All" || (taskFilter === "Completed" ? t.done : !t.done)).length && <Empty text="Nothing on this list" />}</section></>}
 {page === "Calendar" && <>{pageHead("Meetings and milestones for the month.", newBtn("event", "New event"))}<section className="panel"><div className="panel-head"><h3>{month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h3><div className="actions"><Button aria-label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>←</Button><Button onClick={() => {
    const n = /* @__PURE__ */ new Date();
    setMonth(new Date(n.getFullYear(), n.getMonth(), 1));
  }}>Today</Button><Button aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>→</Button></div></div><div className="calendar-grid">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <b className="weekday" key={d}>{d}</b>)}{Array.from({ length: (month.getDay() + 6) % 7 }, (_, i) => <div key={"blank" + i} className="calendar-day blank" />)}{Array.from({ length: new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate() }, (_, i) => {
    const date = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
    const events = data.events.filter((ev) => ev.date === date && match(ev)), today = date === todayKey;
    return <div className={"calendar-day" + (today ? " today" : "") + (events.length ? " has-event" : "")} key={date} onClick={(e) => e.target === e.currentTarget && setModal({ type: "event", defaultDate: date })}><button className="day-number" aria-current={today ? "date" : void 0} aria-label={"Add event on " + fmtDate(date) + (today ? ", today" : "")} onClick={() => setModal({ type: "event", defaultDate: date })}>{i + 1}</button>{events.map((ev) => <button className="calendar-event" key={ev.id} onClick={() => setModal({ type: "event", record: ev })}><small>{ev.time}</small>{ev.title}</button>)}</div>;
  })}</div><div className="agenda"><h3>This month</h3>{agenda.length ? <ul>{agenda.map((ev) => <li key={ev.id}><button className="agenda-item" onClick={() => setModal({ type: "event", record: ev })}><b>{fmtDate(ev.date)}</b><span>{ev.title}<small>{ev.time}</small></span></button></li>)}</ul> : <p>No events this month.</p>}</div></section></>}
 {page === "Reports" && <>{pageHead("Live pipeline totals alongside sample revenue history.", <Button icon="download" onClick={() => exportCSV(stages.map((s, i) => ({ stage: s, deals: deals.filter((d) => d.stage === i).length, value: sum(deals.filter((d) => d.stage === i)), weighted: sum(deals.filter((d) => d.stage === i)) * chances[i] / 100 })), "pipeline-report")}>Export report</Button>)}{stats}<div className="grid-2"><section className="panel"><div className="panel-head"><div><h3>Revenue trend</h3><p>Illustrative historical data</p></div><select aria-label="Report period" value={period} onChange={(e) => setPeriod(e.target.value)}><option>6 months</option><option>3 months</option></select></div><RevenueChart period={period} /></section><section className="panel"><h3>Pipeline by stage</h3><p>Value distribution · live data</p>{stages.map((s, i) => <div className={"stage-summary stage-" + i} key={s}><div><span><i className="dot" />{s}</span><b>{short(sum(deals.filter((d) => d.stage === i)))}</b></div><div className="progress"><span style={{ width: (sum(deals) ? sum(deals.filter((d) => d.stage === i)) / sum(deals) * 100 : 0) + "%" }} /></div></div>)}</section></div></>}
 {page === "Settings" && <>{pageHead("Profile, appearance, and demo data.")}<form onSubmit={(e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget));
    update("settings", { ...data.settings, ...f });
    setToast("Profile updated");
  }} className="panel settings-panel"><h3>Your profile</h3><p>Personalize the profile displayed in this demo.</p><div className="form-grid"><Field label="Full name" name="name" required maxLength="60" defaultValue={data.settings.name} /><Field label="Email address" name="email" type="email" required defaultValue={data.settings.email} /><Field label="Workspace name" name="workspace" required maxLength="50" defaultValue={data.settings.workspace} /></div><Button kind="primary" type="submit">Save profile</Button></form><section className="panel settings-panel"><h3>Appearance</h3><p>A softer space to do your best work.</p><div className="setting-row"><span>Accent color<small>Choose your favorite palette</small></span><div className="swatches">{["violet", "rose", "sage", "navy"].map((c) => <button key={c} className={"swatch " + c + (data.settings.accent === c ? " selected" : "")} aria-label={c + " accent"} aria-pressed={data.settings.accent === c} onClick={() => update("settings", { ...data.settings, accent: c })}>{data.settings.accent === c ? "\u2713" : ""}</button>)}</div></div>{[["dark", "Dark appearance"], ["compact", "Compact cards"]].map(([key, label]) => <label className="setting-row" key={key}><span>{label}</span><input className="switch" type="checkbox" checked={data.settings[key]} onChange={(e) => update("settings", { ...data.settings, [key]: e.target.checked })} /></label>)}</section><section className="panel settings-panel"><h3>Demo workspace</h3><p>Records are stored on this browser. Reset restores the original example data.</p><Button kind="danger" onClick={() => setModal({ type: "confirm", confirmLabel: "Reset data", title: "Reset demo data?", description: "All changes in this demo browser will be replaced with the original sample data.", action: () => {
    setData(clone());
    setToast("Demo workspace reset");
  } })}>Reset demo data</Button></section></>}
 {page === "Components" && <>{pageHead("Reusable UI pieces for your next admin application.")}<div className="grid-2"><section className="panel"><h3>Buttons & actions</h3><div className="component-row"><Button kind="primary" icon="plus" onClick={() => setToast("Primary button clicked")}>Primary</Button><Button onClick={() => setToast("Secondary button clicked")}>Secondary</Button><Button disabled>Disabled</Button></div><h3>Status badges</h3><div className="component-row"><Badge tone="success">Success</Badge><Badge tone="medium">Pending</Badge><Badge tone="high">Urgent</Badge><Badge tone="low">Information</Badge></div><h3>Team avatars</h3><div className="component-row">{["MT", "AB", "JK", "LW"].map((s, i) => <Avatar key={s} text={s} tone={i} />)}</div></section><section className="panel"><h3>Form controls</h3><Field label="Example input" placeholder="A fresh idea…" /><Field label="Select input"><select defaultValue="Proposal"><option>New</option><option>Proposal</option><option>Won</option></select></Field><div className="component-row"><Button onClick={() => setModal({ type: "example" })}>Open modal</Button><Button onClick={() => setToast("Everything looks good. Changes saved.")}>Show toast</Button></div></section></div>{stats}</>}
 {page === "Products" && <Products {...ctx} />}
 {page === "Orders" && <Orders {...ctx} />}
 {page === "Projects" && <Projects {...ctx} />}
 {page === "Files" && <Files {...ctx} />}
 {page === "Team" && <Team {...ctx} />}
 {page === "Activity" && <Activity {...ctx} />}
 {page === "Profile" && <Profile {...ctx} />}
 {page === "Billing" && <Billing {...ctx} />}
 {page === "Help" && <Help {...ctx} />}
 {page === "Pages" && <Pages {...ctx} />}
 <footer className="content-footer"><span>mellow. <span>A softer way to work.</span></span><span>Demo workspace · Data saved in your browser</span></footer>
 </div><nav className="dock" aria-label="Quick navigation">{["Dashboard", "Contacts", "Deals", "Inbox"].map((n) => <button key={n} className={page === n ? "active" : ""} aria-current={page === n ? "page" : void 0} onClick={() => go(n)}>{n}{n === "Inbox" && unread > 0 && <b>{unread}</b>}</button>)}{creates[page] && <button className="dock-plus" aria-label={"New " + creates[page]} onClick={() => setModal({ type: creates[page] })}><Icon name="plus" size={22} /></button>}</nav>
 </main>
 {recordModal && <Modal title={(modal.record ? "Edit " : "New ") + modal.type} onClose={() => setModal(null)}><form onSubmit={saveRecord} key={modal.record?.id || modal.type}><div className="form-grid">{modal.type === "deal" && <><Field label="Deal title" name="title" required maxLength="90" defaultValue={modal.record?.title} /><Field label="Company" name="company" required maxLength="70" defaultValue={modal.record?.company} /><Field label="Value (USD)" name="value" type="number" min="0" max="1000000000" step="0.01" required defaultValue={modal.record?.value} /><Field label="Stage"><select name="stage" defaultValue={modal.record?.stage ?? modal.defaultStage ?? 0}>{stages.map((s, i) => <option key={s} value={i}>{s}</option>)}</select></Field><Field label="Priority"><select name="priority" defaultValue={modal.record?.priority || "Medium"}>{["Low", "Medium", "High"].map((s) => <option key={s}>{s}</option>)}</select></Field><Field label="Owner"><select name="owner" defaultValue={modal.record?.owner || "MT"}><option value="MT">Mia Taylor</option><option value="AB">Alex Brown</option><option value="JK">Jamie Kim</option></select></Field><Field label="Expected close date" name="date" type="date" required defaultValue={modal.record?.date || "2026-11-20"} /></>}{modal.type === "contact" && <><Field label="Full name" name="name" required maxLength="70" defaultValue={modal.record?.name} /><Field label="Company" name="company" required defaultValue={modal.record?.company} /><Field label="Email" name="email" type="email" required defaultValue={modal.record?.email} /><Field label="Role" name="role" required defaultValue={modal.record?.role} /></>}{["task", "event"].includes(modal.type) && <><Field label="Title" name="title" required maxLength="100" defaultValue={modal.record?.title} /><Field label="Date" name="date" type="date" required defaultValue={modal.record?.date || modal.defaultDate || "2026-11-10"} />{modal.type === "event" && <Field label="Time" name="time" type="time" required defaultValue={modal.record?.time || "09:00"} />}</>}{modal.type === "product" && <><Field label="Product name" name="name" required maxLength="80" defaultValue={modal.record?.name} /><Field label="SKU" name="sku" required maxLength="20" defaultValue={modal.record?.sku} /><Field label="Category"><select name="category" defaultValue={modal.record?.category || "Software"}>{["Software", "Service", "Add-on"].map((s) => <option key={s}>{s}</option>)}</select></Field><Field label="Status"><select name="status" defaultValue={modal.record?.status || "Active"}>{["Active", "Out of stock", "Archived"].map((s) => <option key={s}>{s}</option>)}</select></Field><Field label="Price (USD)" name="price" type="number" min="0" step="0.01" required defaultValue={modal.record?.price} /><Field label="Stock" name="stock" type="number" min="0" step="1" required defaultValue={modal.record?.stock ?? 0} /></>}{modal.type === "member" && <><Field label="Full name" name="name" required maxLength="70" defaultValue={modal.record?.name} /><Field label="Email" name="email" type="email" required defaultValue={modal.record?.email} /><Field label="Role"><select name="role" defaultValue={modal.record?.role || "Sales"}>{["Admin", "Manager", "Sales", "Support", "Viewer"].map((s) => <option key={s}>{s}</option>)}</select></Field><Field label="Status"><select name="status" defaultValue={modal.record?.status || "Invited"}>{["Active", "Invited", "Inactive"].map((s) => <option key={s}>{s}</option>)}</select></Field></>}{modal.type === "project" && <><Field label="Project name" name="name" required maxLength="80" defaultValue={modal.record?.name} /><Field label="Client" name="client" required maxLength="70" defaultValue={modal.record?.client} /><Field label="Status"><select name="status" defaultValue={modal.record?.status || "On track"}>{["On track", "At risk", "Completed"].map((s) => <option key={s}>{s}</option>)}</select></Field><Field label="Progress (%)" name="progress" type="number" min="0" max="100" step="1" required defaultValue={modal.record?.progress ?? 0} /><Field label="Due date" name="due" type="date" required defaultValue={modal.record?.due || "2026-12-15"} /></>}</div><div className="modal-actions">{modal.record && <Button type="button" kind="danger" icon="trash" onClick={removeRecord}>Delete</Button>}<Button type="button" onClick={() => setModal(null)}>Cancel</Button><Button type="submit" kind="primary">Save {modal.type}</Button></div></form></Modal>}
 {modal?.type === "confirm" && <Modal title={modal.title} onClose={() => setModal(null)}><p>{modal.description}</p><div className="modal-actions"><Button onClick={() => setModal(null)}>Cancel</Button><Button kind={modal.danger === false ? "primary" : "danger"} onClick={() => {
    modal.action();
    setModal(null);
  }}>{modal.confirmLabel || "Confirm"}</Button></div></Modal>}
 {modal?.type === "example" && <Modal title="A little room for focus" onClose={() => setModal(null)}><p>This dialog includes keyboard focus management, Escape to close, and a responsive layout.</p><div className="modal-actions"><Button kind="primary" onClick={() => setModal(null)}>Looks good</Button></div></Modal>}
 {modal?.type === "invoice" && <Modal title={"Invoice #" + modal.record.id} onClose={() => setModal(null)}><div className="invoice-print"><span className="eyebrow">SAMPLE INVOICE</span><h2>{data.settings.workspace}</h2><p>Billed to {modal.record.company}</p><p>Due date: {modal.record.date}</p><div className="invoice-total"><span>Service subscription</span><strong>{money(modal.record.amount)}</strong></div><Badge tone={modal.record.status === "Paid" ? "success" : "medium"}>{modal.record.status}</Badge></div><div className="modal-actions"><Button onClick={() => window.print()}>Print</Button>{modal.record.status !== "Paid" && <Button kind="primary" onClick={() => {
    patch("invoices", modal.record.id, { status: "Paid" });
    log("Invoice INV-" + modal.record.id + " marked as paid", "invoice");
    setModal(null);
    setToast("Invoice marked as paid");
  }}>Mark as paid</Button>}</div></Modal>}
 {toastEl}
 {celebrate && <div className="confetti" aria-hidden="true">{Array.from({ length: 38 }, (_, i) => <i key={i} style={{ left: i * 37 % 100 + "%", animationDelay: i % 7 * 0.08 + "s", background: "var(--stat-" + (i % 4 + 1) + "-icon)" }} />)}</div>}
 </div>;
}
createRoot(document.getElementById("root")).render(<App />);
