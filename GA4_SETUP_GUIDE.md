# Google Analytics 4 (GA4) Setup Guide

## Step 1: Create GA4 Property

1. **Go to Google Analytics**
   - Visit: https://analytics.google.com/
   - Sign in with your Google account

2. **Create a New Property**
   - Click "Admin" (gear icon) in the bottom left
   - Under "Property" column, click "Create Property"
   - Enter property name: **AlfaAir**
   - Select timezone: **Africa/Cairo** (GMT+2)
   - Select currency: **EGP (Egyptian Pound)**
   - Click "Next"

3. **Business Information**
   - Select industry: **Retail/E-commerce** or **Home & Garden**
   - Select business size: Choose appropriate size
   - Select how you intend to use GA4: Select all relevant options
   - Click "Create"

4. **Set Up Data Stream**
   - Select platform: **Web**
   - Enter website URL: **https://alfaair.shop**
   - Enter stream name: **AlfaAir Website**
   - Click "Create stream"

## Step 2: Get Your Measurement ID

After creating the data stream, you'll see:
- **Measurement ID**: Format `G-XXXXXXXXXX`
- **Your Measurement ID**: **G-L62Q4G46RP** ✅
- Copy this ID - you'll need it for the next steps

## Step 3: Add GA4 to Google Tag Manager

Since you already have GTM set up, we'll add GA4 through GTM:

1. **Go to Google Tag Manager**
   - Visit: https://tagmanager.google.com/
   - Select your container: **GTM-TG6HDXMP**

2. **Create GA4 Configuration Tag**
   - Click "Tags" → "New"
   - Tag Name: **GA4 - Configuration**
   - Tag Type: **Google Analytics: GA4 Configuration**
   - Measurement ID: **G-L62Q4G46RP** (paste your Measurement ID here)
   - Triggering: Select **All Pages**
   - **Enable Enhanced Ecommerce**: Check this box (important!)
   - Click "Save"

3. **Enable Enhanced Measurement in GA4 (Recommended)**
   - In GA4, go to Admin → Data Streams → Click your stream
   - Scroll to "Enhanced measurement"
   - Make sure it's **ON**
   - Enable: Page views, Scrolls, Outbound clicks, Site search, Video engagement, File downloads

4. **Create GA4 Event Tags (Optional but Recommended)**
   
   **Add to Cart Event:**
   - Click "Tags" → "New"
   - Tag Name: **GA4 - Add to Cart**
   - Tag Type: **Google Analytics: GA4 Event**
   - Configuration Tag: Select **GA4 - Configuration**
   - Event Name: **add_to_cart**
   - Triggering: Create new trigger → **Custom Event**
     - Event name: **addToCart**
     - This trigger fires on: **All Custom Events**
   - Click "Save"

   **Purchase Event:**
   - Click "Tags" → "New"
   - Tag Name: **GA4 - Purchase**
   - Tag Type: **Google Analytics: GA4 Event**
   - Configuration Tag: Select **GA4 - Configuration**
   - Event Name: **purchase**
   - Triggering: Create new trigger → **Custom Event**
     - Event name: **purchase**
   - Click "Save"

5. **Submit and Publish**
   - Click "Submit" in the top right
   - Add version name: "Added GA4 Configuration"
   - Add description: "Initial GA4 setup"
   - Click "Publish"

## Step 4: Verify Installation

1. **Real-Time Test**
   - Go to GA4 → Reports → Realtime
   - Visit your website: https://alfaair.shop
   - You should see yourself as an active user within 30 seconds

2. **DebugView (Recommended)**
   - In GA4, go to Admin → Data Streams → Click your stream
   - Enable "Enhanced measurement" (if not already enabled)
   - Go to Configure → DebugView
   - Visit your site - you'll see events in real-time

## Step 5: Set Up Enhanced Ecommerce Events

**✅ Already Implemented in Code!**

The following events are automatically tracked by the website code:
- **view_item**: When viewing a product page ✅
- **add_to_cart**: When adding product to cart ✅
- **begin_checkout**: When starting checkout ✅
- **purchase**: When completing an order ✅
- **view_item_list**: When viewing product list (can be added)

**Note**: The code pushes these events to `dataLayer`. Make sure your GTM tags are configured to listen for these events.

## Step 6: Configure Goals/Conversions

1. **Mark Events as Conversions**
   - Go to GA4 → Admin → Events
   - Toggle on events you want as conversions:
     - **purchase** (most important)
     - **add_to_cart**
     - **begin_checkout**

2. **Create Custom Conversions (Optional)**
   - Go to Admin → Conversions
   - Click "New conversion event"
   - Add event names you want to track as conversions

## Step 7: Link GA4 with Google Search Console

1. **In GA4:**
   - Go to Admin → Search Console Links
   - Click "Link"
   - Select your Search Console property
   - Click "Confirm"

2. **In Search Console:**
   - Go to Settings → Google Analytics property
   - Select your GA4 property
   - Click "Save"

## Step 8: Set Up Audiences (Optional)

1. **Go to GA4 → Admin → Audiences**
2. **Create Custom Audiences:**
   - **Cart Abandoners**: Users who added to cart but didn't purchase
   - **Product Viewers**: Users who viewed products
   - **High-Value Customers**: Users with high purchase value

## Important Notes:

- **Data Collection**: GA4 starts collecting data immediately after setup
- **Reporting Delay**: Standard reports may take 24-48 hours to populate
- **Real-Time**: Real-time reports show data immediately
- **Privacy**: Ensure GDPR compliance if serving EU customers
- **Testing**: Always test in DebugView before relying on data

## Troubleshooting:

- **Not seeing data?**
  - Check GTM container is published
  - Verify Measurement ID is correct
  - Check browser console for errors
  - Use GA4 DebugView

- **Events not firing?**
  - Check GTM triggers are set up correctly
  - Verify event names match exactly
  - Use GTM Preview mode to test

## Next Steps:

1. Set up custom dimensions for better tracking
2. Create custom reports for your business needs
3. Set up automated email reports
4. Configure data retention settings
5. Set up user properties for better segmentation

