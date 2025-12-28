import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, productName, productNameAr, productNameEn, quantity, name, phone, email, notes } = body;

    // Validate required fields
    if (!productName || !quantity || !name || !phone || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createClient();

    // Get product details if productId is provided
    let productNameArFinal = productNameAr || productName;
    let productNameEnFinal = productNameEn || productName;
    
    if (productId) {
      const { data: product } = await supabase
        .from('products')
        .select('name_ar, name_en')
        .eq('id', productId)
        .single();
      
      if (product) {
        productNameArFinal = product.name_ar;
        productNameEnFinal = product.name_en;
      }
    }

    // Save order to database first
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert({
        product_id: productId || null,
        product_name_ar: productNameArFinal,
        product_name_en: productNameEnFinal,
        quantity: parseInt(quantity),
        customer_name: name,
        customer_phone: phone,
        customer_email: email,
        notes: notes || null,
        email_sent: false,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Continue anyway - try to send email even if DB save fails
    }

    // Format email content
    const emailSubject = `New Order: ${productName}`;
    const emailBody = `
New Order Received

Product Details:
- Product Name: ${productName}
- Product ID: ${productId}
- Quantity: ${quantity}

Customer Information:
- Name: ${name}
- Phone: ${phone}
- Email: ${email}

${notes ? `Notes:\n${notes}` : ''}

---
This order was submitted through the AlfaAir website.
    `.trim();

    // Create transporter using Gmail SMTP
    // Note: You'll need to set up App Password in Gmail settings
    // Add SMTP_USER and SMTP_PASSWORD (Gmail App Password) to .env.local
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'alfa.air.condition.1995@gmail.com',
        pass: process.env.SMTP_PASSWORD || process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Email content for company
    const companyEmailHtml = `
      <h2>New Order Received</h2>
      <h3>Product Details:</h3>
      <ul>
        <li><strong>Product Name:</strong> ${productName}</li>
        <li><strong>Product ID:</strong> ${productId}</li>
        <li><strong>Quantity:</strong> ${quantity}</li>
      </ul>
      <h3>Customer Information:</h3>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Email:</strong> ${email}</li>
      </ul>
      ${notes ? `<h3>Notes:</h3><p>${notes.replace(/\n/g, '<br>')}</p>` : ''}
      <hr>
      <p><em>This order was submitted through the AlfaAir website.</em></p>
    `;

    // Email content for customer (confirmation)
    const customerEmailSubject = `Order Confirmation: ${productName}`;
    const customerEmailBody = `
Thank you for your order!

Order Details:
- Product Name: ${productName}
- Quantity: ${quantity}

We have received your order and will contact you soon to confirm the details.

Your Contact Information:
- Name: ${name}
- Phone: ${phone}
- Email: ${email}

${notes ? `Your Notes:\n${notes}` : ''}

Thank you for choosing AlfaAir!

Best regards,
AlfaAir Team
    `.trim();

    const customerEmailHtml = `
      <h2>Thank you for your order!</h2>
      <p>We have received your order and will contact you soon to confirm the details.</p>
      
      <h3>Order Details:</h3>
      <ul>
        <li><strong>Product Name:</strong> ${productName}</li>
        <li><strong>Quantity:</strong> ${quantity}</li>
      </ul>
      
      <h3>Your Contact Information:</h3>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Email:</strong> ${email}</li>
      </ul>
      
      ${notes ? `<h3>Your Notes:</h3><p>${notes.replace(/\n/g, '<br>')}</p>` : ''}
      
      <hr>
      <p>Thank you for choosing AlfaAir!</p>
      <p><strong>Best regards,<br>AlfaAir Team</strong></p>
    `;

    // Send email to company
    let emailSuccess = false;
    let emailErrorMsg = null;
    
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER || 'alfa.air.condition.1995@gmail.com',
        to: 'alfa.air.condition.1995@gmail.com',
        subject: emailSubject,
        text: emailBody,
        html: companyEmailHtml,
      });

      // Send confirmation email to customer
      await transporter.sendMail({
        from: process.env.SMTP_USER || 'alfa.air.condition.1995@gmail.com',
        to: email,
        subject: customerEmailSubject,
        text: customerEmailBody,
        html: customerEmailHtml,
      });

      emailSuccess = true;
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      emailErrorMsg = emailError instanceof Error ? emailError.message : 'Unknown error';
    }

    // Update order with email status
    if (order?.id) {
      await supabase
        .from('orders')
        .update({
          email_sent: emailSuccess,
          email_error: emailErrorMsg,
        })
        .eq('id', order.id);
    }

    if (emailSuccess) {
      return NextResponse.json({ 
        success: true,
        message: 'Order sent successfully'
      });
    } else {
      // Order saved to DB even if email fails
      return NextResponse.json({ 
        success: true,
        message: 'Order received and saved (email notification failed, but order is saved)'
      });
    }

  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    );
  }
}
