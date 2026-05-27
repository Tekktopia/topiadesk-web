'use client';

import { useState } from 'react';
import {
  Bot,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleSlash,
  Clock,
  Cog,
  DollarSign,
  ExternalLink,
  FlaskConical,
  Layers,
  Loader2,
  MessageSquareText,
  Minus,
  Pencil,
  Plus,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Star,
  ThumbsUp,
  Timer,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  Switch,
  cn,
} from '@topiadesk/ui';
import { useAIConfig, useAIMetrics, useAIActivity } from '@/lib/queries';
import { relativeTime } from '@/lib/format';
import type {
  AIAgentConfig,
  AIActivityEntry,
  AIActivityAction,
  AIIntegration,
  AITone,
  AITrainingSource,
  AIMetrics,
} from '@/lib/mock-data';

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AIAgentPage() {
  const { data: config, isLoading: configLoading } = useAIConfig();
  const { data: metrics, isLoading: metricsLoading } = useAIMetrics();
  const { data: activity, isLoading: activityLoading } = useAIActivity();

  // Local override for the master toggle (demo)
  const [enabled, setEnabled] = useState<boolean | null>(null);

  if (configLoading || metricsLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!config || !metrics) return null;

  const isEnabled = enabled ?? config.enabled;

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      {/* ── Gradient header ── */}
      <div
        className="-mx-5 -mt-5 mb-6 px-5 pt-5 pb-6"
        style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                AI First-Response Agent
              </h1>
              <p className="mt-0.5 text-sm text-blue-200">
                {config.modelVersion} &nbsp;·&nbsp; Last trained{' '}
                {relativeTime(config.lastTrainedAt)} on{' '}
                {config.trainingTicketCount.toLocaleString()} tickets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm font-medium text-blue-100">
              {isEnabled ? 'Active' : 'Disabled'}
            </span>
            <Switch
              checked={isEnabled}
              onCheckedChange={(v) => setEnabled(v)}
              className="data-[state=checked]:bg-emerald-400"
            />
          </div>
        </div>

        {/* KPI row */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KpiCard
            icon={<Sparkles className="h-4 w-4" />}
            label="Tickets handled"
            value={metrics.ticketsHandled.toLocaleString()}
            sub={`${metrics.handlingRate}% of all incoming`}
            tone="light"
          />
          <KpiCard
            icon={<ThumbsUp className="h-4 w-4" />}
            label="Auto-resolved"
            value={`${metrics.resolutionRate}%`}
            sub="No human needed"
            tone="light"
          />
          <KpiCard
            icon={<Timer className="h-4 w-4" />}
            label="Avg first response"
            value={`${metrics.avgResponseTimeSec}s`}
            sub="vs 12 min human avg"
            tone="light"
          />
          <KpiCard
            icon={<DollarSign className="h-4 w-4" />}
            label="Cost saved"
            value={`$${metrics.costSavedUsd.toLocaleString()}`}
            sub="This calendar year"
            tone="light"
          />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="space-y-5 p-5 pt-0">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          {/* ── Left column ── */}
          <div className="space-y-5">
            {/* Configuration */}
            <ConfigCard config={config} />

            {/* Training */}
            <TrainingCard config={config} />

            {/* Integrations */}
            <IntegrationsCard integrations={config.integrations} />

            {/* Tone & sign-off */}
            <ToneCard tone={config.tone} signOff={config.signOff} />
          </div>

          {/* ── Right column ── */}
          <div className="space-y-5">
            {/* Weekly chart */}
            <WeeklyChart metrics={metrics} />

            {/* Stats sidebar */}
            <StatsSidebar metrics={metrics} />

            {/* Recent activity */}
            {!activityLoading && activity && (
              <ActivityLog entries={activity} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── KPI card (header) ────────────────────────────────────────────────────────

function KpiCard({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  tone: 'light' | 'dark';
}) {
  return (
    <div className="rounded-xl bg-white/10 p-3.5 ring-1 ring-white/10">
      <div className="flex items-center gap-1.5 text-blue-200 text-xs mb-2">
        {icon}
        {label}
      </div>
      <p className="text-2xl font-bold text-white leading-none">{value}</p>
      <p className="mt-1 text-xs text-blue-300">{sub}</p>
    </div>
  );
}

// ─── Configuration card ───────────────────────────────────────────────────────

function ConfigCard({ config }: { config: AIAgentConfig }) {
  const [threshold, setThreshold] = useState(config.confidenceThreshold);
  const [autoThreshold, setAutoThreshold] = useState(config.autoReplyThreshold);
  const [autoHandleCategories, setAutoHandleCategories] = useState(
    config.autoHandleCategories,
  );
  const [escalateCategories, setEscalateCategories] = useState(
    config.alwaysEscalateCategories,
  );

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Cog className="h-4 w-4 text-blue-600" />
          <h2 className="font-semibold text-base">Configuration</h2>
        </div>

        <div className="space-y-5">
          {/* Confidence threshold */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium">Suggestion threshold</label>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                {threshold}%
              </span>
            </div>
            <input
              type="range"
              min={40}
              max={95}
              step={5}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-blue-600"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              AI surfaces a suggestion to the agent when confidence ≥ {threshold}%.
            </p>
          </div>

          {/* Auto-reply threshold */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium">
                Auto-reply threshold
                <span className="ml-2 inline-flex items-center gap-0.5 rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                  <Zap className="h-2.5 w-2.5" />
                  High impact
                </span>
              </label>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                {autoThreshold}%
              </span>
            </div>
            <input
              type="range"
              min={75}
              max={99}
              step={1}
              value={autoThreshold}
              onChange={(e) => setAutoThreshold(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-emerald-600"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              AI sends the reply automatically (without agent review) when confidence ≥{' '}
              {autoThreshold}%.
            </p>
          </div>

          {/* Category rules */}
          <div className="grid gap-4 sm:grid-cols-2">
            <CategoryList
              title="Auto-handle categories"
              description="AI will draft or send replies for these"
              items={autoHandleCategories}
              color="blue"
              onAdd={(v) => setAutoHandleCategories((p) => [...p, v])}
              onRemove={(v) =>
                setAutoHandleCategories((p) => p.filter((x) => x !== v))
              }
            />
            <CategoryList
              title="Always escalate"
              description="AI skips these — sent to human agent"
              items={escalateCategories}
              color="red"
              onAdd={(v) => setEscalateCategories((p) => [...p, v])}
              onRemove={(v) =>
                setEscalateCategories((p) => p.filter((x) => x !== v))
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CategoryList({
  title,
  description,
  items,
  color,
  onAdd,
  onRemove,
}: {
  title: string;
  description: string;
  items: string[];
  color: 'blue' | 'red';
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [input, setInput] = useState('');

  const pill =
    color === 'blue'
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : 'bg-red-50 text-red-700 border-red-200';

  return (
    <div>
      <p className="mb-1 text-sm font-medium">{title}</p>
      <p className="mb-2 text-[11px] text-muted-foreground">{description}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className={cn(
              'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium',
              pill,
            )}
          >
            {item}
            <button
              type="button"
              onClick={() => onRemove(item)}
              className="rounded-full opacity-60 hover:opacity-100"
              aria-label={`Remove ${item}`}
            >
              <Minus className="h-3 w-3" />
            </button>
          </span>
        ))}
        {adding ? (
          <input
            autoFocus
            className="h-6 rounded-full border border-dashed border-input bg-transparent px-2 text-[11px] outline-none focus:border-blue-400"
            placeholder="Category…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && input.trim()) {
                onAdd(input.trim());
                setInput('');
                setAdding(false);
              }
              if (e.key === 'Escape') setAdding(false);
            }}
            onBlur={() => {
              if (input.trim()) onAdd(input.trim());
              setInput('');
              setAdding(false);
            }}
          />
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex h-6 items-center gap-0.5 rounded-full border border-dashed border-input px-2 text-[11px] text-muted-foreground hover:border-blue-400 hover:text-blue-600"
          >
            <Plus className="h-3 w-3" />
            Add
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Training card ────────────────────────────────────────────────────────────

function TrainingCard({ config }: { config: AIAgentConfig }) {
  const [training, setTraining] = useState(false);
  const [source, setSource] = useState<AITrainingSource>(config.trainingSource);
  const sources: { value: AITrainingSource; label: string; count: string }[] = [
    { value: 'last-30-days',  label: 'Last 30 days',  count: '~180 tickets' },
    { value: 'last-90-days',  label: 'Last 90 days',  count: '~487 tickets' },
    { value: 'last-180-days', label: 'Last 6 months', count: '~940 tickets' },
    { value: 'all-time',      label: 'All-time',       count: '~2,300 tickets' },
  ];

  function retrain() {
    setTraining(true);
    setTimeout(() => setTraining(false), 3000);
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-coral" />
            <h2 className="font-semibold text-base">Training</h2>
          </div>
          <Badge variant="secondary" className="text-[11px]">
            {config.modelVersion}
          </Badge>
        </div>

        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center gap-3 rounded-lg bg-coral/8 border border-coral/15 p-3">
            {training ? (
              <Loader2 className="h-5 w-5 animate-spin text-coral shrink-0" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium">
                {training ? 'Retraining model…' : 'Model is up to date'}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Last trained {relativeTime(config.lastTrainedAt)} on{' '}
                {config.trainingTicketCount.toLocaleString()} resolved tickets
              </p>
            </div>
          </div>

          {/* Training source */}
          <div>
            <p className="mb-2 text-sm font-medium">Training data source</p>
            <div className="grid grid-cols-2 gap-2">
              {sources.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSource(s.value)}
                  className={cn(
                    'flex flex-col items-start rounded-lg border p-2.5 text-left transition-colors',
                    source === s.value
                      ? 'border-violet-300 bg-coral/8 text-violet-800'
                      : 'border-border hover:bg-muted/40',
                  )}
                >
                  <span className="text-xs font-semibold">{s.label}</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">
                    {s.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Button
            className="w-full bg-violet-600 text-white hover:bg-violet-700"
            onClick={retrain}
            disabled={training}
          >
            {training ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Training…
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Retrain now
              </>
            )}
          </Button>

          <p className="text-[11px] text-muted-foreground text-center">
            Retraining takes ~2 minutes. The agent stays active during retraining
            and switches to the new model automatically.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Integrations card ────────────────────────────────────────────────────────

const INTEGRATION_CATEGORY_LABEL: Record<string, string> = {
  identity:    'Identity & Access',
  itsm:        'ITSM',
  comms:       'Communications',
  productivity:'Productivity',
};

const INTEGRATION_CATEGORY_COLOR: Record<string, string> = {
  identity:    'bg-blue-50 text-blue-700 border-blue-200',
  itsm:        'bg-orange-50 text-orange-700 border-orange-200',
  comms:       'bg-emerald-50 text-emerald-700 border-emerald-200',
  productivity:'bg-coral/8 text-coral-dark border-coral/25',
};

function IntegrationsCard({
  integrations,
}: {
  integrations: AIIntegration[];
}) {
  const [states, setStates] = useState<Record<string, boolean>>(
    Object.fromEntries(integrations.map((i) => [i.id, i.enabled])),
  );

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Layers className="h-4 w-4 text-orange-500" />
          <h2 className="font-semibold text-base">Connected Actions</h2>
          <span className="ml-auto text-[11px] text-muted-foreground">
            {Object.values(states).filter(Boolean).length} / {integrations.length} active
          </span>
        </div>

        <div className="space-y-2">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className={cn(
                'flex items-start gap-3 rounded-lg border p-3 transition-colors',
                states[integration.id]
                  ? 'border-border bg-card'
                  : 'border-border bg-muted/30 opacity-60',
              )}
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                <Cog className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium">{integration.name}</p>
                  <span
                    className={cn(
                      'inline-block rounded-full border px-1.5 py-0.5 text-[10px] font-semibold',
                      INTEGRATION_CATEGORY_COLOR[integration.category],
                    )}
                  >
                    {INTEGRATION_CATEGORY_LABEL[integration.category]}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {integration.description}
                </p>
                {states[integration.id] && (
                  <p className="mt-1 text-[10px] text-blue-600 font-medium">
                    AI action: {integration.actionLabel}
                  </p>
                )}
              </div>
              <Switch
                checked={states[integration.id] ?? false}
                onCheckedChange={(v) =>
                  setStates((prev) => ({ ...prev, [integration.id]: v }))
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Tone & sign-off card ─────────────────────────────────────────────────────

function ToneCard({
  tone: defaultTone,
  signOff: defaultSignOff,
}: {
  tone: AITone;
  signOff: string;
}) {
  const [tone, setTone] = useState<AITone>(defaultTone);
  const [signOff, setSignOff] = useState(defaultSignOff);

  const tones: { value: AITone; label: string; desc: string }[] = [
    { value: 'professional', label: 'Professional', desc: 'Formal, precise, corporate' },
    { value: 'friendly',     label: 'Friendly',     desc: 'Warm, helpful, approachable' },
    { value: 'technical',    label: 'Technical',    desc: 'Step-by-step, detail-oriented' },
  ];

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <MessageSquareText className="h-4 w-4 text-emerald-600" />
          <h2 className="font-semibold text-base">Response Tone</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {tones.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTone(t.value)}
                className={cn(
                  'flex flex-col items-start rounded-lg border p-3 text-left transition-colors',
                  tone === t.value
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : 'border-border hover:bg-muted/40',
                )}
              >
                <span className="text-sm font-semibold">{t.label}</span>
                <span className="mt-1 text-[10px] text-muted-foreground leading-relaxed">
                  {t.desc}
                </span>
              </button>
            ))}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Sign-off name</label>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-300"
              value={signOff}
              onChange={(e) => setSignOff(e.target.value)}
              placeholder="e.g. Topiadesk AI Support"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Appended to every AI-generated reply.
            </p>
          </div>

          <Button className="w-full" variant="outline">
            <FlaskConical className="h-4 w-4" />
            Preview sample response
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Weekly chart ─────────────────────────────────────────────────────────────

function WeeklyChart({ metrics }: { metrics: AIMetrics }) {
  const max = Math.max(...metrics.trend.map((d) => d.handled + d.escalated));

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          <h2 className="font-semibold text-sm">Weekly Activity</h2>
        </div>

        <div className="flex items-end gap-1.5 h-28">
          {metrics.trend.map((d) => {
            const handledPct = max > 0 ? (d.handled / max) * 100 : 0;
            const escalatedPct = max > 0 ? (d.escalated / max) * 100 : 0;
            return (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-col items-stretch justify-end gap-0.5" style={{ height: 88 }}>
                  <div
                    className="w-full rounded-sm bg-blue-500/20"
                    style={{ height: `${escalatedPct}%` }}
                    title={`${d.escalated} escalated`}
                  />
                  <div
                    className="w-full rounded-sm bg-blue-500"
                    style={{ height: `${handledPct}%` }}
                    title={`${d.handled} handled`}
                  />
                </div>
                <span className="text-[9px] text-muted-foreground tabular-nums">
                  {d.day.slice(0, 3)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-2 flex items-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-blue-500 shrink-0" />
            Handled
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-blue-500/20 shrink-0" />
            Escalated
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Stats sidebar ────────────────────────────────────────────────────────────

function StatsSidebar({ metrics }: { metrics: AIMetrics }) {
  const stats = [
    { icon: <Sparkles className="h-3.5 w-3.5" />,       label: 'Auto-handled',      value: metrics.autoResolved.toLocaleString(),       color: 'text-blue-600' },
    { icon: <Pencil className="h-3.5 w-3.5" />,         label: 'Suggested to agent', value: metrics.suggested.toLocaleString(),           color: 'text-coral' },
    { icon: <ShieldAlert className="h-3.5 w-3.5" />,    label: 'Escalated',          value: metrics.escalated.toLocaleString(),           color: 'text-amber-600' },
    { icon: <CircleSlash className="h-3.5 w-3.5" />,    label: 'Agent overrode',     value: metrics.overridden.toLocaleString(),          color: 'text-red-500' },
    { icon: <Star className="h-3.5 w-3.5" />,           label: 'AI CSAT score',      value: `${metrics.csatScore}/5`,                     color: 'text-emerald-600' },
    { icon: <Timer className="h-3.5 w-3.5" />,          label: 'Avg confidence',     value: `${metrics.avgConfidence}%`,                  color: 'text-blue-600' },
  ];

  return (
    <Card>
      <CardContent className="p-5">
        <h2 className="mb-3 text-sm font-semibold">Performance breakdown</h2>
        <div className="space-y-2.5">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className={cn('shrink-0', s.color)}>{s.icon}</span>
              <span className="flex-1 text-xs text-muted-foreground">{s.label}</span>
              <span className="text-sm font-semibold tabular-nums">{s.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Activity log ─────────────────────────────────────────────────────────────

const ACTION_META: Record<
  AIActivityAction,
  { label: string; color: string; dotColor: string }
> = {
  'auto-handled': { label: 'Auto-handled', color: 'text-blue-600',   dotColor: 'bg-blue-400' },
  'suggested':    { label: 'Suggested',    color: 'text-coral', dotColor: 'bg-violet-400' },
  'escalated':    { label: 'Escalated',    color: 'text-amber-600',  dotColor: 'bg-amber-400' },
  'overridden':   { label: 'Overridden',   color: 'text-red-500',    dotColor: 'bg-red-400' },
};

function ActivityLog({ entries }: { entries: AIActivityEntry[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? entries : entries.slice(0, 6);

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Recent AI activity</h2>
          </div>
        </div>

        <div className="space-y-2">
          {visible.map((entry) => {
            const meta = ACTION_META[entry.action];
            return (
              <div key={entry.id} className="flex items-start gap-2.5 py-1">
                <span
                  className={cn(
                    'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                    meta.dotColor,
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium leading-tight">
                    {entry.subject}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className={cn('font-semibold', meta.color)}>
                      {meta.label}
                    </span>
                    <span>·</span>
                    <span>{entry.confidence}% conf.</span>
                    <span>·</span>
                    <span>{relativeTime(entry.timestamp)}</span>
                    {entry.agentName && (
                      <>
                        <span>·</span>
                        <span>{entry.agentName}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                  {entry.responseTimeSec}s
                </span>
              </div>
            );
          })}
        </div>

        {entries.length > 6 && (
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="mt-3 flex w-full items-center justify-center gap-1 rounded-md border border-dashed py-1.5 text-xs text-muted-foreground hover:bg-muted/40 hover:text-foreground"
          >
            {expanded ? (
              <>Show less</>
            ) : (
              <>Show {entries.length - 6} more</>
            )}
          </button>
        )}
      </CardContent>
    </Card>
  );
}
