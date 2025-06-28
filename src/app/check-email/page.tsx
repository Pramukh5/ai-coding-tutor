import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MailCheck } from "lucide-react";

export default function CheckEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <MailCheck className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            We've sent a verification link to your email address. Please click the link to complete the sign-up process.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
