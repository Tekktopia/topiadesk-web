'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Clock,
  Eye,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@topiadesk/ui';
import { kbArticles, kbCategories } from '@/lib/mock-data';
import { shortDate } from '@/lib/format';

export default function KbArticlePage() {
  const params = useParams<{ slug: string }>();
  const article = kbArticles.find((a) => a.slug === params.slug);
  const [rating, setRating] = useState<'up' | 'down' | null>(null);

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center lg:px-8">
        <p className="text-sm text-muted-foreground">Article not found.</p>
        <Button asChild variant="outline" size="sm" className="mt-3">
          <Link href="/kb">
            <ArrowLeft className="h-3 w-3" />
            Back to help centre
          </Link>
        </Button>
      </div>
    );
  }

  const category = kbCategories.find((c) => c.slug === article.category);
  const related = kbArticles
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 4);

  return (
    <div className="bg-muted/20">
      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-1 text-[11px] text-muted-foreground"
        >
          <Link href="/kb" className="hover:text-foreground">
            Help centre
          </Link>
          {category && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link
                href={`/kb?category=${category.slug}`}
                className="hover:text-foreground"
              >
                {category.label}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="line-clamp-1 text-foreground">{article.title}</span>
        </nav>

        <article className="space-y-6">
          <header className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {category && (
                <Badge variant="outline" className="text-[10px]">
                  {category.label}
                </Badge>
              )}
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                Updated {shortDate(article.updatedAt)}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Eye className="h-3 w-3" />
                {article.views.toLocaleString()} views
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight">
              {article.title}
            </h1>
            <p className="text-sm text-muted-foreground">{article.summary}</p>
          </header>

          <Card>
            <CardContent className="prose-sm space-y-4 p-6 text-sm leading-relaxed">
              {article.body.split('\n\n').map((para, i) => {
                if (para.startsWith('# ')) {
                  return null;
                }
                if (para.startsWith('## ')) {
                  return (
                    <h2 key={i} className="font-display text-lg font-bold">
                      {para.replace(/^## /, '')}
                    </h2>
                  );
                }
                if (/^\d+\./.test(para)) {
                  const items = para.split('\n').map((line) =>
                    line.replace(/^\d+\.\s*/, ''),
                  );
                  return (
                    <ol key={i} className="ml-5 list-decimal space-y-1.5">
                      {items.map((it, j) => (
                        <li key={j}>{it}</li>
                      ))}
                    </ol>
                  );
                }
                if (para.startsWith('- ')) {
                  const items = para.split('\n').map((line) =>
                    line.replace(/^-\s*/, ''),
                  );
                  return (
                    <ul key={i} className="ml-5 list-disc space-y-1.5">
                      {items.map((it, j) => (
                        <li key={j}>{it}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={i}>{para}</p>;
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b py-3">
              <CardTitle className="text-sm">Was this article helpful?</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {rating === null ? (
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRating('up')}
                  >
                    <ThumbsUp className="h-3 w-3" />
                    Yes, it helped
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRating('down')}
                  >
                    <ThumbsDown className="h-3 w-3" />
                    Not really
                  </Button>
                  <span className="text-[11px] text-muted-foreground">
                    {article.helpfulPct}% of readers found this helpful
                  </span>
                </div>
              ) : rating === 'up' ? (
                <p className="text-sm text-emerald-700">
                  Thanks for letting us know — we&rsquo;re glad it helped.
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Sorry it didn&rsquo;t solve your problem.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Submit a request and a real human will help.
                  </p>
                  <Button asChild size="sm">
                    <Link
                      href={`/submit?subject=${encodeURIComponent(article.title)}`}
                    >
                      Submit a request
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {related.length > 0 && (
            <Card>
              <CardHeader className="border-b py-3">
                <CardTitle className="text-sm">Related articles</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {related.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/kb/${a.slug}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40"
                      >
                        <BookOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="flex-1 truncate text-sm">{a.title}</span>
                        <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </article>
      </div>
    </div>
  );
}

