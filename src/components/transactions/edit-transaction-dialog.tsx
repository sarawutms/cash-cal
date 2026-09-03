"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { TransactionForm } from "./transaction-form";
import { Dictionary } from "@/lib/i18n/dictionaries";

export function EditTransactionDialog({
  transaction,
  dict,
  user,
  lang = "th",
}: {
  transaction: any;
  dict: Dictionary;
  user: any;
  lang?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-indigo-600"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <TransactionForm
          user={user}
          dict={dict}
          transaction={transaction}
          isDialog={true}
          lang={lang}
          onSaved={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
