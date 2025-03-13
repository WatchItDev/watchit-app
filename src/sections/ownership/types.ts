export interface OwnershipTableProps {
  assets: OwnershipAsset[];
  loading: boolean;
}

export interface OwnershipCreateProps {
  onSuccess?: () => void;
}

export interface OwnershipTableRowProps {
  row: OwnershipAsset;
  selected: boolean;
}

export interface AssetPolicy {
  name: string;
}

export interface AssetStatus {
  name: string;
}

export interface AssetType {
  name: string;
}

export interface OwnershipAsset {
  id: number;
  name: string;
  image: string;
  description: string;
  police: AssetPolicy;
  restrictions: boolean;
  status: AssetStatus;
  type: AssetType;
}

export interface OwnershipSettingsModalProps {
  open: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  assetData: {
    name: string;
  };
}
export interface OwnershipSettingsModalContentProps {
  onClose?: () => void;
  onConfirm?: () => void;
  assetData: {
    name: string;
  };
}
