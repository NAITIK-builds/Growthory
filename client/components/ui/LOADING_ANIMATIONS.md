# Loading Animations - Growthory

## Overview
Custom smooth loading animations designed specifically for the Growthory ecosystem. These animations provide premium, professional loading states that match the brand's aesthetic.

## Components

### 1. **LoadingSpinner** (Default/Orbital)
The main loading component featuring an orbital animation with rotating dots around a center point.

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `variant`: 'primary' | 'light' | 'dark' (default: 'primary')
- `fullScreen`: boolean (default: false)
- `message`: string (optional)

**Usage:**
```tsx
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Basic usage
<LoadingSpinner />

// With custom size and message
<LoadingSpinner size="lg" message="Syncing ecosystem nodes..." />

// Full screen overlay
<LoadingSpinner fullScreen size="xl" message="Processing..." />
```

### 2. **PulseLoader**
Three bouncing dots animation, perfect for inline loading states.

**Props:**
- `size`: 'sm' | 'md' | 'lg' (default: 'md')

**Usage:**
```tsx
import { PulseLoader } from '@/components/ui/LoadingSpinner';

<PulseLoader size="md" />
```

### 3. **RingLoader**
Classic spinning ring animation with gradient effect.

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')

**Usage:**
```tsx
import { RingLoader } from '@/components/ui/LoadingSpinner';

<RingLoader size="lg" />
```

### 4. **EcosystemLoader**
Themed loader representing connected nodes in the Growthory ecosystem.

**Props:**
- `size`: 'sm' | 'md' | 'lg' (default: 'md')

**Usage:**
```tsx
import { EcosystemLoader } from '@/components/ui/LoadingSpinner';

<EcosystemLoader size="md" />
```

## Button Integration

The `Button` component now supports a `loading` prop that automatically displays a pulse loader.

**Usage:**
```tsx
import Button from '@/components/ui/Button';

const [loading, setLoading] = useState(false);

<Button 
  onClick={handleSubmit}
  loading={loading}
>
  Save Changes
</Button>
```

When `loading={true}`, the button will:
- Display a PulseLoader animation
- Show "Loading..." text
- Automatically disable itself
- Maintain its variant styling

## Animations

### Custom Keyframes
All animations are defined in `globals.css`:

1. **spin-slow**: 3-second smooth rotation
2. **fade-in**: Smooth opacity transition
3. **scale-pulse**: Breathing effect with scale and opacity

### CSS Classes
- `.animate-spin-slow`: Slow 360° rotation
- `.animate-fade-in`: Fade in effect
- `.animate-scale-pulse`: Pulsing scale animation

## Examples

### Page Loading State
```tsx
export default function MyPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading data..." />;
  }

  return <div>Your content</div>;
}
```

### Form Submission
```tsx
const handleSubmit = async () => {
  setLoading(true);
  try {
    await submitForm();
    toast.success('Saved!');
  } catch (error) {
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};

<Button loading={loading} onClick={handleSubmit}>
  Submit
</Button>
```

### Inline Loading
```tsx
{isProcessing ? (
  <PulseLoader size="sm" />
) : (
  <span>Ready</span>
)}
```

## Demo Page
Visit `/loading-demo` to see all loading animations in action with interactive examples.

## Design Philosophy
- **Smooth**: All animations use easing functions for natural motion
- **Branded**: Colors match Growthory's olive green palette (#3d522b, #606c38)
- **Accessible**: Loading states are clearly visible and don't cause motion sickness
- **Performant**: CSS-based animations for optimal performance
- **Consistent**: Unified design language across all loading states

## Best Practices

1. **Choose the right loader:**
   - Use `LoadingSpinner` for page-level loading
   - Use `PulseLoader` for inline/button loading
   - Use `EcosystemLoader` for brand-specific contexts
   - Use `RingLoader` for simple, minimal loading states

2. **Size appropriately:**
   - 'sm' for inline text or small buttons
   - 'md' for standard buttons and cards
   - 'lg' for prominent sections
   - 'xl' for full-screen overlays

3. **Provide context:**
   - Add messages for long operations
   - Keep messages concise and action-oriented
   - Use present tense ("Syncing..." not "Sync...")

4. **Maintain accessibility:**
   - Always disable interactive elements when loading
   - Provide visual feedback immediately on user action
   - Don't rely solely on loading animations for feedback

## Color Variants

### Primary (default)
Uses Growthory's brand olive green (#3d522b)

### Light
White loaders for dark backgrounds

### Dark
Dark loaders for light backgrounds

## Performance Notes
- All animations are CSS-based (no JavaScript animation loops)
- Uses `transform` and `opacity` for GPU acceleration
- Minimal DOM elements for fast rendering
- No external dependencies
