# Wedding Contract Tool

A professional contract management application for wedding vendors that allows them to quickly create contracts with AI assistance and collect digital signatures.

## Features

### ✨ Core Functionality
- **Advanced Rich Text Editor**: Powered by Tiptap with professional formatting tools
- **AI-Powered Contract Generation**: Generate professional HTML-formatted contract language tailored to your vendor type
- **Rich Text Formatting**: Bold, italic, underline, lists, alignment, colors, and highlights
- **Integrated AI Assist**: Built-in AI assistance directly within the editor toolbar
- **Digital Signature Collection**: Accept signatures via drawing or typed name
- **Contract Management**: Create, edit, and track contract status
- **Multi-Vendor Support**: Supports photographers, caterers, and florists
- **Real-time Data Persistence**: Contracts saved to browser localStorage

### 🎨 Modern UI
- **Glass Morphism Design**: Beautiful backdrop blur effects throughout
- **Responsive Layout**: Works seamlessly on desktop and mobile
- **Smooth Animations**: Powered by Framer Motion
- **Professional Aesthetics**: Purple-blue gradient backgrounds with glossy elements

### 🔐 Authentication
- Simple login system with pre-configured test accounts
- Secure session management with NextAuth.js
- Role-based access (photographer, caterer, florist)

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key (optional - falls back to mock content)

### Installation

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
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

## Technical Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript
- **Rich Text Editor**: Tiptap with StarterKit, TextStyle, Color, TextAlign extensions
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: NextAuth.js v5
- **AI Integration**: OpenAI GPT-3.5-turbo
- **Signatures**: react-signature-canvas
- **Icons**: Lucide React

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

## Key Assumptions Made

1. **Browser Storage Sufficient**: localStorage adequate for MVP demo purposes
2. **Single Vendor Per Session**: Each login represents one vendor business
3. **Test Environment Focus**: Pre-seeded accounts eliminate signup complexity
4. **Modern Browser Support**: Assumes backdrop-filter and CSS grid support
5. **Client-Side Signatures**: Digital signatures stored as base64 strings

## Future Enhancements

If given more development time, I would add:

### Backend & Database
- **PostgreSQL Database**: Replace localStorage with proper persistence
- **Contract Templates**: Vendor-customizable templates
- **File Management**: PDF generation and export
- **Email Integration**: Send contracts to clients

### Advanced Features
- **Client Portal**: Allow clients to view and sign contracts online
- **Payment Integration**: Stripe/PayPal for deposit collection
- **Calendar Sync**: Google Calendar integration for event dates
- **Contract Analytics**: Track conversion rates and common terms

### Security & Production
- **Rate Limiting**: Protect against API abuse
- **Audit Logging**: Track all contract changes
- **Enhanced Authentication**: OAuth providers, 2FA
- **Legal Compliance**: GDPR compliance, contract enforceability

## Troubleshooting

### Common Issues

**AI Generation Not Working**
- Verify `OPENAI_API_KEY` in `.env.local`
- Check OpenAI account has sufficient credits
- App will fallback to mock content gracefully

**Signature Pad Issues**
- Ensure modern browser with canvas support
- Try refreshing if drawing doesn't respond
- Use "Type Signature" alternative if drawing fails

**Login Issues**
- Use exact test credentials (case sensitive)
- Clear browser storage if sessions conflict
- Check browser console for authentication errors

## Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

**Built with ❤️ for wedding vendors everywhere**

*Making beautiful contracts as memorable as the weddings themselves*
