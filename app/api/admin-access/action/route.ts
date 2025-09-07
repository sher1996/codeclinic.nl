import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { sendUserNotification } from '@/lib/email-service';

// Initialize Supabase client
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

// Validation schema for admin action
const adminActionSchema = z.object({
  token: z.string().min(1, 'Token required'),
  action: z.enum(['approve', 'deny']),
  requestId: z.string().uuid('Invalid request ID')
});


// GET - Handle admin approval/denial via email links
export async function GET(request: Request) {
  console.log('[admin-access-action] GET request received');
  
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const action = searchParams.get('action');
  const requestId = searchParams.get('requestId');
  
  try {
    const validated = adminActionSchema.parse({
      token,
      action,
      requestId
    });
    
    console.log('[admin-access-action] Validated action:', { action: validated.action, requestId: validated.requestId });
    
    if (!supabase) {
      return NextResponse.json(
        { ok: false, error: "Database not configured" },
        { status: 500 }
      );
    }
    
    // Find the request and verify token
    const { data: request, error: fetchError } = await supabase
      .from('admin_access_requests')
      .select('*')
      .eq('id', validated.requestId)
      .single();
    
    if (fetchError) {
      console.error('[admin-access-action] Request not found:', fetchError);
      return NextResponse.json(
        { ok: false, error: "Request not found or already processed" },
        { status: 404 }
      );
    }
    
    if (request.status !== 'pending') {
      return NextResponse.json(
        { ok: false, error: "Request has already been processed" },
        { status: 400 }
      );
    }
    
    // Verify token
    const expectedToken = validated.action === 'approve' ? request.approve_token : request.deny_token;
    if (token !== expectedToken) {
      console.error('[admin-access-action] Invalid token');
      return NextResponse.json(
        { ok: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }
    
    // Update request status
    const newStatus = validated.action === 'approve' ? 'approved' : 'denied';
    const { error: updateError } = await supabase
      .from('admin_access_requests')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString(),
        processed_at: new Date().toISOString()
      })
      .eq('id', validated.requestId);
    
    if (updateError) {
      console.error('[admin-access-action] Failed to update request:', updateError);
      throw updateError;
    }
    
    // Send notification to user using Gmail SMTP
    try {
      await sendUserNotification(request.email, request.name, validated.action === 'approve');
    } catch (emailError) {
      console.error('[admin-access-action] Failed to send user notification:', emailError);
      // Don't fail the whole operation if email fails
    }
    
    // Return success page HTML
    const isApproved = validated.action === 'approve';
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Access ${isApproved ? 'Approved' : 'Denied'}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            background: white;
            border-radius: 15px;
            padding: 40px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          .icon {
            font-size: 64px;
            margin-bottom: 20px;
          }
          h1 {
            color: ${isApproved ? '#28a745' : '#dc3545'};
            margin-bottom: 20px;
          }
          p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .details {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: left;
          }
          .details strong {
            color: #333;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">${isApproved ? '✅' : '❌'}</div>
          <h1>Admin Access ${isApproved ? 'Approved' : 'Denied'}</h1>
          <p>
            ${isApproved 
              ? 'The admin access request has been successfully approved. The user will be notified by email and can now access the admin panel.'
              : 'The admin access request has been denied. The user will be notified by email.'
            }
          </p>
          
          <div class="details">
            <p><strong>Request ID:</strong> ${request.id}</p>
            <p><strong>User:</strong> ${request.name} (${request.email})</p>
            <p><strong>Requested:</strong> ${new Date(request.created_at).toLocaleString('nl-NL')}</p>
            <p><strong>Processed:</strong> ${new Date().toLocaleString('nl-NL')}</p>
            ${request.reason ? `<p><strong>Reason:</strong> ${request.reason}</p>` : ''}
          </div>
          
          <p style="font-size: 14px; color: #999;">
            This action has been logged and the user has been notified by email.
          </p>
        </div>
      </body>
      </html>
    `;
    
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
    
  } catch (error) {
    console.error('[admin-access-action] GET request failed:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Invalid request parameters", details: error.errors },
        { status: 400 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { ok: false, error: "Failed to process admin action", details: errorMessage },
      { status: 500 }
    );
  }
}
