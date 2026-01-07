# Quick GA4 Setup - Your Measurement ID: G-L62Q4G46RP

## ✅ Recommended: Add GA4 via Google Tag Manager

Since you already have GTM set up, this is the easiest and best way:

### Step-by-Step Instructions:

1. **Go to Google Tag Manager**
   - Visit: https://tagmanager.google.com/
   - Select container: **GTM-TG6HDXMP**

2. **Create GA4 Configuration Tag**
   - Click "Tags" in the left menu → Click "New"
   - Tag Name: **GA4 - Configuration**
   - Click "Tag Configuration" → Select **Google Analytics: GA4 Configuration**
   - Measurement ID: **G-L62Q4G46RP**
   - Click "Triggering" → Select **All Pages**
   - ✅ **IMPORTANT**: Scroll down and check **"Enable Enhanced Ecommerce"**
   - Click "Save"

3. **Submit and Publish**
   - Click "Submit" button (top right, orange button)
   - Version name: "Added GA4 Configuration"
   - Description: "GA4 setup with Measurement ID G-L62Q4G46RP"
   - Click "Publish"

4. **Verify It's Working**
   - Visit your site: https://alfaair.shop
   - Open GA4: https://analytics.google.com/
   - Go to Reports → Realtime
   - You should see yourself as an active user within 30 seconds!

## Alternative: Add GA4 Directly (If you prefer)

If you want to add GA4 directly without GTM, I can add the gtag.js script to your code. Just say "add GA4 directly" and I'll do it!

## What's Already Set Up

✅ Event tracking code is already implemented:
- Product views (view_item)
- Add to cart (add_to_cart)
- Begin checkout (begin_checkout)
- Purchase (purchase)

These events will automatically work once GA4 is configured in GTM!

## Next Steps After Setup

1. **Enable Enhanced Measurement**
   - GA4 → Admin → Data Streams → Click your stream
   - Enable "Enhanced measurement"

2. **Mark Conversions**
   - GA4 → Admin → Events
   - Toggle on: **purchase**, **add_to_cart**, **begin_checkout**

3. **Link with Search Console**
   - GA4 → Admin → Search Console Links
   - Link your Search Console property

