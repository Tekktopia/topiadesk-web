'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import {
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  cn,
} from '@topiadesk/ui';
import { useTopology, useDevices } from '@/lib/queries';
import type { DeviceStatus, TopologyNode } from '@/lib/mock-data';

const STATUS_COLORS: Record<DeviceStatus, string> = {
  up:      '#10b981',
  down:    '#ef4444',
  warning: '#f59e0b',
  paused:  '#94a3b8',
  unknown: '#cbd5e1',
};

const SITES = ['Lagos HQ', 'Ikeja Branch', 'Nairobi Office'];

// ─── SVG Node ─────────────────────────────────────────────────────────────────

function TopoNode({
  node,
  selected,
  onClick,
}: {
  node: TopologyNode;
  selected: boolean;
  onClick: (n: TopologyNode) => void;
}) {
  const status = node.status;
  const color = STATUS_COLORS[status];
  const isCloud   = node.type === 'cloud';
  const isCluster = node.type === 'cluster';

  const r = isCloud ? 28 : isCluster ? 22 : 20;
  const strokeW = selected ? 2.5 : 1.5;
  const strokeC = selected ? '#6366f1' : '#e2e8f0';
  const fillC   = isCloud ? '#f8fafc' : isCluster ? '#f1f5f9' : '#fff';

  return (
    <g
      onClick={() => onClick(node)}
      style={{ cursor: node.deviceId ? 'pointer' : 'default' }}
    >
      {/* Pulse ring for DOWN */}
      {status === 'down' && !isCloud && (
        <circle cx={node.x} cy={node.y} r={r + 6} fill={color} opacity={0.2}>
          <animate attributeName="r" values={`${r + 4};${r + 10};${r + 4}`} dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.25;0;0.25" dur="2s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Node circle */}
      <circle
        cx={node.x} cy={node.y} r={r}
        fill={fillC}
        stroke={strokeC}
        strokeWidth={strokeW}
      />

      {/* Status dot */}
      {!isCloud && (
        <circle cx={node.x + r - 5} cy={node.y - r + 5} r={5} fill={color} stroke="#fff" strokeWidth={1.5} />
      )}

      {/* Label */}
      <text x={node.x} y={node.y + r + 14} textAnchor="middle" fontSize={9} fontWeight={600} fill="#334155">
        {node.label}
      </text>
      {node.sublabel && (
        <text x={node.x} y={node.y + r + 24} textAnchor="middle" fontSize={8} fill="#94a3b8">
          {node.sublabel}
        </text>
      )}
    </g>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TopologyPage() {
  const [site, setSite] = useState('Lagos HQ');
  const [selected, setSelected] = useState<TopologyNode | null>(null);
  const topology = useTopology(site);
  const devices  = useDevices();

  const topo = topology.data;

  const selectedDevice = useMemo(() => {
    if (!selected?.deviceId || !devices.data) return null;
    return devices.data.find((d) => d.id === selected.deviceId) ?? null;
  }, [selected, devices.data]);

  // Derive node lookup for edge rendering
  const nodeMap = useMemo(() => {
    const m: Record<string, TopologyNode> = {};
    topo?.nodes.forEach((n) => { m[n.id] = n; });
    return m;
  }, [topo]);

  const handleSelect = (n: TopologyNode) => {
    setSelected((prev) => (prev?.id === n.id ? null : n));
  };

  return (
    <div className="space-y-5 p-5">
      {/* Gradient header */}
      <div className="relative -mx-5 -mt-5 mb-1 overflow-hidden bg-gradient-to-br from-blue-700 to-blue-800 px-5 py-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">Monitoring</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">Network Topology</h1>
            <p className="mt-0.5 text-sm text-white/70">Visual map of your network infrastructure per site</p>
          </div>
          <Button variant="outline" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white" asChild>
            <Link href="/monitoring/devices">View device list</Link>
          </Button>
        </div>
      </div>

      {/* Site tabs */}
      <div className="flex rounded-lg border p-0.5 text-xs w-fit">
        {SITES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => { setSite(s); setSelected(null); }}
            className={cn(
              'rounded-md px-3 py-1.5 font-medium transition-colors',
              site === s ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-4">
        {/* SVG canvas */}
        <Card className="overflow-hidden lg:col-span-3">
          <CardContent className="p-0">
            {topology.isLoading ? (
              <div className="flex items-center justify-center p-24">
                <Skeleton className="h-64 w-full" />
              </div>
            ) : !topo ? (
              <div className="flex flex-col items-center gap-2 py-24 text-muted-foreground">
                <Info className="h-6 w-6" />
                <p className="text-sm">No topology data for this site.</p>
              </div>
            ) : (
              <div className="overflow-auto">
                <svg
                  viewBox="0 0 900 560"
                  className="w-full min-w-[500px]"
                  style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}
                >
                  {/* Grid dots */}
                  <defs>
                    <pattern id="topo-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <circle cx="1" cy="1" r="1" fill="#cbd5e1" opacity={0.4} />
                    </pattern>
                  </defs>
                  <rect width="900" height="560" fill="url(#topo-grid)" />

                  {/* Edges */}
                  {topo.edges.map((edge) => {
                    const src = nodeMap[edge.source];
                    const tgt = nodeMap[edge.target];
                    if (!src || !tgt) return null;

                    const util = edge.utilization;
                    const edgeColor =
                      util === 0 ? '#ef4444' :
                      util > 75  ? '#f59e0b' :
                      util > 50  ? '#3b82f6' :
                      '#10b981';

                    const midX = (src.x + tgt.x) / 2;
                    const midY = (src.y + tgt.y) / 2;

                    return (
                      <g key={edge.id}>
                        <line
                          x1={src.x} y1={src.y}
                          x2={tgt.x} y2={tgt.y}
                          stroke={edgeColor}
                          strokeWidth={2}
                          strokeOpacity={0.7}
                          strokeDasharray={util === 0 ? '6 4' : undefined}
                        />
                        <text x={midX} y={midY - 4} textAnchor="middle" fontSize={8} fill={edgeColor} fontWeight={600}>
                          {util === 0 ? 'DOWN' : `${util}%`}
                        </text>
                        <text x={midX} y={midY + 8} textAnchor="middle" fontSize={7} fill="#94a3b8">
                          {edge.bandwidth}
                        </text>
                      </g>
                    );
                  })}

                  {/* Nodes */}
                  {topo.nodes.map((node) => (
                    <TopoNode
                      key={node.id}
                      node={node}
                      selected={selected?.id === node.id}
                      onClick={handleSelect}
                    />
                  ))}
                </svg>
              </div>
            )}
          </CardContent>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 border-t px-4 py-3 text-[11px] text-muted-foreground">
            {[
              { color: '#10b981', label: 'Up' },
              { color: '#f59e0b', label: 'Warning' },
              { color: '#ef4444', label: 'Down' },
              { color: '#94a3b8', label: 'Paused / Unknown' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: l.color }} />
                {l.label}
              </div>
            ))}
            <span className="mx-2 text-border">|</span>
            <span>Edge: link utilisation % (— dashed = link down)</span>
          </div>
        </Card>

        {/* Info panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="border-b py-3">
              <CardTitle className="text-sm">
                {selected
                  ? selected.label
                  : 'Click a node to inspect'}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              {!selected ? (
                <p className="text-xs text-muted-foreground">Select any device node on the topology diagram to view its details here.</p>
              ) : !selectedDevice ? (
                <p className="text-xs text-muted-foreground">
                  {selected.sublabel ?? 'No additional data.'}
                </p>
              ) : (
                <div className="space-y-3 text-xs">
                  {[
                    { label: 'IP',       value: selectedDevice.ip },
                    { label: 'Vendor',   value: selectedDevice.vendor },
                    { label: 'Model',    value: selectedDevice.model },
                    { label: 'OS',       value: selectedDevice.os ?? '—' },
                    { label: 'Group',    value: selectedDevice.group },
                    { label: 'Location', value: selectedDevice.location },
                    { label: 'Uptime',   value: `${selectedDevice.uptimePct.toFixed(2)}%` },
                    { label: 'Sensors',  value: `${selectedDevice.sensors.length} monitored` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between gap-2">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="text-right font-medium text-foreground">{value}</span>
                    </div>
                  ))}

                  <div className="pt-1">
                    <Badge
                      variant={
                        selectedDevice.status === 'up' ? 'success' :
                        selectedDevice.status === 'down' ? 'danger' :
                        selectedDevice.status === 'warning' ? 'warning' : 'secondary'
                      }
                    >
                      {selectedDevice.status.charAt(0).toUpperCase() + selectedDevice.status.slice(1)}
                    </Badge>
                  </div>

                  <Button size="sm" className="mt-2 w-full text-xs" asChild>
                    <Link href={`/monitoring/devices/${selectedDevice.id}`}>
                      View device detail <ChevronRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Site summary */}
          {topo && (
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Site summary</CardTitle>
              </CardHeader>
              <CardContent className="py-4 space-y-2 text-xs">
                {(
                  [
                    { label: 'Total nodes',  value: topo.nodes.filter((n) => n.type !== 'cloud' && n.type !== 'cluster').length },
                    { label: 'Up',           value: topo.nodes.filter((n) => n.status === 'up'      && n.type !== 'cloud' && n.type !== 'cluster').length, color: 'text-emerald-600' },
                    { label: 'Warning',      value: topo.nodes.filter((n) => n.status === 'warning' && n.type !== 'cloud' && n.type !== 'cluster').length, color: 'text-amber-600' },
                    { label: 'Down',         value: topo.nodes.filter((n) => n.status === 'down'    && n.type !== 'cloud' && n.type !== 'cluster').length, color: 'text-red-600' },
                    { label: 'Links',        value: topo.edges.length },
                    { label: 'Links down',   value: topo.edges.filter((e) => e.utilization === 0).length, color: 'text-red-600' },
                  ] as { label: string; value: number; color?: string }[]
                ).map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span className={cn('font-semibold tabular-nums', color)}>{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
