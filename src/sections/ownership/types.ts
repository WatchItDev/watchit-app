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
  status: AssetStatus
}

export interface OwnershipSettingsModalProps {
  open: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  assetData: {
    id: number;
    name: string;
  };
}
export interface OwnershipSettingsModalContentProps {
  onClose?: () => void;
  onConfirm?: () => void;
  assetData: {
    id: number
    name: string;
  };
}

export interface OwnershipTimelineItemProps {
  id: string;
  title: string;
  time: Date;
  type: string;
}

export interface OwnershipTimelineItemsProps {
  item: OwnershipTimelineItemProps;
  lastTimeline: boolean;
}
