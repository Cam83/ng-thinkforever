"use client"

import { useState, useRef, useEffect, useLayoutEffect, useMemo, cloneElement } from "react"
import {
  ChevronDown, Gauge, BarChart3, Clock, Users, Database,
  FolderOpen, Building2, ChefHat, HelpCircle, Bell, Settings, Layers,
  Plus, RefreshCw, Settings2, Check, X, Circle, UserPlus, ArrowRightLeft,
  CalendarClock, Briefcase, DollarSign, ChevronLeft, ListFilter, Sun, Moon, MoreVertical, Pyramid, PanelLeftClose, PanelLeftOpen, Bot, ArrowUp, Share2, GitFork, Star, Search, MapPin
} from "lucide-react"
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Area, BarChart, Bar } from "recharts"
import { HoverBtn as CamHoverBtn, TabBtn } from "@cam-ui/components"
function HoverBtn(props: any) { return <CamHoverBtn accentColor={t.accent} {...props} /> }
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from "d3-force"
import { Checkbox } from "@/components/ui/checkbox"
import { Tag } from "@/components/ui/tag"
import { SettingsPage } from "@/app/settings-page"

const getGlobalStyles = (theme: any) => `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${theme.bg}; color: ${theme.fg}; font-family: Inter, sans-serif; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${theme.scrollAlpha40}; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${theme.scrollAlpha70}; }
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
  :root { --tag-bg: ${theme.muted}; --tag-bg-hover: ${theme.fgAlpha10}; }
  @keyframes notifSlideIn {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }
`

const blackTheme = {
  bg: "#000000", fg: "#ededed", card: "#000000", popover: "#111111",
  primary: "#ededed", primaryFg: "#000000", secondary: "#1a1a1a",
  secondaryFg: "#a1a1a1", muted: "#1a1a1a", mutedFg: "#888888",
  accent: "#1a1a1a", accentFg: "#ededed", border: "#1f1f1f",
  sidebar: "#000000", sidebarFg: "#a1a1a1", sidebarBorder: "#1f1f1f",
  fgAlpha30: "rgba(237,237,237,0.3)", fgAlpha10: "rgba(237,237,237,0.1)",
  fgAlpha06: "rgba(237,237,237,0.06)", fgAlpha03: "rgba(237,237,237,0.03)",
  fgAlpha20: "rgba(237,237,237,0.2)", fgAlpha70: "rgba(237,237,237,0.7)",
  borderAlpha25: "rgba(168,168,168,0.25)", scrollAlpha40: "rgba(139,139,139,0.4)",
  scrollAlpha70: "rgba(139,139,139,0.7)", overlayBg: "rgba(0,0,0,0.7)", shadowDark: "rgba(0,0,0,0.5)", shadowDarker: "rgba(0,0,0,0.6)",
  sectionAddBtnBg: "#6AD2FF", sectionAddBtnFg: "#141618"
}

const lightTheme = {
  bg: "#ffffff", fg: "#0B0C10", card: "#ffffff", popover: "#f5f5f5",
  primary: "#0B0C10", primaryFg: "#ffffff", secondary: "#f0f0f0",
  secondaryFg: "#0B0C10", muted: "#f0f0f0", mutedFg: "#333333",
  accent: "#f0f0f0", accentFg: "#0B0C10", border: "#e0e0e0",
  sidebar: "#F8F7F9", sidebarFg: "#0B0C10", sidebarBorder: "#f0f0f0",
  fgAlpha30: "rgba(11,12,16,0.3)", fgAlpha10: "rgba(11,12,16,0.1)",
  fgAlpha06: "rgba(11,12,16,0.06)", fgAlpha03: "rgba(11,12,16,0.03)",
  fgAlpha20: "rgba(11,12,16,0.2)", fgAlpha70: "rgba(11,12,16,0.7)",
  borderAlpha25: "rgba(11,12,16,0.15)", scrollAlpha40: "rgba(180,180,180,0.4)",
  scrollAlpha70: "rgba(180,180,180,0.7)", overlayBg: "rgba(0,0,0,0.5)", shadowDark: "rgba(0,0,0,0.3)", shadowDarker: "rgba(0,0,0,0.4)",
  sectionAddBtnBg: "#0B0C10", sectionAddBtnFg: "#ffffff"
}

const darkTheme = {
  bg: "#141414", fg: "#f0f0f0", card: "#1a1a1a", popover: "#202020",
  primary: "#f0f0f0", primaryFg: "#141414", secondary: "#242424",
  secondaryFg: "#909090", muted: "#242424", mutedFg: "#686868",
  accent: "#2a2a2a", accentFg: "#f0f0f0", border: "#282828",
  sidebar: "#1a1a1a", sidebarFg: "#909090", sidebarBorder: "#242424",
  fgAlpha30: "rgba(240,240,240,0.3)", fgAlpha10: "rgba(240,240,240,0.1)",
  fgAlpha06: "rgba(240,240,240,0.06)", fgAlpha03: "rgba(240,240,240,0.03)",
  fgAlpha20: "rgba(240,240,240,0.2)", fgAlpha70: "rgba(240,240,240,0.7)",
  borderAlpha25: "rgba(168,168,168,0.2)", scrollAlpha40: "rgba(120,120,120,0.4)",
  scrollAlpha70: "rgba(120,120,120,0.7)", overlayBg: "rgba(0,0,0,0.75)", shadowDark: "rgba(0,0,0,0.6)", shadowDarker: "rgba(0,0,0,0.75)",
  sectionAddBtnBg: "#6AD2FF", sectionAddBtnFg: "#141618"
}

const floatDarkTheme = {
  bg: "#141618", fg: "#eef0f2", card: "#191b1e", popover: "#1e2022",
  primary: "#eef0f2", primaryFg: "#141618", secondary: "#1d1f22",
  secondaryFg: "#8a9099", muted: "#1d1f22", mutedFg: "#626b74",
  accent: "#1e2124", accentFg: "#eef0f2", border: "#242628",
  sidebar: "#111314", sidebarFg: "#8a9099", sidebarBorder: "#1d1f22",
  fgAlpha30: "rgba(238,240,242,0.3)", fgAlpha10: "rgba(238,240,242,0.1)",
  fgAlpha06: "rgba(238,240,242,0.06)", fgAlpha03: "rgba(238,240,242,0.03)",
  fgAlpha20: "rgba(238,240,242,0.2)", fgAlpha70: "rgba(238,240,242,0.7)",
  borderAlpha25: "rgba(150,160,175,0.2)", scrollAlpha40: "rgba(130,140,155,0.4)",
  scrollAlpha70: "rgba(130,140,155,0.7)", overlayBg: "rgba(0,0,0,0.75)", shadowDark: "rgba(0,0,0,0.6)", shadowDarker: "rgba(0,0,0,0.75)",
  sectionAddBtnBg: "#6AD2FF", sectionAddBtnFg: "#141618"
}

let t = blackTheme

const getStyles = (theme: any) => ({
  /** Small section / panel labels — title case in content, never forced uppercase */
  caseTitle: { fontSize: 11, fontWeight: 600, color: theme.mutedFg, letterSpacing: "0.08em", fontFamily: "var(--font-sans), sans-serif" },
  caseTitleCompact: { fontSize: 11, fontWeight: 600, color: theme.mutedFg, letterSpacing: "0.05em", fontFamily: "var(--font-sans), sans-serif" },
  caseTitleXs: { fontSize: 10, fontWeight: 600, color: theme.mutedFg, letterSpacing: "0.5px" },
  sidebar: { width: 260, borderTop: "none", borderBottom: "none", borderLeft: "none", borderRight: `1px solid ${theme.sidebarBorder}`, background: theme.sidebar, display: "flex", flexDirection: "column" as const, height: "100vh", flexShrink: 0 },
  main: { flex: 1, display: "flex", flexDirection: "column" as const, background: theme.bg, overflow: "hidden", minWidth: 0 },
  iconBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", color: theme.secondaryFg, cursor: "pointer" },
  primaryBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, border: "none", background: theme.fg, color: theme.bg, cursor: "pointer" },
  pillBtn: (active: any) => ({ display: "flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 20, border: `1px solid ${active ? theme.fgAlpha30 : theme.border}`, background: active ? theme.fgAlpha10 : theme.bg, color: active ? theme.fg : theme.secondaryFg, cursor: "pointer", fontSize: 12, fontWeight: active ? 500 : 400 }),
  outlineBtn: { display: "flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 8, border: `1px solid ${theme.border}`, background: "transparent", color: theme.secondaryFg, cursor: "pointer", fontSize: 12 },
  dropdown: { position: "absolute" as const, top: "100%", left: 0, marginTop: 4, background: theme.popover, border: `1px solid ${theme.border}`, borderRadius: 8, padding: 4, boxShadow: `0 4px 16px ${theme.shadowDark}`, zIndex: 200, minWidth: 180 },
  dropdownItem: (active: any) => ({ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "6px 10px", borderRadius: 5, border: "none", background: "transparent", color: active ? theme.fg : theme.secondaryFg, cursor: "pointer", fontSize: 12, fontWeight: active ? 500 : 400, textAlign: "left" as const }),
})

let s = getStyles(t)

function HoverRow({ selected, children, onClick, style }: any) {
  const [hov, setHov] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...style, background: selected ? t.fgAlpha06 : hov ? t.fgAlpha03 : "transparent" }}>
      {children}
    </div>
  )
}

function RowCheckbox({ checked, indeterminate, onClick }: any) {
  return (
    <Checkbox
      checked={indeterminate ? "indeterminate" : checked}
      onCheckedChange={() => onClick?.()}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
    />
  )
}

function ColResizeHandle({ header, colIdx, onHoverChange, isHovered }: any) {
  const isResizing = header.column.getIsResizing()
  return (
    <div
      onMouseEnter={() => onHoverChange(colIdx)}
      onMouseLeave={() => { if (!isResizing) onHoverChange(null) }}
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
      style={{ position: "absolute", top: 0, right: -8, width: 16, height: "100%", cursor: "col-resize", zIndex: 10, display: "flex", alignItems: "stretch", justifyContent: "center", userSelect: "none" as const }}>
      <div style={{ width: 2, background: (isHovered || isResizing) ? "#3b82f6" : "transparent", borderRadius: 1 }}/>
    </div>
  )
}

function DataTableRow({ selected, onClick, template, children }: any) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{ display: "grid", gridTemplateColumns: template, borderBottom: `1px solid ${t.border}`, cursor: onClick ? "pointer" : "default", background: selected ? t.fgAlpha06 : hov ? t.fgAlpha03 : "transparent", transition: "background 0.1s" }}>
      {children}
    </div>
  )
}

function DataTable({ columns, data, onRowClick, isRowSelected, paddingX = 24, emptyNode }: any) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [resizeHovCol, setResizeHovCol] = useState<number | null>(null)
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange" as any,
    defaultColumn: { minSize: 60 },
  })
  const hg = table.getHeaderGroups()[0]
  const rows = table.getRowModel().rows
  const allSelected = rows.length > 0 && rows.every((_: any, i: number) => selectedRows.has(i))
  const someSelected = !allSelected && rows.some((_: any, i: number) => selectedRows.has(i))
  const toggleRow = (idx: number) => setSelectedRows(prev => { const n = new Set(prev); n.has(idx) ? n.delete(idx) : n.add(idx); return n })
  const toggleAll = () => setSelectedRows(allSelected ? new Set() : new Set(rows.map((_: any, i: number) => i)))
  const cbCol = "24px"
  const dataTemplate = hg?.headers.map((h: any) => `${h.getSize()}px`).join(" ") ?? ""
  const gridTemplate = `${cbCol} ${dataTemplate}`
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerH, setHeaderH] = useState(36)
  useLayoutEffect(() => { if (headerRef.current) setHeaderH(headerRef.current.offsetHeight) })
  const resizingIdx = hg?.headers.findIndex((h: any) => h.column.getIsResizing()) ?? -1
  const activeResizeCol = resizingIdx >= 0 ? resizingIdx : resizeHovCol
  const getColRightX = (colIdx: number) => {
    let x = 24
    for (let i = 0; i <= colIdx; i++) x += hg.headers[i].getSize()
    return x
  }
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: `0 ${paddingX}px` }}>
      <div style={{ position: "relative" }}>
        <div ref={headerRef} style={{ display: "grid", gridTemplateColumns: gridTemplate, borderBottom: `1px solid ${t.border}`, padding: "8px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <RowCheckbox checked={allSelected} indeterminate={someSelected} onClick={toggleAll} />
          </div>
          {hg?.headers.map((header: any, i: number) => (
            <div key={header.id} style={{ position: "relative", fontSize: 12, fontWeight: 500, color: t.mutedFg, display: "flex", alignItems: "center", paddingLeft: i === 0 ? 16 : 8 }}>
              {flexRender(header.column.columnDef.header, header.getContext())}
              {header.column.getCanResize() && <ColResizeHandle header={header} colIdx={i} onHoverChange={setResizeHovCol} isHovered={activeResizeCol === i}/>}
            </div>
          ))}
        </div>
        {rows.map((row: any, idx: number) => (
          <DataTableRow
            key={row.id}
            selected={isRowSelected?.(row.original, row.index) || selectedRows.has(idx)}
            onClick={onRowClick ? () => onRowClick(row.original, row.index) : undefined}
            template={gridTemplate}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <RowCheckbox checked={selectedRows.has(idx)} onClick={() => toggleRow(idx)} />
            </div>
            {row.getVisibleCells().map((cell: any, i: number) => (
              <div key={cell.id} style={{ display: "flex", alignItems: "center", padding: "10px 0", paddingLeft: i === 0 ? 16 : 8, overflow: "hidden", fontSize: 13 }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            ))}
          </DataTableRow>
        ))}
        {emptyNode && rows.length === 0 && emptyNode}
        {activeResizeCol !== null && activeResizeCol >= 0 && hg && (
          <div style={{ position: "absolute", top: headerH, bottom: 0, left: getColRightX(activeResizeCol), width: 0, borderLeft: `1px dashed ${t.borderAlpha25}`, pointerEvents: "none", zIndex: 20 }}/>
        )}
      </div>
    </div>
  )
}


function DropdownWrapper({ trigger, children, open, setOpen }: any) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{top:number,left:number,transform?:string}|null>(null)
  useLayoutEffect(() => {
    if (!open) { setPos(null); return }
    if (wrapRef.current) {
      const r = wrapRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - r.bottom
      const openAbove = spaceBelow < 200
      setPos({ top: openAbove ? r.top - 4 : r.bottom + 4, left: r.left, transform: openAbove ? "translateY(-100%)" : undefined })
    }
  }, [open])
  useEffect(() => {
    if (!open) return
    function h(e: any) {
      if (wrapRef.current?.contains(e.target)) return
      if (dropRef.current?.contains(e.target)) return
      setOpen(false)
    }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [open, setOpen])
  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      {trigger}
      {open && pos && cloneElement(children as any, {
        ref: dropRef,
        style: { ...(children as any).props.style, position: "fixed", top: pos.top, bottom: "auto", left: pos.left, right: "auto", marginTop: 0, marginBottom: 0, transform: (pos as any).transform }
      })}
    </div>
  )
}

function InlineEdit({ value, onChange, style }: any) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { if (editing && ref.current) { ref.current.focus(); ref.current.select() } }, [editing])
  useEffect(() => { setDraft(value) }, [value])
  function commit() {
    const v = draft.trim()
    if (v && v !== value) onChange(v)
    else setDraft(value)
    setEditing(false)
  }
  if (editing) return (
    <input ref={ref} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit}
      onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(value); setEditing(false) } }}
      style={{ fontSize: 13, fontWeight: 500, color: t.fg, background: t.accent, border: `1px solid ${t.fgAlpha20}`, borderRadius: 8, padding: "2px 8px 2px 0", outline: "none", fontFamily: "inherit", ...style }} />
  )
  return (
    <button onClick={() => { setDraft(value); setEditing(true) }}
      style={{ fontSize: 13, fontWeight: 500, color: t.fg, background: t.accent, borderRadius: 4, padding: "2px 8px 2px 0", border: "none", cursor: "text", fontFamily: "inherit", ...style }}>
      {value}
    </button>
  )
}

function InlineEditRate({ value, onChange }: any) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(value))
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { if (editing && ref.current) { ref.current.focus(); ref.current.select() } }, [editing])
  function commit() {
    const n = parseFloat(draft)
    if (!isNaN(n) && n >= 0 && n !== value) onChange(n)
    else setDraft(String(value))
    setEditing(false)
  }
  if (editing) return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{ fontSize: 13, color: t.mutedFg }}>$</span>
      <input ref={ref} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit}
        onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(String(value)); setEditing(false) } }}
        style={{ width: 60, fontSize: 13, color: t.fg, background: t.bg, border: `1px solid ${t.fgAlpha20}`, borderRadius: 4, padding: "2px 6px", outline: "none", fontFamily: "inherit" }} />
    </div>
  )
  return (
    <button onClick={() => { setDraft(String(value)); setEditing(true) }}
      style={{ fontSize: 13, color: t.fg, background: "transparent", border: "none", cursor: "text", padding: "2px 4px", borderRadius: 4, fontFamily: "inherit" }}>
      ${value}
    </button>
  )
}

function Collapsible({ expanded, children }: any) {
  const [h, setH] = useState(expanded ? "auto" : "0px")
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    if (expanded) {
      setH(ref.current.scrollHeight + "px")
      const timer = setTimeout(() => setH("auto"), 210)
      return () => clearTimeout(timer)
    } else {
      setH((ref.current as HTMLDivElement).scrollHeight + "px")
      requestAnimationFrame(() => setH("0px"))
    }
  }, [expanded])
  return (
    <div style={{ overflow: "hidden", height: h, transition: "height 0.2s ease" }}>
      <div ref={ref} style={{ opacity: expanded ? 1 : 0, transition: "opacity 0.15s" }}>{children}</div>
    </div>
  )
}

function NikeLogo({ themeMode }: any) {
  return (
    <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/002_nike-logos-swoosh-white-0nPbb6zNJMvApD16nQ1CvQL4h5mmIp.png" alt="Nike" style={{ height: 24, width: "auto", filter: themeMode === "light" ? "brightness(0)" : "none" }} />
  )
}

function ScheduleIcon() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><rect x="3.958" y="8.958" width="12.083" height="2.083" rx="0.833" stroke="currentColor" strokeWidth="1"/><rect x="3.958" y="13.958" width="4.583" height="2.083" rx="0.833" stroke="currentColor" strokeWidth="1"/><rect x="9.792" y="3.958" width="6.25" height="2.083" rx="0.833" stroke="currentColor" strokeWidth="1"/></svg>
}
function ProjectPlanIcon() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4.037 15.832H15.963" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/><rect x="8.43" y="9.869" width="7.402" height="2.879" rx="0.822" stroke="currentColor" strokeWidth="1"/><rect x="3.907" y="3.907" width="7.402" height="2.879" rx="0.822" stroke="currentColor" strokeWidth="1"/></svg>
}
function LogTeamIcon() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M16.042 9.375V6.458C16.042 5.078 14.922 3.958 13.542 3.958H6.458C5.078 3.958 3.958 5.078 3.958 6.458V13.542C3.958 14.922 5.078 16.042 6.458 16.042H7.708" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/><path d="M11.563 16.042L9.792 8.958L16.042 12.523L12.917 13.357L11.563 16.042Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function OfficeIcon() {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M11.875 3.95834H4.79165C4.33141 3.95834 3.95831 4.33144 3.95831 4.79168V15.2083C3.95831 15.6686 4.33141 16.0417 4.79165 16.0417H11.875C12.3352 16.0417 12.7083 15.6686 12.7083 15.2083V4.79168C12.7083 4.33144 12.3352 3.95834 11.875 3.95834Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.7917 3.95834H15.2084C15.6686 3.95834 16.0417 4.33144 16.0417 4.79168V15.2083C16.0417 15.6686 15.6686 16.0417 15.2084 16.0417H14.7917" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

// ── Data ──
const INITIAL_ROLES = [
  { name: "Designer", costRate: 120, activePeople: 3, unassigned: 1, departmentId: 0 },
  { name: "Senior Designer", costRate: 160, activePeople: 5, unassigned: 0, departmentId: 0 },
  { name: "Developer", costRate: 140, activePeople: 8, unassigned: 2, departmentId: 1 },
  { name: "Project Manager", costRate: 130, activePeople: 4, unassigned: 0, departmentId: 2 },
  { name: "Art Director", costRate: 155, activePeople: 3, unassigned: 1, departmentId: 0 },
  { name: "Copywriter", costRate: 110, activePeople: 4, unassigned: 0, departmentId: 3 },
  { name: "Account Executive", costRate: 125, activePeople: 6, unassigned: 1, departmentId: 3 },
  { name: "Creative Director", costRate: 180, activePeople: 2, unassigned: 0, departmentId: 0 },
  { name: "UX/UI Designer", costRate: 135, activePeople: 5, unassigned: 2, departmentId: 0 },
  { name: "Motion Designer", costRate: 145, activePeople: 2, unassigned: 0 },
  { name: "Brand Strategist", costRate: 150, activePeople: 3, unassigned: 1, departmentId: 3 },
  { name: "Social Media Manager", costRate: 105, activePeople: 4, unassigned: 0 },
]
const INITIAL_DEPARTMENTS = [{ name: "Design" }, { name: "Engineering" }, { name: "Operations" }, { name: "Marketing" }]
const INITIAL_DELIVERY_TEAMS = [{ name: "Acquisition" }, { name: "Retention" }, { name: "Core" }, { name: "Creative studio" }]
const INITIAL_GROUPS = [{ name: "Leadership" }, { name: "AI working group" }, { name: "Hiring committee" }]
const INITIAL_PEOPLE = [
  { name: "Jake Peralta", roleId: 0, departmentId: 0, office: "New York", deliveryTeamIds: [0], groupIds: [0, 2] },
  { name: "Amy Santiago", roleId: 1, departmentId: 0, office: "New York", deliveryTeamIds: [1], groupIds: [0] },
  { name: "Rosa Diaz", roleId: 2, departmentId: 1, office: "Melbourne", deliveryTeamIds: [2], groupIds: [1] },
  { name: "Terry Jeffords", roleId: 3, departmentId: 2, office: "Sydney", deliveryTeamIds: [0], groupIds: [0, 1] },
  { name: "Charles Boyle", roleId: 1, departmentId: 0, office: "New York", deliveryTeamIds: [1], groupIds: [] },
  { name: "Michael Hitchcock", roleId: 0, departmentId: 1, office: "London", deliveryTeamIds: [3], groupIds: [2] },
  { name: "Norm Scully", roleId: 2, departmentId: 2, office: "New York", deliveryTeamIds: [3], groupIds: [] },
  { name: "Rachel Green", roleId: 0, departmentId: 0, office: "Sydney", deliveryTeamIds: [2], groupIds: [1, 2] },
  { name: "Monica Geller", roleId: 1, departmentId: 1, office: "London", deliveryTeamIds: [0], groupIds: [0] },
  { name: "Phoebe Buffay", roleId: 2, departmentId: 2, office: "New York", deliveryTeamIds: [], groupIds: [1] },
  { name: "Joey Tribbiani", roleId: 3, departmentId: 0, office: "Melbourne", deliveryTeamIds: [1], groupIds: [] },
  { name: "Chandler Bing", roleId: 0, departmentId: 1, office: "Sydney", deliveryTeamIds: [2], groupIds: [0, 1] },
  { name: "Ross Geller", roleId: 1, departmentId: 2, office: "London", deliveryTeamIds: [3], groupIds: [2] },
  { name: "Gunther", roleId: 2, departmentId: 1, office: "New York", deliveryTeamIds: [], groupIds: [0] },
  { name: "Janice Litman", roleId: 3, departmentId: 2, office: "New York", deliveryTeamIds: [1], groupIds: [1, 2] },
  // Parks and Recreation
  { name: "Leslie Knope", roleId: 7, departmentId: 3, office: "Beaverton HQ", deliveryTeamIds: [0], groupIds: [0] },
  { name: "Ben Wyatt", roleId: 3, departmentId: 2, office: "Beaverton HQ", deliveryTeamIds: [0, 2], groupIds: [0, 1] },
  { name: "Ann Perkins", roleId: 8, departmentId: 0, office: "Hilversum", deliveryTeamIds: [1], groupIds: [2] },
  { name: "Chris Traeger", roleId: 7, departmentId: 2, office: "Beaverton HQ", deliveryTeamIds: [0], groupIds: [0] },
  { name: "Tom Haverford", roleId: 10, departmentId: 3, office: "New York", deliveryTeamIds: [3], groupIds: [1] },
  { name: "April Ludgate", roleId: 3, departmentId: 2, office: "Beaverton HQ", deliveryTeamIds: [2], groupIds: [] },
  { name: "Andy Dwyer", roleId: 9, departmentId: 0, office: "London", deliveryTeamIds: [3], groupIds: [2] },
  { name: "Ron Swanson", roleId: 7, departmentId: 2, office: "Beaverton HQ", deliveryTeamIds: [], groupIds: [0] },
  { name: "Jerry Gergich", roleId: 11, departmentId: 3, office: "Beaverton HQ", deliveryTeamIds: [1], groupIds: [] },
  { name: "Donna Meagle", roleId: 6, departmentId: 3, office: "Beaverton HQ", deliveryTeamIds: [0], groupIds: [0, 2] },
  { name: "Craig Middlebrooks", roleId: 3, departmentId: 2, office: "Hilversum", deliveryTeamIds: [2], groupIds: [2] },
  { name: "Mark Brendanawicz", roleId: 4, departmentId: 0, office: "Shanghai", deliveryTeamIds: [3], groupIds: [] },
  { name: "Dave Sanderson", roleId: 5, departmentId: 3, office: "New York", deliveryTeamIds: [1], groupIds: [1] },
  { name: "Jennifer Barkley", roleId: 6, departmentId: 3, office: "New York", deliveryTeamIds: [0], groupIds: [0] },
  { name: "Ethel Beavers", roleId: 11, departmentId: 3, office: "Beaverton HQ", deliveryTeamIds: [], groupIds: [] },
  { name: "Jean-Ralphio Saperstein", roleId: 6, departmentId: 3, office: "New York", deliveryTeamIds: [3], groupIds: [1, 2] },
  { name: "Mona Lisa Saperstein", roleId: 10, departmentId: 3, office: "New York", deliveryTeamIds: [3], groupIds: [1] },
  { name: "Shauna Malwae-Tweep", roleId: 5, departmentId: 3, office: "Hilversum", deliveryTeamIds: [1], groupIds: [2] },
  { name: "Bobby Newport", roleId: 6, departmentId: 3, office: "Shanghai", deliveryTeamIds: [0], groupIds: [] },
  { name: "Councilman Jamm", roleId: 3, departmentId: 2, office: "Beaverton HQ", deliveryTeamIds: [2], groupIds: [0] },
  // More Friends
  { name: "Richard Burke", roleId: 7, departmentId: 0, office: "New York", deliveryTeamIds: [], groupIds: [0] },
  { name: "Emily Waltham", roleId: 3, departmentId: 2, office: "London", deliveryTeamIds: [2], groupIds: [] },
  { name: "Carol Willick", roleId: 8, departmentId: 1, office: "New York", deliveryTeamIds: [1], groupIds: [1] },
  { name: "Tag Jones", roleId: 8, departmentId: 0, office: "New York", deliveryTeamIds: [1], groupIds: [2] },
  { name: "Estelle Leonard", roleId: 6, departmentId: 3, office: "New York", deliveryTeamIds: [0], groupIds: [] },
  { name: "Charlie Wheeler", roleId: 4, departmentId: 0, office: "Sydney", deliveryTeamIds: [3], groupIds: [2] },
  { name: "Elizabeth Stevens", roleId: 1, departmentId: 0, office: "New York", deliveryTeamIds: [1], groupIds: [] },
  { name: "Barry Farber", roleId: 6, departmentId: 3, office: "New York", deliveryTeamIds: [0], groupIds: [1] },
  { name: "Paolo", roleId: 9, departmentId: 0, office: "London", deliveryTeamIds: [3], groupIds: [] },
  { name: "Kathy", roleId: 1, departmentId: 1, office: "New York", deliveryTeamIds: [2], groupIds: [2] },
  // More Brooklyn Nine-Nine
  { name: "Doug Judy", roleId: 6, departmentId: 3, office: "New York", deliveryTeamIds: [3], groupIds: [1] },
  { name: "Teddy Wells", roleId: 3, departmentId: 2, office: "New York", deliveryTeamIds: [0], groupIds: [] },
  { name: "Sophia Perez", roleId: 8, departmentId: 0, office: "Shanghai", deliveryTeamIds: [1], groupIds: [2] },
  { name: "Bill Fontaine", roleId: 2, departmentId: 1, office: "Hilversum", deliveryTeamIds: [2], groupIds: [] },
  { name: "Marcus Henderson", roleId: 2, departmentId: 1, office: "New York", deliveryTeamIds: [2], groupIds: [1] },
  { name: "Debbie Fogle", roleId: 11, departmentId: 3, office: "New York", deliveryTeamIds: [1], groupIds: [2] },
  { name: "Keith Ferguson", roleId: 0, departmentId: 0, office: "Sydney", deliveryTeamIds: [3], groupIds: [] },
  { name: "Scully Junior", roleId: 0, departmentId: 1, office: "New York", deliveryTeamIds: [3], groupIds: [] },
  { name: "Lohank", roleId: 5, departmentId: 3, office: "Shanghai", deliveryTeamIds: [0], groupIds: [1] },
  { name: "Vulture Pembroke", roleId: 3, departmentId: 2, office: "Beaverton HQ", deliveryTeamIds: [0], groupIds: [0] },
  // Mixed — Parks, Friends, B99
  { name: "Orin", roleId: 9, departmentId: 0, office: "Hilversum", deliveryTeamIds: [3], groupIds: [] },
  { name: "Kyle", roleId: 0, departmentId: 1, office: "Beaverton HQ", deliveryTeamIds: [2], groupIds: [] },
  { name: "Susan Bunch", roleId: 8, departmentId: 1, office: "London", deliveryTeamIds: [1], groupIds: [2] },
  { name: "Mike Hannigan", roleId: 4, departmentId: 0, office: "New York", deliveryTeamIds: [2], groupIds: [0] },
  { name: "Mindy Hunter", roleId: 10, departmentId: 3, office: "New York", deliveryTeamIds: [1], groupIds: [] },
  { name: "David (Phoebe's guy)", roleId: 2, departmentId: 1, office: "Hilversum", deliveryTeamIds: [2], groupIds: [1] },
  { name: "Pete Becker", roleId: 4, departmentId: 0, office: "Sydney", deliveryTeamIds: [3], groupIds: [] },
  { name: "Sandy Richards", roleId: 5, departmentId: 3, office: "Shanghai", deliveryTeamIds: [0], groupIds: [2] },
  { name: "Ken Hotate", roleId: 7, departmentId: 2, office: "Beaverton HQ", deliveryTeamIds: [], groupIds: [0] },
]
const INITIAL_CONTRACTORS = [
  { name: "Raymond Holt", roleId: 3, departmentId: 2, office: "London" },
  { name: "Madeline Wuntch", roleId: 2, departmentId: 1, office: "Sydney" },
  { name: "Kevin Cozner", roleId: 0, departmentId: 0, office: "Melbourne" },
  { name: "Adrian Pimento", roleId: 2, departmentId: 0, office: "New York" },
  { name: "Gina Linetti", roleId: 3, departmentId: 1, office: "Melbourne" },
  { name: "Nikolaj Boyle", roleId: 0, departmentId: 0, office: "Sydney" },
  { name: "Mike Hannigan", roleId: 2, departmentId: 1, office: "New York" },
  { name: "Darth Vader", roleId: 0, departmentId: 1, office: "London" },
  { name: "Luke Skywalker", roleId: 1, departmentId: 2, office: "Sydney" },
  { name: "Han Solo", roleId: 3, departmentId: 1, office: "Melbourne" },
]
const INITIAL_PROJECTS: any[] = []

const INITIAL_CLIENTS_DATA = [{ name: "Agency rack rate" }, { name: "Reebok" }, { name: "Adidas" }]
const ALL_OFFICES = ["Global", "Beaverton HQ", "Hilversum", "Shanghai", "New York", "London", "Sydney"]
const STAGE_COLORS = { planning: "#f59e0b", active: "#10b981", completed: "#6b7280", "on-hold": "#ef4444" }
const CURRENCIES = ["USD","AUD","GBP","EUR","CAD","NZD","SGD","JPY"]

const ACTIVITY_LOG_DATA = [
  { source: "people", entity: "Jake Peralta", type: "allocation", description: "Allocated to Project Phoenix", date: "Feb 12, 2026", details: "40 hrs/week for 8 weeks" },
  { source: "people", entity: "Rosa Diaz", type: "allocation", description: "Allocated to Project Stealth", date: "Feb 14, 2026", details: "40 hrs/week for 10 weeks" },
  { source: "roles", entity: "Designer", type: "person_assigned", description: "Jake Peralta assigned", date: "Feb 12, 2026", details: "Transferred from Developer role" },
  { source: "people", entity: "Amy Santiago", type: "allocation", description: "Allocated to Project Binder", date: "Feb 5, 2026", details: "35 hrs/week for 6 weeks" },
  { source: "roles", entity: "Developer", type: "rate_change", description: "Cost rate changed from $130 to $140", date: "Jan 15, 2026", details: "Market rate adjustment" },
  { source: "departments", entity: "Design", type: "person_assigned", description: "Amy Santiago added", date: "Jan 10, 2026", details: "Transferred from Engineering" },
  { source: "roles", entity: "Senior Designer", type: "person_assigned", description: "Amy Santiago assigned", date: "Jan 10, 2026", details: "Promoted from Designer" },
  { source: "people", entity: "Jake Peralta", type: "role_change", description: "Role changed from Developer to Designer", date: "Jan 28, 2026", details: "Updated by Amy Santiago" },
  { source: "departments", entity: "Marketing", type: "renamed", description: "Renamed from Growth to Marketing", date: "Jan 15, 2026" },
  { source: "roles", entity: "Designer", type: "rate_change", description: "Cost rate changed from $100 to $120", date: "Jan 20, 2026", details: "Annual rate review" },
]
const ROLE_ACTIVITY = {
  "Designer": [
    { type: "person_assigned", description: "Jake Peralta assigned", date: "Feb 12, 2026", details: "Transferred from Developer role" },
    { type: "rate_change", description: "Cost rate changed from $100 to $120", date: "Jan 20, 2026", details: "Annual rate review" },
    { type: "created", description: "Role created", date: "Sep 1, 2025", details: "Initial cost rate: $100" },
  ],
  "Developer": [
    { type: "rate_change", description: "Cost rate changed from $130 to $140", date: "Jan 15, 2026", details: "Market rate adjustment" },
    { type: "created", description: "Role created", date: "Jun 1, 2025", details: "Initial cost rate: $130" },
  ],
}
const PERSON_ACTIVITY = {
  "Jake Peralta": [
    { type: "allocation", description: "Allocated to Project Phoenix", date: "Feb 12, 2026", details: "40 hrs/week for 8 weeks" },
    { type: "role_change", description: "Role changed from Developer to Designer", date: "Jan 28, 2026" },
    { type: "added", description: "Added to the team", date: "Sep 15, 2025", details: "Joined as Developer" },
  ],
  "Amy Santiago": [
    { type: "allocation", description: "Allocated to Project Binder", date: "Feb 5, 2026", details: "35 hrs/week for 6 weeks" },
    { type: "role_change", description: "Role changed from Designer to Senior Designer", date: "Jan 10, 2026" },
    { type: "added", description: "Added to the team", date: "Aug 1, 2025" },
  ],
}

const CLIENTS_FULL = [
  { name: "Google", rateCardName: "Base premium rates, 2026", projects: 12, office: "New York", contact: { name: "Sam Park", email: "sam.park@google.com" }, owner: "Jake Peralta", access: "admin", crmUrl: "https://crm.internal/clients/google", rateCards: [
    { title: "Base premium rates, 2026", currency: "USD", offices: "all", notes: "Agreed at QBR Jan 2026. Includes 10% uplift on all senior roles.", effectiveFrom: "2026-01-01", linkedClients: ["Nike", "LinkedIn"], linkedRoles: [{roleId:0,billRate:160},{roleId:1,billRate:210},{roleId:2,billRate:185},{roleId:3,billRate:220},{roleId:4,billRate:205},{roleId:5,billRate:190}] },
    { title: "Ecomm rates, 2026", currency: "USD", offices: "all", notes: "Secondary card for ecomm-only engagements.", effectiveFrom: "2026-02-01", linkedClients: ["Patagonia"], linkedRoles: [{roleId:0,billRate:135},{roleId:1,billRate:185},{roleId:2,billRate:165},{roleId:3,billRate:190},{roleId:4,billRate:175},{roleId:5,billRate:155}] },
  ]},
  { name: "Verizon", rateCardName: "Base ecomm rates, 2026", projects: 6, office: "New York", contact: { name: "Alex Monroe", email: "alex.monroe@verizon.com" }, owner: "Rosa Diaz", access: "edit", crmUrl: "https://crm.internal/clients/verizon", rateCards: [
    { title: "Base ecomm rates, 2026", currency: "USD", offices: "all", notes: "Standard retainer rates. Reviewed annually each December.", effectiveFrom: "2026-01-15", linkedClients: ["Toyota"], linkedRoles: [{roleId:0,billRate:155},{roleId:1,billRate:200},{roleId:2,billRate:175},{roleId:3,billRate:205},{roleId:4,billRate:190},{roleId:5,billRate:170}] },
  ]},
  { name: "LinkedIn", rateCardName: "Premium rates, 2026", projects: 8, office: "London", contact: { name: "Priya Nair", email: "priya.nair@linkedin.com" }, owner: "Terry Jeffords", access: "edit", crmUrl: "https://crm.internal/clients/linkedin", rateCards: [
    { title: "Premium rates, 2026", currency: "USD", offices: "all", notes: "Premium tier agreed following contract renewal in Q4 2025.", effectiveFrom: "2026-01-01", linkedClients: ["Google", "Verizon"], linkedRoles: [{roleId:0,billRate:170},{roleId:1,billRate:215},{roleId:2,billRate:190},{roleId:3,billRate:220},{roleId:4,billRate:205},{roleId:5,billRate:185}] },
  ]},
  { name: "Nike", rateCardName: "Standard rates, 2026", projects: 10, office: "Beaverton HQ", contact: { name: "Jordan Kim", email: "j.kim@nike.com" }, owner: "Monica Geller", access: "", crmUrl: "", rateCards: [
    { title: "Standard rates, 2026", currency: "USD", offices: "all", notes: "", effectiveFrom: "", linkedRoles: [{roleId:0,billRate:165},{roleId:1,billRate:220},{roleId:2,billRate:190},{roleId:3,billRate:225},{roleId:4,billRate:210},{roleId:5,billRate:190}] },
  ]},
  { name: "Toyota", rateCardName: "Standard rates, 2026", projects: 10, office: "Sydney", contact: { name: "Ken Watanabe", email: "k.watanabe@toyota.com" }, owner: "Monica Geller", access: "", crmUrl: "", rateCards: [
    { title: "Standard rates, 2026", currency: "USD", offices: "all", notes: "", effectiveFrom: "", linkedRoles: [{roleId:0,billRate:165},{roleId:1,billRate:220},{roleId:2,billRate:190},{roleId:3,billRate:225},{roleId:4,billRate:210},{roleId:5,billRate:190}] },
  ]},
  { name: "Patagonia", rateCardName: "Agency specific, 2026", projects: 6, office: "London", contact: { name: "Claire Moss", email: "claire@patagonia.com" }, owner: "", access: "", crmUrl: "", rateCards: [
    { title: "Agency specific, 2026", currency: "USD", offices: "all", notes: "", effectiveFrom: "", linkedRoles: [{roleId:0,billRate:155},{roleId:1,billRate:205},{roleId:2,billRate:175},{roleId:3,billRate:215},{roleId:4,billRate:200},{roleId:5,billRate:180}] },
  ]},
]

const BUSINESS_UNITS_FULL = [
  { name: "Airmax", employees: 145, projects: 3, projectsList: [
    { title: "Airmax 90 Retro Redux", status: "Active", team: 12, budget: 285000 },
    { title: "Airmax Summer Collection", status: "Active", team: 8, budget: 165000 },
    { title: "Airmax Sustainability Initiative", status: "Planning", team: 5, budget: 95000 },
  ], departments: [
    { title: "Marketing Campaign", budget: 450000, spent: 285000, currency: "USD", linkedRoles: [{roleId:0,allocation:15},{roleId:1,allocation:12},{roleId:2,allocation:25},{roleId:3,allocation:10},{roleId:4,allocation:8},{roleId:5,allocation:5}] },
    { title: "Product Launch", budget: 200000, spent: 85000, currency: "USD", linkedRoles: [{roleId:0,allocation:10},{roleId:1,allocation:8},{roleId:2,allocation:18},{roleId:3,allocation:6},{roleId:4,allocation:5},{roleId:5,allocation:3}] },
  ]},
  { name: "LeBron", employees: 98, projects: 4, projectsList: [
    { title: "LeBron XX Performance Testing", status: "Active", team: 15, budget: 340000 },
    { title: "LeBron Signature Lifestyle Line", status: "Active", team: 10, budget: 220000 },
    { title: "LeBron Global Tour Campaign", status: "In Progress", team: 8, budget: 155000 },
    { title: "LeBron Kids Collection", status: "Planning", team: 6, budget: 85000 },
  ], departments: [
    { title: "Design Development", budget: 380000, spent: 220000, currency: "USD", linkedRoles: [{roleId:0,allocation:12},{roleId:1,allocation:10},{roleId:2,allocation:20},{roleId:3,allocation:8},{roleId:4,allocation:6},{roleId:5,allocation:4}] },
    { title: "Athlete Relations", budget: 150000, spent: 65000, currency: "USD", linkedRoles: [{roleId:0,allocation:8},{roleId:1,allocation:6},{roleId:2,allocation:14},{roleId:3,allocation:5},{roleId:4,allocation:4},{roleId:5,allocation:2}] },
  ]},
  { name: "Jordan", employees: 112, projects: 3, projectsList: [
    { title: "Air Jordan 39 Release", status: "Active", team: 18, budget: 425000 },
    { title: "Jordan Heritage Museum Digital", status: "Active", team: 7, budget: 145000 },
    { title: "Jordan Women's Expansion", status: "Planning", team: 9, budget: 195000 },
  ], departments: [
    { title: "Heritage Marketing", budget: 420000, spent: 195000, currency: "USD", linkedRoles: [{roleId:0,allocation:14},{roleId:1,allocation:11},{roleId:2,allocation:22},{roleId:3,allocation:9},{roleId:4,allocation:7},{roleId:5,allocation:4}] },
  ]},
  { name: "Nike Runnings", employees: 156, projects: 5, projectsList: [
    { title: "Vaporfly Elite Development", status: "Active", team: 20, budget: 580000 },
    { title: "NextGen Running App", status: "Active", team: 14, budget: 320000 },
    { title: "Marathon Training Series", status: "In Progress", team: 11, budget: 240000 },
    { title: "Trail Running Expansion", status: "Active", team: 9, budget: 185000 },
    { title: "Running Analytics Platform", status: "Planning", team: 8, budget: 165000 },
  ], departments: [
    { title: "Performance Research", budget: 520000, spent: 340000, currency: "USD", linkedRoles: [{roleId:0,allocation:18},{roleId:1,allocation:14},{roleId:2,allocation:28},{roleId:3,allocation:12},{roleId:4,allocation:10},{roleId:5,allocation:6}] },
    { title: "Technology Innovation", budget: 250000, spent: 120000, currency: "USD", linkedRoles: [{roleId:0,allocation:12},{roleId:1,allocation:10},{roleId:2,allocation:20},{roleId:3,allocation:8},{roleId:4,allocation:6},{roleId:5,allocation:4}] },
  ]},
  { name: "Nike Football", employees: 78, projects: 3, projectsList: [
    { title: "Phantom GX Elite Campaign", status: "Active", team: 13, budget: 295000 },
    { title: "Football Academy Sponsorship", status: "Active", team: 7, budget: 125000 },
    { title: "Women's Football Growth", status: "Planning", team: 9, budget: 185000 },
  ], departments: [
    { title: "Team Partnerships", budget: 280000, spent: 150000, currency: "USD", linkedRoles: [{roleId:0,allocation:8},{roleId:1,allocation:7},{roleId:2,allocation:14},{roleId:3,allocation:6},{roleId:4,allocation:5},{roleId:5,allocation:3}] },
  ]},
  { name: "Nike Sportswear", employees: 134, projects: 4, projectsList: [
    { title: "Essentials Collection Redesign", status: "Active", team: 12, budget: 275000 },
    { title: "Sustainability Material Research", status: "In Progress", team: 8, budget: 165000 },
    { title: "Urban Lifestyle Campaign", status: "Active", team: 10, budget: 225000 },
    { title: "Vintage Revival Series", status: "Planning", team: 6, budget: 95000 },
  ], departments: [
    { title: "Lifestyle Marketing", budget: 395000, spent: 210000, currency: "USD", linkedRoles: [{roleId:0,allocation:13},{roleId:1,allocation:9},{roleId:2,allocation:21},{roleId:3,allocation:8},{roleId:4,allocation:7},{roleId:5,allocation:4}] },
  ]},
  { name: "Nike Training", employees: 89, projects: 3, projectsList: [
    { title: "Metcon Innovation Program", status: "Active", team: 11, budget: 245000 },
    { title: "Fitness App Integration", status: "In Progress", team: 9, budget: 185000 },
    { title: "Training Equipment Redesign", status: "Planning", team: 7, budget: 135000 },
  ], departments: [
    { title: "Fitness Program", budget: 310000, spent: 160000, currency: "USD", linkedRoles: [{roleId:0,allocation:9},{roleId:1,allocation:8},{roleId:2,allocation:16},{roleId:3,allocation:7},{roleId:4,allocation:5},{roleId:5,allocation:3}] },
  ]},
  { name: "Nike SB", employees: 67, projects: 2, projectsList: [
    { title: "SB Dunk Premium Series", status: "Active", team: 8, budget: 165000 },
    { title: "Skate Park Partnership Network", status: "Active", team: 5, budget: 95000 },
  ], departments: [
    { title: "Skate Culture", budget: 240000, spent: 130000, currency: "USD", linkedRoles: [{roleId:0,allocation:7},{roleId:1,allocation:6},{roleId:2,allocation:12},{roleId:3,allocation:5},{roleId:4,allocation:4},{roleId:5,allocation:2}] },
  ]},
  { name: "Zoom Air", employees: 103, projects: 2, projectsList: [
    { title: "Zoom Air Cushioning Tech Gen 4", status: "Active", team: 14, budget: 325000 },
    { title: "Cross-Sport Zoom Integration", status: "Planning", team: 8, budget: 175000 },
  ], departments: [
    { title: "Technology Development", budget: 360000, spent: 190000, currency: "USD", linkedRoles: [{roleId:0,allocation:11},{roleId:1,allocation:9},{roleId:2,allocation:19},{roleId:3,allocation:8},{roleId:4,allocation:6},{roleId:5,allocation:4}] },
  ]},
  { name: "Converse", employees: 91, projects: 2, projectsList: [
    { title: "Chuck Taylor All Star 2050", status: "Active", team: 10, budget: 245000 },
    { title: "Converse Collaboration Series", status: "In Progress", team: 7, budget: 155000 },
  ], departments: [
    { title: "Brand Strategy", budget: 330000, spent: 175000, currency: "USD", linkedRoles: [{roleId:0,allocation:10},{roleId:1,allocation:8},{roleId:2,allocation:17},{roleId:3,allocation:7},{roleId:4,allocation:5},{roleId:5,allocation:3}] },
  ]},
]

const SAMPLE_NOTES_POOL = [
  [
    { text: "Kicked off with the full team — good energy, everyone aligned on Q1 goals.", author: "Amy Santiago", timestamp: Date.now() - 1000 * 60 * 60 * 48 },
    { text: "Budget reviewed and approved. Starting creative brief this week.", author: "Jake Peralta", timestamp: Date.now() - 1000 * 60 * 60 * 24 },
  ],
  [
    { text: "Client flagged some concerns around timeline. Scheduling a sync for Monday.", author: "Rosa Diaz", timestamp: Date.now() - 1000 * 60 * 60 * 72 },
  ],
  [
    { text: "Design phase complete. Moving into development sprint next week.", author: "Charles Boyle", timestamp: Date.now() - 1000 * 60 * 60 * 36 },
    { text: "Stakeholder review went well — minor copy tweaks requested.", author: "Amy Santiago", timestamp: Date.now() - 1000 * 60 * 90 },
  ],
  [
    { text: "Resource allocation confirmed. Terry is leading the delivery team.", author: "Terry Jeffords", timestamp: Date.now() - 1000 * 60 * 60 * 120 },
    { text: "Blocked on approval from legal — following up today.", author: "Rosa Diaz", timestamp: Date.now() - 1000 * 60 * 60 * 10 },
  ],
  [
    { text: "First milestone hit on time. Team is in good shape.", author: "Jake Peralta", timestamp: Date.now() - 1000 * 60 * 45 },
  ],
  [
    { text: "Vendor contract signed. Deliverables expected end of month.", author: "Monica Geller", timestamp: Date.now() - 1000 * 60 * 60 * 60 },
    { text: "Internal review scheduled for Thursday. Deck needs updating.", author: "Charles Boyle", timestamp: Date.now() - 1000 * 60 * 60 * 5 },
  ],
  [
    { text: "Budget variance flagged — need sign-off from finance before proceeding.", author: "Amy Santiago", timestamp: Date.now() - 1000 * 60 * 60 * 30 },
  ],
  [
    { text: "Campaign assets delivered. Waiting on client sign-off.", author: "Rachel Green", timestamp: Date.now() - 1000 * 60 * 60 * 18 },
  ],
]

function getBusinessUnitProjects() {
  const stageMap: Record<string, string> = { "Active": "active", "In Progress": "active", "Planning": "planning" }
  const offices = ["Global", "Beaverton HQ", "Hilversum", "Shanghai", "New York", "London", "Sydney"]
  const allProjects: any[] = []

  BUSINESS_UNITS_FULL.forEach((unit, unitIdx) => {
    if (unit.projectsList) {
      unit.projectsList.forEach((proj, idx) => {
        const globalIdx = allProjects.length
        const sampleNotes = globalIdx % 2 === 0
          ? SAMPLE_NOTES_POOL[globalIdx % SAMPLE_NOTES_POOL.length]
          : undefined
        allProjects.push({
          name: proj.title,
          code: `${(unit.name.split(" ").pop() ?? unit.name).toUpperCase()}-${String(idx + 1).padStart(3, "0")}`,
          clientId: Math.floor(Math.random() * CLIENTS_FULL.length),
          stage: stageMap[proj.status] || "planning",
          margin: Math.floor(Math.random() * 15) + 20,
          budget: proj.budget,
          startDate: "2026-01-15",
          endDate: "2026-12-31",
          ownerId: Math.floor(Math.random() * 6),
          office: offices[Math.floor(Math.random() * offices.length)],
          unit: unit.name,
          health: ["on-track","at-risk","off-track"][Math.floor(Math.random() * 3)],
          notes: sampleNotes,
        })
      })
    }
  })
  return allProjects
}

const globalSidebarItems = [
  { name: "Dashboard", icon: <Gauge size={16} strokeWidth={1}/> },
  { name: "Report", icon: <BarChart3 size={16} strokeWidth={1}/> },
]
const officeItems = [
  { name: "Dashboard", icon: <Gauge size={16} strokeWidth={1}/> },
  { name: "Schedule", icon: <ScheduleIcon/> },
  { name: "Project plan", icon: <ProjectPlanIcon/> },
  { name: "Project tracker", icon: <FolderOpen size={16} strokeWidth={1}/> },
  { name: "Report", icon: <BarChart3 size={16} strokeWidth={1}/> },
  { name: "Log team", icon: <LogTeamIcon/> },
]
const officeItemsMyTime = [
  ...officeItems.slice(0, 5),
  { name: "My time", icon: <Clock size={16} strokeWidth={1}/> },
  { name: "Log team", icon: <LogTeamIcon/> },
]
const dataHubItems = [
  { name: "Org design", icon: <OfficeIcon/> },
  { name: "People", icon: <Users size={16} strokeWidth={1}/> },
  { name: "Roles", icon: <ChefHat size={16} strokeWidth={1}/> },
  { name: "Projects", icon: <FolderOpen size={16} strokeWidth={1}/> },
  { name: "Clients", icon: <Building2 size={16} strokeWidth={1}/> },
  { name: "Rate cards", icon: <DollarSign size={16} strokeWidth={1}/> },
  { name: "Brands", icon: <Pyramid size={16} strokeWidth={1}/> },
  { name: "Activity log", icon: <Clock size={16} strokeWidth={1}/> },
]
const LOCATIONS_INIT = [
  { name: "Global", icon: <OfficeIcon/>, expanded: true, items: globalSidebarItems },
  { name: "Beaverton HQ", icon: <OfficeIcon/>, expanded: false, items: officeItems },
  { name: "Hilversum", icon: <OfficeIcon/>, expanded: false, items: officeItems },
  { name: "Shanghai", icon: <OfficeIcon/>, expanded: false, items: officeItems },
  { name: "New York", icon: <OfficeIcon/>, expanded: false, items: officeItemsMyTime },
  { name: "London", icon: <OfficeIcon/>, expanded: false, items: officeItems },
  { name: "Sydney", icon: <OfficeIcon/>, expanded: false, items: officeItems },
]

// ── Shared UI ──
function OfficeFilter({ selected, onChange }: any) {
  const [open, setOpen] = useState(false)
  const isAll = selected.length === ALL_OFFICES.length
  const label = isAll ? "All offices" : selected.length === 1 ? selected[0] : `${selected.length} offices`
  function toggleOffice(o: any) {
    onChange((prev: any) => {
      if (prev.length === ALL_OFFICES.length) return [o]
      if (prev.includes(o)) { const n = prev.filter((x: any) => x !== o); return n.length === 0 ? [...ALL_OFFICES] : n }
      const n = [...prev, o]; return n.length === ALL_OFFICES.length ? [...ALL_OFFICES] : n
    })
  }
  return (
    <DropdownWrapper open={open} setOpen={setOpen}
      trigger={
        <HoverBtn onClick={() => setOpen(!open)} style={{ ...s.pillBtn(!isAll), gap: 6 }}>
          <Circle size={10} strokeWidth={1}/>{label}
          <ChevronDown size={12} strokeWidth={1} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}/>
        </HoverBtn>
      }>
      <div style={s.dropdown}>
        <button onClick={() => onChange([...ALL_OFFICES])} style={s.dropdownItem(isAll)}>
          All offices {isAll && <Check size={12} strokeWidth={1}/>}
        </button>
        <div style={{ height: 1, background: t.border, margin: "4px 0" }}/>
        {ALL_OFFICES.map(o => (
          <button key={o} onClick={() => toggleOffice(o)} style={s.dropdownItem(selected.includes(o))}>
            {o} {selected.includes(o) && !isAll && <Check size={12} strokeWidth={1}/>}
          </button>
        ))}
      </div>
    </DropdownWrapper>
  )
}

function Tabs({ tabs, active, onChange }: any) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {tabs.map((tab: any) => (
        <HoverBtn key={tab.label} onClick={() => onChange(tab.value)}
          style={{ padding: "4px 10px", borderRadius: 6, border: "none", background: active === tab.value ? t.accent : "transparent", color: active === tab.value ? t.fg : t.secondaryFg, cursor: "pointer", fontSize: 12, fontWeight: active === tab.value ? 500 : 400 }}>
          {tab.label}
        </HoverBtn>
      ))}
    </div>
  )
}

function SectionHeader({ count, label, onAdd, filterField, filterValue, onClearFilter }: any) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ fontSize: 18, fontWeight: 400, fontFamily: "var(--font-lexend), sans-serif", color: t.fg }}>{count} {label}</h1>
        {filterField && filterValue
          ? <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              <Tag label={filterField}/>
              <Tag label="is"/>
              <Tag label={Array.isArray(filterValue) ? filterValue.join(", ") : filterValue}/>
              <button onClick={onClearFilter} style={{ display:"flex", alignItems:"center", background:"none", border:"none", cursor:"pointer", padding:2, color:t.mutedFg }}><X size={12} strokeWidth={1.5}/></button>
            </div>
          : <HoverBtn style={s.outlineBtn}><ListFilter size={11} strokeWidth={1}/>Filter</HoverBtn>
        }
      </div>
      <button onClick={onAdd} style={{ ...s.primaryBtn, background: t.sectionAddBtnBg, color: t.sectionAddBtnFg }}><Plus size={16} strokeWidth={1}/></button>
    </div>
  )
}

function Sheet({ title, subtitle, onClose, children, width = 380 }: any) {
  return (
    <div style={{ width, flexShrink: 0, borderLeft: `1px solid ${t.sidebarBorder}`, background: t.bg, display: "flex", flexDirection: "column", height: "100%", borderRadius: "8px 0 0 0", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${t.border}`, padding: "16px 20px" }}>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: t.fg }}>{title}</h2>
          {subtitle && <p style={{ fontSize: 12, color: t.mutedFg, marginTop: 2 }}>{subtitle}</p>}
        </div>
        <HoverBtn onClick={onClose} style={{ ...s.iconBtn, color: t.mutedFg }}><X size={16} strokeWidth={1}/></HoverBtn>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>{children}</div>
    </div>
  )
}

function DetailGrid({ items }: any) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${t.border}` }}>
      {items.map((item: any, i: any) => (
        <div key={i}>
          <span style={{ fontSize: 11, fontWeight: 500, color: t.mutedFg }}>{item.label}</span>
          <p style={{ fontSize: 13, color: t.fg, marginTop: 2 }}>{item.value}</p>
        </div>
      ))}
    </div>
  )
}

function ActivityTimeline({ entries }: any) {
  const iconColors = {
    added: { bg: "#052e16", fg: "#4ade80" }, allocation: { bg: "#451a03", fg: "#fb923c" },
    role_change: { bg: "#172554", fg: "#60a5fa" }, office_transfer: { bg: "#2e1065", fg: "#a78bfa" },
    created: { bg: "#052e16", fg: "#4ade80" }, rate_change: { bg: "#451a03", fg: "#fb923c" },
    person_assigned: { bg: "#172554", fg: "#60a5fa" }, person_removed: { bg: "#450a0a", fg: "#f87171" },
    renamed: { bg: "#451a03", fg: "#fb923c" },
  }
  function getIcon(type: any) {
    if (type === "added" || type === "person_assigned") return <UserPlus size={13} strokeWidth={1}/>
    if (type === "role_change" || type === "renamed") return <ArrowRightLeft size={13} strokeWidth={1}/>
    if (type === "allocation") return <CalendarClock size={13} strokeWidth={1}/>
    if (type === "office_transfer") return <Briefcase size={13} strokeWidth={1}/>
    if (type === "created") return <CalendarClock size={13} strokeWidth={1}/>
    if (type === "rate_change") return <DollarSign size={13} strokeWidth={1}/>
    if (type === "person_removed") return <Users size={13} strokeWidth={1}/>
    return <Settings size={13} strokeWidth={1}/>
  }
  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: 13, top: 12, bottom: 12, width: 1, background: t.border }}/>
      {entries.map((e: any, i: any) => {
        const col = (iconColors as any)[e.type] || { bg: t.muted, fg: t.mutedFg }
        return (
          <div key={i} style={{ display: "flex", gap: 12, paddingBottom: 20 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: col.bg, color: col.fg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative", zIndex: 1 }}>
              {getIcon(e.type)}
            </div>
            <div style={{ flex: 1, paddingTop: 2 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: t.fg }}>{e.description}</p>
              {e.details && <p style={{ fontSize: 12, color: t.mutedFg, marginTop: 2 }}>{e.details}</p>}
              <p style={{ fontSize: 11, color: t.mutedFg, marginTop: 4 }}>{e.date}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Modals ──
function AddRoleModal({ onAdd, onClose }: any) {
  const [name, setName] = useState("")
  const [costRate, setCostRate] = useState("")
  const nameRef = useRef<HTMLInputElement>(null)
  useEffect(() => { nameRef.current?.focus() }, [])
  function submit() {
    const n = name.trim()
    if (!n) return
    onAdd({ name: n, costRate: parseFloat(costRate) || 0, activePeople: 0, unassigned: 0 })
    onClose()
  }
  return (
    <div style={{ position: "fixed", inset: 0, background: t.overlayBg, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: t.popover, border: `1px solid ${t.border}`, borderRadius: 12, padding: 24, width: 360, boxShadow: `0 8px 32px ${t.shadowDarker}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: t.fg }}>Add role</h2>
          <HoverBtn onClick={onClose} style={{ ...s.iconBtn, color: t.mutedFg }}><X size={16} strokeWidth={1}/></HoverBtn>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Role name</label>
          <input ref={nameRef} value={name} onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submit(); if (e.key === "Escape") onClose() }}
            placeholder="e.g. Senior Developer"
            style={{ width: "100%", fontSize: 13, color: t.fg, background: t.muted, border: `1px solid ${t.border}`, borderRadius: 6, padding: "8px 12px", outline: "none", fontFamily: "inherit" }}/>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Cost rate ($/hr)</label>
          <input type="number" value={costRate} onChange={e => setCostRate(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submit(); if (e.key === "Escape") onClose() }}
            placeholder="0"
            style={{ width: "100%", fontSize: 13, color: t.fg, background: t.muted, border: `1px solid ${t.border}`, borderRadius: 6, padding: "8px 12px", outline: "none", fontFamily: "inherit" }}/>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <HoverBtn onClick={onClose} style={{ ...s.outlineBtn, padding: "6px 16px", borderRadius: 6 }}>Cancel</HoverBtn>
          <button onClick={submit} disabled={!name.trim()}
            style={{ padding: "6px 16px", borderRadius: 6, border: "none", background: name.trim() ? t.fg : t.muted, color: name.trim() ? t.bg : t.mutedFg, cursor: name.trim() ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 500 }}>
            Add role
          </button>
        </div>
      </div>
    </div>
  )
}

function AddPersonModal({ roles, departments, onAdd, onClose, type = "employee" }: any) {
  const [name, setName] = useState("")
  const [roleId, setRoleId] = useState(0)
  const [departmentId, setDepartmentId] = useState(0)
  const [office, setOffice] = useState("New York")
  const nameRef = useRef<HTMLInputElement>(null)
  useEffect(() => { nameRef.current?.focus() }, [])
  const officeOpts = ["New York", "London", "Sydney", "Melbourne", "Austin", "Los Angeles", "San Francisco", "Chicago", "Tokyo", "Singapore", "Berlin", "Paris", "Madrid"]
  function submit() {
    const n = name.trim()
    if (!n) return
    onAdd({ name: n, roleId, departmentId, office })
    onClose()
  }
  const sel = { width: "100%", fontSize: 13, color: t.fg, background: t.muted, border: `1px solid ${t.border}`, borderRadius: 6, padding: "8px 12px", outline: "none", fontFamily: "inherit" }
  return (
    <div style={{ position: "fixed", inset: 0, background: t.overlayBg, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: t.popover, border: `1px solid ${t.border}`, borderRadius: 12, padding: 24, width: 400, boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: t.fg }}>Add {type === "contractor" ? "contractor" : "employee"}</h2>
          <HoverBtn onClick={onClose} style={{ ...s.iconBtn, color: t.mutedFg }}><X size={16} strokeWidth={1}/></HoverBtn>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Full name</label>
            <input ref={nameRef} value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") submit(); if (e.key === "Escape") onClose() }}
              placeholder="e.g. John Smith"
              style={{ width: "100%", fontSize: 13, color: t.fg, background: t.muted, border: `1px solid ${t.border}`, borderRadius: 6, padding: "8px 12px", outline: "none", fontFamily: "inherit" }}/>
          </div>
          <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Role</label>
            <select value={roleId} onChange={e => setRoleId(Number(e.target.value))} style={sel}>{roles.map((r: any,i: any) => <option key={i} value={i}>{r.name}</option>)}</select></div>
          <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Department</label>
            <select value={departmentId} onChange={e => setDepartmentId(Number(e.target.value))} style={sel}>{departments.map((d: any,i: any) => <option key={i} value={i}>{d.name}</option>)}</select></div>
          <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Office</label>
            <select value={office} onChange={e => setOffice(e.target.value)} style={sel}>{officeOpts.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <HoverBtn onClick={onClose} style={{ ...s.outlineBtn, padding: "6px 16px", borderRadius: 6 }}>Cancel</HoverBtn>
          <button onClick={submit} disabled={!name.trim()}
            style={{ padding: "6px 16px", borderRadius: 6, border: "none", background: name.trim() ? t.fg : t.muted, color: name.trim() ? t.bg : t.mutedFg, cursor: name.trim() ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 500 }}>
            Add person
          </button>
        </div>
      </div>
    </div>
  )
}

function AddDepartmentModal({ onAdd, onClose }: any) {
  const [name, setName] = useState("")
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => { ref.current?.focus() }, [])
  function submit() {
    const n = name.trim()
    if (!n) return
    onAdd({ name: n })
    onClose()
  }
  return (
    <div style={{ position: "fixed", inset: 0, background: t.overlayBg, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: t.popover, border: `1px solid ${t.border}`, borderRadius: 12, padding: 24, width: 360, boxShadow: `0 8px 32px ${t.shadowDarker}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: t.fg }}>Add department</h2>
          <HoverBtn onClick={onClose} style={{ ...s.iconBtn, color: t.mutedFg }}><X size={16} strokeWidth={1}/></HoverBtn>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Department name</label>
          <input ref={ref} value={name} onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submit(); if (e.key === "Escape") onClose() }}
            placeholder="e.g. Strategy"
            style={{ width: "100%", fontSize: 13, color: t.fg, background: t.muted, border: `1px solid ${t.border}`, borderRadius: 6, padding: "8px 12px", outline: "none", fontFamily: "inherit" }}/>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <HoverBtn onClick={onClose} style={{ ...s.outlineBtn, padding: "6px 16px", borderRadius: 6 }}>Cancel</HoverBtn>
          <button onClick={submit} disabled={!name.trim()}
            style={{ padding: "6px 16px", borderRadius: 6, border: "none", background: name.trim() ? t.fg : t.muted, color: name.trim() ? t.bg : t.mutedFg, cursor: name.trim() ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 500 }}>
            Add
          </button>
        </div>
      </div>
    </div>
  )
}

function AddProjectModal({ people, clients, onAdd, onClose }: any) {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [clientId, setClientId] = useState(0)
  const [stage, setStage] = useState("planning")
  const [margin, setMargin] = useState("30")
  const [budget, setBudget] = useState("")
  const [startDate, setStartDate] = useState("2026-03-01")
  const [endDate, setEndDate] = useState("2026-12-31")
  const [ownerId, setOwnerId] = useState(0)
  const [office, setOffice] = useState("New York")
  const nameRef = useRef<HTMLInputElement>(null)
  useEffect(() => { nameRef.current?.focus() }, [])
  const officeOpts = ["New York", "London", "Sydney", "Melbourne"]
  const inp = { width: "100%", fontSize: 13, color: t.fg, background: t.muted, border: `1px solid ${t.border}`, borderRadius: 6, padding: "8px 12px", outline: "none", fontFamily: "inherit" }
  function submit() {
    const n = name.trim()
    if (!n) return
    onAdd({ name: n, code: code.trim() || `PRJ-${String(Date.now()).slice(-3)}`, clientId, stage, margin: parseFloat(margin)||0, budget: parseFloat(budget)||0, startDate, endDate, ownerId, office })
    onClose()
  }
  return (
    <div style={{ position: "fixed", inset: 0, background: t.overlayBg, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: t.popover, border: `1px solid ${t.border}`, borderRadius: 12, padding: 24, width: 480, boxShadow: `0 8px 32px ${t.shadowDarker}`, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: t.fg }}>Add project</h2>
          <HoverBtn onClick={onClose} style={{ ...s.iconBtn, color: t.mutedFg }}><X size={16} strokeWidth={1}/></HoverBtn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
          <div style={{ gridColumn: "1/-1" }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Project name</label>
            <input ref={nameRef} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Q3 Campaign" style={inp}/>
          </div>
          <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Code</label><input value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. CAM-001" style={inp}/></div>
          <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Client</label><select value={clientId} onChange={e => setClientId(Number(e.target.value))} style={inp}>{clients.map((c: any,i: any) => <option key={i} value={i}>{c.name}</option>)}</select></div>
          <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Stage</label><select value={stage} onChange={e => setStage(e.target.value)} style={inp}>{["planning","active","on-hold","completed"].map(s2 => <option key={s2} value={s2}>{s2}</option>)}</select></div>
          <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Office</label><select value={office} onChange={e => setOffice(e.target.value)} style={inp}>{officeOpts.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
          <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Margin (%)</label><input type="number" value={margin} onChange={e => setMargin(e.target.value)} placeholder="30" style={inp}/></div>
          <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Budget ($)</label><input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="0" style={inp}/></div>
          <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Start date</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ ...inp, colorScheme: "dark" }}/></div>
          <div><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>End date</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ ...inp, colorScheme: "dark" }}/></div>
          <div style={{ gridColumn: "1/-1" }}><label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.mutedFg, marginBottom: 6 }}>Owner</label><select value={ownerId} onChange={e => setOwnerId(Number(e.target.value))} style={inp}>{people.map((p: any,i: any) => <option key={i} value={i}>{p.name}</option>)}</select></div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <HoverBtn onClick={onClose} style={{ ...s.outlineBtn, padding: "6px 16px", borderRadius: 6 }}>Cancel</HoverBtn>
          <button onClick={submit} disabled={!name.trim()}
            style={{ padding: "6px 16px", borderRadius: 6, border: "none", background: name.trim() ? t.fg : t.muted, color: name.trim() ? t.bg : t.mutedFg, cursor: name.trim() ? "pointer" : "not-allowed", fontSize: 13, fontWeight: 500 }}>
            Add project
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Notifications data ──
const NOTIFICATIONS_DATA = [
  { id: 1, initials: "JA", color: "#7c5cbf", action: "approved", bold: "Shay Ho", detail: "on Time off (All Day) from Mar 27 2026 - Mar 30 2026", time: "7d", badge: null },
  { id: 2, initials: "JA", color: "#7c5cbf", action: "requested", bold: "themselves", detail: "on Learning and Development (8h) on Mar 18 2026", time: "12d", badge: null },
  { id: 3, initials: "JA", color: "#7c5cbf", action: "requested", bold: "themselves", detail: "on Time off (8h) from Mar 13 2026 - Mar 16 2026", time: "12d", badge: null },
  { id: 4, initials: "JA", color: "#7c5cbf", action: "requested", bold: "themselves", detail: "on Time off (8h) on May 08 2026", time: "12d", badge: "Pending" },
  { id: 5, initials: "JA", color: "#7c5cbf", action: "requested", bold: "themselves", detail: "on Time off (8h) from Apr 02 2026 - Apr 06 2026", time: "12d", badge: null },
  { id: 6, initials: "JA", color: "#7c5cbf", action: "approved", bold: "Shay Ho", detail: "on Time off (All Day) from Apr 22 2026 - Apr 25 2026", time: "15d", badge: null },
  { id: 7, initials: "JA", color: "#7c5cbf", action: "requested", bold: "themselves", detail: "on Sick leave (8h) on Apr 10 2026", time: "18d", badge: null },
  { id: 8, initials: "JA", color: "#7c5cbf", action: "declined", bold: "Shay Ho", detail: "on Time off (8h) on Mar 05 2026", time: "21d", badge: null },
]

function NotificationsPanel({ onClose, floating, navHoverOpen }: { onClose: () => void, floating: boolean, navHoverOpen: boolean }) {
  const [tab, setTab] = useState<"all" | "requests">("all")
  const tabBtn = (active: boolean) => ({
    background: "none", border: "none", cursor: "pointer", padding: "2px 0",
    fontSize: 13, fontWeight: active ? 600 : 400,
    color: active ? t.fg : t.mutedFg, borderBottom: active ? `2px solid ${t.fg}` : "2px solid transparent",
  })
  return (
    <div style={{
      position: "fixed",
      left: floating ? (navHoverOpen ? 264 : 8) : 252,
      animation: "notifSlideIn 0.18s ease",
      top: floating ? 8 : 0,
      width: 340,
      height: floating ? "calc(100vh - 16px)" : "100vh",
      zIndex: 95,
      background: t.sidebar,
      borderRadius: floating ? 10 : 0,
      border: `1px solid ${t.border}`,
      borderLeft: `1px solid ${t.sidebarBorder}`,
      boxShadow: floating ? "0 2px 12px rgba(0,0,0,0.25)" : "none",
      transition: "left 0.2s ease",
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px 10px", borderBottom: `1px solid ${t.border}` }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: t.fg, flex: 1 }}>Notifications</span>
        <button onClick={() => setTab("all")} style={tabBtn(tab === "all")}>All</button>
        <button onClick={() => setTab("requests")} style={tabBtn(tab === "requests")}>Requests</button>
        <HoverBtn onClick={onClose} style={{ ...{display:"flex",alignItems:"center",justifyContent:"center",width:24,height:24,borderRadius:4,border:"none",background:"transparent",cursor:"pointer"}, color: t.mutedFg }}><X size={14} strokeWidth={1}/></HoverBtn>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {NOTIFICATIONS_DATA.map(n => (
          <div key={n.id} style={{ display: "flex", gap: 10, padding: "12px 16px", borderBottom: `1px solid ${t.border}`, cursor: "pointer" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: n.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "#fff", flexShrink: 0 }}>{n.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, color: t.fg, lineHeight: 1.45, margin: 0 }}>
                <span style={{ fontWeight: 500 }}>Jill Avis</span> {n.action} <span style={{ fontWeight: 600 }}>{n.bold}</span> {n.detail}
              </p>
              {n.badge && <span style={{ display: "inline-block", marginTop: 5, fontSize: 11, fontWeight: 500, color: "#c97a1a", background: "rgba(201,122,26,0.15)", borderRadius: 4, padding: "2px 6px" }}>{n.badge}</span>}
            </div>
            <span style={{ fontSize: 11, color: t.mutedFg, whiteSpace: "nowrap", paddingTop: 1 }}>{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Sidebar ──
function SidebarNav({ version, activeItem, onActiveItemChange, onBreadcrumbChange, themeMode, onThemeChange, visibleDataHubItems, onVisibleDataHubItemsChange, collapsed, onToggleCollapsed, notificationsOpen, onNotificationsToggle, onHoverChange, onSettingsOffice, hasSavedDashboard, onSavedDashboardClick, showFloatAgent, onFloatAgentToggle }: any) {
  const [locs, setLocs] = useState(LOCATIONS_INIT)
  const [dataHubExp, setDataHubExp] = useState(true)
  const [dataHubSettingsOpen, setDataHubSettingsOpen] = useState(false)
  const dataHubSettingsRef = useRef<HTMLDivElement>(null)
  const [orgOpen, setOrgOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [hoverOpen, setHoverOpen] = useState(false)
  const [officeKebabOpen, setOfficeKebabOpen] = useState<string | null>(null)
  const [officeHovered, setOfficeHovered] = useState<string | null>(null)

  useEffect(() => { if (!collapsed) { setHoverOpen(false); onHoverChange?.(false) } }, [collapsed])

  const showFullNav = !collapsed || hoverOpen

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dataHubSettingsRef.current && !dataHubSettingsRef.current.contains(event.target)) {
        setDataHubSettingsOpen(false)
      }
    }
    if (dataHubSettingsOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dataHubSettingsOpen])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.shiftKey && e.key === "K") {
        e.preventDefault()
        setDataHubSettingsOpen(o => !o)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (!officeKebabOpen) return
    function handleClick() { setOfficeKebabOpen(null) }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [officeKebabOpen])

  function setActive(name: any, bc: any) { onActiveItemChange(name); onBreadcrumbChange(bc || [name]) }
  function toggleLoc(i: any) {
    setLocs((prev: any) => prev.map((l: any, idx: any) => idx === i ? { ...l, expanded: !l.expanded } : { ...l, expanded: false, children: l.children?.map((c: any) => ({ ...c, expanded: false })) }))
  }

  const navItemStyle = (active: any) => ({
    display: "flex", alignItems: "center", justifyContent: showFullNav ? "flex-start" : "center",
    gap: 8, width: "100%", padding: showFullNav ? "6px 8px" : "7px 0",
    borderRadius: 6, border: "none", background: active ? t.accent : "transparent",
    color: active ? t.fg : t.sidebarFg, cursor: "pointer", fontSize: 13,
    fontWeight: active ? 500 : 400, textAlign: "left" as const,
  })

  return (
    <>
    {/* Spacer: keeps layout when nav is pinned open */}
    <div style={{ width: collapsed ? 0 : 252, flexShrink: 0, transition: "width 0.2s ease" }} />
    {/* Hover trigger strip — invisible, catches mouse entry near left edge when nav is closed */}
    {collapsed && (
      <div style={{ position: "fixed", left: 0, top: 0, width: 16, height: "100vh", zIndex: 99 }}
        onMouseEnter={() => { setHoverOpen(true); onHoverChange?.(true) }} />
    )}
    <aside
      onMouseLeave={collapsed ? () => { setHoverOpen(false); onHoverChange?.(false) } : undefined}
      style={{
        ...s.sidebar,
        position: "fixed",
        left: collapsed ? (hoverOpen ? 8 : -260) : 0,
        top: collapsed ? 8 : 0,
        height: collapsed ? "calc(100vh - 16px)" : "100vh",
        width: 252,
        zIndex: dataHubSettingsOpen || officeKebabOpen ? 200 : 100,
        transition: "left 0.2s ease, top 0.2s ease, height 0.2s ease, border-radius 0.2s ease, box-shadow 0.2s ease",
        overflow: dataHubSettingsOpen || officeKebabOpen ? "visible" : "hidden",
        borderRadius: collapsed ? 10 : 0,
        borderTop: collapsed && hoverOpen ? `1px solid ${t.border}` : "none",
        borderBottom: collapsed && hoverOpen ? `1px solid ${t.border}` : "none",
        borderLeft: collapsed && hoverOpen ? `1px solid ${t.border}` : "none",
        borderRight: collapsed && hoverOpen ? `1px solid ${t.border}` : `1px solid ${t.sidebarBorder}`,
        boxShadow: collapsed && hoverOpen ? `0 2px 12px rgba(0,0,0,0.25)` : "none",
      }}>
      <style>{getGlobalStyles(t)}</style>
      <div style={{ display: "flex", alignItems: "center", justifyContent: showFullNav ? "space-between" : "center", padding: "12px 12px 4px", minWidth: 260 }}>
        {showFullNav && (
          <DropdownWrapper open={orgOpen} setOpen={setOrgOpen}
            trigger={
              <HoverBtn onClick={() => setOrgOpen(!orgOpen)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 6px", borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: t.fg }}>
                <NikeLogo themeMode={themeMode}/>
                <ChevronDown size={12} strokeWidth={1} color={t.secondaryFg} style={{ transform: orgOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}/>
              </HoverBtn>
            }>
            <div style={{ ...s.dropdown, width: 200 }}>
              <HoverBtn onClick={() => { onSettingsOffice?.(null); setActive("Settings", null); setOrgOpen(false) }}
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "7px 10px", borderRadius: 5, border: "none", background: "transparent", color: t.secondaryFg, cursor: "pointer", fontSize: 13, textAlign: "left" }}>
                <Settings size={14} strokeWidth={1}/> Settings
              </HoverBtn>
            </div>
          </DropdownWrapper>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {showFullNav && (
            <HoverBtn onClick={onNotificationsToggle} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6, border: "none", background: notificationsOpen ? t.border : t.accent, cursor: "pointer", fontSize: 14 }}>
              <Bell size={14} strokeWidth={1} color={t.mutedFg}/>
              <span style={{ fontSize: 13, fontWeight: 500, color: t.fg }}>23</span>
            </HoverBtn>
          )}
          <HoverBtn onClick={onToggleCollapsed} style={{ ...s.iconBtn, color: t.mutedFg }}>
            {collapsed ? <PanelLeftOpen size={15} strokeWidth={1}/> : <PanelLeftClose size={15} strokeWidth={1}/>}
          </HoverBtn>
        </div>
      </div>

      <nav style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
        {/* Float Agent */}
        {showFloatAgent && (
          <div style={{ marginBottom: 8 }}>
            <HoverBtn onClick={() => setActive("Float Agent", ["Float Agent"])} style={{ ...navItemStyle(activeItem === "Float Agent"), justifyContent: showFullNav ? "flex-start" : "center" }}>
              <Bot size={16} strokeWidth={1}/>{showFullNav && "Float Agent"}
            </HoverBtn>
            {showFullNav && hasSavedDashboard && (
              <HoverBtn onClick={() => setActive("Saved Dashboard", ["Float Agent", "Saved Dashboard"])} style={{ ...navItemStyle(activeItem === "Saved Dashboard"), paddingLeft: 32 }}>
                <BarChart3 size={14} strokeWidth={1}/>Saved Dashboard
              </HoverBtn>
            )}
          </div>
        )}

        {version === "single" ? (
          officeItems.map(item => (
            <HoverBtn key={item.name} onClick={() => setActive(item.name, null)} style={navItemStyle(activeItem === item.name)}>
              {item.icon}{showFullNav && item.name}
            </HoverBtn>
          ))
        ) : (
          <>
            {locs.map((loc, i) => (
            <div key={loc.name} style={{ marginTop: i > 0 ? 2 : 0 }}>
              {!showFullNav ? (
                <HoverBtn onClick={() => { toggleLoc(i) }}
                  style={{ ...navItemStyle(false), justifyContent: "center" }}>
                  <span style={{ color: t.fgAlpha70 }}>{loc.icon}</span>
                </HoverBtn>
              ) : (
                <div style={{ position: "relative" }}
                  onMouseEnter={() => setOfficeHovered(loc.name)}
                  onMouseLeave={() => { setOfficeHovered(null) }}>
                  <HoverBtn onClick={() => toggleLoc(i)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "6px 8px", borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: t.fgAlpha70 }}>{loc.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: t.fg }}>{loc.name}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                      {(officeHovered === loc.name || officeKebabOpen === loc.name) && (
                        <span
                          onClick={(e: any) => { e.stopPropagation(); setOfficeKebabOpen(officeKebabOpen === loc.name ? null : loc.name) }}
                          style={{ ...s.iconBtn, width: 20, height: 20, color: t.mutedFg, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: 6 }}>
                          <MoreVertical size={13} strokeWidth={1}/>
                        </span>
                      )}
                      <ChevronDown size={13} strokeWidth={1} color={t.sidebarFg} style={{ transform: loc.expanded ? "none" : "rotate(-180deg)", transition: "transform 0.2s" }}/>
                    </div>
                  </HoverBtn>
                  {officeKebabOpen === loc.name && (
                    <div style={{ ...s.dropdown, left: "auto", right: 0, top: "100%", minWidth: 150 }}>
                      <HoverBtn
                        onClick={() => { onSettingsOffice?.(loc.name); setOfficeKebabOpen(null) }}
                        style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "7px 10px", borderRadius: 5, border: "none", background: "transparent", color: t.secondaryFg, cursor: "pointer", fontSize: 13, textAlign: "left" as const }}>
                        <Settings size={13} strokeWidth={1}/> Office settings
                      </HoverBtn>
                    </div>
                  )}
                </div>
              )}
              {showFullNav && loc.items && (
                <Collapsible expanded={loc.expanded}>
                  <div style={{ marginTop: 2 }}>
                    {loc.items.map(item => (
                      <HoverBtn key={item.name} onClick={() => setActive(item.name, [loc.name, item.name])}
                        style={{ ...navItemStyle(activeItem === item.name), paddingTop: 6, paddingBottom: 6, paddingRight: 8, paddingLeft: 32 }}>
                        {item.icon}{item.name}
                      </HoverBtn>
                    ))}
                  </div>
                </Collapsible>
              )}
            </div>
          ))}
          </>
        )}

        {/* Skills Graph — primary nav item */}
        <div style={{ marginTop: 24 }}>
          <HoverBtn onClick={() => setActive("Skills graph", ["Skills graph"])}
            style={{ ...navItemStyle(activeItem === "Skills graph"), justifyContent: showFullNav ? "flex-start" : "center" }}>
            <Star size={16} strokeWidth={1}/>{showFullNav && "Skills graph"}
          </HoverBtn>
        </div>

        {/* Talent Graph — primary nav item */}
        <div style={{ marginTop: 4 }}>
          <HoverBtn onClick={() => setActive("Talent graph", ["Talent graph"])}
            style={{ ...navItemStyle(activeItem === "Talent graph"), justifyContent: showFullNav ? "flex-start" : "center" }}>
            <Share2 size={16} strokeWidth={1}/>{showFullNav && "Talent graph"}
          </HoverBtn>
        </div>

        {/* Project Graph — primary nav item */}
        <div style={{ marginTop: 4 }}>
          <HoverBtn onClick={() => setActive("Project graph", ["Project graph"])}
            style={{ ...navItemStyle(activeItem === "Project graph"), justifyContent: showFullNav ? "flex-start" : "center" }}>
            <GitFork size={16} strokeWidth={1}/>{showFullNav && "Project graph"}
          </HoverBtn>
        </div>

        <div style={{ marginTop: 8 }}>
          {!showFullNav ? (
            <HoverBtn style={{ ...navItemStyle(false), justifyContent: "center" }}>
              <span style={{ color: t.secondaryFg }}><Database size={16} strokeWidth={1}/></span>
            </HoverBtn>
          ) : (
            <HoverBtn onClick={() => setDataHubExp(!dataHubExp)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "6px 8px", borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: t.secondaryFg }}><Database size={16} strokeWidth={1}/></span>
                <span style={{ fontSize: 13, fontWeight: 500, color: t.fg }}>Data centre</span>
              </div>
              <ChevronDown size={13} strokeWidth={1} color={t.sidebarFg} style={{ transform: dataHubExp ? "none" : "rotate(-180deg)", transition: "transform 0.2s" }}/>
            </HoverBtn>
          )}
          {showFullNav && dataHubSettingsOpen && (
            <div ref={dataHubSettingsRef} style={{ position: "absolute", left: 242, top: 240, width: 200, background: t.bg, border: `1px solid ${t.border}`, borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", zIndex: 1000 }}>
              <div style={{ padding: "8px" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: t.mutedFg, padding: "8px 12px" }}>Visible items</div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer", borderRadius: 4, fontSize: 13, color: t.fg, borderBottom: `1px solid ${t.border}`, marginBottom: 4 }}>
                  <input type="checkbox" checked={showFloatAgent} onChange={e => onFloatAgentToggle?.(e.target.checked)} style={{ cursor: "pointer", accentColor: t.mutedFg }}/>
                  Float Agent
                </label>
                {dataHubItems.map(item => (
                  <label key={item.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", cursor: "pointer", borderRadius: 4, fontSize: 13, color: t.fg }}>
                    <input type="checkbox" checked={visibleDataHubItems.has(item.name)} onChange={(e) => {
                      const newSet = new Set(visibleDataHubItems)
                      if (e.target.checked) newSet.add(item.name)
                      else newSet.delete(item.name)
                      onVisibleDataHubItemsChange(newSet)
                    }} style={{ cursor: "pointer", accentColor: t.mutedFg }}/>
                    {item.name}
                  </label>
                ))}
              </div>
            </div>
          )}
          <Collapsible expanded={showFullNav && dataHubExp}>
            <div style={{ marginLeft: 18, marginTop: 8, borderLeft: `1px solid rgba(168,168,168,0.25)` }}>
              {dataHubItems.filter(item => visibleDataHubItems.has(item.name)).map(item => (
                <HoverBtn key={item.name} onClick={() => setActive(item.name, ["Data centre", item.name])}
                  style={{ ...navItemStyle(activeItem === item.name), paddingTop: 6, paddingBottom: 6, paddingRight: 8, paddingLeft: 16 }}>
                  <span style={{ display: "flex", width: 16, flexShrink: 0, justifyContent: "center" }}>{item.icon}</span>{item.name}
                </HoverBtn>
              ))}
            </div>
          </Collapsible>
        </div>

      </nav>

      <div style={{ display: "flex", alignItems: "center", justifyContent: showFullNav ? "space-between" : "center", borderTop: `1px solid ${t.sidebarBorder}`, padding: "10px 12px" }}>
        <DropdownWrapper open={avatarOpen} setOpen={setAvatarOpen}
          trigger={
            <HoverBtn onClick={() => setAvatarOpen(!avatarOpen)} 
              style={{ display: "flex", alignItems: "center", cursor: "pointer", borderRadius: "50%", border: "none", background: "transparent" }}>
              <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CR-avatar-Bz4EbF5HeVDJiGS7f3cWgRW6XtjgTN.jpeg" alt="CR Avatar" style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${t.border}`, objectFit: "cover" }} />
            </HoverBtn>
          }>
          <div style={{ ...s.dropdown, width: 180, left: 0, right: "auto", top: "auto", bottom: "calc(100% + 4px)", marginTop: 0, marginBottom: 0, padding: "4px 0" }}>
            <button onClick={() => { onThemeChange("light"); setAvatarOpen(false) }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "8px 12px", borderRadius: 0, border: "none", background: "transparent", color: t.secondaryFg, cursor: "pointer", fontSize: 13, textAlign: "left" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><Sun size={16} strokeWidth={1} style={{ color: t.secondaryFg }}/>Light</span>
              <Check size={16} strokeWidth={1} style={{ visibility: themeMode === "light" ? "visible" : "hidden", color: t.secondaryFg }}/>
            </button>
            <button onClick={() => { onThemeChange("dark"); setAvatarOpen(false) }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "8px 12px", borderRadius: 0, border: "none", background: "transparent", color: t.secondaryFg, cursor: "pointer", fontSize: 13, textAlign: "left" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><Moon size={16} strokeWidth={1} style={{ color: t.secondaryFg }}/>Dark</span>
              <Check size={16} strokeWidth={1} style={{ visibility: themeMode === "dark" ? "visible" : "hidden", color: t.secondaryFg }}/>
            </button>
            <button onClick={() => { onThemeChange("black"); setAvatarOpen(false) }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "8px 12px", borderRadius: 0, border: "none", background: "transparent", color: t.secondaryFg, cursor: "pointer", fontSize: 13, textAlign: "left" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><Moon size={16} strokeWidth={1} style={{ color: t.secondaryFg }}/>Black</span>
              <Check size={16} strokeWidth={1} style={{ visibility: themeMode === "black" ? "visible" : "hidden", color: t.secondaryFg }}/>
            </button>
            <button onClick={() => { onThemeChange("float-dark"); setAvatarOpen(false) }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "8px 12px", borderRadius: 0, border: "none", background: "transparent", color: t.secondaryFg, cursor: "pointer", fontSize: 13, textAlign: "left" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, fontSize: 12, fontWeight: 700, color: t.secondaryFg, lineHeight: 1 }}>F</span>Float dark</span>
              <Check size={16} strokeWidth={1} style={{ visibility: themeMode === "float-dark" ? "visible" : "hidden", color: t.secondaryFg }}/>
            </button>
          </div>
        </DropdownWrapper>
        {showFullNav && <HoverBtn style={{ ...s.iconBtn, color: t.mutedFg }}><HelpCircle size={16} strokeWidth={1}/></HoverBtn>}
      </div>
    </aside>
    </>
  )
}

// ── Role selectors ──
function RoleSelector({ roleId, roles, onChange }: any) {
  const [open, setOpen] = useState(false)
  const trig = { display: "inline-flex" as const, alignItems: "center" as const, gap: 4, padding: "2px 8px 2px 8px", borderRadius: 4, background: "transparent", border: "none", color: t.fg, fontSize: 13, cursor: "pointer" }
  return (
    <DropdownWrapper open={open} setOpen={setOpen}
      trigger={
        <HoverBtn onClick={(e: any) => { e.stopPropagation(); setOpen(!open) }} style={trig}>
          {roles[roleId]?.name || "Unknown"}<ChevronDown size={11} strokeWidth={1} color={t.mutedFg}/>
        </HoverBtn>
      }>
      <div style={{ ...s.dropdown, width: 180 }}>
        {roles.map((r: any, i: any) => (
          <button key={i} onClick={(e: any) => { e.stopPropagation(); onChange(i); setOpen(false) }} style={s.dropdownItem(i === roleId)}>
            {r.name} {i === roleId && <Check size={11} strokeWidth={1}/>}
          </button>
        ))}
      </div>
    </DropdownWrapper>
  )
}

const ACCESS_LEVELS = ["Member", "Admin", "Resource Manager", "Project Manager"]

function AccessSelector({ value, onChange }: any) {
  const [open, setOpen] = useState(false)
  const trig = { display: "inline-flex" as const, alignItems: "center" as const, gap: 4, padding: "2px 8px 2px 8px", borderRadius: 4, background: "transparent", border: "none", color: t.fg, fontSize: 13, cursor: "pointer" }
  const current = value || "Member"
  return (
    <DropdownWrapper open={open} setOpen={setOpen}
      trigger={
        <HoverBtn onClick={(e: any) => { e.stopPropagation(); setOpen(!open) }} style={trig}>
          {current}<ChevronDown size={11} strokeWidth={1} color={t.mutedFg}/>
        </HoverBtn>
      }>
      <div style={{ ...s.dropdown, width: 180 }}>
        {ACCESS_LEVELS.map((level: string) => (
          <button key={level} onClick={(e: any) => { e.stopPropagation(); onChange(level); setOpen(false) }} style={s.dropdownItem(level === current)}>
            {level} {level === current && <Check size={11} strokeWidth={1}/>}
          </button>
        ))}
      </div>
    </DropdownWrapper>
  )
}

function ClientSelector({ clientId, clients, onChange }: any) {
  const [open, setOpen] = useState(false)
  const trig = { display: "inline-flex" as const, alignItems: "center" as const, gap: 4, padding: "2px 8px 2px 8px", borderRadius: 4, background: "transparent", border: "none", color: t.fg, fontSize: 13, cursor: "pointer" }
  return (
    <DropdownWrapper open={open} setOpen={setOpen}
      trigger={
        <HoverBtn onClick={(e: any) => { e.stopPropagation(); setOpen(!open) }} style={trig}>
          {clients[clientId]?.name || <span style={{ color: t.mutedFg }}>No client</span>}<ChevronDown size={11} strokeWidth={1} color={t.mutedFg}/>
        </HoverBtn>
      }>
      <div style={{ ...s.dropdown, width: 180 }}>
        {clients.map((c: any, i: number) => (
          <button key={i} onClick={(e: any) => { e.stopPropagation(); onChange(i); setOpen(false) }} style={s.dropdownItem(i === clientId)}>
            {c.name} {i === clientId && <Check size={11} strokeWidth={1}/>}
          </button>
        ))}
      </div>
    </DropdownWrapper>
  )
}

function DeptSelector({ departmentId, departments, onChange }: any) {
  const [open, setOpen] = useState(false)
  const trig = { display: "inline-flex" as const, alignItems: "center" as const, gap: 4, padding: "2px 8px 2px 8px", borderRadius: 4, background: "transparent", border: "none", color: t.fg, fontSize: 13, cursor: "pointer" }
  return (
    <DropdownWrapper open={open} setOpen={setOpen}
      trigger={
        <HoverBtn onClick={(e: any) => { e.stopPropagation(); setOpen(!open) }} style={trig}>
          {departments[departmentId]?.name || "Unknown"}<ChevronDown size={11} strokeWidth={1} color={t.mutedFg}/>
        </HoverBtn>
      }>
      <div style={{ ...s.dropdown, width: 200 }}>
        {departments.map((d: any, i: any) => (
          <button key={i} onClick={(e: any) => { e.stopPropagation(); onChange(i); setOpen(false) }} style={s.dropdownItem(i === departmentId)}>
            {d.name} {i === departmentId && <Check size={11} strokeWidth={1}/>}
          </button>
        ))}
      </div>
    </DropdownWrapper>
  )
}

function TeamSettingsModal({ type, mode, onSave, onClose }: any) {
  const [selected, setSelected] = useState(mode)
  const noun = type === "delivery-teams" ? "team" : "group"
  return (
    <div style={{ position: "fixed", inset: 0, background: t.overlayBg, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={onClose}>
      <div style={{ background: t.popover, border: `1px solid ${t.border}`, borderRadius: 12, padding: 24, width: 380, boxShadow: `0 8px 32px ${t.shadowDarker}` }} onClick={(e: any) => e.stopPropagation()}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: t.fg, marginBottom: 6 }}>Membership settings</h2>
        <p style={{ fontSize: 13, color: t.secondaryFg, marginBottom: 20 }}>Allow people to belong to a single {noun} or multiple.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {(["single", "multiple"] as const).map(opt => (
            <label key={opt} onClick={() => setSelected(opt)} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", padding: "12px 14px", borderRadius: 8, border: `1px solid ${selected === opt ? t.fgAlpha30 : t.border}`, background: selected === opt ? t.fgAlpha03 : "transparent" }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${selected === opt ? t.fg : t.fgAlpha30}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {selected === opt && <div style={{ width: 7, height: 7, borderRadius: "50%", background: t.fg }}/>}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.fg, textTransform: "capitalize" as const }}>{opt}</div>
                <div style={{ fontSize: 12, color: t.secondaryFg, marginTop: 2 }}>{opt === "single" ? `Each person belongs to one ${noun}` : `Each person can belong to multiple ${noun}s`}</div>
              </div>
            </label>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <HoverBtn onClick={onClose} style={{ ...s.outlineBtn }}>Cancel</HoverBtn>
          <button onClick={() => { onSave(selected); onClose() }} style={{ background: t.fg, color: t.bg, border: "none", borderRadius: 6, padding: "6px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Save</button>
        </div>
      </div>
    </div>
  )
}

function TagPill({ label, overflow }: { label: string; overflow?: boolean }) {
  return (
    <Tag
      label={label}
      overflow={overflow}
    />
  )
}

function TagList({ ids, items, noun }: { ids: number[]; items: any[]; noun: string }) {
  if (ids.length === 0) return <span style={{ color: t.mutedFg, fontSize: 14 }}>—</span>
  if (ids.length === 1) return <span style={{ fontSize: 13, color: t.fg }}>{items[ids[0]]?.name || "—"}</span>
  const visible = ids.slice(0, 2)
  const overflow = ids.length - visible.length
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, flexWrap: "nowrap" as const }}>
      {visible.map((id: number) => <TagPill key={id} label={items[id]?.name || String(id)} />)}
      {overflow > 0 && <TagPill label={`+${overflow}`} overflow />}
    </span>
  )
}

function DeliveryTeamSelector({ teamIds, teams, mode, onChange }: any) {
  const [open, setOpen] = useState(false)
  const ids: number[] = teamIds || []
  const trig = { display: "inline-flex" as const, alignItems: "center" as const, gap: 4, padding: "2px 8px 2px 8px", borderRadius: 4, background: "transparent", border: "none", color: t.fg, fontSize: 13, cursor: "pointer" }
  return (
    <DropdownWrapper open={open} setOpen={setOpen}
      trigger={
        <HoverBtn onClick={(e: any) => { e.stopPropagation(); setOpen(!open) }} style={trig}>
          <TagList ids={ids} items={teams} noun="teams" /><ChevronDown size={11} strokeWidth={1} color={t.mutedFg}/>
        </HoverBtn>
      }>
      <div style={{ ...s.dropdown, width: 200 }}>
        <button onClick={(e: any) => { e.stopPropagation(); onChange([]); if (mode === "single") setOpen(false) }} style={s.dropdownItem(ids.length === 0)}>
          — {ids.length === 0 && <Check size={11} strokeWidth={1}/>}
        </button>
        {teams.map((team: any, i: number) => {
          const sel = ids.includes(i)
          return (
            <button key={i} onClick={(e: any) => {
              e.stopPropagation()
              if (mode === "single") { onChange([i]); setOpen(false) }
              else onChange(sel ? ids.filter((x: number) => x !== i) : [...ids, i])
            }} style={s.dropdownItem(sel)}>
              {team.name} {sel && <Check size={11} strokeWidth={1}/>}
            </button>
          )
        })}
      </div>
    </DropdownWrapper>
  )
}

function GroupSelector({ groupIds, groups, mode, onChange }: any) {
  const [open, setOpen] = useState(false)
  const ids: number[] = groupIds || []
  const trig = { display: "inline-flex" as const, alignItems: "center" as const, gap: 4, padding: "2px 8px 2px 8px", borderRadius: 4, background: "transparent", border: "none", color: t.fg, fontSize: 13, cursor: "pointer" }
  return (
    <DropdownWrapper open={open} setOpen={setOpen}
      trigger={
        <HoverBtn onClick={(e: any) => { e.stopPropagation(); setOpen(!open) }} style={trig}>
          <TagList ids={ids} items={groups} noun="groups" /><ChevronDown size={11} strokeWidth={1} color={t.mutedFg}/>
        </HoverBtn>
      }>
      <div style={{ ...s.dropdown, width: 200 }}>
        <button onClick={(e: any) => { e.stopPropagation(); onChange([]); if (mode === "single") setOpen(false) }} style={s.dropdownItem(ids.length === 0)}>
          — {ids.length === 0 && <Check size={11} strokeWidth={1}/>}
        </button>
        {groups.map((group: any, i: number) => {
          const sel = ids.includes(i)
          return (
            <button key={i} onClick={(e: any) => {
              e.stopPropagation()
              if (mode === "single") { onChange([i]); setOpen(false) }
              else onChange(sel ? ids.filter((x: number) => x !== i) : [...ids, i])
            }} style={s.dropdownItem(sel)}>
              {group.name} {sel && <Check size={11} strokeWidth={1}/>}
            </button>
          )
        })}
      </div>
    </DropdownWrapper>
  )
}

// ── Pages ──
function RolesAndRates({ roles, onRolesChange, people, departments, onNavigateToPeopleByRole }: any) {
  const [tab, setTab] = useState("active")
  const [selectedIdx, setSelectedIdx] = useState<number|null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedOffices, setSelectedOffices] = useState([...ALL_OFFICES])
  const isAll = selectedOffices.length === ALL_OFFICES.length
  const filteredPeople = isAll ? (people ?? []) : (people ?? []).filter((p: any) => selectedOffices.includes(p.office))
  const display = tab === "archived" ? [] : roles
  const rolesColumns = useMemo(() => [
    { accessorKey: "name", header: "Role", size: 280, cell: ({ row }: any) => <span onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}><InlineEdit value={row.original.name} onChange={(v: any) => onRolesChange(roles.map((r: any) => r === row.original ? {...r, name: v} : r))} style={{ background: "transparent" }}/></span> },
    { accessorKey: "departmentId", header: "Department", size: 168, cell: ({ row }: any) => {
      const [open, setOpen] = useState(false)
      const deptId = row.original.departmentId ?? null
      const deptName = deptId !== null ? departments[deptId]?.name : null
      return (
        <span onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}>
          <DropdownWrapper open={open} setOpen={setOpen}
            trigger={
              <HoverBtn onClick={(e: any) => { e.stopPropagation(); setOpen(!open) }} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 4, background: "transparent", border: "none", color: deptName ? t.fg : t.mutedFg, fontSize: 13, cursor: "pointer" }}>
                {deptName ?? "No department"}<ChevronDown size={11} strokeWidth={1} color={t.mutedFg}/>
              </HoverBtn>
            }>
            <div style={{ ...s.dropdown, width: 200 }}>
              <button onClick={(e: any) => { e.stopPropagation(); onRolesChange(roles.map((r: any) => r === row.original ? {...r, departmentId: null} : r)); setOpen(false) }} style={s.dropdownItem(deptId === null)}>
                No department {deptId === null && <Check size={11} strokeWidth={1}/>}
              </button>
              {(departments ?? []).map((d: any, i: number) => (
                <button key={i} onClick={(e: any) => { e.stopPropagation(); onRolesChange(roles.map((r: any) => r === row.original ? {...r, departmentId: i} : r)); setOpen(false) }} style={s.dropdownItem(i === deptId)}>
                  {d.name} {i === deptId && <Check size={11} strokeWidth={1}/>}
                </button>
              ))}
            </div>
          </DropdownWrapper>
        </span>
      )
    }},
    { accessorKey: "costRate", header: "Cost rate", size: 140, cell: ({ row }: any) => <span onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}><InlineEditRate value={row.original.costRate} onChange={(v: any) => onRolesChange(roles.map((r: any) => r === row.original ? {...r, costRate: v} : r))}/></span> },
    { accessorKey: "activePeople", header: "Active people", size: 140, cell: ({ row }: any) => {
      const count = filteredPeople.filter((p: any) => p.roleId === roles.indexOf(row.original)).length
      return count > 0
        ? <span onClick={e => e.stopPropagation()}><Tag label={count} onClick={() => onNavigateToPeopleByRole?.(row.original.name)}/></span>
        : <span style={{ fontSize: 13, color: t.mutedFg }}>—</span>
    }},
    { accessorKey: "unassigned", header: "Unassigned", size: 120, enableResizing: false, cell: ({ row }: any) => <span style={{ fontSize: 13, color: t.fg }}>{row.original.unassigned}</span> },
  ], [roles, onRolesChange, filteredPeople])
  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", background: t.bg }}>
      {showModal && <AddRoleModal onAdd={(r: any) => onRolesChange([...roles, r])} onClose={() => setShowModal(false)}/>}
      <div style={{ display: "flex", flex: 1, flexDirection: "column", overflow: "hidden" }}>
        <SectionHeader count={roles.length} label="Roles" onAdd={() => setShowModal(true)}/>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px 12px" }}>
          <OfficeFilter selected={selectedOffices} onChange={setSelectedOffices}/>
          <HoverBtn style={s.outlineBtn}><RefreshCw size={11} strokeWidth={1}/>Import/Export</HoverBtn>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "12px 24px 8px" }}>
          <HoverBtn style={{ ...s.iconBtn, width: 24, height: 24 }}><Plus size={13} strokeWidth={1} color={t.secondaryFg}/></HoverBtn>
          <Tabs active={tab} onChange={setTab} tabs={[{ label: `${roles.length} Active`, value: "active" }, { label: "0 Archived", value: "archived" }, { label: "All", value: "all" }]}/>
        </div>
        <DataTable
          columns={rolesColumns}
          data={display}
          onRowClick={(_: any, idx: number) => setSelectedIdx(idx)}
          isRowSelected={(_: any, idx: number) => idx === selectedIdx}
          emptyNode={tab === "archived" && <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}><p style={{ fontSize: 13, color: t.mutedFg }}>No archived roles</p></div>}
        />
      </div>
      {selectedIdx !== null && roles[selectedIdx] && (
        <Sheet title={roles[selectedIdx].name} subtitle={`$${roles[selectedIdx].costRate}/hr · ${roles[selectedIdx].activePeople} active`} onClose={() => setSelectedIdx(null)}>
          <DetailGrid items={[
            { label: "Cost rate", value: `$${roles[selectedIdx].costRate}/hr` },
            { label: "Active people", value: roles[selectedIdx].activePeople },
            { label: "Unassigned", value: roles[selectedIdx].unassigned },
            { label: "Status", value: "Active" },
          ]}/>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: t.fg, marginBottom: 12 }}>Activity log</h3>
          <ActivityTimeline entries={(ROLE_ACTIVITY as any)[roles[selectedIdx].name] || []}/>
        </Sheet>
      )}
    </div>
  )
}

function People({ roles, departments, onDepartmentsChange, deliveryTeams, groups, people, onPeopleChange, contractors, onContractorsChange, deptPeopleCounts, filteredBusinessUnit, onFilterClear, filteredRole, onRoleFilterClear, filteredOffice, onOfficeFilterClear, initialView, onInitialViewConsumed }: any) {
  const [tab, setTab] = useState("active")
  const [view, setView] = useState("employees")
  const [selectedPerson, setSelectedPerson] = useState<number|null>(null)
  const [selectedDept, setSelectedDept] = useState<number|null>(null)
  const [selectedDeliveryTeam, setSelectedDeliveryTeam] = useState<number|null>(null)
  const [selectedGroup, setSelectedGroup] = useState<number|null>(null)
  const [selectedOffices, setSelectedOffices] = useState(() => filteredOffice ? [filteredOffice] : [...ALL_OFFICES])

  useEffect(() => {
    if (filteredOffice) setSelectedOffices([filteredOffice])
    else setSelectedOffices([...ALL_OFFICES])
  }, [filteredOffice])

  useEffect(() => {
    if (initialView) { setView(initialView); onInitialViewConsumed?.() }
  }, [initialView])
  const [showModal, setShowModal] = useState(false)
  const [deliveryTeamMode] = useState<"single"|"multiple">("single")
  const [groupMode] = useState<"single"|"multiple">("single")

  const current = view === "employees" ? people : view === "contractors" ? contractors : view === "all" ? [...people, ...contractors] : people
  const setCurrent = view === "employees" ? onPeopleChange : view === "contractors" ? onContractorsChange : onPeopleChange
  const isAll = selectedOffices.length === ALL_OFFICES.length
  const filtered = isAll ? current : current.filter((p: any) => selectedOffices.includes(p.office))
  const roleFiltered = filteredRole ? filtered.filter((p: any) => roles[p.roleId]?.name === filteredRole) : filtered
  const display = tab === "archived" ? [] : roleFiltered

  function handleAdd(person: any) {
    if (view === "employees") onPeopleChange([...people, person])
    else if (view === "contractors") onContractorsChange([...contractors, person])
  }

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", background: t.bg }}>
      {showModal && <AddPersonModal roles={roles} departments={departments} onAdd={handleAdd} onClose={() => setShowModal(false)} type={view === "contractors" ? "contractor" : "employee"}/>}
      <div style={{ display: "flex", flex: 1, flexDirection: "column", overflow: "hidden" }}>
        <SectionHeader
          count={display.length}
          label={view === "employees" ? "Employees" : view === "contractors" ? "Contractors" : "People"}
          filterField={filteredRole ? "Role" : undefined}
          filterValue={filteredRole ?? undefined}
          onClearFilter={filteredRole ? onRoleFilterClear : undefined}
          onAdd={() => setShowModal(true)}/>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <OfficeFilter selected={selectedOffices} onChange={(val: any) => { setSelectedOffices(val); if (onOfficeFilterClear) onOfficeFilterClear() }}/>
            {filteredOffice && (
              <HoverBtn onClick={onOfficeFilterClear} style={{ ...s.pillBtn(true), background: t.muted, color: t.fg, padding: "4px 8px", fontSize: 12 }}>
                ✕ {filteredOffice}
              </HoverBtn>
            )}
            {filteredBusinessUnit && (
              <HoverBtn onClick={onFilterClear} style={{ ...s.pillBtn(true), background: t.muted, color: t.fg, padding: "4px 8px", fontSize: 12 }}>
                ✕ {filteredBusinessUnit}
              </HoverBtn>
            )}
            <div style={{ width: 1, height: 16, background: t.fgAlpha30, margin: "0 10px" }}/>
            {[["all","All"],["employees","Employees"],["contractors","Contractors"]].map(([v,l]) => (
              <TabBtn key={v} active={view === v} onClick={() => { setView(v); setSelectedPerson(null) }} activeColor={t.fgAlpha30} activeBg={t.fgAlpha10} mutedColor={t.secondaryFg} bg={t.bg} borderColor={t.border}>
                <Circle size={10} strokeWidth={1} style={{ fill: view === v ? t.fg : "none" }}/>{l}
              </TabBtn>
            ))}
          </div>
          <HoverBtn style={s.outlineBtn}><RefreshCw size={11} strokeWidth={1}/>Import/Export</HoverBtn>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "12px 24px 8px" }}>
          <HoverBtn style={{ ...s.iconBtn, width: 24, height: 24 }}><Plus size={13} strokeWidth={1} color={t.secondaryFg}/></HoverBtn>
          <Tabs active={tab} onChange={setTab} tabs={[{ label: `${filtered.length} Active`, value: "active" }, { label: "0 Archived", value: "archived" }, { label: "All", value: "all" }]}/>
        </div>
        <DataTable
          columns={[
            { accessorKey: "name", header: "Name", size: 280, cell: ({ row }: any) => <span onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}><InlineEdit value={row.original.name} onChange={(v: any) => setCurrent(current.map((x: any) => x === row.original ? {...x, name: v} : x))} style={{ background: "transparent" }}/></span> },
            { accessorKey: "roleId", header: "Role", size: 168, cell: ({ row }: any) => <span onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}><RoleSelector roleId={row.original.roleId} roles={roles} onChange={(v: any) => setCurrent(current.map((x: any) => x === row.original ? {...x, roleId: v} : x))}/></span> },
            { accessorKey: "access", header: "Access", size: 168, cell: ({ row }: any) => <span onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}><AccessSelector value={row.original.access} onChange={(v: any) => setCurrent(current.map((x: any) => x === row.original ? {...x, access: v} : x))}/></span> },
            { accessorKey: "departmentId", header: "Department", size: 168, cell: ({ row }: any) => <span onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}><DeptSelector departmentId={row.original.departmentId} departments={departments} onChange={(v: any) => setCurrent(current.map((x: any) => x === row.original ? {...x, departmentId: v} : x))}/></span> },
            { accessorKey: "deliveryTeamIds", header: "Delivery team", size: 160, cell: ({ row }: any) => <span onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}><DeliveryTeamSelector teamIds={row.original.deliveryTeamIds || []} teams={deliveryTeams} mode={deliveryTeamMode} onChange={(v: any) => setCurrent(current.map((x: any) => x === row.original ? {...x, deliveryTeamIds: v} : x))}/></span> },
            { accessorKey: "groupIds", header: "Group", size: 160, cell: ({ row }: any) => <span onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}><GroupSelector groupIds={row.original.groupIds || []} groups={groups} mode={groupMode} onChange={(v: any) => setCurrent(current.map((x: any) => x === row.original ? {...x, groupIds: v} : x))}/></span> },
            { accessorKey: "office", header: "Office", size: 140, cell: ({ row }: any) => <span style={{ fontSize: 13, color: t.fg }}>{row.original.office}</span> },
          ]}
          data={display}
          onRowClick={(_: any, idx: number) => setSelectedPerson(idx)}
          isRowSelected={(_: any, idx: number) => idx === selectedPerson}
          emptyNode={tab === "archived" && <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}><p style={{ fontSize: 13, color: t.mutedFg }}>No archived people</p></div>}
        />
      </div>
      {selectedPerson !== null && current[selectedPerson] && (
        <Sheet title={current[selectedPerson].name} subtitle={`${roles[current[selectedPerson].roleId]?.name} · ${current[selectedPerson].office}`} onClose={() => setSelectedPerson(null)}>
          <DetailGrid items={[
            { label: "Department", value: departments[current[selectedPerson].departmentId]?.name },
            { label: "Office", value: current[selectedPerson].office },
            { label: "Role", value: roles[current[selectedPerson].roleId]?.name },
            { label: "Status", value: "Active" },
          ]}/>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: t.fg, marginBottom: 12 }}>Activity log</h3>
          <ActivityTimeline entries={(PERSON_ACTIVITY as any)[current[selectedPerson].name] || []}/>
        </Sheet>
      )}
    </div>
  )
}

function relTime(ts: any) {
  const m = Math.floor((Date.now() - ts) / 60000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function NotesCell({ notes, onClick }: any) {
  const hasNotes = notes && notes.length > 0
  const last = hasNotes ? notes[notes.length - 1] : null
  return (
    <button onClick={e => { e.stopPropagation(); onClick() }}
      style={{ display:"flex", alignItems:"flex-start", gap:7, background:"transparent", border:"none", padding:0, cursor:"pointer", width:"100%", textAlign:"left" }}>
      {hasNotes ? (
        <>
          <div style={{ width:20, height:20, borderRadius:"50%", background:t.muted, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:600, color:t.fg, flexShrink:0, marginTop:1 }}>
            {last.author.charAt(0)}
          </div>
          <div style={{ overflow:"hidden", minWidth:0 }}>
            <div style={{ fontSize:12, color:t.secondaryFg, lineHeight:1.4, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden", marginBottom:3 }}>
              {last.text}
            </div>
            <div style={{ fontSize:11, color:t.mutedFg }}>
              {last.author.split(" ")[0]} · {relTime(last.timestamp)}
            </div>
          </div>
        </>
      ) : (
        <span style={{ fontSize:12, color:t.mutedFg }}>Add note…</span>
      )}
    </button>
  )
}

function NotesPanel({ project, currentUser, onClose, onUpdate }: any) {
  const [draft, setDraft] = useState("")
  const notes = project.notes || []
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [notes.length])

  function submit() {
    const text = draft.trim()
    if (!text) return
    const updated = [...notes, { text, author: currentUser, timestamp: Date.now() }]
    onUpdate(updated)
    setDraft("")
  }

  function handleKey(e: any) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit() }
  }

  return (
    <div style={{ width:340, flexShrink:0, borderLeft:`1px solid ${t.border}`, background:t.bg, display:"flex", flexDirection:"column", height:"100%" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${t.border}`, padding:"16px 20px" }}>
        <div>
          <h2 style={{ fontSize:15, fontWeight:600, color:t.fg }}>Notes</h2>
          <p style={{ fontSize:12, color:t.mutedFg, marginTop:2 }}>{project.name}</p>
        </div>
        <HoverBtn onClick={onClose} style={{ ...s.iconBtn, color:t.mutedFg }}><X size={16} strokeWidth={1}/></HoverBtn>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"16px 20px", display:"flex", flexDirection:"column", gap:16 }}>
        {notes.length === 0 && (
          <p style={{ fontSize:13, color:t.mutedFg, textAlign:"center", marginTop:32 }}>No notes yet. Add the first one below.</p>
        )}
        {notes.map((n: any, i: any) => (
          <div key={i} style={{ display:"flex", gap:10 }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:t.muted, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:600, color:t.fg, flexShrink:0 }}>
              {n.author.charAt(0)}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:4 }}>
                <span style={{ fontSize:12, fontWeight:600, color:t.fg }}>{n.author}</span>
                <span style={{ fontSize:11, color:t.mutedFg }}>{relTime(n.timestamp)}</span>
              </div>
              <p style={{ fontSize:13, color:t.secondaryFg, lineHeight:1.5, whiteSpace:"pre-wrap" }}>{n.text}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>
      <div style={{ padding:"12px 20px", borderTop:`1px solid ${t.border}` }}>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Leave a note… (Enter to send)"
          rows={3}
          style={{ width:"100%", background:t.muted, border:`1px solid ${t.border}`, borderRadius:8, padding:"8px 10px", fontSize:13, color:t.fg, resize:"none", outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}
        />
        <button onClick={submit}
          style={{ marginTop:8, width:"100%", padding:"7px 0", borderRadius:6, border:"none", background:t.fg, color:t.bg, fontSize:12, fontWeight:500, cursor:"pointer" }}>
          Add note
        </button>
      </div>
    </div>
  )
}

const PT_COLS_CONFIG = [
  { key: "name",      label: "Project", flex: "1.5fr" },
  { key: "notes",     label: "Notes",   flex: "240px" },
  { key: "health",    label: "Health",  flex: "120px" },
  { key: "client",    label: "Client",  flex: "1fr" },
  { key: "stage",     label: "Stage",   flex: "0.6fr" },
  { key: "margin",    label: "Margin",  flex: "0.8fr" },
  { key: "budget",    label: "Budget",  flex: "1fr" },
  { key: "startDate", label: "Start",   flex: "1fr" },
  { key: "endDate",   label: "End",     flex: "1fr" },
  { key: "owner",     label: "Owner",   flex: "0.8fr" },
]

function ProjectTracker({ projects, onProjectsChange, people, clients }: any) {
  const [showModal, setShowModal] = useState(false)
  const [colOrder, setColOrder] = useState(PT_COLS_CONFIG.map(c => c.key))
  const [dragKey, setDragKey] = useState(null)
  const [dropKey, setDropKey] = useState(null)
  const [notesIdx, setNotesIdx] = useState(null)
  const currentUser = people[1]?.name || "Amy Santiago"

  const cols = colOrder.map((k: any) => PT_COLS_CONFIG.find(c => c.key === k)!)
  const gridCols = cols.map(c => c.flex).join(" ")

  function onDragStart(key: any) { setDragKey(key) }
  function onDragOver(e: any, key: any) { e.preventDefault(); setDropKey(key) }
  function onDrop(key: any) {
    if (!dragKey || dragKey === key) { setDragKey(null); setDropKey(null); return }
    const order = [...colOrder]
    const from = order.indexOf(dragKey)
    const to = order.indexOf(key)
    order.splice(from, 1)
    order.splice(to, 0, dragKey)
    setColOrder(order)
    setDragKey(null)
    setDropKey(null)
  }

  function renderCell(col: any, p: any, i: any) {
    const k = col.key
    switch (k) {
      case "name":      return <span key={k} style={{ display:"flex", alignItems:"center", fontSize:13, fontWeight:500, color:t.fg }}><InlineEdit value={p.name} onChange={(v: any) => { const u=[...projects]; u[i].name=v; onProjectsChange(u) }} style={{ background:"transparent" }}/></span>
      case "client":    return <span key={k} style={{ display:"flex", alignItems:"center", fontSize:13, color:t.fg }}>{clients[p.clientId]?.name}</span>
      case "stage":     return <span key={k} style={{ display:"flex", alignItems:"center" }}><div style={{ width:10, height:10, borderRadius:"50%", background:(STAGE_COLORS as any)[p.stage] }}/></span>
      case "margin":    return <span key={k} style={{ display:"flex", alignItems:"center", fontSize:13, color:t.fg }}>{p.margin}%</span>
      case "budget":    return <span key={k} style={{ display:"flex", alignItems:"center", fontSize:13, color:t.fg }}>${p.budget.toLocaleString()}</span>
      case "startDate": return <span key={k} style={{ display:"flex", alignItems:"center", fontSize:13, color:t.secondaryFg }}>{new Date(p.startDate).toLocaleDateString("en-US", { month:"short", day:"numeric" })}</span>
      case "endDate":   return <span key={k} style={{ display:"flex", alignItems:"center", fontSize:13, color:t.secondaryFg }}>{new Date(p.endDate).toLocaleDateString("en-US", { month:"short", day:"numeric" })}</span>
      case "owner":     return <span key={k} style={{ display:"flex", alignItems:"center" }}><div style={{ width:24, height:24, borderRadius:"50%", background:t.muted, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:600, color:t.fg }}>{people[p.ownerId]?.name.charAt(0) || "?"}</div></span>
      case "health":    return <span key={k} style={{ display:"flex", alignItems:"center" }}><HealthDropdown value={p.health || "on-track"} onChange={(v: any) => { const u=[...projects]; u[i].health=v; onProjectsChange(u) }}/></span>
      case "notes":     return <span key={k} style={{ display:"flex", alignItems:"flex-start", paddingTop:4 }}><NotesCell notes={p.notes} onClick={() => setNotesIdx(i)}/></span>
      default:          return null
    }
  }

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
    <div style={{ display: "flex", flex: 1, flexDirection: "column", overflow: "hidden", background: t.bg }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "20px 24px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 4 }}>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: t.fg }}>{projects.length} Projects</h1>
          <HoverBtn style={s.outlineBtn}><ListFilter size={11} strokeWidth={1}/>Filter</HoverBtn>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <button onClick={() => setShowModal(true)} style={s.primaryBtn}><Plus size={16} strokeWidth={1}/></button>
          <HoverBtn style={s.outlineBtn}><RefreshCw size={11} strokeWidth={1}/>Import/Export</HoverBtn>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: gridCols, borderBottom: `1px solid ${t.border}`, padding: "8px 0", gap: 8 }}>
          {cols.map(col => (
            <span key={col.key}
              draggable
              onDragStart={() => onDragStart(col.key)}
              onDragOver={e => onDragOver(e, col.key)}
              onDrop={() => onDrop(col.key)}
              onDragEnd={() => { setDragKey(null); setDropKey(null) }}
              style={{ fontSize:12, fontWeight:500, color: dropKey === col.key ? t.fg : t.mutedFg, cursor:"grab", userSelect:"none", display:"flex", alignItems:"center", gap:4, borderLeft: dropKey === col.key ? `2px solid ${t.fg}` : "2px solid transparent", paddingLeft: 2, transition:"border-color 0.1s, color 0.1s", opacity: dragKey === col.key ? 0.4 : 1 }}>
              {col.label}
            </span>
          ))}
        </div>
        {projects.map((p: any, i: any) => (
          <HoverRow key={i} selected={false} onClick={() => {}}
            style={{ display: "grid", gridTemplateColumns: gridCols, borderBottom: `1px solid ${t.border}`, padding: "10px 0", cursor: "default", gap: 8, transition: "background 0.1s" }}>
            {cols.map(col => renderCell(col, p, i))}
          </HoverRow>
        ))}
      </div>
      {showModal && <AddProjectModal people={people} clients={clients} onAdd={(p: any) => onProjectsChange([...projects, p])} onClose={() => setShowModal(false)}/>}
    </div>
    {notesIdx !== null && projects[notesIdx] && (
      <NotesPanel
        project={projects[notesIdx]}
        currentUser={currentUser}
        onClose={() => setNotesIdx(null)}
        onUpdate={(updated: any) => {
          const u = [...projects]
          u[notesIdx] = { ...u[notesIdx], notes: updated }
          onProjectsChange(u)
        }}
      />
    )}
    </div>
  )
}

function ProjectsDataHub({ visibleItems, projects, onProjectsChange, people, clients, filteredBusinessUnit, onFilterClear, filteredClient, onClientFilterClear, filteredRateCard, onRateCardFilterClear }: any) {
  const [tab, setTab] = useState("active")
  const [selectedIdx, setSelectedIdx] = useState<number|null>(null)
  const [selectedOffices, setSelectedOffices] = useState([...ALL_OFFICES])
  const [filteredOwner, setFilteredOwner] = useState<string|null>(null)
  const isAll = selectedOffices.length === ALL_OFFICES.length
  let filtered = isAll ? projects : projects.filter((p: any) => selectedOffices.includes(p.office))
  if (filteredBusinessUnit) filtered = filtered.filter((p: any) => p.unit === filteredBusinessUnit)
  if (filteredClient) filtered = filtered.filter((p: any) => clients[p.clientId]?.name === filteredClient)
  if (filteredRateCard) filtered = filtered.filter((p: any) => clients[p.clientId]?.name === filteredRateCard.clientName)
  if (filteredOwner) filtered = filtered.filter((p: any) => people[p.ownerId]?.name === filteredOwner)
  const display = tab === "archived" ? [] : filtered

  const projColumns = useMemo(() => {
    const cols: any[] = [
      { accessorKey: "name", header: "Project", size: 260, cell: ({ row }: any) => <span onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}><InlineEdit value={row.original.name} onChange={(v: any) => { const u=[...projects]; u[projects.indexOf(row.original)].name=v; onProjectsChange(u) }} style={{ background: "transparent" }}/></span> },
      { accessorKey: "code", header: "Code", size: 100, cell: ({ row }: any) => <span style={{ fontSize: 13, color: t.secondaryFg }}>{row.original.code}</span> },
    ]
    if (visibleItems.has("Clients")) cols.push({ accessorKey: "clientId", header: "Client", size: 160, cell: ({ row }: any) => (
      <span onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}>
        <ClientSelector clientId={row.original.clientId ?? 0} clients={clients} onChange={(v: number) => { const u = [...projects]; u[projects.indexOf(row.original)] = { ...row.original, clientId: v }; onProjectsChange(u) }}/>
      </span>
    ) })
    cols.push({ accessorKey: "office", header: "Office", size: 130, cell: ({ row }: any) => <span style={{ fontSize: 13, color: t.fg }}>{row.original.office}</span> })
    if (visibleItems.has("Business Units")) cols.push({ accessorKey: "unit", header: "Business Unit", size: 130, cell: ({ row }: any) => <span style={{ fontSize: 13, color: t.fg }}>{row.original.unit || "—"}</span> })
    cols.push({ id: "owner", header: "Owner", size: 160, enableResizing: false, accessorFn: () => "", cell: ({ row }: any) => {
      const owner = people[row.original.ownerId]
      if (!owner) return <span style={{ fontSize: 13, color: t.mutedFg }}>—</span>
      return (
        <span onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: t.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: t.fg, flexShrink: 0 }}>{owner.name.charAt(0)}</div>
          <button onClick={() => setFilteredOwner(owner.name)} style={{ fontSize: 13, color: t.fg, background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", fontFamily: "inherit" }}>{owner.name}</button>
        </span>
      )
    }})
    return cols
  }, [visibleItems, projects, onProjectsChange, clients, people])

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", background: t.bg }}>
      <div style={{ display: "flex", flex: 1, flexDirection: "column", overflow: "hidden" }}>
        <SectionHeader count={filtered.length} label="Projects" onAdd={() => {}} filterField={filteredOwner ? "Owner" : filteredRateCard ? "Rate card" : filteredClient ? "Client" : undefined} filterValue={filteredOwner ?? (filteredRateCard?.rateCardName) ?? filteredClient} onClearFilter={filteredOwner ? () => setFilteredOwner(null) : filteredRateCard ? onRateCardFilterClear : onClientFilterClear}/>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <OfficeFilter selected={selectedOffices} onChange={setSelectedOffices}/>
            {filteredBusinessUnit && (
              <HoverBtn onClick={onFilterClear} style={{ ...s.pillBtn(true), background: t.muted, color: t.fg, padding: "4px 8px", fontSize: 12 }}>
                ✕ {filteredBusinessUnit}
              </HoverBtn>
            )}
          </div>
          <HoverBtn style={s.outlineBtn}><RefreshCw size={11} strokeWidth={1}/>Import/Export</HoverBtn>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "12px 24px 8px" }}>
          <HoverBtn style={{ ...s.iconBtn, width: 24, height: 24 }}><Plus size={13} strokeWidth={1} color={t.secondaryFg}/></HoverBtn>
          <Tabs active={tab} onChange={setTab} tabs={[{ label: `${filtered.length} Active`, value: "active" }, { label: "0 Archived", value: "archived" }, { label: "All", value: "all" }]}/>
        </div>
        <DataTable
          columns={projColumns}
          data={display}
          onRowClick={(_: any, idx: number) => setSelectedIdx(idx)}
          isRowSelected={(_: any, idx: number) => idx === selectedIdx}
          emptyNode={tab === "archived" && <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}><p style={{ fontSize: 13, color: t.mutedFg }}>No archived projects</p></div>}
        />
      </div>
      {selectedIdx !== null && projects[selectedIdx] && (
        <Sheet title={projects[selectedIdx].name} subtitle={visibleItems.has("Clients") ? `${clients[projects[selectedIdx].clientId]?.name} · ${projects[selectedIdx].office}` : projects[selectedIdx].office} onClose={() => setSelectedIdx(null)}>
          <DetailGrid items={[
            { label: "Code", value: projects[selectedIdx].code },
            ...(visibleItems.has("Clients") ? [{ label: "Client", value: clients[projects[selectedIdx].clientId]?.name }] : []),
            { label: "Office", value: projects[selectedIdx].office },
            ...(visibleItems.has("Business Units") ? [{ label: "Business Unit", value: projects[selectedIdx].unit || "—" }] : []),
            { label: "Owner", value: people[projects[selectedIdx].ownerId]?.name },
            { label: "Stage", value: projects[selectedIdx].stage },
            { label: "Budget", value: `$${projects[selectedIdx].budget.toLocaleString()}` },
          ]}/>
        </Sheet>
      )}
    </div>
  )
}

const HEALTH_OPTIONS = [
  { value: "on-track",  label: "On Track",  color: "#22c55e" },
  { value: "at-risk",   label: "At Risk",   color: "#f59e0b" },
  { value: "off-track", label: "Off Track", color: "#ef4444" },
]

function HealthDropdown({ value, onChange }: any) {
  const [open, setOpen] = useState(false)
  const current = HEALTH_OPTIONS.find((o: any) => o.value === value) || HEALTH_OPTIONS[0]
  return (
    <DropdownWrapper open={open} setOpen={setOpen}
      trigger={
        <HoverBtn onClick={(e: any) => { e.stopPropagation(); setOpen(!open) }}
          style={{ display:"flex", alignItems:"center", gap:6, height:24, padding:"0 8px", borderRadius:12, background: current.color + "18", border:`1px solid ${current.color}40`, cursor:"pointer", fontSize:11, fontWeight:500, color: current.color }}>
          <span style={{ width:6, height:6, borderRadius:"50%", background: current.color, flexShrink:0 }}/>
          {current.label}
          <ChevronDown size={10} strokeWidth={1}/>
        </HoverBtn>
      }>
      <div style={{ ...s.dropdown, width:130 }}>
        {HEALTH_OPTIONS.map(o => (
          <button key={o.value} onClick={(e: any) => { e.stopPropagation(); onChange(o.value); setOpen(false) }} style={{ ...s.dropdownItem(o.value === value), display:"flex", alignItems:"center" }}>
            <span style={{ display:"flex", alignItems:"center", gap:8, flex:1 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:o.color, flexShrink:0 }}/>
              {o.label}
            </span>
            {o.value === value && <Check size={11} strokeWidth={1}/>}
          </button>
        ))}
      </div>
    </DropdownWrapper>
  )
}

// ── Clients ──
function CurrencySelector({ value, onChange }: any) {
  const [open, setOpen] = useState(false)
  return (
    <DropdownWrapper open={open} setOpen={setOpen}
      trigger={
        <HoverBtn onClick={() => setOpen(!open)}
          style={{ display:"flex", alignItems:"center", gap:4, height:28, padding:"0 8px", borderRadius:6, border:`1px solid ${t.border}`, background:"transparent", color:t.secondaryFg, cursor:"pointer", fontSize:12, fontWeight:500 }}>
          {value}<ChevronDown size={12} strokeWidth={1}/>
        </HoverBtn>
      }>
      <div style={{ ...s.dropdown, width:100 }}>
        {CURRENCIES.map(c => (
          <button key={c} onClick={() => { onChange(c); setOpen(false) }} style={s.dropdownItem(c===value)}>
            {c}{c===value && <Check size={11} strokeWidth={1}/>}
          </button>
        ))}
      </div>
    </DropdownWrapper>
  )
}

function OfficeSelectorRC({ value, onChange }: any) {
  const [open, setOpen] = useState(false)
  const isAll = value === "all"
  const selected = isAll ? [] : value
  const label = isAll ? "All offices" : selected.length === 0 ? "No offices" : selected.length === ALL_OFFICES.length ? "All offices" : selected.join(", ")
  function toggle(o: any) {
    if (isAll) { onChange(ALL_OFFICES.filter(x => x !== o)); return }
    const cur = [...selected]
    if (cur.includes(o)) { const n = cur.filter(x => x !== o); onChange(n.length === 0 ? "all" : n) }
    else { const n = [...cur, o]; onChange(n.length === ALL_OFFICES.length ? "all" : n) }
  }
  function isSelected(o: any) { return isAll || selected.includes(o) }
  return (
    <DropdownWrapper open={open} setOpen={setOpen}
      trigger={
        <HoverBtn onClick={() => setOpen(!open)}
          style={{ display:"flex", alignItems:"center", gap:5, height:28, padding:"0 10px", borderRadius:20, border:`1px solid ${t.border}`, background:"transparent", color:t.secondaryFg, cursor:"pointer", fontSize:12 }}>
          <Circle size={10} strokeWidth={1}/>{label}<ChevronDown size={11} strokeWidth={1}/>
        </HoverBtn>
      }>
      <div style={{ ...s.dropdown, width:180 }}>
        <button onClick={() => { onChange("all"); setOpen(false) }} style={s.dropdownItem(isAll)}>
          All offices{isAll && <Check size={11} strokeWidth={1}/>}
        </button>
        <div style={{ height:1, background:t.border, margin:"4px 0" }}/>
        {ALL_OFFICES.map(o => (
          <button key={o} onClick={() => toggle(o)} style={s.dropdownItem(isSelected(o))}>
            {o}{isSelected(o) && !isAll && <Check size={11} strokeWidth={1}/>}
          </button>
        ))}
      </div>
    </DropdownWrapper>
  )
}

function AddRolesBtn({ roles, linkedIds, onAdd, onAddAll }: any) {
  const [open, setOpen] = useState(false)
  const available = roles.map((r: any,i: any) => ({...r,i})).filter((r: any) => !linkedIds.has(r.i))
  return (
    <DropdownWrapper open={open} setOpen={setOpen}
      trigger={
        <HoverBtn onClick={() => setOpen(!open)} disabled={available.length===0}
          style={{ display:"flex", alignItems:"center", gap:6, height:28, padding:"0 10px", borderRadius:6, border:`1px dashed ${t.border}`, background:"transparent", color:t.secondaryFg, cursor:"pointer", fontSize:12, opacity: available.length===0 ? 0.4 : 1 }}>
          <Plus size={12} strokeWidth={1}/>Add roles
        </HoverBtn>
      }>
      {available.length > 0 && (
        <div style={{ ...s.dropdown, width:240, maxHeight:320, overflowY:"auto" }}>
          {available.length > 1 && <>
            <button onClick={() => { onAddAll(available.map((r: any)=>r.i)); setOpen(false) }}
              style={{ display:"flex", width:"100%", alignItems:"center", padding:"8px 10px", borderRadius:5, border:"none", background:"transparent", color:t.fg, cursor:"pointer", fontSize:13, fontWeight:500 }}>
              Add all roles
            </button>
            <div style={{ height:1, background:t.border, margin:"4px 0" }}/>
          </>}
          {available.map((r: any) => (
            <button key={r.i} onClick={() => { onAdd(r.i) }}
              style={{ display:"flex", width:"100%", alignItems:"center", gap:8, padding:"8px 10px", borderRadius:5, border:"none", background:"transparent", color:t.secondaryFg, cursor:"pointer", fontSize:13 }}>
              <div style={{ width:14, height:14, borderRadius:3, border:`1px solid ${t.border}` }}/>
              {r.name}
            </button>
          ))}
        </div>
      )}
    </DropdownWrapper>
  )
}

function RateCardSheet({ client, clientIdx, rcIdx, roles, onUpdateClients, onClose, titleOverride, allClients }: any) {
  const rc = client.rateCards[rcIdx]
  function update(updated: any) {
    onUpdateClients(clientIdx, { ...client, rateCards: client.rateCards.map((r: any,i: any) => i===rcIdx ? updated : r) })
  }
  function currSymbol(cur: any) {
    if (cur==="GBP") return "£"; if (cur==="EUR") return "€"; if (cur==="JPY") return "¥"; return "$"
  }
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesDraft, setNotesDraft] = useState(rc.notes || "Initial Standard rates")
  const notesRef = useRef<HTMLInputElement>(null)
  const [clientsOpen, setClientsOpen] = useState(false)
  const linkedClients: string[] = rc.linkedClients || []
  useEffect(() => { if (editingNotes && notesRef.current) { notesRef.current.focus(); notesRef.current.select() } }, [editingNotes])

  return (
    <div style={{ width:"50%", flexShrink:0, background:t.bg, display:"flex", flexDirection:"column", height:"100%", borderRadius:"8px 0 0 0", borderLeft:`1px solid ${t.sidebarBorder}`, overflow:"hidden" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px" }}>
        <h2 style={{ fontFamily:"lexend", fontSize:18, fontWeight:400, color:t.fg }}>{titleOverride ?? rc.title}</h2>
        <HoverBtn onClick={onClose} style={{ ...s.iconBtn, color:t.mutedFg }}><X size={16} strokeWidth={1}/></HoverBtn>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"8px 20px 16px" }}>
        <div style={{ marginBottom:20 }}>
          <p style={{ fontSize:12, fontWeight:500, color:t.mutedFg, marginBottom:6 }}>Notes</p>
          {editingNotes
            ? <input ref={notesRef} value={notesDraft} onChange={e => setNotesDraft(e.target.value)}
                onBlur={() => { update({...rc, notes:notesDraft}); setEditingNotes(false) }}
                onKeyDown={e => { if (e.key==="Enter"||e.key==="Escape") { update({...rc,notes:notesDraft}); setEditingNotes(false) } }}
                style={{ fontSize:13, fontWeight:500, color:t.fg, background:t.accent, border:`1px solid ${t.fgAlpha20}`, borderRadius:8, padding:"2px 8px 2px 0", outline:"none", width:"100%", fontFamily:"inherit" }}/>
            : <button onClick={() => { setNotesDraft(rc.notes||"Initial Standard rates"); setEditingNotes(true) }}
                style={{ fontSize:13, fontWeight:500, color:t.fg, background:"transparent", borderRadius:4, padding:"2px 8px 2px 0", border:"none", cursor:"text", fontFamily:"inherit" }}>
                {rc.notes || "Initial Standard rates"}
              </button>
          }
        </div>
        <div style={{ display:"flex", gap:16, marginBottom:24, flexWrap:"wrap" }}>
          <div>
            <p style={{ fontSize:12, fontWeight:500, color:t.mutedFg, marginBottom:6 }}>Offices</p>
            <OfficeSelectorRC value={rc.offices} onChange={(v: any) => update({...rc,offices:v})}/>
          </div>
          <div>
            <p style={{ fontSize:12, fontWeight:500, color:t.mutedFg, marginBottom:6 }}>Currency</p>
            <CurrencySelector value={rc.currency} onChange={(v: any) => update({...rc,currency:v})}/>
          </div>
          {allClients && (
            <div>
              <p style={{ fontSize:12, fontWeight:500, color:t.mutedFg, marginBottom:6 }}>Clients</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, alignItems:"center" }}>
                {linkedClients.map((name: string) => (
                  <span key={name} style={{ display:"inline-flex", alignItems:"center", gap:4, background:t.muted, borderRadius:4, padding:"2px 6px 2px 8px", fontSize:12, color:t.fg }}>
                    {name}
                    <button onClick={() => update({...rc, linkedClients: linkedClients.filter((n: string) => n !== name)})}
                      style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex", alignItems:"center", color:t.mutedFg }}>
                      <X size={11} strokeWidth={1.5}/>
                    </button>
                  </span>
                ))}
                <div style={{ position:"relative" }}>
                  <HoverBtn onClick={() => setClientsOpen(o => !o)}
                    style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:5, height:28, padding: linkedClients.length > 0 ? "0 8px" : "0 10px", borderRadius:6, border:`1px solid ${t.border}`, background:"transparent", color:t.secondaryFg, cursor:"pointer", fontSize:12 }}>
                    <Plus size={12} strokeWidth={1.5}/>{linkedClients.length === 0 && "Add client"}
                  </HoverBtn>
                  {clientsOpen && (
                    <div style={{ position:"absolute", top:"100%", left:0, marginTop:4, background:t.popover, border:`1px solid ${t.border}`, borderRadius:8, padding:4, boxShadow:`0 4px 16px ${t.shadowDark}`, zIndex:200, minWidth:200, maxHeight:200, overflowY:"auto" }}>
                      {(allClients as any[]).filter((c: any) => !linkedClients.includes(c.name)).map((c: any) => (
                        <button key={c.name} onClick={() => { update({...rc, linkedClients:[...linkedClients, c.name]}); setClientsOpen(false) }}
                          style={{ display:"block", width:"100%", padding:"6px 10px", borderRadius:5, border:"none", background:"transparent", color:t.fg, cursor:"pointer", fontSize:13, textAlign:"left" as const }}>
                          {c.name}
                        </button>
                      ))}
                      {(allClients as any[]).filter((c: any) => !linkedClients.includes(c.name)).length === 0 && (
                        <p style={{ fontSize:12, color:t.mutedFg, padding:"6px 10px" }}>All clients linked</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div>
          <h3 style={{ fontSize:13, fontWeight:600, color:t.fg, marginBottom:12 }}>Linked Roles</h3>
          {rc.linkedRoles.length > 0 && (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 100px 28px", gap:8, paddingBottom:8 }}>
                <span style={{ fontSize:11, fontWeight:500, color:t.mutedFg }}>Role</span>
                <span style={{ fontSize:11, fontWeight:500, color:t.mutedFg }}>Bill rate</span>
                <span/>
              </div>
              {rc.linkedRoles.map((lr: any, i: any) => (
                <div key={lr.roleId} style={{ display:"grid", gridTemplateColumns:"1fr 100px 28px", gap:8, alignItems:"center", borderTop:`1px solid ${t.border}`, padding:"8px 0" }}>
                  <RoleSelector roleId={lr.roleId} roles={roles} onChange={(v: any) => update({...rc, linkedRoles: rc.linkedRoles.map((r: any,j: any) => j===i ? {...r,roleId:v} : r)})}/>
                  <div style={{ display:"flex", alignItems:"center" }}>
                    <span style={{ fontSize:12, color:t.mutedFg, paddingRight:2 }}>{currSymbol(rc.currency)}</span>
                    <input type="number" value={lr.billRate}
                      onChange={(e: any) => update({...rc, linkedRoles: rc.linkedRoles.map((r: any,j: any) => j===i ? {...r,billRate:Number(e.target.value)||0} : r)})}
                      style={{ width:"100%", fontSize:13, color:t.fg, background:"transparent", border:"none", outline:"none", fontFamily:"inherit" }}/>
                  </div>
                  <HoverBtn onClick={() => update({...rc, linkedRoles: rc.linkedRoles.filter((_: any,j: any) => j!==i)})}
                    style={{ ...s.iconBtn, width:24, height:24, color:t.mutedFg }}>
                    <X size={12} strokeWidth={1}/>
                  </HoverBtn>
                </div>
              ))}
            </>
          )}
          <div style={{ paddingTop:12 }}>
            <AddRolesBtn roles={roles} linkedIds={new Set(rc.linkedRoles.map((r: any)=>r.roleId))}
              onAdd={(idx: any) => update({...rc, linkedRoles:[...rc.linkedRoles,{roleId:idx,billRate:roles[idx]?.costRate??0}]})}
              onAddAll={(idxs: any) => update({...rc, linkedRoles:[...rc.linkedRoles,...idxs.map((i: any)=>({roleId:i,billRate:roles[i]?.costRate??0}))]})}/>
          </div>
        </div>
      </div>
    </div>
  )
}

function Clients({ roles, people, clients, onClientsChange, projects, onNavigateToRateCards, filterClients, onClearClientsFilter, onNavigateToProjects }: any) {
  const setClients = onClientsChange
  const [tab, setTab] = useState("active")
  const [selectedOffices, setSelectedOffices] = useState([...ALL_OFFICES])
  const isAll = selectedOffices.length === ALL_OFFICES.length
  const officeFiltered = isAll ? clients : clients.filter((c: any) => selectedOffices.includes(c.office))
  const displayClients = filterClients ? officeFiltered.filter((c: any) => filterClients.includes(c.name)) : officeFiltered

  return (
    <div style={{ display:"flex", flex:1, overflow:"hidden", background:t.bg }}>
      <div style={{ display:"flex", flex:1, flexDirection:"column", overflow:"hidden" }}>
        <SectionHeader count={displayClients.length} label="Clients" onAdd={() => {}} filterField={filterClients ? "Client" : undefined} filterValue={filterClients} onClearFilter={onClearClientsFilter}/>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px 12px" }}>
          <OfficeFilter selected={selectedOffices} onChange={setSelectedOffices}/>
          <HoverBtn style={s.outlineBtn}><RefreshCw size={11} strokeWidth={1}/>Import/Export</HoverBtn>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:4, padding:"12px 24px 8px" }}>
          <HoverBtn style={{ ...s.iconBtn, width:24, height:24 }}><Plus size={13} strokeWidth={1} color={t.secondaryFg}/></HoverBtn>
          <Tabs active={tab} onChange={setTab} tabs={[{label:`${clients.length} Active`,value:"active"},{label:"0 Archived",value:"archived"},{label:"All",value:"all"}]}/>
        </div>
        <DataTable
          columns={[
            { accessorKey: "name", header: "Client", size: 220, cell: ({ row }: any) => <span onClick={e => e.stopPropagation()} style={{ display:"flex", alignItems:"center" }}><InlineEdit value={row.original.name} onChange={(v: any) => setClients((cl: any) => cl.map((x: any) => x === row.original ? {...x,name:v} : x))} style={{ background:"transparent" }}/></span> },
            { id: "contact", header: "Client contact", size: 240, cell: ({ row }: any) => {
              const c = row.original.contact
              if (!c) return null
              const initials = c.name.split(" ").map((w: string) => w[0]).join("").slice(0,2).toUpperCase()
              return (
                <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ width:24, height:24, borderRadius:"50%", background:t.muted, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:600, color:t.fg, flexShrink:0 }}>{initials}</span>
                  <span style={{ color:t.secondaryFg, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.email}</span>
                </span>
              )
            }},
            { id: "owner", header: "Client owner", size: 160, cell: ({ row }: any) => (
              <select
                value={row.original.owner || ""}
                onClick={e => e.stopPropagation()}
                onChange={e => { e.stopPropagation(); setClients((cl: any) => cl.map((x: any) => x === row.original ? {...x, owner: e.target.value} : x)) }}
                style={{ fontSize:13, color: row.original.owner ? t.fg : t.mutedFg, background:"transparent", border:"none", outline:"none", cursor:"pointer", fontFamily:"inherit", padding:0 }}
              >
                <option value="">Unassigned</option>
                {(people || []).map((p: any) => <option key={p.name} value={p.name}>{p.name}</option>)}
              </select>
            )},
            { id: "crm", header: "CRM", size: 180, cell: ({ row }: any) => {
              const url = row.original.crmUrl
              if (url) return <a href={url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ color:t.secondaryFg, textDecoration:"underline", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"100%", display:"block" }}>{url}</a>
              return <span onClick={e => { e.stopPropagation(); const v = prompt("Enter CRM URL"); if (v) setClients((cl: any) => cl.map((x: any) => x === row.original ? {...x, crmUrl: v} : x)) }} style={{ color:t.mutedFg, cursor:"pointer" }}>Add link</span>
            }},
            { id: "rateCards", header: "Rate cards", size: 110, cell: ({ row }: any) => { const name = row.original.name; const count = clients.reduce((acc: number, c: any) => acc + c.rateCards.filter((rc: any) => (rc.linkedClients||[]).includes(name)).length, 0); return count > 0 ? <span onClick={e => e.stopPropagation()}><Tag label={count} onClick={() => onNavigateToRateCards(name)}/></span> : <span style={{ color:t.mutedFg }}>—</span> } },
            { id: "projects", header: "Projects", size: 100, enableResizing: false, cell: ({ row }: any) => { const idx = clients.indexOf(row.original); const count = (projects||[]).filter((p: any) => p.clientId === idx).length; return count > 0 ? <span onClick={e => e.stopPropagation()}><Tag label={count} onClick={() => onNavigateToProjects(row.original.name)}/></span> : <span style={{ color:t.mutedFg }}>—</span> } },
          ]}
          data={tab==="archived"?[]:displayClients}
        />
      </div>
    </div>
  )
}

function RateCards({ roles, clients, onClientsChange, filterClient, onClearFilter, onNavigateToClients, projects, onNavigateToProjects }: any) {
  const setClients = onClientsChange
  const [tab, setTab] = useState("active")
  const [selectedClient, setSelectedClient] = useState<number|null>(null)
  const [selectedRC, setSelectedRC] = useState<number|null>(null)
  const [selectedOffices, setSelectedOffices] = useState([...ALL_OFFICES])
  function updateClient(idx: any, updated: any) { onClientsChange((prev: any) => prev.map((c: any,i: any) => i===idx ? updated : c)) }
  const client = selectedClient !== null ? clients[selectedClient] : null
  const isAll = selectedOffices.length === ALL_OFFICES.length
  const officeFiltered = isAll ? clients : clients.filter((c: any) => selectedOffices.includes(c.office))
  const displayClients = filterClient ? officeFiltered.filter((c: any) => (c.rateCards[0]?.linkedClients || []).includes(filterClient)) : officeFiltered

  return (
    <div style={{ display:"flex", flex:1, overflow:"hidden", background:t.bg }}>
      <div style={{ display:"flex", flex:1, flexDirection:"column", overflow:"hidden" }}>
        <SectionHeader count={displayClients.length} label="Rate cards" onAdd={() => {}} filterField={filterClient ? "Client" : undefined} filterValue={filterClient} onClearFilter={onClearFilter}/>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px 12px" }}>
          <OfficeFilter selected={selectedOffices} onChange={setSelectedOffices}/>
          <HoverBtn style={s.outlineBtn}><RefreshCw size={11} strokeWidth={1}/>Import/Export</HoverBtn>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:4, padding:"12px 24px 8px" }}>
          <HoverBtn style={{ ...s.iconBtn, width:24, height:24 }}><Plus size={13} strokeWidth={1} color={t.secondaryFg}/></HoverBtn>
          <Tabs active={tab} onChange={setTab} tabs={[{label:`${displayClients.length} Active`,value:"active"},{label:"0 Archived",value:"archived"},{label:"All",value:"all"}]}/>
        </div>
        <DataTable
          columns={[
            { accessorKey: "rateCardName", header: "Rate card", size: 300, cell: ({ row }: any) => <span style={{ display:"flex", alignItems:"center", fontWeight:500, color:t.fg }}>{row.original.rateCardName || row.original.name}</span> },
            { id: "client", header: "Clients", size: 160, cell: ({ row }: any) => { const linked = row.original.rateCards[0]?.linkedClients || []; return linked.length > 0 ? <span onClick={e => e.stopPropagation()}><Tag label={linked.length} onClick={() => onNavigateToClients(linked)}/></span> : <span style={{ color:t.mutedFg }}>—</span> } },
            { id: "projects", header: "Projects", size: 120, enableResizing: false, cell: ({ row }: any) => { const count = (projects||[]).filter((p: any) => clients[p.clientId]?.name === row.original.name).length; return count > 0 ? <span onClick={e => e.stopPropagation()}><Tag label={count} onClick={() => onNavigateToProjects?.(row.original.name, row.original.rateCardName || row.original.name)}/></span> : <span style={{ color:t.mutedFg }}>—</span> } },
          ]}
          data={tab==="archived"?[]:displayClients}
          onRowClick={(_: any, idx: number) => { setSelectedClient(idx); setSelectedRC(0) }}
          isRowSelected={(_: any, idx: number) => idx === selectedClient}
        />
      </div>
      {selectedClient !== null && selectedRC !== null && displayClients[selectedClient] && (
        <RateCardSheet client={displayClients[selectedClient]} clientIdx={clients.indexOf(displayClients[selectedClient])} rcIdx={selectedRC} roles={roles} onUpdateClients={updateClient} onClose={() => { setSelectedClient(null); setSelectedRC(null) }} titleOverride={displayClients[selectedClient].rateCardName} allClients={clients}/>
      )}
    </div>
  )
}

function BusinessUnits({ roles, onProjectsClick, onEmployeesClick }: any) {
  const [tab, setTab] = useState("active")
  const [units, setUnits] = useState(BUSINESS_UNITS_FULL)
  const [selectedUnit, setSelectedUnit] = useState<number|null>(null)
  const [viewTab, setViewTab] = useState("departments")
  const [selectedDept, setSelectedDept] = useState<number|null>(null)
  function updateUnit(idx: any, updated: any) { setUnits((prev: any) => prev.map((u: any,i: any) => i===idx ? updated : u)) }
  const unit = selectedUnit !== null ? units[selectedUnit] : null

  return (
    <div style={{ display:"flex", flex:1, overflow:"hidden", background:t.bg }}>
      <div style={{ display:"flex", flex:1, flexDirection:"column", overflow:"hidden" }}>
        {unit === null ? (
          <>
            <SectionHeader count={units.length} label="Brands" onAdd={() => {}}/>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px 12px" }}>
              <HoverBtn style={s.pillBtn(false)}><Circle size={10} strokeWidth={1}/>All regions<ChevronDown size={11} strokeWidth={1}/></HoverBtn>
              <HoverBtn style={s.outlineBtn}><RefreshCw size={11} strokeWidth={1}/>Import/Export</HoverBtn>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:4, padding:"12px 24px 8px" }}>
              <HoverBtn style={{ ...s.iconBtn, width:24, height:24 }}><Plus size={13} strokeWidth={1} color={t.secondaryFg}/></HoverBtn>
              <Tabs active={tab} onChange={setTab} tabs={[{label:`${units.length} Active`,value:"active"},{label:"0 Archived",value:"archived"},{label:"All",value:"all"}]}/>
            </div>
            <DataTable
              columns={[
                { accessorKey: "name", header: "Business Unit", size: 260, cell: ({ row }: any) => <span onClick={e => e.stopPropagation()} style={{ display:"flex", alignItems:"center" }}><InlineEdit value={row.original.name} onChange={(v: any) => setUnits((ul: any) => ul.map((x: any) => x === row.original ? {...x,name:v} : x))} style={{ background:"transparent" }}/></span> },
                { id: "employees", header: "Employees", size: 130, accessorFn: (row: any) => row.employees, cell: ({ row }: any) => <Tag label={row.original.employees} onClick={() => onEmployeesClick(row.original.name)} /> },
                { id: "projects", header: "Projects", size: 130, accessorFn: (row: any) => row.projectsList?.length || 0, cell: ({ row }: any) => <Tag label={row.original.projectsList?.length || 0} onClick={() => onProjectsClick(row.original.name)} /> },
                { id: "departments", header: "Departments", size: 130, enableResizing: false, accessorFn: (row: any) => row.departments?.length ?? 0, cell: ({ row }: any) => <span style={{ display:"flex", alignItems:"center", fontSize:13, color:t.fg }}>{row.original.departments?.length ?? 0}</span> },
              ]}
              data={tab==="archived"?[]:units}
              onRowClick={(_: any, idx: number) => { setSelectedUnit(idx); setViewTab("departments"); setSelectedDept(null) }}
            />
          </>
        ) : (
          <>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 24px 16px", borderBottom:`1px solid ${t.border}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <HoverBtn onClick={() => { setSelectedUnit(null); setSelectedDept(null) }} style={{ ...s.iconBtn, color:t.secondaryFg }}>
                  <ChevronLeft size={18} strokeWidth={1}/>
                </HoverBtn>
                <h1 style={{ fontSize:18, fontWeight:600, color:t.fg }}>{unit.name}</h1>
              </div>
              <button style={s.primaryBtn}><Plus size={16} strokeWidth={1}/></button>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:4, padding:"12px 24px 8px" }}>
              <Tabs active={viewTab} onChange={setViewTab} tabs={[
                {label:`${unit.projectsList?.length || 0} Projects`,value:"projects"},
                {label:`${unit.departments.length} Departments`,value:"departments"}
              ]}/>
            </div>
            {viewTab === "projects" ? (
                  <DataTable
                    columns={[
                      { accessorKey: "title", header: "Project", size: 220, cell: ({ row }: any) => <span style={{ fontSize:13, fontWeight:500, color:t.fg }}>{row.original.title}</span> },
                      { accessorKey: "team", header: "Team Size", size: 110, cell: ({ row }: any) => <span style={{ fontSize:13, color:t.fg }}>{row.original.team}</span> },
                      { accessorKey: "budget", header: "Budget", size: 110, cell: ({ row }: any) => <span style={{ fontSize:13, color:t.fg }}>${row.original.budget?.toLocaleString()}</span> },
                      { accessorKey: "status", header: "Status", size: 110, enableResizing: false, cell: ({ row }: any) => <span style={{ fontSize:12, display:"flex", alignItems:"center", padding:"4px 8px", borderRadius:4, background: row.original.status === "Active" ? "#d4edda" : row.original.status === "In Progress" ? "#fff3cd" : "#e7e7e7", color: row.original.status === "Active" ? "#155724" : row.original.status === "In Progress" ? "#856404" : "#666" }}>{row.original.status}</span> },
                    ]}
                    data={unit.projectsList ?? []}
                    paddingX={24}
                  />
            ) : (
                  <DataTable
                    columns={[
                      { accessorKey: "title", header: "Department", size: 220, cell: ({ row }: any) => <span style={{ fontSize:13, fontWeight:500, color:t.fg }}>{row.original.title}</span> },
                      { accessorKey: "budget", header: "Budget", size: 110, cell: ({ row }: any) => <span style={{ fontSize:13, color:t.fg }}>${row.original.budget.toLocaleString()}</span> },
                      { accessorKey: "spent", header: "Spent", size: 110, cell: ({ row }: any) => <span style={{ fontSize:13, color:t.fg }}>${row.original.spent.toLocaleString()}</span> },
                      { id: "roles", header: "Roles", size: 110, enableResizing: false, accessorFn: (row: any) => row.linkedRoles?.length ?? 0, cell: ({ row }: any) => <span style={{ fontSize:13, color:t.fg }}>{row.original.linkedRoles?.length ?? 0}</span> },
                    ]}
                    data={unit.departments}
                    onRowClick={(_: any, idx: number) => setSelectedDept(idx)}
                    isRowSelected={(_: any, idx: number) => idx === selectedDept}
                    paddingX={24}
                  />
            )}
          </>
        )}
      </div>
    </div>
  )
}

function ActivityLog() {
  const [sourceFilter, setSourceFilter] = useState("all")
  const [filterOpen, setFilterOpen] = useState(false)
  const filtered = sourceFilter==="all" ? ACTIVITY_LOG_DATA : ACTIVITY_LOG_DATA.filter(e => e.source===sourceFilter)
  const sourceLabel: Record<string, string> = { all:"All sources", people:"People", roles:"Roles", departments:"Departments" }
  function typeIcon(type: any) {
    if (type==="person_assigned"||type==="added") return <UserPlus size={13} strokeWidth={1}/>
    if (type==="role_change"||type==="renamed") return <ArrowRightLeft size={13} strokeWidth={1}/>
    if (type==="allocation") return <Briefcase size={13} strokeWidth={1}/>
    if (type==="rate_change") return <DollarSign size={13} strokeWidth={1}/>
    return <CalendarClock size={13} strokeWidth={1}/>
  }
  return (
    <div style={{ display:"flex", flex:1, flexDirection:"column", overflow:"hidden", background:t.bg }}>
      <SectionHeader count={filtered.length} label="Events" onAdd={() => {}}/>
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"0 24px 12px" }}>
        <DropdownWrapper open={filterOpen} setOpen={setFilterOpen}
          trigger={
            <HoverBtn onClick={() => setFilterOpen(!filterOpen)} style={s.pillBtn(sourceFilter!=="all")}>
              {sourceLabel[sourceFilter]}<ChevronDown size={12} strokeWidth={1} style={{ transform:filterOpen?"rotate(180deg)":"none", transition:"transform 0.2s" }}/>
            </HoverBtn>
          }>
          <div style={s.dropdown}>
            <button onClick={() => { setSourceFilter("all"); setFilterOpen(false) }} style={s.dropdownItem(sourceFilter==="all")}>
              All sources {sourceFilter==="all" && <Check size={12} strokeWidth={1}/>}
            </button>
            <div style={{ height:1, background:t.border, margin:"4px 0" }}/>
            {["people","roles","departments"].map(s2 => (
              <button key={s2} onClick={() => { setSourceFilter(s2); setFilterOpen(false) }} style={s.dropdownItem(sourceFilter===s2)}>
                {sourceLabel[s2]} {sourceFilter===s2 && <Check size={12} strokeWidth={1}/>}
              </button>
            ))}
          </div>
        </DropdownWrapper>
      </div>
      <DataTable
        columns={[
          { accessorKey: "date", header: "Date", size: 140, cell: ({ row }: any) => <span style={{ fontSize:12, color:t.mutedFg }}>{row.original.date}</span> },
          { accessorKey: "source", header: "Source", size: 90, cell: ({ row }: any) => <span style={{ fontSize:11, fontWeight:500, color:t.mutedFg, background:t.muted, padding:"2px 8px", borderRadius:20 }}>{sourceLabel[row.original.source]}</span> },
          { accessorKey: "entity", header: "Entity", size: 140, cell: ({ row }: any) => <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:500, color:t.fg }}><span style={{ display:"flex", alignItems:"center", justifyContent:"center", width:20, height:20, borderRadius:"50%", background:t.muted, color:t.mutedFg, flexShrink:0 }}>{typeIcon(row.original.type)}</span>{row.original.entity}</span> },
          { accessorKey: "description", header: "Action", size: 240, cell: ({ row }: any) => <span style={{ fontSize:13, color:t.fg }}>{row.original.description}</span> },
          { accessorKey: "details", header: "Details", size: 180, enableResizing: false, cell: ({ row }: any) => <span style={{ fontSize:13, color:t.mutedFg }}>{row.original.details||"—"}</span> },
        ]}
        data={filtered}
      />
    </div>
  )
}

// ── Placeholder views ──
function GridBg() {
  return (
    <>
      <path d="M29.6517 39.8222H439.015" stroke="#80858D" strokeOpacity="0.5" strokeWidth="0.93037" strokeLinecap="round" strokeDasharray="3.72 4.65"/>
      <path d="M29.6517 242.178H439.015" stroke="#80858D" strokeOpacity="0.5" strokeWidth="0.93037" strokeLinecap="round" strokeDasharray="3.72 4.65"/>
      <path d="M66.8666 21.2148V260.785" stroke="#80858D" strokeOpacity="0.5" strokeWidth="0.93037" strokeLinecap="round" strokeDasharray="3.72 4.65"/>
      <path d="M401.8 21.2148V260.785" stroke="#80858D" strokeOpacity="0.5" strokeWidth="0.93037" strokeLinecap="round" strokeDasharray="3.72 4.65"/>
      <path d="M234.333 11.9111V270.089" stroke="#80858D" strokeOpacity="0.5" strokeWidth="0.697778" strokeDasharray="1.4 3.26"/>
      <path d="M11.0443 141H457.622" stroke="#80858D" strokeOpacity="0.5" strokeWidth="0.697778" strokeDasharray="1.4 3.26"/>
    </>
  )
}

function ViewWrapper({ breadcrumb, children }: any) {
  return (
    <div style={{ display:"flex", flex:1, flexDirection:"column", background:t.bg }}>
      <div style={{ padding:"20px 24px 16px" }}>
        <h2 style={{ fontSize:18, fontWeight:600, color:t.fg }}>{breadcrumb[breadcrumb.length-1]}</h2>
        <p style={{ fontSize:13, color:t.mutedFg, marginTop:4 }}>{breadcrumb.length>=2 ? `The ${breadcrumb[breadcrumb.length-1]} for ${breadcrumb[0]}` : ""}</p>
      </div>
      <div style={{ display:"flex", flex:1, alignItems:"center", justifyContent:"center", background:t.bg }}>{children}</div>
    </div>
  )
}

function DashboardView({ breadcrumb }: any) {
  return (
    <ViewWrapper breadcrumb={breadcrumb}>
      <svg width="467" height="284" viewBox="0 0 467 284" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#db-clip)"><GridBg/>
          <path d="M294.167 190.52V199.214L266.389 213.103V204.409L286.097 194.562L294.167 190.52Z" stroke={t.fgAlpha70} strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M266.388 204.409V213.103L173.917 159.714V118.437L199.611 156.853L207.361 149.103L220.152 136.298L242.68 169.492L266.388 204.409Z" stroke={t.fgAlpha70} strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M273.625 110.715L256.084 119.478L248.514 123.27L245.847 124.603L245.806 124.534L245.264 123.742L237.778 112.548L225.973 94.8951L220.153 86.1866L247.931 72.2978L273.625 110.715Z" stroke={t.fgAlpha70} strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M294.167 122.576L267.292 136.006L266.389 136.465L251.722 127.992L245.847 124.603L248.514 123.27L256.084 119.478L273.625 110.715L294.167 122.576Z" stroke={t.fgAlpha70} strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M216.292 90.1589L207.833 98.8672L201.944 104.923L201.694 105.187L194.472 112.617L192.166 109.312L173.917 83.0757L201.694 69.1867L216.292 90.1589Z" stroke={t.fgAlpha70} strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M266.388 136.465V189.52L259.319 179.09L231.819 138.534L227.722 132.506L223.305 125.992L218.097 118.312L213.792 122.631L201.694 134.77L197.68 138.798L181.375 114.714L173.917 103.7V83.0756L192.166 109.312L194.472 112.617L201.694 105.187L201.944 104.923L207.833 98.8672L216.292 90.1588L220.152 86.1866L225.972 94.8951L237.778 112.548L245.264 123.742L245.805 124.534L245.847 124.603L251.722 127.992L266.388 136.465Z" stroke={t.fgAlpha70} strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M294.167 122.576V175.631L286.625 179.409L272.278 186.576L266.389 189.52V136.465L267.292 136.006L294.167 122.576Z" stroke={t.fgAlpha70} strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M294.167 190.52L286.097 194.562L266.389 204.409L242.681 169.492L220.153 136.298L222.236 135.256L227.723 132.506L231.82 138.534L259.32 179.09L266.389 189.52L272.278 186.576L286.625 179.409L294.167 190.52Z" stroke={t.fgAlpha70} strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M223.305 125.992L217.86 128.714L201.694 136.798L197.68 138.798L201.694 134.77L213.791 122.631L218.096 118.312L223.305 125.992Z" stroke={t.fgAlpha70} strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M222.236 135.256L220.152 136.298L207.361 149.103L199.611 156.853L173.917 118.437L181.375 114.714L197.68 138.798L201.694 136.798L217.861 128.714L222.236 135.256Z" stroke={t.fgAlpha70} strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <defs><clipPath id="db-clip"><rect width="467" height="284" fill="white"/></clipPath></defs>
      </svg>
    </ViewWrapper>
  )
}

function ScheduleView({ breadcrumb }: any) {
  return (
    <ViewWrapper breadcrumb={breadcrumb}>
      <svg width="467" height="284" viewBox="0 0 467 284" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#sc-clip)"><GridBg/>
          <path d="M215.41 197.031V212.37L175.333 189.229V173.902L215.41 197.031Z" stroke={t.fgAlpha70} strokeWidth="0.604839" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M242.499 174.026V189.341L226.628 180.184L223.773 178.526L186.551 157.043L183.708 155.397L162.357 143.071V127.756L242.499 174.026Z" stroke={t.fgAlpha70} strokeWidth="0.604839" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M282.575 158.845V174.172L266.692 164.99L263.837 163.345L186.551 118.72L183.696 117.075L162.357 104.748V89.4339L282.575 158.845Z" stroke={t.fgAlpha70} strokeWidth="0.604839" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M239.603 188.019V200.273L215.41 212.37V197.031L225.365 192.047L236.748 186.362L239.603 188.019Z" stroke={t.fgAlpha70} strokeWidth="0.604839" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M266.692 164.99V177.244L242.499 189.341V174.027L263.837 163.345L266.692 164.99Z" stroke={t.fgAlpha70} strokeWidth="0.604839" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M306.769 146.748L282.575 158.845L162.357 89.4339L186.551 77.3371L306.769 146.748Z" stroke={t.fgAlpha70} strokeWidth="0.604839" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M306.769 146.748V162.075L282.575 174.172V158.845L306.769 146.748Z" stroke={t.fgAlpha70} strokeWidth="0.604839" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M263.837 163.345L242.499 174.027L162.357 127.757L183.696 117.075L186.551 118.72L263.837 163.345Z" stroke={t.fgAlpha70} strokeWidth="0.604839" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M236.749 186.362L225.365 192.047L215.41 197.031L175.333 173.902L196.684 163.233L199.527 164.878L236.749 186.362Z" stroke={t.fgAlpha70} strokeWidth="0.604839" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <defs><clipPath id="sc-clip"><rect width="467" height="284" fill="white"/></clipPath></defs>
      </svg>
    </ViewWrapper>
  )
}

function ProjectPlanView({ breadcrumb }: any) {
  return (
    <ViewWrapper breadcrumb={breadcrumb}>
      <svg width="467" height="284" viewBox="0 0 467 284" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#pp-clip)"><GridBg/>
          <path d="M298.558 116.042V154.48L281.813 164.143V125.706L298.558 116.042Z" stroke={t.fgAlpha70} strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M252.968 141.369V149.72L281.814 164.143V125.706L270.65 120.124V132.153L269.713 132.701L253.905 141.831L252.968 141.369Z" stroke={t.fgAlpha70} strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M225.997 93.8883V125.908L241.805 116.792L242.742 116.244V84.2249L225.997 93.8883Z" stroke={t.fgAlpha70} strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M253.905 109.797V141.831L269.712 132.701L270.65 132.153V100.134L253.905 109.797Z" stroke={t.fgAlpha70} strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M225.06 125.446V127.407L252.969 141.369L253.906 141.83V109.797L242.742 104.215V116.244L241.805 116.792L225.998 125.907L225.06 125.446Z" stroke={t.fgAlpha70} strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M197.151 79.4653L213.896 87.8451L225.997 93.8884L242.742 84.2249L213.896 69.8019L197.151 79.4653Z" stroke={t.fgAlpha70} strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M197.152 79.4655V91.4944L213.897 99.8741L214.834 100.336V120.326L225.06 125.446L225.998 125.908V93.8885L213.897 87.8454L197.152 79.4655Z" stroke={t.fgAlpha70} strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M198.089 109.999V212.475L214.834 202.811V100.335L213.896 100.883L198.089 109.999Z" stroke={t.fgAlpha70} strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M169.243 95.5759V198.052L198.09 212.475V109.999L197.152 109.537L185.989 103.956L169.243 95.5759Z" stroke={t.fgAlpha70} strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M169.242 95.5759L185.988 103.956L197.151 109.537L198.089 109.999L213.896 100.883L214.834 100.335L213.896 99.874L197.151 91.4942L185.988 85.9123L169.242 95.5759Z" stroke={t.fgAlpha70} strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M242.741 86.1862V104.215L253.905 109.797L270.65 100.133L242.741 86.1862Z" stroke={t.fgAlpha70} strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M270.65 102.095V120.124L281.813 125.706L298.558 116.042L270.65 102.095Z" stroke={t.fgAlpha70} strokeWidth="0.721154" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <defs><clipPath id="pp-clip"><rect width="467" height="284" fill="white"/></clipPath></defs>
      </svg>
    </ViewWrapper>
  )
}

function ReportView({ breadcrumb }: any) {
  return (
    <ViewWrapper breadcrumb={breadcrumb}>
      <svg width="467" height="284" viewBox="0 0 467 284" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#rp-clip)"><GridBg/>
          <path d="M202.91 163.395V179.72L183.96 168.77V152.458L202.91 163.395Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M202.91 136.207V157.957L189.01 149.932L183.96 147.02V125.257L202.91 136.207Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M202.91 92.695V130.77L189.01 122.732L183.96 119.82V81.7575L202.91 92.695Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M217.448 144.595L217.21 144.72L212.398 147.12V153.22L208.96 154.933L202.91 157.958V136.208L208.96 133.183L212.398 131.47V141.683L217.448 144.595Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M231.347 158.07V196.133L212.397 185.195V147.12L218.047 150.382L223.097 153.308L227.91 156.083L231.347 158.07Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M240.835 147.882V153.333L237.397 155.045L231.347 158.07L227.91 156.083L223.097 153.308L218.047 150.382L212.397 147.12L217.21 144.72L217.447 144.595L223.097 147.858L231.347 152.62L237.397 149.595L240.835 147.882Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M240.835 185.295L245.885 188.207L240.835 190.732V191.395L231.348 196.133V158.07L237.398 155.045L240.835 153.332V158.095L245.885 161.007L240.835 163.532V185.295Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M284.785 189.17V200.058L259.785 212.558V201.67L284.785 189.17Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M259.784 201.67V212.558L240.835 201.608V190.732L241.447 191.082L259.784 201.67Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M284.784 189.17L259.784 201.67L241.447 191.083L240.835 190.733L245.885 188.208L246.497 188.558L259.784 196.233L269.635 191.308L279.735 186.258L284.784 189.17Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M284.785 161.982V183.732L279.735 186.257L269.635 191.308L259.785 196.233V174.482L265.835 171.457L284.785 161.982Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M259.784 174.483V196.233L246.497 188.558L245.885 188.207L240.835 185.295V163.532L256.347 172.495L259.784 174.483Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M284.784 161.983L265.835 171.458L259.784 174.483L256.347 172.495L240.835 163.533L245.885 161.007L256.347 167.058L259.784 169.045L265.835 166.02L279.735 159.07L284.784 161.983Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M284.785 113.032V156.545L279.735 159.07L265.835 166.02L259.785 169.045V125.532L265.835 122.508L284.785 113.032Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M284.784 113.032L265.835 122.508L259.784 125.532L256.347 123.545L251.535 120.77L246.497 117.858L240.835 114.595L245.647 112.183L250.697 109.67L256.347 106.845L265.835 102.095L284.784 113.032Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M256.348 96.6202V106.845L250.698 109.67L245.648 112.183L240.835 114.595V120.695L237.398 122.407L231.348 125.433V109.12L241.21 104.183L256.348 96.6202Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M212.398 98.17V114.482L217.448 117.395L217.198 117.52L212.398 119.92V126.032L208.96 127.745L202.91 130.77V92.695L208.96 89.67L227.91 80.195V90.42L212.398 98.17Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M227.91 80.195L208.96 89.67L202.91 92.695L183.96 81.7575L208.96 69.2575L227.91 80.195Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M212.397 126.032V131.47L208.96 133.182L202.91 136.207L183.96 125.257L189.01 122.732L202.91 130.77L208.96 127.745L212.397 126.032Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M231.347 109.12V125.432L223.11 120.67L217.447 117.395L212.397 114.482V98.1699L227.91 107.132L231.347 109.12Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M256.347 96.6199L241.21 104.182L231.347 109.12L227.91 107.132L212.397 98.1699L227.91 90.4197L237.397 85.6699L256.347 96.6199Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M259.784 125.532V169.045L256.347 167.058L245.885 161.007L240.835 158.095V114.595L246.497 117.858L251.535 120.77L256.347 123.545L259.784 125.532Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M231.347 130.87V152.62L223.097 147.857L217.447 144.595L212.397 141.682V119.92L218.06 123.195L223.11 126.107L227.91 128.882L231.347 130.87Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M240.835 120.695V126.132L237.397 127.845L231.347 130.87L227.91 128.882L223.11 126.107L218.06 123.195L212.397 119.92L217.197 117.52L217.447 117.395L223.11 120.67L231.347 125.432L237.397 122.407L240.835 120.695Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M240.835 126.132V147.882L237.398 149.595L231.348 152.62V130.87L237.398 127.845L240.835 126.132Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M212.398 158.657V174.983L202.91 179.72V163.395L212.398 158.657Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M212.397 153.22V158.657L202.91 163.395L183.96 152.458L189.01 149.933L202.91 157.958L208.96 154.933L212.397 153.22Z" stroke={t.fgAlpha70} strokeWidth="0.625" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <defs><clipPath id="rp-clip"><rect width="467" height="284" fill="white"/></clipPath></defs>
      </svg>
    </ViewWrapper>
  )
}

function MyTimeView({ breadcrumb }: any) {
  return (
    <ViewWrapper breadcrumb={breadcrumb}>
      <svg width="467" height="284" viewBox="0 0 467 284" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#mt-clip)"><GridBg/>
          <path d="M269.833 173.008C269.431 166.466 268.152 159.744 266.027 152.841C263.388 144.327 259.819 136.188 255.319 128.397C252.972 124.355 250.416 120.494 247.638 116.786C245.083 113.355 242.333 110.063 239.403 106.925C233.305 100.397 226.791 95.1189 219.861 91.1189C218.277 90.2162 216.722 89.3828 215.194 88.6606C210.611 86.4801 206.222 85.1189 202.028 84.5495C201.444 84.4801 200.889 84.4106 200.319 84.3689C195.93 84.0078 191.944 84.4384 188.389 85.6745H188.361C186.986 86.1606 185.667 86.7578 184.417 87.4662C179.903 90.0356 176.333 94.0634 173.708 99.5356C171.069 105.022 169.75 111.73 169.75 119.688C169.75 127.647 171.069 135.869 173.708 144.383C176.333 152.897 179.903 161.05 184.417 168.827C188.917 176.605 194.222 183.758 200.319 190.3C206.417 196.841 212.93 202.105 219.861 206.105C226.791 210.119 233.305 212.369 239.403 212.869C245.5 213.369 250.805 212.327 255.319 209.758C259.514 207.369 262.889 203.702 265.472 198.799C265.666 198.438 265.847 198.063 266.027 197.688C267.652 194.3 268.778 190.425 269.403 186.063C269.778 183.411 269.972 180.563 269.972 177.55C269.972 176.05 269.931 174.536 269.833 173.008ZM235.264 200.063C230.347 199.508 225.208 197.702 219.861 194.619C208.666 188.147 199.194 178.216 191.43 164.827C183.666 151.424 179.778 138.313 179.778 125.466C179.778 112.619 183.666 103.994 191.43 99.5634C193.528 98.3689 195.75 97.5773 198.111 97.1745C201.625 96.5773 205.416 96.8689 209.486 98.0495C212.764 98.9939 216.222 100.522 219.861 102.619V148.619L229.944 166.008L243.736 189.8L248.292 197.661C244.542 199.799 240.194 200.605 235.264 200.063Z" stroke={t.fgAlpha70} strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M248.291 197.661C244.541 199.8 240.194 200.605 235.263 200.063C230.347 199.508 225.208 197.702 219.86 194.619C208.666 188.147 199.194 178.216 191.43 164.827C183.666 151.425 179.777 138.313 179.777 125.466C179.777 112.619 183.666 103.994 191.43 99.5635C193.527 98.369 195.75 97.5774 198.111 97.1746C201.625 96.5774 205.416 96.869 209.485 98.0496C208.194 101.869 207.555 106.383 207.555 111.577C207.555 124.425 211.444 137.536 219.208 150.938C222.472 156.577 226.041 161.605 229.944 166.008L243.736 189.8L248.291 197.661Z" stroke={t.fgAlpha70} strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M297.75 163.66C297.75 171.605 296.43 178.327 293.805 183.799C291.166 189.272 287.597 193.299 283.097 195.869L255.319 209.758C259.514 207.369 262.889 203.702 265.472 198.799C265.666 198.438 265.847 198.063 266.027 197.688C267.652 194.299 268.778 190.424 269.403 186.063C269.778 183.41 269.972 180.563 269.972 177.549C269.972 176.049 269.931 174.536 269.833 173.008C269.431 166.466 268.152 159.744 266.027 152.841C263.389 144.327 259.819 136.188 255.319 128.397C252.972 124.355 250.416 120.494 247.639 116.785C245.083 113.355 242.333 110.063 239.403 106.924C233.305 100.397 226.791 95.1188 219.861 91.1188C218.277 90.216 216.722 89.3827 215.194 88.6605C210.611 86.4799 206.222 85.1188 202.028 84.5493C201.444 84.4799 200.889 84.4105 200.319 84.3688C195.93 84.0077 191.944 84.4382 188.389 85.6743L212.195 73.5772C216.695 71.0077 222 69.98 228.097 70.48C234.194 70.98 240.708 73.23 247.639 77.23C254.569 81.2299 261.083 86.5077 267.18 93.0355C273.278 99.5771 278.583 106.73 283.097 114.508C287.597 122.299 291.166 130.438 293.805 138.952C296.43 147.466 297.75 155.702 297.75 163.66Z" stroke={t.fgAlpha70} strokeWidth="0.694444" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <defs><clipPath id="mt-clip"><rect width="467" height="284" fill="white"/></clipPath></defs>
      </svg>
    </ViewWrapper>
  )
}

function LogTeamView({ breadcrumb }: any) {
  return (
    <ViewWrapper breadcrumb={breadcrumb}>
      <svg width="467" height="284" viewBox="0 0 467 284" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#lt-clip)"><GridBg/>
          <path d="M291.334 186.422C291.334 193.284 289.244 197.926 285.062 200.359L283.929 200.926L261.44 212.17C265.622 209.737 267.712 205.095 267.712 198.233C267.712 197.985 267.712 197.737 267.712 197.489C267.57 190.863 265.48 184.048 261.452 177.067C257.72 170.607 253.291 165.646 248.118 162.197C247.492 161.772 246.854 161.382 246.204 161.004C243.665 159.528 241.279 158.583 239.07 158.158C236.318 157.615 233.826 157.863 231.582 158.914L239.047 155.182L254.425 147.493C254.531 147.434 254.637 147.375 254.744 147.327V157.626C256.338 159.126 257.85 160.697 259.291 162.363C260.732 164.016 262.102 165.753 263.389 167.583L267.559 165.505L271.881 163.343L280.787 158.879C282.311 160.816 283.74 162.941 285.074 165.256C289.255 172.497 291.346 179.56 291.346 186.422H291.334Z" stroke={t.fgAlpha70} strokeWidth="0.590551" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M267.7 197.489C267.558 190.863 265.468 184.048 261.44 177.068C257.708 170.607 253.279 165.646 248.106 162.198C247.48 161.772 246.842 161.382 246.192 161.005C243.653 159.528 241.267 158.583 239.058 158.158C236.306 157.615 233.815 157.863 231.57 158.914L230.791 159.304C228.913 160.355 227.46 161.855 226.409 163.827C225.122 166.272 224.472 169.414 224.472 173.276C224.472 175.863 224.756 178.461 225.346 181.083C226.326 185.512 228.145 189.989 230.791 194.536C235.007 201.764 240.145 207.126 246.192 210.622C252.181 214.071 257.259 214.591 261.44 212.17C265.621 209.737 267.712 205.095 267.712 198.233C267.712 197.985 267.712 197.737 267.712 197.489H267.7ZM253.326 201.717L243.925 185.5V169.615L248.248 172.119V186.008L256.362 199.992L253.326 201.717Z" stroke={t.fgAlpha70} strokeWidth="0.590551" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M256.362 199.993L253.326 201.717L243.925 185.5V169.615L248.248 172.119V186.008L256.362 199.993Z" stroke={t.fgAlpha70} strokeWidth="0.590551" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M203.98 116.784L200.531 118.508L185.555 125.996V106.154L200.531 114.799L203.98 116.784Z" stroke={t.fgAlpha70} strokeWidth="0.590551" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M242.885 139.248L224.472 148.461L200.531 134.642L185.555 125.996L200.531 118.508L203.98 116.784L242.885 139.248Z" stroke={t.fgAlpha70} strokeWidth="0.590551" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M263.377 131.241V167.583C262.09 165.752 260.72 164.016 259.279 162.363C257.838 160.697 256.326 159.126 254.732 157.626V146.087L244.055 139.922L242.885 139.248L203.98 116.784L200.531 114.8L185.555 106.154V125.996L200.531 134.642L224.472 148.461C221.661 149.985 219.44 152.406 217.822 155.725C217.433 156.528 217.09 157.378 216.795 158.276C215.862 161.075 215.389 164.335 215.389 168.032C215.389 170.678 215.637 173.406 216.145 176.217C216.653 179.028 217.373 181.827 218.307 184.603L176.909 160.697V81.3153L200.531 94.9572L209.177 99.9413L263.377 131.241Z" stroke={t.fgAlpha70} strokeWidth="0.590551" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M287 121.142V155.772L280.775 158.879L271.87 163.343L267.547 165.505L263.378 167.583V131.241L268.964 128.855L287 121.142Z" stroke={t.fgAlpha70} strokeWidth="0.590551" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M287 119.43V121.142L268.964 128.855L263.377 131.241L209.177 99.9413L200.531 94.9572L176.909 81.3153L200.531 69.5043L287 119.43Z" stroke={t.fgAlpha70} strokeWidth="0.590551" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M244.055 139.922C243.051 141.056 242.188 142.39 241.444 143.914C239.944 146.997 239.129 150.753 239.035 155.182L231.57 158.914L230.791 159.304C228.913 160.355 227.46 161.855 226.409 163.827C225.122 166.272 224.472 169.414 224.472 173.276C224.472 175.863 224.756 178.461 225.346 181.083L218.306 184.603C217.373 181.827 216.653 179.028 216.145 176.217C215.637 173.406 215.389 170.678 215.389 168.032C215.389 164.335 215.862 161.075 216.795 158.276C217.09 157.379 217.433 156.528 217.822 155.725C219.44 152.406 221.661 149.985 224.472 148.461L242.885 139.249L244.055 139.922Z" stroke={t.fgAlpha70} strokeWidth="0.590551" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <defs><clipPath id="lt-clip"><rect width="467" height="284" fill="white"/></clipPath></defs>
      </svg>
    </ViewWrapper>
  )
}


// ── Float Agent ──
const REV_COST_DATA = [
  { week: "1 Mar", revenue: 1200, costs: 900 },
  { week: "9 Mar", revenue: 65000, costs: 59000 },
  { week: "16 Mar", revenue: 27000, costs: 34000 },
  { week: "23 Mar", revenue: 38000, costs: 30000 },
  { week: "30 Mar", revenue: 14500, costs: 13800 },
]

const REV_LEGEND = [
  { label: "On track", rev: "USD 151,087", cost: "USD 139,288" },
  { label: "Proposal", rev: "USD 0", cost: "USD 0" },
  { label: "Likely", rev: "USD 0", cost: "USD 0" },
  { label: "Off track", rev: "USD 0", cost: "USD 0" },
  { label: "Completed", rev: "USD 0", cost: "USD 0" },
  { label: "+6 stages", rev: "USD 0", cost: "USD 0" },
]

function RevenueVsCostsCard() {
  const fmtK = (v: number) => v >= 1000 ? `USD ${Math.round(v / 1000) * 10}K`.replace("10K", "10K") : `USD ${v}`
  const fmt = (v: number) => `USD ${v.toLocaleString()}`
  return (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, overflow: "hidden", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: `1px solid ${t.border}` }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: t.fg }}>Revenue vs. costs</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 10px", border: `1px solid ${t.border}`, borderRadius: 6, cursor: "pointer", fontSize: 12, color: t.mutedFg }}>
          Weeks <ChevronDown size={12} strokeWidth={1.5}/>
        </div>
      </div>
      <div style={{ display: "flex", minHeight: 280 }}>
        <div style={{ flex: 1, padding: "16px 8px 8px 8px" }}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={REV_COST_DATA} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false}/>
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: t.mutedFg, fontFamily: "var(--font-sans), sans-serif" }} axisLine={false} tickLine={false}/>
              <YAxis tickFormatter={(v) => `USD ${v >= 1000 ? Math.round(v/1000) * 10 + "K" : v}`} tick={{ fontSize: 10, fill: t.mutedFg, fontFamily: "var(--font-sans), sans-serif" }} axisLine={false} tickLine={false} width={60}/>
              <Tooltip
                contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 12, color: t.fg, fontFamily: "var(--font-sans), sans-serif" }}
                formatter={(value: any, name: string) => [`USD ${Number(value).toLocaleString()}`, name === "revenue" ? "Delivery revenue" : "Delivery costs"]}
              />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="costs" stroke={t.fgAlpha70} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ width: 260, borderLeft: `1px solid ${t.border}`, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 20 }}>
          {[{ label: "Delivery revenue", total: "USD 151,087", color: "#3B82F6" }, { label: "Delivery costs", total: "USD 139,288", color: t.fgAlpha70 }].map((series, si) => (
            <div key={si}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: series.color, border: si === 1 ? `2px solid ${t.fgAlpha70}` : "none", boxSizing: "border-box" }}/>
                  <span style={{ fontSize: 12, color: t.fg }}>{series.label}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: t.fg }}>{series.total}</span>
              </div>
              {REV_LEGEND.map((row, ri) => (
                <div key={ri} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "3px 0", borderBottom: `1px dashed ${t.border}` }}>
                  <span style={{ fontSize: 11, color: t.mutedFg }}>{row.label}</span>
                  <span style={{ fontSize: 11, color: t.mutedFg }}>{si === 0 ? row.rev : row.cost}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "12px 18px", borderTop: `1px solid ${t.border}`, fontSize: 13, color: t.fgAlpha70 }}>
        Revenue exceeded costs by <span style={{ color: "#3B82F6", fontWeight: 500 }}>USD 11,799</span> this month — margin of ~7.8%. Peak week was 9 Mar.
      </div>
    </div>
  )
}

const CLIENT_COLORS = ["#7DD3FC", "#3B82F6", "#60A5FA", "#93C5FD", "#2563EB", "#1D4ED8"]

function ClientRevenueCard({ projects, clientsFull }: { projects: any[], clientsFull: any[] }) {
  const byClient: Record<string, number> = {}
  projects.forEach(p => {
    const name = clientsFull[p.clientId]?.name ?? "No client"
    byClient[name] = (byClient[name] ?? 0) + (p.budget ?? 0)
  })
  const entries = Object.entries(byClient).sort((a, b) => b[1] - a[1])
  const total = entries.reduce((s, [, v]) => s + v, 0)
  const data = entries.map(([name, value]) => ({ name, value }))
  const top = data[0]
  const topPct = total > 0 && top ? Math.round((top.value / total) * 100) : 0
  // Simulate a MoM change seeded from the client name so it's stable
  const seed = top ? top.name.charCodeAt(0) % 40 + 8 : 0
  const momUp = top ? top.name.charCodeAt(0) % 2 === 0 : true

  return (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, overflow: "hidden", width: "100%" }}>
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${t.border}` }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: t.fg }}>Client revenue</span>
      </div>
      <div style={{ display: "flex", minHeight: 220 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 8px 20px 18px" }}>
          <div style={{ position: "relative", width: 200, height: 200, flexShrink: 0 }}>
            <PieChart width={200} height={200}>
              <Pie data={data} cx={95} cy={95} innerRadius={78} outerRadius={92} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
                {data.map((_, i) => <Cell key={i} fill={CLIENT_COLORS[i % CLIENT_COLORS.length]}/>)}
              </Pie>
            </PieChart>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: t.fg, fontFamily: "var(--font-sans), sans-serif" }}>USD {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, borderLeft: `1px solid ${t.border}`, padding: "16px 18px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 0 }}>
          {data.map((item, i) => {
            const pct = total > 0 ? ((item.value / total) * 100).toFixed(0) : "0"
            const isUp = i === 0
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: i < data.length - 1 ? `1px dashed ${t.border}` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: CLIENT_COLORS[i % CLIENT_COLORS.length], flexShrink: 0 }}/>
                  <span style={{ fontSize: 12, color: t.fg, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 12, color: t.fg }}>USD {item.value.toLocaleString()}</span>
                  <span style={{ fontSize: 11, color: isUp ? "#22C55E" : "#F97316", display: "flex", alignItems: "center", gap: 2 }}>
                    {isUp ? "▲" : "▼"} {pct}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      {top && (
        <div style={{ padding: "12px 18px", borderTop: `1px solid ${t.border}`, fontSize: 13, color: t.fgAlpha70 }}>
          <span style={{ color: t.fg, fontWeight: 500 }}>{top.name}</span> was the highest revenue client this month at {topPct}% of total —{" "}
          <span style={{ color: momUp ? "#22C55E" : "#F97316", fontWeight: 500 }}>{momUp ? "up" : "down"} {seed}%</span> from last month.
        </div>
      )}
    </div>
  )
}

const TIME_OFF_DATA = [
  { label: "Paid time off",    color: "#173074", days: 24, pct: 3,  up: true  },
  { label: "Parental leave",   color: "#254cba", days: 12, pct: 8,  up: false },
  { label: "Public holiday",   color: "#2e5fe8", days: 10, pct: 5,  up: true  },
  { label: "Sick leave",       color: "#1a90dc", days: 9,  pct: 12, up: false },
  { label: "Annual leave",     color: "#6ad2ff", days: 7,  pct: 2,  up: true  },
  { label: "+2 time off types",color: "#cee7fe", days: 3,  pct: 0,  up: true  },
]

function TimeOffCard() {
  const total = TIME_OFF_DATA.reduce((s, r) => s + r.days, 0)
  const pieData = TIME_OFF_DATA.map(r => ({ name: r.label, value: r.days }))
  const top = TIME_OFF_DATA[0]

  return (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, overflow: "hidden", width: "100%" }}>
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${t.border}` }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: t.fg }}>Time offs</span>
      </div>
      <div style={{ display: "flex", minHeight: 220 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 8px 20px 18px" }}>
          <div style={{ position: "relative", width: 200, height: 200, flexShrink: 0 }}>
            <PieChart width={200} height={200}>
              <Pie data={pieData} cx={95} cy={95} innerRadius={78} outerRadius={92} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={2} stroke={t.card}>
                {pieData.map((_, i) => <Cell key={i} fill={TIME_OFF_DATA[i].color}/>)}
              </Pie>
            </PieChart>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: t.fg, fontFamily: "var(--font-sans), sans-serif" }}>{total} days</span>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, borderLeft: `1px solid ${t.border}`, padding: "16px 18px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 0 }}>
          {TIME_OFF_DATA.map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0", borderBottom: i < TIME_OFF_DATA.length - 1 ? `1px dashed ${t.border}` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: row.color, flexShrink: 0 }}/>
                <span style={{ fontSize: 12, color: t.fg, whiteSpace: "nowrap" }}>{row.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: t.fg }}>{row.days} days</span>
                {row.pct > 0 && (
                  <span style={{ fontSize: 11, color: row.up ? "#22C55E" : "#F97316", display: "flex", alignItems: "center", gap: 2 }}>
                    {row.up ? "▲" : "▼"} {row.pct}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "12px 18px", borderTop: `1px solid ${t.border}`, fontSize: 13, color: t.fgAlpha70 }}>
        <span style={{ color: t.fg, fontWeight: 500 }}>{top.label}</span> accounts for the most time off this month at{" "}
        <span style={{ color: t.fg, fontWeight: 500 }}>{top.days} days</span> — up{" "}
        <span style={{ color: "#22C55E", fontWeight: 500 }}>{top.pct}%</span> from last month.
      </div>
    </div>
  )
}

const CAPACITY_DATA = [
  { week: "1 Mar",  gross: 5500, delivery: 2000, scheduled: 2900 },
  { week: "8 Mar",  gross: 5500, delivery: 3300, scheduled: 3100 },
  { week: "15 Mar", gross: 4800, delivery: 3200, scheduled: 3000 },
  { week: "22 Mar", gross: 4200, delivery: 3000, scheduled: 2800 },
  { week: "29 Mar", gross: 4200, delivery: 1800, scheduled: 2400 },
]

const CAPACITY_LEGEND = [
  { label: "On track",   value: "2,000h" },
  { label: "Off track",  value: "2,000h" },
  { label: "Completed",  value: "3,500h" },
]

function DeliveryCapacityCard() {
  return (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, overflow: "hidden", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: `1px solid ${t.border}` }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: t.fg }}>Capacity</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", border: `1px solid ${t.border}`, borderRadius: 6, cursor: "pointer", fontSize: 12, color: t.mutedFg }}>
          Weeks <ChevronDown size={12} strokeWidth={1.5}/>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, padding: "16px 8px 8px 8px", minWidth: 0 }}>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={CAPACITY_DATA} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <pattern id="capHatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="6" stroke={t.fgAlpha06} strokeWidth="3"/>
                </pattern>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false}/>
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: t.mutedFg, fontFamily: "var(--font-sans), sans-serif" }} axisLine={false} tickLine={false}/>
              <YAxis tickFormatter={v => `${(v/1000).toFixed(0)},000h`} tick={{ fontSize: 10, fill: t.mutedFg, fontFamily: "var(--font-sans), sans-serif" }} axisLine={false} tickLine={false} width={56} ticks={[0,1000,2000,4000,6000]}/>
              <Tooltip
                contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 12, color: t.fg, fontFamily: "var(--font-sans), sans-serif" }}
                formatter={(value: any, name: string) => [`${Number(value).toLocaleString()}h`, name === "gross" ? "Gross capacity" : name === "delivery" ? "Delivery capacity" : "Scheduled"]}
              />
              <Area type="stepAfter" dataKey="gross" fill="url(#capHatch)" stroke={t.fgAlpha06} strokeWidth={1} fillOpacity={1}/>
              <Line type="monotone" dataKey="delivery" stroke="#3B82F6" strokeWidth={2} dot={false} strokeDasharray="6 3"/>
              <Line type="monotone" dataKey="scheduled" stroke="#EF4444" strokeWidth={2} dot={false} strokeDasharray="6 3"/>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div style={{ width: 220, borderLeft: `1px solid ${t.border}`, padding: "20px 18px", display: "flex", flexDirection: "column", gap: 16, flexShrink: 0 }}>
          {[
            { label: "Gross capacity", value: "15,000h", icon: <div style={{ width: 10, height: 10, borderRadius: 3, background: t.fgAlpha06, border: `1px solid ${t.border}` }}/> },
            { label: "Delivery capacity", value: "10,000h", icon: <svg width="16" height="4"><line x1="0" y1="2" x2="16" y2="2" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 2"/></svg> },
            { label: "Scheduled", value: "7,500h", icon: <svg width="16" height="4"><line x1="0" y1="2" x2="16" y2="2" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 2"/></svg> },
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {row.icon}
                <span style={{ fontSize: 12, fontWeight: 500, color: t.mutedFg }}>{row.label}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: t.fg }}>{row.value}</span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 12, display: "flex", flexDirection: "column", gap: 0 }}>
            {CAPACITY_LEGEND.map((row, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 0", borderBottom: i < CAPACITY_LEGEND.length - 1 ? `1px dashed ${t.border}` : "none" }}>
                <span style={{ fontSize: 12, color: t.mutedFg }}>{row.label}</span>
                <span style={{ fontSize: 12, color: t.mutedFg }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: "12px 18px", borderTop: `1px solid ${t.border}`, fontSize: 13, color: t.fgAlpha70 }}>
        Delivery capacity is at <span style={{ color: t.fg, fontWeight: 500 }}>10,000h</span> this month — scheduled hours are{" "}
        <span style={{ color: "#22C55E", fontWeight: 500 }}>75% utilised</span>, with 3,500h already completed.
      </div>
    </div>
  )
}

const ATTENTION_CONFIGS = [
  { tag: "Over budget",      tagBg: "rgba(205,43,49,0.15)",  tagFg: "#EF4444", accent: "#EF4444", estVsAct: "+18%", estColor: "#EF4444", ctc: "124%", reason: "Costs have exceeded the approved budget with no approved change order." },
  { tag: "At risk",          tagBg: "rgba(249,115,22,0.15)", tagFg: "#F97316", accent: "#F97316", estVsAct: "+11%", estColor: "#F97316", ctc: "108%", reason: "Team is under-scheduled for remaining deliverables in Q1." },
  { tag: "Delayed",          tagBg: "rgba(234,179,8,0.15)",  tagFg: "#EAB308", accent: "#EAB308", estVsAct: "+6%",  estColor: "#EAB308", ctc: "103%", reason: "Key milestone missed — delivery is now 2 weeks behind schedule." },
  { tag: "Under resourced",  tagBg: "rgba(168,85,247,0.15)", tagFg: "#A855F7", accent: "#A855F7", estVsAct: "+9%",  estColor: "#F97316", ctc: "107%", reason: "Not enough allocated hours to meet the end-of-month deadline." },
  { tag: "Scope creep",      tagBg: "rgba(59,130,246,0.15)", tagFg: "#3B82F6", accent: "#3B82F6", estVsAct: "+22%", estColor: "#EF4444", ctc: "131%", reason: "Multiple untracked change requests have inflated scope beyond estimate." },
]

function ProjectsAttentionCard({ projects, clientsFull, onRowClick }: { projects: any[], clientsFull: any[], onRowClick: (p: any) => void }) {
  const atRisk = projects
    .filter(p => p.health === "off-track" || p.health === "at-risk")
    .slice(0, 5)
    .map((p, i) => ({ ...p, ...ATTENTION_CONFIGS[i % ATTENTION_CONFIGS.length] }))

  const display = atRisk.length >= 3 ? atRisk : projects.slice(0, 5).map((p, i) => ({ ...p, ...ATTENTION_CONFIGS[i % ATTENTION_CONFIGS.length] }))

  const cols = "2fr 1fr 1fr 1fr 2fr"
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  return (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, overflow: "hidden", width: "100%" }}>
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: t.fg }}>Projects Requiring Attention</span>
        <span style={{ fontSize: 12, color: t.mutedFg }}>{display.length} projects</span>
      </div>
      <div style={{ padding: "0 18px" }}>
        <div style={{ display: "grid", gridTemplateColumns: cols, borderBottom: `1px solid ${t.border}`, padding: "8px 0", gap: 8 }}>
          {["Project", "Client", "Status", "Est. vs. Actual", "Reason"].map(h => (
            <span key={h} style={{ fontSize: 12, fontWeight: 500, color: t.mutedFg }}>{h}</span>
          ))}
        </div>
        {display.map((p: any, i: number) => {
          const clientName = clientsFull[p.clientId]?.name ?? "No client"
          const isHovered = hoveredRow === i
          return (
            <div
              key={i}
              onClick={() => onRowClick({ ...p, clientName })}
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{ display: "grid", gridTemplateColumns: cols, borderBottom: i < display.length - 1 ? `1px solid ${t.border}` : "none", padding: "10px 8px", margin: "0 -8px", gap: 8, alignItems: "center", cursor: "pointer", borderRadius: 6, background: isHovered ? t.fgAlpha06 : "transparent", transition: "background 0.1s" }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: t.fg, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {p.name}
                {isHovered && <span style={{ fontSize: 11, color: t.mutedFg, marginLeft: 6, fontWeight: 400 }}>View detail →</span>}
              </span>
              <span style={{ fontSize: 13, color: t.fg }}>{clientName}</span>
              <span>
                <div style={{ display: "inline-flex", background: p.tagBg, borderRadius: 50, padding: "3px 10px" }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: p.tagFg, whiteSpace: "nowrap" }}>{p.tag}</span>
                </div>
              </span>
              <span style={{ fontSize: 13, fontWeight: 500, color: p.estColor }}>{p.estVsAct}</span>
              <span style={{ fontSize: 12, color: t.mutedFg, lineHeight: 1.4 }}>{p.reason}</span>
            </div>
          )
        })}
      </div>
      <div style={{ padding: "12px 18px", borderTop: `1px solid ${t.border}`, fontSize: 13, color: t.mutedFg }}>
        <span style={{ color: t.fg, fontWeight: 500 }}>{display.length} projects</span> need immediate attention —{" "}
        <span style={{ color: "#EF4444", fontWeight: 500 }}>{display.filter((p: any) => p.tag === "Over budget").length} over budget</span> and{" "}
        <span style={{ color: "#F97316", fontWeight: 500 }}>{display.filter((p: any) => p.tag === "At risk" || p.tag === "Delayed").length} at risk of missing deadlines</span>.
      </div>
    </div>
  )
}

type AgentMessage = { role: "user" | "assistant"; text: string; card?: "revenue-vs-costs" | "client-revenue" | "time-off" | "delivery-capacity" | "projects-attention" | "project-detail"; projectData?: any }

function ProjectDetailCard({ project, clientName, people, config }: { project: any, clientName: string, people: any[], config: any }) {
  const logData = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(2026, 2, 1 + i * 7) // March 2026 weeks
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const sched = Math.round(40 + i * 18 + (i === 2 ? 8 : 0))
    const logged = Math.round(sched * (1.12 + i * 0.04))
    return { week: label, logged, scheduled: sched }
  })

  const utilization = Math.round(100 + (100 - project.margin) * 0.6)
  const owner = people[project.ownerId] ?? people[0]
  const second = people[(project.ownerId + 1) % people.length] ?? people[1]
  const concerns = [
    { name: owner.name, role: owner.role ?? "Engineer", pct: Math.round(utilization * 0.13), status: "Over utilized", statusBg: "rgba(239,68,68,0.15)", statusFg: "#EF4444" },
    { name: second.name, role: second.role ?? "Designer", pct: Math.round(utilization * 0.15), status: "Under utilized", statusBg: "rgba(249,115,22,0.12)", statusFg: "#F97316" },
  ]

  const metrics = [
    { label: "Cost Est. vs Actual", value: config.estVsAct, color: config.estColor },
    { label: "Cost to Completion", value: config.ctc, color: t.fg },
    { label: "Hours Est. vs Actual", value: `+${Math.round(parseFloat(config.estVsAct) * 1.1)}%`, color: config.estColor },
    { label: "Hours Completion", value: `${Math.round(parseFloat(config.ctc) - 4)}%`, color: t.fg },
  ]

  const SparkLine = ({ over }: { over: boolean }) => {
    const pts = over
      ? [0,4,6,3,8,12,10,14,10] : [14,10,12,8,4,6,2,4,2]
    const w = 80, h = 28, max = 16
    const path = pts.map((y, x) => `${x === 0 ? "M" : "L"}${(x / (pts.length - 1)) * w},${h - (y / max) * h}`).join(" ")
    return (
      <svg width={w} height={h} style={{ overflow: "visible" }}>
        <path d={path} fill="none" stroke={t.border} strokeWidth={1.5}/>
        <path d={`M${(4 / 8) * w},${h - (pts[4] / max) * h} Q${(5 / 8) * w},${h - (pts[5] / max) * h} ${(6 / 8) * w},${h - (pts[6] / max) * h}`} fill="none" stroke="#E62768" strokeWidth={2}/>
      </svg>
    )
  }

  return (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, overflow: "hidden", width: "100%" }}>
      <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h2 style={{ fontSize: 22, fontWeight: 600, color: t.fg, margin: 0, fontFamily: "var(--font-sans), sans-serif" }}>{project.name}</h2>
              <div style={{ background: config.tagBg, borderRadius: 4, padding: "3px 10px" }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: config.tagFg }}>{config.tag}</span>
              </div>
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: t.mutedFg, margin: "4px 0 0" }}>{clientName}</p>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 8px 4px 8px" }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: t.fg, margin: "0 0 8px 10px" }}>Logged vs Scheduled</p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={logData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false}/>
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: t.mutedFg, fontFamily: "var(--font-sans), sans-serif" }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fontSize: 10, fill: t.mutedFg, fontFamily: "var(--font-sans), sans-serif" }} axisLine={false} tickLine={false} width={36} tickFormatter={v => `${v}h`}/>
            <Tooltip
              contentStyle={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 12, color: t.fg, fontFamily: "var(--font-sans), sans-serif" }}
              formatter={(v: any, n: string) => [`${v}h`, n === "logged" ? "Logged" : "Scheduled"]}
            />
            <Line type="monotone" dataKey="logged" stroke="#3B82F6" strokeWidth={2} dot={false}/>
            <Line type="monotone" dataKey="scheduled" stroke={t.fgAlpha70} strokeWidth={2} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "8px 20px 16px", gap: 12, borderBottom: `1px solid ${t.border}` }}>
        {metrics.map((m, i) => (
          <div key={i}>
            <p style={{ fontSize: 10, fontWeight: 500, color: t.mutedFg, margin: "0 0 4px" }}>{m.label}</p>
            <p style={{ fontSize: 22, fontWeight: 600, color: m.color, margin: 0, fontFamily: "var(--font-sans), sans-serif" }}>{m.value}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 14 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: t.fg, margin: 0, flexShrink: 0 }}>Utilization</p>
        <div style={{ flex: 1, height: 8, background: t.fgAlpha06, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: `${Math.min(utilization, 100)}%`, height: "100%", background: utilization > 100 ? "#EF4444" : "#22C55E", borderRadius: 4 }}/>
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, color: t.fg, flexShrink: 0 }}>{utilization}% utilization</span>
      </div>

      <div style={{ padding: "12px 20px 4px" }}>
        <p style={{ ...s.caseTitleXs, margin: "0 0 8px" }}>Concerns</p>
      </div>
      {concerns.map((c, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 20px", borderTop: `1px solid ${t.border}` }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: t.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: t.fg, flexShrink: 0 }}>
            {c.name.charAt(0)}
          </div>
          <div style={{ minWidth: 120 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: t.fg, margin: 0 }}>{c.name}</p>
            <p style={{ fontSize: 12, color: t.mutedFg, margin: "2px 0 0" }}>{c.role}</p>
          </div>
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <SparkLine over={c.status === "Over utilized"}/>
          </div>
          <span style={{ fontSize: 20, fontWeight: 600, color: t.fg, flexShrink: 0 }}>{c.pct}%</span>
          <div style={{ background: c.statusBg, borderRadius: 4, padding: "3px 8px", flexShrink: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: c.statusFg }}>{c.status}</span>
          </div>
        </div>
      ))}
      <div style={{ padding: "12px 20px", borderTop: `1px solid ${t.border}`, fontSize: 13, color: t.fgAlpha70 }}>
        {config.reason}
      </div>
    </div>
  )
}

function detectDashboard(q: string): boolean {
  const l = q.toLowerCase()
  return (l.includes("dashboard") || l.includes("save") || l.includes("build me")) && (l.includes("graph") || l.includes("chart") || l.includes("dashboard") || l.includes("these"))
}

function detectCard(q: string): "revenue-vs-costs" | "client-revenue" | "time-off" | "delivery-capacity" | "projects-attention" | null {
  const l = q.toLowerCase()
  if (l.includes("attention") || l.includes("require") || l.includes("at risk") || (l.includes("project") && (l.includes("issue") || l.includes("problem") || l.includes("concern")))) return "projects-attention"
  if (l.includes("delivery capacity") || l.includes("capacity") && l.includes("delivery")) return "delivery-capacity"
  if (l.includes("time off") || l.includes("timeoff") || l.includes("leave") || l.includes("holiday") || l.includes("pto")) return "time-off"
  if (l.includes("client revenue") || (l.includes("client") && l.includes("revenue"))) return "client-revenue"
  if ((l.includes("revenue") || l.includes("cost")) && (l.includes("vs") || l.includes("versus") || l.includes("compare") || l.includes("against"))) return "revenue-vs-costs"
  if (l.includes("revenue vs cost") || l.includes("revenue vs. cost")) return "revenue-vs-costs"
  return null
}

function SavedDashboardView({ cards, projects, clientsFull, people }: { cards: string[], projects: any[], clientsFull: any[], people: any[] }) {
  const cardMap: Record<string, React.ReactNode> = {
    "revenue-vs-costs": <RevenueVsCostsCard/>,
    "client-revenue": <ClientRevenueCard projects={projects} clientsFull={clientsFull}/>,
    "time-off": <TimeOffCard/>,
    "delivery-capacity": <DeliveryCapacityCard/>,
    "projects-attention": <ProjectsAttentionCard projects={projects} clientsFull={clientsFull} onRowClick={() => {}}/>,
  }
  const labelMap: Record<string, string> = {
    "revenue-vs-costs": "Revenue vs. Costs",
    "client-revenue": "Client Revenue",
    "time-off": "Time Off",
    "delivery-capacity": "Delivery Capacity",
    "projects-attention": "Projects Requiring Attention",
  }
  return (
    <div style={{ flex: 1, overflowY: "auto", background: t.bg, padding: "28px 32px 40px" }}>
      <style>{`@keyframes cardFadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.card-fade{animation:cardFadeIn 0.7s cubic-bezier(0.16,1,0.3,1) both}`}</style>
      <div style={{ width: "100%" }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: t.fg, fontFamily: "var(--font-sans), sans-serif", margin: "0 0 6px" }}>Saved Dashboard</h2>
        <p style={{ fontSize: 13, color: t.mutedFg, fontFamily: "var(--font-sans), sans-serif", margin: "0 0 28px" }}>{cards.length} graph{cards.length !== 1 ? "s" : ""} · March 2026</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-start" }}>
          {cards.map((card, i) => {
            const fullWidth = card === "revenue-vs-costs" || card === "delivery-capacity" || card === "projects-attention"
            return (
              <div key={card} className="card-fade" style={{ animationDelay: `${i * 0.08}s`, width: fullWidth ? 760 : "calc(50% - 10px)", minWidth: fullWidth ? 0 : 340, flexShrink: 1 }}>
                {cardMap[card]}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function FloatAgentView({ projects, clientsFull, people, onSaveDashboard }: { projects: any[], clientsFull: any[], people: any[], onSaveDashboard?: (cards: string[]) => void }) {
  const [phase, setPhase] = useState<"idle" | "loading" | "chat">("idle")
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [input, setInput] = useState("")
  const threadRef = useRef<HTMLDivElement>(null)

  function onProjectClick(p: any) {
    setMessages(prev => [...prev, { role: "user", text: `Tell me more about ${p.name}` }])
    setPhase("loading")
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", text: `Here's a detailed breakdown for ${p.name}:`, card: "project-detail", projectData: p }])
      setPhase("chat")
    }, 800)
  }

  function submit() {
    const q = input.trim()
    if (!q) return
    setInput("")
    setMessages(prev => [...prev, { role: "user", text: q }])
    setPhase("loading")
    setTimeout(() => {
      if (detectDashboard(q)) {
        setMessages(prev => {
          const cards = [...new Set(prev.filter(m => m.card && m.card !== "project-detail").map(m => m.card!))]
          if (cards.length > 0) onSaveDashboard?.(cards)
          const text = cards.length > 0
            ? `Done — I've saved a dashboard with ${cards.length} graph${cards.length > 1 ? "s" : ""}. You'll find it under Float Agent in the nav.`
            : "No graphs loaded yet. Ask me about revenue, clients, time off, capacity, or projects first."
          return [...prev, { role: "assistant", text }]
        })
        setPhase("chat")
        return
      }
      const card = detectCard(q)
      const text = card === "revenue-vs-costs"
        ? "Here's your revenue vs. costs breakdown for March:"
        : card === "client-revenue"
        ? "Here's this month's revenue broken down by client:"
        : card === "time-off"
        ? "Here's a breakdown of time off taken this month:"
        : card === "delivery-capacity"
        ? "Here's your delivery capacity breakdown for March:"
        : card === "projects-attention"
        ? "Here are the projects that need your attention right now:"
        : "I don't have a visual for that yet — try asking about revenue vs. costs, client revenue, time off, delivery capacity, or projects requiring attention."
      setMessages(prev => [...prev, { role: "assistant", text, card: card ?? undefined }])
      setPhase("chat")
    }, 1200)
  }

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight
  }, [messages, phase])

  const inputBox = (compact: boolean) => (
    <div style={{ position: "relative", width: "100%", maxWidth: compact ? "100%" : 654, border: `1px solid ${t.border}`, borderRadius: compact ? 12 : 16, background: t.card }}>
      <style>{`.fai::placeholder{color:${t.mutedFg}}@keyframes cardFadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}.card-fade{animation:cardFadeIn 0.7s cubic-bezier(0.16,1,0.3,1) both}`}</style>
      {compact ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px" }}>
          <input
            className="fai"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit() } }}
            placeholder="Ask a follow-up..."
            style={{ flex: 1, border: "none", background: "transparent", color: t.fg, fontSize: 14, fontFamily: "var(--font-sans), sans-serif", outline: "none" }}
          />
          <HoverBtn onClick={submit} style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${t.border}`, background: t.bg, color: t.fg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <ArrowUp size={14} strokeWidth={1.5}/>
          </HoverBtn>
        </div>
      ) : (
        <>
          <textarea
            className="fai"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit() } }}
            placeholder="Ask me anything"
            style={{ width: "100%", minHeight: 112, padding: "20px 52px 52px 20px", border: "none", borderRadius: 16, background: "transparent", color: t.fg, fontSize: 16, fontFamily: "var(--font-sans), sans-serif", resize: "none", outline: "none", boxSizing: "border-box" }}
            rows={3}
          />
          <HoverBtn onClick={submit} style={{ position: "absolute", right: 20, bottom: 20, width: 29, height: 29, borderRadius: 8, border: `1px solid ${t.border}`, background: t.bg, color: t.fg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowUp size={16} strokeWidth={1.5}/>
          </HoverBtn>
        </>
      )}
    </div>
  )

  if (phase === "idle") {
    return (
      <div style={{ display: "flex", flex: 1, flexDirection: "column", background: t.bg, overflow: "auto" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <p style={{ fontSize: 18, fontWeight: 600, color: t.fg, marginBottom: 24, fontFamily: "var(--font-sans), sans-serif" }}>Good Afternoon Cam</p>
          {inputBox(false)}
          <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              "what is the client revenue for this month?",
              "what's the time off this month?",
            ].map(q => (
              <button key={q} onClick={() => setInput(q)} style={{ background: t.fgAlpha06, border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 12px", fontSize: 12, color: t.fgAlpha70, cursor: "pointer", fontFamily: "var(--font-sans), sans-serif" }}>
                &lsquo;{q}&rsquo;
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flex: 1, flexDirection: "column", background: t.bg, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 24px 0", flexShrink: 0 }}>
        <HoverBtn onClick={() => { setMessages([]); setPhase("idle"); setInput("") }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: "transparent", color: t.mutedFg, fontSize: 13, cursor: "pointer", fontFamily: "var(--font-sans), sans-serif" }}>
          New chat
        </HoverBtn>
      </div>
      <div ref={threadRef} style={{ flex: 1, overflowY: "auto", padding: "12px 24px 12px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", gap: 10 }}>
              {msg.role === "user" ? (
                <div style={{ background: t.fgAlpha06, borderRadius: 12, padding: "10px 14px", maxWidth: "70%", fontSize: 14, color: t.fg, fontFamily: "var(--font-sans), sans-serif" }}>
                  {msg.text}
                </div>
              ) : (
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Bot size={12} strokeWidth={1.5} color={t.fg}/>
                    </div>
                    <span style={{ fontSize: 13, color: t.mutedFg, fontFamily: "var(--font-sans), sans-serif" }}>Float Agent</span>
                  </div>
                  <p className="card-fade" style={{ fontSize: 14, color: t.fg, fontFamily: "var(--font-sans), sans-serif", margin: 0 }}>{msg.text}</p>
                  {msg.card === "revenue-vs-costs" && <div className="card-fade"><RevenueVsCostsCard/></div>}
                  {msg.card === "client-revenue" && <div className="card-fade"><ClientRevenueCard projects={projects} clientsFull={clientsFull}/></div>}
                  {msg.card === "time-off" && <div className="card-fade"><TimeOffCard/></div>}
                  {msg.card === "delivery-capacity" && <div className="card-fade"><DeliveryCapacityCard/></div>}
                  {msg.card === "projects-attention" && <div className="card-fade"><ProjectsAttentionCard projects={projects} clientsFull={clientsFull} onRowClick={onProjectClick}/></div>}
                  {msg.card === "project-detail" && msg.projectData && <div className="card-fade"><ProjectDetailCard project={msg.projectData} clientName={msg.projectData.clientName ?? clientsFull[msg.projectData.clientId]?.name ?? "No client"} people={people} config={msg.projectData}/></div>}
                </div>
              )}
            </div>
          ))}
          {phase === "loading" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bot size={12} strokeWidth={1.5} color={t.fg}/>
              </div>
              <style>{`@keyframes blink{0%,80%,100%{opacity:.2}40%{opacity:1}}.dot{animation:blink 1.4s infinite both}.dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}`}</style>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {[0,1,2].map(i => <span key={i} className={`dot`} style={{ width: 5, height: 5, borderRadius: "50%", background: t.mutedFg, display: "inline-block" }}/>)}
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: "12px 24px 20px", flexShrink: 0 }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {inputBox(true)}
        </div>
      </div>
    </div>
  )
}



function PlaceholderView({ title, breadcrumb }: any) {
  return (
    <div style={{ display:"flex", flex:1, flexDirection:"column" }}>
      <div style={{ padding:"20px 24px 16px" }}>
        <h2 style={{ fontSize:18, fontWeight:600, color:t.fg }}>{title}</h2>
        <p style={{ fontSize:13, color:t.mutedFg, marginTop:4 }}>
          {breadcrumb.length >= 2 ? `The ${breadcrumb[breadcrumb.length-1]} for ${breadcrumb[0]}` : "View details and manage settings for this section"}
        </p>
      </div>
      <div style={{ display:"flex", flex:1, alignItems:"center", justifyContent:"center" }}>
        <p style={{ fontSize:13, color:t.mutedFg }}>Content coming soon</p>
      </div>
    </div>
  )
}

// ── Talent Graph ──
const TALENT_SKILLS_MAP: Record<string, string[]> = {
  "Designer": ["Design", "Figma", "Branding"],
  "Senior Designer": ["Design", "Figma", "Art Direction"],
  "Developer": ["Engineering", "React", "TypeScript"],
  "Project Manager": ["Planning", "Delivery", "Agile"],
  "Art Director": ["Art Direction", "Visual Design", "Creative"],
  "Copywriter": ["Copywriting", "Content", "Brand Voice"],
  "Account Executive": ["Client Relations", "Sales", "Strategy"],
  "Creative Director": ["Creative", "Leadership", "Brand"],
  "UX/UI Designer": ["UX", "UI", "Research", "Figma"],
  "Motion Designer": ["Motion", "After Effects", "Animation"],
  "Brand Strategist": ["Strategy", "Brand", "Research"],
  "Social Media Manager": ["Social", "Content", "Analytics"],
}
const TALENT_CLIENTS = ["Google", "Nike", "Patagonia", "LinkedIn", "Toyota", "Verizon"]
const TALENT_CATS = ["fashion", "sport", "tech", "auto", "retail", "finance"]

type TGNode = { id: number, name: string, initials: string, role: string, dept: string, x: number, y: number, fx?: number | null, fy?: number | null }
type TGLink = { source: number | TGNode, target: number | TGNode, strength: number }

function TalentGraphView({ people, roles, departments }: any) {
  const nodeDefs = useMemo(() => people.map((p: any, i: number) => {
    const parts = p.name.trim().split(/\s+/)
    const initials = (parts[0][0] + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase()
    return { id: i, name: p.name, initials, role: roles[p.roleId]?.name ?? "", dept: departments[p.departmentId]?.name ?? "" }
  }), [people, roles, departments])

  const edgeDefs = useMemo(() => {
    const result: { source: number, target: number, strength: number }[] = []
    for (let i = 0; i < people.length; i++) {
      for (let j = i + 1; j < people.length; j++) {
        const a = people[i], b = people[j]
        let score = 0
        for (const tid of (a.deliveryTeamIds ?? [])) { if ((b.deliveryTeamIds ?? []).includes(tid)) score += 3 }
        for (const gid of (a.groupIds ?? [])) { if ((b.groupIds ?? []).includes(gid)) score += 2 }
        if (a.departmentId === b.departmentId) score += 1
        if (score >= 2) result.push({ source: i, target: j, strength: Math.min(score, 10) })
      }
    }
    return result
  }, [people])

  const d3NodesRef = useRef<TGNode[]>([])
  const d3LinksRef = useRef<TGLink[]>([])
  const simRef = useRef<any>(null)
  const frameRef = useRef(0)
  const [renderTick, setRenderTick] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 680, h: 480 })
  const dragRef = useRef<{ nodeId: number, startX: number, startY: number, moved: boolean } | null>(null)
  const [zoom, setZoom] = useState(1)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<number | null>(null)

  // Measure container
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setDims({ w: width, h: height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Build + run d3-force simulation synchronously, then freeze
  useEffect(() => {
    const { w, h } = dims
    // Seed in a circle so repulsion forces have non-zero distances to work from
    const r0 = Math.min(w, h) * 0.32
    const d3Nodes: TGNode[] = nodeDefs.map((n, i) => ({
      ...n,
      x: w / 2 + Math.cos((i / nodeDefs.length) * Math.PI * 2) * r0,
      y: h / 2 + Math.sin((i / nodeDefs.length) * Math.PI * 2) * r0,
    }))
    const d3Links: TGLink[] = edgeDefs.map(e => ({ ...e }))

    const sim = forceSimulation<TGNode>(d3Nodes)
      .force("link", forceLink<TGNode, TGLink>(d3Links).id(d => d.id).distance(100).strength(d => (d as any).strength * 0.05))
      .force("charge", forceManyBody().strength(-320))
      .force("center", forceCenter(w / 2, h / 2).strength(0.8))
      .force("collide", forceCollide(36))
      .stop()

    // Run to completion synchronously — no animation on mount
    sim.tick(500)

    d3NodesRef.current = d3Nodes
    d3LinksRef.current = d3Links
    simRef.current = sim
    cancelAnimationFrame(frameRef.current)
    frameRef.current = 0
    setRenderTick(c => c + 1)

    return () => { sim.stop(); cancelAnimationFrame(frameRef.current); frameRef.current = 0 }
  }, [nodeDefs, edgeDefs, dims])

  // RAF loop — only runs during drag
  function startDragLoop() {
    if (frameRef.current) return
    const sim = simRef.current
    if (!sim) return
    function loop() {
      setRenderTick(c => c + 1)
      if (sim.alpha() > sim.alphaMin()) {
        frameRef.current = requestAnimationFrame(loop)
      } else {
        sim.stop()
        frameRef.current = 0
        setRenderTick(c => c + 1)
      }
    }
    frameRef.current = requestAnimationFrame(loop)
  }

  function onNodeMouseDown(e: React.MouseEvent, nodeId: number) {
    e.stopPropagation()
    dragRef.current = { nodeId, startX: e.clientX, startY: e.clientY, moved: false }
  }
  function onSvgMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!dragRef.current) return
    const { nodeId } = dragRef.current
    const dx = e.clientX - dragRef.current.startX, dy = e.clientY - dragRef.current.startY
    if (!dragRef.current.moved && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
      dragRef.current.moved = true
      // Fix this node's position and reheat simulation
      const n = d3NodesRef.current[nodeId]
      if (n) { n.fx = n.x; n.fy = n.y }
      simRef.current?.alphaTarget(0.3).restart()
      startDragLoop()
    }
    if (!dragRef.current.moved) return
    const rect = svgRef.current!.getBoundingClientRect()
    const n = d3NodesRef.current[nodeId]
    if (n) { n.fx = (e.clientX - rect.left) / zoom; n.fy = (e.clientY - rect.top) / zoom }
    setRenderTick(c => c + 1)
  }
  function onNodeMouseUp(nodeId: number) {
    if (!dragRef.current) return
    if (!dragRef.current.moved) {
      setSelected(s => s === nodeId ? null : nodeId)
    } else {
      // Release fix — let node settle
      const n = d3NodesRef.current[nodeId]
      if (n) { n.fx = null; n.fy = null }
      simRef.current?.alphaTarget(0)
    }
    dragRef.current = null
  }
  function onSvgMouseUp() {
    if (!dragRef.current) return
    const n = d3NodesRef.current[dragRef.current.nodeId]
    if (n) { n.fx = null; n.fy = null }
    simRef.current?.alphaTarget(0)
    dragRef.current = null
  }

  const [agentInput, setAgentInput] = useState("")
  const [agentFilter, setAgentFilter] = useState<{ response: string, matchIds: Set<number> } | null>(null)
  const agentInputRef = useRef<HTMLInputElement>(null)

  function runQuery(raw: string) {
    const q = raw.toLowerCase().trim()
    if (!q) return

    // Helper: build match set from predicate
    const match = (pred: (p: any, i: number) => boolean) =>
      new Set<number>(people.map((_: any, i: number) => i).filter((i: number) => pred(people[i], i)))

    // 1. Client names
    for (const client of TALENT_CLIENTS) {
      if (q.includes(client.toLowerCase())) {
        const ids = match((_: any, i: number) => [0,1,2].map(o => TALENT_CLIENTS[(i + o * 7) % 6]).includes(client))
        setAgentFilter({ matchIds: ids, response: `${ids.size} people who have worked with ${client}` })
        return
      }
    }
    // 2. Roles
    for (const [ri, role] of roles.entries()) {
      if (q.includes(role.name.toLowerCase())) {
        const ids = match((p: any) => p.roleId === ri)
        setAgentFilter({ matchIds: ids, response: `${ids.size} ${role.name}${ids.size !== 1 ? "s" : ""}` })
        return
      }
    }
    // 3. Departments
    for (const [di, dept] of departments.entries()) {
      if (q.includes(dept.name.toLowerCase())) {
        const ids = match((p: any) => p.departmentId === di)
        setAgentFilter({ matchIds: ids, response: `${ids.size} people in ${dept.name}` })
        return
      }
    }
    // 4. Delivery teams
    const teamNames = ["acquisition", "retention", "core", "creative studio"]
    for (const [ti, teamName] of teamNames.entries()) {
      if (q.includes(teamName)) {
        const ids = match((p: any) => (p.deliveryTeamIds ?? []).includes(ti))
        setAgentFilter({ matchIds: ids, response: `${ids.size} people on the ${teamName.charAt(0).toUpperCase() + teamName.slice(1)} team` })
        return
      }
    }
    // 5. Groups
    const groupNames = ["leadership", "ai working group", "hiring committee"]
    for (const [gi, groupName] of groupNames.entries()) {
      if (q.includes(groupName)) {
        const ids = match((p: any) => (p.groupIds ?? []).includes(gi))
        setAgentFilter({ matchIds: ids, response: `${ids.size} people in ${groupName.charAt(0).toUpperCase() + groupName.slice(1)}` })
        return
      }
    }
    // 6. Offices
    const officeKeywords = ["new york", "london", "sydney", "beaverton", "hilversum", "shanghai", "melbourne"]
    for (const kw of officeKeywords) {
      if (q.includes(kw)) {
        const ids = match((p: any) => p.office.toLowerCase().includes(kw))
        setAgentFilter({ matchIds: ids, response: `${ids.size} people based in ${kw.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}` })
        return
      }
    }
    // 7. Person name — show their network
    for (const [pi, person] of people.entries()) {
      const first = person.name.split(" ")[0].toLowerCase()
      if (q.includes(first) || q.includes(person.name.toLowerCase())) {
        const nbrs = new Set(edgeDefs.filter((e: any) => e.source === pi || e.target === pi).map((e: any) => e.source === pi ? e.target : e.source))
        const ids = new Set([pi, ...nbrs])
        setAgentFilter({ matchIds: ids, response: `${person.name.split(" ")[0]} and ${nbrs.size} connections` })
        return
      }
    }
    // No match
    setAgentFilter({ matchIds: new Set(people.map((_: any, i: number) => i)), response: `Showing all ${people.length} people` })
  }

  const searchLower = search.toLowerCase()
  const strongBonds = edgeDefs.filter(e => e.strength >= 6).length
  const avgStr = edgeDefs.length > 0 ? (edgeDefs.reduce((s, e) => s + e.strength, 0) / edgeDefs.length).toFixed(1) : "0"

  // Neighbour set for selection highlighting
  const neighbourIds = useMemo(() => {
    if (selected === null) return new Set<number>()
    return new Set(edgeDefs.filter(e => e.source === selected || e.target === selected).map(e => e.source === selected ? e.target : e.source))
  }, [selected, edgeDefs])

  const selPerson = selected !== null ? (() => {
    const n = d3NodesRef.current[selected] ?? nodeDefs[selected]
    const skills = TALENT_SKILLS_MAP[n?.role ?? ""] ?? ["Creative", "Strategy"]
    const cl = [0, 1, 2].map(o => TALENT_CLIENTS[(selected + o * 7) % 6])
    const cats = [0, 1].map(o => TALENT_CATS[(selected + o * 5) % 6])
    const workedWith = [...neighbourIds].slice(0, 5).map(id => people[id]?.name.split(" ")[0]).filter(Boolean)
    return { name: n?.name, role: n?.role, dept: n?.dept, skills, clients: cl, categories: cats, workedWith }
  })() : null

  const GTag = ({ label }: { label: string }) => (
    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 100, background: t.fgAlpha10, color: t.fg, fontFamily: "var(--font-sans), sans-serif", whiteSpace: "nowrap" as const }}>{label}</span>
  )

  const hasSelection = selected !== null
  const agentActive = agentFilter !== null

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden", background: t.bg }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, overflow: "hidden", padding: "24px 0 24px 28px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: t.fg, margin: "0 0 4px", fontFamily: "var(--font-sans), sans-serif" }}>Talent Visualization</h2>
        <p style={{ fontSize: 13, color: t.mutedFg, margin: "0 0 16px", fontFamily: "var(--font-sans), sans-serif" }}>Click nodes for details, drag to rearrange.</p>
        <div ref={containerRef} style={{ flex: 1, position: "relative" as const, overflow: "hidden", minHeight: 0 }}>
          {/* Toolbar */}
          <div style={{ position: "absolute" as const, top: 12, left: 12, right: 12, display: "flex", alignItems: "center", gap: 8, zIndex: 10 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search: 'fashion, ux' or 'nike'"
              style={{ flex: "0 0 230px", height: 32, borderRadius: 6, border: `1px solid ${t.border}`, background: t.bg, color: t.fg, fontSize: 13, padding: "0 10px", fontFamily: "var(--font-sans), sans-serif", outline: "none" }} />
            <button style={{ height: 32, padding: "0 12px", borderRadius: 6, border: `1px solid ${t.border}`, background: t.bg, color: t.mutedFg, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-sans), sans-serif" }}>
              <Settings2 size={13} strokeWidth={1.5} /> Weights <ChevronDown size={12} strokeWidth={1.5} />
            </button>
            <div style={{ flex: 1 }} />
            {[{ label: "+", action: () => setZoom(z => Math.min(2, +(z + 0.15).toFixed(2))) },
              { label: "−", action: () => setZoom(z => Math.max(0.4, +(z - 0.15).toFixed(2))) },
              { label: <RefreshCw size={13} strokeWidth={1.5} />, action: () => setZoom(1) }].map(({ label, action }, i) => (
              <button key={i} onClick={action}
                style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${t.border}`, background: t.bg, color: t.mutedFg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontFamily: "var(--font-sans), sans-serif" }}>
                {label}
              </button>
            ))}
          </div>
          {/* SVG fills container via absolute positioning */}
          <svg ref={svgRef} style={{ position: "absolute" as const, inset: 0, width: "100%", height: "100%", display: "block" }}
            onMouseMove={onSvgMouseMove} onMouseUp={onSvgMouseUp} onMouseLeave={onSvgMouseUp}>
            <g transform={`translate(${dims.w / 2 * (1 - zoom)},${dims.h / 2 * (1 - zoom)}) scale(${zoom})`}>
              {/* Deselect background */}
              <rect x={-9999} y={-9999} width={99999} height={99999} fill="transparent" onClick={() => setSelected(null)} />
              {/* Edges — d3-force mutates source/target to node objects, read positions directly */}
              {d3LinksRef.current.map((e, i) => {
                const a = e.source as TGNode
                const b = e.target as TGNode
                if (a.x == null || b.x == null) return null
                const srcId = a.id, tgtId = b.id
                const agentVisible = !agentActive || (agentFilter!.matchIds.has(srcId) && agentFilter!.matchIds.has(tgtId))
                const isConnected = hasSelection && (srcId === selected || tgtId === selected)
                const edgeOpacity = !agentVisible ? 0.03 : hasSelection ? (isConnected ? 0.85 : 0.06) : (edgeDefs[i]?.strength >= 6 ? 0.55 : 0.25)
                return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={isConnected ? t.fg : t.border}
                  strokeDasharray={isConnected ? undefined : "4 3"}
                  strokeWidth={isConnected ? 2 : edgeDefs[i]?.strength >= 6 ? 1.5 : 1}
                  opacity={edgeOpacity}
                  style={{ pointerEvents: "none" as const }} />
              })}
              {/* Nodes */}
              {d3NodesRef.current.map((n) => {
                if (n.x == null) return null
                const searchMatch = !searchLower || n.name.toLowerCase().includes(searchLower) || n.role.toLowerCase().includes(searchLower)
                const isSel = selected === n.id
                const isNeighbour = neighbourIds.has(n.id)
                const agentMatch = !agentActive || agentFilter!.matchIds.has(n.id)
                const dimmed = !agentMatch || (agentMatch && hasSelection && !isSel && !isNeighbour) || (!agentActive && !!searchLower && !searchMatch)
                return (
                  <g key={n.id} style={{ cursor: "pointer" }} opacity={dimmed ? 0.15 : 1}
                    onMouseDown={ev => { ev.stopPropagation(); onNodeMouseDown(ev, n.id) }}
                    onMouseUp={ev => { ev.stopPropagation(); onNodeMouseUp(n.id) }}
                    onClick={ev => ev.stopPropagation()}>
                    {isSel && <circle cx={n.x} cy={n.y} r={27} fill="none" stroke={t.fg} strokeWidth={2} opacity={0.3} />}
                    <circle cx={n.x} cy={n.y} r={22} fill={t.fg} />
                    <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="central"
                      fill={t.bg} fontSize={11} fontWeight={600}
                      style={{ userSelect: "none" as const, pointerEvents: "none" as const, fontFamily: "var(--font-sans), sans-serif" }}>
                      {n.initials}
                    </text>
                    <text x={n.x} y={n.y + 32} textAnchor="middle" fill={t.fg} fontSize={11}
                      style={{ userSelect: "none" as const, pointerEvents: "none" as const, fontFamily: "var(--font-sans), sans-serif" }}>
                      {n.name.split(" ")[0]}
                    </text>
                  </g>
                )
              })}
            </g>
          </svg>
          {/* Agent input */}
          <div style={{ position: "absolute" as const, bottom: 16, left: 16, right: 16, zIndex: 10 }}>
            {agentFilter && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 100, background: t.fg, color: t.bg, fontSize: 12, fontFamily: "var(--font-sans), sans-serif", fontWeight: 500 }}>
                  <Share2 size={11} strokeWidth={2} />
                  {agentFilter.response}
                  <button onClick={() => { setAgentFilter(null); setAgentInput("") }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: t.bg, opacity: 0.6, padding: 0, display: "flex", alignItems: "center", marginLeft: 2 }}>
                    <X size={12} strokeWidth={2} />
                  </button>
                </div>
              </div>
            )}
            <form onSubmit={ev => { ev.preventDefault(); runQuery(agentInput); setAgentInput("") }}
              style={{ display: "flex", alignItems: "center", gap: 8, background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: "8px 12px", boxShadow: `0 2px 12px rgba(0,0,0,0.12)` }}>
              <input ref={agentInputRef} value={agentInput} onChange={e => setAgentInput(e.target.value)}
                placeholder="Ask about connections… e.g. 'who worked on Nike' or 'show leadership'"
                style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 13, color: t.fg, fontFamily: "var(--font-sans), sans-serif" }} />
              <button type="submit" disabled={!agentInput.trim()}
                style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: agentInput.trim() ? t.fg : t.fgAlpha10, color: agentInput.trim() ? t.bg : t.mutedFg, cursor: agentInput.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s" }}>
                <ArrowUp size={13} strokeWidth={2} />
              </button>
            </form>
          </div>
          {/* Footer stats */}
          <div style={{ position: "absolute" as const, bottom: 88, right: 16, display: "flex", gap: 12 }}>
            <span style={{ fontSize: 12, color: t.mutedFg, display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-sans), sans-serif" }}>
              <Users size={12} strokeWidth={1.5} /> {agentActive ? `${agentFilter!.matchIds.size}/` : ""}{people.length} People
            </span>
            <span style={{ fontSize: 12, color: t.mutedFg, display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-sans), sans-serif" }}>
              <Share2 size={12} strokeWidth={1.5} /> {edgeDefs.length} Connections
            </span>
          </div>
        </div>
      </div>
      {/* Right sidebar */}
      <div style={{ width: 288, flexShrink: 0, overflowY: "auto" as const, padding: "24px 24px 24px 16px", display: "flex", flexDirection: "column" as const, gap: 12 }}>
        <div style={{ border: `1px solid ${t.border}`, borderRadius: 10, padding: "16px 18px", background: t.card }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: t.fg, margin: "0 0 14px", fontFamily: "var(--font-sans), sans-serif" }}>Network Stats</h3>
          {([["Total People", people.length], ["Connections", edgeDefs.length], ["Avg Strength", `${avgStr}/10`], ["Strong Bonds", strongBonds]] as [string, any][]).map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${t.fgAlpha06}` }}>
              <span style={{ fontSize: 13, color: t.mutedFg, fontFamily: "var(--font-sans), sans-serif" }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: t.fg, fontFamily: "var(--font-sans), sans-serif" }}>{val}</span>
            </div>
          ))}
        </div>
        <div style={{ border: `1px solid ${t.border}`, borderRadius: 10, padding: "16px 18px", background: t.card }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: t.fg, margin: "0 0 12px", fontFamily: "var(--font-sans), sans-serif" }}>Selected Person</h3>
          {selPerson ? (
            <>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: t.fg, fontFamily: "var(--font-sans), sans-serif" }}>{selPerson.name}</div>
                <div style={{ fontSize: 12, color: t.mutedFg, marginTop: 2, fontFamily: "var(--font-sans), sans-serif" }}>{selPerson.role}</div>
                <div style={{ fontSize: 12, color: t.mutedFg, fontFamily: "var(--font-sans), sans-serif" }}>{selPerson.dept}</div>
              </div>
              {([["Skills", selPerson.skills], ["Clients", selPerson.clients], ["Categories", selPerson.categories], ["Worked With", selPerson.workedWith]] as [string, string[]][]).map(([label, items]) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ ...s.caseTitleCompact, marginBottom: 5 }}>{label}</div>
                  <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 4 }}>{items.map((item: string) => <GTag key={item} label={item} />)}</div>
                </div>
              ))}
            </>
          ) : (
            <p style={{ fontSize: 12, color: t.mutedFg, margin: 0, fontFamily: "var(--font-sans), sans-serif" }}>Click a node to view details</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Project Graph ──
const STAGE_COLOR: Record<string, string> = { active: "#10b981", planning: "#f59e0b", "on-hold": "#ef4444", completed: "#6b7280" }
const HEALTH_COLOR: Record<string, string> = { "on-track": "#10b981", "at-risk": "#f59e0b", "off-track": "#ef4444" }

type PGNode = { id: number, name: string, initials: string, stage: string, health: string, budget: number, unit: string, clientId: number, ownerId: number, office: string, code: string, x: number, y: number, fx?: number | null, fy?: number | null }
type PGLink = { source: number | PGNode, target: number | PGNode, strength: number }

function ProjectGraphView({ projects, roles, people, clientsFull }: any) {
  const nodeDefs = useMemo(() => projects.map((p: any, i: number) => {
    const parts = p.name.trim().split(/\s+/)
    const initials = ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? parts[0]?.[1] ?? "")).toUpperCase()
    return { id: i, name: p.name, initials, stage: p.stage, health: p.health, budget: p.budget, unit: p.unit, clientId: p.clientId, ownerId: p.ownerId, office: p.office, code: p.code }
  }), [projects])

  const edgeDefs = useMemo(() => {
    const buRoles = new Map<string, Set<number>>()
    BUSINESS_UNITS_FULL.forEach(bu => {
      const s = new Set<number>(); bu.departments.forEach((d: any) => d.linkedRoles.forEach((lr: any) => s.add(lr.roleId))); buRoles.set(bu.name, s)
    })
    const result: { source: number, target: number, strength: number }[] = []
    for (let i = 0; i < projects.length; i++) {
      for (let j = i + 1; j < projects.length; j++) {
        const a = projects[i], b = projects[j]; let score = 0
        if (a.unit === b.unit) score += 4
        if (a.clientId === b.clientId) score += 3
        if (a.ownerId === b.ownerId) score += 3
        const aR = buRoles.get(a.unit) ?? new Set(), bR = buRoles.get(b.unit) ?? new Set()
        if ([...aR].filter(r => bR.has(r)).length >= 4) score += 2
        if (score >= 3) result.push({ source: i, target: j, strength: Math.min(score, 10) })
      }
    }
    return result
  }, [projects])

  const d3NodesRef = useRef<PGNode[]>([])
  const d3LinksRef = useRef<PGLink[]>([])
  const simRef = useRef<any>(null)
  const frameRef = useRef(0)
  const [, setRenderTick] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 680, h: 480 })
  const dragRef = useRef<{ nodeId: number, startX: number, startY: number, moved: boolean } | null>(null)
  const [zoom, setZoom] = useState(1)
  const [selected, setSelected] = useState<number | null>(null)
  const [agentInput, setAgentInput] = useState("")
  const [agentFilter, setAgentFilter] = useState<{ response: string, matchIds: Set<number> } | null>(null)
  const startLoopRef = useRef<() => void>(() => {})

  useEffect(() => {
    const el = containerRef.current; if (!el) return
    const ro = new ResizeObserver(([e]) => setDims({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el); return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const { w, h } = dims
    const r0 = Math.min(w, h) * 0.32
    const d3Nodes: PGNode[] = nodeDefs.map((n: any, i: number) => ({
      ...n, x: w / 2 + Math.cos((i / nodeDefs.length) * Math.PI * 2) * r0, y: h / 2 + Math.sin((i / nodeDefs.length) * Math.PI * 2) * r0,
    }))
    const d3Links: PGLink[] = edgeDefs.map((e: any) => ({ ...e }))
    const sim = forceSimulation<PGNode>(d3Nodes)
      .force("link", forceLink<PGNode, PGLink>(d3Links).id(d => d.id).distance(100).strength((d: any) => d.strength * 0.05))
      .force("charge", forceManyBody().strength(-320))
      .force("center", forceCenter(w / 2, h / 2).strength(0.8))
      .force("collide", forceCollide(36))
      .stop()
    sim.tick(500)
    d3NodesRef.current = d3Nodes; d3LinksRef.current = d3Links; simRef.current = sim
    cancelAnimationFrame(frameRef.current); frameRef.current = 0; setRenderTick(c => c + 1)
    function startLoop() {
      if (frameRef.current) return
      function loop() {
        setRenderTick(c => c + 1)
        if (sim.alpha() > sim.alphaMin()) { frameRef.current = requestAnimationFrame(loop) }
        else { sim.stop(); frameRef.current = 0; setRenderTick(c => c + 1) }
      }
      frameRef.current = requestAnimationFrame(loop)
    }
    startLoopRef.current = startLoop
    return () => { sim.stop(); cancelAnimationFrame(frameRef.current); frameRef.current = 0 }
  }, [nodeDefs, edgeDefs, dims])

  function onNodeMouseDown(e: React.MouseEvent, nodeId: number) { e.stopPropagation(); dragRef.current = { nodeId, startX: e.clientX, startY: e.clientY, moved: false } }
  function onSvgMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!dragRef.current) return
    const { nodeId } = dragRef.current
    const dx = e.clientX - dragRef.current.startX, dy = e.clientY - dragRef.current.startY
    if (!dragRef.current.moved && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
      dragRef.current.moved = true
      const n = d3NodesRef.current[nodeId]; if (n) { n.fx = n.x; n.fy = n.y }
      simRef.current?.alphaTarget(0.3).restart(); startLoopRef.current()
    }
    if (!dragRef.current.moved) return
    const rect = svgRef.current!.getBoundingClientRect()
    const n = d3NodesRef.current[nodeId]; if (n) { n.fx = (e.clientX - rect.left) / zoom; n.fy = (e.clientY - rect.top) / zoom }
    setRenderTick(c => c + 1)
  }
  function onNodeMouseUp(nodeId: number) {
    if (!dragRef.current) return
    if (!dragRef.current.moved) setSelected(s => s === nodeId ? null : nodeId)
    else { const n = d3NodesRef.current[nodeId]; if (n) { n.fx = null; n.fy = null }; simRef.current?.alphaTarget(0) }
    dragRef.current = null
  }
  function onSvgMouseUp() {
    if (!dragRef.current) return
    const n = d3NodesRef.current[dragRef.current.nodeId]; if (n) { n.fx = null; n.fy = null }
    simRef.current?.alphaTarget(0); dragRef.current = null
  }

  function runQuery(raw: string) {
    const q = raw.toLowerCase().trim()
    const match = (pred: (p: any) => boolean) => new Set<number>(projects.map((_: any, i: number) => i).filter((i: number) => pred(projects[i])))
    // Stage
    if (q.includes("active") && !q.includes("at")) { const ids = match(p => p.stage === "active"); setAgentFilter({ matchIds: ids, response: `${ids.size} active projects` }); return }
    if (q.includes("planning")) { const ids = match(p => p.stage === "planning"); setAgentFilter({ matchIds: ids, response: `${ids.size} projects in planning` }); return }
    if (q.includes("on hold") || q.includes("on-hold")) { const ids = match(p => p.stage === "on-hold"); setAgentFilter({ matchIds: ids, response: `${ids.size} projects on hold` }); return }
    // Health
    if (q.includes("at risk") || q.includes("at-risk")) { const ids = match(p => p.health === "at-risk"); setAgentFilter({ matchIds: ids, response: `${ids.size} at-risk projects` }); return }
    if (q.includes("off track") || q.includes("off-track")) { const ids = match(p => p.health === "off-track"); setAgentFilter({ matchIds: ids, response: `${ids.size} off-track projects` }); return }
    if (q.includes("on track")) { const ids = match(p => p.health === "on-track"); setAgentFilter({ matchIds: ids, response: `${ids.size} on-track projects` }); return }
    // Business units
    for (const bu of BUSINESS_UNITS_FULL) {
      if (q.includes(bu.name.toLowerCase())) { const ids = match(p => p.unit === bu.name); setAgentFilter({ matchIds: ids, response: `${ids.size} ${bu.name} projects` }); return }
    }
    // Clients
    for (const [ci, client] of (clientsFull as any[]).entries()) {
      if (q.includes(client.name.toLowerCase())) { const ids = match(p => p.clientId === ci); setAgentFilter({ matchIds: ids, response: `${ids.size} projects for ${client.name}` }); return }
    }
    // Owner/PM
    for (const [pi, person] of (people as any[]).entries()) {
      const first = person.name.split(" ")[0].toLowerCase()
      if (q.includes(first)) { const ids = match(p => p.ownerId === pi); if (ids.size > 0) { setAgentFilter({ matchIds: ids, response: `${ids.size} projects owned by ${person.name.split(" ")[0]}` }); return } }
    }
    // Roles
    for (const [ri, role] of (roles as any[]).entries()) {
      if (q.includes(role.name.toLowerCase())) {
        const buSet = new Set(BUSINESS_UNITS_FULL.filter(bu => bu.departments.some((d: any) => d.linkedRoles.some((lr: any) => lr.roleId === ri))).map(bu => bu.name))
        const ids = match(p => buSet.has(p.unit)); setAgentFilter({ matchIds: ids, response: `${ids.size} projects using ${role.name}s` }); return
      }
    }
    // Office
    for (const kw of ["new york", "london", "sydney", "beaverton", "hilversum", "shanghai", "global"]) {
      if (q.includes(kw)) { const ids = match(p => p.office.toLowerCase().includes(kw)); setAgentFilter({ matchIds: ids, response: `${ids.size} projects in ${kw}` }); return }
    }
    // Budget threshold: "over 200k" / "above 300k"
    const bm = q.match(/(\d+)k/)
    if (bm) {
      const threshold = parseInt(bm[1]) * 1000
      const over = q.includes("over") || q.includes("above") || q.includes("more")
      const ids = match(p => over ? p.budget >= threshold : p.budget <= threshold)
      setAgentFilter({ matchIds: ids, response: `${ids.size} projects ${over ? "over" : "under"} $${bm[1]}k` }); return
    }
    setAgentFilter({ matchIds: new Set(projects.map((_: any, i: number) => i)), response: `Showing all ${projects.length} projects` })
  }

  const hasSelection = selected !== null
  const agentActive = agentFilter !== null
  const activeCount = projects.filter((p: any) => p.stage === "active").length
  const atRiskCount = projects.filter((p: any) => p.health === "at-risk").length
  const totalBudget = projects.reduce((s: number, p: any) => s + (p.budget || 0), 0)
  const fmt = (n: number) => n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${(n / 1000).toFixed(0)}K`

  const neighbourIds = useMemo(() => {
    if (selected === null) return new Set<number>()
    return new Set(edgeDefs.filter(e => e.source === selected || e.target === selected).map(e => e.source === selected ? e.target : e.source))
  }, [selected, edgeDefs])

  const selProject = selected !== null ? (() => {
    const p = projects[selected]
    const bu = BUSINESS_UNITS_FULL.find(b => b.name === p.unit)
    const buProject = bu?.projectsList?.find((bp: any) => bp.title === p.name)
    const buRoleIds = new Set<number>(); bu?.departments.forEach((d: any) => d.linkedRoles.forEach((lr: any) => buRoleIds.add(lr.roleId)))
    return {
      name: p.name, code: p.code, stage: p.stage, health: p.health, unit: p.unit,
      client: clientsFull[p.clientId]?.name ?? "—", owner: people[p.ownerId]?.name ?? "—",
      budget: p.budget, office: p.office, teamSize: buProject?.team ?? "—",
      roles: [...buRoleIds].slice(0, 4).map((id: number) => roles[id]?.name).filter(Boolean),
      connections: neighbourIds.size,
    }
  })() : null

  const PTag = ({ label }: { label: string }) => (
    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 100, background: t.fgAlpha10, color: t.fg, fontFamily: "var(--font-sans), sans-serif", whiteSpace: "nowrap" as const }}>{label}</span>
  )

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden", background: t.bg }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" as const, overflow: "hidden", padding: "24px 0 24px 28px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: t.fg, margin: "0 0 4px", fontFamily: "var(--font-sans), sans-serif" }}>Project Graph</h2>
        <p style={{ fontSize: 13, color: t.mutedFg, margin: "0 0 16px", fontFamily: "var(--font-sans), sans-serif" }}>Click nodes for details, drag to rearrange. Edges = shared team, client, or PM.</p>
        <div ref={containerRef} style={{ flex: 1, position: "relative" as const, overflow: "hidden", minHeight: 0 }}>
          {/* Toolbar */}
          <div style={{ position: "absolute" as const, top: 12, left: 12, right: 12, display: "flex", alignItems: "center", gap: 8, zIndex: 10 }}>
            {/* Stage legend */}
            {(["active","planning","on-hold"] as const).map(s => (
              <button key={s} onClick={() => { const ids = new Set<number>(projects.map((_: any, i: number) => i).filter((i: number) => projects[i].stage === s)); setAgentFilter({ matchIds: ids, response: `${ids.size} ${s} projects` }) }}
                style={{ height: 28, padding: "0 10px", borderRadius: 100, border: `1px solid ${t.border}`, background: t.bg, color: t.mutedFg, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--font-sans), sans-serif" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: STAGE_COLOR[s], display: "inline-block", flexShrink: 0 }} />
                {s.charAt(0).toUpperCase() + s.slice(1).replace("-", " ")}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            {[{ label: "+", action: () => setZoom(z => Math.min(2, +(z + 0.15).toFixed(2))) },
              { label: "−", action: () => setZoom(z => Math.max(0.4, +(z - 0.15).toFixed(2))) },
              { label: <RefreshCw size={13} strokeWidth={1.5} />, action: () => setZoom(1) }].map(({ label, action }, i) => (
              <button key={i} onClick={action} style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${t.border}`, background: t.bg, color: t.mutedFg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontFamily: "var(--font-sans), sans-serif" }}>{label}</button>
            ))}
          </div>
          {/* SVG */}
          <svg ref={svgRef} style={{ position: "absolute" as const, inset: 0, width: "100%", height: "100%", display: "block" }}
            onMouseMove={onSvgMouseMove} onMouseUp={onSvgMouseUp} onMouseLeave={onSvgMouseUp}>
            <g transform={`translate(${dims.w / 2 * (1 - zoom)},${dims.h / 2 * (1 - zoom)}) scale(${zoom})`}>
              <rect x={-9999} y={-9999} width={99999} height={99999} fill="transparent" onClick={() => setSelected(null)} />
              {d3LinksRef.current.map((e, i) => {
                const a = e.source as PGNode, b = e.target as PGNode
                if (a.x == null || b.x == null) return null
                const agentVis = !agentActive || (agentFilter!.matchIds.has(a.id) && agentFilter!.matchIds.has(b.id))
                const isConn = hasSelection && (a.id === selected || b.id === selected)
                const op = !agentVis ? 0.03 : hasSelection ? (isConn ? 0.85 : 0.06) : (edgeDefs[i]?.strength >= 6 ? 0.55 : 0.25)
                return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={isConn ? t.fg : t.border} strokeDasharray={isConn ? undefined : "4 3"}
                  strokeWidth={isConn ? 2 : 1} opacity={op} style={{ pointerEvents: "none" as const }} />
              })}
              {d3NodesRef.current.map(n => {
                if (n.x == null) return null
                const isSel = selected === n.id
                const isNeighbour = neighbourIds.has(n.id)
                const agentMatch = !agentActive || agentFilter!.matchIds.has(n.id)
                const dimmed = !agentMatch || (agentMatch && hasSelection && !isSel && !isNeighbour)
                const stageCol = STAGE_COLOR[n.stage] ?? t.fg
                return (
                  <g key={n.id} style={{ cursor: "pointer" }} opacity={dimmed ? 0.12 : 1}
                    onMouseDown={ev => { ev.stopPropagation(); onNodeMouseDown(ev, n.id) }}
                    onMouseUp={ev => { ev.stopPropagation(); onNodeMouseUp(n.id) }}
                    onClick={ev => ev.stopPropagation()}>
                    {/* Stage ring */}
                    <circle cx={n.x} cy={n.y} r={25} fill="none" stroke={stageCol} strokeWidth={isSel ? 2.5 : 1.5} opacity={isSel ? 1 : 0.7} />
                    <circle cx={n.x} cy={n.y} r={21} fill={t.fg} />
                    <text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="central"
                      fill={t.bg} fontSize={10} fontWeight={600}
                      style={{ userSelect: "none" as const, pointerEvents: "none" as const, fontFamily: "var(--font-sans), sans-serif" }}>
                      {n.initials}
                    </text>
                    <text x={n.x} y={n.y + 34} textAnchor="middle" fill={t.fg} fontSize={10}
                      style={{ userSelect: "none" as const, pointerEvents: "none" as const, fontFamily: "var(--font-sans), sans-serif" }}>
                      {n.name.split(" ")[0]}
                    </text>
                  </g>
                )
              })}
            </g>
          </svg>
          {/* Agent input */}
          <div style={{ position: "absolute" as const, bottom: 16, left: 16, right: 16, zIndex: 10 }}>
            {agentFilter && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 100, background: t.fg, color: t.bg, fontSize: 12, fontFamily: "var(--font-sans), sans-serif", fontWeight: 500 }}>
                  <Layers size={11} strokeWidth={2} />{agentFilter.response}
                  <button onClick={() => { setAgentFilter(null); setAgentInput("") }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: t.bg, opacity: 0.6, padding: 0, display: "flex", alignItems: "center", marginLeft: 2 }}>
                    <X size={12} strokeWidth={2} />
                  </button>
                </div>
              </div>
            )}
            <form onSubmit={ev => { ev.preventDefault(); runQuery(agentInput); setAgentInput("") }}
              style={{ display: "flex", alignItems: "center", gap: 8, background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: "8px 12px", boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}>
              <input value={agentInput} onChange={e => setAgentInput(e.target.value)}
                placeholder="Ask about projects… e.g. 'show at-risk' or 'Jordan projects' or 'over 300k'"
                style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 13, color: t.fg, fontFamily: "var(--font-sans), sans-serif" }} />
              <button type="submit" disabled={!agentInput.trim()}
                style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: agentInput.trim() ? t.fg : t.fgAlpha10, color: agentInput.trim() ? t.bg : t.mutedFg, cursor: agentInput.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.15s" }}>
                <ArrowUp size={13} strokeWidth={2} />
              </button>
            </form>
          </div>
          {/* Footer */}
          <div style={{ position: "absolute" as const, bottom: 88, right: 16, display: "flex", gap: 12 }}>
            <span style={{ fontSize: 12, color: t.mutedFg, display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-sans), sans-serif" }}>
              <Layers size={12} strokeWidth={1.5} /> {agentActive ? `${agentFilter!.matchIds.size}/` : ""}{projects.length} Projects
            </span>
            <span style={{ fontSize: 12, color: t.mutedFg, display: "flex", alignItems: "center", gap: 4, fontFamily: "var(--font-sans), sans-serif" }}>
              <Share2 size={12} strokeWidth={1.5} /> {edgeDefs.length} Links
            </span>
          </div>
        </div>
      </div>
      {/* Right sidebar */}
      <div style={{ width: 288, flexShrink: 0, overflowY: "auto" as const, padding: "24px 24px 24px 16px", display: "flex", flexDirection: "column" as const, gap: 12 }}>
        {/* Graph Stats */}
        <div style={{ border: `1px solid ${t.border}`, borderRadius: 10, padding: "16px 18px", background: t.card }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: t.fg, margin: "0 0 14px", fontFamily: "var(--font-sans), sans-serif" }}>Graph Stats</h3>
          {([["Total Projects", projects.length], ["Active", activeCount], ["At Risk", atRiskCount], ["Total Budget", fmt(totalBudget)]] as [string, any][]).map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${t.fgAlpha06}` }}>
              <span style={{ fontSize: 13, color: t.mutedFg, fontFamily: "var(--font-sans), sans-serif" }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: t.fg, fontFamily: "var(--font-sans), sans-serif" }}>{val}</span>
            </div>
          ))}
        </div>
        {/* Selected Project */}
        <div style={{ border: `1px solid ${t.border}`, borderRadius: 10, padding: "16px 18px", background: t.card }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: t.fg, margin: "0 0 12px", fontFamily: "var(--font-sans), sans-serif" }}>Selected Project</h3>
          {selProject ? (
            <>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: t.fg, fontFamily: "var(--font-sans), sans-serif", lineHeight: 1.3 }}>{selProject.name}</div>
                <div style={{ fontSize: 12, color: t.mutedFg, marginTop: 3, fontFamily: "var(--font-sans), sans-serif" }}>{selProject.code} · {selProject.unit}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" as const }}>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 100, background: STAGE_COLOR[selProject.stage] + "22", color: STAGE_COLOR[selProject.stage], fontWeight: 600, fontFamily: "var(--font-sans), sans-serif", border: `1px solid ${STAGE_COLOR[selProject.stage]}44` }}>
                    {selProject.stage.charAt(0).toUpperCase() + selProject.stage.slice(1).replace("-", " ")}
                  </span>
                  <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 100, background: HEALTH_COLOR[selProject.health] + "22", color: HEALTH_COLOR[selProject.health], fontWeight: 600, fontFamily: "var(--font-sans), sans-serif", border: `1px solid ${HEALTH_COLOR[selProject.health]}44` }}>
                    {selProject.health.replace("-", " ")}
                  </span>
                </div>
              </div>
              {([["Client", selProject.client], ["Owner / PM", selProject.owner], ["Budget", fmt(selProject.budget)], ["Team size", selProject.teamSize], ["Office", selProject.office], ["Connections", selProject.connections]] as [string, any][]).map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${t.fgAlpha06}` }}>
                  <span style={{ fontSize: 12, color: t.mutedFg, fontFamily: "var(--font-sans), sans-serif" }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: t.fg, fontFamily: "var(--font-sans), sans-serif" }}>{val}</span>
                </div>
              ))}
              {selProject.roles.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ ...s.caseTitleCompact, marginBottom: 6 }}>Roles</div>
                  <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 4 }}>{selProject.roles.map((r: string) => <PTag key={r} label={r} />)}</div>
                </div>
              )}
            </>
          ) : (
            <p style={{ fontSize: 12, color: t.mutedFg, margin: 0, fontFamily: "var(--font-sans), sans-serif" }}>Click a node to view details</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Skills Graph ──
const SKILLS_CATEGORIES = [
  { name: "Design", color: "#6366f1", skills: ["Brand Identity","Typography","Visual Design","Figma","Illustration","Art Direction","Motion Design","UI Design","UX Design","Prototyping","Icon Design","Design Systems","Print Design","Packaging"] },
  { name: "Engineering", color: "#10b981", skills: ["React","TypeScript","Next.js","Node.js","GraphQL","CSS/SCSS","Web Accessibility","Performance","APIs","Testing","DevOps","Mobile Dev","CMS Integration","Analytics Tracking"] },
  { name: "Marketing", color: "#f59e0b", skills: ["Campaign Strategy","Paid Media","SEO","Email Marketing","Growth Hacking","CRM","Marketing Automation","Influencer Marketing","Affiliate Marketing","A/B Testing","Conversion Rate Optimisation","Retention Marketing","Product Marketing","Go-to-Market"] },
  { name: "Strategy", color: "#ec4899", skills: ["Brand Strategy","Audience Research","Competitive Analysis","Positioning","Messaging","Market Entry","Innovation Strategy","Business Development","Partnerships","Pricing Strategy","Customer Insights","Journey Mapping","Scenario Planning","OKR Facilitation"] },
  { name: "Content", color: "#14b8a6", skills: ["Copywriting","Content Strategy","Storytelling","Social Media","Video Scripting","Editing","Blog Writing","Brand Voice","Tone of Voice","PR & Comms","Thought Leadership","Community Management","Podcast Production","Newsletter"] },
  { name: "Production", color: "#f97316", skills: ["Video Production","Photography","Sound Design","Post-Production","Studio Management","Retouching","CGI / 3D","AR / VR","Event Production","Print Production","Trafficking","Asset Management","Localisation","QA"] },
  { name: "Analytics", color: "#8b5cf6", skills: ["Data Visualisation","Reporting","Google Analytics","Tableau","SQL","Python","Media Mix Modelling","Attribution","Dashboard Building","Research & Insights","Forecasting","Tag Management","Data Strategy","Experimentation"] },
]

// Map each role to a category and skills for the Skills Graph
const ROLE_SKILLS_EXTENDED: Record<string, { category: string, skills: string[] }> = {
  "Designer":             { category: "Design",       skills: ["Visual Design","Figma","Brand Identity","Typography","Design Systems"] },
  "Senior Designer":      { category: "Design",       skills: ["Art Direction","Visual Design","Figma","Design Systems","Prototyping"] },
  "Developer":            { category: "Engineering",  skills: ["React","TypeScript","Next.js","APIs","CSS/SCSS","Performance"] },
  "Project Manager":      { category: "Strategy",     skills: ["Brand Strategy","OKR Facilitation","Positioning","Journey Mapping"] },
  "Art Director":         { category: "Design",       skills: ["Art Direction","Motion Design","Illustration","Icon Design","Brand Identity"] },
  "Copywriter":           { category: "Content",      skills: ["Copywriting","Brand Voice","Tone of Voice","Content Strategy","Blog Writing"] },
  "Account Executive":    { category: "Strategy",     skills: ["Business Development","Partnerships","Customer Insights","Competitive Analysis"] },
  "Creative Director":    { category: "Design",       skills: ["Art Direction","Brand Identity","Design Systems","UI Design","Prototyping"] },
  "UX/UI Designer":       { category: "Design",       skills: ["UX Design","UI Design","Prototyping","Figma","Research & Insights"] },
  "Motion Designer":      { category: "Production",   skills: ["Motion Design","Video Production","CGI / 3D","AR / VR","Sound Design"] },
  "Brand Strategist":     { category: "Strategy",     skills: ["Brand Strategy","Positioning","Messaging","Audience Research","Competitive Analysis"] },
  "Social Media Manager": { category: "Content",      skills: ["Social Media","Content Strategy","Community Management","Newsletter","Storytelling"] },
}

const EXPERIENCE_INDUSTRIES = [
  { name: "Automotive",      clients: ["Tesla", "Volvo", "Ford", "BMW", "Mercedes-Benz", "Audi"] },
  { name: "Technology",      clients: ["Apple", "Google", "Microsoft", "Spotify", "Airbnb", "Salesforce"] },
  { name: "Fashion",         clients: ["Nike", "Adidas", "Gucci", "Zara", "Levi's", "Burberry"] },
  { name: "Food & Beverage", clients: ["Coca-Cola", "Heineken", "McDonald's", "Nespresso", "Red Bull", "Diageo"] },
  { name: "Finance",         clients: ["Goldman Sachs", "Mastercard", "Revolut", "HSBC", "Barclays", "Amex"] },
  { name: "Retail",          clients: ["Amazon", "IKEA", "Uniqlo", "Sephora", "eBay", "Zalando"] },
]

type SGNode = { id: string, type: "category" | "skill" | "person", label: string, sub: string, r: number, x: number, y: number, fx?: number | null, fy?: number | null }
type SGLink = { source: string | SGNode, target: string | SGNode }

function SkillsGraphView({ people: allEmployees, contractors: allContractors, roles }: any) {
  const [view, setView] = useState<"categories" | "skills" | "people" | "person-skills">("categories")
  const [selCat, setSelCat] = useState<string | null>(null)
  const [selSkill, setSelSkill] = useState<string | null>(null)
  const [selPerson, setSelPerson] = useState<any | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [hoveredAt, setHoveredAt] = useState(0)
  const [transitionStart, setTransitionStart] = useState(0)
  const [selectedOffices, setSelectedOffices] = useState([...ALL_OFFICES])
  const [graphMode, setGraphMode] = useState("skills")
  const [peopleFilter, setPeopleFilter] = useState("employees")
  const [searchQuery, setSearchQuery] = useState("")
  const [profilePerson, setProfilePerson] = useState<any | null>(null)
  const peopleType = graphMode // alias used throughout experience/skills branching
  const rawPeople = peopleFilter === "contractors" ? (allContractors ?? []) : allEmployees
  const people = selectedOffices.length === ALL_OFFICES.length ? rawPeople : rawPeople.filter((p: any) => selectedOffices.includes(p.office))
  const containerRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 800, h: 600 })
  const nodesRef = useRef<SGNode[]>([])
  const linksRef = useRef<SGLink[]>([])
  const simRef = useRef<any>(null)
  const rafRef = useRef<number | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setDims({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  function getRoleData(person: any) {
    const roleName = roles[person.roleId]?.name ?? ""
    return ROLE_SKILLS_EXTENDED[roleName] ?? { category: "Strategy", skills: [] }
  }

  function getPersonClients(person: any): string[] {
    const allClients = EXPERIENCE_INDUSTRIES.flatMap(ind => ind.clients)
    let seed = person.name.split("").reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0)
    const count = 2 + (seed % 3)
    const indices = new Set<number>()
    while (indices.size < count) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff
      indices.add(seed % allClients.length)
    }
    return Array.from(indices).map(i => allClients[i])
  }

  // Parse natural language search into matched skill/experience tokens
  const searchTokens: { type: "skill" | "industry" | "client", name: string }[] = []
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase()
    for (const cat of SKILLS_CATEGORIES) {
      for (const skill of cat.skills) {
        if (q.includes(skill.toLowerCase()) && !searchTokens.find(t => t.name === skill)) {
          searchTokens.push({ type: "skill", name: skill })
        }
      }
    }
    for (const ind of EXPERIENCE_INDUSTRIES) {
      if (q.includes(ind.name.toLowerCase()) && !searchTokens.find(t => t.name === ind.name)) {
        searchTokens.push({ type: "industry", name: ind.name })
      }
      for (const client of ind.clients) {
        if (q.includes(client.toLowerCase()) && !searchTokens.find(t => t.name === client)) {
          searchTokens.push({ type: "client", name: client })
        }
      }
    }
  }
  const isSearchMode = searchTokens.length > 0

  // Build nodes + links for current view
  useEffect(() => {
    const w = dims.w, h = dims.h
    if (w < 10 || h < 10) return
    simRef.current?.stop()
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    let nodes: SGNode[] = []
    let links: SGLink[] = []

    if (isSearchMode) {
      // Token nodes — skills on one side, experience on the other
      const skillToks = searchTokens.filter(t => t.type === "skill")
      const expToks = searchTokens.filter(t => t.type !== "skill")
      const tokenNodes: SGNode[] = searchTokens.map((tok, i) => {
        const isSkill = tok.type === "skill"
        const angle = isSkill
          ? (-Math.PI / 2) + (skillToks.indexOf(tok) - (skillToks.length - 1) / 2) * 0.6
          : (Math.PI / 2) + (expToks.indexOf(tok) - (expToks.length - 1) / 2) * 0.6
        const r0 = Math.min(w, h) * 0.28
        return { id: `tok-${tok.name}`, type: "skill" as const, label: tok.name, sub: tok.type === "skill" ? "skill" : "experience", r: 30, x: w/2 + Math.cos(angle)*r0, y: h/2 + Math.sin(angle)*r0 }
      })
      // Match people who satisfy ALL tokens
      const matchingPeople = people.filter((p: any) => {
        const rd = getRoleData(p); const pc = getPersonClients(p)
        return searchTokens.every(tok => {
          if (tok.type === "skill") return rd.skills.includes(tok.name)
          if (tok.type === "client") return pc.includes(tok.name)
          const ind = EXPERIENCE_INDUSTRIES.find(i => i.name === tok.name)
          return ind ? ind.clients.some((c: string) => pc.includes(c)) : false
        })
      })
      const personNodes: SGNode[] = matchingPeople.map((p: any, i: number) => {
        const initials = p.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)
        const angle = (i / Math.max(matchingPeople.length, 1)) * Math.PI * 2
        return { id: p.name, type: "person" as const, label: initials, sub: roles[p.roleId]?.name ?? "", r: 22, x: w/2 + Math.cos(angle) * 80, y: h/2 + Math.sin(angle) * 80 }
      })
      nodes = [...tokenNodes, ...personNodes]
      links = personNodes.flatMap(pn => {
        const person = matchingPeople.find((p: any) => p.name === pn.id)
        if (!person) return []
        const rd = getRoleData(person); const pc = getPersonClients(person)
        return searchTokens
          .filter(tok => {
            if (tok.type === "skill") return rd.skills.includes(tok.name)
            if (tok.type === "client") return pc.includes(tok.name)
            const ind = EXPERIENCE_INDUSTRIES.find(i => i.name === tok.name)
            return ind ? ind.clients.some((c: string) => pc.includes(c)) : false
          })
          .map(tok => ({ source: `tok-${tok.name}`, target: pn.id }))
      })
    } else if (peopleType === "experience") {
      // Experience mode: industries → clients → people
      if (view === "categories") {
        const counts = EXPERIENCE_INDUSTRIES.map(ind => people.filter((p: any) => getPersonClients(p).some((c: string) => ind.clients.includes(c))).length)
        const maxCount = Math.max(...counts, 1)
        nodes = EXPERIENCE_INDUSTRIES.map((ind, i) => {
          const angle = (i / EXPERIENCE_INDUSTRIES.length) * Math.PI * 2 - Math.PI / 2
          const r0 = Math.min(w, h) * 0.06
          const r = 24 + (counts[i] / maxCount) * 32
          return { id: ind.name, type: "category" as const, label: ind.name, sub: `${ind.clients.length} clients`, r, x: w/2 + Math.cos(angle)*r0, y: h/2 + Math.sin(angle)*r0 }
        })
      } else if (view === "skills" && selCat) {
        const indDef = EXPERIENCE_INDUSTRIES.find(i => i.name === selCat)!
        const centerNode: SGNode = { id: selCat, type: "category", label: selCat, sub: "", r: 44, x: w/2, y: h/2 }
        const clientNodes: SGNode[] = indDef.clients.map((client, i) => {
          const count = people.filter((p: any) => getPersonClients(p).includes(client)).length
          const angle = (i / indDef.clients.length) * Math.PI * 2
          const r0 = Math.min(w, h) * 0.3
          return { id: client, type: "skill" as const, label: client, sub: count > 0 ? `${count}` : "—", r: count > 0 ? 22 + count * 3 : 18, x: w/2 + Math.cos(angle)*r0, y: h/2 + Math.sin(angle)*r0 }
        })
        nodes = [centerNode, ...clientNodes]
        links = clientNodes.map(c => ({ source: selCat, target: c.id }))
      } else if (view === "people" && selSkill) {
        const matching = people.filter((p: any) => getPersonClients(p).includes(selSkill))
        const centerNode: SGNode = { id: selSkill, type: "skill", label: selSkill, sub: `${matching.length} people`, r: 36, x: w/2, y: h/2 }
        const personNodes: SGNode[] = matching.map((p: any, i: number) => {
          const initials = p.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)
          const angle = (i / Math.max(matching.length, 1)) * Math.PI * 2
          const r0 = Math.min(w, h) * 0.28
          return { id: p.name, type: "person" as const, label: initials, sub: roles[p.roleId]?.name ?? "", r: 22, x: w/2 + Math.cos(angle)*r0, y: h/2 + Math.sin(angle)*r0 }
        })
        nodes = [centerNode, ...personNodes]
        links = personNodes.map(n => ({ source: selSkill, target: n.id }))
      }
    } else if (view === "categories") {
      const peopleCounts = SKILLS_CATEGORIES.map(cat => people.filter((p: any) => getRoleData(p).category === cat.name).length)
      const maxPeople = Math.max(...peopleCounts, 1)
      nodes = SKILLS_CATEGORIES.map((cat, i) => {
        const angle = (i / SKILLS_CATEGORIES.length) * Math.PI * 2 - Math.PI / 2
        const r0 = Math.min(w, h) * 0.06
        const r = 24 + (peopleCounts[i] / maxPeople) * 32
        return { id: cat.name, type: "category" as const, label: cat.name, sub: `${cat.skills.length} skills`, r, x: w/2 + Math.cos(angle)*r0, y: h/2 + Math.sin(angle)*r0 }
      })
    } else if (view === "skills" && selCat) {
      const catDef = SKILLS_CATEGORIES.find(c => c.name === selCat)!
      const centerNode: SGNode = { id: selCat, type: "category", label: selCat, sub: "", r: 44, x: w/2, y: h/2 }
      const skillNodes: SGNode[] = catDef.skills.map((skill, i) => {
        const count = people.filter((p: any) => getRoleData(p).skills.includes(skill)).length
        const angle = (i / catDef.skills.length) * Math.PI * 2
        const r0 = Math.min(w, h) * 0.3
        return { id: skill, type: "skill" as const, label: skill, sub: count > 0 ? `${count}` : "—", r: count > 0 ? 22 + count * 3 : 18, x: w/2 + Math.cos(angle)*r0, y: h/2 + Math.sin(angle)*r0 }
      })
      nodes = [centerNode, ...skillNodes]
      links = skillNodes.map(s => ({ source: selCat, target: s.id }))
    } else if (view === "people" && selSkill) {
      const matching = people.filter((p: any) => getRoleData(p).skills.includes(selSkill))
      const centerNode: SGNode = { id: selSkill, type: "skill", label: selSkill, sub: `${matching.length} people`, r: 36, x: w/2, y: h/2 }
      const personNodes: SGNode[] = matching.map((p: any, i: number) => {
        const initials = p.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)
        const angle = (i / matching.length) * Math.PI * 2
        const r0 = Math.min(w, h) * 0.28
        return { id: p.name, type: "person" as const, label: initials, sub: roles[p.roleId]?.name ?? "", r: 22, x: w/2 + Math.cos(angle)*r0, y: h/2 + Math.sin(angle)*r0 }
      })
      nodes = [centerNode, ...personNodes]
      links = personNodes.map(n => ({ source: selSkill, target: n.id }))
    } else if (view === "person-skills" && selPerson) {
      const roleData = getRoleData(selPerson)
      const initials = selPerson.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)
      const centerNode: SGNode = { id: selPerson.name, type: "person", label: initials, sub: roles[selPerson.roleId]?.name ?? "", r: 36, x: w/2, y: h/2 }
      const skillNodes: SGNode[] = roleData.skills.map((skill: string, i: number) => {
        const angle = (i / roleData.skills.length) * Math.PI * 2
        const r0 = Math.min(w, h) * 0.28
        return { id: `ps-${skill}`, type: "skill" as const, label: skill, sub: "", r: 20, x: w/2 + Math.cos(angle)*r0, y: h/2 + Math.sin(angle)*r0 }
      })
      nodes = [centerNode, ...skillNodes]
      links = skillNodes.map(s => ({ source: selPerson.name, target: s.id }))
    }

    nodesRef.current = nodes
    linksRef.current = links
    setTransitionStart(Date.now())

    const isCategory = view === "categories"

    // For non-category views, start nodes at centre so they burst outward
    if (!isCategory) {
      nodes.forEach(n => { n.x = w/2 + (Math.random()-0.5)*40; n.y = h/2 + (Math.random()-0.5)*40 })
    }

    const sim = forceSimulation<SGNode>(nodes)
      .force("link", forceLink<SGNode, SGLink>(links).id((d: any) => d.id).distance((d: any) => {
        const s = d.source as SGNode, tg = d.target as SGNode
        return s.r + tg.r + (isCategory ? 4 : 28)
      }).strength(isCategory ? 0.3 : 0.9))
      .force("charge", forceManyBody().strength(isCategory ? -80 : -350))
      .force("center", forceCenter(w/2, h/2).strength(isCategory ? 1.5 : 0.4))
      .force("collide", forceCollide<SGNode>((d) => d.r + (isCategory ? 1 : 12)))

    simRef.current = sim

    // For category view: run warm-up ticks for a tight settled start, then float
    if (isCategory) sim.stop().tick(500).alphaTarget(0.35).alphaDecay(0.0008).velocityDecay(0.3).restart()
    // For drill-down views: burst from centre with high alpha, decay to gentle drift
    else sim.alpha(1).alphaTarget(0.01).alphaDecay(0.018).restart()

    function loop() {
      setTick(k => k + 1)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      sim.stop()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [view, selCat, selSkill, selPerson?.name, dims.w, dims.h, people.length, graphMode, peopleFilter, searchQuery])

  const nodes = nodesRef.current
  const links = linksRef.current
  const sidebarW = 260

  function renderPersonRow(p: any) {
    const initials = p.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)
    const isSelected = profilePerson?.name === p.name
    return (
      <div key={p.name} onClick={() => setProfilePerson(prev => prev?.name === p.name ? null : p)}
        style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: "6px 8px", borderRadius: 6, cursor: "pointer", background: isSelected ? t.fgAlpha10 : "transparent", border: `1px solid ${isSelected ? t.border : "transparent"}`, transition: "background 0.15s" }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: t.fgAlpha10, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: t.fg, flexShrink: 0, fontFamily: "var(--font-sans), sans-serif" }}>{initials}</div>
        <div>
          <div style={{ fontSize: 13, color: t.fg, fontFamily: "var(--font-sans), sans-serif" }}>{p.name}</div>
          <div style={{ fontSize: 11, color: t.mutedFg, fontFamily: "var(--font-sans), sans-serif" }}>{roles[p.roleId]?.name ?? ""}</div>
        </div>
      </div>
    )
  }

  function renderSidebar() {
    if (isSearchMode) {
      const skillToks = searchTokens.filter(t => t.type === "skill")
      const expToks = searchTokens.filter(t => t.type !== "skill")
      const matchingPeople = people.filter((p: any) => {
        const rd = getRoleData(p); const pc = getPersonClients(p)
        return searchTokens.every(tok => {
          if (tok.type === "skill") return rd.skills.includes(tok.name)
          if (tok.type === "client") return pc.includes(tok.name)
          const ind = EXPERIENCE_INDUSTRIES.find(i => i.name === tok.name)
          return ind ? ind.clients.some((c: string) => pc.includes(c)) : false
        })
      })
      return (
        <>
          <div style={{ ...s.caseTitle, marginBottom: 10 }}>Search filters</div>
          {skillToks.length > 0 && <>
            <div style={{ fontSize: 10, color: t.mutedFg, marginBottom: 6, fontFamily: "var(--font-sans), sans-serif" }}>Skills</div>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 4, marginBottom: 12 }}>
              {skillToks.map(tok => <span key={tok.name} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, border: `1px solid ${t.border}`, color: t.fg, background: t.fgAlpha10, fontFamily: "var(--font-sans), sans-serif" }}>{tok.name}</span>)}
            </div>
          </>}
          {expToks.length > 0 && <>
            <div style={{ fontSize: 10, color: t.mutedFg, marginBottom: 6, fontFamily: "var(--font-sans), sans-serif" }}>Experience</div>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 4, marginBottom: 12 }}>
              {expToks.map(tok => <span key={tok.name} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, border: `1px solid ${t.border}`, color: t.fg, background: t.fgAlpha10, fontFamily: "var(--font-sans), sans-serif" }}>{tok.name}</span>)}
            </div>
          </>}
          <div style={{ borderTop: `1px solid ${t.border}`, margin: "8px 0 12px" }}/>
          <div style={{ ...s.caseTitle, marginBottom: 10 }}>{matchingPeople.length} {matchingPeople.length === 1 ? "person" : "people"}</div>
          {matchingPeople.length === 0
            ? <div style={{ fontSize: 12, color: t.mutedFg, fontFamily: "var(--font-sans), sans-serif" }}>No matches — try broadening your search</div>
            : matchingPeople.map((p: any) => renderPersonRow(p))
          }
        </>
      )
    }
    if (peopleType === "experience") {
      if (view === "categories") {
        const totalClients = EXPERIENCE_INDUSTRIES.reduce((s, i) => s + i.clients.length, 0)
        return (
          <>
            <div style={{ ...s.caseTitle, marginBottom: 12 }}>Overview</div>
            {[["Industries", EXPERIENCE_INDUSTRIES.length], ["Total Clients", totalClients], ["Total People", people.length]].map(([label, val]) => (
              <div key={label as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: t.mutedFg, fontFamily: "var(--font-sans), sans-serif" }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: t.fg, fontFamily: "var(--font-sans), sans-serif" }}>{val}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${t.border}`, margin: "16px 0" }}/>
            <div style={{ ...s.caseTitle, marginBottom: 12 }}>By Industry</div>
            {EXPERIENCE_INDUSTRIES.map(ind => {
              const count = people.filter((p: any) => getPersonClients(p).some((c: string) => ind.clients.includes(c))).length
              return (
                <div key={ind.name} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: t.fg, fontFamily: "var(--font-sans), sans-serif" }}>{ind.name}</span>
                    <span style={{ fontSize: 12, color: t.mutedFg, fontFamily: "var(--font-sans), sans-serif" }}>{count}</span>
                  </div>
                  <div style={{ height: 3, borderRadius: 2, background: t.border }}>
                    <div style={{ height: 3, borderRadius: 2, background: t.fg, opacity: 0.5, width: people.length > 0 ? `${Math.round((count / people.length) * 100)}%` : "0%" }}/>
                  </div>
                </div>
              )
            })}
          </>
        )
      }
      if (view === "skills" && selCat) {
        const indDef = EXPERIENCE_INDUSTRIES.find(i => i.name === selCat)!
        const clientCounts = indDef.clients.map(c => ({ name: c, count: people.filter((p: any) => getPersonClients(p).includes(c)).length })).sort((a,b) => b.count - a.count)
        const maxCount = Math.max(...clientCounts.map(c => c.count), 1)
        return (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.fg, marginBottom: 4, fontFamily: "var(--font-sans), sans-serif" }}>{selCat}</div>
            <div style={{ fontSize: 11, color: t.mutedFg, marginBottom: 16, fontFamily: "var(--font-sans), sans-serif" }}>{indDef.clients.length} clients — click a node</div>
            {clientCounts.map(c => (
              <div key={c.name} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 12, color: t.fg, fontFamily: "var(--font-sans), sans-serif" }}>{c.name}</span>
                  <span style={{ fontSize: 12, color: t.mutedFg, fontFamily: "var(--font-sans), sans-serif" }}>{c.count}</span>
                </div>
                <div style={{ height: 3, borderRadius: 2, background: t.border }}>
                  <div style={{ height: 3, borderRadius: 2, background: t.fg, opacity: 0.5, width: c.count > 0 ? `${Math.round((c.count / maxCount) * 100)}%` : "0%" }}/>
                </div>
              </div>
            ))}
          </>
        )
      }
      if (view === "people" && selSkill) {
        const matching = people.filter((p: any) => getPersonClients(p).includes(selSkill))
        return (
          <>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.fg, marginBottom: 4, fontFamily: "var(--font-sans), sans-serif" }}>{selSkill}</div>
            <div style={{ ...s.caseTitle, marginBottom: 12 }}>{matching.length} People</div>
            {matching.map((p: any) => renderPersonRow(p))}
          </>
        )
      }
      return null
    }

    if (view === "categories") {
      const totalSkills = SKILLS_CATEGORIES.reduce((s, c) => s + c.skills.length, 0)
      return (
        <>
          <div style={{ ...s.caseTitle, marginBottom: 12 }}>Overview</div>
          {[["Categories", SKILLS_CATEGORIES.length], ["Total Skills", totalSkills], ["Total People", people.length]].map(([label, val]) => (
            <div key={label as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: t.mutedFg, fontFamily: "var(--font-sans), sans-serif" }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: t.fg, fontFamily: "var(--font-sans), sans-serif" }}>{val}</span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${t.border}`, margin: "16px 0" }}/>
          <div style={{ ...s.caseTitle, marginBottom: 12 }}>Headcount</div>
          {SKILLS_CATEGORIES.map(cat => {
            const count = people.filter((p: any) => getRoleData(p).category === cat.name).length
            return (
              <div key={cat.name} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 12, color: t.fg, fontFamily: "var(--font-sans), sans-serif" }}>{cat.name}</span>
                  <span style={{ fontSize: 12, color: t.mutedFg, fontFamily: "var(--font-sans), sans-serif" }}>{count}</span>
                </div>
                <div style={{ height: 3, borderRadius: 2, background: t.border }}>
                  <div style={{ height: 3, borderRadius: 2, background: t.fg, opacity: 0.5, width: `${Math.round((count / people.length) * 100)}%` }}/>
                </div>
              </div>
            )
          })}
        </>
      )
    }
    if (view === "skills" && selCat) {
      const catDef = SKILLS_CATEGORIES.find(c => c.name === selCat)!
      const skillCounts = catDef.skills.map(s => ({ name: s, count: people.filter((p: any) => getRoleData(p).skills.includes(s)).length })).sort((a,b) => b.count - a.count)
      const maxCount = Math.max(...skillCounts.map(s => s.count), 1)
      return (
        <>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.fg, marginBottom: 4, fontFamily: "var(--font-sans), sans-serif" }}>{selCat}</div>
          <div style={{ fontSize: 11, color: t.mutedFg, marginBottom: 16, fontFamily: "var(--font-sans), sans-serif" }}>{catDef.skills.length} skills — click a node</div>
          {skillCounts.map(s => (
            <div key={s.name} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 12, color: t.fg, fontFamily: "var(--font-sans), sans-serif" }}>{s.name}</span>
                <span style={{ fontSize: 12, color: t.mutedFg, fontFamily: "var(--font-sans), sans-serif" }}>{s.count}</span>
              </div>
              <div style={{ height: 3, borderRadius: 2, background: t.border }}>
                <div style={{ height: 3, borderRadius: 2, background: t.fg, opacity: 0.5, width: s.count > 0 ? `${Math.round((s.count / maxCount) * 100)}%` : "0%" }}/>
              </div>
            </div>
          ))}
        </>
      )
    }
    if (view === "people" && selSkill) {
      const matching = people.filter((p: any) => getRoleData(p).skills.includes(selSkill))
      return (
        <>
          <div style={{ fontSize: 13, fontWeight: 600, color: t.fg, marginBottom: 4, fontFamily: "var(--font-sans), sans-serif" }}>{selSkill}</div>
          <div style={{ ...s.caseTitle, marginBottom: 12 }}>{matching.length} People</div>
          {matching.map((p: any) => renderPersonRow(p))}
        </>
      )
    }
    if (view === "person-skills" && selPerson) {
      const roleData = getRoleData(selPerson)
      const initials = selPerson.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)
      return (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${t.border}` }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: t.fgAlpha10, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: t.fg, flexShrink: 0, fontFamily: "var(--font-sans), sans-serif" }}>{initials}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: t.fg, fontFamily: "var(--font-sans), sans-serif" }}>{selPerson.name}</div>
              <div style={{ fontSize: 12, color: t.mutedFg, fontFamily: "var(--font-sans), sans-serif" }}>{roles[selPerson.roleId]?.name ?? ""}</div>
            </div>
          </div>
          <div style={{ ...s.caseTitle, marginBottom: 10 }}>{roleData.skills.length} Skills</div>
          {roleData.skills.map((skill: string) => (
            <div key={skill} style={{ fontSize: 12, color: t.fg, padding: "7px 0", borderBottom: `1px solid ${t.border}`, fontFamily: "var(--font-sans), sans-serif" }}>{skill}</div>
          ))}
        </>
      )
    }
    return null
  }

  return (
    <div style={{ display: "flex", flex: 1, flexDirection: "column", height: "100%", overflow: "hidden", background: t.bg }}>
      <SectionHeader label="Skills graph"/>
      <div style={{ display: "flex", alignItems: "center", padding: "0 24px 12px", gap: 4 }}>
        <OfficeFilter selected={selectedOffices} onChange={setSelectedOffices}/>
        <div style={{ width: 1, height: 16, background: t.fgAlpha30, margin: "0 10px" }}/>
        {[["skills","Skills"],["experience","Experience"]].map(([v,l]) => (
          <TabBtn key={v} active={graphMode === v} onClick={() => { setGraphMode(v); setView("categories"); setSelCat(null); setSelSkill(null); setSelPerson(null) }} activeColor={t.fgAlpha30} activeBg={t.fgAlpha10} mutedColor={t.secondaryFg} bg={t.bg} borderColor={t.border}>
            <Circle size={10} strokeWidth={1} style={{ fill: graphMode === v ? t.fg : "none" }}/>{l}
          </TabBtn>
        ))}
        <div style={{ width: 1, height: 16, background: t.fgAlpha30, margin: "0 10px" }}/>
        {[["employees","Employees"],["contractors","Contractors"]].map(([v,l]) => (
          <TabBtn key={v} active={peopleFilter === v} onClick={() => { setPeopleFilter(v) }} activeColor={t.fgAlpha30} activeBg={t.fgAlpha10} mutedColor={t.secondaryFg} bg={t.bg} borderColor={t.border}>
            <Circle size={10} strokeWidth={1} style={{ fill: peopleFilter === v ? t.fg : "none" }}/>{l}
          </TabBtn>
        ))}
      </div>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <div ref={containerRef} style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* Drill-down back button + hint */}
        <div style={{ position: "absolute", top: 16, left: 16, zIndex: 10, display: "flex", alignItems: "center", gap: 8 }}>
          {view !== "categories" && (
            <button onClick={() => {
              if (view === "person-skills") { setView("people"); setSelPerson(null) }
              else if (view === "people") { setView("skills"); setSelSkill(null) }
              else { setView("categories"); setSelCat(null) }
            }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, border: `1px solid ${t.border}`, background: t.card, color: t.fg, cursor: "pointer", fontSize: 13, fontFamily: "var(--font-sans), sans-serif" }}>
              <ChevronLeft size={14} strokeWidth={1.5}/>
              {view === "person-skills" ? selSkill : view === "people" ? selCat : peopleType === "experience" ? "All industries" : "All categories"}
            </button>
          )}
          <span style={{ fontSize: 13, color: t.mutedFg, fontFamily: "var(--font-sans), sans-serif" }}>
            {view === "categories" && peopleType === "experience" && "Click an industry to explore clients"}
            {view === "categories" && peopleType !== "experience" && "Click a category to explore skills"}
            {view === "skills" && peopleType === "experience" && `${EXPERIENCE_INDUSTRIES.find(i=>i.name===selCat)?.clients.length} clients — click a node`}
            {view === "skills" && peopleType !== "experience" && `${SKILLS_CATEGORIES.find(c=>c.name===selCat)?.skills.length} skills — click a node`}
            {view === "people" && `${nodes.filter(n => n.type === "person").length} people`}
            {view === "person-skills" && selPerson && `${getRoleData(selPerson).skills.length} skills`}
          </span>
        </div>

        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <style>{`
              @keyframes sg-float-0 { 0%,100%{transform:translate(0px,0px)} 33%{transform:translate(6px,-9px)} 66%{transform:translate(-5px,7px)} }
              @keyframes sg-float-1 { 0%,100%{transform:translate(0px,0px)} 33%{transform:translate(-8px,6px)} 66%{transform:translate(7px,-5px)} }
              @keyframes sg-float-2 { 0%,100%{transform:translate(0px,0px)} 33%{transform:translate(5px,8px)} 66%{transform:translate(-6px,-6px)} }
              @keyframes sg-float-3 { 0%,100%{transform:translate(0px,0px)} 33%{transform:translate(-7px,-5px)} 66%{transform:translate(8px,4px)} }
              @keyframes sg-float-4 { 0%,100%{transform:translate(0px,0px)} 33%{transform:translate(9px,4px)} 66%{transform:translate(-4px,-8px)} }
              @keyframes sg-float-5 { 0%,100%{transform:translate(0px,0px)} 33%{transform:translate(-6px,9px)} 66%{transform:translate(5px,-4px)} }
              @keyframes sg-float-6 { 0%,100%{transform:translate(0px,0px)} 33%{transform:translate(4px,-7px)} 66%{transform:translate(-9px,5px)} }
            `}</style>
            <filter id="sg-glow">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <rect x={-9999} y={-9999} width={99999} height={99999} fill="transparent"/>

          {/* Edges */}
          {links.map((lk, i) => {
            const s = lk.source as SGNode, tg = lk.target as SGNode
            if (!s.x || !tg.x) return null
            const isHov = hovered === tg.id || hovered === s.id
            return (
              <line key={i} x1={s.x} y1={s.y} x2={tg.x} y2={tg.y}
                stroke={t.fg} strokeWidth={isHov ? 2 : 1}
                opacity={isHov ? 0.5 : 0.2}
                style={{ transition: "opacity 0.2s, stroke-width 0.2s" }}/>
            )
          })}

          {/* Nodes */}
          {nodes.map((n, ni) => {
            const isHov = hovered === n.id
            const isCenterNode = (view === "skills" && n.id === selCat) || (view === "people" && n.id === selSkill)
            const isProfileSelected = n.type === "person" && profilePerson?.name === n.id
            const fillOpacity = isCenterNode ? 0.18 : isProfileSelected ? 0.22 : isHov ? 0.14 : 0.06
            const strokeOpacity = isCenterNode ? 1 : isProfileSelected ? 1 : isHov ? 0.9 : 0.5
            const cursor = n.type === "category" ? "pointer"
              : n.type === "skill" && n.sub !== "—" ? "pointer"
              : n.type === "person" ? "pointer"
              : "default"
            // Staggered fade-in on transition
            const elapsed = (Date.now() - transitionStart) / 1000
            const delay = isCenterNode ? 0 : ni * 0.04
            const fadeIn = view === "categories" ? 1 : Math.min(1, Math.max(0, (elapsed - delay) / 0.3))

            return (
              <g key={n.id} transform={`translate(${n.x},${n.y})`}
                style={{ cursor, opacity: fadeIn }}
                onMouseEnter={() => { setHovered(n.id); setHoveredAt(Date.now()) }}
                onMouseLeave={() => { setHovered(null) }}
                onClick={() => {
                  if (n.type === "category") { setSelCat(n.id); setView("skills") }
                  else if (n.type === "skill" && n.sub !== "—") { setSelSkill(n.id); setView("people") }
                  else if (n.type === "person") {
                    const allPool = [...allEmployees, ...(allContractors ?? [])]
                    const person = allPool.find((p: any) => p.name === n.id)
                    setProfilePerson(prev => prev?.name === n.id ? null : (person ?? null))
                  }
                }}>
              <g style={view === "categories" ? {
                animation: `sg-float-${ni % 7} ${4.5 + ni * 0.7}s ease-in-out infinite`,
                animationDelay: `${-ni * 0.9}s`,
              } : {}}>
                {isCenterNode && <circle cx={0} cy={0} r={n.r + 8} fill="none" stroke={t.fg} strokeWidth={0.5} opacity={0.2}/>}
                <circle cx={0} cy={0} r={n.r}
                  fill={t.fg} fillOpacity={fillOpacity}
                  stroke={t.fg} strokeOpacity={strokeOpacity} strokeWidth={1}
                  filter={isCenterNode || isHov ? "url(#sg-glow)" : undefined}
                  style={{ transition: "fill-opacity 0.2s, stroke-opacity 0.2s" }}/>
                {n.type === "person" ? (
                  <text x={0} y={5} textAnchor="middle" fill={t.fg} fillOpacity={0.9} fontSize={11} fontWeight={600} fontFamily="var(--font-sans), sans-serif">{n.label}</text>
                ) : (
                  <>
                    <text x={0} y={n.sub ? -4 : 5} textAnchor="middle" fill={t.fg} fillOpacity={isHov || isCenterNode ? 1 : 0.75} fontSize={n.r > 32 ? 13 : 11} fontWeight={600} fontFamily="var(--font-sans), sans-serif">{n.label}</text>
                    {n.sub && <text x={0} y={12} textAnchor="middle" fill={t.fg} fillOpacity={0.4} fontSize={10} fontFamily="var(--font-sans), sans-serif">{n.sub}</text>}
                  </>
                )}
              </g>
              </g>
            )
          })}

          {/* Hover skill previews — float in on category hover */}
          {view === "categories" && hovered && (() => {
            const hovNode = nodes.find(n => n.id === hovered)
            const catDef = SKILLS_CATEGORIES.find(c => c.name === hovered)
            if (!hovNode || !catDef) return null
            const preview = catDef.skills.slice(0, 5)
            const elapsed = (Date.now() - hoveredAt) / 1000
            return preview.map((skill, i) => {
              const angle = (i / preview.length) * Math.PI * 2 - Math.PI / 2
              const dist = hovNode.r + 52 + i * 4
              const tx = hovNode.x + Math.cos(angle) * dist
              const ty = hovNode.y + Math.sin(angle) * dist
              const delay = i * 0.06
              const progress = Math.min(1, Math.max(0, (elapsed - delay) / 0.25))
              const eased = 1 - Math.pow(1 - progress, 3)
              const cx2 = hovNode.x + Math.cos(angle) * dist * eased
              const cy2 = hovNode.y + Math.sin(angle) * dist * eased
              return (
                <g key={skill} opacity={eased} style={{ pointerEvents: "none" }}>
                  <line x1={hovNode.x} y1={hovNode.y} x2={cx2} y2={cy2} stroke={t.fg} strokeWidth={0.5} opacity={0.2 * eased}/>
                  <rect x={cx2 - 38} y={cy2 - 10} width={76} height={20} rx={10} fill={t.fg} fillOpacity={0.07} stroke={t.fg} strokeOpacity={0.25} strokeWidth={0.8}/>
                  <text x={cx2} y={cy2 + 5} textAnchor="middle" fill={t.fg} fillOpacity={0.7 * eased} fontSize={10} fontFamily="var(--font-sans), sans-serif">{skill}</text>
                </g>
              )
            })
          })()}
        </svg>

        {/* Search bar */}
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, boxShadow: `0 4px 24px rgba(0,0,0,0.18)`, minWidth: 320, maxWidth: 560 }}>
          <Search size={14} strokeWidth={1.5} style={{ color: t.mutedFg, flexShrink: 0 }}/>
          {searchTokens.map(tok => (
            <span key={tok.name} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, padding: "2px 8px", borderRadius: 99, border: `1px solid ${t.border}`, background: t.fgAlpha10, color: t.fg, whiteSpace: "nowrap" as const, fontFamily: "var(--font-sans), sans-serif" }}>
              {tok.name}
              <span onClick={() => setSearchQuery(searchQuery.replace(new RegExp(tok.name, "gi"), "").trim())} style={{ cursor: "pointer", opacity: 0.5, marginLeft: 2, lineHeight: 1 }}>×</span>
            </span>
          ))}
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search skills + experience… e.g. Figma and Fashion"
            style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 13, color: t.fg, fontFamily: "var(--font-sans), sans-serif", minWidth: 160 }}
          />
          {searchQuery && <span onClick={() => setSearchQuery("")} style={{ cursor: "pointer", color: t.mutedFg, fontSize: 16, lineHeight: 1, flexShrink: 0 }}>×</span>}
        </div>
      </div>

      <div style={{ width: sidebarW, borderLeft: `1px solid ${t.border}`, padding: 16, overflowY: "auto", flexShrink: 0 }}>
        {renderSidebar()}
      </div>

      {/* Person profile panel */}
      <div style={{ width: profilePerson ? 280 : 0, overflow: "hidden", borderLeft: profilePerson ? `1px solid ${t.border}` : "none", flexShrink: 0, transition: "width 0.22s ease", background: t.bg }}>
        {profilePerson && (() => {
          const rd = getRoleData(profilePerson)
          const clients = getPersonClients(profilePerson)
          const initials = profilePerson.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)
          const clientsByIndustry = EXPERIENCE_INDUSTRIES.map(ind => ({
            industry: ind.name,
            clients: ind.clients.filter((c: string) => clients.includes(c))
          })).filter(g => g.clients.length > 0)
          return (
            <div style={{ width: 280, padding: 16, overflowY: "auto" as const, height: "100%" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: t.fgAlpha10, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 600, color: t.fg, flexShrink: 0, fontFamily: "var(--font-sans), sans-serif" }}>{initials}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.fg, fontFamily: "var(--font-sans), sans-serif" }}>{profilePerson.name}</div>
                    <div style={{ fontSize: 12, color: t.mutedFg, fontFamily: "var(--font-sans), sans-serif" }}>{roles[profilePerson.roleId]?.name ?? ""}</div>
                    {profilePerson.office && <div style={{ fontSize: 11, color: t.mutedFg, marginTop: 2, fontFamily: "var(--font-sans), sans-serif" }}>{profilePerson.office}</div>}
                  </div>
                </div>
                <button onClick={() => setProfilePerson(null)} style={{ background: "none", border: "none", cursor: "pointer", color: t.mutedFg, padding: 2, lineHeight: 1, fontSize: 16 }}>×</button>
              </div>

              <div style={{ ...s.caseTitle, marginBottom: 8 }}>Skills</div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 4, marginBottom: 20 }}>
                {rd.skills.map((skill: string) => (
                  <span key={skill} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, border: `1px solid ${t.border}`, color: t.fg, background: t.fgAlpha10, fontFamily: "var(--font-sans), sans-serif" }}>{skill}</span>
                ))}
              </div>

              <div style={{ ...s.caseTitle, marginBottom: 8 }}>Experience</div>
              {clientsByIndustry.map(g => (
                <div key={g.industry} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: t.mutedFg, marginBottom: 5, fontFamily: "var(--font-sans), sans-serif" }}>{g.industry}</div>
                  <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 4 }}>
                    {g.clients.map((c: string) => (
                      <span key={c} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, border: `1px solid ${t.border}`, color: t.fg, background: t.fgAlpha10, fontFamily: "var(--font-sans), sans-serif" }}>{c}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )
        })()}
      </div>
      </div>
    </div>
  )
}

function OrgStructurePage({ people, contractors, departments, onDepartmentsChange, deliveryTeams, onDeliveryTeamsChange, groups, onGroupsChange, roles, deptPeopleCounts, onNavigateToPeople }: any) {
  const [tab, setTab] = useState("offices")
  const [selectedIdx, setSelectedIdx] = useState<number|null>(null)
  const [showModal, setShowModal] = useState(false)
  const [deliveryTeamMode, setDeliveryTeamMode] = useState<"single"|"multiple">("single")
  const [groupMode, setGroupMode] = useState<"single"|"multiple">("single")
  const [teamSettingsOpen, setTeamSettingsOpen] = useState(false)
  const [groupSettingsOpen, setGroupSettingsOpen] = useState(false)
  const [customGroupTypes, setCustomGroupTypes] = useState<{ id: string; name: string; items: any[] }[]>([])
  const [showNewGroupTypeModal, setShowNewGroupTypeModal] = useState(false)
  const [newGroupTypeName, setNewGroupTypeName] = useState("")
  const [tagsSubTab, setTagsSubTab] = useState<"people"|"project">("people")
  const [tagGroups, setTagGroups] = useState([
    { id: "languages", name: "Languages", color: "#D97706", tags: [{ name: "english", count: 4 }, { name: "spanish", count: 16 }, { name: "japanese", count: 8 }] },
    { id: "location", name: "Location", color: "#7C3AED", tags: [{ name: "montreal", count: 4 }, { name: "tokyo", count: 6 }, { name: "wellington", count: 6 }, { name: "london", count: 5 }, { name: "madrid", count: 5 }, { name: "new york", count: 14 }, { name: "mexico city", count: 3 }, { name: "auckland", count: 2 }] },
  ])
  const offices = ALL_OFFICES.filter(o => o !== "Global")

  const officeEmployeeCount = (o: string) => people.filter((p: any) => p.office === o).length
  const officeContractorCount = (o: string) => (contractors ?? []).filter((p: any) => p.office === o).length
  const officePeopleCount = (o: string) => officeEmployeeCount(o) + officeContractorCount(o)
  const officeDeptCount = (o: string) => departments.filter((_: any, i: number) => people.some((p: any) => p.office === o && p.departmentId === i)).length
  const officeGroupCount = (o: string) => groups.filter((_: any, i: number) => people.some((p: any) => p.office === o && (p.groupIds || []).includes(i))).length
  const allPeople = [...people, ...(contractors ?? [])]
  const deliveryTeamCounts = deliveryTeams.map((_: any, i: number) => allPeople.filter((p: any) => (p.deliveryTeamIds || []).includes(i)).length)
  const groupCounts = groups.map((_: any, i: number) => allPeople.filter((p: any) => (p.groupIds || []).includes(i)).length)

  const selectedOffice = tab === "offices" && selectedIdx !== null ? offices[selectedIdx] : null
  const selectedDept = tab === "departments" && selectedIdx !== null ? departments[selectedIdx] : null
  const selectedTeam = tab === "delivery-teams" && selectedIdx !== null ? deliveryTeams[selectedIdx] : null
  const selectedGroup = tab === "groups" && selectedIdx !== null ? groups[selectedIdx] : null
  const activeCustomType = customGroupTypes.find(cg => cg.id === tab) ?? null
  const selectedCustomItem = activeCustomType && selectedIdx !== null ? activeCustomType.items[selectedIdx] : null

  const tabLabel = tab === "offices" ? "Offices" : tab === "departments" ? "Departments" : tab === "delivery-teams" ? "Delivery teams" : tab === "groups" ? "Groups" : (activeCustomType?.name ?? "")
  const tabCount = tab === "offices" ? offices.length : tab === "departments" ? departments.length : tab === "delivery-teams" ? deliveryTeams.length : tab === "groups" ? groups.length : (activeCustomType?.items.length ?? 0)

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", background: t.bg }}>
      {showNewGroupTypeModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: 24, width: 340 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: t.fg, marginBottom: 16 }}>Create group type</h3>
            <input
              autoFocus
              value={newGroupTypeName}
              onChange={e => setNewGroupTypeName(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && newGroupTypeName.trim()) {
                  const id = `custom-${Date.now()}`
                  setCustomGroupTypes(prev => [...prev, { id, name: newGroupTypeName.trim(), items: [] }])
                  setTab(id)
                  setSelectedIdx(null)
                  setNewGroupTypeName("")
                  setShowNewGroupTypeModal(false)
                }
                if (e.key === "Escape") { setNewGroupTypeName(""); setShowNewGroupTypeModal(false) }
              }}
              placeholder="e.g. Practice areas"
              style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: `1px solid ${t.border}`, background: t.bg, color: t.fg, fontSize: 13, outline: "none", boxSizing: "border-box" as const, marginBottom: 16 }}
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <HoverBtn onClick={() => { setNewGroupTypeName(""); setShowNewGroupTypeModal(false) }} style={{ ...s.outlineBtn }}>Cancel</HoverBtn>
              <HoverBtn onClick={() => {
                if (!newGroupTypeName.trim()) return
                const id = `custom-${Date.now()}`
                setCustomGroupTypes(prev => [...prev, { id, name: newGroupTypeName.trim(), items: [] }])
                setTab(id)
                setSelectedIdx(null)
                setNewGroupTypeName("")
                setShowNewGroupTypeModal(false)
              }} style={{ ...s.outlineBtn, background: t.accent, color: t.fg, border: "none" }}>Create</HoverBtn>
            </div>
          </div>
        </div>
      )}
      {showModal && <AddDepartmentModal onAdd={(item: any) => {
        if (tab === "departments") onDepartmentsChange([...departments, item])
        else if (tab === "delivery-teams") onDeliveryTeamsChange([...deliveryTeams, item])
        else if (tab === "groups") onGroupsChange([...groups, item])
        else if (activeCustomType) setCustomGroupTypes(prev => prev.map(cg => cg.id === tab ? { ...cg, items: [...cg.items, item] } : cg))
        setShowModal(false)
      }} onClose={() => setShowModal(false)}/>}
      {teamSettingsOpen && <TeamSettingsModal type="delivery-teams" mode={deliveryTeamMode} onSave={(m: any) => setDeliveryTeamMode(m)} onClose={() => setTeamSettingsOpen(false)}/>}
      {groupSettingsOpen && <TeamSettingsModal type="groups" mode={groupMode} onSave={(m: any) => setGroupMode(m)} onClose={() => setGroupSettingsOpen(false)}/>}
      <div style={{ display: "flex", flex: 1, flexDirection: "column", overflow: "hidden" }}>
        <SectionHeader count={tabCount} label={tabLabel} onAdd={(tab !== "offices") ? () => setShowModal(true) : undefined}/>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[["offices","Offices"],["departments","Departments"],["tags","Tags"]].map(([v,l]) => (
              <TabBtn key={v} active={tab === v} onClick={() => { setTab(v); setSelectedIdx(null) }} activeColor={t.fgAlpha30} activeBg={t.fgAlpha10} mutedColor={t.secondaryFg} bg={t.bg} borderColor={t.border}>
                <Circle size={10} strokeWidth={1} style={{ fill: tab === v ? t.fg : "none" }}/>{l}
              </TabBtn>
            ))}
            <div style={{ width: 1, height: 16, background: t.fgAlpha30, margin: "0 6px" }}/>
            {[["groups","Groups"],["delivery-teams","Delivery teams"]].map(([v,l]) => (
              <TabBtn key={v} active={tab === v} onClick={() => { setTab(v); setSelectedIdx(null) }} activeColor={t.fgAlpha30} activeBg={t.fgAlpha10} mutedColor={t.secondaryFg} bg={t.bg} borderColor={t.border}>
                <Circle size={10} strokeWidth={1} style={{ fill: tab === v ? t.fg : "none" }}/>{l}
              </TabBtn>
            ))}
            {(tab === "delivery-teams") && <HoverBtn onClick={() => setTeamSettingsOpen(true)} style={{ ...s.iconBtn, width: 24, height: 24 }}><MoreVertical size={14} strokeWidth={1}/></HoverBtn>}
            {(tab === "groups") && <HoverBtn onClick={() => setGroupSettingsOpen(true)} style={{ ...s.iconBtn, width: 24, height: 24 }}><MoreVertical size={14} strokeWidth={1}/></HoverBtn>}
            {customGroupTypes.map(cg => (
              <TabBtn key={cg.id} active={tab === cg.id} onClick={() => { setTab(cg.id); setSelectedIdx(null) }} activeColor={t.fgAlpha30} activeBg={t.fgAlpha10} mutedColor={t.secondaryFg} bg={t.bg} borderColor={t.border}>
                <Circle size={10} strokeWidth={1} style={{ fill: tab === cg.id ? t.fg : "none" }}/>{cg.name}
              </TabBtn>
            ))}
            <HoverBtn onClick={() => setShowNewGroupTypeModal(true)} style={{ ...s.iconBtn, width: 24, height: 24 }}><Plus size={13} strokeWidth={1} color={t.secondaryFg}/></HoverBtn>
          </div>
          <HoverBtn style={s.outlineBtn}><RefreshCw size={11} strokeWidth={1}/>Import/Export</HoverBtn>
        </div>

        {tab === "offices" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "12px 24px 8px" }}>
              <Tabs active="active" onChange={() => {}} tabs={[{ label: `${offices.length} Active`, value: "active" }, { label: "0 Archived", value: "archived" }, { label: "All", value: "all" }]}/>
            </div>
            <DataTable
              columns={[
                { accessorKey: "name", header: "Office", size: 240, cell: ({ row }: any) => <span style={{ fontSize: 13, color: t.fg }}>{row.original}</span> },
                { id: "people", header: "People", size: 120, accessorFn: (row: any) => officePeopleCount(row), cell: ({ row }: any) => { const count = officePeopleCount(row.original); return count > 0 ? <span onClick={e => e.stopPropagation()}><Tag label={count} onClick={() => onNavigateToPeople(row.original)}/></span> : <span style={{ fontSize: 13, color: t.mutedFg }}>—</span> } },
                { id: "departments", header: "Departments", size: 140, accessorFn: (row: any) => officeDeptCount(row), cell: ({ row }: any) => { const count = officeDeptCount(row.original); return count > 0 ? <span onClick={e => e.stopPropagation()}><Tag label={count} onClick={() => { setTab("departments"); setSelectedIdx(null) }}/></span> : <span style={{ fontSize: 13, color: t.mutedFg }}>—</span> } },
                { id: "groups", header: "Groups", size: 120, enableResizing: false, accessorFn: (row: any) => officeGroupCount(row), cell: ({ row }: any) => { const count = officeGroupCount(row.original); return count > 0 ? <span onClick={e => e.stopPropagation()}><Tag label={count} onClick={() => { setTab("groups"); setSelectedIdx(null) }}/></span> : <span style={{ fontSize: 13, color: t.mutedFg }}>—</span> } },
              ]}
              data={offices}
              onRowClick={(_: any, idx: number) => setSelectedIdx(idx === selectedIdx ? null : idx)}
              isRowSelected={(_: any, idx: number) => idx === selectedIdx}
            />

          </>
        )}
        {tab === "departments" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "12px 24px 8px" }}>
              <Tabs active="active" onChange={() => {}} tabs={[{ label: `${departments.length} Active`, value: "active" }, { label: "0 Archived", value: "archived" }, { label: "All", value: "all" }]}/>
            </div>
            <DataTable
              columns={[
                { accessorKey: "name", header: "Name", size: 360, cell: ({ row }: any) => <span onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}><InlineEdit value={row.original.name} onChange={(v: any) => onDepartmentsChange(departments.map((x: any) => x === row.original ? {...x, name: v} : x))} style={{ background: "transparent" }}/></span> },
                { id: "activePeople", header: "Active people", size: 200, enableResizing: false, accessorFn: (row: any) => deptPeopleCounts[departments.indexOf(row)] ?? 0, cell: ({ row }: any) => { const count = deptPeopleCounts[departments.indexOf(row.original)] ?? 0; return count > 0 ? <span onClick={e => e.stopPropagation()}><Tag label={count}/></span> : <span style={{ fontSize: 13, color: t.mutedFg }}>—</span> } },
              ]}
              data={departments}
              onRowClick={(_: any, idx: number) => setSelectedIdx(idx === selectedIdx ? null : idx)}
              isRowSelected={(_: any, idx: number) => idx === selectedIdx}
            />
          </>
        )}
        {tab === "tags" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "12px 24px 8px" }}>
              <Tabs active={tagsSubTab} onChange={(v: any) => setTagsSubTab(v)} tabs={[{ label: `${tagGroups.reduce((a,g)=>a+g.tags.length,0)} People tags`, value: "people" }, { label: "6 Project tags", value: "project" }]}/>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px 24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {tagGroups.map(group => (
                  <div key={group.id} style={{ background: t.muted, borderRadius: 8, padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: group.color, flexShrink: 0 }}/>
                      <span style={{ fontSize: 13, fontWeight: 600, color: t.fg }}>{group.name}</span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                      {group.tags.map(tag => (
                        <div key={tag.name} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: group.color + "33", border: `1px solid ${group.color}44`, borderRadius: 4, padding: "2px 4px 2px 6px", fontSize: 11, fontWeight: 500, color: group.color }}>
                          <span>{tag.name} ({tag.count})</span>
                          <button onClick={() => setTagGroups(prev => prev.map(g => g.id === group.id ? { ...g, tags: g.tags.filter(tg => tg.name !== tag.name) } : g))} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: group.color, display: "flex", alignItems: "center", lineHeight: 1, fontSize: 13, opacity: 0.7 }}>×</button>
                        </div>
                      ))}
                      <button style={{ display: "flex", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", color: t.mutedFg, fontSize: 11, fontWeight: 500, padding: "2px 4px" }}>
                        <Plus size={11} strokeWidth={1.5}/> add tag
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {tab === "delivery-teams" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "12px 24px 8px" }}>
              <Tabs active="active" onChange={() => {}} tabs={[{ label: `${deliveryTeams.length} Active`, value: "active" }, { label: "0 Archived", value: "archived" }, { label: "All", value: "all" }]}/>
            </div>
            <DataTable
              columns={[
                { accessorKey: "name", header: "Name", size: 360, cell: ({ row }: any) => <span onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}><InlineEdit value={row.original.name} onChange={(v: any) => onDeliveryTeamsChange(deliveryTeams.map((x: any) => x === row.original ? {...x, name: v} : x))} style={{ background: "transparent" }}/></span> },
                { id: "members", header: "Members", size: 200, enableResizing: false, accessorFn: (_: any, i: number) => deliveryTeamCounts[i] ?? 0, cell: ({ row }: any) => { const count = deliveryTeamCounts[deliveryTeams.indexOf(row.original)] ?? 0; return count > 0 ? <span onClick={e => e.stopPropagation()}><Tag label={count}/></span> : <span style={{ fontSize: 13, color: t.mutedFg }}>—</span> } },
              ]}
              data={deliveryTeams}
              onRowClick={(_: any, idx: number) => setSelectedIdx(idx === selectedIdx ? null : idx)}
              isRowSelected={(_: any, idx: number) => idx === selectedIdx}
            />
          </>
        )}
        {tab === "groups" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "12px 24px 8px" }}>
              <Tabs active="active" onChange={() => {}} tabs={[{ label: `${groups.length} Active`, value: "active" }, { label: "0 Archived", value: "archived" }, { label: "All", value: "all" }]}/>
            </div>
            <DataTable
              columns={[
                { accessorKey: "name", header: "Name", size: 360, cell: ({ row }: any) => <span onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}><InlineEdit value={row.original.name} onChange={(v: any) => onGroupsChange(groups.map((x: any) => x === row.original ? {...x, name: v} : x))} style={{ background: "transparent" }}/></span> },
                { id: "members", header: "Members", size: 200, enableResizing: false, accessorFn: (_: any, i: number) => groupCounts[i] ?? 0, cell: ({ row }: any) => { const count = groupCounts[groups.indexOf(row.original)] ?? 0; return count > 0 ? <span onClick={e => e.stopPropagation()}><Tag label={count}/></span> : <span style={{ fontSize: 13, color: t.mutedFg }}>—</span> } },
              ]}
              data={groups}
              onRowClick={(_: any, idx: number) => setSelectedIdx(idx === selectedIdx ? null : idx)}
              isRowSelected={(_: any, idx: number) => idx === selectedIdx}
            />
          </>
        )}
        {activeCustomType && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "12px 24px 8px" }}>
              <Tabs active="active" onChange={() => {}} tabs={[{ label: `${activeCustomType.items.length} Active`, value: "active" }, { label: "0 Archived", value: "archived" }, { label: "All", value: "all" }]}/>
            </div>
            <DataTable
              columns={[
                { accessorKey: "name", header: "Name", size: 360, cell: ({ row }: any) => <span onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}><InlineEdit value={row.original.name} onChange={(v: any) => setCustomGroupTypes(prev => prev.map(cg => cg.id === tab ? { ...cg, items: cg.items.map((x: any) => x === row.original ? {...x, name: v} : x) } : cg))} style={{ background: "transparent" }}/></span> },
                { id: "members", header: "Members", size: 200, enableResizing: false, cell: () => <span style={{ fontSize: 13, color: t.mutedFg }}>—</span> },
              ]}
              data={activeCustomType.items}
              onRowClick={(_: any, idx: number) => setSelectedIdx(idx === selectedIdx ? null : idx)}
              isRowSelected={(_: any, idx: number) => idx === selectedIdx}
            />
          </>
        )}
      </div>

      {selectedOffice && (
        <Sheet title={selectedOffice} subtitle={`${officePeopleCount(selectedOffice)} people`} onClose={() => setSelectedIdx(null)}>
          <DetailGrid items={[
            { label: "Employees", value: officeEmployeeCount(selectedOffice) },
            { label: "Contractors", value: officeContractorCount(selectedOffice) },
            { label: "Departments", value: officeDeptCount(selectedOffice) },
            { label: "Groups", value: officeGroupCount(selectedOffice) },
          ]}/>
          <div style={{ fontSize: 11, fontWeight: 500, color: t.mutedFg, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 10 }}>Access</div>
          <div style={{ fontSize: 12, color: t.mutedFg, marginBottom: 10 }}>View and request resources:</div>
          <ul style={{ margin: "0 0 14px", paddingLeft: 18 }}>
            <li style={{ fontSize: 12, color: t.fg, marginBottom: 4 }}><strong>Resource planners</strong> in <strong>Sydney</strong> and <strong>New York</strong></li>
            <li style={{ fontSize: 12, color: t.fg }}><strong>Jean-Pierre</strong> in <strong>Paris</strong></li>
          </ul>
          <div style={{ fontSize: 12, color: t.mutedFg, marginBottom: 10 }}>Edit and schedule:</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li style={{ fontSize: 12, color: t.fg }}><strong>Admins</strong></li>
          </ul>
        </Sheet>
      )}
      {selectedDept && (
        <Sheet title={selectedDept.name} subtitle={`${deptPeopleCounts[selectedIdx!] ?? 0} active people`} onClose={() => setSelectedIdx(null)}>
          <DetailGrid items={[{ label: "Active people", value: deptPeopleCounts[selectedIdx!] ?? 0 }, { label: "Status", value: "Active" }]}/>
        </Sheet>
      )}
      {selectedTeam && (
        <Sheet title={selectedTeam.name} subtitle={`${deliveryTeamCounts[selectedIdx!] ?? 0} members`} onClose={() => setSelectedIdx(null)}>
          <DetailGrid items={[{ label: "Members", value: deliveryTeamCounts[selectedIdx!] ?? 0 }, { label: "Status", value: "Active" }]}/>
        </Sheet>
      )}
      {selectedGroup && (
        <Sheet title={selectedGroup.name} subtitle={`${groupCounts[selectedIdx!] ?? 0} members`} onClose={() => setSelectedIdx(null)}>
          <DetailGrid items={[{ label: "Members", value: groupCounts[selectedIdx!] ?? 0 }, { label: "Status", value: "Active" }]}/>
        </Sheet>
      )}
      {selectedCustomItem && (
        <Sheet title={selectedCustomItem.name} subtitle={activeCustomType?.name} onClose={() => setSelectedIdx(null)}>
          <DetailGrid items={[{ label: "Members", value: 0 }, { label: "Status", value: "Active" }]}/>
        </Sheet>
      )}
    </div>
  )
}

function VersionsToggle({ version, onChange }: any) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position:"absolute", bottom:16, right:16 }}>
      <DropdownWrapper open={open} setOpen={setOpen}
        trigger={
          <HoverBtn onClick={() => setOpen(!open)}
            style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 14px", borderRadius:8, border:`1px solid ${t.border}`, background: open ? t.accent : t.bg, color:t.fg, cursor:"pointer", fontSize:13, fontWeight:500 }}>
            <Layers size={14} strokeWidth={1}/>Versions
          </HoverBtn>
        }>
        <div style={{ ...s.dropdown, bottom:"100%", top:"auto", marginBottom:8, width:200 }}>
          {[["multi","Multi office"],["single","Single office"]].map(([v,l]) => (
            <button key={v} onClick={() => { onChange(v); setOpen(false) }} style={s.dropdownItem(version===v)}>
              {l} {version===v && <Check size={12} strokeWidth={1}/>}
            </button>
          ))}
        </div>
      </DropdownWrapper>
    </div>
  )
}

export default function App() {
  const [version, setVersion] = useState("multi")
  const [activeItem, setActiveItem] = useState("People")
  const [breadcrumb, setBreadcrumb] = useState(["Data centre", "People"])
  const [roles, setRoles] = useState(INITIAL_ROLES)
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS)
  const [deliveryTeams, setDeliveryTeams] = useState(INITIAL_DELIVERY_TEAMS)
  const [groups, setGroups] = useState(INITIAL_GROUPS)
  const [people, setPeople] = useState(INITIAL_PEOPLE)
  const [contractors, setContractors] = useState(INITIAL_CONTRACTORS)
  const [projects, setProjects] = useState(() => [...INITIAL_PROJECTS, ...getBusinessUnitProjects()])
  const [clients] = useState(INITIAL_CLIENTS_DATA)
  const [clientsFull, setClientsFull] = useState(() => CLIENTS_FULL)
  const [rateCardFilter, setRateCardFilter] = useState<string|null>(null)
  const [clientsFilter, setClientsFilter] = useState<string[]|null>(null)
  const [projectsClientFilter, setProjectsClientFilter] = useState<string|null>(null)
  const [projectsRateCardFilter, setProjectsRateCardFilter] = useState<{clientName: string, rateCardName: string}|null>(null)
  const [themeMode, setThemeMode] = useState<"light" | "dark" | "black" | "float-dark">("float-dark")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [navHoverOpen, setNavHoverOpen] = useState(false)
  const [visibleDataHubItems, setVisibleDataHubItems] = useState(new Set(dataHubItems.map(item => item.name).filter(n => n !== "Brands")))
  const [filteredBusinessUnit, setFilteredBusinessUnit] = useState(null)
  const [filteredBusinessUnitForPeople, setFilteredBusinessUnitForPeople] = useState(null)
  const [filteredRoleForPeople, setFilteredRoleForPeople] = useState<string|null>(null)
  const [filteredOfficeForPeople, setFilteredOfficeForPeople] = useState<string|null>(null)
  const [initialPeopleView, setInitialPeopleView] = useState<string|null>(null)
  const [settingsOfficeTarget, setSettingsOfficeTarget] = useState<string | null>(null)
  const [savedDashboardCards, setSavedDashboardCards] = useState<string[]>([])
  const [showFloatAgent, setShowFloatAgent] = useState(false)

  const deptPeopleCounts: Record<number, number> = {}
  people.forEach((p: any) => { deptPeopleCounts[p.departmentId] = (deptPeopleCounts[p.departmentId] || 0) + 1 })

  // Update theme based on mode
  t = themeMode === "light" ? lightTheme : themeMode === "black" ? blackTheme : themeMode === "dark" ? darkTheme : floatDarkTheme
  s = getStyles(t)

  function renderMain() {
    if (activeItem === "Org design") return <OrgStructurePage people={people} contractors={contractors} departments={departments} onDepartmentsChange={setDepartments} deliveryTeams={deliveryTeams} onDeliveryTeamsChange={setDeliveryTeams} groups={groups} onGroupsChange={setGroups} roles={roles} deptPeopleCounts={deptPeopleCounts} onNavigateToPeople={(o: string) => { setFilteredOfficeForPeople(o); setInitialPeopleView(null); setActiveItem("People"); setBreadcrumb(["Data centre", "People"]) }}/>
    if (activeItem === "Roles") return <RolesAndRates roles={roles} onRolesChange={setRoles} people={people} departments={departments} onNavigateToPeopleByRole={(role: string) => { setFilteredRoleForPeople(role); setFilteredBusinessUnitForPeople(null); setActiveItem("People"); setBreadcrumb(["People"]) }}/>
    if (activeItem === "People") return <People roles={roles} departments={departments} onDepartmentsChange={setDepartments} deliveryTeams={deliveryTeams} groups={groups} people={people} onPeopleChange={setPeople} contractors={contractors} onContractorsChange={setContractors} deptPeopleCounts={deptPeopleCounts} filteredBusinessUnit={filteredBusinessUnitForPeople} onFilterClear={() => setFilteredBusinessUnitForPeople(null)} filteredRole={filteredRoleForPeople} onRoleFilterClear={() => setFilteredRoleForPeople(null)} filteredOffice={filteredOfficeForPeople} onOfficeFilterClear={() => setFilteredOfficeForPeople(null)} initialView={initialPeopleView} onInitialViewConsumed={() => setInitialPeopleView(null)}/>
    if (activeItem === "Project tracker") return <ProjectTracker projects={projects} onProjectsChange={setProjects} people={people} clients={clients}/>
    if (activeItem === "Projects") return <ProjectsDataHub visibleItems={visibleDataHubItems} projects={projects} onProjectsChange={setProjects} people={people} clients={clientsFull} filteredBusinessUnit={filteredBusinessUnit} onFilterClear={() => setFilteredBusinessUnit(null)} filteredClient={projectsClientFilter} onClientFilterClear={() => setProjectsClientFilter(null)} filteredRateCard={projectsRateCardFilter} onRateCardFilterClear={() => setProjectsRateCardFilter(null)}/>
    if (activeItem === "Clients") return <Clients roles={roles} people={people} clients={clientsFull} onClientsChange={setClientsFull} projects={projects} onNavigateToRateCards={(name: string) => { setRateCardFilter(name); setActiveItem("Rate cards") }} filterClients={clientsFilter} onClearClientsFilter={() => setClientsFilter(null)} onNavigateToProjects={(name: string) => { setProjectsClientFilter(name); setActiveItem("Projects") }}/>
    if (activeItem === "Rate cards") return <RateCards roles={roles} clients={clientsFull} onClientsChange={setClientsFull} filterClient={rateCardFilter} onClearFilter={() => setRateCardFilter(null)} onNavigateToClients={(names: string[]) => { setClientsFilter(names); setActiveItem("Clients") }} projects={projects} onNavigateToProjects={(clientName: string, rateCardName: string) => { setProjectsClientFilter(null); setProjectsRateCardFilter({ clientName, rateCardName }); setActiveItem("Projects"); setBreadcrumb(["Data centre", "Projects"]) }}/>
    if (activeItem === "Brands") return <BusinessUnits roles={roles} onProjectsClick={(unitName: any) => { setFilteredBusinessUnit(unitName); setActiveItem("Projects"); }} onEmployeesClick={(unitName: any) => { setFilteredBusinessUnitForPeople(unitName); setActiveItem("People"); }}/>
    if (activeItem === "Activity log") return <ActivityLog/>
    if (activeItem === "Talent graph") return <TalentGraphView people={people} roles={roles} departments={departments}/>
    if (activeItem === "Project graph") return <ProjectGraphView projects={projects} roles={roles} people={people} clientsFull={clientsFull}/>
    if (activeItem === "Skills graph") return <SkillsGraphView people={people} roles={roles}/>
    if (activeItem === "Float Agent") return <FloatAgentView projects={projects} clientsFull={clientsFull} people={people} onSaveDashboard={cards => { setSavedDashboardCards(cards); setActiveItem("Saved Dashboard"); setBreadcrumb(["Float Agent", "Saved Dashboard"]) }}/>
    if (activeItem === "Saved Dashboard") return <SavedDashboardView cards={savedDashboardCards} projects={projects} clientsFull={clientsFull} people={people}/>
    if (activeItem === "Settings") return <SettingsPage key={settingsOfficeTarget ?? "__org__"} t={t} s={s} locations={LOCATIONS_INIT} officeTarget={settingsOfficeTarget} onBack={() => { setActiveItem("Dashboard"); setBreadcrumb(["Global", "Dashboard"]); setSettingsOfficeTarget(null) }}/>
    if (activeItem === "Dashboard") return <DashboardView breadcrumb={breadcrumb}/>
    if (activeItem === "Report") return <ReportView breadcrumb={breadcrumb}/>
    if (activeItem === "Schedule") return <ScheduleView breadcrumb={breadcrumb}/>
    if (activeItem === "Project plan") return <ProjectPlanView breadcrumb={breadcrumb}/>
    if (activeItem === "My time") return <MyTimeView breadcrumb={breadcrumb}/>
    if (activeItem === "Log team") return <LogTeamView breadcrumb={breadcrumb}/>
    return <PlaceholderView title={breadcrumb[breadcrumb.length-1]} breadcrumb={breadcrumb}/>
  }

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:t.bg, color:t.fg, fontFamily:"var(--font-sans), -apple-system, sans-serif" }}>
      {activeItem !== "Settings" && <>
        <SidebarNav version={version} activeItem={activeItem} onActiveItemChange={setActiveItem} onBreadcrumbChange={setBreadcrumb} themeMode={themeMode} onThemeChange={setThemeMode} visibleDataHubItems={visibleDataHubItems} onVisibleDataHubItemsChange={setVisibleDataHubItems} collapsed={sidebarCollapsed} onToggleCollapsed={() => setSidebarCollapsed(c => !c)} notificationsOpen={notificationsOpen} onNotificationsToggle={() => setNotificationsOpen(o => !o)} onHoverChange={setNavHoverOpen} onSettingsOffice={(name: string | null) => { setSettingsOfficeTarget(name); setActiveItem("Settings"); setBreadcrumb(["Settings"]) }} hasSavedDashboard={savedDashboardCards.length > 0} onSavedDashboardClick={() => { setActiveItem("Saved Dashboard"); setBreadcrumb(["Float Agent", "Saved Dashboard"]) }} showFloatAgent={showFloatAgent} onFloatAgentToggle={setShowFloatAgent}/>
        {notificationsOpen && <NotificationsPanel floating={sidebarCollapsed} navHoverOpen={navHoverOpen} onClose={() => setNotificationsOpen(false)}/>}
      </>}
      <main style={{ ...s.main, position:"relative" as const, paddingLeft: activeItem !== "Settings" && sidebarCollapsed ? 36 : 0, transition: "padding-left 0.2s ease" }}>
        {activeItem !== "Settings" && sidebarCollapsed && (
          <button onClick={() => setSidebarCollapsed(false)}
            style={{ position:"absolute", top:22, left:8, zIndex:10, display:"flex", alignItems:"center", background:"none", border:"none", cursor:"pointer", color:t.mutedFg, padding:2, borderRadius:4 }}>
            <PanelLeftOpen size={16} strokeWidth={1}/>
          </button>
        )}
        {/* breadcrumb nav hidden — may restore later */}
        <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
          {renderMain()}
        </div>
        <VersionsToggle version={version} onChange={setVersion}/>
      </main>
    </div>
  )
}
