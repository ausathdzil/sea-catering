import { Loader } from "lucide-react";

export function Loading() {
  return (
    <div className="size-full flex flex-col items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  );
}
