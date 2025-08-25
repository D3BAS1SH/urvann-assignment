# Urvann Assignment - Plant Search Application

A full-stack web application for searching and filtering plants with a modern UI and efficient search functionality. Built with Next.js, Express, and MongoDB.

## 🌟 Features

- 🔍 Real-time search with suggestions
- 🏷️ Category-based filtering
- 💰 Price range filtering
- ⚡ Fast and responsive UI
- 📱 Mobile-friendly design
- 🎯 Advanced MongoDB aggregation
- 🔄 Server-side pagination

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5** - React framework with server-side rendering
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **ShadcnUI** - Beautiful and accessible components

### Backend
- **Express.js** - Node.js web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **TypeScript** - Type-safe backend development

### DevOps & Tools
- **Turbo** - High-performance build system
- **pnpm** - Fast, disk space efficient package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🏗️ Project Structure

```
apps/
  ├── web/              # Frontend Next.js application
  │   ├── app/          # Next.js app directory
  │   └── components/   # React components
  └── apis/             # Backend Express application
      ├── src/
      │   ├── models/   # MongoDB schemas
      │   ├── routes/   # API routes
      │   └── controllers/ # Route controllers
packages/
  ├── eslint-config/    # Shared ESLint configuration
  ├── typescript-config/ # Shared TypeScript configuration
  └── ui/               # Shared UI components
```

## 🗄️ Database Schema

### Plant Model
```typescript
interface IPlants {
    name: string;        // Plant name (unique, uppercase)
    price: number;       // Price (non-negative)
    category: ObjectId;  // Reference to Category
    images: string[];    // Array of image URLs
    availability: number; // Stock count
    instruction: string[]; // Care instructions
    benefits: string[]   // Plant benefits
}
```

### Category Model
```typescript
interface ICategory {
    category: string;    // Category name
}
```

## 🔌 API Endpoints

### Search Routes (`/api/common`)

#### GET `/search`
Search plants by name or category
- Query params:
  - `q`: Search query string
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 8)
- Returns: Plants array with pagination metadata

#### GET `/categories`
Get all plant categories
- Returns: Array of category objects

#### GET `/suggest`
Get search suggestions
- Query params:
  - `q`: Search query string
- Returns: Array of plant and category suggestions

#### GET `/filter`
Filter plants by criteria
- Query params:
  - `category`: Category ID
  - `minPrice`: Minimum price
  - `maxPrice`: Maximum price
  - `available`: Filter by availability
- Returns: Filtered plants array

## 🔍 Search Implementation

The search functionality is implemented using MongoDB's aggregation pipeline:

1. **Text Search**: Uses regex for flexible matching of plant names and categories
2. **Category Lookup**: Joins the plants with their categories using `$lookup`
3. **Pagination**: Implements skip-limit pagination
4. **Parallel Execution**: Uses Promise.all for concurrent count and data fetch

```typescript
const [plants, totalCount] = await Promise.all([
    Plant.aggregate([
        {
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
            }
        },
        {
            $unwind: '$category'
        },
        {
            $match: {
                $or: [
                    { name: { $regex: q, $options: 'i' } },
                    { 'category.category': { $regex: q, $options: 'i' } }
                ]
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limitNumber
        }
    ]),
    // Count query...
]);
```

## 🚀 Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/D3BAS1SH/urvann-assignment.git
   cd urvann-assignment
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create `.env` in `apps/apis`:
   ```env
   MONGODB_URI=your_mongodb_uri
   API_PORT=4000
   ```

   Create `.env.local` in `apps/web`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

4. **Start development servers**
   ```bash
   # Start all services
   pnpm run dev

   # Start specific service
   pnpm --filter=apis run dev  # Backend only
   pnpm --filter=web run dev   # Frontend only
   ```

## 🌍 Deployment

### Backend (Render)
- Build Command: `pnpm install`
- Start Command: `cd apps/apis && pnpm start`

### Frontend (Vercel)
- Root Directory: `apps/web`
- Build Command: `pnpm install && pnpm build`
- Install Command: `pnpm install`
- Output Directory: `.next`

## 🔧 Performance Optimizations

1. **MongoDB Indexing**
   - Text index on plant names
   - Index on availability field
   ```typescript
   plantsSchema.index({name:'text'});
   plantsSchema.index({availability: 1});
   ```

2. **Efficient Queries**
   - Parallel execution of count and data queries
   - Selective field projection
   - Pagination to limit data transfer

3. **Frontend Optimizations**
   - Client-side caching
   - Debounced search
   - Lazy loading of images
   - Component-level code splitting

## 📝 API Response Examples

### Search Response
```json
{
  "plants": [
    {
      "_id": "...",
      "name": "MONSTERA",
      "price": 299,
      "category": {
        "_id": "...",
        "category": "Indoor Plants"
      },
      "images": ["url1", "url2"],
      "availability": 5,
      "instruction": ["Keep in indirect sunlight", "Water weekly"],
      "benefits": ["Air purifying", "Low maintenance"]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 38,
    "itemsPerPage": 8
  }
}
```

## 📈 Future Improvements

1. **Search Enhancement**
   - Implement fuzzy search
   - Add search by benefits/instructions
   - Category-based search weights

2. **Performance**
   - Implement Redis caching
   - Add field-level indexing
   - GraphQL implementation

3. **Features**
   - User authentication
   - Shopping cart functionality
   - Order management
   - Admin dashboard

## 📄 License

MIT

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build
yarn dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
