'use client';

import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Card,
  CardContent,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type BadgeProps,
} from '@topiadesk/ui';
import { useAssets } from '@/lib/queries';
import { initials } from '@/lib/format';

type AssetStatus = 'in_use' | 'in_stock' | 'under_repair' | 'lost';

const statusVariant: Record<AssetStatus, BadgeProps['variant']> = {
  in_use: 'success',
  in_stock: 'secondary',
  under_repair: 'warning',
  lost: 'danger',
};

const statusLabel: Record<AssetStatus, string> = {
  in_use: 'In use',
  in_stock: 'In stock',
  under_repair: 'Under repair',
  lost: 'Lost',
};

export default function AssetsPage() {
  const { data: assets, isLoading } = useAssets();

  return (
    <div className="space-y-4 p-6">
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Assets</h1>
          <p className="text-sm text-muted-foreground">
            Hardware and equipment under management ({assets?.length ?? 0})
          </p>
        </div>
        <Button>Add asset</Button>
      </header>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4">
              <Skeleton className="h-96" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned to</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(assets ?? []).map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {a.tag}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{a.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.specifications}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm">{a.category}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[a.status]}>
                        {statusLabel[a.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {a.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>
                              {initials(a.assignedTo.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{a.assignedTo.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          &mdash;
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{a.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
