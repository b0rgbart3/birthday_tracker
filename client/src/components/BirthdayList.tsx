import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowUpDown } from "lucide-react";

interface Birthday {
  _id: string;
  name: string;
  date: string;
}

interface BirthdayListProps {
  birthdays: Birthday[];
  onDelete: (id: string) => void;
  onSort: (key: "name" | "date") => void;
}

export const BirthdayList: React.FC<BirthdayListProps> = ({
  birthdays,
  onDelete,
  onSort,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 rounded-lg border border-blue-500/30 overflow-hidden shadow-xl">
      <Table>
        <TableHeader className="bg-slate-800">
          <TableRow className="border-b border-blue-500/20">
            <TableHead className="text-blue-300 font-bold">
              <Button
                variant="ghost"
                onClick={() => onSort("name")}
                className="hover:text-white hover:bg-blue-900/30 transition-colors"
              >
                Name <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-blue-300 font-bold">
              <Button
                variant="ghost"
                onClick={() => onSort("date")}
                className="hover:text-white hover:bg-blue-900/30 transition-colors"
              >
                Birthday <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right text-blue-300 font-bold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {birthdays.map((b) => (
            <TableRow
              key={b._id}
              className="border-b border-white/5 hover:bg-blue-900/10 transition-colors group"
            >
              <TableCell className="font-medium text-white">{b.name}</TableCell>
              <TableCell className="text-gray-400">
                {new Date(b.date).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDelete(b._id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-red-50 text-red-600 shadow-sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {birthdays.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center py-8 text-gray-500 italic"
              >
                No birthdays tracked yet. Add one above!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
