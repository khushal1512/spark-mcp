# Spark Customer Agent MCP Server

A Model Context Protocol (MCP) server for integrating with Walmart products backend API. This server enables customers to shop using natural language through AI-powered conversations, providing tools for product discovery, cart management, coupon handling, and order history access.

## 🛍️ Natural Language Shopping Experience

This MCP server transforms the traditional shopping experience by allowing customers to interact with Walmart's product ecosystem using conversational AI. Customers can simply ask questions like "Show me smartphones under $500" or "What's in my cart?" and get instant, personalized responses.

## Features

- **🤖 AI-Powered Shopping**: Natural language interactions for seamless shopping experiences
- **🔍 Product Search**: Search products by category (smartphones, tv, shoes, healthcare, electronics, fitness)
- **💰 Price Filtering**: Filter smartphones by maximum price with conversational queries
- **🛒 Cart Management**: View current cart items through simple voice or text commands
- **🎟️ Coupons**: Access available discount coupons via natural language requests
- **📋 Order History**: Retrieve past order information through conversational interface

## 🚀 Reimagining Customer Experience with Emerging Technologies

In today's fast-paced, digital-first world, customer experience is the ultimate competitive advantage. With limitless options at their fingertips, modern shoppers expect seamless, intuitive and highly personalized interactions—whether they're browsing online, engaging via mobile or stepping into a physical store.

### 🔮 The Future of Retail Technology

This MCP server represents the convergence of several emerging technologies:

- **🧠 AI-Powered Shopping Assistants**: Conversational commerce that understands customer intent and provides personalized recommendations
- **📊 Data-Driven Insights**: Real-time analysis of shopping patterns to enhance customer engagement
- **🎯 Hyper-Personalized Experiences**: Every interaction feels effortless, engaging and deeply relevant
- **⚡ Real-Time Commerce**: Instant responses to customer queries about products, pricing, and availability
- **🔄 Predictive Shopping**: Anticipating customer needs through advanced analytics

Retailers that harness AI, data-driven insights and immersive technologies are redefining customer engagement. From hyper-personalized recommendations and predictive shopping experiences to dynamic pricing models and real-time conversational commerce, emerging technologies are creating deeper, more meaningful relationships between brands and consumers.

This project embodies Walmart's vision of leveraging emerging technologies to transform the way customers shop, offering ultra-personalized experiences that make every interaction feel effortless, engaging and deeply relevant. By combining the power of AI assistants with natural language processing, we're reimagining the future of retail to enhance customer experience, boost engagement and redefine convenience in shopping.

## Available Tools

### 🛠️ Conversational Shopping Tools

**Product Discovery:**
- `get_products_by_category`: Fetch products from a specific category using natural language
- `get_smartphones_by_price`: Filter smartphones by maximum price through conversational queries

**Cart Management:**
- `get_cart_items`: View shopping cart contents with simple voice or text commands
- `add_to_cart`: Add products to cart with specified quantities
- `remove_from_cart`: Remove products from cart (single item or all quantities)

**Coupon & Discounts:**
- `get_available_coupons`: Get available discount codes via natural language requests
- `apply_coupon`: Apply discount coupons to cart for savings
- `remove_coupon`: Remove applied coupons from cart

**Order Management:**
- `get_order_history`: Access order transaction history through conversational interface
- `place_order`: Complete purchase with current cart items

### 💬 Example Natural Language Interactions

**Product Discovery:**
- *"Show me all smartphones under $300"* → Uses `get_smartphones_by_price`
- *"What electronics do you have?"* → Uses `get_products_by_category`

**Cart Management:**
- *"What's in my shopping cart?"* → Uses `get_cart_items`
- *"Add iPhone 15 to my cart"* → Uses `add_to_cart`
- *"Remove the Nike shoes from my cart"* → Uses `remove_from_cart`

**Coupons & Discounts:**
- *"Do I have any coupons available?"* → Uses `get_available_coupons`
- *"Apply coupon SAVE20 to my cart"* → Uses `apply_coupon`
- *"Remove the coupon from my cart"* → Uses `remove_coupon`

**Order Management:**
- *"Show me my recent orders"* → Uses `get_order_history`
- *"Place my order now"* → Uses `place_order`

## Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- Backend API running on `http://localhost:3000`

## Installation

1. Clone the repository:
```bash
git clone https://github.com/khushal1512/spark-mcp.git
cd spark-mcp
```

2. Install dependencies:
```bash
pnpm install
```

3. Build the project:
```bash
pnpm build
```

## Development

Run in development mode with hot reload:
```bash
pnpm dev
```

Watch mode for continuous development:
```bash
pnpm watch
```

## Production

Build and start the server:
```bash
pnpm build
pnpm start
```

## Cursor Integration

To use this MCP server with Cursor, add the following configuration to your Cursor settings:

```json
{
  "mcpServers": {
    "spark-customer-agent": {
      "command": "node",
      "args": ["path/to/spark-mcp/dist/index.js"]
    }
  }
}
```

## Backend API Endpoints

The server expects the following endpoints to be available:

**Product Discovery:**
- `GET /products/{category}` - Get products by category
- `GET /products/smartphones/{maxPrice}` - Get smartphones under max price

**Cart Management:**
- `GET /cart` - Get cart items
- `POST /cart/add` - Add product to cart
- `DELETE /cart/remove` - Remove product from cart

**Coupon Management:**
- `GET /coupons` - Get available coupons
- `POST /cart/apply-coupon` - Apply coupon to cart
- `DELETE /cart/remove-coupon` - Remove coupon from cart

**Order Management:**
- `GET /orders` - Get order history
- `POST /orders/place` - Place new order

## Project Structure

```
spark-mcp/
├── src/
│   └── index.ts          # Main MCP server implementation
├── dist/                 # Compiled JavaScript output
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## Configuration

- **Backend URL**: Configure `BACKEND_BASE_URL` in `src/index.ts`
- **Categories**: Modify `ALLOWED_CATEGORIES` array for different product categories

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Build and test: `pnpm build`
5. Commit your changes: `git commit -am 'Add some feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

ISC

## Author

Khushal Agrawal
