import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputAdminNameProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputAdminName({ value, onChange }: InputAdminNameProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="adminName">Nome de usuário</Label>
      <Input
        id="adminName"
        type="text"
        placeholder="seu_usuario"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}