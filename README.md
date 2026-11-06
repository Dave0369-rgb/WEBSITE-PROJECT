# Medds Nova

A personal portfolio website built with plain **HTML, CSS and JavaScript**. It introduces me, shows my background and skills, lists my projects, and includes a small academic planner and a contact form.

**Live site:** https://dave0369-rgb.github.io/WEBSITE-PROJECT/

## About the Author

**OLADOKUN DAVID OLUWASEUN**
B.Sc. Cybersecurity student at MIVA Open University (expected 2029), aspiring penetration tester.

## Pages

| Page | File | What it contains |
|------|------|------------------|
| Home | `index.html` | Hero section with call-to-action buttons, profile photo, skill chips and animated counters |
| About Me | `about.html` | Education, career aspirations, skills, hobbies and a motivational audio clip |
| Projects | `projects.html` | Project cards with technology tags |
| Academic Planner | `planner.html` | A to-do list for study tasks |
| Contact | `contact.html` | A message form with validation |

## Features

- **Responsive layout** with a collapsible menu on phones.
- **Hero section** with "View Projects" and "Get in Touch" buttons.
- **Animated counters** that count up when scrolled into view.
- **Academic Planner**: add tasks (button or Enter key), finish, undo or remove them. Tasks are saved in the browser with `localStorage`, and a counter shows progress.
- **Contact form validation**: checks that every field is filled, the email looks valid, and the phone number contains digits only.
- **Active page highlighting** in the menu, a footer on every page, and page descriptions for search engines.
- **Page fade-in animation** and a red-and-white theme.

## Technologies Used

- HTML5
- CSS3 (custom styles, animations, Google Fonts: Noto Sans JP)
- JavaScript (vanilla, no libraries or frameworks)

## Project Structure

```
WEBSITE-PROJECT/
├── index.html
├── about.html
├── projects.html
├── planner.html
├── contact.html
├── style.css
├── script.js
├── passport_photo.jpg
├── project-cyber.svg
├── project-portfolio.svg
└── README.md
```

## How to Run Locally

No installation or build step is needed.

1. Download or clone this repository.
2. Open `index.html` in any web browser.
3. Use the navigation bar to move between pages.

## Deployment

The site is hosted with **GitHub Pages**, deployed from the `main` branch (root folder).

## Known Limitations

- Planner tasks are saved only in the browser they were created in, so they do not sync between devices.
- The contact form is front-end only. It validates input and shows a success message, but it does not actually send the message anywhere.
- The audio clip and the Google font are loaded from external websites, so they need an internet connection.

## Possible Future Improvements

- Connect the contact form to a real email service.
- Replace the project banner graphics with real screenshots.
- Add links to live project pages.

## License

This project is for learning and personal portfolio use.# WEBSITE-PROJECT
Creating a website using html, java script,  and css styling
