import { TabBtn, TabBtnProps } from "./TabBtn"

export type RadiusTabProps = TabBtnProps

/** Fully rounded (pill) segment tab — same as TabBtn with tighter horizontal padding (`0 8px`). */
export function RadiusTab(props: RadiusTabProps) {
  return <TabBtn {...props} padding="0 8px" />
}
