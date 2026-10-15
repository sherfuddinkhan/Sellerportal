import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const WarehouseLocationFilters = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    warehouseId: "",
    zone: "",
    aisle: "",
    rack: "",
    bin: "",
    locationType: "",
    status: "",
    isActive: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({...prev, [name]: value }));
  };

  const handleApply = () => {
    // Build query string and navigate to list with filters
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    navigate(`/warehouse-locations?${params.toString()}`);
  };

  const handleClear = () => {
    setFilters({
      warehouseId: "",
      zone: "",
      aisle: "",
      rack: "",
      bin: "",
      locationType: "",
      status: "",
      isActive: "",
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Warehouse Location Filters</h2>
        <button onClick={() => navigate('/warehouse-locations')} style={{ padding: '8px 16px' }}>Back to List</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>

        <div>
          <label>Warehouse ID</label>
          <input name="warehouseId" value={filters.warehouseId} onChange={handleChange} placeholder="Enter Warehouse ID" style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>

        <div>
          <label>Zone</label>
          <input name="zone" value={filters.zone} onChange={handleChange} placeholder="e.g. A, B, C" style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>

        <div>
          <label>Aisle</label>
          <input name="aisle" value={filters.aisle} onChange={handleChange} placeholder="e.g. Aisle-01" style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>

        <div>
          <label>Rack</label>
          <input name="rack" value={filters.rack} onChange={handleChange} placeholder="e.g. R-01" style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>

        <div>
          <label>Bin</label>
          <input name="bin" value={filters.bin} onChange={handleChange} placeholder="e.g. BIN-001" style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
        </div>

        <div>
          <label>Location Type</label>
          <select name="locationType" value={filters.locationType} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '4px' }}>
            <option value="">All Types</option>
            <option value="STORAGE">STORAGE</option>
            <option value="PICKING">PICKING</option>
            <option value="PACKING">PACKING</option>
            <option value="STAGING">STAGING</option>
            <option value="RECEIVING">RECEIVING</option>
            <option value="SHIPPING">SHIPPING</option>
          </select>
        </div>

        <div>
          <label>Status</label>
          <select name="status" value={filters.status} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '4px' }}>
            <option value="">All Status</option>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="OCCUPIED">OCCUPIED</option>
            <option value="RESERVED">RESERVED</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>
        </div>

        <div>
          <label>Is Active</label>
          <select name="isActive" value={filters.isActive} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '4px' }}>
            <option value="">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={handleApply} style={{ padding: '10px 20px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Apply Filters</button>
        <button onClick={handleClear} style={{ padding: '10px 20px', background: '#f0f0f0', border: '1px solid #d9d9d9', borderRadius: '6px', cursor: 'pointer' }}>Clear</button>
      </div>
    </div>
  );
};

export default WarehouseLocationFilters;