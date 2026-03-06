import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Fragment } from "react";
import AtiradorTableRow from "./table-row";
import FamilyMembersDetail from "../family-member/details";

import { useAtiradorModal } from "@/contexts/atirador-modal-context";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AtiradorWithRelations } from "@packages/types";

export default function AtiradoresList({ atiradores }: { atiradores: AtiradorWithRelations[] }) {
  const { openCreateModal } = useAtiradorModal();

  if (!atiradores) return null;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Lista de Atiradores</h2>
        <Button onClick={openCreateModal}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Atirador
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Número</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Familiares</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {atiradores.map((atirador) => (
                <Fragment key={atirador.id}>
                  <AtiradorTableRow atirador={atirador} />
                  <FamilyMembersDetail atirador={atirador} />
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
