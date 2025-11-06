// B2B Requests API - Placeholder
const { success, error, asyncHandler, setCorsHeaders } = require('../lib/response');
const { supabase } = require('../lib/supabase');

export default asyncHandler(async (req, res) => {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET /api/b2b
  if (req.method === 'GET') {
    const { data: requests } = await supabase
      .from('b2b_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    return success(res, requests || []);
  }
  
  // POST /api/b2b
  if (req.method === 'POST') {
    const { company_name, contact_person, email, phone, message } = req.body;
    
    const { data: request, error: insertError } = await supabase
      .from('b2b_requests')
      .insert([{
        company_name,
        contact_person,
        email,
        phone,
        message,
        status: 'pending'
      }])
      .select()
      .single();
    
    if (insertError) {
      return error(res, 'Gagal mengirim permintaan', 500);
    }
    
    return success(res, request, 'Permintaan B2B berhasil dikirim', 201);
  }
  
  return error(res, 'Method not allowed', 405);
});
