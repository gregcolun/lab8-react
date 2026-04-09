function PaginationControls({
  page,
  totalPages,
  totalItems,
  onPageChange
}) {
  if (totalItems === 0) {
    return null;
  }

  return (
    <section className="pagination">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Anterior
      </button>
      <p>
        Pagina <strong>{page}</strong> / {totalPages}
      </p>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Următor
      </button>
    </section>
  );
}

export default PaginationControls;
