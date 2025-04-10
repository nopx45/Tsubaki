import { JSX, useState } from "react";

export interface Column<T> {
  title: JSX.Element | string;
  dataIndex?: keyof T;
  key: string;
  render?: (record: T) => JSX.Element;
  sortable?: boolean;
}

interface SortableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  itemsPerPage?: number;
}

function SortableTable<T extends { ID?: number }>({
  data,
  columns,
  itemsPerPage = 10,
}: SortableTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirst, indexOfLast);

  return (
    <>
      <table className="customer-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                onClick={() =>
                  col.sortable && col.dataIndex && handleSort(col.dataIndex)
                }
                style={{ cursor: col.sortable ? "pointer" : "default" }}
              >
                {col.title}
                {sortKey === col.dataIndex &&
                  (sortOrder === "asc" ? " ▲" : " ▼")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, rowIndex) => (
            <tr key={item.ID ?? rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.render
                    ? col.render(item)
                    : col.dataIndex
                    ? (item[col.dataIndex] as string | number)
                    : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          ก่อนหน้า
        </button>
        <span>
          หน้า {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          ถัดไป
        </button>
      </div>
    </>
  );
}

export default SortableTable;
