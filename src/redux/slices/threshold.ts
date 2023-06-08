/* eslint-disable functional/immutable-data */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface ThresholdState {
  belowThreshold?: boolean;
}

const initialState: ThresholdState = {
  belowThreshold: undefined,
};

export const thresholdSlice = createSlice({
  name: "threshold",
  initialState,
  reducers: {
    setThreshold(
      state,
      action: PayloadAction<{
        belowThreshold: boolean;
      }>
    ) {
      state.belowThreshold = action.payload?.belowThreshold;
    },
    resetThreshold(state) {
      state.belowThreshold = undefined;
    },
  },
});

export const { setThreshold, resetThreshold } = thresholdSlice.actions;
export default thresholdSlice.reducer;
export const selectThreshold = (state: RootState) => ({
  belowThreshold: state.threshold.belowThreshold,
});
