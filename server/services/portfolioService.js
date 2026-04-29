import Portfolio from '../models/Portfolio.js'

export const portfolioService = {
  getAll: async () => await Portfolio.find().sort({ createdAt: -1 }),
  getById: async (id) => await Portfolio.findById(id),
  create: async (data) => await new Portfolio(data).save(),
  update: async (id, data) => await Portfolio.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  delete: async (id) => await Portfolio.findByIdAndDelete(id),
  
  // USO REAL: Agregar un activo y recalcular automáticamente el valor total del portafolio
  addAsset: async (id, assetData) => {
    const portfolio = await Portfolio.findById(id);
    if (!portfolio) throw new Error('Portafolio no encontrado');
    
    // Agregamos el activo al arreglo
    portfolio.assets.push(assetData);
    
    // Lógica de negocio: Recalcular el valor total basado en cantidad y precio
    portfolio.totalValue = portfolio.assets.reduce((sum, asset) => {
      return sum + (asset.quantity * asset.averagePrice);
    }, 0);
    
    return await portfolio.save();
  }
}
