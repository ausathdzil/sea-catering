'use client';

import { LoaderIcon } from 'lucide-react';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User } from '@/db/schema';
import { updateUser, UpdateUserFormStateOrNull } from '../../admin-actions';

const initialState: UpdateUserFormStateOrNull = {
  success: false,
  message: '',
  errors: {},
};

export function EditUserForm({ user }: { user: User }) {
  const updateUserWithId = updateUser.bind(null, user.id);
  const [state, formAction, isPending] = useActionState(
    updateUserWithId,
    initialState
  );

  const [role, setRole] = useState(user.role || 'user');

  useEffect(() => {
    if (state && state.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form className="space-y-4 w-full max-w-md" action={formAction}>
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" defaultValue={user.name} disabled />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" defaultValue={user.email} disabled />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger id="role" className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <input type="hidden" name="role" value={role} />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" type="button" disabled={isPending} asChild>
          <Link href={`/dashboard/users`}>Cancel</Link>
        </Button>
        <Button
          className="min-w-20 cursor-pointer"
          type="submit"
          disabled={isPending}
        >
          {isPending ? <LoaderIcon className="animate-spin" /> : 'Save'}
        </Button>
      </div>
    </form>
  );
}
