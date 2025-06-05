# Global Styles System

This directory contains the global styling system for the UpTogether app, featuring a cosmic dark theme with modern design principles.

## Files Overview

- `globalStyles.ts` - Core style system with constants, typography, spacing, and common component styles
- `theme.ts` - NativeWind/Tailwind utility classes and pre-defined class combinations
- `README.md` - This documentation file

## Using Global Styles

### 1. Import the styles

```typescript
import { globalStyles, COLORS, GRADIENTS, TYPOGRAPHY, SPACING } from '../styles/globalStyles';
import { themeClasses, cn } from '../styles/theme';
```

### 2. Use predefined styles

```typescript
// Container
<View style={globalStyles.container}>

// Text styles
<Text style={globalStyles.title}>Main Title</Text>
<Text style={globalStyles.subtitle}>Subtitle</Text>
<Text style={globalStyles.bodyText}>Body text</Text>

// Cards
<View style={globalStyles.card}>
<View style={globalStyles.cardGlass}>
<View style={globalStyles.cardElevated}>

// Layout
<View style={globalStyles.row}>
<View style={globalStyles.rowBetween}>
<View style={globalStyles.center}>
```

### 3. Combine styles using spread operator

```typescript
// Combining multiple global styles
<Text style={{ 
  ...globalStyles.title, 
  ...globalStyles.mb_lg, 
  fontSize: 28 
}}>

// Using color constants
<Text style={{ 
  ...globalStyles.bodyText, 
  color: COLORS.text.secondary 
}}>
```

### 4. Use spacing utilities

```typescript
// Margin utilities
<View style={globalStyles.mb_lg}>     // margin bottom large
<View style={globalStyles.mt_md}>     // margin top medium
<View style={globalStyles.mx_sm}>     // margin horizontal small
<View style={globalStyles.my_lg}>     // margin vertical large

// Padding utilities
<View style={globalStyles.p_md}>      // padding medium
<View style={globalStyles.px_lg}>     // padding horizontal large
<View style={globalStyles.py_sm}>     // padding vertical small
```

### 5. Use with NativeWind/Tailwind (theme.ts)

```typescript
// Using predefined class combinations
<View className={themeClasses.container}>
<Text className={themeClasses.title}>
<View className={themeClasses.card}>

// Combining classes
<View className={cn(themeClasses.row, themeClasses.center)}>
```

## Color System

### Primary Colors
- `COLORS.primary[50-900]` - Slate colors for backgrounds and containers
- `COLORS.purple[500-800]` - Purple accents
- `COLORS.violet[500-800]` - Violet primary colors
- `COLORS.cyan[500-700]` - Cyan secondary colors

### Text Colors
- `COLORS.text.primary` - Primary white text
- `COLORS.text.secondary` - Secondary light text
- `COLORS.text.muted` - Muted gray text
- `COLORS.text.disabled` - Disabled state text

### Background Colors
- `COLORS.background.primary` - Main dark background
- `COLORS.background.secondary` - Card backgrounds
- `COLORS.background.glass` - Glass morphism effect

## Gradients

Use with LinearGradient component:

```typescript
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
  colors={GRADIENTS.cosmic as any}
  style={globalStyles.headerGradient}
>
```

Available gradients:
- `GRADIENTS.cosmic` - Main cosmic gradient
- `GRADIENTS.cosmicReverse` - Reverse cosmic gradient
- `GRADIENTS.purple` - Purple gradient
- `GRADIENTS.cyber` - Cyan to violet gradient
- `GRADIENTS.card` - Card gradient overlay

## Typography

### Font Sizes
- `TYPOGRAPHY.xs` to `TYPOGRAPHY['4xl']`

### Font Weights
- `TYPOGRAPHY.normal`
- `TYPOGRAPHY.medium`
- `TYPOGRAPHY.semibold`
- `TYPOGRAPHY.bold`

### Predefined Text Styles
- `TYPOGRAPHY.heading` - For main headings with shadow
- `TYPOGRAPHY.subheading` - For subheadings
- `TYPOGRAPHY.body` - For body text
- `TYPOGRAPHY.caption` - For captions and small text

## Shadows

```typescript
// Apply different shadow levels
<View style={globalStyles.card}>         // Has shadow.md
<View style={SHADOWS.glow}>              // Purple glow effect
<View style={SHADOWS.cosmic}>            // Cosmic shadow effect
```

## Common Patterns

### Screen Container
```typescript
<View style={globalStyles.container}>
  <SafeAreaView style={globalStyles.safeArea}>
    <ScrollView style={globalStyles.content}>
      {/* Content */}
    </ScrollView>
  </SafeAreaView>
</View>
```

### Form Container
```typescript
<Card variant="glass" style={globalStyles.my_lg}>
  <Text style={globalStyles.inputLabel}>Label</Text>
  <TextInput 
    style={globalStyles.input}
    placeholderTextColor={COLORS.text.disabled}
  />
</Card>
```

### Button Container
```typescript
<View style={globalStyles.buttonContainer}>
  <Button title="Primary Action" variant="primary" />
  <View style={globalStyles.divider}>
    <View style={globalStyles.dividerLine} />
    <Text style={globalStyles.dividerText}>or</Text>
    <View style={globalStyles.dividerLine} />
  </View>
  <Button title="Secondary Action" variant="secondary" />
</View>
```

## Migration Guide

### Replacing StyleSheet.create

Before:
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

<View style={styles.container}>
<Text style={styles.title}>
```

After:
```typescript
import { globalStyles } from '../styles/globalStyles';

<View style={globalStyles.container}>
<Text style={globalStyles.title}>
```

### Benefits of Global Styles

1. **Consistency** - All components use the same design tokens
2. **Maintainability** - Change colors/spacing in one place
3. **Performance** - Reuse pre-created style objects
4. **Dark Theme** - Built-in cosmic dark theme throughout
5. **Responsive** - Consistent spacing and sizing system
6. **Accessibility** - Proper contrast ratios and text shadows

## Best Practices

1. **Always use global styles first** - Check if a style exists before creating custom ones
2. **Combine styles with spread operator** - `{ ...globalStyles.card, customProperty: value }`
3. **Use color constants** - Never hardcode colors, use `COLORS.*`
4. **Leverage spacing system** - Use `SPACING.*` constants for consistent spacing
5. **Prefer composition** - Combine multiple small styles rather than creating monolithic ones
6. **Use meaningful names** - When creating custom styles, use descriptive names

## Contributing

When adding new global styles:

1. Add color constants to the appropriate section
2. Create reusable style objects in `globalStyles`
3. Add corresponding NativeWind classes to `theme.ts`
4. Update this README with usage examples
5. Test across multiple screens to ensure consistency 