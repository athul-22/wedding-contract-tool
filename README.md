# Wedding Contract Tool

A modern web application designed for wedding vendors to streamline contract creation, management, and digital signature collection. Built with Next.js and enhanced with AI-powered contract generation capabilities.

## Setup Instructions

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager
- OpenAI API key (optional - application includes fallback functionality)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/athul-22/wedding-contract-tool/
   cd wedding-contract-tool
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment configuration:
   ```bash
   cp .env.example .env.local
   ```
   
4. Configure environment variables in `.env.local`:
   ```
   OPENAI_API_KEY=your-openai-api-key-here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key-here
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Access the application at `http://localhost:3000`

## Key Features

1. **AI-Powered Contract Generation**
   - Automated contract content creation using OpenAI GPT models
   - Vendor-specific contract templates (photographer, caterer, florist)
   - Intelligent content generation based on event details

2. **Advanced Rich Text Editor**
   - Professional document editing with Tiptap editor
   - Comprehensive formatting tools including text styling, alignment, and lists
   - Real-time content editing and preview

3. **Digital Signature Collection**
   - Canvas-based signature drawing functionality
   - Typed signature option with custom fonts
   - Secure signature storage and validation

4. **Contract Management System**
   - Create, edit, and track contract statuses
   - Draft and signed contract workflows
   - Persistent contract storage per vendor account

5. **Multi-Vendor Authentication**
   - Secure authentication system with NextAuth.js
   - Role-based access control for different vendor types
   - Session management and user account isolation

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key (optional - falls back to mock content)

### Installation

1. **Clone and Setup**
   ```bash
   git clone https://github.com/athul-22/wedding-contract-tool/
   cd wedding-contract-tool
   npm install
   ```

2. **Environment Configuration**
   ```bash
   # Edit .env.local and add your OpenAI API key
   OPENAI_API_KEY=your-openai-api-key-here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key-here
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Test Credentials

Use these accounts to explore the application:

| Vendor Type | Email | Password | Vendor Name |
|-------------|--------|----------|-------------|
| Photographer | `photographer@test.com` | `password123` | Sarah Johnson |
| Caterer | `caterer@test.com` | `password123` | Mike Chen |
| Florist | `florist@test.com` | `password123` | Emily Rose |

## Usage Guide

### Creating a Contract
1. **Login** with one of the test accounts
2. **Click "New Contract"** to open the creation modal
3. **Fill in Event Details**:
   - Client name
   - Event date
   - Venue
   - Service package
   - Amount
4. **Generate Content**:
   - Click "AI Assist" for professional contract language
   - Or manually write/edit content
5. **Save Contract** as draft

### Editing Contracts
- Click the edit icon (pencil) on any contract
- Modify details and content as needed
- Save changes

### Digital Signatures
- Click the check mark on draft contracts
- Choose signature method:
  - **Draw**: Use mouse/touch to draw signature
  - **Type**: Enter full name in signature font
- Sign to finalize contract

## Libraries and Dependencies

### Core Technologies
- **Next.js 15.5.2** - React framework for production applications
- **React 19.1.0** - JavaScript library for building user interfaces
- **TypeScript 5** - Typed superset of JavaScript
- **Tailwind CSS 3.4.17** - Utility-first CSS framework

### Rich Text Editor
- **@tiptap/react 3.4.2** - Headless rich text editor framework
- **@tiptap/starter-kit 3.4.2** - Basic editor functionality bundle
- **@tiptap/extension-text-style 3.4.2** - Text styling capabilities
- **@tiptap/extension-color 3.4.2** - Text color formatting
- **@tiptap/extension-text-align 3.4.2** - Text alignment controls
- **@tiptap/extension-underline 3.4.2** - Underline text formatting
- **@tiptap/extension-highlight 3.4.2** - Text highlighting
- **@tiptap/extension-list-item 3.4.2** - List formatting
- **@tiptap/extension-subscript 3.4.2** - Subscript text formatting
- **@tiptap/extension-superscript 3.4.2** - Superscript text formatting

### Authentication & Security
- **next-auth 4.24.11** - Authentication library for Next.js
- **bcryptjs 3.0.2** - Password hashing library
- **jose 6.1.0** - JavaScript Object Signing and Encryption

### UI and Animation
- **framer-motion 12.23.12** - Motion library for React animations
- **lucide-react 0.543.0** - Beautiful and consistent icon library
- **@hugeicons/react 1.1.1** - Comprehensive icon set

### AI Integration
- **openai 5.20.0** - Official OpenAI API client for JavaScript

### Digital Signatures
- **react-signature-canvas 1.1.0-alpha.2** - React component for signature capture

### Development Tools
- **@types/node** - TypeScript definitions for Node.js
- **@types/react** - TypeScript definitions for React
- **@types/react-dom** - TypeScript definitions for React DOM
- **@types/bcryptjs** - TypeScript definitions for bcryptjs
- **eslint 9** - JavaScript and TypeScript linter
- **eslint-config-next 15.5.2** - ESLint configuration for Next.js
- **autoprefixer 10.4.21** - PostCSS plugin for vendor prefixes
- **postcss 8.5.6** - CSS transformation tool

### Project Structure
```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth configuration
│   │   └── generate-contract/     # OpenAI contract generation
│   ├── login/                     # Login page
│   ├── globals.css               # Global styles with glass effects
│   ├── layout.tsx                # Root layout with session provider
│   └── page.tsx                  # Main application interface
├── components/
│   ├── SessionProvider.tsx       # NextAuth session wrapper
│   └── ContractEditor.tsx        # Tiptap rich text editor component
└── types/
    └── index.ts                  # TypeScript interfaces
```

### Key Design Decisions

**Single-Page Application**: Chose SPA approach for better user experience and simplified navigation

**localStorage for Persistence**: Simple solution for the MVP - contracts persist per browser/vendor

**Tiptap Rich Text Editor**: Professional WYSIWYG editor with comprehensive formatting tools and integrated AI assistance directly in the toolbar

**HTML Contract Generation**: AI generates properly formatted HTML contracts with inline CSS styling for professional presentation

**OpenAI with Fallback**: Real AI generation when API key provided, graceful fallback to mock content

**Glass Morphism UI**: Modern aesthetic that stands out from typical business applications

**NextAuth.js**: Robust authentication with simple credential provider for test accounts

## API Integration

### OpenAI Contract Generation
The app integrates with OpenAI's API to generate professional contract content:

```typescript
// Example API call structure
POST /api/generate-contract
{
  "vendorType": "photographer",
  "clientName": "John & Jane Smith",
  "eventDate": "2024-06-15",
  "eventVenue": "Garden Vista",
  "servicePackage": "Full Day Coverage",
  "amount": "3500"
}
```

**Fallback Strategy**: If OpenAI fails or no API key provided, generates comprehensive mock contracts with vendor-specific terms.

