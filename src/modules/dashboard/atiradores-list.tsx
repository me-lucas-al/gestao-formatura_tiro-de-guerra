import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fragment } from "react";
import { PaymentStatus } from "@prisma/client";

export default function AtiradoresList({ atiradores, handleRowClick, expandedRowId }: { atiradores: any[], handleRowClick: (id: number) => void, expandedRowId: number | null }) {
 return (
   <div>
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
             {atiradores.map((atirador: any) => (
               <Fragment key={atirador.id}>
                 <TableRow
                   onClick={() => handleRowClick(atirador.id)}
                   className="cursor-pointer hover:bg-muted/50"
                 >
                   <TableCell className="font-medium">
                     {atirador.number}
                   </TableCell>
                   <TableCell>{atirador.name}</TableCell>
                   <TableCell>{atirador.familyMembers.length}</TableCell>
                   <TableCell className="text-right">
                     {atirador.payment?.status === PaymentStatus.PAID ? (
                       <Badge className="bg-green-600 text-white hover:bg-green-700">
                         Pago
                       </Badge>
                     ) : (
                       <Badge variant="destructive">Pendente</Badge>
                     )}
                   </TableCell>
                 </TableRow>
                 {expandedRowId === atirador.id && (
                   <TableRow>
                     <TableCell colSpan={4}>
                       <div className="p-4 bg-muted/30 rounded-md">
                         <h4 className="font-semibold mb-2">
                           Familiares de {atirador.name}:
                         </h4>
                         {atirador.familyMembers.length > 0 ? (
                           <ul className="list-disc pl-5">
                             {atirador.familyMembers.map((member: any) => (
                               <li key={member.id}>{member.name}</li>
                             ))}
                           </ul>
                         ) : (
                           <p>Nenhum familiar cadastrado.</p>
                         )}
                       </div>
                     </TableCell>
                   </TableRow>
                 )}
               </Fragment>
             ))}
           </TableBody>
         </Table>
       </CardContent>
     </Card>
   </div>
 );
}