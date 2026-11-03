import React, { useState, useEffect, useLayoutEffect, useRef, useId } from "react";
import { fmtDate, initials, stages, money, short } from "./data";
import { Icon, Button, Avatar, Badge, Empty, Field, Ring, Breakdown, StatCard } from "./components";
import { Panel, Segmented, Password, Strength, rules, Submit, plural, fmtSize, fileType, localDay, copy } from "./pages";
const shift = (n) => {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() + n);
  return localDay(d);
};
const listText = (xs) => xs.length < 2 ? xs.join("") : xs.slice(0, -1).join(", ") + " and " + xs[xs.length - 1];
const digits = (s) => s.replace(/\D/g, "");
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const keep = (e) => e.preventDefault();
const Hint = ({ id, tone = "", children }) => <small id={id} className={"hint" + (tone ? " " + tone : "")}>{tone && <Icon name={{ error: "alert", success: "tick", warning: "info" }[tone]} size={13} />}{children}</small>;
const F = ({ label, full, children, ...props }) => <label className={"field" + (full ? " full" : "")}><span>{label}</span>{children || <input {...props} />}</label>;
const Group = ({ label, id, hint, children }) => <div className="field"><label htmlFor={id}>{label}</label><div className="input-group">{children}</div>{hint}</div>;
function roam(e) {
  if (e.key !== "ArrowLeft" && e.key !== "ArrowRight" || e.target.tagName === "SELECT") return;
  const all = [...e.currentTarget.querySelectorAll("button, select")], i = all.indexOf(e.target);
  if (i < 0) return;
  e.preventDefault();
  all[(i + (e.key === "ArrowRight" ? 1 : all.length - 1)) % all.length].focus();
}
function RangeField({ label, value, onChange, min = 0, max = 100, step = 1, format = (v) => v, scale }) {
  const id = useId();
  return <div className="range-field"><div className="range-head"><label htmlFor={id}>{label}</label><output htmlFor={id}>{format(value)}</output></div><input id={id} className="range" type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ "--p": (value - min) / (max - min) }} aria-valuetext={format(value)} />{scale && <div className="range-scale" aria-hidden="true">{scale.map((s) => <span key={s}>{s}</span>)}</div>}</div>;
}
const countries = [["Asia", ["Indonesia", "Japan", "Malaysia", "Singapore"]], ["Europe", ["Germany", "Netherlands", "United Kingdom"]], ["Americas", ["Brazil", "Canada", "United States"]]];
const interests = ["Analytics", "Automation", "Design", "Integrations", "Mobile", "Security"];
const notifyKinds = ["New deals assigned to me", "Task reminders", "Weekly digest"];
const codes = [["ID", "+62"], ["US", "+1"], ["GB", "+44"], ["SG", "+65"], ["DE", "+49"]];
function Elements(ctx) {
  const { data, pageHead, setToast } = ctx, id = useId(), parent = useRef();
  const [bio, setBio] = useState("Sales lead who likes a tidy pipeline and a good spreadsheet."), [budget, setBudget] = useState(60), [chance, setChance] = useState(55), [color, setColor] = useState("#9377cf"), [checks, setChecks] = useState([true, false, true]), [contact, setContact] = useState("Email"), [plan, setPlan] = useState("Pro"), [digest, setDigest] = useState("Weekly"), [sw, setSw] = useState({ email: true, twofa: false, public: true });
  const all = checks.every(Boolean), some = checks.some(Boolean);
  useEffect(() => {
    parent.current.indeterminate = some && !all;
  }, [some, all]);
  const link = "https://mellow.studio/join/7Q4KD2";
  return <>{pageHead("Native inputs in the Mellow style. Every control has a visible label and works with the keyboard.")}<div className="dash">
 <Panel span={6} title="Text inputs" sub="Label on top, help text below"><div className="form-grid"><Field label="Full name" placeholder="Your name" autoComplete="name" /><Field label="Email address"><input type="email" placeholder="you@example.com" autoComplete="email" aria-describedby={id + "-email"} /><Hint id={id + "-email"}>Used for sign-in only.</Hint></Field><Password required={false} autoComplete="new-password" /><Field label="Phone" type="tel" placeholder="+1 555 010 2030" autoComplete="tel" /><Field label="Website" type="url" placeholder="https://example.com" /><Field label="Seats" type="number" min="1" max="99" defaultValue="5" /></div></Panel>
 <Panel span={6} title="Select, list & textarea" sub="Grouped options, suggestions, and a live counter"><div className="form-grid"><Field label="Country"><select defaultValue="Indonesia">{countries.map(([g, xs]) => <optgroup key={g} label={g}>{xs.map((c) => <option key={c}>{c}</option>)}</optgroup>)}</select></Field><Field label="Account owner"><input list={id + "-team"} placeholder="Type a teammate’s name" aria-describedby={id + "-owner"} /><datalist id={id + "-team"}>{data.team.map((m) => <option key={m.id} value={m.name} />)}</datalist><Hint id={id + "-owner"}>Suggestions come from Team.</Hint></Field><Field label="Interests"><select multiple size="4" defaultValue={["Analytics", "Design"]} aria-describedby={id + "-multi"}>{interests.map((x) => <option key={x}>{x}</option>)}</select><Hint id={id + "-multi"}>Hold Ctrl or ⌘ to pick several.</Hint></Field><Field label="Short bio"><textarea rows="4" maxLength="160" value={bio} onChange={(e) => setBio(e.target.value)} aria-describedby={id + "-bio"} /><Hint id={id + "-bio"}>Shown on your profile card<span className="counter">{bio.length}/160</span></Hint></Field></div></Panel>
 <Panel span={4} title="Checkboxes" sub="Including a mixed “select all” state"><div className="choice-list"><label className="check strong"><input ref={parent} type="checkbox" checked={all} onChange={() => setChecks(checks.map(() => !all))} />All notifications<small>{checks.filter(Boolean).length} of {checks.length}</small></label>{notifyKinds.map((t, i) => <label className="check sub" key={t}><input type="checkbox" checked={checks[i]} onChange={() => setChecks(checks.map((c, j) => j === i ? !c : c))} />{t}</label>)}<label className="check sub"><input type="checkbox" defaultChecked disabled />Security alerts<Badge>Required</Badge></label></div></Panel>
 <Panel span={4} title="Radio buttons" sub="A plain group and selectable cards"><fieldset className="choice-list inline"><legend>Preferred contact</legend>{["Email", "Phone", "Chat"].map((c) => <label className="check" key={c}><input type="radio" name={id + "-contact"} checked={contact === c} onChange={() => setContact(c)} />{c}</label>)}</fieldset><fieldset className="plan-pick"><legend>Plan</legend>{[["Starter", 19], ["Pro", 49], ["Team", 99]].map(([p, price]) => <label key={p} className={plan === p ? "selected" : ""}><input type="radio" name={id + "-plan"} checked={plan === p} onChange={() => setPlan(p)} /><b>{p}</b><small>${price}/mo</small></label>)}</fieldset><fieldset className="choice-list described"><legend>Digest email</legend>{[["Daily", "Every morning at 8 AM"], ["Weekly", "Monday morning"], ["Off", "Only urgent alerts"]].map(([t, s]) => <label className="check" key={t}><input type="radio" name={id + "-digest"} checked={digest === t} onChange={() => setDigest(t)} /><span>{t}<small>{s}</small></span></label>)}</fieldset></Panel>
 <Panel span={4} title="Switches" sub="For settings that apply right away">{[["email", "Email notifications", "A summary every morning"], ["twofa", "Two-step sign-in", "Ask for a code on new devices"], ["public", "Public profile", "Visible to the whole workspace"]].map(([k, l, s]) => <label className="setting-row" key={k}><span>{l}<small>{s}</small></span><input className="switch" type="checkbox" checked={sw[k]} onChange={(e) => setSw({ ...sw, [k]: e.target.checked })} /></label>)}<label className="setting-row"><span>Beta features<small>Managed by your admin</small></span><input className="switch" type="checkbox" disabled /></label></Panel>
 <Panel span={4} title="Range & color" sub="Sliders and a color well with live values"><RangeField label="Monthly budget" value={budget} onChange={setBudget} step={5} format={(v) => "$" + v + "K"} scale={["$0", "$50K", "$100K"]} /><RangeField label="Win probability" value={chance} onChange={setChance} step={5} format={(v) => v + "%"} scale={["0", "25", "50", "75", "100"]} /><Field label="Brand color"><span className="color-field"><input type="color" value={color} onChange={(e) => setColor(e.target.value)} /><code>{color.toUpperCase()}</code></span></Field></Panel>
 <Panel span={4} title="Date & time" sub="Native pickers, no library needed"><div className="form-stack"><Field label="Start date" type="date" defaultValue="2026-11-10" /><Field label="Meeting time" type="time" defaultValue="09:30" /><Field label="Reminder" type="datetime-local" defaultValue="2026-11-09T16:00" /><Field label="Billing month" type="month" defaultValue="2026-12" /><Field label="Sprint week" type="week" defaultValue="2026-W46" /></div></Panel>
 <Panel span={4} title="Sizes & shapes" sub="Small for dense tables, large for hero forms"><div className="form-stack"><Field label="Small"><input className="input-sm" placeholder="Filter rows" /></Field><Field label="Default"><input placeholder="Regular input" /></Field><Field label="Large"><input className="input-lg" placeholder="Search the workspace" /></Field><Field label="Pill with icon"><span className="input-wrap"><Icon name="search" size={16} /><input className="input-pill" type="search" placeholder="Search everything" /></span></Field></div></Panel>
 <Panel span={6} title="Input groups" sub="Add-ons, icons, and buttons attached to a field"><div className="form-grid"><Group label="Workspace URL" id={id + "-url"}><span className="addon">https://</span><input id={id + "-url"} defaultValue="mellow" /><span className="addon">.studio</span></Group><Group label="Deal value" id={id + "-value"}><span className="addon">$</span><input id={id + "-value"} type="number" min="0" step="100" defaultValue="12500" /><span className="addon">USD</span></Group><Group label="Phone number" id={id + "-tel"}><select aria-label="Country code" defaultValue="+62">{codes.map(([c, n]) => <option key={c} value={n}>{c} {n}</option>)}</select><input id={id + "-tel"} type="tel" placeholder="812 3456 7890" autoComplete="tel-national" /></Group><Group label="Email alias" id={id + "-alias"}><input id={id + "-alias"} defaultValue="sales" /><span className="addon">@mellow.studio</span></Group><Group label="Find a contact" id={id + "-find"}><span className="addon"><Icon name="search" size={16} /></span><input id={id + "-find"} type="search" placeholder="Name" /><Button type="button" kind="primary" onClick={() => setToast("Demo search: nothing was queried", { tone: "info" })}>Search</Button></Group><Group label="Invite link" id={id + "-link"}><input id={id + "-link"} readOnly value={link} /><Button type="button" icon="copy" onClick={() => copy(link, setToast, "Invite link copied")}>Copy</Button></Group></div></Panel>
 <Panel span={6} title="States" sub="Focus, disabled, read-only, valid, and invalid"><div className="form-grid"><Field label="Focused"><input className="is-focus" defaultValue="Typing here" /></Field><Field label="Disabled"><input disabled defaultValue="Not editable" /></Field><Field label="Read-only"><input readOnly defaultValue="INV-1042" /></Field><Field label="Placeholder"><input placeholder="Optional" /></Field><Field label="Valid"><input className="valid" defaultValue="cut.rahma@example.com" aria-describedby={id + "-ok"} /><Hint id={id + "-ok"} tone="success">Looks good</Hint></Field><Field label="Invalid"><input aria-invalid="true" defaultValue="cut.rahma@" aria-describedby={id + "-bad"} /><Hint id={id + "-bad"} tone="error">Enter a full email address</Hint></Field></div></Panel>
 </div></>;
}
const tagIdeas = ["Renewal", "Upsell", "Partner", "Urgent", "Pilot"];
function Tags() {
  const id = useId(), input = useRef(), max = 8;
  const [tags, setTags] = useState(["Enterprise", "Q4", "Design"]), [text, setText] = useState(""), [note, setNote] = useState("");
  const add = (list) => {
    const next = [...tags];
    let msg = "";
    for (const raw of list) {
      const t = raw.trim().slice(0, 24);
      if (!t) continue;
      if (next.some((x) => x.toLowerCase() === t.toLowerCase())) msg = "“" + t + "” is already added";
      else if (next.length >= max) msg = "You can add up to " + max + " tags";
      else next.push(t);
    }
    setTags(next);
    setNote(msg);
  };
  const drop = (t) => {
    setTags(tags.filter((x) => x !== t));
    setNote("");
    input.current.focus();
  };
  return <><div className="field"><label htmlFor={id}>Deal tags</label><div className="tag-input" onClick={(e) => e.target === e.currentTarget && input.current.focus()}>{tags.map((t) => <span className="tag" key={t}>{t}<button type="button" aria-label={"Remove " + t} onClick={() => drop(t)}><Icon name="close" size={12} /></button></span>)}<input ref={input} id={id} value={text} placeholder={tags.length ? "Add more…" : "Add a tag"} aria-describedby={id + "-hint"} onChange={(e) => {
    const parts = e.target.value.split(",");
    if (parts.length > 1) add(parts.slice(0, -1));
    setText(parts[parts.length - 1]);
  }} onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add([text]);
      setText("");
    } else if (e.key === "Backspace" && !text && tags.length) setTags(tags.slice(0, -1));
  }} onBlur={() => {
    if (!text.trim()) return;
    add([text]);
    setText("");
  }} /></div><Hint id={id + "-hint"} tone={note ? "warning" : ""}>{note || "Press Enter or a comma to add. Backspace removes the last tag."}<span className="counter">{tags.length}/{max}</span></Hint></div><div className="suggest"><small>Suggested</small>{tagIdeas.filter((t) => !tags.includes(t)).map((t) => <button type="button" className="chip" key={t} onClick={() => add([t])}><Icon name="plus" size={12} />{t}</button>)}</div></>;
}
function Assignees({ data }) {
  const id = useId(), box = useRef(), input = useRef(), people = data.team;
  const [picked, setPicked] = useState(() => people.slice(0, 2).map((m) => m.id)), [q, setQ] = useState(""), [open, setOpen] = useState(false), [at, setAt] = useState(0);
  const list = people.filter((m) => (m.name + " " + m.role).toLowerCase().includes(q.trim().toLowerCase())), chosen = picked.map((p) => people.find((m) => m.id === p)).filter(Boolean), active = open ? list[Math.min(at, list.length - 1)] : null;
  useEffect(() => {
    if (!open) return;
    const down = (e) => !box.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", down);
    return () => document.removeEventListener("mousedown", down);
  }, [open]);
  const toggle = (m) => {
    setPicked((p) => p.includes(m.id) ? p.filter((x) => x !== m.id) : [...p, m.id]);
    setQ("");
  };
  const keys = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) setOpen(true);
      else if (list.length) setAt((i) => (Math.min(i, list.length - 1) + (e.key === "ArrowDown" ? 1 : list.length - 1)) % list.length);
    } else if (e.key === "Enter" && active) {
      e.preventDefault();
      toggle(active);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Backspace" && !q && picked.length) setPicked(picked.slice(0, -1));
    else if (e.key === "Tab") setOpen(false);
  };
  return <div className="field"><label htmlFor={id}>Assign teammates</label><div className="combo-box" ref={box}><div className="tag-input" onClick={(e) => {
    if (e.target.closest("button")) return;
    input.current.focus();
    setOpen(true);
  }}>{chosen.map((m) => <span className="tag" key={m.id}><Avatar text={initials(m.name)} tone={m.id % 4} small />{m.name.split(" ")[0]}<button type="button" aria-label={"Remove " + m.name} onClick={() => toggle(m)}><Icon name="close" size={12} /></button></span>)}<input ref={input} id={id} role="combobox" aria-expanded={open} aria-controls={id + "-list"} aria-autocomplete="list" aria-activedescendant={active ? id + "-" + active.id : void 0} aria-describedby={id + "-hint"} value={q} placeholder={chosen.length ? "" : "Search by name or role"} onChange={(e) => {
    setQ(e.target.value);
    setOpen(true);
    setAt(0);
  }} onKeyDown={keys} /><Icon name="chevron" size={14} /></div>{open && <ul className="listbox" id={id + "-list"} role="listbox" aria-multiselectable="true" aria-label="Teammates">{list.map((m, i) => <li key={m.id} id={id + "-" + m.id} role="option" aria-selected={picked.includes(m.id)} className={m === active ? "active" : ""} onMouseDown={keep} onMouseEnter={() => setAt(i)} onClick={() => toggle(m)}><Avatar text={initials(m.name)} tone={m.id % 4} small /><span><b>{m.name}</b><small>{m.role} · {m.status}</small></span>{picked.includes(m.id) && <Icon name="tick" size={16} />}</li>)}{!list.length && <li className="none">No teammates match “{q}”</li>}</ul>}</div><Hint id={id + "-hint"}>{chosen.length ? plural(chosen.length, "teammate") + " assigned" : "Nobody assigned yet"}. Use the arrow keys and Enter.</Hint></div>;
}
const histo = [2, 3, 5, 8, 12, 9, 14, 18, 15, 11, 9, 13, 10, 7, 6, 8, 5, 4, 3, 2];
function PriceRange() {
  const id = useId(), top = 1e3, step = 10, [lo, setLo] = useState(200), [hi, setHi] = useState(750);
  const inside = (i) => (i + 0.5) * 50 >= lo && (i + 0.5) * 50 <= hi, count = histo.reduce((a, n, i) => a + (inside(i) ? n : 0), 0), all = histo.reduce((a, n) => a + n, 0);
  const fix = () => {
    const a = Math.max(0, Math.min(Number(lo) || 0, top - step));
    setLo(a);
    setHi(Math.max(a + step, Math.min(Number(hi) || 0, top)));
  };
  const typed = (set) => (e) => set(e.target.value === "" ? "" : Number(e.target.value));
  return <><div className="histo" aria-hidden="true">{histo.map((n, i) => <i key={i} className={inside(i) ? "on" : ""} style={{ height: n / 18 * 100 + "%" }} />)}</div><div className="dual-range" style={{ "--lo": Math.min(lo, hi) / top, "--hi": Math.max(lo, hi) / top }}><i /><input type="range" min="0" max={top} step={step} value={lo || 0} aria-label="Minimum price" aria-valuetext={money(lo || 0)} style={lo > top - 100 ? { zIndex: 2 } : null} onChange={(e) => setLo(Math.min(Number(e.target.value), hi - step))} /><input type="range" min="0" max={top} step={step} value={hi || 0} aria-label="Maximum price" aria-valuetext={money(hi || 0)} onChange={(e) => setHi(Math.max(Number(e.target.value), lo + step))} /></div><div className="form-grid tight"><Group label="Minimum" id={id + "-lo"}><span className="addon">$</span><input id={id + "-lo"} type="number" min="0" max={top} step={step} value={lo} onChange={typed(setLo)} onBlur={fix} /></Group><Group label="Maximum" id={id + "-hi"}><span className="addon">$</span><input id={id + "-hi"} type="number" min="0" max={top} step={step} value={hi} onChange={typed(setHi)} onBlur={fix} /></Group></div><Hint>{count} of {all} products between {money(lo || 0)} and {money(hi || 0)}</Hint></>;
}
function Stepper({ label, value, onChange, min = 0, max = 100, step = 1 }) {
  const id = useId(), set = (v) => onChange(Math.max(min, Math.min(max, v)));
  return <div className="field"><label htmlFor={id}>{label}</label><div className="stepper"><button type="button" aria-label={"Decrease " + label.toLowerCase()} aria-disabled={value <= min || void 0} onClick={() => set(value - step)}><Icon name="minus" size={16} /></button><input id={id} type="number" min={min} max={max} step={step} value={value} onChange={(e) => e.target.value !== "" && set(Math.round(Number(e.target.value)))} /><button type="button" aria-label={"Increase " + label.toLowerCase()} aria-disabled={value >= max || void 0} onClick={() => set(value + step)}><Icon name="plus" size={16} /></button></div></div>;
}
function Quote() {
  const [seats, setSeats] = useState(12), [months, setMonths] = useState(12), [off, setOff] = useState(10);
  return <><div className="form-stack"><Stepper label="Seats" value={seats} onChange={setSeats} min={1} max={50} /><Stepper label="Months" value={months} onChange={setMonths} min={1} max={36} /><Stepper label="Discount (%)" value={off} onChange={setOff} max={50} step={5} /></div><div className="total-line"><span>{seats} × $29 × {months} mo{off ? " − " + off + "%" : ""}</span><strong>{money(seats * 29 * months * (1 - off / 100))}</strong></div></>;
}
const words = ["", "Poor", "Fair", "Good", "Great", "Excellent"], votes = [1, 3, 8, 24, 92];
function Rating() {
  const id = useId(), [value, setValue] = useState(4), [hover, setHover] = useState(0), shown = hover || value;
  const counts = votes.map((n, i) => n + (value === i + 1 ? 1 : 0)), n = counts.reduce((a, b) => a + b, 0), avg = counts.reduce((a, c, i) => a + c * (i + 1), 0) / n;
  return <><fieldset className="rating" onMouseLeave={() => setHover(0)}><legend>How was your onboarding?</legend><div className="stars">{[1, 2, 3, 4, 5].map((s) => <label key={s} className={s <= shown ? "on" : ""} onMouseEnter={() => setHover(s)}><input type="radio" className="sr-only" name={id} checked={value === s} onChange={() => setValue(s)} /><Icon name="star" size={26} /><span className="sr-only">{plural(s, "star")}, {words[s]}</span></label>)}<b aria-hidden="true">{words[shown]}</b></div></fieldset><div className="rating-sum"><div className="rating-avg"><strong>{avg.toFixed(1)}</strong><small>out of 5 · {n} reviews</small></div><ul className="rating-bars" aria-label="Reviews by star rating">{[5, 4, 3, 2, 1].map((s) => <li key={s}><span>{s}<span aria-hidden="true">★</span><span className="sr-only"> stars</span></span><span className="progress"><span style={{ width: counts[s - 1] / n * 100 + "%" }} /></span><b>{Math.round(counts[s - 1] / n * 100)}%</b></li>)}</ul></div></>;
}
function useMask(format, start) {
  const [value, setValue] = useState(() => format(digits(start)));
  return [value, (e) => {
    const el = e.target, n = digits(el.value.slice(0, el.selectionStart)).length, next = format(digits(el.value));
    setValue(next);
    requestAnimationFrame(() => {
      let i = 0;
      for (let k = 0; i < next.length && k < n; i++) if (/\d/.test(next[i])) k++;
      if (document.activeElement === el) el.setSelectionRange(i, i);
    });
  }];
}
const brandOf = (d) => /^3[47]/.test(d) ? "Amex" : /^4/.test(d) ? "Visa" : /^(5[1-5]|2[2-7])/.test(d) ? "Mastercard" : "";
const cardFmt = (d) => (brandOf(d) === "Amex" ? [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)] : d.slice(0, 16).match(/.{1,4}/g) || []).filter(Boolean).join(" ");
const luhn = (d) => [...d].reverse().reduce((a, c, i) => a + (i % 2 ? [0, 2, 4, 6, 8, 1, 3, 5, 7, 9][c] : Number(c)), 0) % 10 === 0;
const expFmt = (d) => d.length > 2 ? d.slice(0, 2) + " / " + d.slice(2, 4) : d;
const phoneFmt = (d) => (d = d.slice(0, 10)).length > 6 ? "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6) : d.length > 3 ? "(" + d.slice(0, 3) + ") " + d.slice(3) : d;
function Masks() {
  const id = useId(), [card, onCard] = useMask(cardFmt, "4242424242424242"), [exp, onExp] = useMask(expFmt, "1229"), [phone, onPhone] = useMask(phoneFmt, "5550102030"), [cvc, setCvc] = useState("");
  const d = digits(card), brand = brandOf(d), full = d.length === (brand === "Amex" ? 15 : 16), ok = full && luhn(d);
  const now = /* @__PURE__ */ new Date(), yy = now.getFullYear() % 100, mm = Number(exp.slice(0, 2)), ey = Number(exp.slice(5, 7)), expDone = digits(exp).length === 4;
  const expErr = !expDone ? "" : mm < 1 || mm > 12 ? "Use a month from 01 to 12" : ey < yy || ey === yy && mm < now.getMonth() + 1 ? "This card has expired" : "";
  return <div className="form-grid"><div className="field full"><label htmlFor={id + "-card"}>Card number</label><span className="status-wrap"><input id={id + "-card"} className={ok ? "valid" : ""} inputMode="numeric" autoComplete="cc-number" placeholder="1234 5678 9012 3456" value={card} onChange={onCard} aria-invalid={full && !ok || void 0} aria-describedby={id + "-card-hint"} />{brand && <Badge tone="low">{brand}</Badge>}</span><Hint id={id + "-card-hint"} tone={full ? ok ? "success" : "error" : ""}>{full ? ok ? "Passes the Luhn check. This is a test number." : "This number fails the Luhn check" : "Groups of four. Amex uses 4-6-5."}</Hint></div><Field label="Expiry"><input inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY" value={exp} onChange={onExp} aria-invalid={!!expErr || void 0} aria-describedby={id + "-exp"} /><Hint id={id + "-exp"} tone={expErr ? "error" : ""}>{expErr || (expDone ? "Valid through " + exp.slice(0, 2) + "/20" + exp.slice(5, 7) : "Month, then year")}</Hint></Field><Field label="Security code"><input inputMode="numeric" autoComplete="cc-csc" placeholder={brand === "Amex" ? "4 digits" : "3 digits"} value={cvc} onChange={(e) => setCvc(digits(e.target.value).slice(0, brand === "Amex" ? 4 : 3))} aria-describedby={id + "-cvc"} /><Hint id={id + "-cvc"}>On the back of the card</Hint></Field><div className="field full"><label htmlFor={id + "-tel"}>Phone (US)</label><input id={id + "-tel"} inputMode="tel" autoComplete="tel-national" placeholder="(555) 010-2030" value={phone} onChange={onPhone} aria-describedby={id + "-tel-hint"} /><Hint id={id + "-tel-hint"}>Saved as <code>{digits(phone) ? "+1" + digits(phone) : "nothing yet"}</code></Hint></div></div>;
}
const ranges = [["Today", () => [shift(0), shift(0)]], ["Last 7 days", () => [shift(-6), shift(0)]], ["Last 30 days", () => [shift(-29), shift(0)]], ["This month", () => {
  const n = /* @__PURE__ */ new Date();
  return [localDay(new Date(n.getFullYear(), n.getMonth(), 1)), localDay(new Date(n.getFullYear(), n.getMonth() + 1, 0))];
}], ["Next 14 days", () => [shift(0), shift(13)]]];
function Dates() {
  const [from, setFrom] = useState(() => shift(-6)), [to, setTo] = useState(() => shift(0));
  const day = (s) => /* @__PURE__ */ new Date(s + "T12:00:00"), days = Math.round((day(to) - day(from)) / 864e5) + 1, bad = !(days >= 1);
  const work = bad ? 0 : Array.from({ length: Math.min(days, 3660) }, (_, i) => {
    const d = day(from);
    d.setDate(d.getDate() + i);
    return d.getDay() % 6 ? 1 : 0;
  }).reduce((a, b) => a + b, 0);
  return <><div className="chips" role="group" aria-label="Quick ranges">{ranges.map(([label, get]) => {
    const [a, b] = get();
    return <button key={label} type="button" className="chip" aria-pressed={from === a && to === b} onClick={() => {
      setFrom(a);
      setTo(b);
    }}>{label}</button>;
  })}</div><div className="form-grid"><Field label="From"><input type="date" value={from} max={to} onChange={(e) => e.target.value && setFrom(e.target.value)} /></Field><Field label="To"><input type="date" value={to} min={from} aria-invalid={bad || void 0} onChange={(e) => e.target.value && setTo(e.target.value)} /></Field></div>{bad ? <Hint tone="error">The end date is before the start date</Hint> : <div className="range-sum" aria-live="polite"><span className="timeline-icon"><Icon name="calendar" size={16} /></span><span><b>{fmtDate(from)} – {fmtDate(to)}, {day(to).getFullYear()}</b><small>{plural(days, "day")} · {plural(work, "weekday")}</small></span></div>}</>;
}
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], budgets = ["Under $10K", "$10K–50K", "$50K+"];
function Chips() {
  const id = useId(), [on, setOn] = useState(["Mon", "Wed", "Fri"]), [budget, setBudget] = useState(budgets[1]);
  return <><fieldset className="chip-group"><legend>Meeting days</legend><div className="chips">{weekdays.map((d) => <label key={d} className={"chip" + (on.includes(d) ? " on" : "")}><input type="checkbox" className="sr-only" checked={on.includes(d)} onChange={() => setOn(weekdays.filter((x) => x === d ? !on.includes(d) : on.includes(x)))} />{on.includes(d) && <Icon name="tick" size={12} />}{d}</label>)}</div></fieldset><Hint>{on.length ? "Meets every " + listText(on) : "No days picked yet"}</Hint><fieldset className="chip-group"><legend>Budget</legend><div className="chips">{budgets.map((b) => <label key={b} className={"chip" + (budget === b ? " on" : "")}><input type="radio" className="sr-only" name={id} checked={budget === b} onChange={() => setBudget(b)} />{b}</label>)}</div></fieldset></>;
}
const palette = ["#9377cf", "#b96f90", "#6e9a83", "#5a7bb5", "#d9a441", "#d9776a", "#4f9aa8", "#30283e"];
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
const inkOn = (hex) => contrast(hex, "#ffffff") >= contrast(hex, "#30283e") ? "#ffffff" : "#30283e";
function ColorPick() {
  const id = useId(), [color, setColor] = useState("#6e9a83"), [hex, setHex] = useState("#6e9a83");
  const pick = (c) => {
    setColor(c);
    setHex(c);
  };
  const ink = inkOn(color), r = contrast(color, ink), valid = /^#[0-9a-f]{6}$/i.test(hex);
  return <><fieldset className="swatch-grid"><legend className="sr-only">Preset colors</legend>{palette.map((c) => <label key={c} className={color === c ? "on" : ""} style={{ "--c": c, color: inkOn(c) }}><input type="radio" className="sr-only" name={id} checked={color === c} onChange={() => pick(c)} /><span className="sr-only">{c}</span>{color === c && <Icon name="tick" size={14} />}</label>)}</fieldset><Group label="Custom color" id={id + "-hex"} hint={!valid && <Hint tone="error">Use six hex digits, like #6E9A83</Hint>}><input type="color" aria-label="Pick a custom color" value={color} onChange={(e) => pick(e.target.value)} /><input id={id + "-hex"} className="mono" value={hex} maxLength="7" spellCheck="false" aria-invalid={!valid || void 0} onChange={(e) => {
    const v = e.target.value.startsWith("#") ? e.target.value : "#" + e.target.value;
    setHex(v);
    if (/^#[0-9a-f]{6}$/i.test(v)) setColor(v.toLowerCase());
  }} /></Group><div className="color-preview"><span className="color-chip" style={{ background: color, color: ink }}>Priority client</span><span>{r.toFixed(1)}:1 · {r >= 4.5 ? "Passes AA" : r >= 3 ? "Large text only" : "Too low"}</span></div></>;
}
function Secrets({ setToast }) {
  const id = useId(), [key, setKey] = useState("mk_live_7f3a9c2e41b84d6f"), [show, setShow] = useState(false), hook = "https://hooks.mellow.studio/in/4c1e";
  const regen = () => {
    setKey("mk_live_" + [...crypto.getRandomValues(new Uint8Array(8))].map((b) => b.toString(16).padStart(2, "0")).join(""));
    setShow(true);
    setToast("New demo key generated", { tone: "info" });
  };
  return <div className="form-stack"><Group label="API key" id={id} hint={<Hint>Demo key. It does not unlock anything.</Hint>}><input id={id} className="mono" readOnly type={show ? "text" : "password"} value={key} /><Button type="button" icon={show ? "eyeOff" : "eye"} aria-label={show ? "Hide key" : "Show key"} aria-pressed={show} onClick={() => setShow(!show)} /><Button type="button" icon="copy" aria-label="Copy API key" onClick={() => copy(key, setToast, "API key copied")} /></Group><Group label="Webhook URL" id={id + "-hook"}><input id={id + "-hook"} className="mono" readOnly value={hook} /><Button type="button" icon="copy" onClick={() => copy(hook, setToast, "Webhook URL copied")}>Copy</Button></Group><div className="actions"><Button type="button" icon="refresh" onClick={regen}>Regenerate key</Button></div></div>;
}
function Advanced(ctx) {
  const { data, pageHead, setToast } = ctx;
  return <>{pageHead("Richer controls built on native inputs: tags, searchable selects, masks, sliders, and pickers.")}<div className="dash">
 <Panel span={6} title="Tag input" sub="Type, press Enter, remove with ×"><Tags /></Panel>
 <Panel span={6} title="Searchable multi-select" sub="A combobox with keyboard support"><Assignees data={data} /></Panel>
 <Panel span={4} title="Price range" sub="Two thumbs on one track"><PriceRange /></Panel>
 <Panel span={4} title="Number stepper" sub="Buttons or typing, within limits"><Quote /></Panel>
 <Panel span={4} title="Star rating" sub="Radio buttons under the stars"><Rating /></Panel>
 <Panel span={6} title="Input masks" sub="Formats as you type and keeps the cursor in place"><Masks /></Panel>
 <Panel span={6} title="Date range" sub="Two dates with quick presets"><Dates /></Panel>
 <Panel span={4} title="Choice chips" sub="Checkbox and radio groups as chips"><Chips /></Panel>
 <Panel span={4} title="Color picker" sub="Presets, a custom color, and a contrast check"><ColorPick /></Panel>
 <Panel span={4} title="Secret & copy fields" sub="Reveal, copy, and regenerate"><Secrets setToast={setToast} /></Panel>
 </div></>;
}
function Float({ label, as: El = "input", children, ...props }) {
  const id = useId();
  return <div className="float"><El id={id} placeholder={El === "select" ? void 0 : " "} {...props}>{children}</El><label htmlFor={id}>{label}</label></div>;
}
const guide = [["input", "Vertical", "The default. Quick to scan and easy on phones."], ["layout", "Horizontal", "Settings and dense admin screens with short labels."], ["sparkle", "Floating labels", "Compact sign-in and dialog forms."], ["menu", "Inline", "Filters, search bars, and quick-add rows."], ["grid", "Multi-column", "Long records split into named sections."]];
const helpers = [[".form-grid", "Two columns, one on phones"], [".form-grid.three", "Three columns for addresses"], [".full", "Spans the whole row"], [".form-stack", "Fields stacked with even gaps"], [".form-rows", "Label column on the left"], [".float", "Floating label wrapper"], [".form-inline", "Fields in one wrapping row"], [".form-actions", "Sticky footer with save state"]];
function Layouts(ctx) {
  const { data, update, log, pageHead, setToast } = ctx, id = useId(), [dirty, setDirty] = useState(false);
  const demo = (what) => (e) => {
    e.preventDefault();
    e.currentTarget.reset();
    setToast(what + ": demo only, nothing was sent", { tone: "info" });
  };
  const addTask = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget), title = String(f.get("title")).trim();
    if (!title) return;
    update("tasks", (xs) => [...xs, { id: Date.now(), title, date: f.get("date") || shift(1), done: false }]);
    log("Added task " + title, "task");
    setToast("Task added. Find it on the Tasks page.");
    e.currentTarget.reset();
  };
  return <>{pageHead("The same kinds of fields in five arrangements. Pick the layout that fits the job.")}<div className="dash">
 <Panel span={6} title="Vertical" sub="Labels stacked above the fields"><form className="form-stack" onSubmit={demo("Message")}><Field label="Your name" name="name" required autoComplete="name" /><Field label="Email address" name="email" type="email" required autoComplete="email" /><Field label="Topic"><select name="topic" defaultValue="Sales">{["Sales", "Support", "Billing", "Partnership"].map((t) => <option key={t}>{t}</option>)}</select></Field><Field label="Message"><textarea name="message" rows="3" required placeholder="How can we help?" /></Field><label className="check"><input type="checkbox" name="copy" />Send me a copy</label><div className="actions"><Button type="reset">Clear</Button><Button kind="primary" type="submit" icon="message">Send message</Button></div></form></Panel>
 <Panel span={6} title="Horizontal" sub="Labels in a column on the left"><form className="form-rows" onSubmit={demo("Workspace settings")}><div className="form-row"><label htmlFor={id + "-ws"}>Workspace</label><div className="row-body"><input id={id + "-ws"} defaultValue={data.settings.workspace} required maxLength="50" aria-describedby={id + "-ws-hint"} /><Hint id={id + "-ws-hint"}>Shown in the sidebar and in emails</Hint></div></div><div className="form-row"><label htmlFor={id + "-slug"}>Address</label><div className="row-body"><div className="input-group"><span className="addon">mellow.app/</span><input id={id + "-slug"} defaultValue="mellow-studio" required pattern="[a-z0-9\-]+" title="Lowercase letters, numbers, and hyphens" /></div></div></div><div className="form-row"><label htmlFor={id + "-tz"}>Time zone</label><div className="row-body"><select id={id + "-tz"} defaultValue="Asia/Jakarta">{["Asia/Jakarta", "Asia/Singapore", "Europe/Berlin", "America/New_York"].map((z) => <option key={z}>{z}</option>)}</select></div></div><div className="form-row"><span className="row-label" id={id + "-wk"}>Week starts</span><div role="radiogroup" aria-labelledby={id + "-wk"} className="choice-list inline">{["Monday", "Sunday"].map((d, i) => <label className="check" key={d}><input type="radio" name="week" defaultChecked={!i} />{d}</label>)}</div></div><div className="form-row"><span /><div className="actions"><Button type="reset">Cancel</Button><Button kind="primary" type="submit">Save settings</Button></div></div></form></Panel>
 <Panel span={6} title="Floating labels" sub="The label moves up once the field has a value"><form className="form-stack" onSubmit={demo("Sign-in")}><Float label="Email address" type="email" required autoComplete="username" /><Float label="Password" type="password" required autoComplete="current-password" /><Float label="Department" as="select" defaultValue="Sales">{["Sales", "Marketing", "Support", "Finance"].map((d) => <option key={d}>{d}</option>)}</Float><Float label="Notes" as="textarea" rows="3" /><Button kind="primary" type="submit">Continue</Button></form></Panel>
 <Panel span={6} title="Inline" sub="Fields share one row and wrap on small screens"><div className="inline-demos"><div><span className="eyebrow">NEWSLETTER</span><form className="form-inline" onSubmit={demo("Subscription")}><input type="email" required aria-label="Email address" placeholder="you@example.com" /><Button kind="primary" type="submit">Subscribe</Button></form></div><div><span className="eyebrow">FILTERS</span><form className="form-inline" onSubmit={demo("Filters")}><input type="search" aria-label="Search orders" placeholder="Search orders" /><select aria-label="Status" defaultValue="All">{["All", "Pending", "Shipped", "Delivered"].map((s) => <option key={s}>{s}</option>)}</select><Button type="submit" icon="search">Apply</Button></form></div><div><span className="eyebrow">QUICK ADD TASK</span><form className="form-inline" onSubmit={addTask}><input name="title" required maxLength="100" aria-label="Task title" placeholder="Call Acme about the renewal" /><input name="date" type="date" aria-label="Due date" defaultValue={shift(1)} /><Button kind="primary" type="submit" icon="plus">Add</Button></form><Hint>This one is real: it adds a task to Tasks.</Hint></div></div></Panel>
 <form className="panel span-8" onInput={() => setDirty(true)} onReset={() => setDirty(false)} onSubmit={(e) => {
    e.preventDefault();
    setDirty(false);
    setToast("Company profile saved (demo only)");
  }}><div className="panel-head"><div><h3>Multi-column with sections</h3><p>Long records split into numbered groups, with a sticky save bar</p></div></div><fieldset className="form-section"><legend><span>1</span>Company</legend><div className="form-grid"><Field label="Company name" required maxLength="70" defaultValue="Northwind" /><Field label="Industry"><select defaultValue="Logistics">{industries.map((x) => <option key={x}>{x}</option>)}</select></Field><Field label="Company size"><select defaultValue="51–200">{sizes.map((x) => <option key={x}>{x}</option>)}</select></Field><Field label="Website" type="url" placeholder="https://" defaultValue="https://northwind.example" /></div></fieldset><fieldset className="form-section"><legend><span>2</span>Billing address</legend><div className="form-grid three"><F full label="Street address" autoComplete="street-address" defaultValue="221 Harbor Road" /><Field label="City" autoComplete="address-level2" defaultValue="Rotterdam" /><Field label="State or province" autoComplete="address-level1" defaultValue="South Holland" /><Field label="Postal code" autoComplete="postal-code" defaultValue="3011 AA" /></div></fieldset><fieldset className="form-section"><legend><span>3</span>Primary contact</legend><div className="form-grid"><Field label="First name" autoComplete="given-name" defaultValue="Amelia" /><Field label="Last name" autoComplete="family-name" defaultValue="Brown" /><Field label="Email" type="email" autoComplete="email" defaultValue="amelia@example.com" /><Field label="Phone" type="tel" autoComplete="tel" placeholder="+31 10 123 4567" /></div></fieldset><div className="form-actions"><span className={"save-state" + (dirty ? " dirty" : "")} aria-live="polite"><i />{dirty ? "Unsaved changes" : "All changes saved"}</span><Button type="reset">Reset</Button><Button kind="primary" type="submit">Save company</Button></div></form>
 <div className="stack span-4"><Panel title="Which layout when" sub="A quick guide for new screens"><ul className="layout-guide">{guide.map(([icon, name, use]) => <li key={name}><span className="timeline-icon"><Icon name={icon} size={16} /></span><span><b>{name}</b><small>{use}</small></span></li>)}</ul></Panel><Panel title="CSS helpers" sub="Classes used on this page"><ul className="class-list">{helpers.map(([c, s]) => <li key={c}><code>{c}</code><span>{s}</span></li>)}</ul></Panel></div>
 </div></>;
}
const score = (p) => !p ? 0 : rules[0][1](p) ? rules.filter(([, t]) => t(p)).length : 1;
const reserved = ["admin", "mellow", "support", "root", "help"];
const accountRules = {
  username: (v) => !v ? "Choose a username" : v.length < 3 ? "Use at least 3 characters" : v.length > 20 ? "Use 20 characters or fewer" : /[^a-z0-9_]/.test(v) ? "Use lowercase letters, numbers, and _ only" : "",
  email: (v, all, team) => !v ? "Enter your email address" : !isEmail(v) ? "Enter a full address, like name@company.com" : team.some((m) => m.email.toLowerCase() === v.toLowerCase()) ? "This email already belongs to a teammate" : "",
  password: (v) => !v ? "Create a password" : score(v) < 3 ? "Meet at least three of the four rules below" : "",
  confirm: (v, all) => !v ? "Repeat the password" : v !== all.password ? "The passwords do not match" : "",
  role: (v) => v ? "" : "Choose your role",
  seats: (v) => !v ? "Enter a team size" : !/^\d+$/.test(v) || v < 1 || v > 500 ? "Enter a whole number from 1 to 500" : "",
  website: (v) => v && !/^https?:\/\/[^\s/.]+\.\S{2,}$/.test(v) ? "Start with http:// or https://, like https://bloom.studio" : "",
  terms: (v) => v ? "" : "Accept the terms to continue"
};
const fieldNames = { username: "Username", email: "Work email", password: "Password", confirm: "Confirm password", role: "Role", seats: "Team size", website: "Website", terms: "Terms" };
const blankAccount = { username: "", email: "", password: "", confirm: "", role: "", seats: "", website: "", terms: false };
const timing = [["eye", "On blur", "The first check runs when you leave a field"], ["edit", "While typing", "Once an error shows, it clears as soon as the value is fixed"], ["alert", "On submit", "A summary lists every problem and links to the field"], ["layers", "On the server", "Server errors map back to a field, as in the invite form"]];
function Invite(ctx) {
  const { data, update, log, setToast, remove } = ctx, id = useId(), field = useRef(), latest = useRef(data);
  const [email, setEmail] = useState(""), [role, setRole] = useState("Sales"), [busy, setBusy] = useState(false), [err, setErr] = useState("");
  latest.current = data;
  const invited = data.team.filter((m) => m.status === "Invited");
  const submit = (e) => {
    e.preventDefault();
    if (busy) return;
    const v = email.trim().toLowerCase();
    if (!isEmail(v)) {
      setErr("Enter a full email address");
      return field.current.focus();
    }
    setErr("");
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      const fail = latest.current.team.some((m) => m.email.toLowerCase() === v) ? "Server: " + v + " is already on your team" : /@(example\.org|mailinator\.com)$/.test(v) ? "Server: invitations to this domain are blocked" : "";
      if (fail) {
        setErr(fail);
        return field.current?.focus();
      }
      const name = v.split("@")[0].replace(/[._-]+/g, " ").trim().replace(/\b\w/g, (c) => c.toUpperCase()) || v;
      update("team", (xs) => [...xs, { id: Date.now(), name, email: v, role, status: "Invited", joined: localDay() }]);
      log("Invited " + name + " as " + role, "team");
      setToast(name + " invited. They now appear on the Team page.");
      setEmail("");
    }, 700);
  };
  return <><form className="form-stack" noValidate onSubmit={submit}><div className="field"><label htmlFor={id}>Email address</label><span className="input-wrap"><Icon name="mail" size={16} /><input ref={field} id={id} type="email" autoComplete="off" placeholder="name@company.com" value={email} onChange={(e) => {
    setEmail(e.target.value);
    setErr("");
  }} aria-invalid={err ? true : void 0} aria-describedby={id + "-msg"} /></span><Hint id={id + "-msg"} tone={err ? "error" : ""}>{err || "Try " + (data.team[1]?.email || "a teammate’s email") + " or any @example.org address to get a server error."}</Hint></div><Field label="Role"><select value={role} onChange={(e) => setRole(e.target.value)}>{["Manager", "Sales", "Support", "Viewer"].map((r) => <option key={r}>{r}</option>)}</select></Field><div className="actions"><Submit busy={busy} busyText="Sending invite…" icon="mail">Send invite</Submit></div></form>{invited.length > 0 && <ul className="info-list">{invited.map((m) => <li key={m.id}><Avatar text={initials(m.name)} tone={m.id % 4} small /><span>{m.name}<small className="sub-line">{m.email} · {m.role}</small></span><Badge tone="low">Invited</Badge><button type="button" className="icon-btn" aria-label={"Cancel invitation for " + m.name} onClick={() => remove("team", m, "invitation")}><Icon name="close" size={15} /></button></li>)}</ul>}</>;
}
function Validation(ctx) {
  const { data, pageHead, setToast } = ctx, uid = useId(), summary = useRef(), keys = Object.keys(accountRules);
  const [v, setV] = useState(blankAccount), [touched, setTouched] = useState({}), [tried, setTried] = useState(false), [lookup, setLookup] = useState({ name: "", state: "" }), [done, setDone] = useState(false);
  const errs = Object.fromEntries(keys.map((k) => [k, accountRules[k](v[k], v, data.team)]));
  if (!errs.username && lookup.name === v.username && lookup.state === "taken") errs.username = "“" + v.username + "” is taken. Try " + v.username + "_" + (v.username.length % 9 + 1) + "?";
  const free = lookup.name === v.username && lookup.state === "free";
  useEffect(() => {
    if (accountRules.username(v.username)) return setLookup({ name: "", state: "" });
    setLookup({ name: v.username, state: "checking" });
    const t = setTimeout(() => setLookup({ name: v.username, state: reserved.includes(v.username) || data.team.some((m) => m.name.split(" ")[0].toLowerCase() === v.username) ? "taken" : "free" }), 600);
    return () => clearTimeout(t);
  }, [v.username]);
  const show = (k) => (touched[k] || tried) && errs[k], bad = keys.filter((k) => errs[k]), ready = keys.filter((k) => !errs[k] && (k !== "username" || free));
  const ids = Object.fromEntries(keys.map((k) => [k, uid + k]));
  const set = (k) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setV((x) => ({ ...x, [k]: val }));
    setDone(false);
  };
  const blur = (k) => () => setTouched((t) => t[k] ? t : { ...t, [k]: true });
  const msg = (k, hint, tone = "") => show(k) ? <Hint id={ids[k] + "-msg"} tone="error">{errs[k]}</Hint> : hint ? <Hint id={ids[k] + "-msg"} tone={tone}>{hint}</Hint> : null;
  const aria = (k, hint) => ({ id: ids[k], name: k, onBlur: blur(k), "aria-invalid": show(k) ? true : void 0, "aria-describedby": show(k) || hint ? ids[k] + "-msg" : void 0 });
  const ok = (k) => (touched[k] || tried) && !errs[k] && v[k] !== "" && (k !== "username" || free);
  const input = (k, attrs, hint, tone, optional) => <div className="field"><label htmlFor={ids[k]}>{fieldNames[k]}{optional && <em> (optional)</em>}</label><span className="status-wrap"><input value={v[k]} onChange={set(k)} {...aria(k, hint)} {...attrs} />{k === "username" && lookup.state === "checking" && lookup.name === v.username ? <i className="spinner" aria-hidden="true" /> : ok(k) && <Icon name="tick" size={16} />}</span>{msg(k, hint, tone)}</div>;
  const userHint = lookup.state === "checking" && lookup.name === v.username ? ["Checking availability…", ""] : free && !errs.username ? ["“" + v.username + "” is available", "success"] : ["3–20 characters: lowercase letters, numbers, and _", ""];
  const submit = (e) => {
    e.preventDefault();
    setTried(true);
    if (lookup.state === "checking") return setToast("Still checking the username. Try again in a moment.", { tone: "info" });
    if (bad.length) return setTimeout(() => summary.current?.focus());
    setDone(true);
    setToast("Every field is valid. Nothing was sent.");
  };
  const restart = () => {
    setV(blankAccount);
    setTouched({});
    setTried(false);
    setDone(false);
  };
  return <>{pageHead("Inline errors, an error summary, and server-side checks, with timing that does not nag.")}<div className="dash">
 <form className="panel span-8" noValidate onSubmit={submit}><div className="panel-head"><div><h3>Create an account</h3><p>Each field is checked when you leave it, then live while you fix it</p></div><Badge tone={bad.length ? "medium" : "success"}>{bad.length ? plural(bad.length, "issue") : "Ready"}</Badge></div>{tried && bad.length > 0 && <div className="error-summary" ref={summary} tabIndex="-1" role="alert" aria-labelledby={uid + "sum"}><b id={uid + "sum"}><Icon name="alert" size={18} />Fix {plural(bad.length, "field")} to continue</b><ul>{bad.map((k) => <li key={k}><button type="button" className="text-btn" onClick={() => document.getElementById(ids[k])?.focus()}>{fieldNames[k]}: {errs[k]}</button></li>)}</ul></div>}{done && <div className="success-banner" role="status"><Icon name="check" size={22} /><span><b>All set</b><small>Every field passed. A real app would send the request now.</small></span><Button type="button" onClick={restart}>Start over</Button></div>}<div className="form-grid">
 {input("username", { autoComplete: "username", spellCheck: "false", maxLength: 20 }, userHint[0], userHint[1])}
 {input("email", { type: "email", autoComplete: "email" }, "Try " + (data.team[0]?.email || "a teammate’s email") + " to see a conflict")}
 <div className="field-block"><Password autoComplete="new-password" placeholder="At least 8 characters" value={v.password} onChange={set("password")} {...aria("password")} />{msg("password")}</div>
 {input("confirm", { type: "password", autoComplete: "new-password" })}
 <div className="full"><Strength value={v.password} /></div>
 <div className="field"><label htmlFor={ids.role}>{fieldNames.role}</label><select value={v.role} onChange={set("role")} {...aria("role")}><option value="">Choose a role</option>{["Founder", "Sales", "Marketing", "Operations", "Engineering"].map((r) => <option key={r}>{r}</option>)}</select>{msg("role")}</div>
 {input("seats", { inputMode: "numeric", placeholder: "1 to 500" }, "People who will use the workspace")}
 <div className="full">{input("website", { type: "url", placeholder: "https://", autoComplete: "url" }, "", "", true)}</div>
 <div className="field full"><label className="check"><input type="checkbox" checked={v.terms} onChange={set("terms")} {...aria("terms")} />I agree to the terms and the privacy policy</label>{msg("terms")}</div>
 </div><div className="actions"><Button type="button" onClick={restart}>Reset</Button><Button kind="primary" type="submit" icon="check">Create account</Button></div></form>
 <div className="stack span-4"><Panel title="Form status" sub="Updates as you type"><div className="ring-hero"><Ring value={ready.length / keys.length * 100} size={88} stroke={8} tone={ready.length === keys.length ? "k-success" : "k-accent"} label={ready.length + " of " + keys.length + " fields ready"}>{ready.length}/{keys.length}</Ring><span><b>{ready.length === keys.length ? "Ready to submit" : plural(keys.length - ready.length, "field") + " to go"}</b><small>{tried ? "Errors now show for every field" : "Errors show after you leave a field"}</small></span></div><ul className="info-list">{keys.map((k) => {
    const st = ready.includes(k) ? "ok" : show(k) ? "error" : "todo";
    return <li key={k}><Icon name={st === "ok" ? "check" : st === "error" ? "alert" : "clock"} size={16} /><span>{fieldNames[k]}</span><Badge tone={st === "ok" ? "success" : st === "error" ? "high" : ""}>{st === "ok" ? "Valid" : st === "error" ? "Error" : "To do"}</Badge></li>;
  })}</ul></Panel><Panel title="When to validate" sub="The timing used on this page"><ol className="timeline">{timing.map(([icon, t, s]) => <li key={t}><span className="timeline-icon"><Icon name={icon} size={15} /></span><span><b>{t}</b><small>{s}</small></span></li>)}</ol></Panel></div>
 <Panel span={6} title="Message styles" sub="Help, success, warning, and error text"><div className="form-grid"><Field label="Company website"><input className="valid" defaultValue="https://bloom.studio" aria-describedby={uid + "s1"} /><Hint id={uid + "s1"} tone="success">The site responds</Hint></Field><Field label="Work email"><input className="warn" defaultValue="cut.rahma@gmail.com" aria-describedby={uid + "s2"} /><Hint id={uid + "s2"} tone="warning">Looks like a personal address</Hint></Field><Field label="Discount code"><input aria-invalid="true" defaultValue="SPRING" aria-describedby={uid + "s3"} /><Hint id={uid + "s3"} tone="error">This code expired on Oct 31</Hint></Field><Field label="Display name"><input defaultValue="Rahma" aria-describedby={uid + "s4"} /><Hint id={uid + "s4"}>Shown to clients in emails</Hint></Field><Field label="Plan"><select aria-invalid="true" defaultValue="" aria-describedby={uid + "s5"}><option value="">Choose a plan</option><option>Pro</option><option>Team</option></select><Hint id={uid + "s5"} tone="error">Choose a plan</Hint></Field><Field label="Notes"><textarea rows="2" aria-invalid="true" defaultValue="Call back" aria-describedby={uid + "s6"} /><Hint id={uid + "s6"} tone="error">Write at least 20 characters</Hint></Field></div></Panel>
 <Panel span={6} title="Server-side errors" sub="Invite a teammate. Some answers come back from the “server”"><Invite {...ctx} /></Panel>
 </div></>;
}
const steps = [["Contact", "Who you will work with"], ["Company", "Their organization"], ["Deal", "The first opportunity"], ["Review", "Check and create"]];
const industries = ["Software", "Finance", "Retail", "Logistics", "Media", "Healthcare"], sizes = ["1–10", "11–50", "51–200", "200+"];
const onFinish = [["contact", "Adds a contact", "Name, email, and job title go to Contacts"], ["briefcase", "Adds a deal", "It lands in the pipeline at the stage you chose"], ["check", "Adds a task (optional)", "A kickoff call two days from now"], ["activity", "Logs the change", "It shows on Activity. Undo removes all of it."]];
function Wizard(ctx) {
  const { data, update, log, setToast, go, pageHead } = ctx, form = useRef(), head = useRef(), first = useRef(true);
  const owners = data.team.map((m) => [initials(m.name), m.name]), me = initials(data.settings.name);
  const fresh = () => ({ name: "", email: "", role: "", company: "", industry: "Software", size: "11–50", title: "", value: "", stage: "0", priority: "Medium", date: shift(30), owner: owners.some(([o]) => o === me) ? me : owners[0]?.[0] || "CR", kickoff: true });
  const [step, setStep] = useState(0), [reached, setReached] = useState(0), [v, setV] = useState(fresh), [done, setDone] = useState(null);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    head.current?.focus();
  }, [step, done]);
  const bind = (k) => ({ name: k, value: v[k], onChange: (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setV((x) => ({ ...x, [k]: val }));
  } });
  const companies = [...new Set([...data.contacts, ...data.deals].map((x) => x.company))].sort(), known = data.contacts.filter((c) => v.company.trim() && c.company.toLowerCase() === v.company.trim().toLowerCase());
  const required = ["name", "email", "role", "company", "value", "date"], filled = required.filter((k) => String(v[k]).trim()).length, pct = done ? 100 : Math.round(filled / required.length * 100);
  const title = v.title.trim() || v.company.trim() + " onboarding";
  const jump = (i) => {
    if (i > step && !form.current.reportValidity()) return;
    setStep(i);
  };
  const restart = () => {
    setV(fresh());
    setStep(0);
    setReached(0);
    setDone(null);
  };
  function finish() {
    const id = Date.now(), company = v.company.trim();
    const contact = { id, name: v.name.trim(), company, email: v.email.trim(), role: v.role.trim() };
    const deal = { id: id + 1, title, company, value: Number(v.value), stage: Number(v.stage), priority: v.priority, date: v.date, owner: v.owner };
    const task = v.kickoff ? { id: id + 2, title: "Kickoff call with " + company, date: shift(2), done: false } : null;
    update("contacts", (xs) => [...xs, contact]);
    update("deals", (xs) => [...xs, deal]);
    if (task) update("tasks", (xs) => [...xs, task]);
    log("Onboarded " + company + ": " + contact.name + " and " + deal.title, "deal");
    setDone({ contact, deal, task });
    setToast(company + " onboarded", { undo: () => {
      update("contacts", (xs) => xs.filter((x) => x.id !== contact.id));
      update("deals", (xs) => xs.filter((x) => x.id !== deal.id));
      if (task) update("tasks", (xs) => xs.filter((x) => x.id !== task.id));
      log("Undid onboarding of " + company, "record");
      setDone(null);
    } });
  }
  const submit = (e) => {
    e.preventDefault();
    if (step === 3) return finish();
    setStep(step + 1);
    setReached((r) => Math.max(r, step + 1));
  };
  const review = [["Contact", 0, [["Name", v.name], ["Email", v.email], ["Job title", v.role]]], ["Company", 1, [["Company", v.company], ["Industry", v.industry], ["Size", v.size + " people"]]], ["Deal", 2, [["Title", title], ["Value", money(Number(v.value) || 0)], ["Stage", stages[v.stage] + " · " + v.priority], ["Closes", fmtDate(v.date)], ["Owner", owners.find(([o]) => o === v.owner)?.[1] || v.owner]]]];
  const body = [<div className="form-grid"><Field label="Full name" required maxLength="70" autoComplete="off" placeholder="Olivia Chen" {...bind("name")} /><Field label="Email" type="email" required maxLength="90" autoComplete="off" placeholder="name@company.com" {...bind("email")} /><F full label="Job title" required maxLength="70" placeholder="Head of Operations" {...bind("role")} /></div>, <><div className="form-grid"><Field label="Company"><input list="wizard-companies" required maxLength="70" placeholder="Northwind" {...bind("company")} /><datalist id="wizard-companies">{companies.map((c) => <option key={c} value={c} />)}</datalist></Field><Field label="Industry"><select {...bind("industry")}>{industries.map((x) => <option key={x}>{x}</option>)}</select></Field></div>{known.length > 0 && <Hint tone="warning">{known[0].company} already has {plural(known.length, "contact")}. The new contact joins that account.</Hint>}<fieldset className="plan-pick four"><legend>Company size</legend>{sizes.map((s) => <label key={s} className={v.size === s ? "selected" : ""}><input type="radio" name="size" value={s} checked={v.size === s} onChange={bind("size").onChange} /><b>{s}</b><small>people</small></label>)}</fieldset></>, <div className="form-grid"><Field label="Deal title" maxLength="90" placeholder={(v.company.trim() || "Client") + " onboarding"} {...bind("title")} /><Field label="Owner"><select {...bind("owner")}>{owners.map(([o, n]) => <option key={o} value={o}>{n}</option>)}</select></Field><Field label="Value (USD)" type="number" required min="0" max="1000000000" step="0.01" placeholder="25000" {...bind("value")} /><Field label="Stage"><select {...bind("stage")}>{stages.map((s, i) => <option key={s} value={i}>{s}</option>)}</select></Field><Field label="Priority"><select {...bind("priority")}>{["Low", "Medium", "High"].map((p) => <option key={p}>{p}</option>)}</select></Field><Field label="Expected close" type="date" required min={shift(0)} {...bind("date")} /></div>, <><div className="review">{review.map(([t, i, rows]) => <section key={t}><div className="review-head"><h5>{t}</h5><button type="button" className="text-btn link" aria-label={"Edit " + t.toLowerCase()} onClick={() => setStep(i)}>Edit</button></div><dl>{rows.map(([k, val]) => <div key={k}><dt>{k}</dt><dd>{val || "—"}</dd></div>)}</dl></section>)}</div><label className="check"><input type="checkbox" {...bind("kickoff")} checked={v.kickoff} value={void 0} />Also add a kickoff call to Tasks, two days from now</label></>];
  const summary = [v.name ? v.name + (v.email ? " · " + v.email : "") : "", v.company ? v.company + " · " + v.industry : "", v.value ? short(Number(v.value)) + " · " + stages[v.stage] : ""];
  return <>{pageHead("A four-step onboarding flow. Finishing creates real records you can find in Contacts, Deals, and Tasks.")}<div className="dash">
 <form ref={form} className="panel span-8 wizard" onSubmit={submit}><div className="panel-head"><div><h3>Client onboarding</h3><p>Each step is checked before you move on</p></div><Badge tone={done ? "success" : ""}>{done ? "Done" : "Step " + (step + 1) + " of " + steps.length}</Badge></div>{done ? <div className="wizard-done"><span className="done-icon"><Icon name="tick" size={34} /></span><h4 ref={head} tabIndex="-1">{done.contact.company} is onboarded</h4><p>Added <b>{done.contact.name}</b> to Contacts and <b>{done.deal.title}</b> ({short(done.deal.value)}, {stages[done.deal.stage]}) to the pipeline{done.task ? ", plus a kickoff task" : ""}.</p><div className="actions"><Button type="button" icon="contact" onClick={() => go("Contacts")}>View contacts</Button><Button type="button" icon="briefcase" onClick={() => go("Deals")}>Open pipeline</Button><Button type="button" kind="primary" icon="plus" onClick={restart}>Onboard another</Button></div></div> : <><ol className="wizard-steps">{steps.map(([label, sub], i) => <li key={label} className={i < step ? "done" : i === step ? "current" : ""}><button type="button" disabled={i > reached} aria-current={i === step ? "step" : void 0} onClick={() => jump(i)}><span className="step-dot">{i < step ? <Icon name="tick" size={14} /> : i + 1}</span><span><b>{label}</b><small>{sub}</small></span></button></li>)}</ol><div className="progress wizard-bar" role="progressbar" aria-label="Onboarding progress" aria-valuenow={step + 1} aria-valuemin="1" aria-valuemax={steps.length} aria-valuetext={"Step " + (step + 1) + " of " + steps.length}><span style={{ width: (step + 1) / steps.length * 100 + "%" }} /></div><h4 className="step-title" ref={head} tabIndex="-1">{steps[step][0]}<small>{steps[step][1]}</small></h4><div className="step-body" key={step}>{body[step]}</div><div className="wizard-actions"><Button type="button" disabled={!step} onClick={() => setStep(step - 1)}>Back</Button><span>Step {step + 1} of {steps.length}</span><Button kind="primary" type="submit" icon={step === 3 ? "check" : void 0}>{step === 3 ? "Create client" : "Next: " + steps[step + 1][0]}</Button></div></>}</form>
 <div className="stack span-4"><Panel title="Progress" sub={pct + "% of required fields filled"}><div className="ring-hero"><Ring value={pct} size={88} stroke={8} tone={done ? "k-success" : "k-accent"} label={pct + "% complete"}>{pct}%</Ring><span><b>{done ? "Client created" : steps[step][0]}</b><small>{done ? "Records saved in this browser" : steps[step][1]}</small></span></div><ul className="info-list">{steps.slice(0, 3).map(([label], i) => <li key={label}><Icon name={["user", "briefcase", "target"][i]} size={16} /><span>{label}<small className="sub-line">{summary[i] || "Not filled in yet"}</small></span><Badge tone={done || i < step ? "success" : i === step ? "low" : ""}>{done || i < step ? "Done" : i === step ? "Now" : "To do"}</Badge></li>)}</ul></Panel><Panel title="On finish" sub="What Create client does"><ol className="timeline">{onFinish.map(([icon, t, s]) => <li key={t}><span className="timeline-icon"><Icon name={icon} size={15} /></span><span><b>{t}</b><small>{s}</small></span></li>)}</ol></Panel></div>
 </div></>;
}
const starter = "<h2>Kickoff notes</h2><p>Thanks for joining the <b>Northwind</b> onboarding call. Here is what we agreed.</p><ul><li>Import 1,200 contacts by <i>Nov 14</i></li><li>Weekly pipeline review every Monday</li></ul><h3>Next steps</h3><p>Alex sends the import template today. Amelia confirms the field mapping.</p><blockquote>Keep it simple for the sales team.</blockquote>";
const marks = [["bold", "Bold", <b>B</b>], ["italic", "Italic", <i>I</i>], ["underline", "Underline", <u>U</u>], ["strikeThrough", "Strikethrough", <s>S</s>]];
const lists = [["insertUnorderedList", "Bulleted list", "list"], ["insertOrderedList", "Numbered list", "olist"]];
const blockTypes = [["p", "Paragraph"], ["h2", "Heading"], ["h3", "Subheading"], ["blockquote", "Quote"]];
const anchorOf = (node, root) => {
  const el = node?.nodeType === 3 ? node.parentElement : node, a = el?.closest?.("a");
  return a && root.contains(a) ? a : null;
};
function RichText({ setToast }) {
  const area = useRef(), range = useRef(null), linkField = useRef();
  const [on, setOn] = useState({}), [info, setInfo] = useState({ words: 0, chars: 0, heads: [], html: "" }), [link, setLink] = useState(null);
  const measure = () => {
    const el = area.current, text = el.innerText.replace(/\s+/g, " ").trim();
    setInfo({ words: text ? text.split(" ").length : 0, chars: text.length, heads: [...el.querySelectorAll("h2, h3")].map((h) => [h.tagName, h.textContent]), html: el.innerHTML });
  };
  useLayoutEffect(() => {
    area.current.innerHTML = starter;
    measure();
    const sync = () => {
      const sel = document.getSelection();
      if (!sel.rangeCount || !area.current?.contains(sel.anchorNode)) return;
      range.current = sel.getRangeAt(0).cloneRange();
      const b = String(document.queryCommandValue("formatBlock") || "p").toLowerCase().replace(/[<>]/g, "");
      setOn({ ...Object.fromEntries([...marks, ...lists].map(([c]) => [c, document.queryCommandState(c)])), block: blockTypes.some(([t]) => t === b) ? b : "p" });
    };
    document.addEventListener("selectionchange", sync);
    return () => document.removeEventListener("selectionchange", sync);
  }, []);
  const restore = () => {
    area.current.focus();
    const sel = document.getSelection();
    if (range.current) {
      sel.removeAllRanges();
      sel.addRange(range.current);
    }
  };
  const run = (cmd, arg) => {
    restore();
    document.execCommand(cmd, false, arg);
    measure();
  };
  const openLink = () => {
    setLink(anchorOf(range.current?.startContainer, area.current)?.getAttribute("href") || "");
    requestAnimationFrame(() => linkField.current?.focus());
  };
  const closeLink = () => {
    setLink(null);
    restore();
  };
  const applyLink = (e) => {
    e.preventDefault();
    let url = link.trim();
    if (url && !/^(https?:|mailto:)/i.test(url)) url = "https://" + url.replace(/^\/+/, "");
    restore();
    const sel = document.getSelection(), a = anchorOf(sel.anchorNode, area.current);
    if (!url) document.execCommand("unlink");
    else if (a && sel.isCollapsed) a.setAttribute("href", url);
    else if (sel.isCollapsed) document.execCommand("insertHTML", false, '<a href="' + esc(url) + '">' + esc(url) + "</a>");
    else document.execCommand("createLink", false, url);
    setLink(null);
    measure();
  };
  const paste = (e) => {
    e.preventDefault();
    document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
  };
  const drop = (e) => {
    e.preventDefault();
    const text = e.dataTransfer.getData("text/plain"), p = !document.caretRangeFromPoint && document.caretPositionFromPoint?.(e.clientX, e.clientY);
    if (!text) return;
    let r = document.caretRangeFromPoint?.(e.clientX, e.clientY);
    if (!r && p) {
      r = document.createRange();
      r.setStart(p.offsetNode, p.offset);
    }
    area.current.focus();
    if (r) {
      const sel = document.getSelection();
      sel.removeAllRanges();
      sel.addRange(r);
    }
    document.execCommand("insertText", false, text);
    measure();
  };
  const goTo = (i) => {
    const h = area.current.querySelectorAll("h2, h3")[i];
    if (!h) return;
    const r = document.createRange();
    r.selectNodeContents(h);
    r.collapse(false);
    range.current = r;
    restore();
    h.scrollIntoView({ block: "nearest" });
  };
  const tool = (label, pressed, act, glyph) => <button key={label} type="button" className="tool" aria-label={label} aria-pressed={pressed} onMouseDown={keep} onClick={act}>{glyph}</button>;
  return <><section className="panel span-8"><div className="panel-head"><div><h3>Rich text editor</h3><p>Toolbar, Ctrl or ⌘ + B/I/U, links, and plain-text paste</p></div><Button kind="subtle" onClick={() => copy(info.html, setToast, "HTML copied")}>Copy HTML</Button></div><div className="editor"><div className="toolbar" role="toolbar" aria-label="Text formatting" onKeyDown={roam}><select aria-label="Text style" value={on.block || "p"} onChange={(e) => run("formatBlock", "<" + e.target.value + ">")}>{blockTypes.map(([t, l]) => <option key={t} value={t}>{l}</option>)}</select><i className="tool-sep" />{marks.map(([c, l, glyph]) => tool(l, !!on[c], () => run(c), glyph))}<i className="tool-sep" />{lists.map(([c, l, icon]) => tool(l, !!on[c], () => run(c), <Icon name={icon} size={17} />))}{tool("Quote", on.block === "blockquote", () => run("formatBlock", on.block === "blockquote" ? "<p>" : "<blockquote>"), <Icon name="quote" size={17} />)}<i className="tool-sep" />{tool("Link", link !== null, openLink, <Icon name="link" size={17} />)}{tool("Clear formatting", void 0, () => run("removeFormat"), <Icon name="eraser" size={17} />)}<span className="tool-end">{tool("Undo", void 0, () => run("undo"), <Icon name="undo" size={17} />)}{tool("Redo", void 0, () => run("redo"), <Icon name="redo" size={17} />)}</span></div>{link !== null && <form className="link-bar" onSubmit={applyLink}><Icon name="link" size={16} /><input ref={linkField} aria-label="Link address" inputMode="url" placeholder="https://example.com" value={link} onChange={(e) => setLink(e.target.value)} onKeyDown={(e) => {
    if (e.key !== "Escape") return;
    e.preventDefault();
    closeLink();
  }} /><Button type="submit" kind="primary">Apply</Button><Button type="button" onClick={() => {
    restore();
    document.execCommand("unlink");
    setLink(null);
    measure();
  }}>Remove link</Button></form>}<div ref={area} className="editor-area prose" contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" aria-label="Kickoff notes" spellCheck="true" onInput={measure} onPaste={paste} onDrop={drop} /><div className="editor-foot"><span>{plural(info.words, "word")} · {plural(info.chars, "character")}</span><span>About {plural(Math.max(1, Math.ceil(info.words / 200)), "minute")} to read</span></div></div></section><div className="stack span-4"><Panel title="Outline" sub="Headings in the document. Select one to jump to it.">{info.heads.length ? <ul className="outline">{info.heads.map(([tag, text], i) => <li key={i} className={tag === "H3" ? "sub" : ""}><button type="button" className="text-btn" onClick={() => goTo(i)}>{text.trim() || "Untitled heading"}</button></li>)}</ul> : <Empty text="No headings yet">Choose Heading in the text style menu to add one.</Empty>}</Panel><Panel title="HTML output" sub="What a form would send to the server"><pre className="code-out">{info.html}</pre></Panel></div></>;
}
const mdStart = "## Proposal outline\n\nA **calm** CRM rollout for _Northwind_ in three phases:\n\n1. Import contacts and deals\n2. Train the sales team\n3. Review the pipeline every week\n\n> Ship small, review often.\n\nRead the [onboarding guide](https://example.com/guide) or run `npm run build` to try it.\n\n- Owner: Alex Brown\n- Budget: $32K";
const mdTools = [["Bold", <b>B</b>, ["**", "**", "bold text"]], ["Italic", <i>I</i>, ["_", "_", "italic text"]], ["Heading", <b>H</b>, ["## ", /^#{1,6} /]], ["Bulleted list", <Icon name="list" size={17} />, ["- ", /^[-*] /]], ["Numbered list", <Icon name="olist" size={17} />, ["1. ", /^\d+\. /]], ["Quote", <Icon name="quote" size={17} />, ["> ", /^> ?/]], ["Link", <Icon name="link" size={17} />, ["[", "](https://)", "link text"]], ["Code", <Icon name="code" size={17} />, ["`", "`", "code"]]];
function inline(text) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|_[^_]+_|\*[^*]+\*)/g).map((p, i) => {
    if (i % 2 === 0) return p;
    if (p.startsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("`")) return <code key={i}>{p.slice(1, -1)}</code>;
    const m = p.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (m) return /^(https?:|mailto:)/i.test(m[2]) ? <a key={i} href={m[2]} target="_blank" rel="noreferrer">{m[1]}</a> : m[1];
    return <em key={i}>{p.slice(1, -1)}</em>;
  });
}
function markdown(src) {
  const out = [], lines = src.replace(/\r/g, "").split("\n"), block = /^(#{1,3}\s|>|\s*[-*]\s|\s*\d+[.)]\s|```)/;
  const take = (re) => {
    const xs = [];
    while (i < lines.length && re.test(lines[i])) xs.push(lines[i++].replace(re, ""));
    return xs;
  };
  let i = 0;
  while (i < lines.length) {
    const l = lines[i], h = l.match(/^(#{1,3})\s+(.*)/), k = out.length;
    if (/^```/.test(l)) {
      const code = [];
      for (i++; i < lines.length && !/^```/.test(lines[i]); ) code.push(lines[i++]);
      i++;
      out.push(<pre key={k}><code>{code.join("\n")}</code></pre>);
    } else if (h) {
      const T = "h" + (h[1].length + 2);
      out.push(<T key={k}>{inline(h[2])}</T>);
      i++;
    } else if (/^>/.test(l)) out.push(<blockquote key={k}>{inline(take(/^>\s?/).join(" "))}</blockquote>);
    else if (/^\s*[-*]\s+/.test(l)) out.push(<ul key={k}>{take(/^\s*[-*]\s+/).map((t, j) => <li key={j}>{inline(t)}</li>)}</ul>);
    else if (/^\s*\d+[.)]\s+/.test(l)) out.push(<ol key={k}>{take(/^\s*\d+[.)]\s+/).map((t, j) => <li key={j}>{inline(t)}</li>)}</ol>);
    else if (!l.trim()) i++;
    else {
      const p = [l];
      for (i++; i < lines.length && lines[i].trim() && !block.test(lines[i]); ) p.push(lines[i++]);
      out.push(<p key={k}>{inline(p.join(" "))}</p>);
    }
  }
  return out;
}
function Markdown({ setToast }) {
  const ta = useRef(), [text, setText] = useState(mdStart), [mode, setMode] = useState("Split");
  const edit = (next, s, e) => {
    setText(next);
    requestAnimationFrame(() => {
      ta.current.focus();
      ta.current.setSelectionRange(s, e);
    });
  };
  const wrap = ([a, b, ph]) => {
    const el = ta.current, s = el.selectionStart, e = el.selectionEnd, sel = text.slice(s, e) || ph;
    edit(text.slice(0, s) + a + sel + b + text.slice(e), s + a.length, s + a.length + sel.length);
  };
  const prefix = ([p, re]) => {
    const el = ta.current, start = text.lastIndexOf("\n", el.selectionStart - 1) + 1, end = el.selectionEnd, rows = text.slice(start, end).split("\n"), off = rows.every((r) => re.test(r));
    const next = rows.map((r, i) => off ? r.replace(re, "") : (p === "1. " ? i + 1 + ". " : p) + r.replace(re, "")).join("\n");
    edit(text.slice(0, start) + next + text.slice(end), start, start + next.length);
  };
  const act = (a) => a[1] instanceof RegExp ? prefix(a) : wrap(a);
  const keys = (e) => {
    const k = (e.metaKey || e.ctrlKey) && { b: 0, i: 1, k: 6 }[e.key.toLowerCase()];
    if (k === void 0 || k === false) return;
    e.preventDefault();
    act(mdTools[k][2]);
  };
  const count = text.trim() ? text.trim().split(/\s+/).length : 0;
  return <section className="panel span-12"><div className="panel-head"><div><h3>Markdown editor</h3><p>The toolbar wraps the selection. The preview is built from React elements, never raw HTML.</p></div><Segmented label="Editor view" options={["Write", "Split", "Preview"]} value={mode} onChange={setMode} /></div><div className={"md " + mode.toLowerCase()}>{mode !== "Preview" && <><div className="toolbar" role="toolbar" aria-label="Markdown formatting" onKeyDown={roam}>{mdTools.map(([label, glyph, a]) => <button key={label} type="button" className="tool" aria-label={label} onMouseDown={keep} onClick={() => act(a)}>{glyph}</button>)}<span className="tool-end tool-note">Ctrl or ⌘ + B, I, K</span></div><textarea ref={ta} aria-label="Markdown source" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={keys} spellCheck="true" /></>}{mode !== "Write" && <div className="md-preview prose" role="region" aria-label="Preview">{markdown(text)}</div>}</div><div className="editor-foot plain"><span>{plural(count, "word")} · {plural(text.split("\n").length, "line")}</span><Button kind="subtle" onClick={() => copy(text, setToast, "Markdown copied")}>Copy Markdown</Button></div></section>;
}
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const clockNow = () => {
  const n = /* @__PURE__ */ new Date();
  return String(n.getHours()).padStart(2, "0") + ":" + String(n.getMinutes()).padStart(2, "0");
};
function Mentions({ data, setToast }) {
  const id = useId(), ta = useRef(), people = data.team;
  const [text, setText] = useState(""), [menu, setMenu] = useState(null), [at, setAt] = useState(0), [posts, setPosts] = useState(() => [{ id: 1, who: "AB", name: "Alex Brown", text: "@" + (people[0]?.name || "Cut Rahma") + " the Northwind import file is ready for review.", time: "09:12" }]);
  const hits = menu ? people.filter((m) => m.name.toLowerCase().includes(menu.q.toLowerCase())).slice(0, 5) : [], active = hits[Math.min(at, hits.length - 1)];
  const names = people.map((m) => m.name).sort((a, b) => b.length - a.length), re = names.length ? new RegExp("(@(?:" + names.map(escRe).join("|") + "))", "g") : null;
  const tagged = names.filter((n) => text.includes("@" + n));
  const detect = (el) => {
    const m = el.value.slice(0, el.selectionStart).match(/(?:^|\s)@(\w*)$/);
    setMenu(m ? { q: m[1], start: el.selectionStart - m[1].length - 1 } : null);
  };
  const pick = (p) => {
    const el = ta.current, next = text.slice(0, menu.start) + "@" + p.name + " " + text.slice(el.selectionStart), pos = menu.start + p.name.length + 2;
    setText(next);
    setMenu(null);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  };
  const post = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setPosts([...posts, { id: Date.now(), who: initials(data.settings.name), name: data.settings.name, text: text.trim(), time: clockNow() }]);
    setText("");
    setMenu(null);
    setToast(tagged.length ? "Comment posted. " + listText(tagged) + " would get a notification." : "Comment posted", { tone: "info" });
  };
  const keys = (e) => {
    if (menu && hits.length) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        return setAt((i) => (Math.min(i, hits.length - 1) + (e.key === "ArrowDown" ? 1 : hits.length - 1)) % hits.length);
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        return pick(active);
      }
      if (e.key === "Escape") {
        e.preventDefault();
        return setMenu(null);
      }
    }
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) post(e);
  };
  return <><ul className="comment-list">{posts.map((p) => <li key={p.id}><Avatar text={p.who} tone={p.who === "AB" ? 3 : 0} small /><div><span className="comment-meta"><b>{p.name}</b><small>{p.time}</small></span><p>{re ? p.text.split(re).map((part, i) => i % 2 ? <span className="mention" key={i}>{part}</span> : part) : p.text}</p></div></li>)}</ul><form onSubmit={post}><div className="combo-box"><label htmlFor={id} className="sr-only">Write a comment</label><textarea ref={ta} id={id} rows="3" value={text} placeholder="Write a comment. Type @ to mention someone." aria-describedby={id + "-hint"} aria-controls={id + "-list"} aria-activedescendant={menu && active ? id + "-" + active.id : void 0} onChange={(e) => {
    setText(e.target.value);
    detect(e.target);
    setAt(0);
  }} onKeyDown={keys} onClick={(e) => detect(e.target)} onBlur={() => setMenu(null)} />{menu && hits.length > 0 && <ul className="listbox" id={id + "-list"} role="listbox" aria-label="Teammates to mention">{hits.map((m) => <li key={m.id} id={id + "-" + m.id} role="option" aria-selected={m === active} className={m === active ? "active" : ""} onMouseDown={(e) => {
    e.preventDefault();
    pick(m);
  }}><Avatar text={initials(m.name)} tone={m.id % 4} small /><span><b>{m.name}</b><small>{m.role}</small></span></li>)}</ul>}</div><div className="composer-foot"><Hint id={id + "-hint"}>{tagged.length ? "Mentions: " + listText(tagged) : "Ctrl or ⌘ + Enter posts the comment"}</Hint><Button kind="primary" type="submit" icon="message" disabled={!text.trim()}>Comment</Button></div></form></>;
}
function Limits() {
  const id = useId(), [sms, setSms] = useState("Hi Olivia, your Bloom Studio proposal is ready. Reply YES to book a 20-minute call this week."), [title, setTitle] = useState("Mellow Admin | A calm CRM dashboard template");
  const max = 160, left = max - sms.length, ratio = sms.length / max, tmax = 60, tleft = tmax - title.length;
  return <div className="form-stack"><div className="field"><label htmlFor={id}>Text message</label><textarea id={id} rows="4" value={sms} onChange={(e) => setSms(e.target.value)} aria-invalid={left < 0 || void 0} aria-describedby={id + "-left"} /><div className="limit-row"><Ring value={Math.min(ratio * 100, 100)} size={36} stroke={4} tone={left < 0 ? "k-danger" : ratio > 0.9 ? "k-warning" : "k-accent"} label={sms.length + " of " + max + " characters used"}>{left <= 20 ? left : ""}</Ring><Hint id={id + "-left"} tone={left < 0 ? "error" : ratio > 0.9 ? "warning" : ""}>{left < 0 ? plural(-left, "character") + " over the limit" : plural(left, "character") + " left"}</Hint><Badge>{plural(sms.length <= max ? 1 : Math.ceil(sms.length / 153), "message")}</Badge></div></div><div className="field"><label htmlFor={id + "-t"}>Page title</label><input id={id + "-t"} value={title} onChange={(e) => setTitle(e.target.value)} aria-invalid={tleft < 0 || void 0} aria-describedby={id + "-tl"} /><span className={"progress" + (tleft < 0 ? " over" : tleft < 10 ? " warn" : "")} aria-hidden="true"><span style={{ width: Math.min(title.length / tmax * 100, 100) + "%" }} /></span><Hint id={id + "-tl"} tone={tleft < 0 ? "error" : ""}>{tleft < 0 ? "Search results cut titles after about " + tmax + " characters" : "Search results show about " + tmax + " characters"}<span className="counter">{title.length}/{tmax}</span></Hint></div></div>;
}
function Editors(ctx) {
  const { data, pageHead, setToast } = ctx;
  return <>{pageHead("Writing tools for notes, proposals, and comments. Nothing on this page is sent or stored.")}<div className="dash">
 <RichText setToast={setToast} />
 <Markdown setToast={setToast} />
 <Panel span={6} title="Comment with mentions" sub="Type @ to mention a teammate"><Mentions data={data} setToast={setToast} /></Panel>
 <Panel span={6} title="Character limits" sub="Counters that warn before you go over"><Limits /></Panel>
 </div></>;
}
const accepted = ["png", "jpg", "jpeg", "gif", "webp", "svg", "pdf", "doc", "docx", "xls", "xlsx", "csv", "txt", "md", "zip"], maxMB = 10, maxFiles = 8;
const typeTone = { PDF: "k-c1", Sheet: "k-c2", Document: "k-c3", Archive: "k-c4", Image: "k-muted" };
function AvatarUpload({ settings }) {
  const id = useId(), cur = useRef(""), [url, setUrl] = useState(""), [note, setNote] = useState(["PNG, JPG, or WebP up to 2 MB. Square images look best.", ""]);
  useEffect(() => () => cur.current && URL.revokeObjectURL(cur.current), []);
  const pick = (file) => {
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return setNote(["Use a PNG, JPG, or WebP image", "error"]);
    if (file.size > 2e6) return setNote(["Choose an image under 2 MB. This one is " + fmtSize(file.size) + ".", "error"]);
    const u = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      if (cur.current) URL.revokeObjectURL(cur.current);
      cur.current = u;
      setUrl(u);
      const small = Math.min(img.naturalWidth, img.naturalHeight) < 240;
      setNote([img.naturalWidth + " × " + img.naturalHeight + " px · " + fmtSize(file.size) + (small ? ". Under 240 px may look blurry." : ""), small ? "warning" : "success"]);
    };
    img.onerror = () => {
      URL.revokeObjectURL(u);
      setNote(["This image could not be read", "error"]);
    };
    img.src = u;
  };
  const clear = () => {
    if (cur.current) URL.revokeObjectURL(cur.current);
    cur.current = "";
    setUrl("");
    setNote(["Photo removed. Your initials show instead.", ""]);
  };
  return <div className="avatar-upload"><span className="avatar-preview">{url ? <img src={url} alt="Preview of the new profile photo" /> : initials(settings.name)}</span><div className="actions"><label className="btn primary"><input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" aria-describedby={id} onChange={(e) => {
    pick(e.target.files[0]);
    e.target.value = "";
  }} /><Icon name="upload" size={17} /> {url ? "Replace photo" : "Upload photo"}</label>{url && <Button type="button" onClick={clear}>Remove</Button>}</div><Hint id={id} tone={note[1]}>{note[0]}</Hint><small className="fine">Preview only. The photo is not saved.</small></div>;
}
function SingleFiles() {
  const id = useId(), [contract, setContract] = useState(null), [files, setFiles] = useState([]), [err, setErr] = useState(""), limit = 25e6;
  const total = files.reduce((a, f) => a + f.size, 0);
  const attach = (list) => {
    const next = [...files];
    let msg = "";
    for (const f of list) {
      if (next.some((x) => x.name === f.name && x.size === f.size)) continue;
      if (next.length >= 5) {
        msg = "You can attach up to 5 files";
        break;
      }
      if (next.reduce((a, x) => a + x.size, 0) + f.size > limit) {
        msg = f.name + " would go over the 25 MB total";
        continue;
      }
      next.push({ id: Date.now() + Math.random(), name: f.name, size: f.size });
    }
    setFiles(next);
    setErr(msg);
  };
  return <div className="form-stack"><div className="field"><span id={id + "-c"}>Signed contract (PDF)</span><div className="file-pick"><label className="btn"><input type="file" accept=".pdf,application/pdf" className="sr-only" aria-labelledby={id + "-c"} aria-describedby={id + "-cn"} onChange={(e) => {
    const f = e.target.files[0];
    if (f) setContract(/\.pdf$/i.test(f.name) ? { name: f.name, size: f.size } : { error: "Choose a PDF file. " + f.name + " is not one." });
    e.target.value = "";
  }} /><Icon name="file" size={17} /> Choose file</label><span id={id + "-cn"} className={"file-name" + (contract?.name ? " set" : "")}>{contract?.name ? contract.name + " · " + fmtSize(contract.size) : "No file chosen"}</span>{contract?.name && <button type="button" className="icon-btn" aria-label={"Clear " + contract.name} onClick={() => setContract(null)}><Icon name="close" size={15} /></button>}</div>{contract?.error && <Hint tone="error">{contract.error}</Hint>}</div><div className="field"><span id={id + "-a"}>Message attachments</span><label className="btn dashed"><input type="file" multiple className="sr-only" aria-labelledby={id + "-a"} aria-describedby={id + "-ah"} onChange={(e) => {
    attach(e.target.files);
    e.target.value = "";
  }} /><Icon name="plus" size={17} /> Add attachments</label>{files.length > 0 && <ul className="attach-list">{files.map((f) => <li className="tag" key={f.id}><Icon name="file" size={12} /><span>{f.name}</span><small>{fmtSize(f.size)}</small><button type="button" aria-label={"Remove " + f.name} onClick={() => {
    setFiles(files.filter((x) => x.id !== f.id));
    setErr("");
  }}><Icon name="close" size={12} /></button></li>)}</ul>}<Hint id={id + "-ah"} tone={err ? "error" : ""}>{err || plural(files.length, "file") + " · " + fmtSize(total) + " of 25 MB"}</Hint></div></div>;
}
function Upload(ctx) {
  const { data, update, log, setToast, pageHead } = ctx, depth = useRef(0), live = useRef([]);
  const [items, setItems] = useState([]), [over, setOver] = useState(false);
  live.current = items;
  useEffect(() => {
    const stop = (e) => e.dataTransfer?.types?.includes("Files") && e.preventDefault();
    window.addEventListener("dragover", stop);
    window.addEventListener("drop", stop);
    return () => {
      window.removeEventListener("dragover", stop);
      window.removeEventListener("drop", stop);
      live.current.forEach((f) => f.url && URL.revokeObjectURL(f.url));
    };
  }, []);
  const uploading = items.some((f) => f.status === "uploading");
  useEffect(() => {
    if (!uploading) return;
    const t = setInterval(() => setItems((xs) => xs.map((f) => f.status !== "uploading" ? f : f.progress >= 100 ? { ...f, status: "done" } : { ...f, progress: Math.min(100, f.progress + (6 + Math.random() * 16) * Math.min(1.6, Math.max(0.3, 1e6 / Math.max(f.size, 1)))) })), 260);
    return () => clearInterval(t);
  }, [uploading]);
  const add = (files) => {
    let room = maxFiles - items.filter((f) => f.status !== "error").length;
    const next = [...files].map((f, i) => {
      const ext = f.name.includes(".") ? f.name.split(".").pop().toLowerCase() : "", error = !accepted.includes(ext) ? "This file type is not supported" : f.size > maxMB * 1e6 ? "Larger than " + maxMB + " MB" : room <= 0 ? "The queue is full (" + maxFiles + " files)" : "";
      if (!error) room--;
      return { id: Date.now() + "-" + i, name: f.name, size: f.size, type: fileType(f.name), status: error ? "error" : "uploading", progress: 0, error, url: !error && f.type.startsWith("image/") ? URL.createObjectURL(f) : "" };
    });
    if (!next.length) return;
    setItems((xs) => [...next, ...xs]);
    const bad = next.filter((f) => f.error).length;
    if (bad) setToast(plural(bad, "file") + " could not be added", { tone: "error" });
  };
  const discard = (f) => {
    if (f.url) URL.revokeObjectURL(f.url);
    setItems((xs) => xs.filter((x) => x.id !== f.id));
  };
  const clear = () => {
    items.forEach((f) => f.url && URL.revokeObjectURL(f.url));
    setItems([]);
  };
  const ready = items.filter((f) => f.status === "done"), queued = items.filter((f) => f.status === "uploading"), rejected = items.filter((f) => f.status === "error"), kept = items.filter((f) => !f.error), bytes = kept.reduce((a, f) => a + f.size, 0);
  const save = () => {
    const rows = ready.map((f, i) => ({ id: Date.now() + i, name: f.name, type: f.type, size: fmtSize(f.size), owner: initials(data.settings.name), date: localDay(), folder: "Uploads" }));
    update("files", (xs) => [...rows, ...xs]);
    log("Uploaded " + plural(rows.length, "file"), "file");
    ready.forEach((f) => f.url && URL.revokeObjectURL(f.url));
    setItems((xs) => xs.filter((x) => x.status !== "done"));
    setToast(plural(rows.length, "file record") + " added to Files");
  };
  const parts = Object.keys(typeTone).map((t) => {
    const xs = kept.filter((f) => f.type === t);
    return { label: t, tone: typeTone[t], value: xs.reduce((a, f) => a + f.size, 0), sub: plural(xs.length, "file") };
  }).filter((p) => p.value > 0);
  return <>{pageHead("Drag and drop, previews, progress, and limits. Files stay in this tab. Saving adds their names and sizes to Files.")}<div className="stats"><StatCard tone="s1" icon="upload" value={queued.length} label="Uploading" note="Simulated progress" /><StatCard tone="s3" icon="check" value={ready.length} label="Ready to save" note={ready.length ? "Save adds them to Files" : "Nothing finished yet"} /><StatCard tone="s2" icon="alert" value={rejected.length} label="Rejected" note="Type, size, or queue limit" /><StatCard tone="s4" icon="layers" value={fmtSize(bytes)} label="Queue size" note={"Up to " + maxMB + " MB per file"} /></div><div className="dash">
 <Panel span={8} title="Drop zone" sub={plural(items.length, "file") + " in the queue"} action={items.length > 0 && <Button kind="subtle" onClick={clear}>Clear all</Button>}><label className={"dropzone" + (over ? " over" : "")} onDragEnter={(e) => {
    e.preventDefault();
    depth.current++;
    setOver(true);
  }} onDragOver={(e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }} onDragLeave={() => {
    depth.current = Math.max(0, depth.current - 1);
    if (!depth.current) setOver(false);
  }} onDrop={(e) => {
    e.preventDefault();
    depth.current = 0;
    setOver(false);
    add(e.dataTransfer.files);
  }}><input type="file" multiple className="sr-only" accept={accepted.map((x) => "." + x).join(",")} onChange={(e) => {
    add(e.target.files);
    e.target.value = "";
  }} /><span className="stat-icon"><Icon name="upload" size={24} /></span><b>Drop files here or <u>browse</u></b><small>Images, PDF, Office, CSV, text, and ZIP · up to {maxMB} MB each · {maxFiles} files</small></label>{items.length > 0 && <ul className="upload-list">{items.map((f) => <li key={f.id} className={"upload-item " + f.status}>{f.url ? <img className="upload-thumb" src={f.url} alt="" /> : <span className="file-icon">{f.type.slice(0, 3).toUpperCase()}</span>}<span className="upload-main"><b title={f.name}>{f.name}</b>{f.status === "error" ? <Hint tone="error">{f.error}</Hint> : <small>{fmtSize(f.size)} · {f.status === "done" ? "Uploaded" : Math.round(f.progress) + "%"}</small>}{f.status === "uploading" && <span className="progress" role="progressbar" aria-label={"Uploading " + f.name} aria-valuenow={Math.round(f.progress)} aria-valuemin="0" aria-valuemax="100"><span style={{ width: f.progress + "%" }} /></span>}</span>{f.status === "done" && <Icon name="tick" size={18} />}<button type="button" className="icon-btn" aria-label={(f.status === "uploading" ? "Cancel upload of " : "Remove ") + f.name} onClick={() => discard(f)}><Icon name={f.status === "uploading" ? "close" : "trash"} size={15} /></button></li>)}</ul>}<div className="upload-foot"><span>{ready.length ? plural(ready.length, "file") + " ready to save" : "Finished uploads can be saved to Files"}</span><Button kind="primary" icon="folder" disabled={!ready.length} onClick={save}>Save to Files</Button></div></Panel>
 <div className="stack span-4"><Panel title="Profile photo" sub="Preview before you save"><AvatarUpload settings={data.settings} /></Panel><Panel title="Upload rules" sub="Checked before a file joins the queue"><ul className="info-list"><li><Icon name="file" size={16} /><span>Accepted types</span><b>{accepted.length}</b></li><li><Icon name="layers" size={16} /><span>Largest file</span><b>{maxMB} MB</b></li><li><Icon name="folder" size={16} /><span>Files in the queue</span><b>{maxFiles}</b></li><li><Icon name="shield" size={16} /><span>File contents sent</span><b>Never</b></li></ul><ul className="tag-list" aria-label="Accepted file types">{accepted.map((x) => <li key={x}>.{x}</li>)}</ul></Panel></div>
 <Panel span={6} title="Single file & attachments" sub="Compact pickers for forms and messages"><SingleFiles /></Panel>
 <Panel span={6} title="Queue by type" sub={kept.length ? fmtSize(bytes) + " across " + plural(kept.length, "file") : "Add files to see the split"}>{parts.length ? <Breakdown parts={parts} format={fmtSize} label="Queue size by file type" /> : <Empty text="Nothing queued yet">Drop a few files above to see them grouped by type.</Empty>}</Panel>
 </div></>;
}
const forms = [["Form elements", "input", Elements], ["Advanced inputs", "sliders", Advanced], ["Form layouts", "layout", Layouts], ["Validation", "shield", Validation], ["Wizard", "steps", Wizard], ["Editors", "type", Editors], ["File upload", "upload", Upload]];
function FormPage({ page, ...ctx }) {
  const View = forms.find(([n]) => n === page)[2];
  return <View {...ctx} />;
}
export {
  FormPage,
  forms
};
