"use client";

import dynamic from "next/dynamic";
import { memo, useEffect, useState } from "react";
import { Logo } from "@/components/ui/logo";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/better-auth/auth-client";
import { ArrowRight, Eye, EyeClosed, FingerprintPattern } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

const FaultyTerminal = dynamic(() => import("@/components/ui/FaultyTerminal"), {
  ssr: false,
});

const TERMINAL_PROPS = {
  scale: 1.5,
  gridMul: [2, 1] as [number, number],
  digitSize: 1.2,
  timeScale: 0.5,
  pause: false,
  scanlineIntensity: 0.5,
  glitchAmount: 1,
  flickerAmount: 1,
  noiseAmp: 1,
  chromaticAberration: 0,
  dither: 0,
  curvature: 0.1,
  tint: "#383434",
  mouseReact: true,
  mouseStrength: 0.5,
  pageLoadAnimation: true,
  brightness: 0.6,
} as const;
const MemoizedTerminal = memo(FaultyTerminal);

export const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const { data } = authClient.useSession();

  useEffect(() => {
    if (data?.session) {
      router.push("/");
    }
  }, [data?.session]);

  async function handleLogin() {
    if (!email || !password) {
      toast.error("Invalid Inputs.");
      return;
    }
    try {
      setLoading(true);
      await authClient.signIn.email({
        email,
        password,
        callbackURL: "http://localhost:3000",
      });
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "w-full md:max-w-3xl mx-auto sm:border-x min-h-screen border-dashed",
        "flex flex-col items-center justify-center",
        "p-3 md:p-0 relative",
      )}
    >
      <div
        onClick={() => router.push("/signup")}
        className="absolute top-5 right-5"
      >
        <Button size={"sm"} variant={"secondary"}>
          Sign up
          <ArrowRight />
        </Button>
      </div>
      {/* Card */}
      <div
        className={cn(
          "p-2 rounded-2xl max-w-lg w-full",
          "border border-border bg-card shadow-2xl",
        )}
      >
        {/* Branding */}
        <div className="h-52 w-full border border-border rounded-xl relative overflow-hidden">
          <MemoizedTerminal {...TERMINAL_PROPS} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Logo />
          </div>
        </div>

        <div className="flex flex-col gap-5 my-8 px-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              required
              id="email"
              type="email"
              placeholder="Enter your email address"
              onChange={(e) => setEmail(e.target.value)}
              className={cn("bg-input border-border transition-all")}
            />
            <span className="text-[13px] text-muted-foreground pl-2">
              We'll never share your email within anyone else.
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="flex items-center gap-2">
              <Input
                required
                id="password"
                placeholder="Enter your Password"
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                className={cn("bg-input border-border transition-all")}
              />
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? <Eye /> : <EyeClosed />}
              </Button>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            className={cn(
              "bg-secondary text-secondary-foreground border-border mt-2 hover:bg-secondary/90",
            )}
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                <FingerprintPattern />
                Login
              </>
            )}
          </Button>

          <div className="flex items-center gap-2 w-full">
            <hr className="grow border-t border-border" />
            <span className="text-muted-foreground text-xs font-medium">
              or
            </span>
            <hr className="grow border-t border-border" />
          </div>

          <Button
            className={cn(
              "bg-secondary text-secondary-foreground border-border hover:bg-secondary/90",
            )}
            onClick={async () =>
              await authClient.signIn.social({ provider: "google" })
            }
          >
            <FcGoogle />
            Google
          </Button>
        </div>
      </div>

      <div className="flex flex-col text-center mt-6 gap-2">
        <span className="text-sm text-muted-foreground">
          By proceeding, you agree to our Terms and Privacy Policy.
        </span>
        <span className="text-xs text-muted-foreground">
          All Rights Reserved © 2026{" "}
          <span className="font-semibold text-foreground">onechat.com</span>
        </span>
      </div>
    </div>
  );
};
