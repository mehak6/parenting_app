// import 'cordova-plugin-purchase';

declare const CdvPurchase: any;

export const PRODUCT_IDS = {
  MONTHLY: 'premium_monthly',
  YEARLY: 'premium_yearly'
};

let isInitialized = false;

export const initializeStore = (
  onSuccess: () => void,
  onError: (err: string) => void
) => {
  if (typeof CdvPurchase === 'undefined') {
    console.warn('Store not available (web mode)');
    return;
  }

  if (isInitialized) return;

  const { store, ProductType, Platform } = CdvPurchase;

  // 1. Register Products
  store.register([
    {
      type: ProductType.PAID_SUBSCRIPTION,
      id: PRODUCT_IDS.MONTHLY,
      platform: Platform.GOOGLE_PLAY,
    },
    {
      type: ProductType.PAID_SUBSCRIPTION,
      id: PRODUCT_IDS.YEARLY,
      platform: Platform.GOOGLE_PLAY,
    }
  ]);

  // 2. Setup Listeners
  // Note: v13+ API simplifies this. We listen for updates.
  store.when()
    .approved((transaction: any) => {
      transaction.verify();
    })
    .verified((receipt: any) => {
      console.log('Receipt verified:', receipt);
      receipt.finish();
      onSuccess();
    });
    //.error((error: any) => onError('Store Error: ' + error.message));

  // 3. Initialize
  store.initialize([Platform.GOOGLE_PLAY])
    .then(() => {
      isInitialized = true;
      console.log('Store initialized');
    });
};

export const purchaseProduct = (productId: string) => {
  if (typeof CdvPurchase === 'undefined') {
    alert("In-App Purchases only work on a real device.");
    return;
  }
  
  const { store } = CdvPurchase;
  const product = store.get(productId);
  
  if (product && product.canPurchase) {
    product.getOffer()?.order();
  } else {
    // In v13, sometimes products need to be found differently or offers selected.
    // Fallback for simple single-offer products:
    const offer = product?.offers?.[0];
    if (offer) {
        offer.order();
    } else {
        alert("Product not available or already owned.");
    }
  }
};