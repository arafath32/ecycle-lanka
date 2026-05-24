import React, { useState, useEffect } from 'react';
import api from '../services/api';

const CATEGORY_IMPACT = {
  'Smartphones & Tablets': { co2: 0.8, energy: 120, water: 240, weight: 0.3, emoji: '📱' },
  'Laptops & Computers': { co2: 3.2, energy: 322, water: 190, weight: 2.5, emoji: '💻' },
  'TV & Audio': { co2: 4.5, energy: 450, water: 300, weight: 8.0, emoji: '📺' },
  'Cameras & Photography': { co2: 1.2, energy: 150, water: 180, weight: 0.8, emoji: '📷' },
  'Gaming': { co2: 1.5, energy: 200, water: 160, weight: 1.2, emoji: '🎮' },
  'Computer Parts': { co2: 2.0, energy: 280, water: 210, weight: 1.8, emoji: '🔧' },
  'Printers & Scanners': { co2: 3.5, energy: 380, water: 250, weight: 5.0, emoji: '🖨️' },
  'Other Electronics': { co2: 1.0, energy: 100, water: 150, weight: 1.0, emoji: '⚡' },
};

const ImpactCalculator = () => {
  const [platformImpact, setPlatformImpact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Laptops & Computers');
  const [quantity, setQuantity] = useState(1);
  const [calculated, setCalculated] = useState(null);

  useEffect(() => {
    const fetchImpact = async () => {
      try {
        const res = await api.get('/items/impact');
        setPlatformImpact(res.data.impact);
      } catch (error) {
        console.log('Error fetching impact:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchImpact();
  }, []);

  const handleCalculate = () => {
    const data = CATEGORY_IMPACT[selectedCategory];
    setCalculated({
      co2: (data.co2 * quantity).toFixed(2),
      energy: (data.energy * quantity).toFixed(0),
      water: (data.water * quantity).toFixed(0),
      weight: (data.weight * quantity).toFixed(2),
      category: selectedCategory,
      emoji: data.emoji,
    });
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌍</div>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>
          Environmental Impact Calculator
        </h1>
        <p style={{ color: '#6b7280', fontSize: '15px', maxWidth: '500px', margin: '0 auto' }}>
          See how much CO₂, energy and water you save by recycling your electronics instead of throwing them away.
        </p>
      </div>

      {/* Platform Stats */}
      <div style={{ background: 'linear-gradient(135deg, #052e16, #14532d)', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', color: '#fff' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '1.5rem', color: '#4ade80' }}>
          🏆 E-Cycle Lanka Platform Impact
        </h2>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#4ade80' }}>Loading...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Items Recycled', value: platformImpact?.totalItems || 0, unit: 'items', icon: '♻️' },
              { label: 'CO₂ Saved', value: platformImpact?.totalCO2Saved?.toFixed(1) || 0, unit: 'kg', icon: '🌿' },
              { label: 'Energy Saved', value: platformImpact?.totalEnergySaved?.toFixed(0) || 0, unit: 'kWh', icon: '⚡' },
              { label: 'Water Saved', value: platformImpact?.totalWaterSaved?.toFixed(0) || 0, unit: 'liters', icon: '💧' },
              { label: 'E-Waste Diverted', value: platformImpact?.totalWeightDiverted?.toFixed(1) || 0, unit: 'kg', icon: '🗑️' },
            ].map(stat => (
              <div key={stat.label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.2rem', textAlign: 'center', border: '1px solid rgba(74,222,128,0.2)' }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>{stat.icon}</div>
                <div style={{ fontSize: '26px', fontWeight: '800', color: '#4ade80' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '12px', color: '#86efac', marginTop: '2px' }}>{stat.unit}</div>
                <div style={{ fontSize: '12px', color: '#a7f3d0', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Personal Calculator */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '1.5rem' }}>
          🧮 Personal Impact Calculator
        </h2>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '1.5rem' }}>
          Select your device type and quantity to see how much impact you make by recycling.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Device Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', background: '#fff' }}
            >
              {Object.keys(CATEGORY_IMPACT).map(cat => (
                <option key={cat} value={cat}>
                  {CATEGORY_IMPACT[cat].emoji} {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              Number of Devices
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
            />
          </div>
        </div>

        <button
          onClick={handleCalculate}
          style={{ background: '#16a34a', color: '#fff', padding: '12px 28px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '15px', width: '100%' }}
        >
          Calculate My Impact 🌱
        </button>

        {/* Results */}
        {calculated && (
          <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.4s ease' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#15803d', marginBottom: '1rem' }}>
                {calculated.emoji} Impact of recycling {quantity} {calculated.category}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                {[
                  { label: 'CO₂ Saved', value: calculated.co2, unit: 'kg', icon: '🌿', desc: 'Less greenhouse gas' },
                  { label: 'Energy Saved', value: calculated.energy, unit: 'kWh', icon: '⚡', desc: 'Enough to power a home' },
                  { label: 'Water Saved', value: calculated.water, unit: 'liters', icon: '💧', desc: 'Clean water preserved' },
                  { label: 'Waste Diverted', value: calculated.weight, unit: 'kg', icon: '🗑️', desc: 'Kept out of landfill' },
                ].map(item => (
                  <div key={item.label} style={{ background: '#fff', borderRadius: '10px', padding: '1rem', textAlign: 'center', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '24px', marginBottom: '4px' }}>{item.icon}</div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#16a34a' }}>{item.value}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.unit}</div>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: '#374151', marginTop: '4px' }}>{item.label}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{item.desc}</div>
                  </div>
                ))}
              </div>

              {/* Equivalent comparison */}
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff', borderRadius: '8px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#374151' }}>
                  🌳 That's equivalent to planting <strong style={{ color: '#16a34a' }}>{Math.ceil(calculated.co2 / 21)} trees</strong> or
                  driving <strong style={{ color: '#16a34a' }}>{Math.ceil(calculated.energy / 0.3)} km</strong> less in a car!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Why it matters */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '2rem' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a', marginBottom: '1rem' }}>
          🌱 Why E-Waste Recycling Matters
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { icon: '☠️', title: 'Toxic Materials', desc: 'Electronics contain lead, mercury and cadmium that poison soil and water when landfilled' },
            { icon: '⛏️', title: 'Rare Minerals', desc: 'Recycling recovers gold, silver and copper — reducing the need for harmful mining' },
            { icon: '🌡️', title: 'Climate Impact', desc: 'Manufacturing new electronics produces 70kg of CO₂ per device on average' },
            { icon: '🇱🇰', title: 'Sri Lanka', desc: 'Sri Lanka generates 100,000+ tonnes of e-waste yearly with very little properly recycled' },
          ].map(item => (
            <div key={item.title} style={{ background: '#f9fafb', borderRadius: '10px', padding: '1.2rem' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.icon}</div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>{item.title}</h3>
              <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ImpactCalculator;