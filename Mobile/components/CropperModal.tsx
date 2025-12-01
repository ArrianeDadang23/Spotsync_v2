// CropperModal.tsx (Mobile Version)
import React from 'react';
import { ImageManipulator } from '@oguzhnatly/react-native-image-manipulator';
import { Platform } from 'react-native';

interface CropperModalProps {
  show: boolean;
  imageSrc: string | null;
  aspect: number;
  onClose: () => void;
  onCropComplete: (base64Image: string) => void;
}

function CropperModal({
  show,
  imageSrc,
  aspect,
  onClose,
  onCropComplete,
}: CropperModalProps) {
  
  if (!imageSrc) {
    return null;
  }

  const handlePictureChoosed = ({ uri, base64 }: { uri: string; base64: string }) => {
    const formattedBase64 = `data:image/jpeg;base64,${base64}`;
    onCropComplete(formattedBase64);
    onClose();
  };

  const isSquareCrop = aspect === 1;

  return (
    <ImageManipulator
      photo={{ uri: imageSrc }}
      
      isVisible={show}
      
      onPictureChoosed={handlePictureChoosed}

      onToggleModal={onClose}
      
      fixedSquareCrop={isSquareCrop}

      btnTexts={{
        done: 'Save Crop',
        crop: 'Crop',
        processing: 'Processing...',
      }}

      themeColor="#007AFF"
    />
  );
}

export default CropperModal;