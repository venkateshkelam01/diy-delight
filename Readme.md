# WEB103 Project 4 - *Bolt Bucket ⚡️*

Submitted by: **Venkatesh Kelam**

About this web app:  
**Bolt Bucket** is a full-stack car customization web application where users can design their own dream sports car.  
It allows users to configure multiple features such as **exterior colors**, **roof types**, **wheels**, and **interior themes** — all with live previews, dynamic pricing, and database persistence.  
Each selection instantly updates the car preview and the total cost, making it a sleek, interactive configurator.  
The app uses **React (Vite)** for the frontend, **Node.js + Express** for the backend, and **PostgreSQL** (hosted on **Render**) as the database.  
It also features a visually engaging design with a race-car hero background and transparent glass-style UI.

Time spent: **22 hours**

---

## ✅ Required Features

The following **required** functionality is completed:

- [x] **The web app uses React to display data from the API.**
- [x] **The web app is connected to a PostgreSQL database, with a properly structured `CustomItem` table.**
  - [x] Walkthrough includes a view of Render dashboard showing active PostgreSQL instance.
  - [x] Demonstration of table contents using `SELECT * FROM custom_items;`.
- [x] **Users can view multiple customizable features (e.g., exterior, roof, wheels, interior).**
- [x] **Each feature offers multiple options (color, finish, texture, etc.)**
- [x] **Selecting options dynamically updates the preview (color and components).**
- [x] **Price dynamically updates based on selections and total is displayed.**
- [x] **Visual interface updates immediately when features change.**
- [x] **Users can submit their selections to save a custom car configuration.**
- [x] **Invalid/incompatible combinations trigger an error message and prevent saving.**
- [x] **Users can view all saved `CustomItem`s.**
- [x] **Users can edit existing `CustomItem`s from the list view.**
- [x] **Users can delete existing `CustomItem`s from the list view.**
- [x] **Users can update or delete `CustomItem`s from the detail page.**

---

## 🧩 Optional Features

- [x] Selecting particular options automatically prevents incompatible options from being selected.
- [x] Transparent glass-like UI over a real car background.
- [x] Dynamic preview with real Unsplash photos and color swatches.
- [x] Dynamic seed and compatibility logic handled via SQL relationships.

---

## 🚀 Additional Features Implemented

- [x] Race-car themed hero page with blurred-glass layout.
- [x] Smooth dynamic price computation across multiple options.
- [x] `ON CONFLICT DO NOTHING` and SQL upsert handling to prevent duplication during DB reset.
- [x] Render-ready backend with `.env` PostgreSQL configuration.
- [x] Organized folder structure with full separation of concerns:


## Video Walkthrough

Here's a walkthrough of implemented required features:

<img src='https://www.loom.com/share/5198c4e8f40a47429e1045566011da1c.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />



## Notes

Describe any challenges encountered while building the app or any additional context you'd like to add.

## License

Copyright [2025] [Venkatesh Kelam]

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.