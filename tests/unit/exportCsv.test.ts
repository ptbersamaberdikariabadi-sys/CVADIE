import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { downloadCSV } from '@/utils/exportCsv';

describe('exportCsv utility', () => {
  beforeEach(() => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a link and trigger download', () => {
    // We use actual JSDOM for elements, so we spy on their prototypes
    const anchorClickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click');
    const setAttributeSpy = vi.spyOn(HTMLAnchorElement.prototype, 'setAttribute');
    
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    const columns = ['Name', 'Age'];
    const data = [
      ['John', 30],
      ['Jane', 25]
    ];

    downloadCSV('test.csv', columns, data);

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(setAttributeSpy).toHaveBeenCalledWith('href', 'blob:mock-url');
    expect(setAttributeSpy).toHaveBeenCalledWith('download', 'test.csv');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(anchorClickSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });
});
