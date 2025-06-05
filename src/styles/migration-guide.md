# Migration Guide: Converting to Global Styles

This guide shows how to convert existing screens from individual StyleSheet objects to the new global styles system.

## Completed Migrations

✅ **DashboardScreen** - Fully migrated to global styles
✅ **WelcomeScreen** - Fully migrated to global styles  
✅ **GoalsScreen** - Fully migrated to global styles

## Quick Migration Steps

### Step 1: Add Global Styles Import

```typescript
// Add this import at the top of your file
import { globalStyles, GRADIENTS, COLORS } from '../styles/globalStyles';
```

### Step 2: Remove StyleSheet Import and Usage

```typescript
// Remove this
import { StyleSheet } from 'react-native';

// Remove the entire StyleSheet.create({ ... }) section at the bottom
```

### Step 3: Common Style Replacements

| Old StyleSheet | New Global Style |
|----------------|------------------|
| `styles.container` | `globalStyles.container` |
| `styles.title` | `globalStyles.title` |
| `styles.subtitle` | `globalStyles.subtitle` |
| Custom text styles | `globalStyles.bodyText`, `globalStyles.caption` |
| Flex containers | `globalStyles.row`, `globalStyles.center` |
| Card containers | `globalStyles.card`, `globalStyles.cardGlass` |
| Input fields | `globalStyles.input` |
| Input labels | `globalStyles.inputLabel` |

### Step 4: Gradient Color Updates

```typescript
// Old
colors={['#8b5cf6', '#6366f1', '#1e293b']}

// New  
colors={GRADIENTS.cosmic as any}
```

### Step 5: Color Constants

```typescript
// Old hardcoded colors
color: '#FFFFFF'
color: '#CBD5E1'
backgroundColor: '#334155'

// New color constants
color: COLORS.text.primary
color: COLORS.text.muted  
backgroundColor: COLORS.background.secondary
```

### Step 6: Combining Styles

```typescript
// Use spread operator to combine styles
style={{ ...globalStyles.title, fontSize: 28 }}
style={{ ...globalStyles.card, ...globalStyles.mt_lg }}
```

## Remaining Screens to Migrate

### PeerSupportScreen
Location: `src/screens/onboarding/PeerSupportScreen.tsx`

**Current pattern:**
```typescript
const styles = StyleSheet.create({
  container: { flex: 1 },
  // ... other styles
});
```

**Migration steps:**
1. Add global styles import
2. Replace `styles.container` with `globalStyles.container`
3. Replace text styles with global equivalents
4. Update gradients to use `GRADIENTS.cosmicReverse`
5. Remove StyleSheet.create section

### Component Files to Consider

If you find StyleSheet usage in these files, consider migrating:

- `src/components/UI/Button.tsx` - May already use global patterns
- `src/components/UI/Card.tsx` - May already use global patterns  
- `src/components/UI/HabitCard.tsx` - May already use global patterns
- Custom components in other directories

## Benefits After Migration

1. **Reduced File Size** - No more large StyleSheet.create blocks
2. **Consistency** - All screens use the same cosmic color palette
3. **Maintainability** - Change colors globally in one place
4. **Performance** - Reuse pre-created style objects
5. **Developer Experience** - IntelliSense for available styles

## Common Patterns After Migration

### Screen Container
```typescript
<View style={globalStyles.container}>
  <SafeAreaView style={globalStyles.safeArea}>
    <ScrollView style={globalStyles.content}>
```

### Headers with Gradient
```typescript
<LinearGradient 
  colors={GRADIENTS.cosmic as any} 
  style={globalStyles.headerGradient}
>
```

### Form Inputs
```typescript
<Text style={globalStyles.inputLabel}>Label</Text>
<TextInput 
  style={globalStyles.input}
  placeholderTextColor={COLORS.text.disabled}
/>
```

### Spacing
```typescript
// Instead of marginBottom: 16
style={globalStyles.mb_md}

// Instead of custom padding
style={globalStyles.p_lg}
```

## Validation Checklist

After migrating a screen, verify:

- [ ] No import of StyleSheet
- [ ] No StyleSheet.create() calls
- [ ] All colors use COLORS constants
- [ ] Gradients use GRADIENTS constants  
- [ ] Text uses global text styles
- [ ] Containers use global layout styles
- [ ] Spacing uses global spacing utilities
- [ ] File size reduced significantly
- [ ] App still renders correctly
- [ ] No TypeScript errors

## Need Help?

If you encounter issues during migration:

1. Check the `globalStyles.ts` file for available styles
2. Refer to the completed migrations in DashboardScreen, WelcomeScreen, GoalsScreen
3. Use the style combination patterns shown in examples
4. Ensure you're using the spread operator correctly for style merging 