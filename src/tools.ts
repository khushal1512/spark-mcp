export const ALLOWED_CATEGORIES = [
  'smartphones',
  'tv',
  'shoes',
  'healthcare',
  'electronics',
  'fitness'
];

export const TOOLS = {
  get_products_by_category: {
    name: 'get_products_by_category',
    description: `Fetch all products from a specific category. Available categories: ${ALLOWED_CATEGORIES.join(', ')}`,
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: `The category name. Must be one of: ${ALLOWED_CATEGORIES.join(', ')}`,
          enum: ALLOWED_CATEGORIES,
        },
      },
      required: ['category'],
    },
  },
  get_smartphones_by_price: {
    name: 'get_smartphones_by_price',
    description: 'Filter smartphones by maximum price. This endpoint specifically filters smartphones only.',
    inputSchema: {
      type: 'object',
      properties: {
        maxPrice: {
          type: 'number',
          description: 'Maximum price to filter smartphones (e.g., 30000)',
          minimum: 0,
        },
      },
      required: ['maxPrice'],
    },
  },
  get_cart_items: {
    name: 'get_cart_items',
    description: 'Fetch all items currently in the shopping cart',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  get_available_coupons: {
    name: 'get_available_coupons',
    description: 'Fetch all available coupons and discount codes',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  get_order_history: {
    name: 'get_order_history',
    description: 'Fetch order history and transaction details',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  add_to_cart: {
    name: 'add_to_cart',
    description: 'Add a product to the shopping cart with specified quantity',
    inputSchema: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          description: 'The ID of the product to add to cart',
        },
        quantity: {
          type: 'number',
          description: 'Quantity of the product to add (default: 1)',
          minimum: 1,
        },
      },
      required: ['productId'],
    },
  },
  remove_from_cart: {
    name: 'remove_from_cart',
    description: 'Remove a product from the shopping cart',
    inputSchema: {
      type: 'object',
      properties: {
        productId: {
          type: 'string',
          description: 'The ID of the product to remove from cart',
        },
        removeAll: {
          type: 'boolean',
          description: 'Whether to remove all quantities of the product (default: false)',
        },
      },
      required: ['productId'],
    },
  },
  apply_coupon: {
    name: 'apply_coupon',
    description: 'Apply a discount coupon to the shopping cart',
    inputSchema: {
      type: 'object',
      properties: {
        couponCode: {
          type: 'string',
          description: 'The coupon code to apply',
        },
      },
      required: ['couponCode'],
    },
  },
  remove_coupon: {
    name: 'remove_coupon',
    description: 'Remove the applied coupon from the shopping cart',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  place_order: {
    name: 'place_order',
    description: 'Place an order with the current cart items',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
};
