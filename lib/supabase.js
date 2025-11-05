// Supabase Client Configuration
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with service role key (full access)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Query helper (compatible dengan struktur lama)
const query = async (text, params = []) => {
  try {
    // Parse SQL query untuk extract table name dan operation
    const operation = text.trim().toUpperCase();
    
    if (operation.startsWith('SELECT')) {
      return await executeSelect(text, params);
    } else if (operation.startsWith('INSERT')) {
      return await executeInsert(text, params);
    } else if (operation.startsWith('UPDATE')) {
      return await executeUpdate(text, params);
    } else if (operation.startsWith('DELETE')) {
      return await executeDelete(text, params);
    } else {
      // For complex queries, use RPC or direct SQL
      const { data, error } = await supabase.rpc('execute_sql', {
        sql_query: text,
        sql_params: params
      });
      
      if (error) throw error;
      
      return {
        rows: data || [],
        rowCount: data?.length || 0
      };
    }
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

// Helper untuk SELECT queries
const executeSelect = async (text, params) => {
  // Extract table name dari query
  const tableMatch = text.match(/FROM\s+(\w+)/i);
  if (!tableMatch) {
    throw new Error('Could not parse table name from query');
  }
  
  const tableName = tableMatch[1];
  
  // Build Supabase query
  let supabaseQuery = supabase.from(tableName).select('*');
  
  // Parse WHERE conditions (simplified)
  if (text.includes('WHERE')) {
    // For complex queries, fallback to RPC
    const { data, error } = await supabase.rpc('execute_sql', {
      sql_query: text,
      sql_params: params
    });
    
    if (error) throw error;
    
    return {
      rows: data || [],
      rowCount: data?.length || 0
    };
  }
  
  const { data, error } = await supabaseQuery;
  
  if (error) throw error;
  
  return {
    rows: data || [],
    rowCount: data?.length || 0
  };
};

// Helper untuk INSERT queries
const executeInsert = async (text, params) => {
  const tableMatch = text.match(/INTO\s+(\w+)/i);
  if (!tableMatch) {
    throw new Error('Could not parse table name from INSERT query');
  }
  
  const tableName = tableMatch[1];
  
  // For complex inserts, use RPC
  const { data, error } = await supabase.rpc('execute_sql', {
    sql_query: text,
    sql_params: params
  });
  
  if (error) throw error;
  
  return {
    rows: data || [],
    rowCount: data?.length || 0
  };
};

// Helper untuk UPDATE queries
const executeUpdate = async (text, params) => {
  const { data, error } = await supabase.rpc('execute_sql', {
    sql_query: text,
    sql_params: params
  });
  
  if (error) throw error;
  
  return {
    rows: data || [],
    rowCount: data?.length || 0
  };
};

// Helper untuk DELETE queries
const executeDelete = async (text, params) => {
  const { data, error } = await supabase.rpc('execute_sql', {
    sql_query: text,
    sql_params: params
  });
  
  if (error) throw error;
  
  return {
    rows: data || [],
    rowCount: 1
  };
};

// Transaction helper
const transaction = async (callback) => {
  // Supabase doesn't support traditional transactions in the same way
  // But we can use RPC functions for complex transactions
  try {
    // Execute callback (simplified, might need adjustment based on usage)
    const result = await callback(supabase);
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  supabase,
  query,
  transaction
};
