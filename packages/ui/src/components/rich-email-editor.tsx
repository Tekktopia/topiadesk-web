'use client';

/**
 * RichEmailEditor — a contenteditable email composer that:
 *
 *  • Preserves rich-text paste from MS Outlook / Word.
 *    When the clipboard carries `text/html`, we inject the HTML verbatim so
 *    fonts, colours, sizes, tables, images and signatures render exactly as
 *    they appear in Outlook.
 *
 *  • Sanitises only the dangerous bits (script/iframe/event handlers, MSO
 *    conditional comments wrapping nothing useful) but keeps Outlook's
 *    layout/style markup intact.
 *
 *  • Exposes a built-in "Insert signature" dropdown driven by
 *    `useSignatures()` — signatures are stored in localStorage so each agent
 *    keeps their own.
 *
 *  • Returns the current value as HTML via `onChange`, so the email body is
 *    sent as proper MIME `text/html`.
 *
 * Usage:
 *   const [body, setBody] = useState('');
 *   <RichEmailEditor value={body} onChange={setBody} placeholder="Type your reply…" />
 */

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon, List,
  ListOrdered, Paperclip, Image as ImageIcon, Code, Quote,
  Type as TypeIcon, Palette, ChevronDown, Plus, Pencil, Trash2,
} from 'lucide-react';
import { Button } from './button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from './dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from './dropdown-menu';
import { Input } from './input';
import { Label } from './label';
import { Separator } from './separator';
import { cn } from '../lib/cn';

// ─── Signature storage ───────────────────────────────────────────────────────

export interface EmailSignature {
  id: string;
  name: string;
  html: string;
  isDefault?: boolean;
  createdAt: string;
}

const SIG_KEY = 'topiadesk.email-signatures';

export function useSignatures() {
  const [signatures, setSignatures] = useState<EmailSignature[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = JSON.parse(window.localStorage.getItem(SIG_KEY) ?? '[]');
      if (Array.isArray(stored)) setSignatures(stored);
    } catch { /* ignore */ }
  }, []);

  const persist = (next: EmailSignature[]) => {
    setSignatures(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SIG_KEY, JSON.stringify(next));
    }
  };

  const add = (name: string, html: string) => {
    const sig: EmailSignature = {
      id: `sig-${Date.now()}`,
      name: name.trim() || 'Untitled signature',
      html,
      isDefault: signatures.length === 0,
      createdAt: new Date().toISOString(),
    };
    persist([...signatures, sig]);
    return sig;
  };

  const update = (id: string, patch: Partial<Omit<EmailSignature, 'id' | 'createdAt'>>) => {
    persist(signatures.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const remove = (id: string) => {
    persist(signatures.filter((s) => s.id !== id));
  };

  const setDefault = (id: string) => {
    persist(signatures.map((s) => ({ ...s, isDefault: s.id === id })));
  };

  return { signatures, add, update, remove, setDefault };
}

// ─── HTML sanitiser — strips dangerous markup but preserves Outlook styling ─

function sanitiseClipboardHtml(html: string): string {
  // 1. Drop script/style/iframe tags entirely
  let out = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<link[^>]*>/gi, '')
    .replace(/<meta[^>]*>/gi, '');

  // 2. Strip MSO conditional comments wrapping nothing (Outlook clutter)
  out = out.replace(/<!--\[if[\s\S]*?endif\]-->/g, '');

  // 3. Remove inline event handlers (onclick, onload, etc.)
  out = out.replace(/\s+on[a-z]+\s*=\s*"[^"]*"/gi, '');
  out = out.replace(/\s+on[a-z]+\s*=\s*'[^']*'/gi, '');

  // 4. Strip javascript: URLs
  out = out.replace(/\s+(href|src)\s*=\s*"javascript:[^"]*"/gi, '');
  out = out.replace(/\s+(href|src)\s*=\s*'javascript:[^']*'/gi, '');

  // 5. If the html came inside <html><body>, pull just the body
  const bodyMatch = out.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) out = bodyMatch[1]!;

  return out.trim();
}

function htmlFromClipboard(e: React.ClipboardEvent): string | null {
  // Outlook + Word both write text/html to the clipboard
  const html = e.clipboardData.getData('text/html');
  return html || null;
}

// ─── Editor ──────────────────────────────────────────────────────────────────

export interface RichEmailEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minRows?: number;
  className?: string;
  /** Disable the built-in signature dropdown */
  disableSignatures?: boolean;
  /** Extra toolbar nodes (rendered after the built-in buttons) */
  toolbarExtras?: React.ReactNode;
}

export function RichEmailEditor({
  value,
  onChange,
  placeholder = 'Type your message…',
  minRows = 6,
  className,
  disableSignatures = false,
  toolbarExtras,
}: RichEmailEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const lastEmitted = useRef('');

  // Keep contentEditable in sync only when value is set from outside
  useEffect(() => {
    if (editorRef.current && value !== lastEmitted.current) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const emit = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    lastEmitted.current = html;
    onChange(html);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const html = htmlFromClipboard(e);
    if (html) {
      e.preventDefault();
      const clean = sanitiseClipboardHtml(html);
      // Use execCommand to preserve undo history + caret position
      document.execCommand('insertHTML', false, clean);
      emit();
    }
    // If no text/html on clipboard, let default plain-text paste happen
  };

  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    emit();
  };

  const insertSignatureHtml = (html: string) => {
    editorRef.current?.focus();
    // Append signature with a divider — Outlook convention is a blank line then "--"
    const wrapped = `<div><br></div><div data-tdz-signature="1">${html}</div>`;
    document.execCommand('insertHTML', false, wrapped);
    emit();
  };

  const promptForLink = () => {
    const url = window.prompt('Enter URL', 'https://');
    if (url) exec('createLink', url);
  };

  const promptForColor = () => {
    const col = window.prompt('Enter colour (hex or name)', '#1A1B2E');
    if (col) exec('foreColor', col);
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Toolbar */}
      <div className={cn(
        'flex flex-wrap items-center gap-0.5 border-b border-border/60 px-2 py-1',
        isFocused && 'bg-muted/20',
      )}>
        <ToolbarBtn onClick={() => exec('bold')}      title="Bold (⌘B)"><Bold className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('italic')}    title="Italic (⌘I)"><Italic className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('underline')} title="Underline (⌘U)"><UnderlineIcon className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn onClick={promptForColor}          title="Text colour"><Palette className="h-3 w-3" /></ToolbarBtn>

        <Separator orientation="vertical" className="mx-1 h-4" />

        <ToolbarBtn onClick={() => exec('insertUnorderedList')} title="Bulleted list"><List className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('insertOrderedList')}   title="Numbered list"><ListOrdered className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('formatBlock', 'blockquote')} title="Quote"><Quote className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('formatBlock', 'pre')}        title="Code block"><Code className="h-3 w-3" /></ToolbarBtn>

        <Separator orientation="vertical" className="mx-1 h-4" />

        <ToolbarBtn onClick={promptForLink} title="Insert link"><LinkIcon className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn title="Attach file"><Paperclip className="h-3 w-3" /></ToolbarBtn>
        <ToolbarBtn title="Inline image"><ImageIcon className="h-3 w-3" /></ToolbarBtn>

        {!disableSignatures && (
          <>
            <Separator orientation="vertical" className="mx-1 h-4" />
            <SignatureDropdown onInsert={insertSignatureHtml} />
          </>
        )}

        {toolbarExtras && (
          <>
            <Separator orientation="vertical" className="mx-1 h-4" />
            {toolbarExtras}
          </>
        )}
      </div>

      {/* Editable surface */}
      <div
        ref={editorRef}
        className={cn(
          'rich-email-editor min-h-[calc(1.5rem*var(--min-rows))] flex-1 overflow-y-auto px-4 py-3 text-sm leading-relaxed outline-none',
          'prose prose-sm max-w-none',
          '[&_table]:border-collapse [&_td]:border [&_td]:px-2 [&_td]:py-1',
          '[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground',
          '[&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-2 [&_pre]:font-mono [&_pre]:text-xs',
          'empty:before:pointer-events-none empty:before:text-muted-foreground/60',
        )}
        style={{ ['--min-rows' as never]: minRows }}
        contentEditable
        suppressContentEditableWarning
        onPaste={handlePaste}
        onInput={emit}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        data-placeholder={placeholder}
      />
    </div>
  );
}

function ToolbarBtn({
  children, onClick, title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title={title}
      onMouseDown={(e) => e.preventDefault()} // keep selection in editor
      onClick={onClick}
      className="h-7 w-7"
    >
      {children}
    </Button>
  );
}

// ─── Signature dropdown + manager ────────────────────────────────────────────

function SignatureDropdown({ onInsert }: { onInsert: (html: string) => void }) {
  const { signatures, add, remove, setDefault } = useSignatures();
  const [managerOpen, setManagerOpen] = useState(false);
  const [editing, setEditing] = useState<EmailSignature | null>(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-[11px]"
            onMouseDown={(e) => e.preventDefault()}
          >
            <TypeIcon className="h-3 w-3" />
            Signature
            <ChevronDown className="h-2.5 w-2.5 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Insert signature
          </DropdownMenuLabel>
          {signatures.length === 0 ? (
            <div className="px-2 py-3 text-[11px] text-muted-foreground">
              No signatures yet. Paste one from Outlook to get started.
            </div>
          ) : (
            signatures.map((s) => (
              <DropdownMenuItem key={s.id} onClick={() => onInsert(s.html)} className="flex flex-col items-start gap-0.5">
                <div className="flex w-full items-center gap-1.5">
                  <span className="flex-1 font-medium">{s.name}</span>
                  {s.isDefault && (
                    <span className="rounded-full bg-coral/15 px-1.5 text-[9px] font-semibold uppercase tracking-wide text-coral-dark">
                      Default
                    </span>
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { setEditing(null); setManagerOpen(true); }}>
            <Plus className="h-3.5 w-3.5" />
            Add a new signature
          </DropdownMenuItem>
          {signatures.length > 0 && (
            <DropdownMenuItem onClick={() => { setEditing(null); setManagerOpen(true); }}>
              <Pencil className="h-3.5 w-3.5" />
              Manage signatures
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <SignatureManagerDialog
        open={managerOpen}
        onOpenChange={setManagerOpen}
        signatures={signatures}
        editing={editing}
        onAdd={(name, html) => add(name, html)}
        onRemove={(id) => remove(id)}
        onSetDefault={(id) => setDefault(id)}
      />
    </>
  );
}

function SignatureManagerDialog({
  open, onOpenChange, signatures, editing, onAdd, onRemove, onSetDefault,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  signatures: EmailSignature[];
  editing: EmailSignature | null;
  onAdd: (name: string, html: string) => void;
  onRemove: (id: string) => void;
  onSetDefault: (id: string) => void;
}) {
  const [name, setName] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewHtml, setPreviewHtml] = useState('');

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? '');
      setPreviewHtml(editing?.html ?? '');
      // Set the preview contenteditable's innerHTML
      requestAnimationFrame(() => {
        if (previewRef.current) previewRef.current.innerHTML = editing?.html ?? '';
      });
    }
  }, [open, editing]);

  const handlePastePreview = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const html = htmlFromClipboard(e);
    if (html) {
      e.preventDefault();
      const clean = sanitiseClipboardHtml(html);
      document.execCommand('insertHTML', false, clean);
      setPreviewHtml(previewRef.current?.innerHTML ?? '');
    }
  };

  const handleSave = () => {
    if (!previewHtml.trim()) return;
    onAdd(name, previewHtml);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Email signatures</DialogTitle>
          <DialogDescription>
            Paste your signature directly from Outlook or Word — fonts, colours,
            tables, logos and images all carry over exactly as they appear in
            your mail client.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2 sm:grid-cols-[1fr_1.4fr]">
          {/* Existing signatures */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Your signatures
            </p>
            {signatures.length === 0 ? (
              <p className="text-xs text-muted-foreground">No signatures yet.</p>
            ) : (
              <ul className="space-y-1.5">
                {signatures.map((s) => (
                  <li key={s.id} className="flex items-center gap-2 rounded-md border p-2 text-xs">
                    <span className="flex-1 truncate font-medium">{s.name}</span>
                    {s.isDefault ? (
                      <span className="rounded-full bg-coral/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-coral-dark">
                        Default
                      </span>
                    ) : (
                      <Button type="button" variant="ghost" size="sm" className="h-6 px-1.5 text-[10px]"
                        onClick={() => onSetDefault(s.id)}>
                        Set default
                      </Button>
                    )}
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-600"
                      onClick={() => onRemove(s.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* New signature form */}
          <div className="space-y-2">
            <Label htmlFor="sig-name" className="text-xs">Name</Label>
            <Input id="sig-name" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Default reply signature" className="h-8 text-xs" />

            <Label className="text-xs">Paste your signature</Label>
            <div
              ref={previewRef}
              contentEditable
              suppressContentEditableWarning
              onPaste={handlePastePreview}
              onInput={() => setPreviewHtml(previewRef.current?.innerHTML ?? '')}
              className={cn(
                'min-h-[180px] rounded-md border bg-background px-3 py-2 text-sm outline-none',
                'focus:ring-1 focus:ring-ring',
                '[&_table]:border-collapse [&_td]:border [&_td]:px-2 [&_td]:py-1',
                'empty:before:pointer-events-none empty:before:text-muted-foreground/60',
              )}
              data-placeholder="Open Outlook → Signatures → copy yours → paste here"
            />
            <p className="text-[10px] text-muted-foreground">
              Tip: in Outlook, open <em>File → Options → Mail → Signatures</em>, select
              your signature, press <kbd>Ctrl + A</kbd> then <kbd>Ctrl + C</kbd>, and
              paste here. It will render exactly the same way for every reply.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>Close</Button>
          <Button type="button" size="sm" className="bg-coral text-white hover:bg-coral-dark"
            disabled={!previewHtml.trim()} onClick={handleSave}>
            <Plus className="h-3 w-3" />
            Save signature
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
