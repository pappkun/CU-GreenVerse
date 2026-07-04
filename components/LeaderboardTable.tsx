"use client";

import { useState } from "react";
import { LeaderboardEntry } from "@/types";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Leaf, Medal } from "lucide-react";

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
}

export function LeaderboardTable({ data }: LeaderboardTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<LeaderboardEntry>[] = [
    {
      accessorKey: "rank",
      header: "Rank",
      cell: ({ row }) => {
        const rank = row.getValue("rank") as number;
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm bg-muted">
            {rank === 1 ? (
              <Medal className="h-5 w-5 text-yellow-500" />
            ) : rank === 2 ? (
              <Medal className="h-5 w-5 text-gray-400" />
            ) : rank === 3 ? (
              <Medal className="h-5 w-5 text-amber-600" />
            ) : (
              rank
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        const avatar = row.original.avatar;

        return (
          <div className="flex items-center gap-3 font-medium">
            {avatar && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            )}
            {!avatar && row.original.type !== "individual" && (
              <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                <span className="text-xs text-primary font-bold">
                  {name.substring(0, 1)}
                </span>
              </div>
            )}
            {name}
          </div>
        );
      },
    },
    {
      accessorKey: "greenCredits",
      header: () => <div className="text-right">Green Credits</div>,
      cell: ({ row }) => {
        const credits = parseFloat(row.getValue("greenCredits"));
        return (
          <div className="text-right font-bold text-primary flex items-center justify-end gap-1">
            {credits.toLocaleString()}
          </div>
        );
      },
    },
    {
      accessorKey: "carbonSaved",
      header: () => <div className="text-right">Carbon Saved</div>,
      cell: ({ row }) => {
        const carbon = parseFloat(row.getValue("carbonSaved"));
        return (
          <div className="text-right font-medium text-emerald-600 dark:text-emerald-400">
            {carbon.toLocaleString()}{" "}
            <span className="text-xs text-muted-foreground ml-1">kgCO₂</span>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="font-semibold text-muted-foreground"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="transition-colors hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="sm:hidden divide-y divide-border/50">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const rank = row.getValue("rank") as number;
              const name = row.getValue("name") as string;
              const credits = parseFloat(row.getValue("greenCredits"));
              const carbon = parseFloat(row.getValue("carbonSaved"));
              const avatar = row.original.avatar;

              return (
                <div
                  key={row.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
                      {rank === 1 ? (
                        <Medal className="h-4 w-4 text-yellow-500" />
                      ) : rank === 2 ? (
                        <Medal className="h-4 w-4 text-gray-400" />
                      ) : rank === 3 ? (
                        <Medal className="h-4 w-4 text-amber-600" />
                      ) : (
                        rank
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {avatar ? (
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={avatar} alt={name} />
                            <AvatarFallback>
                              {name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        ) : row.original.type !== "individual" ? (
                          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                            <span className="text-[11px] font-bold text-primary">
                              {name.substring(0, 1)}
                            </span>
                          </div>
                        ) : null}
                        <p className="truncate text-sm font-semibold">{name}</p>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {credits.toLocaleString()} pts •{" "}
                        {carbon.toLocaleString()} kgCO₂
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                    <Leaf className="h-3.5 w-3.5" />
                    {credits.toLocaleString()}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results.
            </div>
          )}
        </div>
      </div>

      {data.length > pagination.pageSize && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
