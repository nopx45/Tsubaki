interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onNext: () => void;
    onPrev: () => void;
  }
  
  const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onNext, onPrev }) => {
    return (
      <div className="pagination-container">
        <div className="pagination-controls">
          <button 
            onClick={onPrev} 
            disabled={currentPage === 1}
            className="pagination-button prev-button"
          >
            <span className="button-icon">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
              </svg>
            </span>
            <span className="button-text">หน้าก่อนหน้า</span>
            <span className="button-hover-effect"></span>
          </button>
          
          <div className="page-indicator">
            <span className="current-page">{currentPage}</span>
            <span className="separator">/</span>
            <span className="total-pages">{totalPages}</span>
          </div>
          
          <button 
            onClick={onNext} 
            disabled={currentPage === totalPages}
            className="pagination-button next-button"
          >
            <span className="button-text">หน้าถัดไป</span>
            <span className="button-icon">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
              </svg>
            </span>
            <span className="button-hover-effect"></span>
          </button>
        </div>
  
        <style>{`
          .pagination-container {
            margin-top: 30px;
            display: flex;
            justify-content: center;
          }
          
          .pagination-controls {
            display: flex;
            align-items: center;
            gap: 12px;
            background: rgba(255, 255, 255, 0);
            padding: 8px;
          }
          
          .pagination-button {
            position: relative;
            padding: 10px 20px;
            border: none;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            overflow: hidden;
            z-index: 1;
          }
          
          .prev-button {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: white;
            padding-left: 16px;
          }
          
          .next-button {
            background: linear-gradient(135deg, #2575fc 0%, #6a11cb 100%);
            color: white;
            padding-right: 16px;
          }
          
          .pagination-button:disabled {
            background: #e0e0e0;
            color: #9e9e9e;
            cursor: not-allowed;
            transform: none !important;
          }
          
          .pagination-button:not(:disabled):hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(106, 17, 203, 0.3);
          }
          
          .button-hover-effect {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: -1;
          }
          
          .pagination-button:not(:disabled):hover .button-hover-effect {
            opacity: 1;
          }
          
          .button-icon {
            display: flex;
            align-items: center;
            transition: transform 0.3s ease;
          }
          
          .prev-button:hover:not(:disabled) .button-icon {
            transform: translateX(-3px);
          }
          
          .next-button:hover:not(:disabled) .button-icon {
            transform: translateX(3px);
          }
          
          .page-indicator {
            display: flex;
            align-items: center;
            font-weight: 600;
            background: rgba(106, 17, 203, 0.1);
            padding: 8px 16px;
            border-radius: 50px;
            min-width: 90px;
            justify-content: center;
            gap: 4px;
          }
          
          .current-page {
            color: #6a11cb;
            font-size: 1.1em;
          }
          
          .total-pages {
            color: #2575fc;
          }
          
          .separator {
            color: #7b8a8b;
            margin: 0 2px;
          }
          
          @media (max-width: 480px) {
            .pagination-controls {
              flex-direction: column;
              border-radius: 20px;
              gap: 8px;
              padding: 12px;
            }
            
            .page-indicator {
              order: -1;
              width: 100%;
            }
          }
        `}</style>
      </div>
    );
  };
  
  export default Pagination;