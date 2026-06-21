import { VerifyEmail } from "@/components/auth/verify-email";
import { Suspense } from "react";
export default function VerifyEmailPage() {
    return <Suspense fallback={null}>
      <VerifyEmail />
    </Suspense>
}