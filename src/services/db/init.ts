import mongoose from 'mongoose';
import { connectToMongoDB } from './connection';

/**
 * Script para inicializar la base de datos db_trading con todas las colecciones
 * Ejecutar una sola vez para crear las colecciones con validadores
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    await connectToMongoDB();

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    console.log('Initializing db_trading collections...');

    // 1. Users collection
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['email', 'role', 'timezone'],
          properties: {
            email: { bsonType: 'string' },
            full_name: { bsonType: 'string' },
            role: { bsonType: 'string', enum: ['owner', 'trader', 'viewer'] },
            timezone: { bsonType: 'string' },
            is_active: { bsonType: 'bool' },
            preferences: { bsonType: 'object' }
          }
        }
      }
    });
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('✓ users collection created');

    // 2. Strategies collection
    await db.createCollection('strategies', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'min_confidence_threshold'],
          properties: {
            user_id: { bsonType: 'objectId' },
            name: { bsonType: 'string' },
            description: { bsonType: 'string' },
            preset_code: { bsonType: 'string' },
            is_preset: { bsonType: 'bool' },
            is_active: { bsonType: 'bool' },
            enabled_cores: { bsonType: 'object' },
            indicator_config: { bsonType: 'object' },
            structure_config: { bsonType: 'object' },
            institutional_config: { bsonType: 'object' },
            news_config: { bsonType: 'object' },
            fundamentals_config: { bsonType: 'object' },
            ai_advisor_config: { bsonType: 'object' },
            option_strategies: { bsonType: 'array' },
            recommended_timeframes: { bsonType: 'array' },
            min_confidence_threshold: { bsonType: 'decimal' }
          }
        }
      }
    });
    await db.collection('strategies').createIndex({ user_id: 1 });
    await db.collection('strategies').createIndex({ preset_code: 1 }, { unique: true, sparse: true });
    console.log('✓ strategies collection created');

    // 3. Broker Accounts collection
    await db.createCollection('broker_accounts', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['user_id', 'broker_name', 'account_number'],
          properties: {
            user_id: { bsonType: 'objectId' },
            broker_name: { bsonType: 'string' },
            account_number: { bsonType: 'string' },
            account_type: { bsonType: 'string', enum: ['cash', 'margin', 'ira', 'paper'] },
            balance: { bsonType: 'decimal' },
            buying_power: { bsonType: 'decimal' },
            is_active: { bsonType: 'bool' },
            is_paper: { bsonType: 'bool' },
            credentials: { bsonType: 'object' }
          }
        }
      }
    });
    await db.collection('broker_accounts').createIndex({ user_id: 1 });
    console.log('✓ broker_accounts collection created');

    // 4. Orders collection
    await db.createCollection('orders', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['user_id', 'symbol', 'side', 'quantity', 'order_type', 'status'],
          properties: {
            user_id: { bsonType: 'objectId' },
            broker_account_id: { bsonType: 'objectId' },
            symbol: { bsonType: 'string' },
            side: { bsonType: 'string', enum: ['BUY', 'SELL'] },
            quantity: { bsonType: 'decimal' },
            order_type: { bsonType: 'string', enum: ['market', 'limit', 'stop', 'stop_limit'] },
            limit_price: { bsonType: 'decimal' },
            stop_price: { bsonType: 'decimal' },
            filled_price: { bsonType: 'decimal' },
            filled_quantity: { bsonType: 'decimal' },
            status: { bsonType: 'string', enum: ['pending', 'filled', 'cancelled', 'rejected', 'partial'] },
            asset_type: { bsonType: 'string', enum: ['STOCK', 'OPTION', 'ETF', 'CRYPTO', 'FOREX'] },
            broker_order_id: { bsonType: 'string' },
            submitted_at: { bsonType: 'date' },
            filled_at: { bsonType: 'date' }
          }
        }
      }
    });
    await db.collection('orders').createIndex({ user_id: 1, status: 1 });
    await db.collection('orders').createIndex({ symbol: 1, submitted_at: -1 });
    console.log('✓ orders collection created');

    // 5. Positions collection
    await db.createCollection('positions', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['user_id', 'symbol', 'side', 'quantity', 'entry_price', 'asset_type'],
          properties: {
            user_id: { bsonType: 'objectId' },
            broker_account_id: { bsonType: 'objectId' },
            order_id: { bsonType: 'objectId' },
            symbol: { bsonType: 'string' },
            side: { bsonType: 'string', enum: ['LONG', 'SHORT'] },
            quantity: { bsonType: 'decimal' },
            entry_price: { bsonType: 'decimal' },
            current_price: { bsonType: 'decimal' },
            stop_loss: { bsonType: 'decimal' },
            take_profit: { bsonType: 'decimal' },
            unrealized_pnl: { bsonType: 'decimal' },
            unrealized_pnl_pct: { bsonType: 'decimal' },
            asset_type: { bsonType: 'string', enum: ['STOCK', 'OPTION', 'ETF', 'CRYPTO', 'FOREX'] },
            is_open: { bsonType: 'bool' },
            opened_at: { bsonType: 'date' },
            closed_at: { bsonType: 'date' }
          }
        }
      }
    });
    await db.collection('positions').createIndex({ user_id: 1, is_open: 1 });
    await db.collection('positions').createIndex({ symbol: 1, opened_at: -1 });
    console.log('✓ positions collection created');

    // 6. Risk Configs collection
    await db.createCollection('risk_configs', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['user_id'],
          properties: {
            user_id: { bsonType: 'objectId' },
            max_position_size_pct: { bsonType: 'decimal' },
            max_daily_loss_pct: { bsonType: 'decimal' },
            default_stop_loss_pct: { bsonType: 'decimal' },
            default_take_profit_pct: { bsonType: 'decimal' },
            max_concurrent_positions: { bsonType: 'int' },
            max_iv_percentile: { bsonType: 'int' },
            preferred_dte_min: { bsonType: 'int' },
            preferred_dte_max: { bsonType: 'int' },
            max_option_premium_pct: { bsonType: 'decimal' }
          }
        }
      }
    });
    await db.collection('risk_configs').createIndex({ user_id: 1 }, { unique: true });
    console.log('✓ risk_configs collection created');

    // 7. Signal Events collection
    await db.createCollection('signal_events', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['symbol', 'timeframe', 'action', 'confidence', 'occurred_at'],
          properties: {
            symbol: { bsonType: 'string' },
            timeframe: { bsonType: 'string', enum: ['1m','5m','15m','1h','4h','1d','1w','1M','1Y'] },
            action: { bsonType: 'string', enum: ['BUY', 'SELL', 'HOLD'] },
            confidence: { bsonType: 'decimal' },
            score: { bsonType: 'decimal' },
            score_max: { bsonType: 'decimal' },
            strategy_id: { bsonType: 'objectId' },
            selected_cores: { bsonType: 'array' },
            indicators: { bsonType: 'object' },
            cores: { bsonType: 'object' },
            ai_confirmation: { bsonType: 'object' },
            suggested_params: { bsonType: 'object' },
            price_at_signal: { bsonType: 'decimal' },
            reason: { bsonType: 'string' },
            status: { bsonType: 'string', enum: ['active','executed','dismissed','expired'] },
            expires_at: { bsonType: 'date' },
            occurred_at: { bsonType: 'date' }
          }
        }
      }
    });
    await db.collection('signal_events').createIndex({ symbol: 1, occurred_at: -1 });
    await db.collection('signal_events').createIndex({ strategy_id: 1, status: 1 });
    await db.collection('signal_events').createIndex({ status: 1, expires_at: 1 });
    console.log('✓ signal_events collection created');

    // 8. Signal Performance collection
    await db.createCollection('signal_performance', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['signal_id', 'symbol', 'action'],
          properties: {
            signal_id: { bsonType: 'objectId' },
            symbol: { bsonType: 'string' },
            action: { bsonType: 'string' },
            confidence: { bsonType: 'decimal' },
            entry_price: { bsonType: 'decimal' },
            exit_price: { bsonType: 'decimal' },
            pnl: { bsonType: 'decimal' },
            pnl_pct: { bsonType: 'decimal' },
            result: { bsonType: 'string', enum: ['win', 'loss', 'open', 'unknown'] },
            trade_id: { bsonType: 'objectId' },
            recorded_at: { bsonType: 'date' }
          }
        }
      }
    });
    await db.collection('signal_performance').createIndex({ signal_id: 1 });
    await db.collection('signal_performance').createIndex({ symbol: 1, result: 1 });
    console.log('✓ signal_performance collection created');

    // 9. Watchlists collection
    await db.createCollection('watchlists', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['user_id', 'name'],
          properties: {
            user_id: { bsonType: 'objectId' },
            name: { bsonType: 'string' },
            description: { bsonType: 'string' },
            is_default: { bsonType: 'bool' },
            is_active: { bsonType: 'bool' },
            symbols: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                required: ['symbol', 'instrument_type'],
                properties: {
                  symbol: { bsonType: 'string' },
                  instrument_type: { bsonType: 'string', enum: ['Stock','ETF','Index','Option'] },
                  sector: { bsonType: 'string' },
                  is_active: { bsonType: 'bool' },
                  sort_order: { bsonType: 'int' }
                }
              }
            }
          }
        }
      }
    });
    await db.collection('watchlists').createIndex({ user_id: 1 });
    await db.collection('watchlists').createIndex({ 'symbols.symbol': 1 });
    console.log('✓ watchlists collection created');

    console.log('\n🎉 Database initialization completed successfully!');
    console.log('All collections created with validators and indexes.');

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\nCreated collections:');
    collections.forEach(col => console.log(`- ${col.name}`));

  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

// Script execution (only run once)
if (import.meta.env.DEV) {
  // Uncomment the line below to run initialization
  // initializeDatabase().catch(console.error);
}