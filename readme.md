# Ursaworks Website Documentation

This website is for the Robomaster team at Washington University in St. Louis and is maintained by team members. Below, you'll find information on how to update the website's content, including robots, events, and team members.

---

## Project Structure
Everything lives in `react-ursaworks/`. Run all `npm` commands from inside that folder.

- `react-ursaworks/src/content.json` – all of the site's text (mission, robots, events, team). Edit it directly.
- `react-ursaworks/src/assets/` – all of the site's images, one folder per category:
  - `about/`, `events/`, `members/`, `robots/` – images referenced by filename from `content.json`.
  - `blog/` – one folder per blog post, holding the Markdown file and its images.
  - `logoItems/` – icons and logos used by the site's layout.

There is no sync step: edit the files above, run `npm run dev`, and your changes show up immediately.

---

## Updating Website Content
### Adding a New Robot
1. **Add the Robot's Image**:
   - Place the image in `react-ursaworks/src/assets/robots/`.
2. **Update the JSON File**:
   - Open `react-ursaworks/src/content.json` and add a new entry to the `"robots"` array:
   ```json
   {
       "name": "newRobot",
       "description": "Description of the new robot's features and capabilities.",
       "image": "newRobotImage.png"
   }
   ```
3. **Preview and Deploy**:
   - Run `npm run dev` and check `localhost`.
   - Commit and push your changes (see [Deploying the Website](#deploying-the-website)).

### Editing a Robot
1. Open `react-ursaworks/src/content.json`, locate the robot in `"robots"`, and edit as needed.
2. Run `npm run dev` to preview.

### Deleting a Robot
1. Remove the robot's entry from `"robots"` in `react-ursaworks/src/content.json`.
2. Delete its image from `react-ursaworks/src/assets/robots/`.

---

## Managing Events
### Adding a New Event
1. **Add the Event Image**:
   - Place the image in `react-ursaworks/src/assets/events/`.
2. **Update the JSON File**:
   - Open `react-ursaworks/src/content.json` and add a new entry to `"events"`:
   ```json
   {
       "name": "Sample Event",
       "location": "City, State",
       "date": "MMM DD, YYYY",
       "image": "eventImage.png"
   }
   ```
3. **Preview and Deploy**:
   - Run `npm run dev`, check `localhost`, then commit and push.

### Editing or Deleting an Event
- **Editing**: Modify the event details in `react-ursaworks/src/content.json`.
- **Deleting**: Remove the event object and delete its image from `react-ursaworks/src/assets/events/`.

---

## Managing Team Members
### Adding a New Member
1. **Add Member Image**:
   - Place the image in `react-ursaworks/src/assets/members/`.
2. **Update the JSON File**:
   - Open `react-ursaworks/src/content.json` and add a new entry to `"team"`:
   ```json
   {
       "name": "Joe Smith",
       "position": "Team Lead",
       "image": "JoeSmithImage.png"
   }
   ```
3. **Preview and Deploy**:
   - Run `npm run dev`, check `localhost`, then commit and push.

### Editing or Deleting a Member
- **Editing**: Modify details in `react-ursaworks/src/content.json`.
- **Deleting**: Remove the entry and delete the image from `react-ursaworks/src/assets/members/`.

---

## Checking Your Changes
```bash
npm run dev            # dev server at http://localhost:3000
npm test -- --run      # includes a check that every image named in content.json exists
npm run build          # production build into build/
```

---

## Deploying the Website
Pushing to the `react-ursaworks` branch deploys the site automatically through GitHub Actions (`.github/workflows/deploy.yml`). Open a pull request, get it merged, and the live site updates.

To deploy manually instead, run `npm run deploy` from `react-ursaworks/`. It builds whatever is currently checked out and publishes it, so do this from an up-to-date `react-ursaworks` branch.

---

For any issues, refer to the project's GitHub issues page or contact a maintainer.
