import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputPasswordProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function InputPassword({ value, onChange, onKeyPress }: InputPasswordProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="password">Senha</Label>
      <Input
        id="password"
        type="password"
        placeholder="••••••••"
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
      />
    </div>
  );
}