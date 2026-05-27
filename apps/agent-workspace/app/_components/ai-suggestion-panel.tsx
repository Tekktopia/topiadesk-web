'use client';

import { useState } from 'react';
import {
  Bot,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCheck,
  X,
  Pencil,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { Button, Badge, cn } from '@topiadesk/ui';
import { useAISuggestion } from '@/lib/queries';
import { relativeTime } from '@/lib/format';

interface AISuggestionPanelProps {
  ticketId: string;
  className?: string;
}

/**
 * Shows the AI-generated response suggestion for a ticket.
 * Appears between the conversation thread and composer when a pending
 * suggestion exists. Collapses/dismisses based on agent action.
 */
export function AISuggestionPanel({ ticketId, className }: AISuggestionPanelProps) {
  const { data: suggestion, isLoading } = useAISuggestion(ticketId);

  const [localStatus, setLocalStatus] = useState<
    'pending' | 'sent' | 'dismissed' | 'edited-and-sent' | null
  >(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState('');

  if (isLoading || !suggestion) return null;

  const effectiveStatus = localStatus ?? suggestion.status;
  if (effectiveStatus === 'dismissed') return null;

  const confidence = suggestion.confidence;
  const confidenceColor =
    confidence >= 90
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : confidence >= 70
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-red-50 text-red-700 border-red-200';
  const confidenceDot =
    confidence >= 90
      ? 'bg-emerald-400'
      : confidence >= 70
        ? 'bg-amber-400'
        : 'bg-red-400';

  const isAutoReply = suggestion.suggestedAction === 'auto-reply';

  // ── Sent / edited-sent states ────────────────────────────────────────────
  if (effectiveStatus === 'sent' || effectiveStatus === 'edited-and-sent') {
    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700',
          className,
        )}
      >
        <CheckCheck className="h-4 w-4 shrink-0" />
        <span className="flex-1">
          {effectiveStatus === 'edited-and-sent'
            ? 'AI suggestion edited and sent.'
            : 'AI suggestion sent to customer.'}
        </span>
        <button
          type="button"
          onClick={() => setLocalStatus('dismissed')}
          className="rounded p-0.5 hover:bg-emerald-100"
          aria-label="Dismiss"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-violet-200 bg-violet-50/60 shadow-sm',
        className,
      )}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-2.5 border-b border-violet-100 px-4 py-2.5">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-violet-100">
          <Bot className="h-4 w-4 text-violet-600" />
        </div>

        <div className="flex flex-1 items-center gap-2 min-w-0">
          <span className="text-sm font-semibold text-violet-900">
            AI Suggestion
          </span>
          {isAutoReply && (
            <span className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-700">
              <Zap className="h-2.5 w-2.5" />
              Auto-reply ready
            </span>
          )}
          <span
            className={cn(
              'ml-auto inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold shrink-0',
              confidenceColor,
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', confidenceDot)} />
            {confidence}% confident
          </span>
        </div>

        <button
          type="button"
          onClick={() => setLocalStatus('dismissed')}
          className="grid h-6 w-6 place-items-center rounded text-violet-400 hover:bg-violet-100 hover:text-violet-600"
          aria-label="Dismiss AI suggestion"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── Sub-header ── */}
      <div className="flex items-center gap-3 px-4 py-1.5 text-[11px] text-violet-500">
        <span>Generated {relativeTime(suggestion.generatedAt)}</span>
        <span>·</span>
        <span>
          Based on {suggestion.sourceTicketNumbers.length} similar ticket
          {suggestion.sourceTicketNumbers.length !== 1 ? 's' : ''}
          {suggestion.kbArticles.length > 0
            ? ` · ${suggestion.kbArticles.length} KB article`
            : ''}
        </span>
        <button
          type="button"
          onClick={() => setSourcesOpen((o) => !o)}
          className="ml-auto flex items-center gap-0.5 font-medium hover:text-violet-700"
        >
          {sourcesOpen ? 'Hide' : 'Show'} sources
          {sourcesOpen ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>
      </div>

      {/* ── Sources accordion ── */}
      {sourcesOpen && (
        <div className="mx-4 mb-2 rounded-md border border-violet-100 bg-white p-3 text-xs text-violet-700">
          <p className="mb-1.5 font-semibold text-violet-800">Reasoning</p>
          <p className="mb-3 text-violet-600 leading-relaxed">
            {suggestion.reasoning}
          </p>
          {suggestion.sourceTicketNumbers.length > 0 && (
            <>
              <p className="mb-1 font-semibold text-violet-800">
                Similar resolved tickets
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {suggestion.sourceTicketNumbers.map((n) => (
                  <span
                    key={n}
                    className="inline-flex items-center gap-0.5 rounded border border-violet-200 bg-violet-50 px-1.5 py-0.5 font-mono text-[10px] text-violet-600"
                  >
                    {n}
                    <ExternalLink className="h-2.5 w-2.5" />
                  </span>
                ))}
              </div>
            </>
          )}
          {suggestion.kbArticles.length > 0 && (
            <>
              <p className="mb-1 font-semibold text-violet-800">KB articles referenced</p>
              <div className="flex flex-wrap gap-1.5">
                {suggestion.kbArticles.map((id) => (
                  <span
                    key={id}
                    className="inline-flex items-center gap-0.5 rounded border border-violet-200 bg-violet-50 px-1.5 py-0.5 font-mono text-[10px] text-violet-600"
                  >
                    {id}
                    <ExternalLink className="h-2.5 w-2.5" />
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Suggested response ── */}
      <div className="px-4 pb-1">
        {editMode ? (
          <textarea
            className="w-full rounded-md border border-violet-200 bg-white p-3 text-sm text-foreground leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
            rows={Math.min(12, (editedText || suggestion.suggestedResponse).split('\n').length + 2)}
            value={editedText || suggestion.suggestedResponse}
            onChange={(e) => setEditedText(e.target.value)}
            autoFocus
          />
        ) : (
          <div className="rounded-md border border-violet-100 bg-white/70 p-3">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {suggestion.suggestedResponse}
            </p>
          </div>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-3">
        {editMode ? (
          <>
            <Button
              size="sm"
              className="h-8 bg-violet-600 text-xs text-white hover:bg-violet-700"
              onClick={() => {
                setEditMode(false);
                setLocalStatus('edited-and-sent');
              }}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Send edited reply
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                setEditMode(false);
                setEditedText('');
              }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              className={cn(
                'h-8 text-xs text-white',
                isAutoReply
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-violet-600 hover:bg-violet-700',
              )}
              onClick={() => setLocalStatus('sent')}
            >
              {isAutoReply ? (
                <>
                  <Zap className="h-3.5 w-3.5" />
                  Auto-send
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Send this response
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs border-violet-200 text-violet-700 hover:bg-violet-50"
              onClick={() => {
                setEditMode(true);
                setEditedText(suggestion.suggestedResponse);
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit &amp; send
            </Button>
            <button
              type="button"
              onClick={() => setLocalStatus('dismissed')}
              className="ml-auto text-[11px] text-violet-400 hover:text-violet-600"
            >
              Dismiss
            </button>
          </>
        )}
      </div>
    </div>
  );
}
