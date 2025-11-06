// Articles API - Placeholder
const { success, error, asyncHandler, setCorsHeaders } = require('../lib/response');
const { supabase } = require('../lib/supabase');

export default asyncHandler(async (req, res) => {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET /api/articles
  if (req.method === 'GET') {
    const { data: articles } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    
    return success(res, articles || []);
  }
  
  return error(res, 'Method not allowed', 405);
});
