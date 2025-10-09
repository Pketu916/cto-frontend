# Style Guide

## Overview

This style guide defines the design system for the CTO India project, including colors, typography, spacing, and component styles.

## Colors

### Primary Colors

- **Primary**: `#012939` - Dark teal/navy blue used for main text and primary elements
- **Secondary**: `#a0f92d` - Bright lime green used for accents and secondary actions
- **White**: `#ffffff` - Pure white for backgrounds and contrast

### Color Usage

- **Primary (#012939)**: Headings, body text, primary buttons, navigation
- **Secondary (#a0f92d)**: Call-to-action buttons, highlights, accents
- **White (#ffffff)**: Backgrounds, text on dark backgrounds, card backgrounds

## Typography

### Font Family

- **Primary Font**: Inter (Google Fonts)
- **Fallback**: sans-serif

### Font Sizes & Weights

#### Headings

- **H1**: 2.5rem (40px) / Bold (700) / Line-height: 1.2
- **H2**: 2rem (32px) / Semibold (600) / Line-height: 1.25
- **H3**: 1.75rem (28px) / Semibold (600) / Line-height: 1.3
- **H4**: 1.5rem (24px) / Medium (500) / Line-height: 1.35
- **H5**: 1.25rem (20px) / Medium (500) / Line-height: 1.4
- **H6**: 1.125rem (18px) / Medium (500) / Line-height: 1.45

#### Body Text

- **Paragraph**: 0.9375rem (15px) / Normal (400) / Line-height: 1.6
- **Base Font Size**: 0.9375rem (15px)

### Typography Classes

#### CSS Classes

```css
/* Headings */
h1,
h2,
h3,
h4,
h5,
h6 {
  color: var(--color-primary);
  font-family: var(--font-family-primary);
}

/* Paragraphs */
p {
  font-size: var(--font-size-paragraph);
  line-height: var(--line-height-paragraph);
  color: var(--color-primary);
}
```

#### Tailwind Classes

```html
<!-- Headings -->
<h1 class="text-4xl font-bold text-primary">Heading 1</h1>
<h2 class="text-3xl font-semibold text-primary">Heading 2</h2>
<h3 class="text-2xl font-semibold text-primary">Heading 3</h3>
<h4 class="text-xl font-medium text-primary">Heading 4</h4>
<h5 class="text-lg font-medium text-primary">Heading 5</h5>
<h6 class="text-base font-medium text-primary">Heading 6</h6>

<!-- Paragraphs -->
<p class="text-base text-primary">Paragraph text</p>
```

## Layout

### Container

- **Max Width**: 1320px
- **Responsive**: Full width on mobile, centered on larger screens
- **Padding**: 1rem (16px) on left and right

#### CSS Class

```css
.container {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 1rem;
}
```

#### Tailwind Class

```html
<div class="max-w-container mx-auto px-4">Content</div>
```

## Buttons

### Button Styles

#### Primary Button

- **Background**: Primary color (#012939)
- **Text**: White
- **Hover**: Darker shade with subtle lift effect

```html
<button class="btn btn-primary">Primary Button</button>
```

#### Secondary Button

- **Background**: Secondary color (#a0f92d)
- **Text**: Primary color (#012939)
- **Hover**: Lighter shade with subtle lift effect

```html
<button class="btn btn-secondary">Secondary Button</button>
```

#### Outline Buttons

- **Primary Outline**: Transparent background with primary border
- **Secondary Outline**: Transparent background with secondary border

```html
<button class="btn btn-outline-primary">Primary Outline</button>
<button class="btn btn-outline-secondary">Secondary Outline</button>
```

### Button Specifications

- **Font**: Inter, 0.9375rem (15px)
- **Weight**: Medium (500)
- **Padding**: 0.75rem 1.5rem (12px 24px)
- **Border Radius**: 0.375rem (6px)
- **Transition**: All properties, 0.2s ease-in-out

## CSS Custom Properties

All design tokens are available as CSS custom properties:

```css
:root {
  /* Colors */
  --color-primary: #012939;
  --color-secondary: #a0f92d;
  --color-white: #ffffff;

  /* Typography */
  --font-family-primary: "Inter", sans-serif;
  --font-size-base: 0.9375rem;
  --line-height-base: 1.6;

  /* Layout */
  --container-max-width: 1320px;

  /* Typography Scale */
  --font-size-h1: 2.5rem;
  --font-size-h2: 2rem;
  --font-size-h3: 1.75rem;
  --font-size-h4: 1.5rem;
  --font-size-h5: 1.25rem;
  --font-size-h6: 1.125rem;
  --font-size-paragraph: 0.9375rem;

  /* Line Heights */
  --line-height-h1: 1.2;
  --line-height-h2: 1.25;
  --line-height-h3: 1.3;
  --line-height-h4: 1.35;
  --line-height-h5: 1.4;
  --line-height-h6: 1.45;
  --line-height-paragraph: 1.6;

  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;
}
```

## Tailwind Configuration

The Tailwind configuration has been extended with custom values:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#012939',
      secondary: '#a0f92d',
      white: '#ffffff',
    },
    fontFamily: {
      'inter': ['Inter', 'sans-serif'],
    },
    fontSize: {
      'base': '0.9375rem',
    },
    lineHeight: {
      'base': '1.6',
    },
    maxWidth: {
      'container': '1320px',
    },
    spacing: {
      'container': '1320px',
    }
  },
}
```

## Usage Examples

### Basic Page Structure

```html
<div class="container">
  <h1>Page Title</h1>
  <p>This is a paragraph with the base styling applied.</p>
  <button class="btn btn-primary">Call to Action</button>
  <button class="btn btn-secondary">Secondary Action</button>
</div>
```

### Typography Hierarchy

```html
<div class="container">
  <h1>Main Heading</h1>
  <h2>Section Heading</h2>
  <h3>Subsection Heading</h3>
  <p>Body text that follows the established typography scale.</p>
  <h4>Smaller Heading</h4>
  <p>More body text with consistent spacing and styling.</p>
</div>
```

## Implementation Notes

1. **Font Loading**: Inter font is loaded via Google Fonts CDN
2. **Responsive Design**: Container adapts to screen size with appropriate padding
3. **Accessibility**: All color combinations meet WCAG contrast requirements
4. **Consistency**: All components use the same design tokens for consistency
5. **Maintainability**: CSS custom properties make it easy to update the design system

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Custom Properties support required
- Google Fonts CDN for Inter font family
