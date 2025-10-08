export default function ButtonSubmit({ loading, disabled, onClick }: { loading: boolean; disabled: boolean; onClick: () => void }) {
 return (
   <div>
     <button
       onClick={onClick}
       disabled={loading || disabled}
       className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
     >
       {loading ? "Entrando..." : "Entrar"}
     </button>
   </div>
 );
}