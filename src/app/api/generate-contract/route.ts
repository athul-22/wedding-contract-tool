import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { vendorType, clientName, eventDate, eventVenue, servicePackage, amount } = await request.json()

    if (!vendorType || !clientName || !eventDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const prompt = `Generate a professional wedding service contract for a ${vendorType}. 

Contract details:
- Client: ${clientName}
- Event Date: ${eventDate}
- Venue: ${eventVenue}
- Service Package: ${servicePackage}
- Amount: $${amount}

Please create a comprehensive contract that includes:
1. Service details specific to ${vendorType} services
2. Payment terms and schedule
3. Cancellation policy
4. Liability clauses
5. Terms and conditions
6. Signature lines

The contract should be professional, legally sound, and tailored for wedding ${vendorType} services. Include specific clauses relevant to ${vendorType} work (e.g., photo/video rights for photographers, menu details for caterers, flower care for florists).

Format it as HTML with proper headings (h1, h2, h3), paragraphs, lists, and styling. Use inline CSS with colors like #8b5cf6 for headings and professional formatting. Make it visually appealing and easy to read.`

    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a legal document expert specializing in wedding vendor contracts. Generate professional, comprehensive contracts that are legally appropriate and industry-specific.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
      stream: true
    })

    const encoder = new TextEncoder()
    
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        } catch (error) {
          controller.error(error)
        } finally {
          controller.close()
        }
      }
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })

  } catch (error) {
    console.error('OpenAI API error:', error)
    
    // Fallback to mock content with streaming simulation
    const { vendorType, clientName, eventDate, eventVenue, servicePackage, amount } = await request.json()
    
    const mockContent = generateMockContract(vendorType, clientName, eventDate, eventVenue, servicePackage, amount)
    
    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        // Simulate streaming by sending content in chunks
        const chunks = mockContent.match(/.{1,100}/g) || [mockContent]
        
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`))
          // Small delay to simulate real streaming
          await new Promise(resolve => setTimeout(resolve, 50))
        }
        
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      }
    })
    
    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })
  }
}

function generateMockContract(vendorType: string, clientName: string, eventDate: string, eventVenue: string, servicePackage: string, amount: string) {
  const specificTerms = getSpecificTerms(vendorType)
  const serviceDetails = getServiceDetails(vendorType)
  
  return `<div class="contract-content">
    <h1 style="text-align: center; color: #8b5cf6; font-size: 24px; font-weight: bold; margin-bottom: 20px;">
      WEDDING ${vendorType.toUpperCase()} SERVICE AGREEMENT
    </h1>
    
    <p style="margin-bottom: 16px;">
      This Professional Service Agreement ("<strong>Agreement</strong>") is made between the Service Provider and 
      <strong>${clientName}</strong> ("<strong>Client</strong>") for ${vendorType} services.
    </p>
    
    <h2 style="color: #6366f1; font-size: 18px; font-weight: bold; margin: 24px 0 12px 0;">
      EVENT DETAILS:
    </h2>
    <ul style="margin-bottom: 20px;">
      <li><strong>Event Date:</strong> ${eventDate}</li>
      <li><strong>Venue:</strong> ${eventVenue}</li>
      <li><strong>Service Package:</strong> ${servicePackage}</li>
      <li><strong>Total Contract Amount:</strong> <span style="color: #22c55e; font-weight: bold;">$${amount}</span></li>
    </ul>
    
    <h2 style="color: #6366f1; font-size: 18px; font-weight: bold; margin: 24px 0 12px 0;">
      TERMS AND CONDITIONS:
    </h2>
    
    <h3 style="color: #8b5cf6; font-size: 16px; font-weight: bold; margin: 16px 0 8px 0;">
      1. SERVICES PROVIDED
    </h3>
    <p style="margin-bottom: 16px;">
      The Service Provider agrees to provide professional ${vendorType} services as outlined in the selected package. 
      Services include <em>${serviceDetails}</em>.
    </p>
    
    <h3 style="color: #8b5cf6; font-size: 16px; font-weight: bold; margin: 16px 0 8px 0;">
      2. PAYMENT TERMS
    </h3>
    <ul style="margin-bottom: 16px;">
      <li>A non-refundable deposit of 50% (<strong>$${(parseFloat(amount) * 0.5) || 0}</strong>) is due upon signing this contract</li>
      <li>Remaining balance of <strong>$${(parseFloat(amount) * 0.5) || 0}</strong> is due 30 days prior to the event date</li>
      <li>Late payments may result in service cancellation</li>
    </ul>
    
    <h3 style="color: #8b5cf6; font-size: 16px; font-weight: bold; margin: 16px 0 8px 0;">
      3. CANCELLATION POLICY
    </h3>
    <ul style="margin-bottom: 16px;">
      <li>Cancellations 120+ days before event: 25% of total fee retained</li>
      <li>Cancellations 90-119 days before event: 50% of total fee retained</li>
      <li>Cancellations 60-89 days before event: 75% of total fee retained</li>
      <li>Cancellations less than 60 days before event: 100% of total fee retained</li>
    </ul>
    
    <h3 style="color: #8b5cf6; font-size: 16px; font-weight: bold; margin: 16px 0 8px 0;">
      4. ${specificTerms.split('\n')[0]}
    </h3>
    <ul style="margin-bottom: 16px;">
      ${specificTerms.split('\n').slice(1).map(line => 
        line.startsWith('-') ? `<li>${line.substring(1).trim()}</li>` : ''
      ).join('')}
    </ul>
    
    <h3 style="color: #8b5cf6; font-size: 16px; font-weight: bold; margin: 16px 0 8px 0;">
      5. FORCE MAJEURE
    </h3>
    <p style="margin-bottom: 16px;">
      Neither party shall be liable for delays or failures due to circumstances beyond reasonable control, 
      including but not limited to acts of God, government regulations, or venue restrictions.
    </p>
    
    <h3 style="color: #8b5cf6; font-size: 16px; font-weight: bold; margin: 16px 0 8px 0;">
      6. LIABILITY
    </h3>
    <p style="margin-bottom: 16px;">
      Service Provider's liability is limited to the total contract amount. Client acknowledges that 
      ${vendorType} services carry inherent risks and agrees to hold Service Provider harmless.
    </p>
    
    <h3 style="color: #8b5cf6; font-size: 16px; font-weight: bold; margin: 16px 0 8px 0;">
      7. GOVERNING LAW
    </h3>
    <p style="margin-bottom: 24px;">
      This agreement shall be governed by local state laws and any disputes will be resolved through binding arbitration.
    </p>
    
    <div style="border-top: 2px solid #8b5cf6; padding-top: 16px; margin-top: 24px;">
      <p style="margin-bottom: 16px; font-style: italic;">
        By signing below, both parties agree to all terms and conditions outlined in this contract.
      </p>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 24px 0;">
        <div>
          <p><strong>SERVICE PROVIDER:</strong></p>
          <p style="border-bottom: 1px solid #666; padding-bottom: 4px; margin: 8px 0;">_________________________</p>
          <p><strong>DATE:</strong> ___________</p>
        </div>
        <div>
          <p><strong>CLIENT:</strong> ${clientName}</p>
          <p style="border-bottom: 1px solid #666; padding-bottom: 4px; margin: 8px 0;">_________________________</p>
          <p><strong>DATE:</strong> ___________</p>
        </div>
      </div>
      
      <p style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 24px;">
        Contract Generated: ${new Date().toLocaleDateString()}
      </p>
    </div>
  </div>`
}

function getServiceDetails(vendorType: string): string {
  switch (vendorType.toLowerCase()) {
    case 'photographer':
      return 'professional photography coverage, image editing, digital gallery delivery, and print rights as specified in package details'
    case 'caterer':
      return 'menu planning, food preparation, service staff, setup/cleanup, and all catering equipment as specified in package details'
    case 'florist':
      return 'floral design consultation, fresh flower arrangements, delivery, setup, and care instructions as specified in package details'
    default:
      return 'professional wedding services as detailed in the selected package'
  }
}

function getSpecificTerms(vendorType: string): string {
  switch (vendorType.toLowerCase()) {
    case 'photographer':
      return `PHOTOGRAPHY RIGHTS AND DELIVERY
- All images remain property of the Service Provider until full payment
- Client receives full resolution digital images within 4-6 weeks of event
- Service Provider retains rights to use images for portfolio and marketing
- Additional prints and products available at current pricing`
    case 'caterer':
      return `CATERING SPECIFICATIONS  
- Final guest count must be confirmed 7 days prior to event
- Menu changes after contract signing may incur additional charges
- Client responsible for providing adequate kitchen facilities and electrical access
- Food allergies and dietary restrictions must be disclosed 14 days prior`
    case 'florist':
      return `FLORAL SERVICE SPECIFICATIONS
- Fresh flowers are subject to seasonal availability; substitutions may be necessary
- Setup will occur 2-4 hours prior to ceremony start time
- Client responsible for removal of personal flowers after event
- Flowers are living products and natural variations in color/size are expected`
    default:
      return `SERVICE SPECIFICATIONS
- Specific service details and requirements as outlined in the selected package
- Any changes to services must be agreed upon in writing
- Client responsible for providing necessary access and accommodations`
  }
}