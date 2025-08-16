'use client'
import React, { useEffect } from 'react';
import { FileUploaderRegular } from '@uploadcare/react-uploader/next';
import '@uploadcare/react-uploader/core.css';
import { useRouter } from 'next/navigation';

type Props = {
  onUpload: (cdnUrl: string) => Promise<any>;
};

const UploadCareButton = ({ onUpload }: Props) => {
  const router = useRouter();

  const handleChange = async (event: any) => {
    const files = event.detail?.files || [];
    if (files.length > 0) {
      const file = await onUpload(files[0].cdnUrl);
      if (file) {
        router.refresh();
      }
    }
  };

  return (
    <div>
      <FileUploaderRegular
        sourceList="local, camera, facebook, gdrive"
        classNameUploader="uc-light"
        pubkey="a9428ff5ff90ae7a64eb"
        onChange={handleChange}
      />
    </div>
  );
};

export default UploadCareButton;