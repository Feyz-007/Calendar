# Calendar Application

A responsive calendar built with **React**, **TailwindCSS**, and **date-fns** that displays scheduled events from a static JSON file. This application is designed for clarity, simplicity, and efficient scheduling — with support for monthly navigation, event visualization, and automatic highlighting of the current date.


## 🔗 Live Demo

👉 [View the Live App on Vercel](https://calendar-six-eta.vercel.app/)



## 🚀 Features

### 🗓️ Calendar Display
- Displays the **current month and year** by default.
- Dates are arranged in a **7-column grid**, aligned to days of the week.

### 🔄 Month Navigation
- Navigate between **previous and next months** using dedicated navigation buttons.
- The view updates seamlessly with retained event and layout styling.

### 📍 Current Date Highlight
- The **current date is visually emphasized** in the calendar for quick reference.

---

## 📌 Events Integration

### 📂 Static Event Source
- Events are loaded from a static JSON file located in the `public` folder (`/public/events.json`).
- Each event includes:
  - `title`
  - `date` (in `YYYY-MM-DD` format)
  - `startTime` and `endTime`
  - `color` (for event-specific styling)

### 📅 Event Display
- Events are displayed directly **within their corresponding date cells**.
- Each date lists all events scheduled for that day with distinct styling.

### ⚠️ Conflict Handling
- Supports **multiple events on the same date**:
  - Each event is **color-coded** for clarity.

---

## 🛠 Getting Started

### 1. Clone the Repository

```bash
https://github.com/Feyz-007/Calendar.git
cd Calendar
```
### 2. Install Dependencies

```bash
npm install
```
### 3. Run the App

```bash
npm run dev
```
### 4.Access the App

open your browser and go to:
```bash
http://localhost:5173
```


