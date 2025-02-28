const DateInputs = ({ startDate, endDate, handleDateChange, label, maxWidth = 'none' }) => {
    return (
      <div className="custom-date-range mt-2 d-flex align-items-center gap-2">
        {label && (
          <label className="mb-0 me-2" style={{ fontWeight: 500 }}>
            {label}
          </label>
        )}
        <div className="d-flex align-items-center gap-2">
          <input
            type="date"
            className="form-control form-control-sm border-secondary"
            value={startDate || ""}
            onChange={(e) => handleDateChange('start', e.target.value)}
            max={endDate || new Date().toISOString().split('T')[0]}
            placeholder="Start date"
            aria-label="Start date"
            style={{ maxWidth: maxWidth }}
          />
          <span className="text-muted">–</span>
          <input
            type="date"
            className="form-control form-control-sm border-secondary"
            value={endDate || ""}
            onChange={(e) => handleDateChange('end', e.target.value)}
            min={startDate}
            max={new Date().toISOString().split('T')[0]}
            placeholder="End date"
            aria-label="End date"
            style={{ maxWidth: maxWidth }}
          />
        </div>
      </div>
    )
  }

  export default DateInputs