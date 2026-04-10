"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Toggle } from "@/components/ui/toggle"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Label } from "@/components/ui/label"
import { Tag } from "@/components/ui/tag"
import {
  Info, AlertTriangle, CheckCircle, Terminal, Bold, Italic, Underline,
  Sun, Moon, Layers, ChevronDown, Check,
  Gauge, BarChart3, Clock, Users, Database, FolderOpen, Building2, ChefHat,
  HelpCircle, Bell, Settings, Plus, RefreshCw, Settings2, X, Circle,
  UserPlus, ArrowRightLeft, CalendarClock, Briefcase, DollarSign,
  ChevronLeft, ListFilter, MoreVertical, Pyramid
} from "lucide-react"

function RoleSelectorDemo() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(0)
  const roles = ["Designer", "Developer", "Product Manager", "QA Engineer"]
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1 text-sm text-foreground bg-transparent border-none cursor-pointer py-1 px-2 rounded hover:bg-accent transition-colors"
      >
        {roles[selected]}<ChevronDown size={11} strokeWidth={1} className="text-muted-foreground" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 z-50 bg-popover border border-border rounded-lg shadow-lg p-1 min-w-[160px]">
            {roles.map((r, i) => (
              <button
                key={i}
                onClick={() => { setSelected(i); setOpen(false) }}
                className="flex items-center justify-between w-full px-2.5 py-1.5 text-sm rounded-md hover:bg-accent text-left cursor-pointer border-none bg-transparent text-foreground"
              >
                {r}{i === selected && <Check size={11} strokeWidth={1} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground mb-4">{title}</h2>
      <div className="flex flex-wrap items-start gap-3">{children}</div>
    </div>
  )
}

export default function ComponentsPage() {
  const [sliderVal, setSliderVal] = useState([40])
  const [checked, setChecked] = useState(true)
  const [switched, setSwitched] = useState(true)
  const [toggled, setToggled] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark" | "float-dark">("light")

  return (
    <TooltipProvider>
      <div className={theme !== "light" ? "dark" : ""} style={theme === "float-dark" ? { colorScheme: "dark", background: "#141414", color: "#f0f0f0" } : {}}>
      <div className="min-h-screen bg-background text-foreground" style={theme === "float-dark" ? { background: "#141414" } : {}}>
        <div className="max-w-5xl mx-auto px-8 py-12">

          <div className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Components</h1>
              <p className="text-sm text-muted-foreground">Float UI components</p>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-muted">
              {(["light", "dark", "float-dark"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setTheme(m)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${theme === m ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {m === "light" && <Sun size={12}/>}
                  {m === "dark" && <Moon size={12}/>}
                  {m === "float-dark" && <Layers size={12}/>}
                  {m === "light" ? "Light" : m === "dark" ? "Dark" : "Float dark"}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <Section title="Button">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </Section>

          {/* Badge */}
          <Section title="Badge">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </Section>

          {/* Avatar */}
          <Section title="Avatar">
            <Avatar>
              <AvatarImage src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CR-avatar-Bz4EbF5HeVDJiGS7f3cWgRW6XtjgTN.jpeg" alt="CR Avatar" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>MH</AvatarFallback>
            </Avatar>
          </Section>

          {/* Input */}
          <Section title="Input &amp; Textarea">
            <div className="flex flex-col gap-2 w-64">
              <Input placeholder="Email address" type="email" />
              <Input placeholder="Disabled" disabled />
              <Textarea placeholder="Write something..." rows={3} />
            </div>
          </Section>

          {/* Select */}
          <Section title="Select">
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="pm">Product Manager</SelectItem>
              </SelectContent>
            </Select>
          </Section>

          {/* Checkbox & Radio */}
          <Section title="Checkbox &amp; Radio">
            <div className="flex items-center gap-2">
              <Checkbox id="cb1" checked={checked} onCheckedChange={(v) => setChecked(!!v)} />
              <Label htmlFor="cb1">Accept terms</Label>
            </div>
            <RadioGroup defaultValue="option-1" className="flex gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="option-1" id="r1" />
                <Label htmlFor="r1">Option 1</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="option-2" id="r2" />
                <Label htmlFor="r2">Option 2</Label>
              </div>
            </RadioGroup>
          </Section>

          {/* Switch */}
          <Section title="Switch">
            <div className="flex items-center gap-2">
              <Switch id="sw1" checked={switched} onCheckedChange={setSwitched} />
              <Label htmlFor="sw1">{switched ? "On" : "Off"}</Label>
            </div>
          </Section>

          {/* Toggle */}
          <Section title="Toggle">
            <Toggle pressed={toggled} onPressedChange={setToggled}><Bold size={14} /></Toggle>
            <Toggle><Italic size={14} /></Toggle>
            <Toggle><Underline size={14} /></Toggle>
          </Section>

          {/* Slider */}
          <Section title="Slider">
            <div className="w-64">
              <Slider value={sliderVal} onValueChange={setSliderVal} max={100} step={1} />
              <p className="text-xs text-muted-foreground mt-2">{sliderVal[0]}%</p>
            </div>
          </Section>

          {/* Progress */}
          <Section title="Progress">
            <div className="w-64 flex flex-col gap-3">
              <Progress value={25} />
              <Progress value={50} />
              <Progress value={75} />
              <Progress value={100} />
            </div>
          </Section>

          {/* Skeleton */}
          <Section title="Skeleton">
            <div className="flex flex-col gap-2 w-64">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </Section>

          {/* Separator */}
          <Section title="Separator">
            <div className="w-64 flex flex-col gap-3">
              <Separator />
              <div className="flex items-center gap-2">
                <span className="text-sm">Left</span>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm">Right</span>
              </div>
            </div>
          </Section>

          {/* Tabs */}
          <Section title="Tabs">
            <Tabs defaultValue="tab1" className="w-80">
              <TabsList>
                <TabsTrigger value="tab1">Overview</TabsTrigger>
                <TabsTrigger value="tab2">Analytics</TabsTrigger>
                <TabsTrigger value="tab3">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1"><p className="text-sm text-muted-foreground pt-2">Overview content.</p></TabsContent>
              <TabsContent value="tab2"><p className="text-sm text-muted-foreground pt-2">Analytics content.</p></TabsContent>
              <TabsContent value="tab3"><p className="text-sm text-muted-foreground pt-2">Settings content.</p></TabsContent>
            </Tabs>
          </Section>

          {/* Accordion */}
          <Section title="Accordion">
            <Accordion type="single" collapsible className="w-80">
              <AccordionItem value="a1">
                <AccordionTrigger>What is Float?</AccordionTrigger>
                <AccordionContent>Float is a resource management platform for creative agencies.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="a2">
                <AccordionTrigger>How do I add people?</AccordionTrigger>
                <AccordionContent>Use the People section in the Data Hub to add employees and contractors.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </Section>

          {/* Card */}
          <Section title="Card">
            <Card className="w-72">
              <CardHeader>
                <CardTitle>Campaign Q3</CardTitle>
                <CardDescription>Nike — Active project</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Budget: $420,000 · 8 team members assigned.</p>
              </CardContent>
            </Card>
          </Section>

          {/* Alert */}
          <Section title="Alert">
            <div className="flex flex-col gap-3 w-80">
              <Alert>
                <Info size={14} />
                <AlertTitle>Info</AlertTitle>
                <AlertDescription>Your plan renews on April 1st.</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTriangle size={14} />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Failed to save changes. Try again.</AlertDescription>
              </Alert>
            </div>
          </Section>

          {/* Tooltip */}
          <Section title="Tooltip">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>This is a tooltip</TooltipContent>
            </Tooltip>
          </Section>

          {/* Sidebar */}
          <Section title="Sidebar">
            <div className="rounded-xl overflow-hidden border" style={{ width: 260, height: 600, flexShrink: 0 }}>
              <iframe
                src="/"
                style={{ width: 1440, height: 600, border: "none", pointerEvents: "none" }}
                scrolling="no"
              />
            </div>
          </Section>

          {/* Table */}
          <Section title="Table">
            <div className="w-full max-w-lg border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Michael Hitchcock</TableCell>
                    <TableCell>Designer</TableCell>
                    <TableCell><Badge variant="secondary">Active</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sara Chen</TableCell>
                    <TableCell>Developer</TableCell>
                    <TableCell><Badge variant="secondary">Active</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tom Briggs</TableCell>
                    <TableCell>PM</TableCell>
                    <TableCell><Badge variant="outline">Away</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Section>

          {/* Role Selector */}
          <Section title="Role Selector">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground mb-1">Inline table cell</p>
                <RoleSelectorDemo />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground mb-1">Multiple instances</p>
                <div className="flex flex-col gap-1">
                  <RoleSelectorDemo />
                  <RoleSelectorDemo />
                </div>
              </div>
            </div>
          </Section>

          {/* Tag */}
          <Section title="Tag">
            <div className="flex items-center gap-2">
              <Tag label="Acquisition" />
              <Tag label="Retention" />
            </div>
            <div className="flex items-center gap-2">
              <Tag label={12} onClick={() => {}} />
              <Tag label={4} onClick={() => {}} />
            </div>
          </Section>

          {/* Breadcrumb */}
          <Section title="Breadcrumb">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="#">Global</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href="#">Data Hub</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>People</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </Section>

          {/* Icons */}
          <Section title="Icons">
            {[
              { icon: <ChevronDown size={16} strokeWidth={1}/>, name: "ChevronDown" },
              { icon: <ChevronLeft size={16} strokeWidth={1}/>, name: "ChevronLeft" },
              { icon: <Gauge size={16} strokeWidth={1}/>, name: "Gauge" },
              { icon: <BarChart3 size={16} strokeWidth={1}/>, name: "BarChart3" },
              { icon: <Clock size={16} strokeWidth={1}/>, name: "Clock" },
              { icon: <Users size={16} strokeWidth={1}/>, name: "Users" },
              { icon: <Database size={16} strokeWidth={1}/>, name: "Database" },
              { icon: <FolderOpen size={16} strokeWidth={1}/>, name: "FolderOpen" },
              { icon: <Building2 size={16} strokeWidth={1}/>, name: "Building2" },
              { icon: <ChefHat size={16} strokeWidth={1}/>, name: "ChefHat" },
              { icon: <HelpCircle size={16} strokeWidth={1}/>, name: "HelpCircle" },
              { icon: <Bell size={16} strokeWidth={1}/>, name: "Bell" },
              { icon: <Settings size={16} strokeWidth={1}/>, name: "Settings" },
              { icon: <Settings2 size={16} strokeWidth={1}/>, name: "Settings2" },
              { icon: <Layers size={16} strokeWidth={1}/>, name: "Layers" },
              { icon: <Plus size={16} strokeWidth={1}/>, name: "Plus" },
              { icon: <RefreshCw size={16} strokeWidth={1}/>, name: "RefreshCw" },
              { icon: <Check size={16} strokeWidth={1}/>, name: "Check" },
              { icon: <X size={16} strokeWidth={1}/>, name: "X" },
              { icon: <Circle size={16} strokeWidth={1}/>, name: "Circle" },
              { icon: <UserPlus size={16} strokeWidth={1}/>, name: "UserPlus" },
              { icon: <ArrowRightLeft size={16} strokeWidth={1}/>, name: "ArrowRightLeft" },
              { icon: <CalendarClock size={16} strokeWidth={1}/>, name: "CalendarClock" },
              { icon: <Briefcase size={16} strokeWidth={1}/>, name: "Briefcase" },
              { icon: <DollarSign size={16} strokeWidth={1}/>, name: "DollarSign" },
              { icon: <ListFilter size={16} strokeWidth={1}/>, name: "ListFilter" },
              { icon: <Sun size={16} strokeWidth={1}/>, name: "Sun" },
              { icon: <Moon size={16} strokeWidth={1}/>, name: "Moon" },
              { icon: <MoreVertical size={16} strokeWidth={1}/>, name: "MoreVertical" },
              { icon: <Pyramid size={16} strokeWidth={1}/>, name: "Pyramid" },
              { icon: <Info size={16} strokeWidth={1}/>, name: "Info" },
              { icon: <AlertTriangle size={16} strokeWidth={1}/>, name: "AlertTriangle" },
              { icon: <CheckCircle size={16} strokeWidth={1}/>, name: "CheckCircle" },
              { icon: <Terminal size={16} strokeWidth={1}/>, name: "Terminal" },
              { icon: <Bold size={16} strokeWidth={1}/>, name: "Bold" },
              { icon: <Italic size={16} strokeWidth={1}/>, name: "Italic" },
              { icon: <Underline size={16} strokeWidth={1}/>, name: "Underline" },
            ].map(({ icon, name }) => (
              <div key={name} className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border w-[88px]">
                <span className="text-foreground">{icon}</span>
                <span className="text-[10px] text-muted-foreground text-center leading-tight">{name}</span>
              </div>
            ))}
          </Section>

          {/* Type Ramp */}
          <Section title="Type ramp">
            <div className="flex flex-col gap-5 w-full">
              {[
                { size: "18px", weight: 400, label: "18 / 400", sample: "Campaign Q3 — Nike Global", note: "Page title (Lexend)" },
                { size: "16px", weight: 600, label: "16 / 600", sample: "Membership settings", note: "Panel heading" },
                { size: "15px", weight: 600, label: "15 / 600", sample: "Add role", note: "Modal heading" },
                { size: "14px", weight: 400, label: "14 / 400", sample: "View all projects", note: "Nav action" },
                { size: "13px", weight: 500, label: "13 / 500", sample: "Beaverton HQ", note: "Sidebar label, table body" },
                { size: "13px", weight: 400, label: "13 / 400", sample: "Each person belongs to one department", note: "Body text" },
                { size: "12px", weight: 500, label: "12 / 500", sample: "ROLE NAME", note: "Column header, form label" },
                { size: "12px", weight: 400, label: "12 / 400", sample: "No archived roles", note: "Secondary / empty state" },
                { size: "11px", weight: 500, label: "11 / 500", sample: "COST RATE", note: "Micro label" },
                { size: "10px", weight: 600, label: "10 / 600", sample: "CR", note: "Avatar initials" },
              ].map(({ size, weight, label, sample, note }) => (
                <div key={label} className="flex items-baseline gap-6">
                  <span className="text-[11px] text-muted-foreground w-16 shrink-0 tabular-nums">{label}</span>
                  <span style={{ fontSize: size, fontWeight: weight, lineHeight: 1.3 }}>{sample}</span>
                  <span className="text-[11px] text-muted-foreground">{note}</span>
                </div>
              ))}
            </div>
          </Section>

        </div>
      </div>
      </div>
    </TooltipProvider>
  )
}
