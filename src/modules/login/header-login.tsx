import { Lock } from "lucide-react";

export default function HeaderLogin() {
 return (
   <div className="text-center mb-8">
     <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
       <Lock className="w-6 h-6 text-blue-600" />
     </div>
     <h1 className="text-2xl font-semibold text-gray-900">Entrar</h1>
     <p className="text-gray-500 mt-2">Digite suas credenciais</p>
   </div>
 );
}