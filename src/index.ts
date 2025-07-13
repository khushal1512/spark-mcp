import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';

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

// Available product categories from your backend
const ALLOWED_CATEGORIES = [
  'smartphones',
  'tv',
  'shoes',
  'healthcare',
  'electronics',
  'fitness'
];

// Tool definitions
const TOOLS = {
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
};

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
