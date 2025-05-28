import React, { useState, ReactNode } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: any, row: T) => ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchFields?: (keyof T)[];
  pageSize?: number;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchable = true,
  searchFields = [],
  pageSize = 10,
  onRowClick,
  emptyMessage = "No data found"
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSizeValue, setPageSizeValue] = useState(pageSize);

  // Filter data based on search term
  const filteredData = React.useMemo(() => {
    if (!searchable || !searchTerm) return data;
    
    return data.filter(row => {
      if (searchFields.length > 0) {
        return searchFields.some(field => 
          String(row[field]).toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else {
        return Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    });
  }, [data, searchTerm, searchFields, searchable]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortField) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSizeValue;
    return sortedData.slice(startIndex, startIndex + pageSizeValue);
  }, [sortedData, currentPage, pageSizeValue]);

  const totalPages = Math.ceil(sortedData.length / pageSizeValue);

  const handleSort = (field: keyof T) => {
    const column = columns.find(col => col.key === field);
    if (!column?.sortable) return;

    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageSizeChange = (newSize: string) => {
    setPageSizeValue(parseInt(newSize));
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="w-full space-y-4">
      {/* Search and Controls */}
      <div className="flex justify-between items-center">
        {searchable && (
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Show:</span>
          <Select
            value={pageSizeValue.toString()}
            onChange={e => handlePageSizeChange(e.target.value)}
            options={[
              { value: '5', label: '5' },
              { value: '10', label: '10' },
              { value: '25', label: '25' },
              { value: '50', label: '50' }
            ]}
          />
          <span className="text-sm text-gray-600">entries</span>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                className={column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.title}</span>
                  {column.sortable && sortField === column.key && (
                    <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row, index) => (
            <TableRow
              key={index}
              className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <TableCell key={String(column.key)}>
                  {column.render 
                    ? column.render(row[column.key], row)
                    : String(row[column.key] || '')
                  }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Empty State */}
      {paginatedData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * pageSizeValue) + 1} to {Math.min(currentPage * pageSizeValue, sortedData.length)} of {sortedData.length} entries
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;