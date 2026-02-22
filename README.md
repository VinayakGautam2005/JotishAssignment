# Jotish Admin Dashboard

An enterprise-grade administration and analytics dashboard built for tracking employee data, visualizing global staff distribution, and performing identity verification. It features a premium, high-contrast design perfectly matching the Jotish brand identity (Signature Yellow and Black).

## 🚀 Overview & Core Functionalities

This application serves as an internal portal with the following key modules:

1. **Authentication (Login Module)**
   - Secure login portal for authorized personnel.
   - Built with robust form validation using `react-hook-form` and `zod`.
   - *Test Credentials:* `testuser` / `Test123`

2. **Main Dashboard**
   - High-level overview displaying total staff and global city counts.
   - Grid display of employee profiles detailing their roles, locations, joining dates, and salaries.
   - Premium "Action Cards" (View Graph & View Map) providing quick navigation to deep-dive analytics.

3. **Geographic Distribution (Geo Map)**
   - Interactive global map powered by `react-leaflet` and `OpenStreetMap`.
   - Visualizes the presence of employees across major cities (e.g., London, Tokyo, San Francisco).
   - Features custom branded popups and a sleek metrics sidebar for statistical breakdowns.

4. **Analytics & Reports (Graphs)**
   - Dynamic and responsive charts powered by `recharts`.
   - Currently visualizes **Salary Distribution** across different compensation tiers, styled flawlessly with the brand's primary colors.

5. **Employee Details & Identity Verification**
   - Comprehensive individual profile views highlighting performance metrics (e.g., Attendance Rate, Projects Completed).
   - **Camera Integration**: Built-in webcam functionality via `react-webcam` allowing administrators to capture, review, and securely upload employee photos directly from the browser for identity verification.

---

## 🛠️ Technology Stack & Modules Used

### Frontend Architecture
- **Core Framework**: [React 18](https://react.dev/) built with [Vite](https://vitejs.dev/) for blazing fast Hot Module Replacement (HMR) and optimized production builds.
- **Routing**: [Wouter](https://github.com/molefrog/wouter) - A minimalist, hook-based routing solution.
- **Styling UI**: 
  - [Tailwind CSS v3](https://tailwindcss.com/) combined with `tailwindcss-animate` for dynamic, utility-first styling. 
  - Global CSS variables (`index.css`) strictly define the Jotish brand theme (Yellow/Black).
- **Component Library**: 
  - [Radix UI](https://www.radix-ui.com/) provides unstyled, accessible UI primitives (Dialogs, Tabs, Toasts, Avatars).
  - [Lucide React](https://lucide.dev/) for crisp, scalable, and customizable iconography.
- **Data Visualization & Mapping**: 
  - `react-leaflet` & `leaflet.js`: Renders the customized interactive map layers.
  - `recharts`: Powers the SVG-based analytical data graphs.
- **Hardware Integration**: 
  - `react-webcam`: Seamlessly handles browser-based camera access and image capturing.

### Backend Architecture
- **Server Environment**: [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/) backend handling API routes and serving the built frontend.
- **Data Fetching API**: The backend dynamically fetches live tabular data from an external PHP service (`https://backend.jotish.in/backend_dev/gettabledata.php`).
- **Data Validation**: [Zod](https://zod.dev/) ensures strict TypeScript-first schema declaration and validation of incoming API requests and form submissions.
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/) combined with `connect-pg-simple` and `pg`, configured to handle future structured PostgreSQL data storage seamlessly.

---

## ⚙️ How It Works (Data Flow)

1. **Client Request**: The React frontend requests data (e.g., the employee list) from the local API endpoints (e.g., `/api/employees`).
2. **Server Processing (`server/routes.ts`)**: The Express server intercepts the request and acts as a secure proxy, fetching data from the external Jotish PHP backend.
3. **Data Transformation**: The incoming raw array data is parsed and mapped into structured, type-safe objects (Name, Role, City, Salary).
4. **UI Render**: React consumes this structured data globally via custom hooks (e.g., `useEmployees` powered by `@tanstack/react-query`).
   - *Dashboard*: Iterates over the data to render individual employee cards.
   - *Map Module*: Aggregates the `city` field to count staff per location and places specific geographic markers.
   - *Graph Module*: Categorizes the numerical `salary` field into displayable frequency ranges.

---

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm, yarn, or pnpm

### Installation
1. Clone the repository to your local machine.
2. Install the necessary dependencies:
   ```bash
   npm install
   ```

### Running the Application (Development)
To start the development server, which simultaneously spins up both the Vite frontend and the Express REST API:
```bash
npm run dev
```
The application will be accessible at **`http://localhost:5001`**.

### Building for Production
To compile the TypeScript code and bundle the Vite frontend for production deployment:
```bash
npm run build
```
To start the production server:
```bash
npm run start
```
