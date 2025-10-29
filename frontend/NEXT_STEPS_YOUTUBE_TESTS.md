# YouTubePlayer Advanced Tests - Next Steps

**Created**: 2025-10-29
**Status**: Basic tests complete (4 passing), advanced tests pending
**File**: `src/app/components/media/YouTubePlayer.test.tsx`

---

## ✅ What's Done

You have **4 basic tests passing**:
1. ✅ Renders all child components
2. ✅ Shows loading state when no lesson
3. ✅ Hides loop controls initially
4. ✅ Unmounts cleanly without errors

**What you learned:**
- How to mock external libraries (`react-youtube`)
- How to mock child components for focused testing
- Avoid `any` types - use proper TypeScript interfaces
- Test what actually happens, not assumptions

---

## 🎯 What's Next (When You're Home with Focus Time)

You need to add **3 advanced test scenarios**:

### 1. Test Segment Looping Logic
**What to test:**
- When user clicks "Set Start", startTime updates
- When user clicks "Set End", endTime updates
- When both are set, loop controls appear
- When loop is active, video seeks back to start when end is reached

**Complexity:** Needs `vi.useFakeTimers()` and mocking YouTube player callbacks

---

### 2. Test Time Tracking with Intervals
**What to test:**
- `onPlayerReady` starts an interval that updates currentTime
- Interval runs every 100ms
- Interval is cleaned up on unmount

**Complexity:** Needs `vi.advanceTimersByTime()` to simulate time passing

---

### 3. Test Button Interactions
**What to test:**
- Clicking "Set Start" button calls `updateStartAtCurrentTime`
- Clicking "Set End" button calls `updateEndAtCurrentTime`
- Clicking "Start Loop" button toggles loop on
- Clicking "Clear" button resets start/end/loop

**Complexity:** Needs `@testing-library/user-event` library (may need to install)

---

## 📚 Resources for Advanced Tests

### Vitest Fake Timers
```typescript
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllTimers();
  vi.restoreAllMocks();
});

// In test
vi.advanceTimersByTime(100); // Fast-forward 100ms
```

**Docs**: https://vitest.dev/guide/mocking.html#timers

---

### Mocking YouTube Player Callbacks

You'll need to capture and trigger `onReady` and `onStateChange`:

```typescript
// At top of file
let mockOnReady: any = null;
let mockOnStateChange: any = null;

vi.mock("react-youtube", () => ({
  default: ({ onReady, onStateChange }: any) => {
    // Capture callbacks so we can call them in tests
    mockOnReady = onReady;
    mockOnStateChange = onStateChange;
    return <div data-testid="youtube-player">YouTube Player Mock</div>;
  },
}));

// In test
it("starts interval when player is ready", () => {
  render(<YouTubePlayer selectedLesson={mockLesson} />);

  // Create fake YouTube player
  const mockPlayer = {
    getCurrentTime: vi.fn(() => 5),
    seekTo: vi.fn(),
    pauseVideo: vi.fn(),
  };

  // Trigger onReady
  mockOnReady({ target: mockPlayer });

  // Assert interval started
  vi.advanceTimersByTime(100);
  expect(mockPlayer.getCurrentTime).toHaveBeenCalled();
});
```

---

### User Event for Button Clicks

**Install** (if not already):
```bash
npm install --save-dev @testing-library/user-event
```

**Usage**:
```typescript
import userEvent from "@testing-library/user-event";

it("updates start time when Set Start button clicked", async () => {
  const user = userEvent.setup({ delay: null });
  render(<YouTubePlayer selectedLesson={mockLesson} />);

  const setStartButton = screen.getByText("Set Start");
  await user.click(setStartButton);

  // Assert startTime updated
  expect(screen.getByText(/Set Start \(0:05\)/)).toBeInTheDocument();
});
```

**Docs**: https://testing-library.com/docs/user-event/intro/

---

## 🎓 Teaching Approach (When Claude Helps You)

Ask Claude to:
1. **Explain the concept** (fake timers, mocking callbacks)
2. **Show a simple example** (one test at a time)
3. **Let you write it** (you type, Claude guides)
4. **Debug together** (when tests fail, understand why)

Don't rush - these are advanced concepts. Take your time!

---

## ⏱️ Time Estimate

- **Test 1 (Segment looping)**: 45-60 min
- **Test 2 (Intervals)**: 30-45 min
- **Test 3 (Button clicks)**: 30-45 min

**Total**: 2-2.5 hours of focused time

---

## ✅ Success Criteria

When you're done, you'll have:
- [ ] 7-10 total YouTubePlayer tests passing
- [ ] Interval mocking working (fake timers)
- [ ] User interactions tested (button clicks)
- [ ] Understanding of advanced mocking patterns

**Then**: Merge PR, move on to LoginForm tests or error boundaries!

---

**You got this!** Take your time, and remember: the advanced tests build on what you already learned. It's the same patterns, just with more moving parts. 🚀
