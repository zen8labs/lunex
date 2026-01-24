import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchResult {
  id: string;
  type: 'chat' | 'note';
  title: string;
  content: string;
  timestamp?: number;
}

interface ChatSearchState {
  searchOpen: boolean;
  searchQuery: string;
  filteredResults: SearchResult[];
}

const initialState: ChatSearchState = {
  searchOpen: false,
  searchQuery: '',
  filteredResults: [],
};

const chatSearchSlice = createSlice({
  name: 'chatSearch',
  initialState,
  reducers: {
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.searchOpen = action.payload;
      if (!action.payload) {
        // Reset search when closing
        state.searchQuery = '';
        state.filteredResults = [];
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilteredResults: (state, action: PayloadAction<SearchResult[]>) => {
      state.filteredResults = action.payload;
    },
  },
});

export const { setSearchOpen, setSearchQuery, setFilteredResults } =
  chatSearchSlice.actions;
export default chatSearchSlice.reducer;
