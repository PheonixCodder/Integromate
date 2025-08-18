"use client";
import React from "react";
import UploadCareButton from "./uploadcare-button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type Props = {
  userImage: string | null;
  onDelete?: any;
  onUpload: any;
};

const ProfilePicture = ({ userImage, onDelete, onUpload }: Props) => {
  const router = useRouter();

  const onRemoveProfileImage = async () => {
    if (!onDelete) return;
    const response = await onDelete();
    if (response) {
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col">
      <p className="text-lg text-white">Profile Picture</p>
      <div className="flex h-[30vh] flex-col items-center justify-center">
        {userImage ? (
          <div className="flex flex-col items-center">
            {/* Circular avatar */}
            <div className="relative w-72 h-72 rounded-full overflow-hidden shadow-lg">
              <Image
                src={userImage || "/default-avatar.png"}
                alt="User Image"
                fill
                sizes="288px"
                className="object-cover"
              />
            </div>

            {/* Remove button */}
            <Button
              onClick={onRemoveProfileImage}
              variant="ghost"
              className="mt-4 text-white/70 hover:text-white"
            >
              <X className="mr-2 h-4 w-4" /> Remove Logo
            </Button>
          </div>
        ) : (
          <UploadCareButton onUpload={onUpload} />
        )}
      </div>
    </div>
  );
};

export default ProfilePicture;
