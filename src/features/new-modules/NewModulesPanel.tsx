import React, { useEffect, useState } from 'react';
import axios from 'axios';

export function NewModulesPanel() {
  const [activeTab, setActiveTab] = useState<'portfolios' | 'candles' | 'alerts'>('portfolios');
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [candles, setCandles] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  // Formularios basicos
  const [portfolioName, setPortfolioName] = useState('');
  const [candleSymbol, setCandleSymbol] = useState('');
  const [alertSymbol, setAlertSymbol] = useState('');
  const [alertPrice, setAlertPrice] = useState('');

  // Formularios USO REAL
  const [assetSymbol, setAssetSymbol] = useState('');
  const [assetQty, setAssetQty] = useState('');
  const [assetPrice, setAssetPrice] = useState('');
  
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // Auto-refresh data every 5 seconds
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'portfolios') {
        const p = await axios.get('http://localhost:4000/api/portfolios').catch(() => ({ data: [] }));
        setPortfolios(p.data);
      } else if (activeTab === 'candles') {
        const c = await axios.get('http://localhost:4000/api/candles').catch(() => ({ data: [] }));
        setCandles(c.data);
      } else if (activeTab === 'alerts') {
        const a = await axios.get('http://localhost:4000/api/alerts').catch(() => ({ data: [] }));
        setAlerts(a.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // --- PORTAFOLIOS ---
  const createPortfolio = async () => {
    if (!portfolioName) return;
    await axios.post('http://localhost:4000/api/portfolios', { name: portfolioName, totalValue: 0 });
    setPortfolioName(''); fetchData();
  };
  const addAssetToPortfolio = async (id: string) => {
    if (!assetSymbol || !assetQty || !assetPrice) return alert("Llena todos los campos del activo");
    await axios.post(`http://localhost:4000/api/portfolios/${id}/assets`, {
      symbol: assetSymbol, quantity: Number(assetQty), averagePrice: Number(assetPrice)
    });
    setAssetSymbol(''); setAssetQty(''); setAssetPrice('');
    fetchData();
  };

  // --- VELAS ---
  const syncCandles = async () => {
    if (!candleSymbol) return;
    try {
      await axios.post('http://localhost:4000/api/candles/sync', { symbol: candleSymbol });
      setCandleSymbol(''); fetchData();
    } catch (e: any) { alert(e.response?.data?.error || "Error"); }
  };

  // --- ALERTAS ---
  const createAlert = async () => {
    if (!alertSymbol) return;
    await axios.post('http://localhost:4000/api/alerts', { 
      symbol: alertSymbol, targetPrice: Number(alertPrice), condition: 'above' 
    });
    setAlertSymbol(''); setAlertPrice(''); fetchData();
  };
  // Ya no usamos checkAlerts manual, se hace en el backend
  /*
  const checkAlerts = async () => {
    if (!alertSymbol) return;
    try {
      const res = await axios.post('http://localhost:4000/api/alerts/check', { symbol: alertSymbol });
      alert(res.data.message + "\nNotificaciones disparadas: " + res.data.triggered_count);
      fetchData();
    } catch (e: any) { alert(e.response?.data?.error || "Error"); }
  };
  */

  const deleteRecord = async (api: string, id: string) => {
    await axios.delete(`http://localhost:4000/api/${api}/${id}`);
    fetchData();
  };

  const formStyle = { display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' as any, alignItems: 'center' };
  const inputStyle = { padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '6px', width: '120px', background: 'var(--bg)', color: 'var(--text-h)', outline: 'none' };
  const btnStyle = { padding: '8px 16px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };

  return (
    <div style={{ marginTop: '40px', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden', background: 'var(--bg)' }}>
      {/* Top Bar Navigation */}
      <div style={{ display: 'flex', background: 'var(--code-bg)', borderBottom: '1px solid var(--border)' }}>
        <button 
          onClick={() => setActiveTab('portfolios')}
          style={{ flex: 1, padding: '16px', background: activeTab === 'portfolios' ? 'var(--accent-bg)' : 'transparent', border: 'none', borderBottom: activeTab === 'portfolios' ? '3px solid var(--accent)' : '3px solid transparent', color: activeTab === 'portfolios' ? 'var(--accent)' : 'var(--text)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Portafolios
        </button>
        <button 
          onClick={() => setActiveTab('candles')}
          style={{ flex: 1, padding: '16px', background: activeTab === 'candles' ? 'var(--accent-bg)' : 'transparent', border: 'none', borderBottom: activeTab === 'candles' ? '3px solid var(--accent)' : '3px solid transparent', color: activeTab === 'candles' ? 'var(--accent)' : 'var(--text)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Velas
        </button>
        <button 
          onClick={() => setActiveTab('alerts')}
          style={{ flex: 1, padding: '16px', background: activeTab === 'alerts' ? 'var(--accent-bg)' : 'transparent', border: 'none', borderBottom: activeTab === 'alerts' ? '3px solid var(--accent)' : '3px solid transparent', color: activeTab === 'alerts' ? 'var(--accent)' : 'var(--text)', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Alertas
        </button>
      </div>

      <div style={{ padding: '30px' }}>
        {/* Portfolios Module */}
        {activeTab === 'portfolios' && (
          <div className="animate-in">
            <h3 style={{ color: 'var(--text-h)', marginBottom: '10px' }}>Gestión de Portafolios</h3>
            <p style={{ color: 'var(--text)', marginBottom: '20px' }}>Crea un portafolio y agrégale activos. El sistema recalculará su valor total automáticamente.</p>
            
            <div style={formStyle}>
              <input style={inputStyle} placeholder="Nombre" value={portfolioName} onChange={e => setPortfolioName(e.target.value)} />
              <button style={btnStyle} onClick={createPortfolio}>Crear Portafolio</button>
            </div>
            
            <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
              {portfolios.map(p => (
                <div key={p._id} style={{ padding: '15px', background: 'var(--code-bg)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <strong style={{ color: 'var(--text-h)', fontSize: '1.2em' }}>{p.name} - Total: <span style={{ color: '#10b981' }}>${p.totalValue.toLocaleString()}</span></strong>
                    <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2em' }} onClick={() => deleteRecord('portfolios', p._id)}>X</button>
                  </div>
                  <div style={{...formStyle, marginTop: '15px', background: 'rgba(0,0,0,0.1)', padding: '10px', borderRadius: '6px'}}>
                    <input style={{...inputStyle, width:'80px'}} placeholder="Símbolo" value={assetSymbol} onChange={e=>setAssetSymbol(e.target.value.toUpperCase())} />
                    <input style={{...inputStyle, width:'80px'}} placeholder="Cantidad" type="number" value={assetQty} onChange={e=>setAssetQty(e.target.value)} />
                    <input style={{...inputStyle, width:'90px'}} placeholder="Precio" type="number" value={assetPrice} onChange={e=>setAssetPrice(e.target.value)} />
                    <button style={{...btnStyle, background:'#10b981'}} onClick={() => addAssetToPortfolio(p._id)}>Comprar Activo</button>
                  </div>
                  
                  {/* Bóveda de Activos */}
                  {p.assets && p.assets.length > 0 ? (
                    <div style={{ marginTop: '15px' }}>
                      <h4 style={{ color: 'var(--text-h)', marginBottom: '8px', fontSize: '0.9em', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bóveda de Activos</h4>
                      <div style={{ background: 'var(--bg)', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        <table style={{ width: '100%', fontSize: '0.9em', borderCollapse: 'collapse', textAlign: 'left' }}>
                          <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                            <tr>
                              <th style={{ padding: '8px', color: 'var(--text-h)' }}>Símbolo</th>
                              <th style={{ padding: '8px', color: 'var(--text-h)' }}>Cantidad</th>
                              <th style={{ padding: '8px', color: 'var(--text-h)' }}>Precio Prom.</th>
                              <th style={{ padding: '8px', color: 'var(--text-h)' }}>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {p.assets.map((asset: any, i: number) => (
                              <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                                <td style={{ padding: '8px', fontWeight: 'bold', color: 'var(--accent)' }}>{asset.symbol}</td>
                                <td style={{ padding: '8px', color: 'var(--text)' }}>{asset.quantity}</td>
                                <td style={{ padding: '8px', color: 'var(--text)' }}>${asset.averagePrice}</td>
                                <td style={{ padding: '8px', color: '#10b981' }}>${(asset.quantity * asset.averagePrice).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text)', fontSize: '0.9em', marginTop: '10px', fontStyle: 'italic' }}>El portafolio está vacío.</div>
                  )}
                </div>
              ))}
              {portfolios.length === 0 && <div style={{ color: 'var(--text)', fontStyle: 'italic' }}>No tienes portafolios creados.</div>}
            </div>
          </div>
        )}

        {/* Candles Module */}
        {activeTab === 'candles' && (
          <div className="animate-in">
            <h3 style={{ color: 'var(--text-h)', marginBottom: '10px' }}>Historial de Mercado</h3>
            <p style={{ color: 'var(--text)', marginBottom: '20px' }}>Sincroniza el historial diario de un activo financiero desde Finnhub.</p>
            
            <div style={formStyle}>
              <input style={inputStyle} placeholder="Símbolo" value={candleSymbol} onChange={e => setCandleSymbol(e.target.value.toUpperCase())} />
              <button style={{...btnStyle, background:'#8b5cf6'}} onClick={syncCandles}>Descargar Datos Reales</button>
            </div>
            
            <div style={{ marginTop: '20px', background: 'var(--code-bg)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <tr>
                    <th style={{ padding: '12px', color: 'var(--text-h)' }}>Fecha</th>
                    <th style={{ padding: '12px', color: 'var(--text-h)' }}>Símbolo</th>
                    <th style={{ padding: '12px', color: 'var(--text-h)' }}>Cierre</th>
                    <th style={{ padding: '12px', color: 'var(--text-h)' }}>Borrar</th>
                  </tr>
                </thead>
                <tbody>
                  {candles.map((c, i) => (
                    <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px', color: 'var(--text)' }}>{new Date(c.timestamp).toLocaleDateString()}</td>
                      <td style={{ padding: '12px', color: 'var(--accent)', fontWeight: 'bold' }}>{c.symbol}</td>
                      <td style={{ padding: '12px', color: '#10b981' }}>${c.close}</td>
                      <td style={{ padding: '12px' }}>
                        <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => deleteRecord('candles', c._id)}>X</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {candles.length === 0 && <div style={{ padding: '20px', color: 'var(--text)', textAlign: 'center', fontStyle: 'italic' }}>No hay velas registradas en la DB.</div>}
            </div>
          </div>
        )}

        {/* Alerts Module */}
        {activeTab === 'alerts' && (
          <div className="animate-in">
            <h3 style={{ color: 'var(--text-h)', marginBottom: '10px' }}>Motor de Alertas</h3>
            <p style={{ color: 'var(--text)', marginBottom: '20px' }}>Crea una alerta de precio y consulta el mercado para verificar el estado actual.</p>
            
            <div style={formStyle}>
              <input style={inputStyle} placeholder="Símbolo" value={alertSymbol} onChange={e => setAlertSymbol(e.target.value.toUpperCase())} />
              <input style={inputStyle} type="number" placeholder="Precio Meta" value={alertPrice} onChange={e => setAlertPrice(e.target.value)} />
              <button style={btnStyle} onClick={createAlert}>Crear Alerta</button>
            </div>
            

            
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {alerts.map((a, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: 'var(--code-bg)', borderLeft: a.isActive ? '4px solid #10b981' : '4px solid #6b7280', borderRadius: '4px' }}>
                  <div>
                    <strong style={{ color: 'var(--text-h)', fontSize: '1.1em', marginRight: '10px' }}>{a.symbol}</strong>
                    <span style={{ color: 'var(--text)' }}>Avisar si cruza {a.condition === 'above' ? 'hacia arriba' : 'hacia abajo'} de <strong style={{ color: '#10b981' }}>${a.targetPrice}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold', background: a.isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)', color: a.isActive ? '#10b981' : '#9ca3af' }}>
                      {a.isActive ? 'ACTIVA' : 'DISPARADA'}
                    </span>
                    <button style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => deleteRecord('alerts', a._id)}>X</button>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && <div style={{ color: 'var(--text)', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>No tienes alertas configuradas.</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
