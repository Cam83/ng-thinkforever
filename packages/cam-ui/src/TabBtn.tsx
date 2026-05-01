import { useState } from "react"

export interface TabBtnProps {
  active?: boolean
  children?: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  /** Active state border + text alpha color, e.g. "rgba(255,255,255,0.3)" */
  activeColor?: string
  /** Active state background color, e.g. "rgba(255,255,255,0.1)" */
  activeBg?: string
  /** Inactive text color */
  mutedColor?: string
  /** Base background (inactive), e.g. theme.bg */
  bg?: string
  /** Base border color (inactive), e.g. theme.border */
  borderColor?: string
  /** Horizontal + vertical padding. Default `0 12px`. */
  padding?: string
  style?: React.CSSProperties
}

export function TabBtn({
  active = false,
  children,
  onClick,
  activeColor = "rgba(255,255,255,0.3)",
  activeBg = "rgba(255,255,255,0.1)",
  mutedColor = "rgba(255,255,255,0.5)",
  bg = "transparent",
  borderColor = "rgba(255,255,255,0.12)",
  padding = "0 12px",
  style,
}: TabBtnProps) {
  const [hov, setHov] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        boxSizing: "border-box",
        height: 24,
        padding,
        borderRadius: 20,
        border: `1px solid ${active ? activeColor : borderColor}`,
        background: active ? activeBg : hov ? activeBg : bg,
        color: active ? "inherit" : mutedColor,
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 400,
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        transition: "background 0.15s ease, border-color 0.15s ease",
        ...style,
      }}
    >
      {children}
    </button>
  )
}
