"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addTransaction } from "@/lib/actions/transactions";
import { Dictionary } from "@/lib/i18n/dictionaries";
import { LoginDialog } from "@/components/auth/login-dialog";
import { format } from "date-fns";

export function TopUpDialog({ user, dict }: { user: any; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    formData.append("type", "brought_forward");
    formData.append("date", format(new Date(), "yyyy-MM-dd"));

    await addTransaction(formData);
    setIsSubmitting(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0 sm:w-auto sm:px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-800"
          >
            <Plus className="h-3 w-3 sm:mr-1" />
            <span className="hidden sm:inline">
              {dict.dashboard.cashflow || "Top-up"}
            </span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {dict.transaction.broughtForward || "Brought Forward"}
          </DialogTitle>
        </DialogHeader>
        <form
          action={async (formData) => {
            if (!user) {
              document.getElementById("login-dialog-trigger-topup")?.click();
              return;
            }
            await handleSubmit(formData);
          }}
          className="space-y-4 py-4"
        >
          <div className="space-y-2">
            <Label htmlFor="amount">
              {dict.transaction.amount || "Amount"}
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              required
              placeholder="5000.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">
              {dict.transaction.category || "Category"}
            </Label>
            <Select name="category" required defaultValue="transfer">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transfer">
                  {(dict.transaction.categories.brought_forward as any)[
                    "transfer"
                  ] || "Transfer from other account"}
                </SelectItem>
                <SelectItem value="initial">
                  {(dict.transaction.categories.brought_forward as any)[
                    "initial"
                  ] || "Initial Balance"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              {dict.transaction.description || "Description"}
            </Label>
            <Input
              id="description"
              name="description"
              placeholder=""
            />
          </div>

          {user ? (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-600 hover:bg-slate-700 text-white"
            >
              {isSubmitting
                ? dict.transaction.saving || "Saving..."
                : dict.transaction.save || "Save"}
            </Button>
          ) : (
            <LoginDialog
              trigger={
                <Button
                  id="login-dialog-trigger-topup"
                  type="button"
                  className="w-full bg-muted text-muted-foreground hover:bg-muted/80"
                >
                  {dict.transaction.loginRequired || "Login required"}
                </Button>
              }
              dict={dict}
            />
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
