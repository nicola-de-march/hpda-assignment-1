import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Papa from "papaparse";

// get the data in asyncThunk
// Convert the data into a JSON file
export const getSeoulBikeData = createAsyncThunk('seoulBikeData/fetchData', async () => {
    const response = await fetch('data/SeoulBikeData.csv');
    const responseText = await response.text();
    console.log("loaded file length:" + responseText.length);
    const responseJson = Papa.parse(responseText, { header: true, dynamicTyping: true });
    return responseJson.data.map((item, i) => { return { ...item, index: i }; });
    // when a result is returned, extraReducer below is triggered with the case setSeoulBikeData.fulfilled
});

// Manages the dataSet state in Redux
export const dataSetSlice = createSlice({
  name: 'dataSet',
  initialState: {
    data: [],
    selectedItems: []
  },
  reducers: {
    updateSelectedItems: (state, action) => {
      state.selectedItems = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(getSeoulBikeData.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  }
});

// Action creators are generated for each case reducer function
export const { updateSelectedItems } = dataSetSlice.actions;

export default dataSetSlice.reducer;