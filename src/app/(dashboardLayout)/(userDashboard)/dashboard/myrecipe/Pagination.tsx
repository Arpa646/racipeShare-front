import React from 'react';
import './Pagination.scss';

interface PaginationProps {
  totalPosts: number;
  postsPerPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPosts,
  postsPerPage,
  setCurrentPage,
  currentPage,
}) => {
  const pages = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(prev => prev - 1)}
      >
        Prev
      </button>
      {pages.map((page, index) => (
        <button
          className={page === currentPage ? 'active' : ''}
          key={index}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}
      <button
        disabled={currentPage === pages.length}
        onClick={() => setCurrentPage(prev => prev + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
