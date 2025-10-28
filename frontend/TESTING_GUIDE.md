# Testing Guide - What We Learned Today

**Date**: 2025-10-27
**Your First Tests**: RecorderVoiceRecorder component

---

## 🎓 TESTING 101 - Concepts You Learned

### **What is Testing?**

Testing = Writing code that checks if your code works correctly.

Think of it like having a robot that:
- Clicks buttons
- Types in forms
- Checks if the right things appear on screen
- Screams if something breaks

---

## 📚 KEY CONCEPTS

### **1. Test Structure (AAA Pattern)**

Every test follows this pattern:

```typescript
it('test description', () => {
  // ARRANGE - Set up the test
  render(<Component />);

  // ACT - Do something (click, type, etc.)
  fireEvent.click(button);

  // ASSERT - Check if it worked
  expect(something).toBeInTheDocument();
});
```

### **2. describe() and it()**

```typescript
describe('ComponentName', () => {
  // Groups related tests together

  it('does something specific', () => {
    // One test case
  });

  it('does another thing', () => {
    // Another test case
  });
});
```

### **3. render() - Put Component on Fake Page**

```typescript
import { render } from '@testing-library/react';

render(<MyComponent />);
// Now the component is on a fake page, ready to test
```

### **4. screen - Look at What's on the Page**

```typescript
import { screen } from '@testing-library/react';

// Find by text
const button = screen.getByText('Start Recording');

// Find by role (button, heading, etc.)
const button = screen.getByRole('button', { name: /start/i });

// Query (doesn't throw error if not found)
const element = screen.queryByText('Not there');
expect(element).toBeNull(); // or .not.toBeInTheDocument()
```

### **5. expect() - Check Things**

```typescript
// Check element exists
expect(element).toBeInTheDocument();

// Check element does NOT exist
expect(element).not.toBeInTheDocument();

// Check text content
expect(element).toHaveTextContent('Hello');

// Check if it's null
expect(element).toBeNull();
```

---

## 🎭 MOCKING - Creating Fake Versions

### **Why Mock?**

Tests run in isolation. No real:
- Next.js router
- API calls
- Database
- Browser APIs

So we create FAKE versions!

### **Mock Next.js Router**

```typescript
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),        // Fake push function
    replace: vi.fn(),     // Fake replace function
    pathname: '/',        // Fake current path
    query: {},            // Fake query params
  }),
}));
```

**Translation**: "When code calls `useRouter()`, give it this fake router instead of the real one"

### **Mock Context**

```typescript
vi.mock('../../AppContext', () => ({
  useAppContext: () => ({
    openAlertDialog: vi.fn(),
    token: 'fake-token',
    updateToken: vi.fn(),
  }),
}));
```

---

## 🧹 CLEANUP - Prevent Tests from Affecting Each Other

```typescript
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

describe('Component', () => {
  afterEach(() => {
    cleanup();
  });

  // tests here
});
```

**Why**: If test 1 renders a component, cleanup removes it before test 2 runs.

---

## 🛠️ SETUP FILES

### **test-setup.ts** - Runs Before All Tests

```typescript
import '@testing-library/jest-dom/vitest';
```

This adds helpful matchers like `.toBeInTheDocument()`

### **vitest.config.mts** - Tell Vitest to Use Setup File

```typescript
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",              // Simulates browser
    setupFiles: ["./src/test-setup.ts"], // Run this first
  },
});
```

---

## 📦 LIBRARIES WE USE

### **Vitest** - Test Runner

- Runs your tests
- Shows pass/fail
- Command: `npm run test`

### **@testing-library/react** - Test React Components

- `render()` - Put component on page
- `screen` - Find elements
- `fireEvent` - Click, type, etc. (you'll learn this next!)

### **@testing-library/jest-dom** - Extra Matchers

- `.toBeInTheDocument()`
- `.toHaveTextContent()`
- `.toBeVisible()`

---

## 🧪 YOUR FIRST TEST FILE EXPLAINED

### **File: RecorderVoiceRecorder.test.tsx**

```typescript
// 1. Import utilities
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';

// 2. Import component to test
import RecorderVoiceRecorder from './RecorderVoiceRecorder';
import RecorderPanelContextProvider from '@/app/RecorderpanelContext';

// 3. Mock Next.js (no real router in tests)
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    pathname: '/',
    query: {},
  }),
}));

// 4. Mock AppContext (no real context in tests)
vi.mock('../../AppContext', () => ({
  useAppContext: () => ({
    openAlertDialog: vi.fn(),
    token: 'fake-token',
  }),
}));

// 5. Create fake data for tests
const mockLesson = {
  id: '1',
  title: 'Test Lesson',
  status: 'pending' as const,
  // ... other required fields
};

// 6. Write tests
describe('RecorderVoiceRecorder', () => {
  // Clean up after each test
  afterEach(() => {
    cleanup();
  });

  it('shows "Start Recording" button when not recording', () => {
    // ARRANGE: Render with context provider
    render(
      <RecorderPanelContextProvider selectedLesson={mockLesson}>
        <RecorderVoiceRecorder />
      </RecorderPanelContextProvider>
    );

    // ASSERT: Check button exists
    const startButton = screen.getByText('Start Recording');
    expect(startButton).toBeInTheDocument();
  });
});
```

---

## 🚀 WHAT'S NEXT (When You Come Back)

### **Test User Interactions**

Learn how to test:
- Clicking buttons
- Typing in inputs
- State changes after actions

**Example:**
```typescript
import { fireEvent } from '@testing-library/react';

it('changes text when button is clicked', () => {
  render(<Component />);

  const button = screen.getByText('Click me');
  fireEvent.click(button); // ← Click the button!

  expect(screen.getByText('Clicked!')).toBeInTheDocument();
});
```

---

## 🎯 TESTING BEST PRACTICES

### **DO:**
✅ Test user behavior (what users see/do)
✅ Test one thing per test
✅ Use descriptive test names
✅ Clean up after each test
✅ Mock external dependencies

### **DON'T:**
❌ Test implementation details (internal state)
❌ Test library code (React, Next.js already tested)
❌ Write tests that depend on each other
❌ Skip cleanup

---

## 🐛 COMMON ERRORS & FIXES

### **Error: "Invalid Chai property: toBeInTheDocument"**
**Fix**: Install `@testing-library/jest-dom` and import in setup file

### **Error: "Found multiple elements"**
**Fix**: Add `afterEach(() => cleanup())` in describe block

### **Error: "invariant expected app router to be mounted"**
**Fix**: Mock `next/navigation` with `vi.mock()`

### **Error: "useContext must be used within Provider"**
**Fix**: Wrap component in Context Provider when rendering

---

## 📝 CHEAT SHEET

### **Running Tests**
```bash
npm run test                    # Run all tests
npm run test ComponentName      # Run specific test file
npm run test -- --coverage      # Run with coverage report
```

### **Common Queries**
```typescript
screen.getByText('text')           // Throws if not found
screen.queryByText('text')         // Returns null if not found
screen.findByText('text')          // Async, waits for element
screen.getByRole('button')         // Find by semantic role
screen.getByLabelText('label')     // Find input by label
```

### **Common Matchers**
```typescript
expect(element).toBeInTheDocument()
expect(element).not.toBeInTheDocument()
expect(element).toHaveTextContent('text')
expect(element).toBeVisible()
expect(element).toBeDisabled()
```

---

## 🎉 WHAT YOU ACCOMPLISHED TODAY

- ✅ Wrote 3 passing tests
- ✅ Learned test structure (AAA pattern)
- ✅ Learned mocking (router, context)
- ✅ Set up testing environment
- ✅ Fixed common testing errors

**You're now a tester! Next: Test user interactions (clicking, typing)** 🚀

---

**Study this guide, then come back ready to test button clicks!** 💪
