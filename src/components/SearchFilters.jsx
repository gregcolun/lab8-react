function SearchFilters({
  query,
  category,
  categories,
  onQueryChange,
  onCategoryChange
}) {
  return (
    <section className="controls">
      <div className="field">
        <label htmlFor="search-input">Caută rețetă</label>
        <input
          id="search-input"
          type="text"
          className="search-input"
          placeholder="Ex: pui, paste, supă..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="category-filter">Categorie</label>
        <select
          id="category-filter"
          className="filter-select"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          {categories.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

export default SearchFilters;
