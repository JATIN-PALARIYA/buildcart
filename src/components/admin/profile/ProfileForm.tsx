import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AdminUser } from "@/contexts/AdminContext";

// Form validation schema
const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  adminUser: AdminUser | null;
  updateProfile: (name: string, email: string) => Promise<void>;
}

export function ProfileForm({ adminUser, updateProfile }: ProfileFormProps) {
  const [profileSuccess, setProfileSuccess] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isSubmittingProfile },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: adminUser?.name || "",
      email: adminUser?.email || "",
    },
  });

  const onUpdateProfile = async (values: ProfileFormValues) => {
    setProfileSuccess(false);
    try {
      await updateProfile(values.name, values.email);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="lg:min-h-[235px] flex flex-col justify-between p-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground border-b border-border pb-3 mb-4 flex items-center gap-1.5">
          <User size={15} className="text-muted-foreground" />
          Account Details
        </h3>

        {profileSuccess && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex gap-2 text-emerald-600 dark:text-emerald-400 text-xs">
            <CheckCircle2 className="shrink-0 h-4 w-4 mt-0.5" />
            <span>Profile details successfully updated!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-muted-foreground">Name</label>
            <input
              type="text"
              {...registerProfile("name")}
              className={`w-full px-3 py-2 bg-background border rounded-lg text-sm outline-none transition-all ${profileErrors.name ? "border-destructive focus:ring-1 focus:ring-destructive" : "border-border focus:ring-1 focus:ring-primary"
                }`}
            />
            {profileErrors.name && (
              <p className="text-[11px] text-destructive font-medium">{profileErrors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-muted-foreground">Email</label>
            <input
              type="email"
              {...registerProfile("email")}
              className={`w-full px-3 py-2 bg-background border rounded-lg text-sm outline-none transition-all ${profileErrors.email ? "border-destructive focus:ring-1 focus:ring-destructive" : "border-border focus:ring-1 focus:ring-primary"
                }`}
            />
            {profileErrors.email && (
              <p className="text-[11px] text-destructive font-medium">{profileErrors.email.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-center pt-4 border-t border-border mt-5">

          <button
            type="submit"
            disabled={isSubmittingProfile}
            className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg text-xs shadow-sm hover:opacity-90 transition-all cursor-pointer self-start sm:self-auto"
          >
            {isSubmittingProfile ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Card>
  );
}
export default ProfileForm;
