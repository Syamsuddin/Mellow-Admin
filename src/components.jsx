import React from "react";
import { createPortal } from "react-dom";
const paths = { home: "M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z", people: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M16 3a4 4 0 0 1 0 8M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0", briefcase: "M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 11l9 4 9-4M3 7h18v14H3Z", message: "M21 3H3v15h5l4 4 4-4h5Z", file: "M5 3h10l4 4v14H5ZM9 12h6m-6 4h6", check: "m7 12 3 3 7-7M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z", calendar: "M3 6h18v15H3Zm0 5h18M7 3v5m10-5v5", chart: "M4 20V10h3v10m4 0V4h3v16m4 0V7h3v13", settings: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2", search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0", bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4", plus: "M12 5v14M5 12h14", arrow: "M7 17 17 7M7 7h10v10", chevron: "m9 5 7 7-7 7", close: "m6 6 12 12M6 18 18 6", download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5", trophy: "M8 3h8v8a4 4 0 0 1-8 0ZM8 5H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 3v5m-4 1h8", target: "M21 12a9 9 0 1 1-9-9m0 9 9-9m-1 6V4h-5M16 12a4 4 0 1 1-4-4", menu: "M4 6h16M4 12h16M4 18h16", grid: "M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z", logout: "M9 3H3v18h6m4-5 5-4-5-4m-6 4h14", sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0", trash: "M3 6h18M8 6V3h8v3M5 6l1 15h12l1-15M10 10v7m4-7v7", cart: "M3 3h2l2 12h11l2-8H7M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z", box: "M12 3 3 7.5v9L12 21l9-4.5v-9ZM3 7.5l9 4.5 9-4.5M12 12v9", layers: "m12 3 9 5-9 5-9-5Zm-9 9 9 5 9-5m-18 4 9 5 9-5", folder: "M3 6h6l2 2h10v12H3Z", user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0", card: "M3 6h18v12H3Zm0 4h18M7 14h4", help: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-2.5-10.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5M12 17h.01", alert: "M12 9v4m0 4h.01M10.3 4.3 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z", activity: "M3 12h4l3-8 4 16 3-8h4", lock: "M6 11h12v10H6Zm3 0V7a3 3 0 0 1 6 0v4", upload: "M12 15V3m-5 5 5-5 5 5M4 16v5h16v-5", edit: "M4 20h4l10-10-4-4L4 16Zm9-13 4 4", clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2", mail: "M3 6h18v12H3Zm0 0 9 7 9-7", eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z", dots: "M6 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm7.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm7.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z", info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v6m0-9.5h.01", contact: "M4 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4ZM12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 6a5 5 0 0 1 10 0M4 7H2m2 5H2m2 5H2" };
function Icon({ name, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.grid} /></svg>;
}
function Button({ children, icon, kind = "", ...props }) {
  return <button className={"btn " + kind} {...props}>{icon && <Icon name={icon} size={17} />} {children}</button>;
}
function Avatar({ text = "MT", tone = 0, small = false }) {
  return <span className={"avatar tone-" + tone + (small ? " small" : "")}>{text}</span>;
}
function Badge({ children, tone = "" }) {
  return <span className={"badge " + tone}>{children}</span>;
}
function Empty({ text = "No results found", children }) {
  return <div className="empty"><Icon name="search" size={28} /><h3>{text}</h3><p>{children || "Try another search or add a new record."}</p></div>;
}
function StatCard({ icon, label, value, tone, note, onClick }) {
  const body = <><span className="stat-icon"><Icon name={icon} size={24} /></span><span><strong>{value}</strong><span className="stat-label">{label}</span>{note && <small>{note}</small>}</span></>;
  return onClick ? <button className={"stat " + tone} onClick={onClick}>{body}<span className="stat-arrow"><Icon name="arrow" size={14} /></span></button> : <div className={"stat " + tone}>{body}</div>;
}
function Menu({ label, items }) {
  const [box, setBox] = React.useState(null), btn = React.useRef(), list = React.useRef();
  const actions = items.filter(Boolean);
  const close = (focus) => {
    setBox(null);
    if (focus) btn.current?.focus();
  };
  React.useEffect(() => {
    if (!box) return;
    list.current.querySelector("button").focus();
    const down = (e) => {
      if (!list.current?.contains(e.target) && !btn.current?.contains(e.target)) close();
    };
    const away = () => close();
    document.addEventListener("mousedown", down);
    window.addEventListener("resize", away);
    window.addEventListener("scroll", away, true);
    return () => {
      document.removeEventListener("mousedown", down);
      window.removeEventListener("resize", away);
      window.removeEventListener("scroll", away, true);
    };
  }, [box]);
  function open() {
    const r = btn.current.getBoundingClientRect(), h = actions.length * 38 + 14;
    setBox({ top: r.bottom + h + 6 > innerHeight ? Math.max(8, r.top - h - 6) : r.bottom + 6, left: Math.min(Math.max(8, r.right - 190), innerWidth - 198) });
  }
  function keys(e) {
    const all = [...list.current.querySelectorAll("button")], i = all.indexOf(document.activeElement);
    if (e.key === "Escape") {
      e.preventDefault();
      close(true);
    } else if (e.key === "Tab") close();
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      all[(i + (e.key === "ArrowDown" ? 1 : all.length - 1)) % all.length].focus();
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      all[e.key === "Home" ? 0 : all.length - 1].focus();
    }
  }
  return <><button ref={btn} type="button" className="more" aria-label={label} aria-haspopup="menu" aria-expanded={!!box} onClick={() => box ? close() : open()}><Icon name="dots" size={18} /></button>{box && createPortal(<div ref={list} role="menu" aria-label={label} className="menu" style={box} onKeyDown={keys}>{actions.map(([text, icon, run, danger]) => <button key={text} type="button" role="menuitem" className={danger ? "danger" : ""} onClick={() => {
    close(true);
    run();
  }}><Icon name={icon} size={16} />{text}</button>)}</div>, document.body)}</>;
}
function Modal({ title, onClose, children }) {
  const ref = React.useRef();
  React.useEffect(() => {
    const previous = document.activeElement;
    ref.current.showModal();
    return () => previous?.focus();
  }, []);
  return <dialog ref={ref} className="modal" onCancel={onClose} onClick={(e) => {
    if (e.target === e.currentTarget) onClose();
  }}><div className="modal-head"><h2>{title}</h2><button className="icon-btn" aria-label="Close dialog" onClick={onClose}><Icon name="close" /></button></div>{children}</dialog>;
}
function Field({ label, children, ...props }) {
  return <label className="field"><span>{label}</span>{children || <input {...props} />}</label>;
}
function RevenueChart({ period = "6 months" }) {
  const values = period === "3 months" ? [58, 74, 101] : [32, 48, 43, 58, 74, 101];
  const months = period === "3 months" ? ["Sep", "Oct", "Nov"] : ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
  return <div className="revenue-chart" role="img" aria-label={"Sample monthly revenue in thousands of dollars: " + months.map((m, i) => m + " " + values[i]).join(", ")}><div className="chart-y"><span>$120K</span><span>$80K</span><span>$40K</span><span>$0</span></div><div className="bars">{values.map((n, i) => <div className="bar-group" key={i}><div className="bar-track"><div className={"bar " + (i === values.length - 1 ? "active" : "")} style={{ height: n / 120 * 100 + "%" }} tabIndex="0"><span>${n}K</span></div></div><small>{months[i]}</small></div>)}</div></div>;
}
export {
  Avatar,
  Badge,
  Button,
  Empty,
  Field,
  Icon,
  Menu,
  Modal,
  RevenueChart,
  StatCard
};
