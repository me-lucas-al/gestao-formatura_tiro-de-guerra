import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Fragment } from "react";
import { useGetAllAtiradores } from "@/hooks/atiradores/use-get-all-atiradores";
import AtiradorTableRow from "./table-row";
import FamilyMembersDetail from "../family-member/details";

export default function AtiradoresList() {
  const { data: atiradores } = useGetAllAtiradores();

  if (!atiradores) return null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Lista de Atiradores</h2>
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
                  <AtiradorTableRow atiradorId={atirador.id} />
                  <FamilyMembersDetail atiradorId={atirador.id} />
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
