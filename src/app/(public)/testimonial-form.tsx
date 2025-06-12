import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export function TestimonialForm() {
  return (
    <form className="w-full max-w-2xl space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" name="name" placeholder="John Doe" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Write your message here"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="rating">Rating</Label>
        <Select id="rating" name="rating">
          <option value="5">⭐⭐⭐⭐⭐</option>
          <option value="4">⭐⭐⭐⭐</option>
          <option value="3">⭐⭐⭐</option>
          <option value="2">⭐⭐</option>
          <option value="1">⭐</option>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
