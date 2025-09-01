# Overview

This is an AI-powered personal finance management application called "Akıllı Bütçe Asistanı" (Smart Budget Assistant). The application helps users manage their personal finances effectively through intelligent categorization, budget tracking, goal setting, and AI-driven insights. It features multiple input methods including manual entry, OCR receipt scanning, and voice commands, all designed to provide a comprehensive financial management experience with Turkish language support.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Charts**: Recharts library for data visualization (pie charts, line charts)
- **Forms**: React Hook Form with Zod validation
- **Authentication**: Session-based authentication with Replit Auth integration

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL store (connect-pg-simple)
- **Authentication**: OpenID Connect (OIDC) with Passport.js for Replit Auth
- **API Design**: RESTful API with structured error handling and logging middleware
- **Development**: Hot module replacement with Vite in development mode

## Database Schema Design
- **Users**: Core user information with Replit Auth integration
- **Categories**: Expense/income categorization with icons and colors
- **Transactions**: Financial transactions with categorization and source tracking
- **Budgets**: Budget management with period-based tracking
- **Financial Goals**: Goal setting and progress tracking
- **AI Insights**: Generated recommendations and analysis
- **Chat Messages**: AI assistant conversation history
- **Sessions**: Authentication session storage

## AI Integration Architecture
- **Financial Health Scoring**: Client-side algorithm calculating financial wellness based on income, expenses, savings rate, budget adherence, and goal progress
- **Smart Categorization**: Planned AI-powered automatic transaction categorization
- **Insights Generation**: AI-driven financial recommendations and trend analysis
- **Conversational Assistant**: Chat interface for natural language financial queries

## Multi-Modal Input System
- **Manual Entry**: Traditional form-based transaction input
- **OCR Processing**: Receipt scanning and automatic data extraction (planned)
- **Voice Commands**: Speech-to-text transaction recording (planned)
- **AI Processing**: Intelligent transaction processing and categorization

# External Dependencies

## Core Infrastructure
- **Neon Database**: Serverless PostgreSQL database hosting
- **Replit Authentication**: OIDC-based user authentication and session management
- **WebSocket Support**: Real-time features using 'ws' library for Neon connections

## UI and Design Libraries
- **Radix UI**: Accessible component primitives for dialogs, dropdowns, form controls, and navigation
- **shadcn/ui**: Pre-built component library with consistent design system
- **Tailwind CSS**: Utility-first CSS framework with custom theming
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe component variants

## Data Visualization
- **Recharts**: React charting library for financial data visualization
- **Chart Components**: Pie charts for expense distribution, line charts for trends

## Development Tools
- **TypeScript**: Type safety across frontend and backend
- **Vite**: Fast build tool with HMR and development server
- **ESBuild**: Fast JavaScript bundler for production builds
- **Drizzle Kit**: Database schema management and migrations

## Planned Integrations
- **OCR Service**: Receipt scanning and text extraction
- **Speech Recognition**: Voice-to-text processing for transaction input
- **AI/ML Services**: Advanced financial insights and recommendations