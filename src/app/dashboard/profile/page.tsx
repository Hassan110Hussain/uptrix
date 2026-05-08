"use client";

import React, { useState } from "react";
import { User, Lock, Save } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ToastContainer } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import { ApiResponse, User as UserType } from "@/types";
import { validatePassword } from "@/lib/utils";

interface ProfileData {
  id: string;
  name: string;
  email: string;
}

export default function ProfilePage() {
  const { user, token, updateUser } = useAuth();
  const { toasts, dismissToast, success, error: toastError } = useToast();

  // Profile form
  const [profileForm, setProfileForm] = useState({ name: user?.name || "" });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  function validateProfile(): boolean {
    const errors: Record<string, string> = {};
    if (!profileForm.name.trim()) errors.name = "Name is required";
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validatePasswordForm(): boolean {
    const errors: Record<string, string> = {};
    if (!passwordForm.oldPassword) errors.oldPassword = "Current password is required";
    const pwdError = validatePassword(passwordForm.newPassword);
    if (!passwordForm.newPassword) errors.newPassword = "New password is required";
    else if (pwdError) errors.newPassword = pwdError;
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      errors.confirmPassword = "Passwords do not match";
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!validateProfile() || !token) return;
    setIsUpdatingProfile(true);
    try {
      const res = await authApi.updateProfile(
        { name: profileForm.name.trim() },
        token
      ) as ApiResponse<ProfileData>;
      const updatedUser: UserType = {
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
      };
      updateUser(updatedUser);
      success("Profile updated successfully");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!validatePasswordForm() || !token) return;
    setIsChangingPassword(true);
    try {
      await authApi.changePassword(
        {
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        },
        token
      );
      success("Password changed successfully");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  }

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your account settings.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
              <User size={20} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Personal Information</h2>
              <p className="text-gray-400 text-sm">Update your name</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} noValidate className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ name: e.target.value })}
              error={profileErrors.name}
              autoComplete="name"
              required
            />
            <Input
              label="Email"
              type="email"
              value={user?.email || ""}
              disabled
              helperText="Email cannot be changed"
            />
            <Button
              type="submit"
              isLoading={isUpdatingProfile}
              className="flex items-center gap-2"
            >
              <Save size={15} />
              Save Changes
            </Button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-600/10 border border-purple-500/20 rounded-xl flex items-center justify-center">
              <Lock size={20} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Change Password</h2>
              <p className="text-gray-400 text-sm">Update your password</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} noValidate className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={passwordForm.oldPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
              }
              error={passwordErrors.oldPassword}
              autoComplete="current-password"
              required
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Min. 6 characters"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              error={passwordErrors.newPassword}
              autoComplete="new-password"
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Repeat new password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
              error={passwordErrors.confirmPassword}
              autoComplete="new-password"
              required
            />
            <Button
              type="submit"
              isLoading={isChangingPassword}
              className="flex items-center gap-2"
            >
              <Lock size={15} />
              Change Password
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
