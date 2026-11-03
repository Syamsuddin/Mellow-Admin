import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { seed, stages, chances, money, short, initials, fmtDate, trends } from "./data";
import { Icon, Button, Avatar, Badge, StatCard, Menu, Modal, Field } from "./components";
import { Dashboard, Analytics, Ecommerce, Reports, Contacts, DealInsights, Inbox, Calendar, Tasks, Invoices, Products, Orders, Projects, Files, Team, Activity, Profile, Billing, Settings, Help, Components, Pages, Screen, screens } from "./pages";
import "./styles.css";
const nav = [["Dashboard", "home", "Overview"], ["Analytics", "globe", "Overview"], ["eCommerce", "bag", "Overview"], ["Reports", "chart", "Overview"], ["Activity", "activity", "Overview"], ["Contacts", "contact", "CRM"], ["Deals", "briefcase", "CRM"], ["Inbox", "message", "CRM"], ["Calendar", "calendar", "CRM"], ["Tasks", "check", "CRM"], ["Products", "box", "Commerce"], ["Orders", "cart", "Commerce"], ["Invoices", "file", "Commerce"], ["Projects", "layers", "Workspace"], ["Files", "folder", "Workspace"], ["Team", "people", "Workspace"], ["Profile", "user", "Account"], ["Billing", "card", "Account"], ["Settings", "settings", "Account"], ["Help", "help", "Account"], ["Components", "grid", "UI kit"], ["Pages", "lock", "UI kit"]];
const slug = (n) => n.toLowerCase().replace(/\s+/g, "-");
const routes = [...nav.map(([n]) => n), ...screens.map(([n]) => n)];
const resolve = (hash) => routes.find((n) => slug(n) === hash) || (hash ? "Error 404" : "Dashboard");
const groups = [...new Set(nav.map((n) => n[2]))].map((s) => [s, nav.filter((n) => n[2] === s)]);
const creates = { Dashboard: "deal", eCommerce: "product", Deals: "deal", Reports: "deal", Contacts: "contact", Tasks: "task", Calendar: "event", Products: "product", Projects: "project", Team: "member" };
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
  const [query, setQuery] = useState(""), [mine, setMine] = useState(false), [modal, setModal] = useState(null), [note, setNote] = useState(null), [menu, setMenu] = useState(false), [notifications, setNotifications] = useState(false), [activeMessage, setActiveMessage] = useState(1), [celebrate, setCelebrate] = useState(false), [entering, setEntering] = useState(true);
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
  useLayoutEffect(() => {
    setEntering(true);
    const timer = setTimeout(() => setEntering(false), 2e3);
    return () => clearTimeout(timer);
  }, [page]);
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
  const kpi = [sum(open), open.reduce((a, d) => a + d.value * chances[d.stage] / 100, 0), sum(won), deals.length ? sum(deals) / deals.length : 0];
  const trend = (on, i) => on && kpi[i] > 0 ? { trend: trends[i].map((r) => r * kpi[i]), delta: Math.round((1 / trends[i][6] - 1) * 100) } : {};
  const kpis = (on) => <div className="stats"><StatCard tone="s1" icon="briefcase" value={short(kpi[0])} label="Open pipeline" note={open.length + " open deal" + (open.length === 1 ? "" : "s")} onClick={() => go("Deals")} {...trend(on, 0)} /><StatCard tone="s2" icon="target" value={short(kpi[1])} label="Weighted forecast" note="By stage probability" onClick={() => go("Reports")} {...trend(on, 1)} /><StatCard tone="s3" icon="trophy" value={short(kpi[2])} label="Won deals" note={won.length + " closed"} onClick={() => go("Reports")} {...trend(on, 2)} /><StatCard tone="s4" icon="chart" value={short(kpi[3])} label="Average deal size" note={"Across " + deals.length + " deal" + (deals.length === 1 ? "" : "s")} onClick={() => go("Reports")} {...trend(on, 3)} /></div>;
  const stats = kpis(false);
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
  const reset = () => {
    setData(clone());
    setToast("Demo workspace reset");
  };
  const ctx = { data, update, patch, setModal, setToast, go, match, pageHead, exportCSV, query, log, remove, deals, kpis, reset, move };
  const toastEl = <div className="toast-region" aria-live="polite" aria-atomic="true">{note && <div className={"toast " + note.tone} key={note.id}><Icon name={note.tone === "error" ? "alert" : note.tone === "info" ? "info" : "check"} size={19} /><span>{note.text}</span>{note.undo && <button className="toast-action" onClick={() => {
    note.undo();
    setNote(null);
  }}>Undo</button>}<button aria-label="Dismiss notification" onClick={() => setNote(null)}><Icon name="close" size={15} /></button></div>}</div>;
  if (isScreen(page)) return <>{<Screen key={page} name={page} data={data} nav={nav} go={go} setToast={setToast} />}{toastEl}</>;
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
 <div className={"content" + (entering ? " entering" : "")}>
 {page === "Deals" && <>{pageHead("Track every opportunity from first contact to won.", <><div className="segmented" role="group" aria-label="Deal owner"><button className={!mine ? "selected" : ""} aria-pressed={!mine} onClick={() => setMine(false)}>All deals</button><button className={mine ? "selected" : ""} aria-pressed={mine} onClick={() => setMine(true)}>My deals</button></div>{newBtn("deal", "New deal")}</>)}{stats}<div className="board-caption"><span><span className="live-dot" /> {deals.length} deals in your pipeline</span><span>Drag cards between stages <span className="desktop-only">· Win a deal to celebrate</span></span></div>{board}<DealInsights {...ctx} /></>}
 {page === "Dashboard" && <Dashboard {...ctx} />}
 {page === "Analytics" && <Analytics {...ctx} />}
 {page === "eCommerce" && <Ecommerce {...ctx} />}
 {page === "Contacts" && <Contacts {...ctx} />}
 {page === "Inbox" && <Inbox {...ctx} active={activeMessage} setActive={setActiveMessage} />}
 {page === "Invoices" && <Invoices {...ctx} />}
 {page === "Tasks" && <Tasks {...ctx} />}
 {page === "Calendar" && <Calendar {...ctx} />}
 {page === "Reports" && <Reports {...ctx} />}
 {page === "Settings" && <Settings {...ctx} />}
 {page === "Components" && <Components {...ctx} />}
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
 {recordModal && <Modal title={(modal.record ? "Edit " : "New ") + modal.type} onClose={() => setModal(null)}><form onSubmit={saveRecord} key={modal.record?.id || modal.type}><div className="form-grid">{modal.type === "deal" && <><Field label="Deal title" name="title" required maxLength="90" defaultValue={modal.record?.title} /><Field label="Company" name="company" required maxLength="70" defaultValue={modal.record?.company} /><Field label="Value (USD)" name="value" type="number" min="0" max="1000000000" step="0.01" required defaultValue={modal.record?.value} /><Field label="Stage"><select name="stage" defaultValue={modal.record?.stage ?? modal.defaultStage ?? 0}>{stages.map((s, i) => <option key={s} value={i}>{s}</option>)}</select></Field><Field label="Priority"><select name="priority" defaultValue={modal.record?.priority || "Medium"}>{["Low", "Medium", "High"].map((s) => <option key={s}>{s}</option>)}</select></Field><Field label="Owner"><select name="owner" defaultValue={modal.record?.owner || "MT"}><option value="MT">Mia Taylor</option><option value="AB">Alex Brown</option><option value="JK">Jamie Kim</option></select></Field><Field label="Expected close date" name="date" type="date" required defaultValue={modal.record?.date || "2026-11-20"} /></>}{modal.type === "contact" && <><Field label="Full name" name="name" required maxLength="70" defaultValue={modal.record?.name} /><Field label="Company" name="company" required defaultValue={modal.record?.company ?? modal.defaultCompany} /><Field label="Email" name="email" type="email" required defaultValue={modal.record?.email} /><Field label="Role" name="role" required defaultValue={modal.record?.role} /></>}{["task", "event"].includes(modal.type) && <><Field label="Title" name="title" required maxLength="100" defaultValue={modal.record?.title} /><Field label="Date" name="date" type="date" required defaultValue={modal.record?.date || modal.defaultDate || "2026-11-10"} />{modal.type === "event" && <Field label="Time" name="time" type="time" required defaultValue={modal.record?.time || "09:00"} />}</>}{modal.type === "product" && <><Field label="Product name" name="name" required maxLength="80" defaultValue={modal.record?.name} /><Field label="SKU" name="sku" required maxLength="20" defaultValue={modal.record?.sku} /><Field label="Category"><select name="category" defaultValue={modal.record?.category || "Software"}>{["Software", "Service", "Add-on"].map((s) => <option key={s}>{s}</option>)}</select></Field><Field label="Status"><select name="status" defaultValue={modal.record?.status || "Active"}>{["Active", "Out of stock", "Archived"].map((s) => <option key={s}>{s}</option>)}</select></Field><Field label="Price (USD)" name="price" type="number" min="0" step="0.01" required defaultValue={modal.record?.price} /><Field label="Stock" name="stock" type="number" min="0" step="1" required defaultValue={modal.record?.stock ?? 0} /></>}{modal.type === "member" && <><Field label="Full name" name="name" required maxLength="70" defaultValue={modal.record?.name} /><Field label="Email" name="email" type="email" required defaultValue={modal.record?.email} /><Field label="Role"><select name="role" defaultValue={modal.record?.role || "Sales"}>{["Admin", "Manager", "Sales", "Support", "Viewer"].map((s) => <option key={s}>{s}</option>)}</select></Field><Field label="Status"><select name="status" defaultValue={modal.record?.status || "Invited"}>{["Active", "Invited", "Inactive"].map((s) => <option key={s}>{s}</option>)}</select></Field></>}{modal.type === "project" && <><Field label="Project name" name="name" required maxLength="80" defaultValue={modal.record?.name} /><Field label="Client" name="client" required maxLength="70" defaultValue={modal.record?.client} /><Field label="Status"><select name="status" defaultValue={modal.record?.status || "On track"}>{["On track", "At risk", "Completed"].map((s) => <option key={s}>{s}</option>)}</select></Field><Field label="Progress (%)" name="progress" type="number" min="0" max="100" step="1" required defaultValue={modal.record?.progress ?? 0} /><Field label="Due date" name="due" type="date" required defaultValue={modal.record?.due || "2026-12-15"} /></>}</div><div className="modal-actions">{modal.record && <Button type="button" kind="danger" icon="trash" onClick={removeRecord}>Delete</Button>}<Button type="button" onClick={() => setModal(null)}>Cancel</Button><Button type="submit" kind="primary">Save {modal.type}</Button></div></form></Modal>}
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
