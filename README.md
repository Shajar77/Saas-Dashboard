# Flux

Flux is a professional, high-fidelity asset management platform built with Next.js 15, Tailwind CSS, and Framer Motion. This system provides a centralized interface for tracking organizational hardware and software assets with a premium, high-performance UI.

---

## Features

*   **Dynamic Metrics**: Real-time visualization of license utilization, inventory count, and cloud infrastructure spend.
*   **Asset Management**: Full CRUD (Create, Read, Update, Delete) functionality for managing hardware and software assets.
*   **Advanced Filtering**: Instant search and category filtering to manage large inventories.
*   **Fully Responsive**: Optimized for desktop, tablet, and mobile devices with a custom sidebar/top-nav navigation system.
*   **Dark Mode First**: Professional dark-themed aesthetic with Glassmorphism effects, powered by `next-themes`.
*   **Interactive Charts**: Beautiful data visualizations using `recharts` for asset valuation and spend tracking.

---

## Tech Stack

*   **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Icons**: [Lucide React](https://lucide.dev/) & [Tabler Icons](https://tabler-icons.io/)
*   **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Optimized & Lean)
*   **Charts**: [Recharts](https://recharts.org/)
*   **State Management**: React Hooks (useState, useMemo, useEffect)

---

## Project Structure

```text
├── app/                # Next.js App Router (Routes & Pages)
├── components/         # Professional UI components (UI & Custom)
├── hooks/              # Custom React hooks (use-mobile, etc.)
├── lib/                # Shared utilities & configurations
├── public/             # Static assets, logos, and icons
└── utils/              # API mock logic & data helpers
```

---

## Getting Started

### Prerequisites

*   Node.js 18.x or higher
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/saas-asset-dashboard.git
    cd saas-asset-dashboard
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open the app**
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Internal use asset management dashboard.*
