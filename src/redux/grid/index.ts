import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GridState, GridItem, ExpandedSection, GridDimensions } from '@src/sections/explore/types';

const initialState: GridState = {
  items: [],
  expandedSection: null,
  isLoading: false,
  hasMore: true,
  currentPage: 0,
  gridDimensions: {
    containerWidth: 0,
    itemSize: 0,
    gap: 16,
    columns: 0,
    rows: 0,
  },
  viewportHeight: 0,
  scrollPosition: 0,
  isScrolling: false,
  hasUserScrolledAfterExpand: false,
};

const gridSlice = createSlice({
  name: 'grid',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<GridItem[]>) => {
      state.items = action.payload;
    },
    addItems: (state, action: PayloadAction<GridItem[]>) => {
      state.items = [...state.items, ...action.payload];
    },
    resetGrid: (state) => {
      state.items = [];
      state.expandedSection = null;
      state.currentPage = 0;
      state.isLoading = false;
      state.hasMore = true;
      state.hasUserScrolledAfterExpand = false;
    },

    setExpandedSection: (state, action: PayloadAction<ExpandedSection | null>) => {
      state.expandedSection = action.payload;
    },
    setExpandedOpen: (state, action: PayloadAction<boolean>) => {
      if (state.expandedSection) {
        state.expandedSection.isOpen = action.payload;
        if (!action.payload) {
          // when closed, reset height so grid goes back to normal
          state.expandedSection.height = 0;
        }
      }
    },
    updateExpandedHeight: (state, action: PayloadAction<number>) => {
      if (state.expandedSection) {
        state.expandedSection.height = action.payload;
      }
    },
    updateExpandedY: (state, action: PayloadAction<number>) => {
      if (state.expandedSection) {
        state.expandedSection.y = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setGridDimensions: (state, action: PayloadAction<GridDimensions>) => {
      state.gridDimensions = action.payload;
    },
    setViewportHeight: (state, action: PayloadAction<number>) => {
      state.viewportHeight = action.payload;
    },
    setScrollPosition: (state, action: PayloadAction<number>) => {
      state.scrollPosition = action.payload;
    },
    setIsScrolling: (state, action: PayloadAction<boolean>) => {
      state.isScrolling = action.payload;
    },
    setHasUserScrolledAfterExpand: (state, action: PayloadAction<boolean>) => {
      state.hasUserScrolledAfterExpand = action.payload;
    },
  },
});

export const {
  setItems,
  addItems,
  resetGrid,
  setExpandedSection,
  setExpandedOpen,
  updateExpandedHeight,
  updateExpandedY,
  setLoading,
  setHasMore,
  setCurrentPage,
  setGridDimensions,
  setViewportHeight,
  setScrollPosition,
  setIsScrolling,
  setHasUserScrolledAfterExpand,
} = gridSlice.actions;

export default gridSlice.reducer;
