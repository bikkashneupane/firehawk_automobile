## 🔗 Live Demo

Check out the project live here: [https://firehawkautomobile.web.app](https://firehawkautomobile.web.app)

# Automobile Data Management App

A simple automobile data management dashboard built using Angular 19, Firebase Firestore, and Bootstrap.
This application allows users to search, sort, paginate, download, and manage automobile data efficiently.

---

## Features

- View automobile dataset from Kaggle
- Search automobiles by name
- Sort automobiles by any column (ascending/descending)
- Pagination support for large datasets
- Add new automobiles to Firestore database
- Delete automobiles from Firestore
- Download visible data as a CSV file
- Filters and sort preferences are saved in localStorage

---

## Tech Stack

- Angular 19 (Standalone Components)
- Firebase Firestore (NoSQL DB)
- Bootstrap 5 (UI Styling)
- TypeScript

---

## How to Run

1. Clone this repo.
2. Run `npm install`.
3. Rename `environment.sample.ts` to `environment.ts` and update it with your Firebase config.
4. Run `ng serve`.

---

## Optional Improvements

_(Not implemented due to task scope, but recommended in production)_:

- User Authentication
- Role-based access control
- Edit automobile functionality
- Better error handling + UI notifications
- Mobile-friendly (currently not focused)
- Unit/Integration Testing

---

## Author

**[Biksh Neupane]**  
[www.bikashneupane.com](https://www.bikashneupane.com)  
[LinkedIn](https://www.linkedin.com/in/bikkashneupane/)

---

# Automobile Data Dashboard – User Manual

This is a guide to help you use the Automobile Data Dashboard, an Angular + Firebase app to view and manage automobile data.

## 1. Viewing Automobile Data

- On initial load, the full dataset is loaded from Firebase Firestore.
- Data is presented in a table format with columns such as Name, MPG, Cylinders, Horsepower, etc.
- Pagination allows easy navigation through large datasets.

## 2. Search and Sort

**Search**:

- Use the “Search by automobile name” input to find specific automobiles.
- The search is case-insensitive and applies to the name field only.

**Sort**:

- Use the dropdown to sort by any field (e.g., Name, MPG, Weight).
- Choose ascending or descending order.
- Search and sort preferences are saved automatically to localStorage and restored on reload.

## 3. Add a New Automobile

- Click "Add New Automobile" to display the form.
- Fill out all fields (name, mpg, cylinders, etc.). All fields are required.
- Click "Save Automobile" to store it in Firebase Firestore.
- On success, the table will automatically update.

## 4. Remove an Automobile

- Click the “Delete” button in the "Actions" column for an automobile.
- A confirmation will appear. On confirmation, the automobile will be removed from Firestore and UI.

## 5. Download as CSV

- Click the “Download CSV” button to download the current filtered + sorted automobile list.
- Only rows that match the search and sort are downloaded — not just the visible page.

## 6. Pagination

- Pagination is used for better performance and UX on large datasets (300+ records).
- Navigate using previous/next buttons at the bottom of the table.

---

## Known Limitations

- Edit functionality is not available.
- No user login or access control (intentionally skipped per task scope).
- Not Mobile-friendly
