"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronDown, Circle, Plus } from "lucide-react"
import { HoverBtn as CamHoverBtn } from "@cam-ui/components"

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

export function SettingsPage({ t, s, locations, officeTarget, onBack }: any) {
  const officeSubItems = ["Policies", "Access", "Work schedule", "Currencies", "Time tracking", "Time off"]
  const orgItems = ["Plans & billing", "General", "Notifications", "Integrations", "Security", "Access rights", "The Grid", "Time off", "Statuses"]
  const offices = locations.filter((l: any) => l.name !== "Global")

  const [activeSection, setActiveSection] = useState<string>(officeTarget ? "" : "General")
  const [activeOffice, setActiveOffice] = useState<string | null>(officeTarget ?? null)
  const [activeSubSection, setActiveSubSection] = useState<string | null>(officeTarget ? "Policies" : null)
  const [expandedOffices, setExpandedOffices] = useState<Set<string>>(new Set(officeTarget ? [officeTarget] : []))
  const [orgExpanded, setOrgExpanded] = useState(true)

  function Btn({ style, children, onClick }: any) {
    return <CamHoverBtn accentColor={t.accent} style={style} onClick={onClick}>{children}</CamHoverBtn>
  }

  const navItem = (active: boolean) => ({
    display: "flex", alignItems: "center", gap: 8, width: "100%",
    padding: "6px 8px", borderRadius: 6, border: "none",
    background: active ? t.accent : "transparent",
    color: active ? t.fg : t.sidebarFg,
    cursor: "pointer", fontSize: 13, fontWeight: active ? 500 : 400,
    textAlign: "left" as const,
  })

  const contentTitle = activeOffice && activeSubSection ? activeSubSection : activeSection || "Settings"
  const contentSubtitle = activeOffice && activeSubSection ? activeOffice : null

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", background: t.bg }}>
      {/* Left settings nav */}
      <div style={{ width: 280, borderRight: `1px solid ${t.border}`, display: "flex", flexDirection: "column", overflow: "hidden", background: t.sidebar, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 12px 12px" }}>
          <Btn onClick={onBack} style={{ ...s.iconBtn, color: t.mutedFg }}>
            <ChevronLeft size={16} strokeWidth={1}/>
          </Btn>
          <span style={{ fontSize: 15, fontWeight: 500, color: t.fg }}>Settings</span>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
          {/* Organization */}
          <div style={{ marginBottom: 4 }}>
            <Btn onClick={() => setOrgExpanded(e => !e)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "4px 8px 6px", border: "none", background: "transparent", cursor: "pointer" }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: t.mutedFg }}>Organization</span>
              <ChevronDown size={12} strokeWidth={1} color={t.mutedFg} style={{ transform: orgExpanded ? "none" : "rotate(-90deg)", transition: "transform 0.2s" }}/>
            </Btn>
            <Collapsible expanded={orgExpanded}>
              {orgItems.map(item => {
                const active = activeSection === item && !activeOffice
                return (
                  <Btn key={item} onClick={() => { setActiveSection(item); setActiveOffice(null); setActiveSubSection(null) }} style={navItem(active)}>
                    <Circle size={9} strokeWidth={1.5} style={{ flexShrink: 0, color: active ? t.fg : t.mutedFg, fill: active ? t.fg : "none" }}/>{item}
                  </Btn>
                )
              })}
            </Collapsible>
          </div>
          {/* Offices */}
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: t.mutedFg, padding: "4px 8px 6px" }}>Offices</div>
            {offices.map((office: any) => {
              const isExpanded = expandedOffices.has(office.name)
              return (
                <div key={office.name}>
                  <Btn onClick={() => {
                    setExpandedOffices(prev => {
                      const next = new Set(prev)
                      if (next.has(office.name)) next.delete(office.name)
                      else { next.clear(); next.add(office.name) }
                      return next
                    })
                    setActiveSection("")
                    setActiveOffice(office.name)
                    setActiveSubSection("Policies")
                  }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "6px 8px", borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Circle size={9} strokeWidth={1.5} style={{ flexShrink: 0, color: isExpanded ? t.fg : t.mutedFg, fill: "none" }}/>
                      <span style={{ fontSize: 13, fontWeight: isExpanded ? 500 : 400, color: isExpanded ? t.fg : t.sidebarFg }}>{office.name}</span>
                    </div>
                    <ChevronDown size={12} strokeWidth={1} color={t.mutedFg} style={{ transform: isExpanded ? "none" : "rotate(-90deg)", transition: "transform 0.2s" }}/>
                  </Btn>
                  <Collapsible expanded={isExpanded}>
                    <div style={{ marginLeft: 16, paddingLeft: 12, borderLeft: `1px solid ${t.borderAlpha25}`, marginBottom: 4 }}>
                      {officeSubItems.map(sub => {
                        const active = activeOffice === office.name && activeSubSection === sub
                        return (
                          <Btn key={sub} onClick={() => { setActiveOffice(office.name); setActiveSubSection(sub); setActiveSection("") }} style={navItem(active)}>
                            <Circle size={9} strokeWidth={1.5} style={{ flexShrink: 0, color: active ? t.fg : t.mutedFg, fill: active ? t.fg : "none" }}/>{sub}
                          </Btn>
                        )
                      })}
                    </div>
                  </Collapsible>
                </div>
              )
            })}
            <Btn style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "6px 8px", marginTop: 8, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: t.mutedFg }}>
              <Plus size={13} strokeWidth={1.5}/>
              <span style={{ fontSize: 13 }}>Add new office</span>
            </Btn>
          </div>
        </div>
      </div>
      {/* Right content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "20px 32px 18px" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: t.fg, letterSpacing: "0em", margin: 0 }}>{contentTitle}</h2>
          {contentSubtitle && <p style={{ fontSize: 13, color: t.mutedFg, marginTop: 4 }}>{contentSubtitle}</p>}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
          <div style={{ maxWidth: 600 }}>
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: 24 }}>
              <p style={{ fontSize: 13, color: t.mutedFg, lineHeight: 1.6 }}>
                {contentTitle} settings will appear here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
