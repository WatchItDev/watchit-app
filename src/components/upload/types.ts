import { DropzoneOptions } from 'react-dropzone';
// @mui
import { Theme, SxProps } from '@mui/material/styles';
import { ImageRatio } from '../image';
import SingleFilePreview from './preview-single-file';

// ----------------------------------------------------------------------

export interface CustomFile extends File {
  path?: string;
  preview?: string;
  lastModifiedDate?: Date;
}

export interface UploadProps extends DropzoneOptions {
  error?: boolean;
  sx?: SxProps<Theme>;
  thumbnail?: boolean;
  thumbnailRatio?: ImageRatio;
  placeholder?: React.ReactNode;
  helperText?: React.ReactNode;
  disableMultiple?: boolean;
  //
  file?: CustomFile | string | null;
  onDelete?: VoidFunction;
  //
  files?: (File | string)[];
  onUpload?: VoidFunction;
  onRemove?: (file: CustomFile | string) => void;
  onRemoveAll?: VoidFunction;
  singleFilePreview?: typeof SingleFilePreview,
  isCustomPreview?: boolean
}
