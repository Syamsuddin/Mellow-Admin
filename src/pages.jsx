import React, { useState, useRef } from "react";
import { money, short, fmtDate, initials, photos, plans, receipts, faq, stages, chances, revenue, engagement, quarterTarget } from "./data";
import { Icon, Button, Avatar, Badge, Empty, StatCard, Menu, Field, TrendChart, Gauge, Ring, SegmentBar, Heatmap, Columns, BarList, Breakdown, RevenueChart, Sparkline } from "./components";
const today = () => new Date().toISOString().slice(0, 10);
const statusTone = { Active: "success", Delivered: "success", "On track": "success", Completed: "success", Paid: "success", Shipped: "low", Processing: "low", Invited: "low", Pending: "medium", "At risk": "high", "Out of stock": "high", Cancelled: "high", Overdue: "high", Inactive: "", Archived: "", Viewer: "" };
const Segmented = ({ options, value, onChange, label = "Filter" }) => <div className="segmented" role="group" aria-label={label}>{options.map((o) => <button key={o} className={value === o ? "selected" : ""} aria-pressed={value === o} onClick={() => onChange(o)}>{o}</button>)}</div>;
const confirmRemove = (ctx, key, row, label) => ctx.remove(key, row, label);
const localDay = (n = new Date()) => n.getFullYear() + "-" + String(n.getMonth() + 1).padStart(2, "0") + "-" + String(n.getDate()).padStart(2, "0");
const daysTo = (d) => Math.round((new Date(d.slice(0, 10) + "T12:00:00") - new Date(localDay() + "T12:00:00")) / 864e5);
const dueLabel = (n) => n === 0 ? "today" : n === 1 ? "tomorrow" : n > 0 ? "in " + n + " days" : n === -1 ? "1 day late" : -n + " days late";
const plural = (n, w) => n + " " + w + (n === 1 ? "" : "s");
const total = (xs, k = "value") => xs.reduce((a, x) => a + (Number(x[k]) || 0), 0);
const nameOf = (data, o) => data.team.find((m) => initials(m.name) === o)?.name || o;
const weekOf = (d) => {
  const x = new Date(d + "T12:00:00");
  x.setDate(x.getDate() - (x.getDay() + 6) % 7);
  return localDay(x);
};
const Panel = ({ title, sub, action, span, className = "", children }) => <section className={"panel" + (span ? " span-" + span : "") + (className ? " " + className : "")}><div className="panel-head"><div><h3>{title}</h3>{sub && <p>{sub}</p>}</div>{action}</div>{children}</section>;
const Figures = ({ items, className = "" }) => <div className={"figures " + className}>{items.map(([k, v]) => <div key={k}><small>{k}</small><strong>{v}</strong></div>)}</div>;
const Delta = ({ value, note }) => <em className={"delta" + (value < 0 ? " down" : "")}><Icon name="arrow" size={12} />{Math.abs(value)}%{note && <span className="sr-only">{(value < 0 ? " down " : " up ") + note}</span>}</em>;
const Range = ({ value, onChange }) => <div className="segmented" role="group" aria-label="Revenue period">{[3, 6, 12].map((n) => <button key={n} className={value === n ? "selected" : ""} aria-pressed={value === n} aria-label={"Last " + n + " months"} onClick={() => onChange(n)}>{n}M</button>)}</div>;
const shortcuts = [["/", "Focus the page filter"], ["Esc", "Clear the filter, close menus and dialogs"], ["Tab", "Move between controls"], ["← →", "Step through chart months and heatmap weeks"], ["↑ ↓", "Move through menu items and heatmap days"], ["Home / End", "Jump to the first or last item"]];
const ShortcutList = () => <ul className="shortcut-list">{shortcuts.map(([k, v]) => <li key={k}><kbd>{k}</kbd><span>{v}</span></li>)}</ul>;
const ownerTone = (o) => o === "MT" ? 0 : o === "AB" ? 3 : 2;
const ringTone = { "On track": "k-success", "At risk": "k-danger", Completed: "k-accent" };
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
function Dashboard(ctx) {
  const { data, match, pageHead, setModal, go, patch, deals, kpis } = ctx;
  const [range, setRange] = useState(6);
  const sum = (xs, k = "value") => xs.reduce((a, d) => a + d[k], 0), plural = (n, w) => n + " " + w + (n === 1 ? "" : "s");
  const months = revenue.months.slice(-range), actual = revenue.actual.slice(-range), target = revenue.target.slice(-range);
  const total = actual.reduce((a, n) => a + n, 0), goal = target.reduce((a, n) => a + n, 0), best = actual.indexOf(Math.max(...actual)), vsGoal = pct(total - goal, goal);
  const open = deals.filter((d) => d.stage < 4), won = sum(deals.filter((d) => d.stage === 4)), forecast = open.reduce((a, d) => a + d.value * chances[d.stage] / 100, 0);
  const reached = stages.map((_, i) => deals.filter((d) => d.stage >= i).length);
  const owners = [...new Set(deals.map((d) => d.owner))].map((o) => {
    const list = deals.filter((d) => d.owner === o);
    return { id: o, name: data.team.find((m) => initials(m.name) === o)?.name || o, count: list.length, total: sum(list), won: sum(list.filter((d) => d.stage === 4)) };
  }).sort((a, b) => b.total - a.total);
  const invoices = data.invoices.filter((i) => match(i, "INV-" + i.id)), billed = sum(invoices, "amount");
  const byStatus = [["Paid", "k-success"], ["Pending", "k-warning"], ["Overdue", "k-danger"]].map(([label, tone]) => {
    const list = invoices.filter((i) => i.status === label);
    return { label, tone, count: list.length, value: sum(list, "amount") };
  });
  const tasks = data.tasks.filter(match), done = data.tasks.filter((t) => t.done).length, activity = data.activity.filter(match).slice(0, 5), projects = data.projects.filter(match);
  const top = [...open].sort((a, b) => b.value - a.value).slice(0, 5);
  return <>{pageHead("Pipeline, revenue, and your next steps at a glance.", <><Button icon="calendar" onClick={() => go("Calendar")}>November 2026</Button><Button kind="primary" icon="plus" onClick={() => setModal({ type: "deal" })}>New deal</Button></>)}{kpis(true)}<div className="dash">
 <section className="panel span-8"><div className="panel-head"><div><h3>Revenue overview</h3><p>Sample monthly revenue against target · USD</p></div><div className="segmented" role="group" aria-label="Revenue period">{[3, 6, 12].map((n) => <button key={n} className={range === n ? "selected" : ""} aria-pressed={range === n} aria-label={"Last " + n + " months"} onClick={() => setRange(n)}>{n}M</button>)}</div></div><div className="figures"><div><small>Total revenue</small><strong>{short(total * 1e3)}</strong></div><div><small>Against target</small><strong><em className={"delta" + (vsGoal < 0 ? " down" : "")}><Icon name="arrow" size={12} />{Math.abs(vsGoal)}%<span className="sr-only">{vsGoal < 0 ? " below" : " above"} target</span></em></strong></div><div><small>Best month</small><strong>{months[best]} · {short(actual[best] * 1e3)}</strong></div><div className="legend"><span className="line k-accent"><i />Revenue</span><span className="line k-muted"><i />Target</span></div></div><TrendChart label="Monthly revenue and target, sample data" labels={months} series={[{ label: "Target", values: target, tone: "k-muted" }, { label: "Revenue", values: actual, tone: "k-accent", area: true }]} /></section>
 <section className="panel span-4"><div className="panel-head"><div><h3>Sales funnel</h3><p>Deals reaching each stage · conversion from the stage before</p></div></div><div className="funnel">{stages.map((s, i) => <div className={"funnel-row stage-" + i} key={s}><div className="funnel-label"><span><i className="dot" />{s}</span><b>{plural(reached[i], "deal")}</b><small>{i ? pct(reached[i], reached[i - 1]) + "%" : "100%"}</small></div><div className="funnel-track"><span className="funnel-bar" style={{ width: pct(reached[i], reached[0]) + "%" }} /></div></div>)}</div><div className="figures split"><div><small>Win conversion</small><strong>{pct(reached[4], reached[0])}%</strong></div><div><small>Open deals</small><strong>{open.length}</strong></div><Button kind="subtle" onClick={() => go("Deals")}>Pipeline →</Button></div></section>
 <section className="panel span-4"><div className="panel-head"><div><h3>Q4 revenue goal</h3><p>Won deals against a {short(quarterTarget)} sample target</p></div></div><div className="gauge-wrap"><Gauge value={won / quarterTarget} extra={forecast / quarterTarget} label={"Won " + short(won) + " of " + short(quarterTarget) + ", plus " + short(forecast) + " weighted forecast"} /><div className="gauge-value"><strong>{pct(won, quarterTarget)}%</strong><small>of goal reached</small></div></div><ul className="legend-list"><li className="k-accent"><i /><span>Won</span><b>{short(won)}</b></li><li className="k-soft"><i /><span>Weighted forecast</span><b>{short(forecast)}</b></li><li><Icon name="target" size={16} /><span>Projected at quarter end</span><b>{pct(won + forecast, quarterTarget)}%</b></li></ul></section>
 <section className="panel span-4"><div className="panel-head"><div><h3>Top performers</h3><p>Deal value by owner · live</p></div><div className="legend"><span className="k-won"><i />Won</span><span className="k-open"><i />Open</span></div></div>{owners.map((o, i) => <div className={"leader-row" + (i ? "" : " first")} key={o.id}><span className="rank">{i ? i + 1 : <Icon name="trophy" size={14} />}</span><Avatar text={o.id} tone={ownerTone(o.id)} small /><span className="leader-name"><b>{o.name}</b><small>{plural(o.count, "deal")} · {short(o.won)} won</small></span><strong>{short(o.total)}</strong><div className="leader-bar" style={{ width: pct(o.total, owners[0].total) + "%" }}>{o.won > 0 && <span className="k-won" style={{ flexGrow: o.won }} />}{o.total > o.won && <span className="k-open" style={{ flexGrow: o.total - o.won }} />}</div></div>)}{!owners.length && <Empty text="No deals match" />}</section>
 <section className="panel span-4"><div className="panel-head"><div><h3>Invoice collection</h3><p>Billed amount by status · live</p></div><Button kind="subtle" onClick={() => go("Invoices")}>Invoices →</Button></div><div className="headline"><strong>{pct(byStatus[0].value, billed)}%</strong><span>collected<small>{short(byStatus[0].value)} of {short(billed)} billed</small></span></div><SegmentBar parts={byStatus} label={byStatus.map((s) => s.label + " " + money(s.value)).join(", ")} /><ul className="legend-list">{byStatus.map((s) => <li className={s.tone} key={s.label}><i /><span>{s.label}<small>{plural(s.count, "invoice")}</small></span><b>{money(s.value)}</b></li>)}</ul></section>
 <section className="panel span-8"><div className="panel-head"><div><h3>Team engagement</h3><p>Calls, emails, and meetings per day · sample data</p></div><Button kind="subtle" onClick={() => go("Activity")}>Activity log →</Button></div><Heatmap days={engagement} unit="touchpoints" /></section>
 <section className="panel span-4"><div className="panel-head"><div><h3>Your next steps</h3><p>{done} of {plural(data.tasks.length, "task")} completed</p></div><Ring value={pct(done, data.tasks.length)} size={48} stroke={5} label={pct(done, data.tasks.length) + "% of tasks completed"}>{pct(done, data.tasks.length)}%</Ring></div>{tasks.slice(0, 4).map((t) => <label className={"task-row " + (t.done ? "done" : "")} key={t.id}><input type="checkbox" checked={t.done} onChange={() => patch("tasks", t.id, { done: !t.done })} /><span>{t.title}<small>{fmtDate(t.date)}</small></span></label>)}{!tasks.length && <Empty text="Nothing on this list" />}<Button kind="subtle" onClick={() => go("Tasks")}>View all tasks →</Button></section>
 <section className="panel span-4"><div className="panel-head"><div><h3>Recent activity</h3><p>Latest changes in this workspace</p></div><Button kind="subtle" onClick={() => go("Activity")}>View all →</Button></div>{activity.length ? <ol className="timeline">{activity.map((a) => <li key={a.id}><span className="timeline-icon"><Icon name={kindIcon[a.kind] || "activity"} size={15} /></span><span><b>{a.text}</b><small>{fmtDate(a.time.slice(0, 10))} · {a.time.slice(11)} · by {a.who}</small></span></li>)}</ol> : <Empty text="No activity yet" />}</section>
 <section className="panel span-8"><div className="panel-head"><div><h3>Deals in motion</h3><p>Your most valuable open opportunities</p></div><Button kind="subtle" onClick={() => go("Deals")}>View pipeline →</Button></div><div className="table-wrap"><table><thead><tr><th>Opportunity</th><th>Value</th><th>Stage</th><th>Probability</th><th>Owner</th></tr></thead><tbody>{top.map((d) => <tr key={d.id}><td><div className="cell-main"><span className={"company-icon tone-" + d.id % 4}>{d.company[0]}</span><span><button className="text-btn" onClick={() => setModal({ type: "deal", record: d })}>{d.title}</button><small>{d.company} · closes {fmtDate(d.date)}</small></span></div></td><td><strong>{money(d.value)}</strong></td><td><span className={"stage-tag stage-" + d.stage}><i className="dot" />{stages[d.stage]}</span></td><td><div className={"chance stage-" + d.stage}><div className="progress"><span style={{ width: chances[d.stage] + "%" }} /></div><b>{chances[d.stage]}%</b></div></td><td><Avatar text={d.owner} tone={ownerTone(d.owner)} small /></td></tr>)}</tbody></table></div>{!top.length && <Empty />}</section>
 <section className="panel span-12"><div className="panel-head"><div><h3>Project health</h3><p>Progress and delivery status · live</p></div><Button kind="subtle" onClick={() => go("Projects")}>All projects →</Button></div>{projects.length ? <div className="ring-grid">{projects.map((p) => <button className="ring-card" key={p.id} onClick={() => setModal({ type: "project", record: p })}><Ring value={p.progress} tone={ringTone[p.status] || "k-accent"} label={p.progress + "% complete"}>{p.progress}%</Ring><span><b>{p.name}</b><small>{p.client} · due {fmtDate(p.due)}</small><Badge tone={statusTone[p.status]}>{p.status}</Badge></span></button>)}</div> : <Empty />}</section>
 </div></>;
}
function Reports(ctx) {
  const { data, match, pageHead, exportCSV, deals, kpis } = ctx;
  const [range, setRange] = useState(12);
  const months = revenue.months.slice(-range), actual = revenue.actual.slice(-range), sum = actual.reduce((a, n) => a + n, 0), best = actual.indexOf(Math.max(...actual));
  const all = total(deals), open = deals.filter((d) => d.stage < 4);
  const rows = stages.map((stage, i) => {
    const list = deals.filter((d) => d.stage === i), value = total(list);
    return { stage, deals: list.length, value, weighted: Math.round(value * chances[i] / 100) };
  });
  const start = open.length ? weekOf(open.map((d) => d.date).sort()[0]) : localDay();
  const weeks = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(start + "T12:00:00");
    d.setDate(d.getDate() + i * 7);
    return localDay(d);
  });
  const closing = weeks.map((w, i) => ({ label: fmtDate(w), value: total(open.filter((d) => d.date >= w && (i === 5 || d.date < weeks[i + 1]))) }));
  const priority = ["High", "Medium", "Low"].map((p, i) => {
    const list = deals.filter((d) => d.priority === p);
    return { label: p, tone: ["k-accent", "k-soft", "k-open"][i], value: total(list), sub: plural(list.length, "deal") };
  });
  const owners = [...new Set(deals.map((d) => d.owner))].map((o) => {
    const list = deals.filter((d) => d.owner === o);
    return { key: o, label: nameOf(data, o), value: total(list), sub: plural(list.length, "deal") + " · " + short(total(list.filter((d) => d.stage === 4))) + " won", lead: <Avatar text={o} tone={ownerTone(o)} small /> };
  }).sort((a, b) => b.value - a.value);
  const invoices = data.invoices.filter((i) => match(i, "INV-" + i.id));
  const clients = [...new Set(invoices.map((i) => i.company))].map((c) => {
    const list = invoices.filter((i) => i.company === c);
    return { label: c, value: total(list, "amount"), sub: list.map((i) => i.status).join(" · "), lead: <span className={"company-icon tone-" + c.length % 4}>{c[0]}</span> };
  }).sort((a, b) => b.value - a.value).slice(0, 5);
  return <>{pageHead("Live pipeline analytics alongside sample revenue history.", <><Range value={range} onChange={setRange} /><Button icon="download" onClick={() => exportCSV(rows, "pipeline-report")}>Export report</Button></>)}{kpis(true)}<div className="dash">
 <Panel span={8} title="Monthly revenue" sub={"Illustrative history · last " + range + " months · USD"}><Figures items={[["Total revenue", short(sum * 1e3)], ["Monthly average", short(sum / range * 1e3)], ["Growth in period", <Delta value={pct(actual[range - 1] - actual[0], actual[0])} note="over the period" />], ["Best month", months[best] + " · " + short(actual[best] * 1e3)]]} /><RevenueChart months={months} values={actual} /></Panel>
 <Panel span={4} title="Pipeline by stage" sub="Value distribution · live">{rows.map((r, i) => <div className={"stage-summary stage-" + i} key={r.stage}><div><span><i className="dot" />{r.stage}<small>{plural(r.deals, "deal")}</small></span><b>{short(r.value)}</b></div><div className="progress"><span style={{ width: pct(r.value, all) + "%" }} /></div></div>)}<Figures className="split" items={[["Total pipeline", short(all)], ["Weighted", short(total(rows, "weighted"))]]} /></Panel>
 <Panel span={8} title="Pipeline report" sub="Deals, value, and weighted forecast per stage · live"><div className="table-wrap"><table><thead><tr><th>Stage</th><th>Deals</th><th>Value</th><th>Share of pipeline</th><th>Probability</th><th>Weighted</th></tr></thead><tbody>{rows.map((r, i) => <tr key={r.stage}><td><span className={"stage-tag stage-" + i}><i className="dot" />{r.stage}</span></td><td>{r.deals}</td><td><strong>{money(r.value)}</strong></td><td><div className={"chance stage-" + i}><div className="progress"><span style={{ width: pct(r.value, all) + "%" }} /></div><b>{pct(r.value, all)}%</b></div></td><td>{chances[i]}%</td><td>{money(r.weighted)}</td></tr>)}</tbody><tfoot><tr><td>Total</td><td>{deals.length}</td><td>{money(all)}</td><td /><td /><td>{money(total(rows, "weighted"))}</td></tr></tfoot></table></div></Panel>
 <Panel span={4} title="Deals by priority" sub="Pipeline value · live"><Breakdown parts={priority} format={short} label="Pipeline value by priority" /></Panel>
 <Panel span={4} title="Expected closings" sub="Open value by close week · live"><Columns items={closing} format={short} label="Open deal value by expected close week" height={180} /></Panel>
 <Panel span={4} title="Value by owner" sub="All deals · live">{owners.length ? <BarList items={owners} format={short} label="Deal value by owner" /> : <Empty text="No deals match" />}</Panel>
 <Panel span={4} title="Top clients" sub="Invoiced amount · live">{clients.length ? <BarList items={clients} format={short} label="Invoiced amount by client" /> : <Empty text="No invoices match" />}</Panel>
 </div></>;
}
function Contacts(ctx) {
  const { data, match, pageHead, setModal, exportCSV, remove, go } = ctx;
  const rows = data.contacts.filter(match);
  const accounts = [...new Set([...data.deals.map((d) => d.company), ...data.contacts.map((c) => c.company)])].map((name) => {
    const deals = data.deals.filter((d) => d.company === name);
    return { name, deals, people: data.contacts.filter((c) => c.company === name), open: total(deals.filter((d) => d.stage < 4)), won: total(deals.filter((d) => d.stage === 4)), stage: deals.length ? Math.max(...deals.map((d) => d.stage)) : -1, owner: deals[0]?.owner };
  }).sort((a, b) => b.open + b.won - a.open - a.won);
  const covered = accounts.filter((a) => a.people.length), missing = accounts.filter((a) => !a.people.length && a.deals.length), shown = accounts.filter((a) => match({ name: a.name, people: a.people.map((p) => p.name).join(" ") }));
  const stageTag = (s) => s < 0 ? <small>No deals yet</small> : <span className={"stage-tag stage-" + s}><i className="dot" />{stages[s]}</span>;
  return <>{pageHead("Everyone you work with, and how their accounts are doing.", <><Button icon="download" onClick={() => exportCSV(rows, "contacts")}>Export</Button><Button kind="primary" icon="plus" onClick={() => setModal({ type: "contact" })}>Add contact</Button></>)}<div className="stats"><StatCard tone="s1" icon="contact" value={data.contacts.length} label="Contacts" note={rows.length + " shown"} /><StatCard tone="s2" icon="briefcase" value={accounts.length} label="Accounts" note="Companies with deals or contacts" /><StatCard tone="s3" icon="people" value={covered.length + " / " + accounts.length} label="Accounts covered" note={plural(missing.length, "account") + " without a contact"} /><StatCard tone="s4" icon="target" value={short(total(covered, "open"))} label="Linked open pipeline" note="At accounts you have contacts in" onClick={() => go("Deals")} /></div><div className="contact-wrap"><div className="contact-grid">{rows.map((c, i) => {
    const a = accounts.find((x) => x.name === c.company);
    return <article className="panel contact-card" key={c.id}><div className="contact-edit"><Menu label={"Actions for " + c.name} items={[["Edit contact", "edit", () => setModal({ type: "contact", record: c })], ["Send email", "mail", () => location.href = "mailto:" + c.email], ["Delete", "trash", () => remove("contacts", c, "contact"), true]]} /></div><Avatar text={initials(c.name)} tone={i % 4} photo={photos[c.id]} /><h3>{c.name}</h3><p>{c.role}</p><Badge>{c.company}</Badge><a href={"mailto:" + c.email}>{c.email}</a><div className="contact-deals"><span><b>{a?.deals.length ? plural(a.deals.length, "deal") : "No deals"}</b><small>{short(a?.open || 0)} open · {short(a?.won || 0)} won</small></span>{stageTag(a ? a.stage : -1)}</div><Button onClick={() => setModal({ type: "contact", record: c })}>View contact</Button></article>;
  })}</div></div>{!rows.length && <Empty />}<div className="dash">
 <Panel span={8} title="Accounts" sub="Contacts, deals, and value per company · live"><div className="table-wrap"><table><thead><tr><th>Account</th><th>Contacts</th><th>Deals</th><th>Open value</th><th>Won</th><th>Furthest stage</th><th>Owner</th></tr></thead><tbody>{shown.map((a) => <tr key={a.name}><td><div className="cell-main"><span className={"company-icon tone-" + a.name.length % 4}>{a.name[0]}</span><b>{a.name}</b></div></td><td>{a.people.length ? <span className="avatar-stack">{a.people.map((p, n) => <Avatar key={p.id} text={initials(p.name)} tone={n % 4} small />)}</span> : <button className="text-btn link" onClick={() => setModal({ type: "contact", defaultCompany: a.name })}>+ Add</button>}</td><td>{a.deals.length}</td><td><strong>{money(a.open)}</strong></td><td>{money(a.won)}</td><td>{stageTag(a.stage)}</td><td>{a.owner ? <Avatar text={a.owner} tone={ownerTone(a.owner)} small /> : "—"}</td></tr>)}</tbody></table></div>{!shown.length && <Empty />}</Panel>
 <div className="stack span-4"><Panel title="Top accounts" sub="Open and won value · live"><BarList items={accounts.slice(0, 5).map((a) => ({ label: a.name, value: a.open + a.won, sub: plural(a.people.length, "contact") + " · " + plural(a.deals.length, "deal"), lead: <span className={"company-icon tone-" + a.name.length % 4}>{a.name[0]}</span> }))} format={short} label="Top accounts by deal value" /></Panel><Panel title="Missing contacts" sub="Accounts with deals but nobody to call">{missing.length ? <ul className="legend-list">{missing.map((a) => <li key={a.name}><span className={"company-icon tone-" + a.name.length % 4}>{a.name[0]}</span><span>{a.name}<small>{plural(a.deals.length, "deal")} · {short(a.open + a.won)}</small></span><Button kind="subtle" onClick={() => setModal({ type: "contact", defaultCompany: a.name })}>Add</Button></li>)}</ul> : <p>Every account has at least one contact.</p>}</Panel></div>
 </div></>;
}
function DealInsights(ctx) {
  const { deals, setModal } = ctx;
  const open = deals.filter((d) => d.stage < 4), soon = [...open].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  const mix = stages.map((label, i) => {
    const list = deals.filter((d) => d.stage === i);
    return { label, tone: "stage-" + i, value: total(list), sub: plural(list.length, "deal") };
  });
  return <div className="dash board-insights">
 <Panel span={8} title="Closing soon" sub="Open deals by expected close date"><div className="table-wrap"><table><thead><tr><th>Deal</th><th>Close date</th><th>Stage</th><th>Value</th><th>Weighted</th><th>Owner</th></tr></thead><tbody>{soon.map((d) => {
    const n = daysTo(d.date);
    return <tr key={d.id}><td><div className="cell-main"><span className={"company-icon tone-" + d.id % 4}>{d.company[0]}</span><span><button className="text-btn" onClick={() => setModal({ type: "deal", record: d })}>{d.title}</button><small>{d.company}</small></span></div></td><td><div className="cell-main"><span><b>{fmtDate(d.date)}</b><small className={n < 0 ? "late" : ""}>{dueLabel(n)}</small></span></div></td><td><span className={"stage-tag stage-" + d.stage}><i className="dot" />{stages[d.stage]}</span></td><td><strong>{money(d.value)}</strong></td><td>{money(d.value * chances[d.stage] / 100)}</td><td><Avatar text={d.owner} tone={ownerTone(d.owner)} small /></td></tr>;
  })}</tbody></table></div>{!soon.length && <Empty text="No open deals" />}</Panel>
 <Panel span={4} title="Pipeline mix" sub="Value by stage · live"><Breakdown parts={mix} format={short} label="Pipeline value by stage" /></Panel>
 </div>;
}
function Inbox(ctx) {
  const { data, match, pageHead, patch, update, setToast, setModal, active, setActive } = ctx;
  const [reply, setReply] = useState(""), [view, setView] = useState("All");
  const list = data.messages.filter(match).filter((m) => view === "All" || m.unread);
  const selected = data.messages.find((m) => m.id === active);
  const person = selected && data.contacts.find((c) => c.name === selected.name), related = person ? data.deals.filter((d) => d.company === person.company) : [];
  const unread = data.messages.filter((m) => m.unread).length, replied = data.messages.filter((m) => m.replies.length).length;
  return <>{pageHead("Demo inbox. Replies are saved locally in this browser.", <><Segmented label="Message filter" options={["All", "Unread"]} value={view} onChange={setView} /><Button onClick={() => {
    update("messages", data.messages.map((m) => ({ ...m, unread: false })));
    setToast("All messages marked as read");
  }}>Mark all as read</Button></>)}<div className="stats"><StatCard tone="s1" icon="message" value={data.messages.length} label="Conversations" note={list.length + " shown"} /><StatCard tone="s2" icon="mail" value={unread} label="Unread" note={unread ? "Waiting for you" : "All caught up"} /><StatCard tone="s3" icon="check" value={replied} label="Replied" note={pct(replied, data.messages.length) + "% response rate"} /><StatCard tone="s4" icon="contact" value={data.messages.filter((m) => data.contacts.some((c) => c.name === m.name)).length} label="From contacts" note="Linked to CRM records" /></div><div className="inbox panel"><div className="message-list">{list.map((m) => <button className={"message-preview " + (m.id === active ? "selected " : "") + (m.unread ? "unread" : "")} key={m.id} onClick={() => {
    setActive(m.id);
    patch("messages", m.id, { unread: false });
  }}><Avatar text={initials(m.name)} small /><span><strong>{m.name}{m.unread && <><i className="dot" aria-hidden="true" /><b className="sr-only">Unread</b></>}</strong><span>{m.subject}</span><small>{m.time}</small></span></button>)}{!list.length && <Empty text="Nothing here" />}</div>{selected ? <section className="message-detail"><Badge>DEMO CONVERSATION</Badge><h2>{selected.subject}</h2><div className="sender"><Avatar text={initials(selected.name)} small /><b>{selected.name}</b><small>to {data.settings.name}</small></div><p>{selected.text}</p>{selected.replies.map((r, i) => <div className="reply-bubble" key={i}><b>You · saved reply</b><p>{r}</p></div>)}<form className="reply-form" onSubmit={(e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    patch("messages", selected.id, { replies: [...selected.replies, reply.trim()], unread: false });
    setReply("");
    setToast("Demo reply saved locally");
  }}><label className="field"><span>Your reply</span><textarea required rows="4" placeholder="Write a thoughtful reply…" value={reply} onChange={(e) => setReply(e.target.value)} /></label><Button kind="primary" type="submit" icon="message">Save demo reply</Button></form></section> : <Empty text="No conversation selected" />}{selected && <aside className="inbox-aside"><div className="aside-card"><Avatar text={initials(selected.name)} tone={person ? data.contacts.indexOf(person) % 4 : 0} /><h3>{selected.name}</h3><p>{person ? person.role + " · " + person.company : "Not in your contacts"}</p><div className="actions">{person ? <><Button icon="mail" onClick={() => location.href = "mailto:" + person.email}>Email</Button><Button icon="contact" onClick={() => setModal({ type: "contact", record: person })}>Contact</Button></> : <Button icon="plus" onClick={() => setModal({ type: "contact" })}>Add contact</Button>}</div></div>{person && <><span className="eyebrow">RELATED DEALS</span>{related.length ? related.map((d) => <button className="mini-deal" key={d.id} onClick={() => setModal({ type: "deal", record: d })}><span><b>{d.title}</b><span className={"stage-tag stage-" + d.stage}><i className="dot" />{stages[d.stage]}</span></span><strong>{short(d.value)}</strong></button>) : <p>No deals with {person.company} yet.</p>}</>}<span className="eyebrow">CONVERSATION</span><ul className="info-list"><li><Icon name="clock" size={16} /><span>Received</span><b>{selected.time}</b></li><li><Icon name="message" size={16} /><span>Saved replies</span><b>{selected.replies.length}</b></li><li><Icon name="eye" size={16} /><span>Status</span><b>{selected.replies.length ? "Replied" : "Awaiting reply"}</b></li></ul></aside>}</div></>;
}
function Calendar(ctx) {
  const { data, match, pageHead, setModal } = ctx;
  const [month, setMonth] = useState(new Date(2026, 10, 1));
  const key = month.getFullYear() + "-" + String(month.getMonth() + 1).padStart(2, "0"), todayKey = localDay();
  const items = [...data.events.filter(match).map((e) => ({ id: "e" + e.id, kind: "event", date: e.date, time: e.time, title: e.title, open: () => setModal({ type: "event", record: e }) })), ...data.tasks.filter(match).map((t) => ({ id: "t" + t.id, kind: "task", date: t.date, title: t.title, done: t.done, open: () => setModal({ type: "task", record: t }) })), ...data.deals.filter(match).filter((d) => d.stage < 4).map((d) => ({ id: "d" + d.id, kind: "deal", date: d.date, title: d.title, stage: d.stage, value: d.value, open: () => setModal({ type: "deal", record: d }) }))].sort((a, b) => (a.date + (a.time || "99")).localeCompare(b.date + (b.time || "99")));
  const inMonth = items.filter((x) => x.date.startsWith(key)), count = (k) => inMonth.filter((x) => x.kind === k);
  const weeks = [...new Set(Array.from({ length: new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate() }, (_, i) => weekOf(key + "-" + String(i + 1).padStart(2, "0"))))];
  const tag = (x) => x.kind === "event" ? x.time : x.kind === "task" ? x.done ? "Done" : "Task" : "Closes · " + short(x.value);
  return <>{pageHead("Meetings, task due dates, and expected deal closings for the month.", <Button kind="primary" icon="plus" onClick={() => setModal({ type: "event" })}>New event</Button>)}<div className="dash">
 <section className="panel span-8"><div className="panel-head"><h3>{month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</h3><div className="legend"><span className="k-accent"><i />Event</span><span className="k-info"><i />Task</span><span className="k-muted"><i />Deal close</span></div><div className="actions"><Button aria-label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>←</Button><Button onClick={() => {
    const n = new Date();
    setMonth(new Date(n.getFullYear(), n.getMonth(), 1));
  }}>Today</Button><Button aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>→</Button></div></div><div className="calendar-grid">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <b className="weekday" key={d}>{d}</b>)}{Array.from({ length: (month.getDay() + 6) % 7 }, (_, i) => <div key={"blank" + i} className="calendar-day blank" />)}{Array.from({ length: new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate() }, (_, i) => {
    const date = key + "-" + String(i + 1).padStart(2, "0"), list = items.filter((x) => x.date === date), isToday = date === todayKey;
    return <div className={"calendar-day" + (isToday ? " today" : "") + (list.length ? " has-event" : "")} key={date} onClick={(e) => e.target === e.currentTarget && setModal({ type: "event", defaultDate: date })}><button className="day-number" aria-current={isToday ? "date" : void 0} aria-label={"Add event on " + fmtDate(date) + (isToday ? ", today" : "")} onClick={() => setModal({ type: "event", defaultDate: date })}>{i + 1}</button>{list.map((x) => <button className={"calendar-event " + x.kind + (x.done ? " done" : "") + (x.kind === "deal" ? " stage-" + x.stage : "")} key={x.id} onClick={x.open}><small>{tag(x)}</small>{x.title}</button>)}</div>;
  })}</div></section>
 <div className="stack span-4"><Panel title="Month at a glance" sub={month.toLocaleDateString("en-US", { month: "long" }) + " · live"}><Figures items={[["Events", count("event").length], ["Tasks due", count("task").length], ["Deals closing", count("deal").length], ["Closing value", short(total(count("deal")))]]} /><Columns items={weeks.map((w, i) => ({ label: "Wk " + (i + 1), value: inMonth.filter((x) => weekOf(x.date) === w).length }))} format={(v) => plural(v, "item")} label="Scheduled items per week" /></Panel><Panel title="Agenda" sub={inMonth.length ? plural(inMonth.length, "item") + " this month" : "Nothing scheduled"}><ul className="upcoming">{inMonth.slice(0, 8).map((x) => <li key={x.id}><button className={"agenda-item " + x.kind + (x.kind === "deal" ? " stage-" + x.stage : "")} onClick={x.open}><b>{fmtDate(x.date)}</b><i /><span>{x.title}<small>{tag(x)}</small></span></button></li>)}</ul>{inMonth.length > 8 && <p>+{inMonth.length - 8} more in the calendar</p>}</Panel></div>
 </div></>;
}
function Tasks(ctx) {
  const { data, match, pageHead, setModal, patch, remove } = ctx;
  const [filter, setFilter] = useState("All");
  const rows = data.tasks.filter(match).filter((t) => filter === "All" || (filter === "Completed" ? t.done : !t.done));
  const open = data.tasks.filter((t) => !t.done), late = open.filter((t) => daysTo(t.date) < 0), now = open.filter((t) => daysTo(t.date) === 0), done = data.tasks.length - open.length;
  const groups = [["Overdue", (t) => !t.done && daysTo(t.date) < 0], ["Today", (t) => !t.done && daysTo(t.date) === 0], ["Upcoming", (t) => !t.done && daysTo(t.date) > 0], ["Completed", (t) => t.done]];
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return { label: i ? d.toLocaleDateString("en-US", { weekday: "short" }) : "Today", value: open.filter((t) => t.date === localDay(d)).length };
  });
  const dealFor = (t) => data.deals.find((d) => t.title.toLowerCase().includes(d.company.toLowerCase()));
  const row = (t) => {
    const n = daysTo(t.date), deal = dealFor(t);
    return <div className={"task-row " + (t.done ? "done" : "")} key={t.id}><input aria-label={"Complete " + t.title} type="checkbox" checked={t.done} onChange={() => patch("tasks", t.id, { done: !t.done })} /><span><button className="text-btn" onClick={() => setModal({ type: "task", record: t })}>{t.title}</button><small>Due {fmtDate(t.date)}{!t.done && " · " + dueLabel(n)}{deal && <> · <button className="text-btn link" onClick={() => setModal({ type: "deal", record: deal })}>{deal.company}</button></>}</small></span><Badge tone={t.done ? "success" : n < 0 ? "high" : n === 0 ? "medium" : ""}>{t.done ? "Completed" : n < 0 ? "Overdue" : n === 0 ? "Today" : "To do"}</Badge><Menu label={"Actions for " + t.title} items={[["Edit task", "edit", () => setModal({ type: "task", record: t })], [t.done ? "Reopen task" : "Mark as done", "check", () => patch("tasks", t.id, { done: !t.done })], ["Delete", "trash", () => remove("tasks", t, "task"), true]]} /></div>;
  };
  return <>{pageHead("Plan your follow-ups and mark them done.", <Button kind="primary" icon="plus" onClick={() => setModal({ type: "task" })}>Add task</Button>)}<div className="stats"><StatCard tone="s1" icon="check" value={open.length} label="Open tasks" note={plural(now.length, "task") + " due today"} /><StatCard tone="s2" icon="alert" value={late.length} label="Overdue" note={late.length ? "Needs attention" : "Nothing late"} /><StatCard tone="s3" icon="calendar" value={total(week)} label="Due in 7 days" note="Open tasks" /><StatCard tone="s4" icon="trophy" value={pct(done, data.tasks.length) + "%"} label="Completed" note={done + " of " + data.tasks.length + " tasks"} /></div><div className="filter-bar"><Segmented label="Task status" options={["All", "Open", "Completed"]} value={filter} onChange={setFilter} /><span>{rows.length} shown</span></div><div className="dash">
 <Panel span={8} title="Task list" sub="Grouped by due date">{groups.map(([g, test]) => {
    const list = rows.filter(test);
    return list.length ? <div className="task-group" key={g}><span className="eyebrow">{g.toUpperCase()} · {list.length}</span>{list.map(row)}</div> : null;
  })}{!rows.length && <Empty text="Nothing on this list" />}</Panel>
 <div className="stack span-4"><Panel title="Progress" sub="All tasks in this workspace"><div className="ring-hero"><Ring value={pct(done, data.tasks.length)} size={120} stroke={12} label={pct(done, data.tasks.length) + "% of tasks completed"}>{pct(done, data.tasks.length)}%</Ring><ul className="legend-list"><li className="k-accent"><i /><span>Completed</span><b>{done}</b></li><li className="k-danger"><i /><span>Overdue</span><b>{late.length}</b></li><li className="k-muted"><i /><span>Still open</span><b>{open.length - late.length}</b></li></ul></div></Panel><Panel title="Next 7 days" sub="Open tasks by due date"><Columns items={week} label="Open tasks due per day" all /></Panel></div>
 </div></>;
}
function Invoices(ctx) {
  const { data, match, pageHead, setModal, exportCSV, log, setToast } = ctx;
  const [status, setStatus] = useState("All");
  const all = data.invoices.filter((i) => match(i, "INV-" + i.id)), rows = all.filter((i) => status === "All" || i.status === status);
  const by = (s) => all.filter((i) => i.status === s), billed = total(all, "amount"), unpaid = all.filter((i) => i.status !== "Paid");
  const parts = [["Paid", "k-success"], ["Pending", "k-warning"], ["Overdue", "k-danger"]].map(([label, tone]) => ({ label, tone, value: total(by(label), "amount"), sub: plural(by(label).length, "invoice") }));
  const aging = [["Not due", (n) => n >= 0], ["1–30 d", (n) => n < 0 && n >= -30], ["31–60 d", (n) => n < -30 && n >= -60], ["60+ d", (n) => n < -60]].map(([label, test], k) => ({ label, tone: k ? "k-danger" : "", value: total(unpaid.filter((i) => test(daysTo(i.date))), "amount") }));
  const clients = [...new Set(all.map((i) => i.company))].map((c) => ({ label: c, value: total(all.filter((i) => i.company === c), "amount"), sub: plural(all.filter((i) => i.company === c).length, "invoice"), lead: <span className={"company-icon tone-" + c.length % 4}>{c[0]}</span> })).sort((a, b) => b.value - a.value);
  return <>{pageHead("Track sample invoices, collections, and overdue balances.", <Button icon="download" onClick={() => exportCSV(rows, "invoices")}>Export invoices</Button>)}<div className="stats"><StatCard tone="s1" icon="file" value={short(billed)} label="Billed" note={plural(all.length, "invoice")} /><StatCard tone="s4" icon="check" value={short(parts[0].value)} label="Collected" note={pct(parts[0].value, billed) + "% of billed"} /><StatCard tone="s3" icon="clock" value={short(total(unpaid, "amount"))} label="Outstanding" note={plural(unpaid.length, "open invoice")} /><StatCard tone="s2" icon="alert" value={short(parts[2].value)} label="Overdue" note={plural(by("Overdue").length, "invoice")} /></div><div className="filter-bar"><Segmented label="Invoice status" options={["All", "Paid", "Pending", "Overdue"]} value={status} onChange={setStatus} /><span>{rows.length} shown</span></div><div className="dash">
 <div className="stack span-8"><Panel title="Invoices" sub="Click an invoice to view, print, or mark it paid"><div className="table-wrap"><table><thead><tr><th>Invoice</th><th>Company</th><th>Due date</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead><tbody>{rows.map((i) => {
    const n = daysTo(i.date);
    return <tr key={i.id}><td><button className="text-btn" onClick={() => setModal({ type: "invoice", record: i })}>INV-{i.id}</button></td><td><div className="cell-main"><span className={"company-icon tone-" + i.company.length % 4}>{i.company[0]}</span>{i.company}</div></td><td><div className="cell-main"><span><b>{fmtDate(i.date)}</b><small className={i.status !== "Paid" && n < 0 ? "late" : ""}>{i.status === "Paid" ? "Settled" : dueLabel(n)}</small></span></div></td><td><strong>{money(i.amount)}</strong></td><td><Badge tone={statusTone[i.status]}>{i.status}</Badge></td><td><div className="actions"><Button onClick={() => setModal({ type: "invoice", record: i })}>View</Button>{i.status !== "Paid" && <Button kind="subtle" icon="mail" onClick={() => {
      log("Payment reminder sent for INV-" + i.id, "invoice");
      setToast("Demo reminder logged for INV-" + i.id, { tone: "info" });
    }}>Remind</Button>}</div></td></tr>;
  })}</tbody></table></div>{!rows.length && <Empty />}</Panel><Panel title="Clients" sub="Invoiced amount per company"><BarList items={clients} format={money} label="Invoiced amount by client" /></Panel></div>
 <div className="stack span-4"><Panel title="Collection" sub="Billed amount by status"><div className="headline"><strong>{pct(parts[0].value, billed)}%</strong><span>collected<small>{short(parts[0].value)} of {short(billed)}</small></span></div><Breakdown parts={parts} format={money} label="Billed amount by status" /></Panel><Panel title="Aging" sub="Unpaid amount by days past due"><Columns items={aging} format={short} label="Unpaid amount by days past due" all /></Panel></div>
 </div></>;
}
function Products(ctx) {
  const { data, match, pageHead, setModal, exportCSV, patch, log, setToast } = ctx;
  const [cat, setCat] = useState("All");
  const rows = data.products.filter(match).filter((p) => cat === "All" || p.category === cat);
  const active = data.products.filter((p) => p.status === "Active"), maxStock = Math.max(1, ...data.products.map((p) => p.stock));
  const worth = (p) => p.price * p.stock, low = data.products.filter((p) => p.stock < 10 && p.status !== "Archived");
  const cats = ["Software", "Service", "Add-on"].map((label, i) => {
    const list = data.products.filter((p) => p.category === label);
    return { label, tone: "k-c" + (i + 1), value: list.reduce((a, p) => a + worth(p), 0), sub: plural(list.length, "product") };
  });
  const restock = (p) => {
    patch("products", p.id, { stock: p.stock + 50, status: "Active" });
    log("Restocked " + p.name + " (+50)", "record");
    setToast(p.name + " restocked with 50 units");
  };
  const icon = (p) => <span className={"company-icon tone-" + p.id % 4}>{p.name[0]}</span>;
  return <>{pageHead("Manage your catalog, prices, and stock levels.", <><Button icon="download" onClick={() => exportCSV(rows, "products")}>Export</Button><Button kind="primary" icon="plus" onClick={() => setModal({ type: "product" })}>Add product</Button></>)}<div className="stats"><StatCard tone="s1" icon="box" value={data.products.length} label="Products" note={plural(rows.length, "item") + " shown"} /><StatCard tone="s4" icon="check" value={active.length} label="Active listings" note={pct(active.length, data.products.length) + "% of catalog"} /><StatCard tone="s2" icon="alert" value={low.length} label="Low or out of stock" note="Under 10 units" /><StatCard tone="s3" icon="chart" value={short(active.reduce((a, p) => a + worth(p), 0))} label="Stock value" note="Active listings at list price" /></div><div className="filter-bar"><Segmented label="Category" options={["All", "Software", "Service", "Add-on"]} value={cat} onChange={setCat} /><span>{rows.length} items</span></div><div className="dash">
 <Panel span={8} title="Catalog" sub="Price, stock, and stock value per product"><div className="table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Stock value</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{rows.map((p) => <tr key={p.id}><td><div className="cell-main">{icon(p)}<span><button className="text-btn" onClick={() => setModal({ type: "product", record: p })}>{p.name}</button><small>{p.sku}</small></span></div></td><td>{p.category}</td><td><strong>{money(p.price)}</strong></td><td><div className={"chance meter" + (p.stock < 10 ? " low" : "")}><div className="progress"><span style={{ width: p.stock / maxStock * 100 + "%" }} /></div><b>{p.stock}</b></div></td><td>{money(worth(p))}</td><td><Badge tone={statusTone[p.status]}>{p.status}</Badge></td><td><Menu label={"Actions for " + p.name} items={[["Edit product", "edit", () => setModal({ type: "product", record: p })], ["Restock +50", "plus", () => restock(p)], ["Delete", "trash", () => ctx.remove("products", p, "product"), true]]} /></td></tr>)}</tbody></table></div>{!rows.length && <Empty />}</Panel>
 <div className="stack span-4"><Panel title="Catalog mix" sub="Stock value by category"><Breakdown parts={cats} format={short} label="Stock value by category" /></Panel><Panel title="Restock alerts" sub="Products under 10 units">{low.length ? <ul className="legend-list">{low.map((p) => <li key={p.id}>{icon(p)}<span>{p.name}<small>{p.stock ? p.stock + " left" : "Out of stock"} · {p.sku}</small></span><Button kind="subtle" icon="plus" onClick={() => restock(p)}>50</Button></li>)}</ul> : <p>Every product is well stocked.</p>}</Panel></div>
 <Panel span={6} title="Top products by stock value" sub="Price × units in stock"><BarList items={[...data.products].sort((a, b) => worth(b) - worth(a)).slice(0, 5).map((p) => ({ key: p.id, label: p.name, sub: p.stock + " × " + money(p.price), value: worth(p), lead: icon(p) }))} format={short} label="Stock value by product" /></Panel>
 <Panel span={6} title="Price points" sub="List price per product"><Columns items={[...data.products].sort((a, b) => a.price - b.price).map((p) => ({ label: p.sku, value: p.price }))} format={money} label="List price per product" height={200} /></Panel>
 </div></>;
}
function Orders(ctx) {
  const { data, match, pageHead, patch, setToast, exportCSV, log } = ctx;
  const [status, setStatus] = useState("All");
  const rows = data.orders.filter((o) => match(o, "#" + o.id)).filter((o) => status === "All" || o.status === status);
  const count = (s) => data.orders.filter((o) => o.status === s).length, valid = data.orders.filter((o) => o.status !== "Cancelled");
  const flow = [["Pending", "k-warning"], ["Processing", "k-soft"], ["Shipped", "k-accent"], ["Delivered", "k-success"], ["Cancelled", "k-danger"]].map(([label, tone]) => ({ label, tone, value: count(label), sub: money(total(data.orders.filter((o) => o.status === label), "total")) }));
  const pay = [...new Set(valid.map((o) => o.payment))].map((p) => ({ label: p, value: total(valid.filter((o) => o.payment === p), "total"), sub: plural(valid.filter((o) => o.payment === p).length, "order") })).sort((a, b) => b.value - a.value);
  const last = data.orders.map((o) => o.date).sort().pop() || localDay();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(last + "T12:00:00");
    d.setDate(d.getDate() - 6 + i);
    return { label: d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" }), value: total(valid.filter((o) => o.date === localDay(d)), "total") };
  });
  const customers = [...new Set(valid.map((o) => o.customer))].map((c) => ({ label: c, value: total(valid.filter((o) => o.customer === c), "total"), sub: plural(valid.filter((o) => o.customer === c).length, "order"), lead: <span className={"company-icon tone-" + c.length % 4}>{c[0]}</span> })).sort((a, b) => b.value - a.value).slice(0, 5);
  return <>{pageHead("Track fulfilment and update order status.", <Button icon="download" onClick={() => exportCSV(rows, "orders")}>Export orders</Button>)}<div className="stats"><StatCard tone="s1" icon="cart" value={data.orders.length} label="Total orders" note={plural(total(data.orders, "items"), "item") + " ordered"} /><StatCard tone="s3" icon="clock" value={count("Pending") + count("Processing")} label="Awaiting fulfilment" note={count("Pending") + " pending · " + count("Processing") + " processing"} /><StatCard tone="s4" icon="box" value={count("Shipped")} label="In transit" note={count("Delivered") + " delivered"} /><StatCard tone="s2" icon="chart" value={short(total(valid, "total"))} label="Order revenue" note={"Avg. " + money(valid.length ? total(valid, "total") / valid.length : 0) + " per order"} /></div><div className="filter-bar"><Segmented label="Order status" options={["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"]} value={status} onChange={setStatus} /><span>{rows.length} shown</span></div><div className="dash">
 <Panel span={8} title="Orders" sub="Change the status to move an order along"><div className="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead><tbody>{rows.map((o) => <tr key={o.id}><td><strong>#{o.id}</strong></td><td><div className="cell-main"><span className={"company-icon tone-" + o.customer.length % 4}>{o.customer[0]}</span>{o.customer}</div></td><td>{fmtDate(o.date)}</td><td>{o.items}</td><td><strong>{money(o.total)}</strong></td><td>{o.payment}</td><td><select className={"status-select " + (statusTone[o.status] || "")} aria-label={"Status for order " + o.id} value={o.status} onChange={(e) => {
    patch("orders", o.id, { status: e.target.value });
    log("Order #" + o.id + " set to " + e.target.value, "order");
    setToast("Order #" + o.id + " updated");
  }}>{["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => <option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table></div>{!rows.length && <Empty />}</Panel>
 <div className="stack span-4"><Panel title="Fulfilment" sub="Orders by status · live"><Breakdown parts={flow} format={(v) => plural(v, "order")} label="Orders by status" /></Panel></div>
 <Panel span={8} title="Daily revenue" sub={"Seven days to " + fmtDate(last) + " · cancelled orders excluded"}><Columns items={days} format={money} label="Order revenue per day" height={200} /></Panel>
 <div className="stack span-4"><Panel title="Payment methods" sub="Revenue by method"><BarList items={pay} format={money} label="Revenue by payment method" /></Panel><Panel title="Top customers" sub="Revenue by customer"><BarList items={customers} format={money} label="Revenue by customer" /></Panel></div>
 </div></>;
}
function Projects(ctx) {
  const { data, match, pageHead, setModal } = ctx;
  const [status, setStatus] = useState("All");
  const rows = data.projects.filter(match).filter((p) => status === "All" || p.status === status);
  const live = data.projects.filter((p) => p.status !== "Completed"), risk = data.projects.filter((p) => p.status === "At risk");
  const dates = [localDay(), ...data.projects.map((p) => p.due)].sort(), lo = new Date(dates[0] + "T12:00:00"), hi = new Date(dates[dates.length - 1] + "T12:00:00");
  lo.setDate(1);
  hi.setMonth(hi.getMonth() + 1, 1);
  const pos = (d) => (new Date(d + "T12:00:00") - lo) / (hi - lo) * 100, now = pos(localDay()), months = [];
  for (const d = new Date(lo); d < hi; d.setMonth(d.getMonth() + 1)) months.push(localDay(d));
  const status3 = [["On track", "k-success"], ["At risk", "k-danger"], ["Completed", "k-accent"]].map(([label, tone]) => ({ label, tone, value: data.projects.filter((p) => p.status === label).length }));
  const people = [...new Set(data.projects.flatMap((p) => p.members))].map((m) => ({ key: m, label: nameOf(data, m), value: data.projects.filter((p) => p.members.includes(m) && p.status !== "Completed").length, sub: plural(data.projects.filter((p) => p.members.includes(m)).length, "project") + " in total", lead: <Avatar text={m} tone={ownerTone(m)} small /> })).sort((a, b) => b.value - a.value);
  return <>{pageHead("Follow progress, deadlines, and owners across projects.", <Button kind="primary" icon="plus" onClick={() => setModal({ type: "project" })}>New project</Button>)}<div className="stats"><StatCard tone="s1" icon="layers" value={live.length} label="Active projects" note={plural(data.projects.length, "project") + " in total"} /><StatCard tone="s2" icon="alert" value={risk.length} label="At risk" note={risk.length ? risk.map((p) => p.name).join(", ") : "Nothing at risk"} /><StatCard tone="s4" icon="chart" value={Math.round(total(live, "progress") / (live.length || 1)) + "%"} label="Average progress" note="Across active projects" /><StatCard tone="s3" icon="calendar" value={live.filter((p) => daysTo(p.due) <= 30).length} label="Due in 30 days" note="Active projects" /></div><div className="filter-bar"><Segmented label="Project status" options={["All", "On track", "At risk", "Completed"]} value={status} onChange={setStatus} /><span>{data.projects.filter((p) => p.status === "Completed").length} of {data.projects.length} completed</span></div><div className="card-grid">{rows.map((p, i) => <article className="panel project-card" key={p.id}><div className="project-top"><span className={"company-icon tone-" + i % 4}>{p.name[0]}</span><Badge tone={statusTone[p.status]}>{p.status}</Badge><Menu label={"Actions for " + p.name} items={[["Edit project", "edit", () => setModal({ type: "project", record: p })], ["Delete", "trash", () => ctx.remove("projects", p, "project"), true]]} /></div><h3><button className="text-btn" onClick={() => setModal({ type: "project", record: p })}>{p.name}</button></h3><p>{p.client}</p><div className="progress-label"><span>Progress</span><b>{p.progress}%</b></div><div className="progress"><span style={{ width: p.progress + "%" }} /></div><div className="project-foot"><span><Icon name="calendar" size={13} /> {fmtDate(p.due)}{p.status !== "Completed" && " · " + dueLabel(daysTo(p.due))}</span><span className="avatar-stack">{p.members.map((m, n) => <Avatar key={m} text={m} tone={n % 4} small />)}</span></div></article>)}</div>{!rows.length && <Empty />}<div className="dash">
 <Panel span={8} title="Delivery timeline" sub="Time left until each due date · the line marks today" action={<div className="legend">{status3.map((s) => <span className={s.tone} key={s.label}><i />{s.label}</span>)}</div>}><div className="gantt"><div className="gantt-row gantt-scale"><span /><div className="gantt-track">{months.map((m) => <span key={m} style={{ left: pos(m) + "%" }}>{new Date(m + "T12:00:00").toLocaleDateString("en-US", { month: "short" })}</span>)}</div><span /></div>{rows.map((p) => {
    const a = Math.min(now, pos(p.due)), b = Math.max(now, pos(p.due)), tone = ringTone[p.status] || "k-accent";
    return <div className="gantt-row" key={p.id}><span className="gantt-label"><b>{p.name}</b><small>{p.client} · {p.progress}%</small></span><div className="gantt-track"><i className="gantt-today" style={{ left: now + "%" }} />{p.status !== "Completed" && <i className={"gantt-bar " + tone} style={{ left: a + "%", width: b - a + "%" }} />}<i className={"gantt-dot " + tone} style={{ left: pos(p.due) + "%" }} title={p.name + " due " + fmtDate(p.due)} /></div><small className={"gantt-due" + (p.status !== "Completed" && daysTo(p.due) < 0 ? " late" : "")}>{p.status === "Completed" ? "Done" : dueLabel(daysTo(p.due))}</small></div>;
  })}</div></Panel>
 <div className="stack span-4"><Panel title="Portfolio status" sub="Projects by status · live"><Breakdown parts={status3} format={(v) => plural(v, "project")} label="Projects by status" /></Panel><Panel title="Workload" sub="Active projects per member"><BarList items={people} format={(v) => v + " active"} label="Active projects per member" /></Panel></div>
 </div></>;
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
  const size = (xs) => xs.reduce((a, f) => a + parseSize(f.size), 0), used = size(data.files), biggest = [...data.files].sort((a, b) => parseSize(b.size) - parseSize(a.size))[0];
  const types = ["PDF", "Sheet", "Document", "Archive", "Image"].map((label, i) => ({ label, tone: ["k-c1", "k-c2", "k-c3", "k-c4", "k-muted"][i], value: size(data.files.filter((f) => f.type === label)), sub: plural(data.files.filter((f) => f.type === label).length, "file") })).filter((t) => t.value > 0);
  const owners = [...new Set(data.files.map((f) => f.owner))].map((o) => ({ key: o, label: nameOf(data, o), value: data.files.filter((f) => f.owner === o).length, sub: fmtSize(size(data.files.filter((f) => f.owner === o))), lead: <Avatar text={o} tone={ownerTone(o)} small /> })).sort((a, b) => b.value - a.value);
  return <>{pageHead("Demo file manager. Only file names and sizes are stored, never the file contents.", <><input ref={input} type="file" multiple hidden onChange={(e) => {
    const added = [...e.target.files].map((f, i) => ({ id: Date.now() + i, name: f.name, type: fileType(f.name), size: fmtSize(f.size), owner: initials(data.settings.name), date: today(), folder: "Uploads" }));
    if (!added.length) return;
    update("files", [...added, ...data.files]);
    log("Uploaded " + added.length + " file" + (added.length > 1 ? "s" : ""), "file");
    setToast(added.length + " file record" + (added.length > 1 ? "s" : "") + " added");
    e.target.value = "";
  }} /><Button kind="primary" icon="upload" onClick={() => input.current.click()}>Upload files</Button></>)}<div className="stats"><StatCard tone="s1" icon="folder" value={data.files.length} label="Files" note={plural(folders.length, "folder")} /><StatCard tone="s4" icon="layers" value={fmtSize(used)} label="Storage used" note={(used / 2e7).toFixed(2) + "% of 2 GB"} /><StatCard tone="s3" icon="upload" value={data.files.filter((f) => daysTo(f.date) > -30).length} label="Added in 30 days" note="By modified date" /><StatCard tone="s2" icon="file" value={biggest ? biggest.size : "—"} label="Largest file" note={biggest ? biggest.name : "No files"} /></div><div className="folder-grid"><button className={"panel folder-card " + (folder === "All files" ? "selected" : "")} onClick={() => setFolder("All files")}><Icon name="layers" size={22} /><b>All files</b><small>{data.files.length} files · {fmtSize(used)}</small></button>{folders.map((f) => <button key={f} className={"panel folder-card " + (folder === f ? "selected" : "")} onClick={() => setFolder(f)}><Icon name="folder" size={22} /><b>{f}</b><small>{data.files.filter((x) => x.folder === f).length} files · {fmtSize(size(data.files.filter((x) => x.folder === f)))}</small></button>)}</div><div className="dash">
 <Panel span={8} title={folder} sub={plural(rows.length, "item")}><div className="table-wrap"><table><thead><tr><th>Name</th><th>Type</th><th>Size</th><th>Owner</th><th>Modified</th><th></th></tr></thead><tbody>{rows.map((f) => <tr key={f.id}><td><div className="cell-main"><span className="file-icon">{f.type.slice(0, 3).toUpperCase()}</span><span><b>{f.name}</b><small>{f.folder}</small></span></div></td><td>{f.type}</td><td>{f.size}</td><td><Avatar text={f.owner} tone={ownerTone(f.owner)} small /></td><td>{fmtDate(f.date)}</td><td><button className="icon-btn" aria-label={"Delete " + f.name} onClick={() => confirmRemove(ctx, "files", f, "file")}><Icon name="trash" size={15} /></button></td></tr>)}</tbody></table></div>{!rows.length && <Empty text="This folder is empty" />}</Panel>
 <div className="stack span-4"><Panel title="Storage" sub={fmtSize(used) + " of 2 GB used"}><div className="progress big"><span style={{ width: Math.max(used / 2e9 * 100, 1.5) + "%" }} /></div><Breakdown parts={types} format={fmtSize} label="Storage by file type" /></Panel><Panel title="Contributors" sub="Files per owner"><BarList items={owners} format={(v) => plural(v, "file")} label="Files per owner" /></Panel></div>
 </div></>;
}
const permissions = [["View records", [1, 1, 1, 1, 1]], ["Create & edit records", [1, 1, 1, 1, 0]], ["Delete records", [1, 1, 0, 0, 0]], ["Manage invoices & billing", [1, 1, 0, 0, 0]], ["Invite team members", [1, 1, 0, 0, 0]], ["Workspace settings", [1, 0, 0, 0, 0]]];
const roles = ["Admin", "Manager", "Sales", "Support", "Viewer"];
function Team(ctx) {
  const { data, match, pageHead, setModal, patch, setToast, exportCSV } = ctx;
  const rows = data.team.filter(match), byStatus = (s) => data.team.filter((m) => m.status === s).length;
  const stat = (m) => {
    const id = initials(m.name), deals = data.deals.filter((d) => d.owner === id);
    return { id, deals, value: total(deals), projects: data.projects.filter((p) => p.members.includes(id)).length };
  };
  const top = Math.max(1, ...data.team.map((m) => stat(m).value));
  const months = (d) => Math.max(0, Math.round((new Date() - new Date(d + "T12:00:00")) / 2629e6));
  return <>{pageHead("Invite teammates and decide what each role can do.", <><Button icon="download" onClick={() => exportCSV(rows, "team")}>Export</Button><Button kind="primary" icon="plus" onClick={() => setModal({ type: "member" })}>Invite member</Button></>)}<div className="stats"><StatCard tone="s1" icon="people" value={data.team.length} label="Members" note={plural(rows.length, "member") + " shown"} /><StatCard tone="s4" icon="check" value={byStatus("Active")} label="Active" note={pct(byStatus("Active"), data.team.length) + "% of the team"} /><StatCard tone="s3" icon="mail" value={byStatus("Invited")} label="Pending invites" note="Waiting to join" /><StatCard tone="s2" icon="clock" value={Math.round(total(data.team.map((m) => ({ value: months(m.joined) }))) / (data.team.length || 1)) + " mo"} label="Average tenure" note="Since joining" /></div><div className="dash">
 <Panel span={8} title="Members" sub="Roles, ownership, and workload"><div className="table-wrap"><table><thead><tr><th>Member</th><th>Role</th><th>Status</th><th>Pipeline owned</th><th>Projects</th><th>Joined</th><th>Action</th></tr></thead><tbody>{rows.map((m, i) => {
    const s = stat(m);
    return <tr key={m.id}><td><div className="cell-main"><Avatar text={s.id} tone={i % 4} small /><span><b>{m.name}</b><small>{m.email}</small></span></div></td><td><select className="status-select" aria-label={"Role for " + m.name} value={m.role} onChange={(e) => {
      patch("team", m.id, { role: e.target.value });
      setToast(m.name + " is now " + e.target.value);
    }}>{roles.map((r) => <option key={r}>{r}</option>)}</select></td><td><Badge tone={statusTone[m.status]}>{m.status}</Badge></td><td><div className="chance meter"><div className="progress"><span style={{ width: s.value / top * 100 + "%" }} /></div><b>{s.value ? short(s.value) : "—"}</b></div></td><td>{s.projects}</td><td>{fmtDate(m.joined)}<small className="block">{months(m.joined)} months</small></td><td><Button onClick={() => setModal({ type: "member", record: m })}>Edit</Button></td></tr>;
  })}</tbody></table></div>{!rows.length && <Empty />}</Panel>
 <div className="stack span-4"><Panel title="Team status" sub="Members by status"><Breakdown parts={[["Active", "k-success"], ["Invited", "k-warning"], ["Inactive", "k-muted"]].map(([label, tone]) => ({ label, tone, value: byStatus(label) }))} format={(v) => plural(v, "member")} label="Members by status" /></Panel><Panel title="Roles" sub="Members per role"><BarList items={roles.map((r) => ({ label: r, value: data.team.filter((m) => m.role === r).length, sub: permissions.filter(([, v]) => v[roles.indexOf(r)]).length + " of " + permissions.length + " permissions" }))} format={(v) => plural(v, "member")} label="Members per role" /></Panel></div>
 <Panel span={12} title="Roles & permissions" sub="Reference matrix for this demo. Enforce permissions on your server."><div className="table-wrap"><table className="matrix"><thead><tr><th>Permission</th>{roles.map((r) => <th key={r}>{r}</th>)}</tr></thead><tbody>{permissions.map(([p, v]) => <tr key={p}><td>{p}</td>{v.map((x, n) => <td key={n}>{x ? <span className="tick" aria-label="Allowed">✓</span> : <span className="cross" aria-label="Not allowed">–</span>}</td>)}</tr>)}</tbody></table></div></Panel>
 </div></>;
}
const kindIcon = { deal: "briefcase", invoice: "file", team: "people", order: "cart", file: "folder", record: "edit", task: "check" };
function Activity(ctx) {
  const { data, match, pageHead, setModal, update, setToast } = ctx;
  const [kind, setKind] = useState("All");
  const rows = data.activity.filter(match).filter((a) => kind === "All" || a.kind === kind.toLowerCase());
  const days = [...new Set(rows.map((a) => a.time.slice(0, 10)))], kinds = [...new Set(data.activity.map((a) => a.kind))];
  const who = [...new Set(data.activity.map((a) => a.who))];
  return <>{pageHead("A timeline of actions taken in this demo workspace.", <Button kind="danger" icon="trash" onClick={() => setModal({ type: "confirm", confirmLabel: "Clear log", title: "Clear activity log?", description: "The timeline is emptied. Your records stay unchanged.", action: () => {
    update("activity", []);
    setToast("Activity log cleared");
  } })}>Clear log</Button>)}<div className="stats"><StatCard tone="s1" icon="activity" value={data.activity.length} label="Events logged" note="Capped at the latest 60" /><StatCard tone="s4" icon="calendar" value={new Set(data.activity.map((a) => a.time.slice(0, 10))).size} label="Active days" note={data.activity.length ? "Since " + fmtDate(data.activity[data.activity.length - 1].time.slice(0, 10)) : "No events yet"} /><StatCard tone="s3" icon="people" value={who.length} label="Contributors" note="People with logged actions" /><StatCard tone="s2" icon="briefcase" value={data.activity.filter((a) => a.kind === "deal").length} label="Deal updates" note="Moves, edits, and wins" /></div><div className="filter-bar"><Segmented label="Activity type" options={["All", "Deal", "Order", "Invoice", "Team", "File", "Record"]} value={kind} onChange={setKind} /><span>{rows.length} events</span></div><div className="dash">
 <Panel span={8} title="Timeline" sub="Newest first">{days.map((d) => <div className="timeline-day" key={d}><span className="eyebrow">{new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}</span><ol className="timeline">{rows.filter((a) => a.time.startsWith(d)).map((a) => <li key={a.id}><span className="timeline-icon"><Icon name={kindIcon[a.kind] || "activity"} size={15} /></span><span><b>{a.text}</b><small>{a.time.slice(11)} · by {nameOf(data, a.who)}</small></span></li>)}</ol></div>)}{!rows.length && <Empty text="No activity yet" />}</Panel>
 <div className="stack span-4"><Panel title="By type" sub="Events per category">{kinds.length ? <BarList items={kinds.map((k) => ({ label: k[0].toUpperCase() + k.slice(1), value: data.activity.filter((a) => a.kind === k).length, lead: <span className="timeline-icon"><Icon name={kindIcon[k] || "activity"} size={15} /></span> })).sort((a, b) => b.value - a.value)} format={(v) => plural(v, "event")} label="Events per type" /> : <p>No events yet.</p>}</Panel><Panel title="Contributors" sub="Events per person">{who.length ? <BarList items={who.map((w) => ({ key: w, label: nameOf(data, w), value: data.activity.filter((a) => a.who === w).length, lead: <Avatar text={w} tone={ownerTone(w)} small /> })).sort((a, b) => b.value - a.value)} format={(v) => plural(v, "event")} label="Events per person" /> : <p>No events yet.</p>}</Panel></div>
 <Panel span={12} title="Team engagement" sub="Calls, emails, and meetings per day · sample data"><Heatmap days={engagement} unit="touchpoints" /></Panel>
 </div></>;
}
function Profile(ctx) {
  const { data, pageHead, go, setModal } = ctx;
  const s = data.settings, me = initials(s.name), goal = 15e4;
  const mine = data.deals.filter((d) => d.owner === me), open = mine.filter((d) => d.stage < 4), won = total(mine.filter((d) => d.stage === 4)), forecast = open.reduce((a, d) => a + d.value * chances[d.stage] / 100, 0);
  const projects = data.projects.filter((p) => p.members.includes(me)), activity = data.activity.filter((a) => a.who === me).slice(0, 6);
  return <>{pageHead("How you appear to your team, and how your work is going.", <Button kind="primary" icon="edit" onClick={() => go("Settings")}>Edit profile</Button>)}<section className="panel profile-hero"><div className="profile-cover" /><div className="profile-main"><Avatar text={me} /><div><h2>{s.name}</h2><p>Admin · {s.workspace}</p></div><div className="actions"><Badge tone="success">Online</Badge><Badge>{s.plan || "Pro"} plan</Badge></div></div></section><div className="stats"><StatCard tone="s1" icon="briefcase" value={mine.length} label="Deals owned" note={short(total(open)) + " still open"} onClick={() => go("Deals")} /><StatCard tone="s3" icon="trophy" value={mine.filter((d) => d.stage === 4).length} label="Deals won" note={short(won) + " closed"} onClick={() => go("Deals")} /><StatCard tone="s4" icon="check" value={data.tasks.filter((t) => t.done).length + "/" + data.tasks.length} label="Tasks completed" note="Workspace tasks" onClick={() => go("Tasks")} /><StatCard tone="s2" icon="layers" value={projects.length} label="Projects" note={plural(projects.filter((p) => p.status !== "Completed").length, "active project")} onClick={() => go("Projects")} /></div><div className="dash">
 <Panel span={4} title="About" sub="Leads sales operations and keeps the pipeline healthy. Loves clear dashboards and calm, focused workdays."><ul className="info-list"><li><Icon name="mail" size={16} /><span>Email</span><a href={"mailto:" + s.email}>{s.email}</a></li><li><Icon name="user" size={16} /><span>Role</span><b>Admin</b></li><li><Icon name="grid" size={16} /><span>Workspace</span><b>{s.workspace}</b></li><li><Icon name="card" size={16} /><span>Plan</span><b>{s.plan || "Pro"}</b></li><li><Icon name="calendar" size={16} /><span>Member since</span><b>{new Date((data.team[0]?.joined || "2024-03-12") + "T12:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" })}</b></li></ul></Panel>
 <Panel span={4} title="My pipeline" sub="Your deals by stage · live">{stages.map((st, i) => {
    const list = mine.filter((d) => d.stage === i);
    return <div className={"stage-summary stage-" + i} key={st}><div><span><i className="dot" />{st}<small>{plural(list.length, "deal")}</small></span><b>{short(total(list))}</b></div><div className="progress"><span style={{ width: pct(total(list), total(mine)) + "%" }} /></div></div>;
  })}</Panel>
 <Panel span={4} title="Personal goal" sub={"Won value against a " + short(goal) + " sample target"}><div className="gauge-wrap"><Gauge value={won / goal} extra={forecast / goal} label={"Won " + short(won) + " of " + short(goal) + " plus " + short(forecast) + " forecast"} /><div className="gauge-value"><strong>{pct(won, goal)}%</strong><small>of goal reached</small></div></div><ul className="legend-list"><li className="k-accent"><i /><span>Won</span><b>{short(won)}</b></li><li className="k-soft"><i /><span>Weighted forecast</span><b>{short(forecast)}</b></li></ul></Panel>
 <Panel span={8} title="My deals" sub="Every deal you own" action={<Button kind="subtle" onClick={() => go("Deals")}>Pipeline →</Button>}><div className="table-wrap"><table><thead><tr><th>Deal</th><th>Value</th><th>Stage</th><th>Probability</th><th>Close date</th></tr></thead><tbody>{mine.map((d) => <tr key={d.id}><td><div className="cell-main"><span className={"company-icon tone-" + d.id % 4}>{d.company[0]}</span><span><button className="text-btn" onClick={() => setModal({ type: "deal", record: d })}>{d.title}</button><small>{d.company}</small></span></div></td><td><strong>{money(d.value)}</strong></td><td><span className={"stage-tag stage-" + d.stage}><i className="dot" />{stages[d.stage]}</span></td><td><div className={"chance stage-" + d.stage}><div className="progress"><span style={{ width: chances[d.stage] + "%" }} /></div><b>{chances[d.stage]}%</b></div></td><td>{d.stage === 4 ? "Closed" : fmtDate(d.date)}</td></tr>)}</tbody></table></div>{!mine.length && <Empty text="You don’t own any deals yet" />}</Panel>
 <Panel span={4} title="Recent activity" sub="Your latest actions" action={<Button kind="subtle" onClick={() => go("Activity")}>View all →</Button>}>{activity.length ? <ol className="timeline">{activity.map((a) => <li key={a.id}><span className="timeline-icon"><Icon name={kindIcon[a.kind] || "activity"} size={15} /></span><span><b>{a.text}</b><small>{fmtDate(a.time.slice(0, 10))} · {a.time.slice(11)}</small></span></li>)}</ol> : <Empty text="No activity yet" />}</Panel>
 <Panel span={8} title="My engagement" sub="Calls, emails, and meetings per day · sample data"><Heatmap days={engagement} unit="touchpoints" /></Panel>
 <Panel span={4} title="My projects" sub="Progress on projects you’re part of">{projects.length ? <div className="ring-list">{projects.map((p) => <button className="ring-card" key={p.id} onClick={() => setModal({ type: "project", record: p })}><Ring value={p.progress} size={52} stroke={5} tone={ringTone[p.status] || "k-accent"} label={p.progress + "% complete"}>{p.progress}%</Ring><span><b>{p.name}</b><small>{p.client} · due {fmtDate(p.due)}</small></span></button>)}</div> : <Empty text="No projects yet" />}</Panel>
 </div></>;
}
function Billing(ctx) {
  const { data, pageHead, update, setModal, setToast, log } = ctx;
  const current = data.settings.plan || "Pro";
  const plan = plans.find((p) => p.name === current) || plans[1];
  const usage = [["Deals", data.deals.length, current === "Starter" ? 50 : 500], ["Team seats", data.team.length, current === "Business" ? 50 : 10], ["Projects", data.projects.length, 25], ["Storage", Math.round(data.files.reduce((a, f) => a + parseSize(f.size), 0) / 1e6), 2048, " MB"]];
  const paid = receipts.reduce((a, r) => a + r.amount, 0);
  return <>{pageHead("Demo billing screen. No payment is processed.")}<div className="stats"><StatCard tone="s1" icon="card" value={plan.name} label="Current plan" note={plan.price ? money(plan.price) + " per month" : "Free forever"} /><StatCard tone="s3" icon="calendar" value="Dec 1" label="Next renewal" note={plan.price ? money(plan.price) + " will be charged" : "Nothing to pay"} /><StatCard tone="s4" icon="chart" value={money(paid)} label="Paid to date" note={plural(receipts.length, "receipt")} /><StatCard tone="s2" icon="target" value={money(plan.price * 12)} label="Annual estimate" note="At the current plan" /></div><div className="dash">
 <section className="panel span-8"><div className="panel-head"><div><span className="eyebrow">CURRENT PLAN</span><h2>{plan.name}</h2><p>{plan.price ? money(plan.price) + " per month · renews Dec 1, 2026" : "Free forever"}</p></div><Badge tone="success">Active</Badge></div><div className="usage-rings">{usage.map(([label, n, max, unit = ""]) => <div className="usage-ring" key={label}><Ring value={Math.min(pct(n, max), 100)} size={72} stroke={7} tone={n / max > 0.8 ? "k-danger" : "k-accent"} label={label + ": " + n + " of " + max + unit}>{Math.min(pct(n, max), 100)}%</Ring><span><b>{label}</b><small>{n}{unit} of {max}{unit}</small></span></div>)}</div><ul className="feature-list">{plan.features.map((f) => <li key={f}><Icon name="check" size={15} />{f}</li>)}</ul></section>
 <section className="panel span-4"><h3>Payment method</h3><p>Shown for layout only. Card details are never stored by this template.</p><div className="pay-card"><span>Mellow Card</span><b>•••• •••• •••• 0000</b><small>Expires 12/28 · {data.settings.name}</small></div><ul className="info-list"><li><Icon name="mail" size={16} /><span>Billing email</span><b>{data.settings.email}</b></li><li><Icon name="file" size={16} /><span>Invoices sent to</span><b>{data.settings.workspace}</b></li></ul><Button onClick={() => setToast("Connect a payment provider to update payment methods", { tone: "info" })}>Update payment method</Button></section>
 </div><div className="plan-grid">{plans.map((p) => <article className={"panel plan-card " + (p.name === current ? "current" : "")} key={p.name}><h3>{p.name}</h3><p>{p.note}</p><div className="plan-price"><strong>{p.price ? "$" + p.price : "Free"}</strong>{p.price ? <small>/month</small> : null}</div><ul>{p.features.map((f) => <li key={f}><Icon name="check" size={15} />{f}</li>)}</ul>{p.name === current ? <Button disabled>Current plan</Button> : <Button kind="primary" onClick={() => setModal({ type: "confirm", confirmLabel: "Switch to " + p.name, danger: false, title: "Switch to " + p.name + "?", description: "This demo only changes the plan label. No payment is made.", action: () => {
    update("settings", { ...data.settings, plan: p.name });
    log("Plan changed to " + p.name, "invoice");
    setToast("Plan switched to " + p.name);
  } })}>Choose {p.name}</Button>}</article>)}</div><div className="dash">
 <Panel span={8} title="Billing history" sub="Sample receipts"><div className="table-wrap"><table><thead><tr><th>Receipt</th><th>Date</th><th>Plan</th><th>Amount</th><th>Status</th></tr></thead><tbody>{receipts.map((r) => <tr key={r.id}><td><strong>{r.id}</strong></td><td>{fmtDate(r.date)}</td><td>{r.plan}</td><td>{money(r.amount)}</td><td><Badge tone="success">{r.status}</Badge></td></tr>)}</tbody></table></div></Panel>
 <Panel span={4} title="Spend" sub="Monthly charges · sample receipts"><Columns items={[...receipts].reverse().map((r) => ({ label: new Date(r.date + "T12:00:00").toLocaleDateString("en-US", { month: "short" }), value: r.amount }))} format={money} label="Monthly charges" all highlight={receipts.length - 1} height={160} /></Panel>
 </div></>;
}
function Settings(ctx) {
  const { data, update, pageHead, setModal, setToast, reset } = ctx;
  const s = data.settings, set = (values) => update("settings", { ...s, ...values });
  const keys = ["deals", "contacts", "tasks", "events", "invoices", "products", "orders", "projects", "files", "team", "messages", "activity"];
  const bytes = new Blob([JSON.stringify(data)]).size;
  const backup = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ ...data, schema: 1 }, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "mellow-backup.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1e3);
    setToast("Backup downloaded");
  };
  const toggles = [["digest", "Weekly digest email", "A Monday summary of pipeline and tasks"], ["dealAlerts", "Deal stage alerts", "When a deal moves or is won"], ["taskReminders", "Task reminders", "The morning a task is due"], ["mentions", "Mentions", "When someone mentions you in a note"]];
  return <>{pageHead("Profile, appearance, notifications, and demo data.")}<div className="dash">
 <form className="panel span-8" onSubmit={(e) => {
    e.preventDefault();
    set(Object.fromEntries(new FormData(e.currentTarget)));
    setToast("Profile updated");
  }}><div className="panel-head"><div><h3>Your profile</h3><p>Personalize the profile displayed in this demo.</p></div></div><div className="form-grid"><Field label="Full name" name="name" required maxLength="60" defaultValue={s.name} /><Field label="Email address" name="email" type="email" required defaultValue={s.email} /><Field label="Workspace name" name="workspace" required maxLength="50" defaultValue={s.workspace} /><Field label="Plan"><input value={s.plan || "Pro"} readOnly /></Field></div><Button kind="primary" type="submit">Save profile</Button></form>
 <section className="panel span-4 preview-card"><div className="preview-cover" /><Avatar text={initials(s.name)} /><h3>{s.name}</h3><p>{s.email}</p><div className="actions"><Badge>{s.workspace}</Badge><Badge tone="success">{s.plan || "Pro"}</Badge></div><ul className="info-list"><li><Icon name="sun" size={16} /><span>Theme</span><b>{s.dark ? "Dark" : "Light"}</b></li><li><Icon name="grid" size={16} /><span>Accent</span><b>{s.accent[0].toUpperCase() + s.accent.slice(1)}</b></li><li><Icon name="layers" size={16} /><span>Density</span><b>{s.compact ? "Compact" : "Comfortable"}</b></li></ul></section>
 <section className="panel span-6"><div className="panel-head"><div><h3>Appearance</h3><p>A softer space to do your best work.</p></div></div><div className="setting-row"><span>Accent color<small>Choose your favorite palette</small></span><div className="swatches">{["violet", "rose", "sage", "navy"].map((c) => <button key={c} className={"swatch " + c + (s.accent === c ? " selected" : "")} aria-label={c + " accent"} aria-pressed={s.accent === c} onClick={() => set({ accent: c })}>{s.accent === c ? "✓" : ""}</button>)}</div></div>{[["dark", "Dark appearance", "Easier on the eyes at night"], ["compact", "Compact cards", "Tighter deal cards on the board"]].map(([key, label, sub]) => <label className="setting-row" key={key}><span>{label}<small>{sub}</small></span><input className="switch" type="checkbox" checked={!!s[key]} onChange={(e) => set({ [key]: e.target.checked })} /></label>)}</section>
 <section className="panel span-6"><div className="panel-head"><div><h3>Notifications</h3><p>Saved in this browser. Connect an email service to deliver them.</p></div></div>{toggles.map(([key, label, sub]) => <label className="setting-row" key={key}><span>{label}<small>{sub}</small></span><input className="switch" type="checkbox" checked={!!s[key]} onChange={(e) => {
    set({ [key]: e.target.checked });
    setToast(label + (e.target.checked ? " on" : " off"));
  }} /></label>)}</section>
 <Panel span={6} title="Workspace data" sub={"Stored in this browser · " + (bytes / 1e3).toFixed(1) + " KB in localStorage"}><div className="count-grid">{keys.map((k) => <div key={k}><strong>{data[k].length}</strong><small>{k[0].toUpperCase() + k.slice(1)}</small></div>)}</div><div className="actions panel-actions"><Button icon="download" onClick={backup}>Download backup</Button><Button kind="danger" onClick={() => setModal({ type: "confirm", confirmLabel: "Reset data", title: "Reset demo data?", description: "All changes in this demo browser will be replaced with the original sample data.", action: reset })}>Reset demo data</Button></div></Panel>
 <Panel span={6} title="Keyboard shortcuts" sub="Work faster without the mouse"><ShortcutList /></Panel>
 </div></>;
}
function Help(ctx) {
  const { data, pageHead, query, go, setToast } = ctx;
  const q = query.toLowerCase();
  const items = faq.filter(([a, b]) => (a + b).toLowerCase().includes(q));
  let ok = true;
  try {
    localStorage.setItem("mellow-check", "1");
    localStorage.removeItem("mellow-check");
  } catch {
    ok = false;
  }
  return <>{pageHead("Answers to common questions, plus a way to reach support.")}<div className="card-grid">{[["grid", "Components", "Browse the UI kit", "Components"], ["settings", "Settings", "Theme, accent, and profile", "Settings"], ["lock", "Pages", "Sign in, errors, and more", "Pages"], ["chart", "Reports", "Pipeline and revenue analytics", "Reports"]].map(([icon, title, sub, to], i) => <button className={"panel quick-link s" + (i + 1)} key={title} onClick={() => go(to)}><span className="stat-icon"><Icon name={icon} size={22} /></span><span><b>{title}</b><small>{sub}</small></span></button>)}</div><div className="dash">
 <Panel span={8} title="Frequently asked questions" sub={items.length + " of " + faq.length + " answers" + (q ? " match your search" : "")}><div className="faq">{items.map(([a, b], i) => <details key={a} open={i === 0}><summary>{a}</summary><p>{b}</p></details>)}</div>{!items.length && <Empty text="No matching answers" />}</Panel>
 <form className="panel span-4" onSubmit={(e) => {
    e.preventDefault();
    e.currentTarget.reset();
    setToast("Demo only: connect a helpdesk to send messages", { tone: "info" });
  }}><div className="panel-head"><div><h3>Contact support</h3><p>This form does not send anything. Wire it to your helpdesk.</p></div></div><label className="field"><span>Subject</span><input required maxLength="100" placeholder="What do you need help with?" /></label><label className="field"><span>Topic</span><select defaultValue="General"><option>General</option><option>Billing</option><option>Technical issue</option><option>Feature request</option></select></label><label className="field"><span>Message</span><textarea required rows="4" placeholder="Tell us a little more…" /></label><Button kind="primary" type="submit" icon="message">Send message</Button></form>
 <Panel span={6} title="Keyboard shortcuts" sub="Available on every page"><ShortcutList /></Panel>
 <Panel span={6} title="Workspace status" sub="Checked in this browser just now"><ul className="info-list"><li><Icon name={ok ? "check" : "alert"} size={16} /><span>Browser storage</span><Badge tone={ok ? "success" : "high"}>{ok ? "Available" : "Unavailable"}</Badge></li><li><Icon name="layers" size={16} /><span>Records saved</span><b>{["deals", "contacts", "tasks", "events", "invoices", "products", "orders", "projects", "files", "team"].reduce((a, k) => a + data[k].length, 0)}</b></li><li><Icon name="activity" size={16} /><span>Activity entries</span><b>{data.activity.length} of 60</b></li><li><Icon name="sun" size={16} /><span>Theme</span><b>{data.settings.dark ? "Dark" : "Light"} · {data.settings.accent}</b></li><li><Icon name="info" size={16} /><span>Version</span><b>Clay & Glass 1.1</b></li></ul></Panel>
 </div></>;
}
function Components(ctx) {
  const { pageHead, setToast, setModal, kpis } = ctx;
  const [seg, setSeg] = useState("Week"), [on, setOn] = useState(true);
  const months = revenue.months.slice(-6);
  return <>{pageHead("Reusable UI pieces and chart components for your next admin application.")}<div className="dash">
 <Panel span={4} title="Buttons & actions"><div className="component-row"><Button kind="primary" icon="plus" onClick={() => setToast("Primary button clicked")}>Primary</Button><Button onClick={() => setToast("Secondary button clicked")}>Secondary</Button><Button kind="subtle" onClick={() => setToast("Subtle button clicked")}>Subtle →</Button><Button kind="danger" icon="trash" onClick={() => setToast("Danger button clicked", { tone: "error" })}>Danger</Button><Button disabled>Disabled</Button></div><div className="component-row"><Menu label="Example actions" items={[["Edit", "edit", () => setToast("Edit chosen")], ["Duplicate", "layers", () => setToast("Duplicate chosen")], ["Delete", "trash", () => setToast("Delete chosen", { tone: "error" }), true]]} /><small>Action menu with keyboard support</small></div></Panel>
 <Panel span={4} title="Badges & status"><div className="component-row"><Badge tone="success">Success</Badge><Badge tone="medium">Pending</Badge><Badge tone="high">Urgent</Badge><Badge tone="low">Information</Badge><Badge>Neutral</Badge></div><div className="component-row"><Delta value={12} note="versus last week" /><Delta value={-4} note="versus last week" />{stages.map((s, i) => <span key={s} className={"stage-tag stage-" + i}><i className="dot" />{s}</span>)}</div></Panel>
 <Panel span={4} title="Avatars & tones"><div className="component-row">{["MT", "AB", "JK", "LW"].map((s, i) => <Avatar key={s} text={s} tone={i} />)}</div><div className="component-row"><span className="avatar-stack">{["MT", "AB", "JK", "LW"].map((s, i) => <Avatar key={s} text={s} tone={i} small />)}</span>{[0, 1, 2, 3].map((i) => <span key={i} className={"company-icon tone-" + i}>{"ABCD"[i]}</span>)}</div></Panel>
 <Panel span={6} title="Form controls"><div className="form-grid"><Field label="Example input" placeholder="A fresh idea…" /><Field label="Select input"><select defaultValue="Proposal"><option>New</option><option>Proposal</option><option>Won</option></select></Field></div><div className="setting-row"><span>Switch<small>Native checkbox, styled</small></span><input className="switch" type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} /></div><div className="component-row"><Segmented label="Example period" options={["Day", "Week", "Month"]} value={seg} onChange={setSeg} /><Button onClick={() => setModal({ type: "example" })}>Open modal</Button><Button onClick={() => setToast("Everything looks good. Changes saved.")}>Show toast</Button></div></Panel>
 <Panel span={6} title="Progress & meters"><div className="usage-rings"><div className="usage-ring"><Ring value={72} size={64} label="72% complete">72%</Ring><span><b>Ring</b><small>Accent</small></span></div><div className="usage-ring"><Ring value={91} size={64} tone="k-success" label="91% complete">91%</Ring><span><b>Ring</b><small>Success</small></span></div><div className="usage-ring"><Ring value={38} size={64} tone="k-danger" label="38% complete">38%</Ring><span><b>Ring</b><small>Danger</small></span></div></div>{[["Stage progress", 55, 2], ["Upload", 82, 3]].map(([l, v, s]) => <div className={"usage-row stage-" + s} key={l}><div><span>{l}</span><b>{v}%</b></div><div className="progress"><span style={{ width: v + "%" }} /></div></div>)}<div className="usage-row"><div><span>Segmented bar</span><b>3 parts</b></div><SegmentBar parts={[{ label: "Paid", value: 6, tone: "k-success" }, { label: "Pending", value: 3, tone: "k-warning" }, { label: "Overdue", value: 1, tone: "k-danger" }]} label="Paid 6, pending 3, overdue 1" /></div></Panel>
 </div>{kpis(true)}<div className="dash">
 <Panel span={8} title="TrendChart" sub="Multi-series line and area with crosshair tooltip"><TrendChart label="Sample revenue and target" labels={months} series={[{ label: "Target", values: revenue.target.slice(-6), tone: "k-muted" }, { label: "Revenue", values: revenue.actual.slice(-6), tone: "k-accent", area: true }]} height={240} /></Panel>
 <Panel span={4} title="Gauge" sub="Meter with a forecast arc"><div className="gauge-wrap"><Gauge value={0.4} extra={0.5} label="40% reached, 90% projected" /><div className="gauge-value"><strong>40%</strong><small>of goal reached</small></div></div><div className="legend"><span className="k-accent"><i />Reached</span><span className="k-soft"><i />Forecast</span></div></Panel>
 <Panel span={6} title="RevenueChart" sub="Vertical bars with hover values"><RevenueChart months={months} values={revenue.actual.slice(-6)} /></Panel>
 <Panel span={6} title="Columns & BarList" sub="Small multiples for counts and rankings"><Columns items={["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => ({ label: d, value: [8, 12, 9, 14, 6][i] }))} label="Sample daily counts" height={110} /><BarList items={[["Globex", 75e3], ["Acme Corp", 48e3], ["Northwind", 32e3]].map(([label, value]) => ({ label, value }))} format={short} label="Sample ranking" /></Panel>
 <Panel span={4} title="Breakdown" sub="Segmented bar with a legend"><Breakdown parts={[{ label: "Software", value: 14e3, tone: "k-c1" }, { label: "Service", value: 21e3, tone: "k-c2" }, { label: "Add-on", value: 1e3, tone: "k-c3" }]} format={short} label="Sample split" /></Panel>
 <Panel span={8} title="Heatmap" sub="Day × week grid with weekday averages"><Heatmap days={engagement} unit="touchpoints" /></Panel>
 <Panel span={4} title="Timeline"><ol className="timeline">{[["briefcase", "Deal moved to Won", "09:12"], ["file", "Invoice marked as paid", "08:40"], ["people", "Teammate invited", "Yesterday"]].map(([i, t, s]) => <li key={t}><span className="timeline-icon"><Icon name={i} size={15} /></span><span><b>{t}</b><small>{s}</small></span></li>)}</ol></Panel>
 <Panel span={4} title="Sparkline" sub="Inline trend for compact cards"><div className="spark-demo"><Sparkline values={[4, 6, 5, 8, 7, 9, 11, 13]} /></div><div className="spark-demo k-danger"><Sparkline values={[12, 11, 12, 9, 10, 8, 8, 7]} /></div></Panel>
 <Panel span={4} title="Empty state"><Empty text="Nothing here yet">Use empty states to explain what will appear and how to add it.</Empty></Panel>
 </div></>;
}
function Pages(ctx) {
  const { pageHead, go } = ctx;
  return <>{pageHead("Full-page layouts for authentication, errors, and maintenance. They open outside the dashboard shell.")}<div className="card-grid">{screens.map(([name, icon, sub]) => <article className="panel screen-card" key={name}><div className="screen-thumb"><div className="mock">{/^Error/.test(name) ? <strong>{name.slice(-3)}</strong> : <><span className="stat-icon"><Icon name={icon} size={20} /></span><i /><i />{name !== "Maintenance" && <i className="mock-btn" />}</>}</div></div><h3>{name}</h3><p>{sub}</p><Button onClick={() => go(name)}>Open page <Icon name="arrow" size={13} /></Button></article>)}</div></>;
}
const screens = [["Sign in", "lock", "Login form with remember me and social-style options"], ["Sign up", "user", "Registration form with terms checkbox"], ["Forgot password", "mail", "Request a password reset link"], ["Lock screen", "lock", "Re-enter password after inactivity"], ["Error 404", "search", "Page not found"], ["Error 500", "alert", "Server error"], ["Maintenance", "settings", "Scheduled downtime notice"]];
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
  Calendar,
  Components,
  Contacts,
  Dashboard,
  DealInsights,
  Files,
  Help,
  Inbox,
  Invoices,
  Orders,
  Pages,
  Products,
  Profile,
  Projects,
  Reports,
  Screen,
  Settings,
  Tasks,
  Team,
  screens
};
