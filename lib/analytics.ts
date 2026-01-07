// Google Analytics 4 Event Tracking Helper Functions
// These functions push events to dataLayer for GTM to process

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export function pushToDataLayer(event: Record<string, any>) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(event);
  }
}

// Ecommerce Events

export function trackViewItem(product: {
  id: string;
  name: string;
  price?: number;
  brand?: string;
  category?: string;
}) {
  pushToDataLayer({
    event: 'view_item',
    ecommerce: {
      currency: 'EGP',
      value: product.price || 0,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price || 0,
          item_brand: product.brand,
          item_category: product.category,
        },
      ],
    },
  });
}

export function trackAddToCart(product: {
  id: string;
  name: string;
  price?: number;
  quantity: number;
  brand?: string;
  category?: string;
}) {
  pushToDataLayer({
    event: 'addToCart', // Custom event name for GTM trigger
    ecommerce: {
      currency: 'EGP',
      value: (product.price || 0) * product.quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price || 0,
          quantity: product.quantity,
          item_brand: product.brand,
          item_category: product.category,
        },
      ],
    },
  });
  
  // Also push standard GA4 event
  pushToDataLayer({
    event: 'add_to_cart',
    ecommerce: {
      currency: 'EGP',
      value: (product.price || 0) * product.quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price || 0,
          quantity: product.quantity,
          item_brand: product.brand,
          item_category: product.category,
        },
      ],
    },
  });
}

export function trackBeginCheckout(items: Array<{
  id: string;
  name: string;
  price?: number;
  quantity: number;
  brand?: string;
  category?: string;
}>) {
  const totalValue = items.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  pushToDataLayer({
    event: 'begin_checkout',
    ecommerce: {
      currency: 'EGP',
      value: totalValue,
      items: items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price || 0,
        quantity: item.quantity,
        item_brand: item.brand,
        item_category: item.category,
      })),
    },
  });
}

export function trackPurchase(order: {
  transaction_id: string;
  value: number;
  items: Array<{
    id: string;
    name: string;
    price?: number;
    quantity: number;
    brand?: string;
    category?: string;
  }>;
}) {
  pushToDataLayer({
    event: 'purchase',
    ecommerce: {
      transaction_id: order.transaction_id,
      value: order.value,
      currency: 'EGP',
      items: order.items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price || 0,
        quantity: item.quantity,
        item_brand: item.brand,
        item_category: item.category,
      })),
    },
  });
}

export function trackViewItemList(items: Array<{
  id: string;
  name: string;
  price?: number;
  brand?: string;
  category?: string;
}>, listName?: string) {
  pushToDataLayer({
    event: 'view_item_list',
    ecommerce: {
      item_list_name: listName || 'Product List',
      items: items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price || 0,
        item_brand: item.brand,
        item_category: item.category,
      })),
    },
  });
}

// Custom Events

export function trackSearch(searchTerm: string) {
  pushToDataLayer({
    event: 'search',
    search_term: searchTerm,
  });
}

export function trackProductClick(product: {
  id: string;
  name: string;
  listName?: string;
}) {
  pushToDataLayer({
    event: 'select_item',
    ecommerce: {
      items: [
        {
          item_id: product.id,
          item_name: product.name,
        },
      ],
    },
    item_list_name: product.listName,
  });
}

export function trackPageView(url: string, title?: string) {
  pushToDataLayer({
    event: 'page_view',
    page_location: url,
    page_title: title,
  });
}

