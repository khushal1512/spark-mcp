import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { TOOLS, ALLOWED_CATEGORIES } from './tools.js';

const server = new Server(
  {
    name: 'Spark-Customer-Agent',
    version: '0.3.0',
  },
  {
    capabilities: {
      tools: {
        listChanged: true,
      },
    },
  }
);

// Backend configuration
const BACKEND_BASE_URL = 'http://localhost:3000';

// Helper function to make HTTP requests
async function makeHttpRequest(url: string, options: RequestInit = {}): Promise<any> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Handle different response statuses
    if (response.status === 404) {
      const errorData = await response.json().catch(() => ({ message: 'Not found' }));
      throw new Error(errorData.message || 'Resource not found');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('HTTP request failed:', error);
    throw error;
  }
}

// Helper function to create standardized responses
function createResponse(success: boolean, data?: any, message?: string, error?: string): string {
  return JSON.stringify({
    success,
    data: data || null,
    message: message || (success ? 'Request completed successfully' : 'Request failed'),
    error: error || null,
    timestamp: new Date().toISOString(),
  }, null, 2);
}

// Tool handlers
async function handleGetProductsByCategory(category: string): Promise<string> {
  try {
    // Validate category
    if (!ALLOWED_CATEGORIES.includes(category)) {
      return createResponse(false, null, 
        `Invalid category: ${category}. Available categories: ${ALLOWED_CATEGORIES.join(', ')}`, 
        'Invalid category'
      );
    }

    const url = `${BACKEND_BASE_URL}/products/${encodeURIComponent(category)}`;
    const data = await makeHttpRequest(url);
    
    // Handle array response from MongoDB
    if (Array.isArray(data)) {
      return createResponse(true, data, 
        `Successfully fetched ${data.length} products for category: ${category}`
      );
    }
    
    return createResponse(true, data, `Successfully fetched products for category: ${category}`);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    return createResponse(false, null, `Failed to fetch products for category: ${category}`, errorMsg);
  }
}

async function handleGetSmartphonesByPrice(maxPrice: number): Promise<string> {
  try {
    if (maxPrice < 0) {
      return createResponse(false, null, 'Price must be a positive number', 'Invalid price');
    }

    const url = `${BACKEND_BASE_URL}/products/smartphones/${maxPrice}`;
    const data = await makeHttpRequest(url);
    
    // Handle array response from MongoDB
    if (Array.isArray(data)) {
      return createResponse(true, data, 
        `Successfully fetched ${data.length} smartphones under ₹${maxPrice}`
      );
    }
    
    return createResponse(true, data, `Successfully fetched smartphones under ₹${maxPrice}`);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    return createResponse(false, null, `Failed to fetch smartphones under ₹${maxPrice}`, errorMsg);
  }
}

async function handleGetCartItems(): Promise<string> {
  try {
    const url = `${BACKEND_BASE_URL}/cart`;
    const data = await makeHttpRequest(url);
    
    // Handle array response from MongoDB
    if (Array.isArray(data)) {
      const totalItems = data.length;
      const message = totalItems === 0 ? 'Cart is empty' : `Successfully fetched ${totalItems} items from cart`;
      return createResponse(true, data, message);
    }
    
    return createResponse(true, data, 'Successfully fetched cart items');
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    // Handle empty cart case
    if (errorMsg.includes('Cart is empty')) {
      return createResponse(true, [], 'Cart is empty');
    }
    return createResponse(false, null, 'Failed to fetch cart items', errorMsg);
  }
}

async function handleGetAvailableCoupons(): Promise<string> {
  try {
    const url = `${BACKEND_BASE_URL}/coupons`;
    const data = await makeHttpRequest(url);
    
    // Handle array response from MongoDB
    if (Array.isArray(data)) {
      const totalCoupons = data.length;
      const message = totalCoupons === 0 ? 'No coupons available' : `Successfully fetched ${totalCoupons} available coupons`;
      return createResponse(true, data, message);
    }
    
    return createResponse(true, data, 'Successfully fetched available coupons');
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    // Handle no coupons case
    if (errorMsg.includes('No coupons available')) {
      return createResponse(true, [], 'No coupons available');
    }
    return createResponse(false, null, 'Failed to fetch available coupons', errorMsg);
  }
}

async function handleGetOrderHistory(): Promise<string> {
  try {
    const url = `${BACKEND_BASE_URL}/orders`;
    const data = await makeHttpRequest(url);
    
    // Handle array response from MongoDB
    if (Array.isArray(data)) {
      const totalOrders = data.length;
      const message = totalOrders === 0 ? 'No orders available' : `Successfully fetched ${totalOrders} orders from history`;
      return createResponse(true, data, message);
    }
    
    return createResponse(true, data, 'Successfully fetched order history');
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    // Handle no orders case
    if (errorMsg.includes('No orders available')) {
      return createResponse(true, [], 'No orders available');
    }
    return createResponse(false, null, 'Failed to fetch order history', errorMsg);
  }
}

async function handleAddToCart(productId: string, quantity: number = 1): Promise<string> {
  try {
    if (quantity <= 0) {
      return createResponse(false, null, 'Quantity must be greater than 0', 'Invalid quantity');
    }

    const url = `${BACKEND_BASE_URL}/cart/add`;
    const data = await makeHttpRequest(url, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
    
    return createResponse(true, data, `Successfully added ${quantity} item(s) to cart`);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    return createResponse(false, null, `Failed to add product to cart`, errorMsg);
  }
}

async function handleRemoveFromCart(productId: string, removeAll: boolean = false): Promise<string> {
  try {
    const url = `${BACKEND_BASE_URL}/cart/remove`;
    const data = await makeHttpRequest(url, {
      method: 'DELETE',
      body: JSON.stringify({ productId, removeAll }),
    });
    
    const message = removeAll ? 'Successfully removed all items from cart' : 'Successfully removed 1 item from cart';
    return createResponse(true, data, message);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    return createResponse(false, null, `Failed to remove product from cart`, errorMsg);
  }
}

async function handleApplyCoupon(couponCode: string): Promise<string> {
  try {
    const url = `${BACKEND_BASE_URL}/cart/apply-coupon`;
    const data = await makeHttpRequest(url, {
      method: 'POST',
      body: JSON.stringify({ couponCode }),
    });
    
    return createResponse(true, data, `Successfully applied coupon: ${couponCode}`);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    return createResponse(false, null, `Failed to apply coupon: ${couponCode}`, errorMsg);
  }
}

async function handleRemoveCoupon(): Promise<string> {
  try {
    const url = `${BACKEND_BASE_URL}/cart/remove-coupon`;
    const data = await makeHttpRequest(url, {
      method: 'DELETE',
    });
    
    return createResponse(true, data, 'Successfully removed coupon from cart');
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    return createResponse(false, null, 'Failed to remove coupon from cart', errorMsg);
  }
}

async function handlePlaceOrder(): Promise<string> {
  try {
    const url = `${BACKEND_BASE_URL}/orders/place`;
    const data = await makeHttpRequest(url, {
      method: 'POST',
    });
    
    return createResponse(true, data, 'Order placed successfully!');
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    return createResponse(false, null, 'Failed to place order', errorMsg);
  }
}

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.error(`ListTools called - returning ${Object.values(TOOLS).length} tools`);
  return {
    tools: Object.values(TOOLS),
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: string;

    switch (name) {
      case 'get_products_by_category':
        if (!args?.category) {
          throw new Error('Category parameter is required');
        }
        result = await handleGetProductsByCategory(args?.category as string);
        break;

      case 'get_smartphones_by_price':
        if (!args?.maxPrice) {
          throw new Error('maxPrice parameter is required');
        }
        result = await handleGetSmartphonesByPrice(args?.maxPrice as number);
        break;

      case 'get_cart_items':
        result = await handleGetCartItems();
        break;

      case 'get_available_coupons':
        result = await handleGetAvailableCoupons();
        break;

      case 'get_order_history':
        result = await handleGetOrderHistory();
        break;

      case 'add_to_cart':
        if (!args?.productId) {
          throw new Error('productId parameter is required');
        }
        result = await handleAddToCart(args?.productId as string, args?.quantity as number);
        break;

      case 'remove_from_cart':
        if (!args?.productId) {
          throw new Error('productId parameter is required');
        }
        result = await handleRemoveFromCart(args?.productId as string, args?.removeAll as boolean);
        break;

      case 'apply_coupon':
        if (!args?.couponCode) {
          throw new Error('couponCode parameter is required');
        }
        result = await handleApplyCoupon(args?.couponCode as string);
        break;

      case 'remove_coupon':
        result = await handleRemoveCoupon();
        break;

      case 'place_order':
        result = await handlePlaceOrder();
        break;

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }

    return {
      content: [
        {
          type: 'text',
          text: result,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text',
          text: createResponse(false, null, `Tool execution failed: ${name}`, errorMessage),
        },
      ],
    };
  }
});

// Start the server
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Product Backend MCP server running on stdio');
  // console.error(`Server capabilities: ${JSON.stringify(server.getCapabilities())}`);
  // No public method to access capabilities, so this line is removed to avoid error.
  console.error(`Available tools: ${Object.keys(TOOLS).join(', ')}`);
}

runServer().catch((error) => {
  console.error('Failed to run server:', error);
  process.exit(1);
});
