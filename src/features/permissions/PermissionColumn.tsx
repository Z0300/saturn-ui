import type { ColumnDef } from "@tanstack/react-table";
import type { Permission } from "@/types";

import { Button } from "@/components/ui/button";
import { Can } from "@/components/rbac/can";
import { Badge } from "@/components/ui/badge";

import { PencilIcon, TrashIcon } from "lucide-react";
import { Permissions } from "@/constants/permissions";

type Props = {
  onEdit: (p: Permission) => void;
  onDelete: (p: Permission) => void;
};

export const createPermissionColumns = ({
  onEdit,
  onDelete,
}: Props): ColumnDef<Permission>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    header: "Resource",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.name.split(":")[0]}</Badge>
    ),
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.name.split(":")[1]}</Badge>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Can permission={Permissions.PERMISSIONS_UPDATE}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original)}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        </Can>

        <Can permission={Permissions.PERMISSIONS_DELETE}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(row.original)}
            className="text-destructive hover:text-destructive"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </Can>
      </div>
    ),
  },
];
