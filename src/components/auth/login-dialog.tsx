"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, signup } from "@/app/login/actions";
import { Dictionary } from "@/lib/i18n/dictionaries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";

function PasswordInput({ id, name, required, minLength, onChange }: any) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        required={required}
        minLength={minLength}
        onChange={onChange}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShow(!show)}
      >
        {show ? (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
}

export function LoginDialog({
  dict,
  trigger,
}: {
  dict: Dictionary;
  trigger?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger ? (
        <DialogTrigger render={trigger as React.ReactElement} />
      ) : (
        <DialogTrigger
          render={<Button id="login-dialog-trigger" variant="outline" />}
        >
          {dict.app.login}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dict.auth.title}</DialogTitle>
          <DialogDescription>{dict.auth.desc}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{dict.auth.loginTab}</TabsTrigger>
            <TabsTrigger value="signup">{dict.auth.signupTab}</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">{dict.auth.email}</Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  placeholder="m@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">{dict.auth.password}</Label>
                <PasswordInput id="login-password" name="password" required />
              </div>

              <div className="pt-2">
                <Button type="submit" formAction={login} className="w-full">
                  {dict.auth.loginBtn}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">{dict.auth.displayName}</Label>
                <Input
                  id="signup-name"
                  name="displayName"
                  type="text"
                  placeholder={dict.auth.displayNamePlaceholder}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">{dict.auth.email}</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  placeholder="m@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">{dict.auth.password}</Label>
                <PasswordInput
                  id="signup-password"
                  name="password"
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-confirm">
                  {dict.auth.confirmPassword}
                </Label>
                <PasswordInput
                  id="signup-confirm"
                  name="confirmPassword"
                  required
                  minLength={6}
                  onChange={(e: any) => {
                    const pass = (
                      document.getElementById(
                        "signup-password",
                      ) as HTMLInputElement
                    )?.value;
                    if (e.target.value !== pass) {
                      e.target.setCustomValidity(
                        dict.auth.passwordMismatch || "Passwords do not match",
                      );
                    } else {
                      e.target.setCustomValidity("");
                    }
                  }}
                />
              </div>

              <div className="pt-2">
                <Button type="submit" formAction={signup} className="w-full">
                  {dict.auth.signupBtn}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
