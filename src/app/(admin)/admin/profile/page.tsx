"use client";

import { useAdmin } from "@/contexts/AdminContext";
import { AdminIdentityCard } from "@/components/admin/dashboard/AdminIdentityCard";
import { StoreDetailsCard } from "@/components/admin/dashboard/StoreDetailsCard";
import { ProfileForm } from "@/components/admin/profile/ProfileForm";
import { SecurityForm } from "@/components/admin/profile/SecurityForm";

export default function AdminProfilePage() {
  const { adminUser, updateProfile } = useAdmin();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Admin Profile</h2>
        <p className="text-muted-foreground text-xs">
          Manage your personal settings, security credentials, and store configurations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar info & Store Status */}
        <div className="space-y-6 lg:col-span-1">
          <AdminIdentityCard adminUser={adminUser} />
          <StoreDetailsCard />
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileForm adminUser={adminUser} updateProfile={updateProfile} />
          <SecurityForm />
        </div>
      </div>
    </div>
  );
}
