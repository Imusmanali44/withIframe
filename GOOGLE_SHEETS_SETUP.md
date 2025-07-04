# Google Sheets Pricing Integration Setup Guide

This guide will help you set up the Google Sheets integration for dynamic pricing data in your application.

## Prerequisites

- Google Cloud Console account with a service account created
- Google Sheets API enabled
- Your pricing data spreadsheet created

## Setup Steps

### 1. Environment Variables

Create a `.env` file in your project root with the following variables:

```env
VITE_GOOGLE_SHEETS_API_KEY=AIzaSyCNsqYSmz0hPRjGIGcMkEWNtIKmwyXTMJ0
VITE_GOOGLE_SHEETS_ID=12GMIWRdEqbTgdOOcpemHCgjqZiTKP0B_joKiGHTnr74
```

### 2. Google Sheets Setup

Your Google Sheets document should be structured as follows:

| Column A | Column B | Column C |
|----------|----------|----------|
| Profile  | Ring1    | Ring2    |
| P1       | 459      | 362      |
| P2       | 415      | 332      |
| P3       | 438      | 347      |
| ...      | ...      | ...      |

**Important Notes:**
- The first row should contain headers (Profile, Ring1, Ring2)
- Profile names should match your existing profile IDs (P1, P2, P3, etc.)
- Prices should be numeric values only (no currency symbols)

### 3. Google Sheets Permissions

Make sure your Google Sheets document has the correct permissions:

1. **Public Access (Recommended for simplicity):**
   - Open your Google Sheets document
   - Click "Share" button
   - Under "General access", select "Anyone with the link"
   - Set permission to "Viewer"

2. **Or, if you prefer restricted access:**
   - Share the document with your service account email
   - Grant "Viewer" permissions

### 4. Google Cloud Console Setup

Since you've already created a service account, ensure the following:

1. **Enable Google Sheets API:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

2. **API Key Configuration:**
   - Go to "APIs & Services" > "Credentials"
   - Your API key should be configured with:
     - Application restrictions: None (or HTTP referrers if you want to restrict)
     - API restrictions: Google Sheets API

### 5. Test the Integration

To test if everything is working:

1. **Add the test component to your app:**
   ```jsx
   import PricingTest from './components/PricingTest';
   
   // Add this component to your main App component
   <PricingTest />
   ```

2. **Check the browser console:**
   - Open developer tools
   - Look for any error messages related to Google Sheets API
   - Successful integration will show "Pricing data loaded from Google Sheets"

### 6. Using the Pricing System

#### In React Components:

```jsx
import { usePricing } from '../hooks/usePricing';

const MyComponent = () => {
  const { 
    isLoading, 
    error, 
    pricingData, 
    refreshPricing, 
    getPricing,
    isReady 
  } = usePricing();

  if (isLoading) return <div>Loading pricing...</div>;
  if (error) return <div>Error: {error}</div>;

  const p1Pricing = getPricing('P1');
  
  return (
    <div>
      <p>P1 Ring1: €{p1Pricing.ring1}</p>
      <p>P1 Ring2: €{p1Pricing.ring2}</p>
      <button onClick={refreshPricing}>Refresh Prices</button>
    </div>
  );
};
```

#### Direct API Usage:

```javascript
import { initializePricingData, getCombinedPricing } from '../utils/pricing';

// Initialize pricing data
await initializePricingData();

// Get combined pricing with all adjustments
const totalPricing = await getCombinedPricing('P1', sizeValues);
```

## Features

### Automatic Caching
- Data is cached for 5 minutes to reduce API calls
- Fallback to localStorage if API fails
- Automatic fallback to hardcoded values if all else fails

### Error Handling
- Graceful fallback to hardcoded pricing if Google Sheets is unavailable
- Console logging for debugging
- Error states in React components

### Real-time Updates
- Manual refresh capability
- Event-driven updates when data changes
- Stale data detection

## Troubleshooting

### Common Issues:

1. **"API key not found" error:**
   - Ensure `.env` file is in the project root
   - Check that environment variables are correctly named
   - Restart your development server

2. **"Permission denied" error:**
   - Verify your Google Sheets document sharing settings
   - Check if API key has proper restrictions set

3. **"Sheet not found" error:**
   - Verify the Google Sheets ID in your URL
   - Ensure the sheet is not deleted or moved

4. **"Data parsing error":**
   - Check your sheet structure matches the expected format
   - Ensure profile names match exactly (case-sensitive)
   - Verify all price values are numeric

### Debug Steps:

1. **Check environment variables:**
   ```javascript
   console.log('API Key:', import.meta.env.VITE_GOOGLE_SHEETS_API_KEY);
   console.log('Sheet ID:', import.meta.env.VITE_GOOGLE_SHEETS_ID);
   ```

2. **Test API URL directly:**
   ```
   https://sheets.googleapis.com/v4/spreadsheets/12GMIWRdEqbTgdOOcpemHCgjqZiTKP0B_joKiGHTnr74/values/Sheet1!A:C?key=AIzaSyCNsqYSmz0hPRjGIGcMkEWNtIKmwyXTMJ0
   ```

3. **Check browser network tab:**
   - Look for failed API requests
   - Verify response data structure

## Security Considerations

- API key is exposed in client-side code (normal for public APIs)
- Consider using HTTP referrer restrictions for production
- Google Sheets document should be view-only
- Never store sensitive data in the spreadsheet

## Next Steps

After successful setup:
1. Update your existing components to use the new pricing system
2. Remove hardcoded pricing values
3. Set up automated deployment that includes the environment variables
4. Consider setting up monitoring for API usage and errors 