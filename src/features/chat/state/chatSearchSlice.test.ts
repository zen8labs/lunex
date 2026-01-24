import { describe, it, expect } from 'vitest';
import chatSearchReducer, {
  setSearchOpen,
  setSearchQuery,
  setFilteredResults,
} from './chatSearchSlice';

describe('chatSearchSlice', () => {
  const initialState = {
    searchOpen: false,
    searchQuery: '',
    filteredResults: [],
  };

  it('should handle setSearchOpen', () => {
    const state = chatSearchReducer(initialState, setSearchOpen(true));
    expect(state.searchOpen).toBe(true);

    const stateClosed = chatSearchReducer(
      { ...initialState, searchOpen: true, searchQuery: 'test' },
      setSearchOpen(false)
    );
    expect(stateClosed.searchOpen).toBe(false);
    expect(stateClosed.searchQuery).toBe('');
    expect(stateClosed.filteredResults).toEqual([]);
  });

  it('should handle setSearchQuery', () => {
    const state = chatSearchReducer(initialState, setSearchQuery('prompt'));
    expect(state.searchQuery).toBe('prompt');
  });

  it('should handle setFilteredResults', () => {
    const results = [
      {
        id: '1',
        type: 'chat',
        title: 'Result',
        content: 'msg',
        timestamp: 123,
      },
    ] as const;
    const state = chatSearchReducer(
      initialState,
      setFilteredResults([...results])
    );
    expect(state.filteredResults).toEqual(results);
  });
});
