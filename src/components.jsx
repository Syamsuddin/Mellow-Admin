import React from "react";
import { createPortal } from "react-dom";
const paths = { home: "M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z", people: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M16 3a4 4 0 0 1 0 8M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0", briefcase: "M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 11l9 4 9-4M3 7h18v14H3Z", message: "M21 3H3v15h5l4 4 4-4h5Z", file: "M5 3h10l4 4v14H5ZM9 12h6m-6 4h6", check: "m7 12 3 3 7-7M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z", calendar: "M3 6h18v15H3Zm0 5h18M7 3v5m10-5v5", chart: "M4 20V10h3v10m4 0V4h3v16m4 0V7h3v13", settings: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2", search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0", bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4", plus: "M12 5v14M5 12h14", arrow: "M7 17 17 7M7 7h10v10", chevron: "m9 5 7 7-7 7", close: "m6 6 12 12M6 18 18 6", download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5", trophy: "M8 3h8v8a4 4 0 0 1-8 0ZM8 5H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 3v5m-4 1h8", target: "M21 12a9 9 0 1 1-9-9m0 9 9-9m-1 6V4h-5M16 12a4 4 0 1 1-4-4", menu: "M4 6h16M4 12h16M4 18h16", grid: "M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z", logout: "M9 3H3v18h6m4-5 5-4-5-4m-6 4h14", sun: "M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0", trash: "M3 6h18M8 6V3h8v3M5 6l1 15h12l1-15M10 10v7m4-7v7", cart: "M3 3h2l2 12h11l2-8H7M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z", box: "M12 3 3 7.5v9L12 21l9-4.5v-9ZM3 7.5l9 4.5 9-4.5M12 12v9", layers: "m12 3 9 5-9 5-9-5Zm-9 9 9 5 9-5m-18 4 9 5 9-5", folder: "M3 6h6l2 2h10v12H3Z", user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0", card: "M3 6h18v12H3Zm0 4h18M7 14h4", help: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-2.5-10.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5M12 17h.01", alert: "M12 9v4m0 4h.01M10.3 4.3 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z", activity: "M3 12h4l3-8 4 16 3-8h4", lock: "M6 11h12v10H6Zm3 0V7a3 3 0 0 1 6 0v4", upload: "M12 15V3m-5 5 5-5 5 5M4 16v5h16v-5", edit: "M4 20h4l10-10-4-4L4 16Zm9-13 4 4", clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2", mail: "M3 6h18v12H3Zm0 0 9 7 9-7", eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z", dots: "M6 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm7.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm7.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z", info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v6m0-9.5h.01", contact: "M4 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4ZM12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5 6a5 5 0 0 1 10 0M4 7H2m2 5H2m2 5H2", tick: "m5 12.5 4.5 4.5L19 7.5", eyeOff: "M3 3l18 18M10.6 5.1Q11.3 5 12 5c6 0 10 7 10 7a16 16 0 0 1-3 3.8M6.6 6.6C3.7 8.4 2 12 2 12s4 7 10 7a9.6 9.6 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2", refresh: "M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5", shield: "M12 3 4 6v6c0 4.6 3.4 8 8 9 4.6-1 8-4.4 8-9V6Zm-3 9 2 2 4-4", pause: "M9 5v14m6-14v14", play: "M8 5v14l11-7Z", copy: "M9 9h11v11H9ZM5 15H4V4h11v1", key: "M14.5 9.5 4 20m3-3 3 3m-1-6 2.5 2.5M20 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0", sparkle: "M12 3c.7 4.6 2.4 6.3 7 7-4.6.7-6.3 2.4-7 7-.7-4.6-2.4-6.3-7-7 4.6-.7 6.3-2.4 7-7Zm7 11c.3 2 .9 2.6 3 3-2.1.4-2.7 1-3 3-.3-2-.9-2.6-3-3 2.1-.4 2.7-1 3-3Z", globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3.6 9h16.8M3.6 15h16.8M12 3c-2.5 2.6-3.8 5.6-3.8 9s1.3 6.4 3.8 9m0-18c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9", bag: "M5 8h14l-1 13H6ZM9 8V6a3 3 0 0 1 6 0v2" };
function Icon({ name, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.grid} /></svg>;
}
function Button({ children, icon, kind = "", ...props }) {
  return <button className={"btn " + kind} {...props}>{icon && <Icon name={icon} size={17} />} {children}</button>;
}
function Avatar({ text = "MT", tone = 0, small = false, photo }) {
  return <span className={"avatar tone-" + tone + (small ? " small" : "") + (photo ? " photo" : "")}>{photo ? <img src={photo} alt="" /> : text}</span>;
}
function Badge({ children, tone = "" }) {
  return <span className={"badge " + tone}>{children}</span>;
}
function Empty({ text = "No results found", children }) {
  return <div className="empty"><Icon name="search" size={28} /><h3>{text}</h3><p>{children || "Try another search or add a new record."}</p></div>;
}
function StatCard({ icon, label, value, tone, note, onClick, trend, delta, vs = "last week" }) {
  const body = <><span className="stat-icon"><Icon name={icon} size={24} /></span><span>{delta == null ? <strong>{value}</strong> : <span className="stat-value"><strong>{value}</strong><em className={"delta" + (delta < 0 ? " down" : "")} title={"Versus " + vs + " (sample trend)"}><Icon name="arrow" size={12} />{Math.abs(delta)}%<span className="sr-only">{(delta < 0 ? " down" : " up") + " versus " + vs}</span></em></span>}<span className="stat-label">{label}</span>{note && <small>{note}</small>}</span>{trend && <Sparkline values={trend} />}</>;
  const cls = "stat " + tone + (trend ? " has-trend" : "");
  return onClick ? <button className={cls} onClick={onClick}>{body}<span className="stat-arrow"><Icon name="arrow" size={14} /></span></button> : <div className={cls}>{body}</div>;
}
function useWidth() {
  const ref = React.useRef(), [width, setWidth] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = ref.current, ro = new ResizeObserver(() => setWidth(el.clientWidth));
    setWidth(el.clientWidth);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}
function smooth(pts) {
  const n = pts.length, d = [], m = [], f = (v) => Math.round(v * 10) / 10;
  if (n < 3) return "M" + pts.map((p) => p.map(f).join(",")).join("L");
  for (let i = 0; i < n - 1; i++) d.push((pts[i + 1][1] - pts[i][1]) / (pts[i + 1][0] - pts[i][0]));
  m.push(d[0]);
  for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
  m.push(d[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (!d[i]) {
      m[i] = m[i + 1] = 0;
      continue;
    }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) {
      m[i] = 3 / Math.sqrt(s) * a * d[i];
      m[i + 1] = 3 / Math.sqrt(s) * b * d[i];
    }
  }
  return pts.reduce((p, [x, y], i) => {
    if (!i) return "M" + f(x) + "," + f(y);
    const [x0, y0] = pts[i - 1], h = (x - x0) / 3;
    return p + "C" + f(x0 + h) + "," + f(y0 + m[i - 1] * h) + " " + f(x - h) + "," + f(y - m[i] * h) + " " + f(x) + "," + f(y);
  }, "");
}
function Sparkline({ values }) {
  const lo = Math.min(...values), hi = Math.max(...values), n = values.length;
  const pts = values.map((v, i) => [i / (n - 1) * 100, 26 - (hi > lo ? (v - lo) / (hi - lo) : 0.5) * 22]), d = smooth(pts);
  return <span className="spark" aria-hidden="true"><svg viewBox="0 0 100 30" preserveAspectRatio="none"><path d={d + "L100,30L0,30Z"} /><path d={d} vectorEffect="non-scaling-stroke" /></svg><i style={{ top: pts[n - 1][1] / 30 * 100 + "%" }} /></span>;
}
function TrendChart({ labels, series, height = 272, format = (v) => "$" + v + "K", zero = "$0", tick = 34, label }) {
  const [ref, width] = useWidth(), [at, setAt] = React.useState(null);
  const n = labels.length, max = Math.max(1, ...series.flatMap((s) => s.values));
  const unit = 10 ** Math.floor(Math.log10(max / 4)), step = [1, 2, 2.5, 4, 5, 10].map((k) => k * unit).find((s) => s * 4 >= max), top = Math.ceil(max / step) * step;
  const L = 48, R = 56, T = 12, B = 32, w = Math.max(width - L - R, 1), h = height - T - B, gap = w / Math.max(n - 1, 1);
  const x = (i) => L + (n > 1 ? i * gap : w / 2), y = (v) => T + h - v / top * h;
  const every = Math.max(1, Math.ceil(tick / gap)), endY = series.map((s) => y(s.values[n - 1])), keep = endY.map((e, i) => !endY.some((f, j) => j > i && Math.abs(f - e) < 16));
  const keys = (e) => {
    const next = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
    if (next) {
      e.preventDefault();
      setAt((i) => Math.max(0, Math.min(n - 1, (i ?? n - 1) + next)));
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      setAt(e.key === "Home" ? 0 : n - 1);
    } else if (e.key === "Escape") setAt(null);
  };
  return <div ref={ref} className="chart" style={{ height }} tabIndex="0" role="img" aria-label={label + ": " + labels.map((m, i) => m + " " + series.map((s) => s.label.toLowerCase() + " " + format(s.values[i])).join(", ")).join("; ")} onKeyDown={keys} onFocus={() => setAt(n - 1)} onBlur={() => setAt(null)}>{width > 0 && <svg width={width} height={height} aria-hidden="true" onPointerMove={(e) => setAt(Math.max(0, Math.min(n - 1, Math.round((e.clientX - e.currentTarget.getBoundingClientRect().left - L) / gap))))} onPointerLeave={() => setAt(null)}>{Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step).map((t) => <g key={t}><line className="grid-line" x1={L} x2={width - R + 12} y1={y(t)} y2={y(t)} /><text x={L - 12} y={y(t) + 4} textAnchor="end">{t ? format(t) : zero}</text></g>)}{labels.map((m, i) => (n - 1 - i) % every === 0 && <text key={m + i} x={x(i)} y={height - 8} textAnchor="middle">{m}</text>)}{series.map((s, k) => {
    const pts = s.values.map((v, i) => [x(i), y(v)]), d = smooth(pts), [ex, ey] = pts[n - 1];
    return <g className={"series " + s.tone} key={s.label}>{s.area && <path className="trend-area" d={d + "L" + ex + "," + y(0) + "L" + pts[0][0] + "," + y(0) + "Z"} />}<path className="trend-line" d={d} pathLength="1" /><circle className="trend-end" cx={ex} cy={ey} r="4" />{keep[k] && <text className="trend-label" x={ex + 10} y={ey + 4}>{format(s.values[n - 1])}</text>}</g>;
  })}{at != null && <g className="crosshair"><line x1={x(at)} x2={x(at)} y1={T} y2={y(0)} />{series.map((s) => <circle key={s.label} className={s.tone} cx={x(at)} cy={y(s.values[at])} r="5" />)}</g>}</svg>}{at != null && width > 0 && <div className="chart-tip" style={{ left: x(at), transform: at > (n - 1) / 2 ? "translateX(calc(-100% - 12px))" : "translateX(12px)" }}><small>{labels[at]}</small>{[...series].reverse().map((s) => <span key={s.label} className={s.tone}><i /><b>{format(s.values[at])}</b><em>{s.label}</em></span>)}</div>}</div>;
}
function Gauge({ value, extra = 0, label }) {
  const arc = "M20 100A80 80 0 0 1 180 100", pct = (v) => Math.max(0, Math.min(100, v * 100));
  return <svg className="gauge" viewBox="0 0 200 110" role="img" aria-label={label}><path className="gauge-track" d={arc} />{pct(value + extra) > 0 && <path className="k-soft" d={arc} pathLength="100" style={{ strokeDasharray: pct(value + extra) + " 100" }} />}{pct(value) > 0 && <path className="k-accent" d={arc} pathLength="100" style={{ strokeDasharray: pct(value) + " 100" }} />}</svg>;
}
function Ring({ value, size = 64, stroke = 6, tone = "k-accent", label, children }) {
  const c = size / 2, r = c - stroke / 2;
  return <span className={"ring " + tone} style={{ width: size, height: size }} role="img" aria-label={label}><svg viewBox={"0 0 " + size + " " + size} aria-hidden="true"><circle cx={c} cy={c} r={r} strokeWidth={stroke} />{value > 0 && <circle className="ring-fill" cx={c} cy={c} r={r} strokeWidth={stroke} pathLength="100" transform={"rotate(-90 " + c + " " + c + ")"} style={{ strokeDasharray: Math.min(value, 100) + " 100" }} />}</svg><b aria-hidden="true">{children}</b></span>;
}
function SegmentBar({ parts, label }) {
  return <div className="segment-bar" role="img" aria-label={label}>{parts.filter((p) => p.value > 0).map((p) => <span key={p.label} className={p.tone} style={{ flexGrow: p.value }} />)}</div>;
}
function Columns({ items, format = (v) => v, label, highlight, all = false, height }) {
  const max = Math.max(1e-9, ...items.map((c) => c.value)), hi = highlight ?? items.findIndex((c) => c.value === max);
  return <div className="columns" style={height ? { height } : null} role="img" aria-label={label + ": " + items.map((c) => c.label + " " + format(c.value)).join(", ")}>{items.map((c, i) => <span key={c.label} className={(i === hi ? "busy " : "") + (c.tone || "")} title={c.label + ": " + format(c.value)}><b>{all || i === hi ? format(c.value) : ""}</b><em><i style={{ height: c.value / max * 100 + "%" }} /></em><small>{c.label}</small></span>)}</div>;
}
function BarList({ items, format = (v) => v, label }) {
  const max = Math.max(1e-9, ...items.map((i) => i.value));
  return <ul className="bar-list" aria-label={label}>{items.map((i) => <li key={i.key || i.label} className={i.tone || "k-accent"}>{i.lead}<span className="bar-name"><b>{i.label}</b>{i.sub && <small>{i.sub}</small>}</span><strong>{format(i.value)}</strong><span className="bar-track"><i style={{ width: i.value / max * 100 + "%" }} /></span></li>)}</ul>;
}
function Breakdown({ parts, format = (v) => v, label }) {
  return <><SegmentBar parts={parts} label={label + ": " + parts.map((p) => p.label + " " + format(p.value)).join(", ")} /><ul className="legend-list">{parts.map((p) => <li className={p.tone} key={p.label}><i /><span>{p.label}{p.sub && <small>{p.sub}</small>}</span><b>{format(p.value)}</b></li>)}</ul></>;
}
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
function Heatmap({ days, unit = "events", weekdayBars = true }) {
  const [ref, width] = useWidth(), [at, setAt] = React.useState(null);
  const all = days.length / 7, weeks = Math.max(8, Math.min(all, Math.floor((width - 40) / 22))), cells = days.slice((all - weeks) * 7);
  const max = Math.max(1, ...days.map((d) => d.value || 0)), last = cells.map((d) => d.value != null).lastIndexOf(true);
  const day = (d, opts) => new Date(d.date + "T12:00:00").toLocaleDateString("en-US", opts);
  const total = cells.reduce((a, d) => a + (d.value || 0), 0), byDay = weekdays.map((_, i) => cells.filter((_, n) => n % 7 === i).reduce((a, d) => a + (d.value || 0), 0));
  const avg = byDay.map((t, i) => Math.round(t / Math.max(1, cells.filter((d, n) => n % 7 === i && d.value != null).length) * 10) / 10), busy = avg.indexOf(Math.max(...avg));
  const peak = cells.reduce((a, d) => (d.value || 0) > (a.value || 0) ? d : a, cells[0]);
  const cw = (width - 28 - 4 * weeks) / weeks;
  const keys = (e) => {
    const next = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 }[e.key];
    if (next) {
      e.preventDefault();
      setAt((i) => {
        const j = (i ?? last) + next;
        return j >= 0 && j <= last ? j : i ?? last;
      });
    } else if (e.key === "Escape") setAt(null);
  };
  return <div className="heatmap-wrap"><div ref={ref} className="heatmap" style={{ gridTemplateColumns: "28px repeat(" + weeks + ", minmax(0, 1fr))" }} tabIndex="0" role="img" aria-label={total.toLocaleString("en-US") + " " + unit + " in the last " + weeks + " weeks. Busiest weekday: " + weekdays[busy] + ". Peak: " + peak.value + " on " + day(peak, { month: "long", day: "numeric" }) + "."} onKeyDown={keys} onFocus={() => setAt(last)} onBlur={() => setAt(null)} onPointerMove={(e) => e.target.dataset.i && setAt(Number(e.target.dataset.i))} onPointerLeave={() => setAt(null)}>{width > 0 && <><span />{["Mon", "", "Wed", "", "Fri", "", ""].map((d, i) => <span key={i}>{d}</span>)}{Array.from({ length: weeks }, (_, w) => {
    const first = cells[w * 7], prev = cells[w * 7 - 7], month = !prev ? Number(first.date.slice(8)) <= 10 : first.date.slice(5, 7) !== prev.date.slice(5, 7);
    return <React.Fragment key={first.date}><span>{month ? day(first, { month: "short" }) : ""}</span>{cells.slice(w * 7, w * 7 + 7).map((d, n) => <i key={d.date} data-i={d.value == null ? void 0 : w * 7 + n} style={{ "--w": w }} className={"hm " + (d.value == null ? "none" : "l" + (d.value ? Math.ceil(d.value / max * 4) : 0)) + (at === w * 7 + n ? " active" : "")} />)}</React.Fragment>;
  })}</>}</div>{at != null && width > 0 && <div className="chart-tip above" style={{ left: Math.min(Math.max(28 + 4 + Math.floor(at / 7) * (cw + 4) + cw / 2, 64), width - 64), top: 24 + at % 7 * (cw + 4) - 6 }}><b>{cells[at].value} {unit}</b><small>{day(cells[at], { weekday: "short", month: "short", day: "numeric" })}</small></div>}<div className="heatmap-foot"><span><b>{total.toLocaleString("en-US")}</b> {unit} in the last {weeks} weeks · busiest on {weekdays[busy]}s</span><span className="scale" aria-hidden="true">Less{[0, 1, 2, 3, 4].map((l) => <i key={l} className={"hm l" + l} />)}More</span></div>{weekdayBars && <Columns label="Daily average by weekday" items={avg.map((v, i) => ({ label: weekdays[i].slice(0, 3), value: v }))} format={(v) => v + " avg"} highlight={busy} />}</div>;
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
function RevenueChart({ months, values }) {
  const max = Math.max(1, ...values), step = [10, 20, 25, 40, 50, 100, 200, 250, 500].find((n) => n * 3 >= max) || Math.ceil(max / 300) * 100, top = step * 3;
  return <div className="revenue-chart" role="img" aria-label={"Monthly revenue in thousands of dollars: " + months.map((m, i) => m + " " + values[i]).join(", ")}><div className="chart-y">{[3, 2, 1, 0].map((n) => <span key={n}>{n ? "$" + step * n + "K" : "$0"}</span>)}</div><div className="bars">{values.map((n, i) => <div className="bar-group" key={i}><div className="bar-track"><div className={"bar " + (i === values.length - 1 ? "active" : "")} style={{ height: n / top * 100 + "%" }} tabIndex="0" aria-label={months[i] + " $" + n + "K"}><span>${n}K</span></div></div><small>{months[i]}</small></div>)}</div></div>;
}
export {
  Avatar,
  Badge,
  BarList,
  Breakdown,
  Button,
  Columns,
  Empty,
  Field,
  Icon,
  Menu,
  Gauge,
  Heatmap,
  Modal,
  RevenueChart,
  Ring,
  SegmentBar,
  Sparkline,
  StatCard,
  TrendChart
};
