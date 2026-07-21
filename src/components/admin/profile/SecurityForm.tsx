import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useAdmin } from "@/contexts/AdminContext";

// Form validation schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function SecurityForm() {
  const { updatePassword } = useAdmin();
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isSubmittingPassword },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onUpdatePassword = async (values: PasswordFormValues) => {
    setPasswordSuccess(false);
    setPasswordError(null);
    try {
      await updatePassword(values.currentPassword, values.newPassword);
      setPasswordSuccess(true);
      resetPassword();
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Failed to update password.";
      setPasswordError(msg);
    }
  };

  return (
    <Card className="lg:min-h-[300px] flex flex-col justify-between p-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground border-b border-border pb-3 mb-4 flex items-center gap-1.5">
          <Lock size={15} className="text-muted-foreground" />
          Security Settings
        </h3>

        {passwordSuccess && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex gap-2 text-emerald-600 dark:text-emerald-400 text-xs">
            <CheckCircle2 className="shrink-0 h-4 w-4 mt-0.5" />
            <span>Password successfully updated!</span>
          </div>
        )}

        {passwordError && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-2 text-destructive text-xs">
            <AlertCircle className="shrink-0 h-4 w-4 mt-0.5" />
            <span>{passwordError}</span>
          </div>
        )}
      </div>

      <form onSubmit={handlePasswordSubmit(onUpdatePassword)} className="space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-muted-foreground">Current Password</label>
          <input
            type="password"
            placeholder="••••••••"
            {...registerPassword("currentPassword")}
            className={`w-full px-3 py-2 bg-background border rounded-lg text-sm outline-none transition-all ${passwordErrors.currentPassword ? "border-destructive focus:ring-1 focus:ring-destructive" : "border-border focus:ring-1 focus:ring-primary"
              }`}
          />
          {passwordErrors.currentPassword && (
            <p className="text-[11px] text-destructive font-medium">{passwordErrors.currentPassword.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-muted-foreground">New Password</label>
            <input
              type="password"
              placeholder="At least 6 characters"
              {...registerPassword("newPassword")}
              className={`w-full px-3 py-2 bg-background border rounded-lg text-sm outline-none transition-all ${passwordErrors.newPassword ? "border-destructive focus:ring-1 focus:ring-destructive" : "border-border focus:ring-1 focus:ring-primary"
                }`}
            />
            {passwordErrors.newPassword && (
              <p className="text-[11px] text-destructive font-medium">{passwordErrors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-muted-foreground">Confirm New Password</label>
            <input
              type="password"
              placeholder="Match new password"
              {...registerPassword("confirmPassword")}
              className={`w-full px-3 py-2 bg-background border rounded-lg text-sm outline-none transition-all ${passwordErrors.confirmPassword ? "border-destructive focus:ring-1 focus:ring-destructive" : "border-border focus:ring-1 focus:ring-primary"
                }`}
            />
            {passwordErrors.confirmPassword && (
              <p className="text-[11px] text-destructive font-medium">{passwordErrors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={isSubmittingPassword}
            className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs shadow-sm hover:opacity-90 transition-all cursor-pointer"
          >
            {isSubmittingPassword ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </Card>
  );
}
export default SecurityForm;
