import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { sendAdminApprovalRequest, sendAccessRequestConfirmation } from '@/lib/email-service';

// Initialize Supabase client
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

// Admin email is configured in the email service

// Validation schema for admin access request
const adminAccessRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  reason: z.string().optional()
});

// Admin action schema is handled in the action route

// Generate a secure token for admin actions
function generateAdminToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Send admin approval request email using Gmail SMTP
async function sendAdminApprovalRequestEmail(request: {
  id: string;
  email: string;
  name: string;
  reason?: string;
  createdAt: string;
  approveToken: string;
  denyToken: string;
}) {
  try {
    const result = await sendAdminApprovalRequest(request);
    console.log('[admin-access] Approval request sent successfully:', result);
    return { success: true, result };
  } catch (error) {
    console.error('[admin-access] Failed to send approval request:', error);
    throw error;
  }
}

// Send approval/denial notification to user using Gmail SMTP
// User notification is handled by the email service directly

// POST - Request admin access
export async function POST(request: Request) {
  console.log('[admin-access] POST request received');
  
  try {
    const body = await request.json();
    const validated = adminAccessRequestSchema.parse(body);
    
    console.log('[admin-access] Validated request:', { email: validated.email, name: validated.name });
    
    // Check if email service is configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('[admin-access] Gmail credentials not configured');
      return NextResponse.json(
        { ok: false, error: "Email service not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD" },
        { status: 500 }
      );
    }
    
    // Check if user already has pending request
    if (supabase) {
      const { data: existingRequest } = await supabase
        .from('admin_access_requests')
        .select('*')
        .eq('email', validated.email)
        .eq('status', 'pending')
        .single();
      
      if (existingRequest) {
        return NextResponse.json(
          { ok: false, error: "You already have a pending admin access request" },
          { status: 409 }
        );
      }
    }
    
    // Generate tokens
    const approveToken = generateAdminToken();
    const denyToken = generateAdminToken();
    
    // Create admin access request
    const requestData = {
      id: crypto.randomUUID(),
      email: validated.email,
      name: validated.name,
      reason: validated.reason || null,
      status: 'pending',
      approve_token: approveToken,
      deny_token: denyToken,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Store in database if available
    if (supabase) {
      const { error } = await supabase
        .from('admin_access_requests')
        .insert([requestData]);
      
      if (error) {
        console.error('[admin-access] Database error:', error);
        throw error;
      }
    }
    
    // Send approval request to admin using Gmail SMTP
    await sendAdminApprovalRequestEmail({
      ...requestData,
      createdAt: requestData.created_at,
      approveToken,
      denyToken
    });
    
    // Send confirmation email to user
    try {
      await sendAccessRequestConfirmation(validated.email, validated.name);
      console.log('[admin-access] Confirmation email sent to user');
    } catch (error) {
      console.error('[admin-access] Failed to send confirmation email to user:', error);
      // Don't fail the request if confirmation email fails
    }
    
    return NextResponse.json({ 
      ok: true, 
      message: "Admin access request sent successfully. You will be notified by email once approved or denied.",
      requestId: requestData.id
    });
    
  } catch (error) {
    console.error('[admin-access] POST request failed:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { ok: false, error: "Failed to process admin access request", details: errorMessage },
      { status: 500 }
    );
  }
}

// GET - Check admin access status
export async function GET(request: Request) {
  console.log('[admin-access] GET request received');
  
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  
  if (!email) {
    return NextResponse.json(
      { ok: false, error: "Email parameter required" },
      { status: 400 }
    );
  }
  
  try {
    if (supabase) {
      const { data: request, error } = await supabase
        .from('admin_access_requests')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('[admin-access] Database error:', error);
        throw error;
      }
      
      return NextResponse.json({ 
        ok: true, 
        hasAccess: request?.status === 'approved',
        request: request || null
      });
    } else {
      return NextResponse.json({ 
        ok: true, 
        hasAccess: false,
        request: null,
        warning: 'Database not configured'
      });
    }
  } catch (error) {
    console.error('[admin-access] GET request failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { ok: false, error: "Failed to check admin access", details: errorMessage },
      { status: 500 }
    );
  }
}
